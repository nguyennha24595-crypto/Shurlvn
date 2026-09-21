import { deleteLinkKV, listAllLinks } from "./kv/links.js";
import { json } from "./utils/http.js";

// Scheduled (cron) maintenance: expired-link purge + Cloudflare analytics cache refresh.

export async function purgeExpiredLinksLogged(env) {
  const ranAt = new Date().toISOString();
  try {
    const result = await purgeExpiredLinks(env);
    await env.LINKS_KV.put("cron_purge_log", JSON.stringify({ ok: true, ranAt, checked: result.checked, purged: result.purged }));
  } catch (e) {
    await env.LINKS_KV.put("cron_purge_log", JSON.stringify({ ok: false, ranAt, error: String(e && e.message || e) }));
  }
}

export async function purgeExpiredLinks(env) {
  const trashCutoffMs = Date.now() - 24 * 3600 * 1000;
  // Links a user set an expiry date on (not the trash) keep working as normal links until they
  // expire, then just stop redirecting (410) so the owner can still edit/revive them for a while.
  // Only after this much longer grace period do we reclaim the KV storage for good.
  const expiryCutoffMs = Date.now() - 30 * 24 * 3600 * 1000;
  const links = await listAllLinks(env);
  let purged = 0;
  for (const link of links) {
    const trashExpired = link.isDeleted && link.deletedAt && new Date(link.deletedAt).getTime() < trashCutoffMs;
    const longExpired = !link.isDeleted && link.expiryDate && new Date(link.expiryDate).getTime() < expiryCutoffMs;
    if (trashExpired || longExpired) {
      await deleteLinkKV(env, link.code);
      purged++;
    }
  }
  return { ok: true, checked: links.length, purged };
}

export async function refreshCfAnalyticsCache(env) {
  if (!env.CF_ANALYTICS_TOKEN || !env.CF_ACCOUNT_ID) {
    return { ok: false, error: "Thiếu CF_ANALYTICS_TOKEN hoặc CF_ACCOUNT_ID." };
  }
  try {
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 3600000);
    // Requests/errors "hôm nay" chỉ tính từ 0h UTC hôm nay (bộ đếm thật sự reset mỗi ngày,
    // khớp với chu kỳ reset hạn mức Workers của Cloudflare) — tách riêng khỏi cửa sổ 24h
    // trượt bên trên, cửa sổ đó chỉ dùng để vẽ biểu đồ 24h cho đầy đủ dữ liệu.
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const query = "query WorkerStats($accountTag: string!, $scriptName: string!, $start: Time!, $end: Time!) {" +
      " viewer { accounts(filter: { accountTag: $accountTag }) {" +
      " workersInvocationsAdaptive(filter: { scriptName: $scriptName, datetimeHour_geq: $start, datetimeHour_leq: $end }, limit: 100, orderBy: [datetimeHour_ASC]) {" +
      " dimensions { datetimeHour } sum { requests errors } quantiles { cpuTimeP90 } } } } }";
    const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env.CF_ANALYTICS_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { accountTag: env.CF_ACCOUNT_ID, scriptName: "shorturl", start: start.toISOString(), end: now.toISOString() }
      })
    });
    const data = await res.json();
    if (data.errors && data.errors.length) {
      await env.LINKS_KV.put("cf_analytics_debug", JSON.stringify(data.errors), { expirationTtl: 86400 });
      return { ok: false, error: data.errors[0].message || "GraphQL error", raw: data.errors };
    }
    const accounts = data.data && data.data.viewer && data.data.viewer.accounts;
    const groups = (accounts && accounts[0] && accounts[0].workersInvocationsAdaptive) || [];
    let todayRequests = 0, todayErrors = 0;
    let lastCpuP90 = null;
    const hourly = groups.map(function(g){
      const req = (g.sum && g.sum.requests) || 0;
      const err = (g.sum && g.sum.errors) || 0;
      if (new Date(g.dimensions.datetimeHour) >= todayStart) { todayRequests += req; todayErrors += err; }
      if (g.quantiles && g.quantiles.cpuTimeP90 != null) lastCpuP90 = g.quantiles.cpuTimeP90;
      return { hour: g.dimensions.datetimeHour, requests: req, errors: err };
    });
    const cache = {
      todayRequests: todayRequests, todayErrors: todayErrors, cpuP90: lastCpuP90,
      planName: "Free Plan", planLimit: 100000, hourly: hourly,
      updatedAt: new Date().toISOString()
    };
    await env.LINKS_KV.put("cf_analytics_cache", JSON.stringify(cache), { expirationTtl: 7200 });
    return { ok: true, cache: cache };
  } catch (e) {
    const msg = (e && e.message) ? e.message : String(e);
    try { await env.LINKS_KV.put("cf_analytics_debug", msg, { expirationTtl: 86400 }); } catch (e2) {}
    return { ok: false, error: msg };
  }
}

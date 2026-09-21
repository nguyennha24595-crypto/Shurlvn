import { createLinkInternal } from "./links.js";
import { getTeam, isUserInSameTeam } from "./teams.js";
import { computeLinkAnalytics, getClicks } from "../kv/clicks.js";
import { getLink, listAllLinks, shortUrlFor } from "../kv/links.js";
import { listReports } from "../kv/reports.js";
import { getUser, listAllUsers } from "../kv/users.js";
import { getAuthenticatedUser, requireAuthResponse } from "../utils/auth.js";
import { json } from "../utils/http.js";
import { checkMonthlyApiQuota, incrementMonthlyApiQuota } from "../utils/quota.js";

// Analytics + public REST API v1 (shorten/list/analytics via API token).

export async function handleGetLinkAnalytics(request, env, code, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const link = await getLink(env, code);
  if (!link) return json({ error: "Không tìm thấy link" }, 404, corsHeaders);
  if (authedUser.role !== "admin" && link.owner.toLowerCase() !== authedUser.username.toLowerCase()) {
    const inTeam = authedUser.teamId ? await isUserInSameTeam(env, authedUser.username, link.owner) : false;
    if (!inTeam) return json({ error: "Không có quyền truy cập thống kê link này" }, 403, corsHeaders);
  }

  const clicks = await getClicks(env, code);
  const analytics = computeLinkAnalytics(link, clicks);
  return json({ ok: true, analytics }, 200, corsHeaders);
}

export async function handleAnalyticsOverview(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const totalUserClicks = userLinks.reduce((sum, l) => sum + (l.totalClicks || 0), 0);

  let global;
  if (authedUser.role === "admin") {
    const allUsers = await listAllUsers(env);
    const reports = await listReports(env);
    global = {
      totalLinks: allLinks.length,
      totalUsers: allUsers.length,
      totalClicks: allLinks.reduce((sum, l) => sum + (l.totalClicks || 0), 0),
      pendingReports: reports.filter(r => r.status === "pending").length
    };
  }

  return json({ ok: true, stats: { userLinksCount: userLinks.length, userTotalClicks: totalUserClicks, global } }, 200, corsHeaders);
}

export async function handleApiShorten(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized. Provide valid Bearer token or x-api-key" }, 401, corsHeaders);

  const role = authedUser.role;
  const owner = authedUser.username;
  const userRecord = await getUser(env, owner);

  const quotaCheck = await checkMonthlyApiQuota(env, userRecord, role);
  if (!quotaCheck.ok) {
    return json({ success: false, error: { code: quotaCheck.code || "API_ERROR", message: quotaCheck.message, upgrade_url: quotaCheck.upgradeUrl || "#/pricing" }, ...(quotaCheck.retryAt ? { retry_after: quotaCheck.retryAt } : {}) }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { url: targetUrl, custom_alias, title, campaign, tags, expiry_date } = body || {};
  if (!targetUrl) {
    return json({ success: false, error: 'Missing required parameter "url"' }, 400, corsHeaders);
  }

  try {
    const link = await createLinkInternal(env, {
      url: targetUrl, owner, role, customCode: custom_alias, title, campaign, tags, expiryDate: expiry_date
    });
    await incrementMonthlyApiQuota(env, owner);
    return json({
      success: true, code: link.code, short_url: shortUrlFor(url, link.code, link.customDomain),
      destination: link.url, title: link.title, campaign: link.campaign,
      created_at: link.createdAt, expires_at: link.expiryDate
    }, 200, corsHeaders);
  } catch (e) {
    return json({ success: false, error: e.message }, 400, corsHeaders);
  }
}

export async function handleApiListLinks(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized. Provide valid Bearer token or x-api-key" }, 401, corsHeaders);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const data = userLinks.map(l => ({
    code: l.code, short_url: shortUrlFor(url, l.code, l.customDomain), destination: l.url, title: l.title,
    total_clicks: l.totalClicks, is_enabled: l.isEnabled, created_at: l.createdAt, expires_at: l.expiryDate
  }));
  return json({ success: true, count: data.length, data }, 200, corsHeaders);
}

export async function handleApiAnalytics(request, env, code, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized. Provide valid Bearer token or x-api-key" }, 401, corsHeaders);

  const link = await getLink(env, code);
  if (!link) return json({ success: false, error: "Link not found" }, 404, corsHeaders);
  if (authedUser.role !== "admin" && link.owner.toLowerCase() !== authedUser.username.toLowerCase()) {
    return json({ success: false, error: "Permission denied" }, 403, corsHeaders);
  }

  const clicks = await getClicks(env, code);
  const analytics = computeLinkAnalytics(link, clicks);
  return json({ success: true, data: analytics }, 200, corsHeaders);
}

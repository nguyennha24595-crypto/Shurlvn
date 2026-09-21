// KV: admin audit log (append-only, capped at 500 entries via an index list).

import { randomHex } from "../utils/crypto.js";
import { getClientIp } from "../utils/http.js";

export async function addAuditLog(env, adminUser, action, details, request) {
  try {
    const id = "audit_" + Date.now() + "_" + randomHex(4);
    const entry = { id, admin: adminUser.username, action, details: details || {}, ip: request ? getClientIp(request) : null, timestamp: new Date().toISOString() };
    await env.LINKS_KV.put(id, JSON.stringify(entry));
    const indexRaw = await env.LINKS_KV.get("audit_index");
    let index = indexRaw ? JSON.parse(indexRaw) : [];
    index.unshift(id);
    index = index.slice(0, 500);
    await env.LINKS_KV.put("audit_index", JSON.stringify(index));
  } catch (e) { console.error("addAuditLog failed:", e); }
}

export async function listAuditLogs(env, limit) {
  const indexRaw = await env.LINKS_KV.get("audit_index");
  if (!indexRaw) return [];
  const index = JSON.parse(indexRaw);
  const ids = index.slice(0, limit || 100);
  const entries = await Promise.all(ids.map(id => env.LINKS_KV.get(id)));
  const logs = [];
  for (const raw of entries) { if (raw) logs.push(JSON.parse(raw)); }
  return logs;
}

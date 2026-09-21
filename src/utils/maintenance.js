// Per-feature maintenance-mode toggles (KV-backed) and the admin endpoints that manage them.

import { getAuthenticatedUser } from "./auth.js";
import { json } from "./http.js";
import { st } from "../i18n/server.js";
import { addAuditLog } from "../kv/audit.js";

// Nhớ cờ bảo trì trong bộ nhớ isolate 30 giây: hàm này chạy ở gần như MỌI request (cờ "global" + cờ theo tính năng),
// đọc KV mỗi lần rất tốn hạn mức đọc. Đổi cờ có thể trễ tối đa 30 giây ở các isolate khác.
var MAINT_CACHE = new Map();
var MAINT_TTL_MS = 30000;
export async function isMaintenance(env, feature) {
  var hit = MAINT_CACHE.get(feature);
  if (hit && Date.now() - hit.t < MAINT_TTL_MS) return hit.v;
  try {
    var raw = await env.LINKS_KV.get("maintenance:" + feature);
    var val = null;
    if (raw) { try { val = JSON.parse(raw); } catch(e) { val = null; } }
    MAINT_CACHE.set(feature, { v: val, t: Date.now() });
    return val;
  } catch(e) { return null; }
}

export async function handleGetMaintenance(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || (user.role !== "admin" && user.role !== "super")) return json({ error: "Chỉ admin" }, 403, corsHeaders);
  var features = ["global", "stripe", "qr_payment", "bulk", "api", "analytics", "voucher", "login", "shorten", "password_link", "qr_code", "data_export", "webhooks", "link_in_bio", "extension", "ai_assistant"];
  var result = {};
  for (var i = 0; i < features.length; i++) { result[features[i]] = (await isMaintenance(env, features[i])) || { active: false, note: "" }; }
  return json({ maintenance: result }, 200, corsHeaders);
}

export async function handleSetMaintenance(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || (user.role !== "admin" && user.role !== "super")) return json({ error: "Chỉ admin" }, 403, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  var feature = body.feature, active = body.active, note = body.note || "";
  if (!feature) return json({ error: "Thiếu tính năng" }, 400, corsHeaders);
  MAINT_CACHE.delete(feature);
  if (active) { await env.LINKS_KV.put("maintenance:" + feature, JSON.stringify({ active: true, note: note, setAt: new Date().toISOString(), setBy: user.username })); }
  else { await env.LINKS_KV.delete("maintenance:" + feature); }
  await addAuditLog(env, user, "MAINTENANCE_TOGGLE", { feature: feature, active: active, note: note }, request);
  return json({ success: true, feature: feature, active: active }, 200, corsHeaders);
}

export async function handleGetMaintenanceStatus(request, env, corsHeaders) {
  var features = ["stripe", "qr_payment", "bulk", "api", "analytics", "voucher"];
  var result = {};
  for (var i = 0; i < features.length; i++) { result[features[i]] = (await isMaintenance(env, features[i])) || { active: false, note: "" }; }
  return json({ maintenance: result }, 200, corsHeaders);
}

export async function checkMaintenance(env, feature, corsHeaders, request) {
  var m = await isMaintenance(env, feature);
  if (m && m.active) return json({ error: st("maintenance_feature_prefix", request) + (m.note ? ": " + m.note : "") }, 503, corsHeaders);
  return null;
}

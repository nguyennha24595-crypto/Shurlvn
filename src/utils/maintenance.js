// Per-feature maintenance-mode toggles (KV-backed) and the admin endpoints that manage them.

import { getAuthenticatedUser } from "./auth.js";
import { json } from "./http.js";
import { st } from "../i18n/server.js";
import { addAuditLog } from "../kv/audit.js";

export async function isMaintenance(env, feature) {
  try {
    var raw = await env.LINKS_KV.get("maintenance:" + feature);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch(e) { return null; }
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

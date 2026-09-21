import { TIER_CONFIG } from "../config/tiers.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { randomHex } from "../utils/crypto.js";
import { isBlockedWebhookHost, json } from "../utils/http.js";

// Webhooks (Pro/Super): create/list/delete.

export async function handleCreateWebhook(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasApi) return json({ success: false, error: "Webhooks require Pro or Super plan" }, 403, corsHeaders);
  
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { url: hookUrl, name, event } = body || {};
  if (!hookUrl) return json({ success: false, error: "Webhook URL is required" }, 400, corsHeaders);
  if (!hookUrl.startsWith("https://")) return json({ success: false, error: "Webhook URL must use HTTPS" }, 400, corsHeaders);
  let hookHostname;
  try { hookHostname = new URL(hookUrl).hostname; } catch (e) { return json({ success: false, error: "Invalid webhook URL" }, 400, corsHeaders); }
  if (isBlockedWebhookHost(hookHostname)) {
    return json({ success: false, error: "Webhook URL không được trỏ tới địa chỉ nội bộ" }, 400, corsHeaders);
  }

  const key = "webhooks:" + authedUser.username.toLowerCase();
  const existingRaw = await env.LINKS_KV.get(key);
  const hooks = existingRaw ? JSON.parse(existingRaw) : [];
  const maxHooks = authedUser.role === "super" ? 10 : 5;
  if (hooks.length >= maxHooks) return json({ success: false, error: "Maximum " + maxHooks + " webhooks reached" }, 400, corsHeaders);
  
  const hook = {
    id: "wh_" + randomHex(8),
    url: hookUrl,
    name: name || hookUrl.substring(0, 50),
    event: event || "click",
    isActive: true,
    createdAt: new Date().toISOString()
  };
  hooks.push(hook);
  await env.LINKS_KV.put(key, JSON.stringify(hooks));
  return json({ success: true, webhook: hook }, 201, corsHeaders);
}

export async function handleListWebhooks(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasApi) return json({ success: false, error: "Webhooks require Pro or Super plan" }, 403, corsHeaders);
  
  const key = "webhooks:" + authedUser.username.toLowerCase();
  const raw = await env.LINKS_KV.get(key);
  const hooks = raw ? JSON.parse(raw) : [];
  return json({ success: true, count: hooks.length, data: hooks }, 200, corsHeaders);
}

export async function handleDeleteWebhook(request, env, hookId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasApi) return json({ success: false, error: "Webhooks require Pro or Super plan" }, 403, corsHeaders);
  
  const key = "webhooks:" + authedUser.username.toLowerCase();
  const raw = await env.LINKS_KV.get(key);
  const hooks = raw ? JSON.parse(raw) : [];
  const filtered = hooks.filter(h => h.id !== hookId);
  if (filtered.length === hooks.length) return json({ success: false, error: "Webhook not found" }, 404, corsHeaders);
  await env.LINKS_KV.put(key, JSON.stringify(filtered));
  return json({ success: true, message: "Webhook deleted" }, 200, corsHeaders);
}

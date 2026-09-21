import { getAuthenticatedUser, requireAuthResponse } from "../utils/auth.js";
import { json } from "../utils/http.js";

// User-facing in-app notifications: list + mark read.

export async function handleGetMyNotifications(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  const prefix = "notif:user:" + authedUser.username.toLowerCase() + ":";
  const notifications = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix, cursor });
    for (const key of page.keys) {
      const raw = await env.LINKS_KV.get(key.name);
      if (raw) notifications.push(JSON.parse(raw));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unreadCount = notifications.filter(n => !n.read).length;
  return json({ notifications, unreadCount }, 200, corsHeaders);
}

export async function handleMarkNotificationRead(request, env, notifId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  // V3: Dùng key trực tiếp thay vì scan toàn bộ KV — tránh treo
  const key = "notif:user:" + authedUser.username.toLowerCase() + ":" + notifId;
  const raw = await env.LINKS_KV.get(key);
  if (raw) {
    const notif = JSON.parse(raw);
    notif.read = true;
    notif.readAt = new Date().toISOString();
    await env.LINKS_KV.put(key, JSON.stringify(notif));
    return json({ ok: true, notification: notif }, 200, corsHeaders);
  }
  // Fallback: scan KV nếu không tìm thấy bằng key trực tiếp
  const prefix = "notif:user:" + authedUser.username.toLowerCase() + ":";
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix, cursor });
    for (const k of page.keys) {
      const r = await env.LINKS_KV.get(k.name);
      if (r) {
        const n = JSON.parse(r);
        if (n.id === notifId) {
          n.read = true;
          n.readAt = new Date().toISOString();
          await env.LINKS_KV.put(k.name, JSON.stringify(n));
          return json({ ok: true, notification: n }, 200, corsHeaders);
        }
      }
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return json({ error: "Không tìm thấy thông báo" }, 404, corsHeaders);
}

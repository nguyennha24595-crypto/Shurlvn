import { DEFAULT_KEYWORDS } from "../config/constants.js";
import { TIER_CONFIG } from "../config/tiers.js";
import { upgradeUserRole } from "./billing.js";
import { addAuditLog, listAuditLogs } from "../kv/audit.js";
import { getBlacklistRaw, putBlacklistRaw } from "../kv/blacklist.js";
import { getBlogPost, listAllBlogPosts } from "../kv/blog.js";
import { deleteLinkKV, listAllLinks } from "../kv/links.js";
import { deleteReport, listReports } from "../kv/reports.js";
import { getUser, listAllUsers, putUser, safeUser } from "../kv/users.js";
import { getAuthenticatedUser, requireAdminResponse, requireAuthResponse } from "../utils/auth.js";
import { notifyUser } from "../utils/email.js";
import { json, todayStr } from "../utils/http.js";
import { buildEmailShell } from "../views/emailTemplates.js";

// Admin: users, reports, feedback, blacklist, audit logs, blog posts, settings, broadcast notifications, overview stats.

export async function handleAdminListUsers(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const users = await listAllUsers(env);
  return json({ users: users.map(safeUser) }, 200, corsHeaders);
}

export async function handleAdminSetRole(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, role } = body || {};
  if (!username || !role) return json({ error: "Thiếu username hoặc role" }, 400, corsHeaders);
  if (typeof role !== "string" || !Object.prototype.hasOwnProperty.call(TIER_CONFIG, role)) return json({ error: "Hạng gói không hợp lệ" }, 400, corsHeaders);

  const user = await getUser(env, username);
  if (!user) return json({ error: `Không tìm thấy người dùng ${username}` }, 400, corsHeaders);

  const oldRole = (await getUser(env, username))?.role || user.role;
  user.role = role;
  if (role === "free" || role === "guest") {
    user.tierExpiresAt = null;
    user.tierActivatedAt = null;
  }
  await putUser(env, user);
  await addAuditLog(env, authedUser, "CHANGE_USER_ROLE", { username, oldRole, newRole: role }, request);
  return json({ ok: true, user: safeUser(user) }, 200, corsHeaders);
}

export async function handleAdminListReports(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const reports = await listReports(env);
  return json({ reports }, 200, corsHeaders);
}

export async function handleAdminDismissReport(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  if (body && body.id) await deleteReport(env, body.id);
  await addAuditLog(env, authedUser, "DISMISS_REPORT", { reportId: body.id }, request);
  return json({ ok: true }, 200, corsHeaders);
}

export async function handleAdminListFeedback(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  const feedbacks = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "feedback:", cursor });
    for (const k of page.keys) {
      const raw = await env.LINKS_KV.get(k.name);
      if (raw) feedbacks.push(JSON.parse(raw));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  feedbacks.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return json({ feedback: feedbacks }, 200, corsHeaders);
}

export async function handleAdminReplyFeedback(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { id, reply } = body || {};
  if (!id || !reply) return json({ error: "Thieu id hoac reply" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("feedback:" + id);
  if (!raw) return json({ error: "Khong tim thay gop y" }, 404, corsHeaders);
  const feedback = JSON.parse(raw);
  feedback.status = "replied";
  feedback.reply = reply;
  feedback.repliedAt = new Date().toISOString();
  feedback.repliedBy = authedUser.username;
  await env.LINKS_KV.put("feedback:" + id, JSON.stringify(feedback));
  if (feedback.username) {
    await notifyUser(env, { username: feedback.username, type: "feedback_reply", from: authedUser.username, title: "Phan hoi gop y", message: reply.substring(0, 200) });
  }
  await addAuditLog(env, authedUser, "REPLY_FEEDBACK", { feedbackId: id }, request);
  return json({ ok: true }, 200, corsHeaders);
}

export async function handleAdminUpdateFeedbackStatus(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { id, status } = body || {};
  if (!id || !status) return json({ error: "Thieu id hoac status" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("feedback:" + id);
  if (!raw) return json({ error: "Khong tim thay gop y" }, 404, corsHeaders);
  const feedback = JSON.parse(raw);
  feedback.status = status;
  await env.LINKS_KV.put("feedback:" + id, JSON.stringify(feedback));
  await addAuditLog(env, authedUser, "UPDATE_FEEDBACK_STATUS", { feedbackId: id, status }, request);
  return json({ ok: true }, 200, corsHeaders);
}

export async function handleAdminDeleteFeedback(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { id } = body || {};
  if (!id) return json({ error: "Thieu id" }, 400, corsHeaders);
  await env.LINKS_KV.delete("feedback:" + id);
  await addAuditLog(env, authedUser, "DELETE_FEEDBACK", { feedbackId: id }, request);
  return json({ ok: true }, 200, corsHeaders);
}

export async function handleAdminTranslateFeedback(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { id } = body || {};
  if (!id) return json({ error: "Thiếu ID" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("feedback:" + id);
  if (!raw) return json({ error: "Không tìm thấy góp ý" }, 404, corsHeaders);
  const feedback = JSON.parse(raw);
  const text = feedback.message || "";
  if (!text) return json({ error: "Nội dung trống" }, 400, corsHeaders);
  // 1) Thử Google Translate
  try {
    const trUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=" + encodeURIComponent(text);
    const trResp = await fetch(trUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    if (trResp.ok) {
      const trData = await trResp.json();
      const translated = (trData[0] || []).map(function(s){ return s && s[0] ? s[0] : ""; }).join("");
      if (translated) return json({ ok: true, translated: translated }, 200, corsHeaders);
    }
  } catch (e) {}
  // 2) Fallback: MyMemory API
  try {
    const mmUrl = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=auto|vi";
    const mmResp = await fetch(mmUrl);
    const mmData = await mmResp.json();
    const translated = mmData && mmData.responseData && mmData.responseData.translatedText;
    if (translated) return json({ ok: true, translated: translated }, 200, corsHeaders);
  } catch (e) {}
  return json({ error: "Không thể dịch nội dung, vui lòng thử lại sau." }, 500, corsHeaders);
}

export async function handleGetBlacklist(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const bl = await getBlacklistRaw(env);
  return json({ domains: bl.domains, keywords: bl.keywords, defaults: DEFAULT_KEYWORDS }, 200, corsHeaders);
}

export async function handleAddBlacklist(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { type, value } = body || {};
  if (!type || !value) return json({ error: "Thiếu type hoặc value" }, 400, corsHeaders);

  const bl = await getBlacklistRaw(env);
  const clean = value.trim().toLowerCase();
  if (clean) {
    if (type === "domain") {
      if (!bl.domains.includes(clean)) bl.domains.push(clean);
    } else {
      if (!bl.keywords.includes(clean)) bl.keywords.push(clean);
    }
    await putBlacklistRaw(env, bl);
  }
  await addAuditLog(env, authedUser, "ADD_BLACKLIST", { type, value: clean }, request);
  return json({ domains: bl.domains, keywords: bl.keywords, defaults: DEFAULT_KEYWORDS }, 200, corsHeaders);
}

export async function handleRemoveBlacklist(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { type, value } = body || {};
  if (!type || !value) return json({ error: "Thiếu type hoặc value" }, 400, corsHeaders);

  const bl = await getBlacklistRaw(env);
  const clean = value.trim().toLowerCase();
  if (type === "domain") {
    bl.domains = bl.domains.filter(d => d !== clean);
  } else {
    bl.keywords = bl.keywords.filter(k => k !== clean);
  }
  await putBlacklistRaw(env, bl);
  await addAuditLog(env, authedUser, "REMOVE_BLACKLIST", { type, value: clean }, request);
  return json({ domains: bl.domains, keywords: bl.keywords, defaults: DEFAULT_KEYWORDS }, 200, corsHeaders);
}

export async function handleAdminListAuditLogs(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  const logs = await listAuditLogs(env, 200);
  return json({ logs }, 200, corsHeaders);
}

export async function handleExportWorker(request, env, corsHeaders) {
  // 1. Bắt buộc đăng nhập
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) {
    return requireAuthResponse(corsHeaders, request);   // 401 - chưa đăng nhập
  }

  // 2. Bắt buộc phải là admin
  if (authedUser.role !== "admin") {
    return requireAdminResponse(corsHeaders, request);  // 403 - không phải admin
  }

  // 3. Giữ nguyên logic export cũ của bạn ở đây
  return json({ code: "..." }, 200, corsHeaders);
}

export async function handleAdminOverview(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Admin only" }, 403, corsHeaders);
  var todayStr = new Date().toISOString().slice(0, 10);
  var result = {
    users: { total: 0, today: 0 },
    activeUsers: { count: null, available: false, note: "No lastSeen data" },
    shortUrls: { total: 0, today: 0 },
    workers: {
      requests: { count: null, available: false, note: "" },
      usage: { planName: null, usedRequests: null, requestLimit: null, usagePercent: null, resetAt: null, available: false, note: "" },
      errors: { count: null, available: false, note: "" },
      cpuP90: { value: null, available: false, note: "" },
      hourly: []
    },
    payments: { paidUsers: 0, stripe: 0, qr: 0, pendingQr: 0, revenueUsd: 0, revenueVnd: 0 },
    reports: { pending: 0, total: 0 },
    userGrowth: [],
    cronPurge: null,
    failedLoginsToday: 0
  };
  try {
    var lsList = await env.LINKS_KV.list({ prefix: "lastseen:", limit: 1000 });
    var lsVals = await Promise.all(lsList.keys.map(function(k){ return env.LINKS_KV.get(k.name); }));
    var nowMs = Date.now();
    var activeCount = 0;
    for (var li2 = 0; li2 < lsVals.length; li2++) {
      if (lsVals[li2] && (nowMs - parseInt(lsVals[li2])) <= 15 * 60 * 1000) activeCount++;
    }
    result.activeUsers = { count: activeCount, available: true, note: "" };
  } catch(e) {}
  try {
    var reports = await listReports(env);
    result.reports = { pending: reports.filter(function(r){ return !r.dismissed; }).length, total: reports.length };
  } catch(e) {}
  try {
    var purgeLogRaw = await env.LINKS_KV.get("cron_purge_log");
    if (purgeLogRaw) result.cronPurge = JSON.parse(purgeLogRaw);
  } catch(e) {}
  try {
    result.failedLoginsToday = parseInt(await env.LINKS_KV.get("failedlogin_count:" + todayStr) || "0");
  } catch(e) {}
  try {
    var raw = await env.LINKS_KV.get("cf_analytics_cache");
    if (raw) {
      var cf = JSON.parse(raw);
      result.workers.requests.count = cf.todayRequests || 0;
      result.workers.requests.available = true;
      result.workers.errors.count = cf.todayErrors || 0;
      result.workers.errors.available = true;
      result.workers.cpuP90.value = cf.cpuP90 != null ? (cf.cpuP90 / 1000).toFixed(1) : null;
      result.workers.cpuP90.available = cf.cpuP90 != null;
      result.workers.usage.planName = cf.planName || "Free Plan";
      result.workers.usage.usedRequests = cf.todayRequests || 0;
      result.workers.usage.requestLimit = cf.planLimit || 100000;
      var pct = result.workers.usage.requestLimit > 0 ? (result.workers.usage.usedRequests / result.workers.usage.requestLimit * 100) : 0;
      result.workers.usage.usagePercent = Math.round(pct * 10) / 10;
      result.workers.usage.available = true;
      var resetDate = new Date();
      resetDate.setUTCHours(24, 0, 0, 0);
      result.workers.usage.resetAt = resetDate.toISOString();
      result.workers.hourly = cf.hourly || [];
    }
  } catch(e) {}
  try {
    var allUsers = await listAllUsers(env);
    result.users.total = allUsers.length;
    var todayCount = 0;
    var sortedDates = [];
    for (var i = 0; i < allUsers.length; i++) {
      var u = allUsers[i];
      if (u.createdAt) {
        var d = u.createdAt.slice(0, 10);
        if (d === todayStr) todayCount++;
        sortedDates.push(d);
      }
    }
    result.users.today = todayCount;
    sortedDates.sort();
    var growth = [];
    for (var d2 = 29; d2 >= 0; d2--) {
      var date = new Date(Date.now() - d2 * 86400000).toISOString().slice(0, 10);
      var lo = 0, hi = sortedDates.length;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (sortedDates[mid] <= date) lo = mid + 1; else hi = mid; }
      growth.push({ date: date, value: lo });
    }
    result.userGrowth = growth;
  } catch(e) {}
  try {
    var allLinks = await listAllLinks(env);
    var activeCount = 0, todayLinks = 0;
    for (var i = 0; i < allLinks.length; i++) {
      var l = allLinks[i];
      if (!l.isDeleted) {
        activeCount++;
        if (l.createdAt && l.createdAt.slice(0, 10) === todayStr) todayLinks++;
      }
    }
    result.shortUrls.total = activeCount;
    result.shortUrls.today = todayLinks;
  } catch(e) {}
  try {
    var stripeUsers = new Set();
    var qrUsers = new Set();
    var allPaidUsers = new Set();
    var revenueUsd = 0, revenueVnd = 0, pendingQr = 0;
    var payList = await env.LINKS_KV.list({ prefix: "payment:", limit: 1000 });
    var payVals = await Promise.all(payList.keys.map(function(k){ return env.LINKS_KV.get(k.name); }));
    for (var i = 0; i < payVals.length; i++) {
      if (payVals[i]) { var p = JSON.parse(payVals[i]); if (p.status === "success" && p.username) { var un = p.username.toLowerCase(); stripeUsers.add(un); allPaidUsers.add(un); revenueUsd += (p.amount || 0) / 100; } }
    }
    var qrList = await env.LINKS_KV.list({ prefix: "qrpay:", limit: 1000 });
    var qrVals = await Promise.all(qrList.keys.map(function(k){ return env.LINKS_KV.get(k.name); }));
    for (var i = 0; i < qrVals.length; i++) {
      if (qrVals[i]) {
        var p = JSON.parse(qrVals[i]);
        if (p.status === "pending") pendingQr++;
        if (p.status === "approved" && p.username) { var un = p.username.toLowerCase(); qrUsers.add(un); allPaidUsers.add(un); revenueVnd += (p.vndPrice || 0); }
      }
    }
    result.payments.stripe = stripeUsers.size;
    result.payments.qr = qrUsers.size;
    result.payments.pendingQr = pendingQr;
    result.payments.revenueUsd = Math.round(revenueUsd * 100) / 100;
    result.payments.revenueVnd = revenueVnd;
    result.payments.paidUsers = allPaidUsers.size;
  } catch(e) {}
  return json(result, 200, corsHeaders);
}

export async function handlePaymentReports(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Admin only" }, 403, corsHeaders);
  var list = await env.LINKS_KV.list({ prefix: "payment:" });
  var payments = [];
  for (var key of list.keys) {
    var val = await env.LINKS_KV.get(key.name);
    if (val) payments.push(JSON.parse(val));
  }
  payments.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  return json({ payments }, 200, corsHeaders);
}

export function t(key){
  var lang = i18n[currentLang] || i18n.vi;
  return lang[key] || i18n.vi[key] || key;
}

export async function handleAdminDeleteUser(request, env, username, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  if (!username) return json({ error: "Thiếu username" }, 400, corsHeaders);
  const targetUser = await getUser(env, username);
  if (!targetUser) return json({ error: "Không tìm thấy người dùng " + username }, 400, corsHeaders);
  if (targetUser.role === "admin") return json({ error: "Không thể xóa tài khoản admin" }, 400, corsHeaders);
  const allLinks = await listAllLinks(env);
  let deletedLinks = 0;
  for (const link of allLinks) {
    if (link.owner === targetUser.username.toLowerCase() || link.owner === targetUser.username) {
      await deleteLinkKV(env, link.code);
      deletedLinks++;
    }
  }
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "session:", cursor });
    for (const key of page.keys) {
      const sessionUser = await env.LINKS_KV.get(key.name);
      if (sessionUser && sessionUser.toLowerCase() === targetUser.username.toLowerCase()) {
        await env.LINKS_KV.delete(key.name);
      }
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  if (targetUser.apiToken) {
    await env.LINKS_KV.delete("apitoken:" + targetUser.apiToken);
  }
  let notifCursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "notif:user:" + targetUser.username.toLowerCase() + ":", cursor: notifCursor });
    for (const key of page.keys) { await env.LINKS_KV.delete(key.name); }
    notifCursor = page.cursor;
    if (page.list_complete) break;
  } while (notifCursor);
  await env.LINKS_KV.delete("user:" + targetUser.username.toLowerCase());
  await addAuditLog(env, authedUser, "DELETE_USER", { username: targetUser.username, deletedLinks }, request);
  return json({ ok: true, message: "Đã xóa user " + targetUser.username + " và " + deletedLinks + " links", deletedLinks }, 200, corsHeaders);
}

export async function handleAdminBanUser(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, banned, reason } = body || {};
  if (!username) return json({ error: "Thiếu username" }, 400, corsHeaders);
  const user = await getUser(env, username);
  if (!user) return json({ error: "Không tìm thấy người dùng " + username }, 400, corsHeaders);
  if (user.role === "admin") return json({ error: "Không thể khóa tài khoản admin" }, 400, corsHeaders);
  user.banned = !!banned;
  user.bannedReason = banned ? (reason || "Không có lý do") : null;
  user.bannedAt = banned ? new Date().toISOString() : null;
  user.bannedBy = banned ? authedUser.username : null;
  await putUser(env, user);
  // If banning, delete all active sessions and revoke the API token
  if (banned) {
    let cursor;
    do {
      const page = await env.LINKS_KV.list({ prefix: "session:", cursor });
      for (const key of page.keys) {
        const sessionUser = await env.LINKS_KV.get(key.name);
        if (sessionUser && sessionUser.toLowerCase() === user.username.toLowerCase()) {
          await env.LINKS_KV.delete(key.name);
        }
      }
      cursor = page.cursor;
      if (page.list_complete) break;
    } while (cursor);
    if (user.apiToken) {
      await env.LINKS_KV.delete("apitoken:" + user.apiToken);
    }
  }
  await addAuditLog(env, authedUser, banned ? "BAN_USER" : "UNBAN_USER", { username, reason: user.bannedReason }, request);
  return json({ ok: true, message: banned ? "Đã khóa user " + username : "Đã mở khóa user " + username, user: safeUser(user) }, 200, corsHeaders);
}

export async function handleAdminSearchUsers(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").toLowerCase().trim();
  const roleFilter = url.searchParams.get("role") || "";
  const bannedFilter = url.searchParams.get("banned") || "";
  if (!query && !roleFilter && !bannedFilter) {
    return json({ error: "Thiếu từ khóa tìm kiếm (q, role, hoặc banned)" }, 400, corsHeaders);
  }
  const allUsers = await listAllUsers(env);
  let filtered = allUsers;
  if (query) {
    filtered = filtered.filter(function(u) {
      return (u.username && u.username.toLowerCase().includes(query)) ||
             (u.email && u.email.toLowerCase().includes(query));
    });
  }
  if (roleFilter) {
    filtered = filtered.filter(function(u) { return u.role === roleFilter; });
  }
  if (bannedFilter === "true") {
    filtered = filtered.filter(function(u) { return !!u.banned; });
  } else if (bannedFilter === "false") {
    filtered = filtered.filter(function(u) { return !u.banned; });
  }
  return json({ users: filtered.map(safeUser), total: filtered.length }, 200, corsHeaders);
}

export async function handleAdminGetSettings(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const raw = await env.LINKS_KV.get("sys:settings");
  let settings = {};
  if (raw) { try { settings = JSON.parse(raw); } catch (e) { settings = {}; } }
  return json({ settings, tierConfig: TIER_CONFIG }, 200, corsHeaders);
}

export async function handleAdminSaveSettings(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { tierOverrides } = body || {};
  const settings = {};
  if (tierOverrides && typeof tierOverrides === "object") {
    const validTiers = ["guest", "free", "plus", "pro", "super"];
    settings.tierOverrides = {};
    for (const tier of validTiers) {
      if (tierOverrides[tier]) {
        settings.tierOverrides[tier] = {};
        if (typeof tierOverrides[tier].dailyLinks === "number") settings.tierOverrides[tier].dailyLinks = tierOverrides[tier].dailyLinks;
        if (typeof tierOverrides[tier].maxBulkBatch === "number") settings.tierOverrides[tier].maxBulkBatch = tierOverrides[tier].maxBulkBatch;
        if (typeof tierOverrides[tier].monthlyApiLimit === "number") settings.tierOverrides[tier].monthlyApiLimit = tierOverrides[tier].monthlyApiLimit;
      }
    }
  }
  await env.LINKS_KV.put("sys:settings", JSON.stringify(settings));
  await addAuditLog(env, authedUser, "SAVE_SETTINGS", { settings }, request);
  return json({ ok: true, message: "Đã lưu cài đặt hệ thống", settings }, 200, corsHeaders);
}

export async function handleAdminListBlogPosts(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const posts = await listAllBlogPosts(env);
  return json({ posts }, 200, corsHeaders);
}

export async function handleAdminGetBlogPost(request, env, slug, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const post = await getBlogPost(env, slug);
  if (!post) return json({ error: "Không tìm thấy bài viết" }, 404, corsHeaders);
  return json({ post }, 200, corsHeaders);
}

export async function handleAdminSaveBlogPost(request, env, corsHeaders, slugParam) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const slug = (slugParam || body.slug || "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: "Slug không hợp lệ — chỉ dùng chữ thường, số và dấu gạch ngang." }, 400, corsHeaders);
  }
  const { title, description, date, contentHtml } = body || {};
  if (!title || !description || !date || !contentHtml) {
    return json({ error: "Thiếu trường bắt buộc: title, description, date, contentHtml." }, 400, corsHeaders);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: "Định dạng date phải là YYYY-MM-DD." }, 400, corsHeaders);
  }
  const post = { slug, title, description, date, contentHtml };
  await env.LINKS_KV.put("blog:" + slug, JSON.stringify(post));
  await addAuditLog(env, authedUser, "SAVE_BLOG_POST", { slug }, request);
  return json({ ok: true, post }, 200, corsHeaders);
}

export async function handleAdminDeleteBlogPost(request, env, slug, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  await env.LINKS_KV.delete("blog:" + slug);
  await addAuditLog(env, authedUser, "DELETE_BLOG_POST", { slug }, request);
  return json({ ok: true }, 200, corsHeaders);
}

export async function handleAdminApplyVoucher(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, code } = body || {};
  if (!username || !code) return json({ error: "Thiếu username hoặc mã voucher" }, 400, corsHeaders);
  const targetUser = await getUser(env, username);
  if (!targetUser) return json({ error: "Khong tim thay nguoi dung " + username }, 400, corsHeaders);
  const voucherKey = "voucher:" + code.toUpperCase();
  const raw = await env.LINKS_KV.get(voucherKey);
  if (!raw) return json({ error: "Voucher không tồn tại" }, 404, corsHeaders);
  const voucher = JSON.parse(raw);
  if (!voucher.active) return json({ error: "Voucher đã bị vô hiệu hóa" }, 400, corsHeaders);
  if (new Date(voucher.expiresAt) < new Date()) return json({ error: "Voucher đã hết hạn" }, 400, corsHeaders);
  if (voucher.usedCount >= voucher.maxUses) return json({ error: "Voucher đã hết lượt dùng" }, 400, corsHeaders);
  const ok = await upgradeUserRole(env, targetUser.username, voucher.tier);
  if (!ok) return json({ error: "Không thể nâng cấp user" }, 500, corsHeaders);
  voucher.usedCount++;
  await env.LINKS_KV.put(voucherKey, JSON.stringify(voucher));
  const usedKey = voucherKey + ":used:" + targetUser.username;
  await env.LINKS_KV.put(usedKey, new Date().toISOString());
  await addAuditLog(env, authedUser, "APPLY_VOUCHER", { username: targetUser.username, code: voucher.code, tier: voucher.tier }, request);
  return json({ ok: true, message: "Đã áp voucher " + voucher.code + " cho user " + targetUser.username + " - Nâng cấp lên " + voucher.tier.toUpperCase(), user: safeUser(targetUser) }, 200, corsHeaders);
}

export function buildAdminBroadcastEmailHtml(title, message) {
  return buildEmailShell({
    lang: "vi", illustration: "maintenance",
    title: title,
    introHtml: '<p style="white-space:pre-wrap;">' + message + '</p>',
    ctaText: "Truy cập SHURL", ctaUrl: "https://shurlvn.com",
    footerReason: "Bạn nhận được email này từ quản trị viên SHURL."
  });
}

export async function handleAdminBroadcastNotification(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { title, message, targetUsername, type, sendEmailToo } = body || {};
  if (!title || !message) return json({ error: "Thiếu title hoặc message" }, 400, corsHeaders);
  const notifType = type || "info";
  const emailSubject = title;
  const emailHtml = buildAdminBroadcastEmailHtml(title, message);
  if (targetUsername) {
    const targetUser = await getUser(env, targetUsername);
    if (!targetUser) return json({ error: "Không tìm thấy người dùng " + targetUsername }, 400, corsHeaders);
    const notifId = await notifyUser(env, {
      username: targetUser.username, type: notifType, from: authedUser.username, title, message,
      sendEmailToo: !!sendEmailToo, emailSubject, emailHtml
    });
    await addAuditLog(env, authedUser, "SEND_NOTIFICATION", { targetUsername: targetUser.username, title }, request);
    return json({ ok: true, message: "Đã gửi thông báo tới " + targetUser.username, notifId }, 200, corsHeaders);
  } else {
    const allUsers = await listAllUsers(env);
    let sentCount = 0;
    for (const user of allUsers) {
      if (user.role === "admin") continue;
      await notifyUser(env, {
        username: user.username, type: notifType, from: authedUser.username, title, message,
        sendEmailToo: !!sendEmailToo, emailSubject, emailHtml
      });
      sentCount++;
    }
    await addAuditLog(env, authedUser, "BROADCAST_NOTIFICATION", { title, sentCount }, request);
    return json({ ok: true, message: "Đã gửi thông báo tới " + sentCount + " users", sentCount }, 200, corsHeaders);
  }
}

export async function handleAdminListNotifications(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const notifications = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "notif:user:", cursor });
    for (const key of page.keys) {
      const raw = await env.LINKS_KV.get(key.name);
      if (raw) notifications.push(JSON.parse(raw));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return json({ notifications }, 200, corsHeaders);
}

export async function handleAdminDeleteNotification(request, env, notifId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  if (!notifId) return json({ error: "Thiếu ID thông báo" }, 400, corsHeaders);
  let deleted = false;
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "notif:user:", cursor });
    for (const key of page.keys) {
      if (key.name.endsWith(":" + notifId)) {
        await env.LINKS_KV.delete(key.name);
        deleted = true;
      }
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  if (deleted) {
    await addAuditLog(env, authedUser, "DELETE_NOTIFICATION", { notifId }, request);
    return json({ ok: true, message: "Đã xóa thông báo" }, 200, corsHeaders);
  }
  return json({ error: "Không tìm thấy thông báo" }, 404, corsHeaders);
}

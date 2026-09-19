// ==============================================================================
// SHURL — CLOUDFLARE WORKER FULL ENGINE (Nền tảng rút gọn link đa tầng)
// ==============================================================================
// ===================== CẤU HÌNH HẠN MỨC 5 TẦNG (khớp src/types.ts) ==========

import { sendEmail, sendResetEmail, notifyUser, notifyAllAdmins, sendVoucherEmail } from "./src/utils/email.js";

import { MAINTENANCE_HTML, renderForgotPassword, buildEmailShell, buildResetEmail } from "./src/views/emailTemplates.js";
import { googleAdsGtagHead, renderBlogLayout, renderBlogIndexPage, renderBlogPostPage } from "./src/views/blogHtml.js";
import { renderBioPageHtml } from "./src/views/bioHtml.js";
import { renderAppHtml } from "./src/views/appHtml.js";

import { getAuthenticatedUser, requireAuthResponse, requireAdminResponse, clearOauthStateCookieHeader } from "./src/utils/auth.js";
import { getTierOverrides, getEffectiveTierConfig, checkDailyQuota, incrementDailyQuota, checkMonthlyApiQuota, incrementMonthlyApiQuota, checkMonthlyDynamicQrQuota, incrementMonthlyDynamicQrQuota } from "./src/utils/quota.js";
import { isMaintenance, handleGetMaintenance, handleSetMaintenance, handleGetMaintenanceStatus, checkMaintenance } from "./src/utils/maintenance.js";

import { bytesToHex, randomHex, randomSixDigitCode, hashPassword } from "./src/utils/crypto.js";
import { json, html, escHtml, escJsString, isBlockedWebhookHost, todayStr, thisMonthStr, parseCookies, setSessionCookieHeader, clearSessionCookieHeader, getClientIp } from "./src/utils/http.js";
import { safeUser, getUser, putUser, listAllUsers } from "./src/kv/users.js";
import { getLink, putLink, deleteLinkKV, listAllLinks, generateCode, shortUrlFor } from "./src/kv/links.js";
import { getQrRecord, putQrRecord, deleteQrRecord, listAllQrRecords, generateQrId, qrRecordToResponse } from "./src/kv/qr.js";
import { getClicks, putClicks, recordClick, computeLinkAnalytics, parseUserAgent } from "./src/kv/clicks.js";
import { putReport, listReports, deleteReport } from "./src/kv/reports.js";
import { getBlacklistRaw, putBlacklistRaw, isDomainBlacklisted, isKeywordBlacklisted, seedIfNeeded } from "./src/kv/blacklist.js";
import { addAuditLog, listAuditLogs } from "./src/kv/audit.js";
import { BLOG_POSTS_SEED, isPostPublished, seedBlogPostsIfNeeded, listAllBlogPosts, getPublishedBlogPosts, getBlogPost } from "./src/kv/blog.js";

import { TIER_CONFIG, TIER_RANK, isProOrAboveRole } from "./src/config/tiers.js";
import { BASE_DOMAIN, FAVICON_PNG_BASE64, normalizeCustomDomain, DEFAULT_KEYWORDS, DEFAULT_BLACKLIST_DOMAINS, SESSION_COOKIE, SESSION_TTL, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_TTL, OAUTH_STATE_COOKIE, PW_RESET_TTL, MAX_BIO_SUBLINKS, VALID_QR_DOT_STYLES, PAYMENT_URL_PATTERNS, MAX_ATTEMPTS, LOCKOUT_SECONDS, PW_MAX_ATTEMPTS_FALLBACK, PW_LOCKOUT_TTL, AI_ASSISTANT_SYSTEM_PROMPT } from "./src/config/constants.js";
import { getServerLang, st, SERVER_I18N } from "./src/i18n/server.js";
import { EMAIL_LABELS, NOTIFICATION_TEMPLATES, fillTemplate, NOTIF_EMAIL_META, renderNotificationTemplate } from "./src/i18n/notifications.js";

// ===================== SERVER I18N =====================

// ===================== ENTRYPOINT =====================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Always Use HTTPS — redirect HTTP → HTTPS
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const path = url.pathname.replace(/^\/+|\/+$/g, "");

    // Rate limit cơ bản — chống spam theo IP/phút.
    // Không ghi KV mỗi request (tốn write quota) mà lấy mẫu ngẫu nhiên ~1/10 request để ghi,
    // nên ngưỡng chặn cũng hạ tương ứng còn 1/10 (120 req/phút thật ~ ghi nhận khoảng 12).
    const SKIP_RATE_LIMIT = ["favicon.ico", "robots.txt", "sitemap.xml"];
    if (!SKIP_RATE_LIMIT.includes(path)) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const rateMinute = Math.floor(Date.now() / 60000);
      const rateKey = "ratelimit:" + ip + ":" + rateMinute;
      const rateCount = parseInt(await env.LINKS_KV.get(rateKey) || "0");
      if (rateCount > 12) {
        return new Response("Too Many Requests", { status: 429, headers: { "Retry-After": "60" } });
      }
      if (Math.random() < 0.1) {
        await env.LINKS_KV.put(rateKey, String(rateCount + 1), { expirationTtl: 120 });
      }
    }

    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
      "Access-Control-Allow-Credentials": "false"
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Global maintenance check - block all non-admin requests
    if (path !== "" && !path.startsWith("api/admin") && !path.startsWith("api/maintenance-status")) {
      let globalMaint = null;
      try { globalMaint = await isMaintenance(env, "global"); } catch(e) { globalMaint = null; }
      if (globalMaint && globalMaint.active) {
        let authedUser = null;
        try { authedUser = await getAuthenticatedUser(request, env); } catch(e) { authedUser = null; }
        if (!authedUser || authedUser.role !== "admin") {
          if (path.startsWith("api/")) {
            return json({ error: st("maintenance_global", request), maintenance: true, note: globalMaint.note || "" }, 503, corsHeaders);
          }
          return html(MAINTENANCE_HTML(globalMaint.note || ""));
        }
      }
    }

    // Per-feature maintenance check for API routes
    if (path.startsWith("api/") && !path.startsWith("api/admin")) {
      var featureMap = {
        "api/auth/login": "login", "api/auth/register": "login",
        "api/shorten": "shorten", "api/bulk": "bulk",
        // More specific prefixes must come before "api/links" below — the loop
        // breaks on the first match, so order matters here.
        "api/links/bio": "link_in_bio",
        "api/links": "shorten", "api/stripe": "stripe",
        "api/qr-payment": "qr_payment", "api/voucher": "voucher",
        "api/redeem-voucher": "voucher", "api/export": "data_export",
        "api/webhooks": "webhooks", "api/analytics": "analytics",
        "api/password-link": "password_link", "api/qr": "qr_code",
        "api/extension": "extension",
        "api/ask-ai": "ai_assistant"
      };
      for (var routePrefix in featureMap) {
        if (path.startsWith(routePrefix)) {
          var featMaint = null;
          try { featMaint = await isMaintenance(env, featureMap[routePrefix]); } catch(e) { featMaint = null; }
          if (featMaint && featMaint.active) {
            let authedUser = null;
            try { authedUser = await getAuthenticatedUser(request, env); } catch(e) { authedUser = null; }
            if (!authedUser || (authedUser.role !== "admin" && authedUser.role !== "super")) {
              return json({ error: st("maintenance_feature_prefix", request) + ": " + (featMaint.note || featureMap[routePrefix]), maintenance: true, feature: featureMap[routePrefix] }, 503, corsHeaders);
            }
          }
          break;
        }
      }
    }

    try {
      try { await seedIfNeeded(env); } catch(e) { /* ignore seed errors */ }
      try { await seedBlogPostsIfNeeded(env); } catch(e) { /* ignore seed errors */ }

      // ===== 1. AUTH & USER =====
      if (path === "api/auth/register" && method === "POST") return handleRegister(request, env, corsHeaders);
      if (path === "api/auth/login" && method === "POST") return handleLogin(request, env, corsHeaders);
      if (path === "api/auth/logout" && method === "POST") return handleLogout(request, env, corsHeaders);
      if (path === "api/auth/me" && method === "GET") return handleMe(request, env, corsHeaders);
      if (path === "api/auth/token" && method === "POST") return handleGenerateToken(request, env, corsHeaders);
      if (path === "api/extension/token" && method === "POST") return handleGenerateExtensionToken(request, env, corsHeaders);
      if (path === "api/ask-ai" && method === "POST") return handleAskAi(request, env, corsHeaders);
      if (path === "api/auth/forgot" && method === "POST") return handleForgotPassword(request, env, corsHeaders);
      if (path === "api/auth/reset" && method === "POST") return handleResetPassword(request, env, corsHeaders);
      if (path === "api/auth/2fa/setup" && method === "POST") return handleSetup2fa(request, env, corsHeaders);
      if (path === "api/auth/2fa/verify" && method === "POST") return handleVerify2fa(request, env, corsHeaders);
      if (path === "api/auth/2fa/disable" && method === "POST") return handleDisable2fa(request, env, corsHeaders);
      if (path === "api/auth/google" && method === "GET") return handleGoogleAuthStart(request, env, corsHeaders);
      if (path === "api/auth/google/callback" && method === "GET") return handleGoogleAuthCallback(request, env, corsHeaders);

      // ===== 2. CORE LINK MANAGEMENT (dùng bởi giao diện web, qua cookie) =====
      if (path === "api/links" && method === "GET") return handleListLinks(request, env, url, corsHeaders);
      if (path === "api/links" && method === "POST") return handleCreateLink(request, env, url, corsHeaders);
      if (path === "api/links/bio" && method === "POST") return handleCreateBioPage(request, env, url, corsHeaders);
      if (path.startsWith("api/links/bio/") && path.endsWith("/click") && method === "POST") return handleBioLinkClick(request, env, decodeURIComponent(path.slice("api/links/bio/".length, -"/click".length)), corsHeaders);
      if (path.startsWith("api/links/bio/") && method === "PUT") return handleUpdateBioPage(request, env, url, decodeURIComponent(path.slice("api/links/bio/".length)), corsHeaders);
      if (path === "api/links/bulk" && method === "POST") return handleBulkCreateLinks(request, env, url, corsHeaders);
      if (path.startsWith("api/links/") && method === "PATCH") return handleUpdateLink(request, env, url, decodeURIComponent(path.slice(10)), corsHeaders);
      if (path.startsWith("api/links/") && path.endsWith("/restore") && method === "POST") return handleRestoreLink(request, env, decodeURIComponent(path.slice(10, -8)), corsHeaders);
      if (path.startsWith("api/links/") && path.endsWith("/force-delete") && method === "DELETE") return handleForceDeleteLink(request, env, decodeURIComponent(path.slice(10, -13)), corsHeaders);
      if (path.startsWith("api/links/") && method === "DELETE") return handleDeleteLink(request, env, decodeURIComponent(path.slice(10)), corsHeaders);

      // ===== 3. ANALYTICS (web) =====
      if (path === "api/analytics/overview" && method === "GET") return handleAnalyticsOverview(request, env, corsHeaders);
      if (path.startsWith("api/analytics/") && method === "GET") return handleGetLinkAnalytics(request, env, decodeURIComponent(path.slice(14)), corsHeaders);

      // ===== 4. PUBLIC REST API v1 (dùng API Token qua Authorization/x-api-key) =====
      if (path === "api/v1/shorten" && method === "POST") return handleApiShorten(request, env, url, corsHeaders);
      if (path === "api/v1/links" && method === "GET") return handleApiListLinks(request, env, url, corsHeaders);
      if (path.startsWith("api/v1/analytics/") && method === "GET") return handleApiAnalytics(request, env, decodeURIComponent(path.slice(17)), corsHeaders);
      // ===== 4a. WEBHOOKS (Pro/Super) =====
      if (path === "api/v1/webhooks" && method === "POST") return await handleCreateWebhook(request, env, corsHeaders);
      if (path === "api/v1/webhooks" && method === "GET") return await handleListWebhooks(request, env, corsHeaders);
      if (path.startsWith("api/v1/webhooks/") && method === "DELETE") return await handleDeleteWebhook(request, env, decodeURIComponent(path.slice(16)), corsHeaders);
      
      // ===== 4a2. DATA EXPORT (Pro/Super) =====
      if (path === "api/v1/export/csv" && method === "GET") return await handleExportCsv(request, env, url, corsHeaders);
      if (path === "api/v1/export/json" && method === "GET") return await handleExportJson(request, env, url, corsHeaders);
      if (path === "api/feedback" && method === "POST") return await handleFeedback(request, env, corsHeaders);
      
      // ===== 4b. TEAMS (Super/Admin) =====
      if (path === "api/v1/teams" && method === "POST") return await handleCreateTeam(request, env, corsHeaders);
      if (path === "api/v1/teams" && method === "GET") return await handleListTeams(request, env, corsHeaders);
      if (path === "api/v1/teams/members" && method === "POST") return await handleAddTeamMember(request, env, corsHeaders);
      if (path === "api/v1/teams/members" && method === "DELETE") return await handleRemoveTeamMember(request, env, corsHeaders);
      if (path.startsWith("api/v1/teams/") && method === "DELETE") return await handleDeleteTeam(request, env, decodeURIComponent(path.slice(13)), corsHeaders);
      if (path.startsWith("api/v1/teams/") && method === "PUT") return await handleUpdateTeam(request, env, decodeURIComponent(path.slice(13)), corsHeaders);
      
      // ===== 4c. CAMPAIGNS (Plus+) =====
      if (path === "api/v1/campaigns" && method === "GET") return await handleListCampaigns(request, env, corsHeaders);
      if (path.startsWith("api/v1/campaigns/") && method === "GET") return await handleCampaignHistory(request, env, decodeURIComponent(path.slice(17)), corsHeaders);
      
     // ===== 4b. VOUCHER (mã kích hoạt) =====
      if (path === "api/voucher/redeem" && method === "POST") return handleRedeemVoucher(request, env, corsHeaders);
      if (path === "api/admin/vouchers" && method === "GET") return handleListVouchers(request, env, corsHeaders);
      if (path === "api/admin/vouchers" && method === "POST") return handleCreateVoucher(request, env, corsHeaders);
      if (path.startsWith("api/admin/vouchers/") && method === "DELETE") return handleDeleteVoucher(request, env, decodeURIComponent(path.slice(19)), corsHeaders);

      // ===== 4c. STRIPE BILLING + VOUCHER + PAYMENT =====
      if (path === "api/billing/checkout" && method === "POST") { var mSt = await checkMaintenance(env, "stripe", corsHeaders, request); if (mSt) return mSt; return handleStripeCheckout(request, env, url, corsHeaders); }
      if (path === "api/billing/voucher-checkout" && method === "POST") { var mVc = await checkMaintenance(env, "voucher", corsHeaders, request); if (mVc) return mVc; return handleVoucherCheckout(request, env, url, corsHeaders); }
      if (path === "api/billing/qr-checkout" && method === "POST") { var mQr = await checkMaintenance(env, "qr_payment", corsHeaders, request); if (mQr) return mQr; return handleQrCheckout(request, env, corsHeaders); }
      if (path === "api/billing/qr-generate" && method === "POST") return handleQrGenerate(request, env, corsHeaders);
      if (path === "api/admin/qr-payments" && method === "GET") return handleListQrPayments(request, env, corsHeaders);
      if (path === "api/billing/qr-status" && method === "GET") return handleQrStatus(request, env, corsHeaders);
      if (path === "api/admin/qr-approve" && method === "POST") return handleApproveQrPayment(request, env, corsHeaders);
      if (path === "api/admin/qr-reject" && method === "POST") return handleRejectQrPayment(request, env, corsHeaders);
      if (path === "api/admin/qr-revoke" && method === "POST") return handleRevokeQrPayment(request, env, corsHeaders);
      if (path === "api/billing/qr-status-ack" && method === "POST") return handleQrStatusAck(request, env, corsHeaders);
      if (path === "api/payment-history" && method === "GET") return handlePaymentHistory(request, env, corsHeaders);
      if (path === "api/admin/promo-settings" && method === "GET") return handleGetPromoSettings(request, env, corsHeaders);
      if (path === "api/admin/promo-settings" && method === "POST") return handleSavePromoSettings(request, env, corsHeaders);
      if (path === "api/admin/payment-reports" && method === "GET") return handlePaymentReports(request, env, corsHeaders);
      if (path === "api/admin/overview" && method === "GET") return handleAdminOverview(request, env, corsHeaders);
      if (path === "api/admin/refresh-analytics" && method === "POST") {
        const authedUserRA = await getAuthenticatedUser(request, env);
        if (!authedUserRA || authedUserRA.role !== "admin") return requireAdminResponse(corsHeaders, request);
        const refreshResult = await refreshCfAnalyticsCache(env);
        return json(refreshResult, refreshResult.ok ? 200 : 502, corsHeaders);
      }
      if (path === "api/admin/purge-expired-links" && method === "POST") {
        const authedUserPurge = await getAuthenticatedUser(request, env);
        if (!authedUserPurge || authedUserPurge.role !== "admin") return requireAdminResponse(corsHeaders, request);
        const purgeResult = await purgeExpiredLinks(env);
        return json(purgeResult, 200, corsHeaders);
      }
      if (path === "api/webhook/stripe" && method === "POST") return handleStripeWebhook(request, env, corsHeaders);

      // ===== 4d. PASSWORD LINK VERIFY =====
      if (path.startsWith("api/verify/") && method === "POST") return handleVerifyPassword(request, env, decodeURIComponent(path.slice(11)), corsHeaders);

      // ===== 4e. QR CODE (trừ dailyQuota) =====
      if (path === "api/qr/create" && method === "POST") return handleCreateQr(request, env, corsHeaders);

      // ===== 4f. DYNAMIC QR (QR Studio — QR động, hạn mức theo tháng) =====
      if (path === "api/qr/dynamic" && method === "GET") return handleListDynamicQr(request, env, url, corsHeaders);
      if (path === "api/qr/dynamic" && method === "POST") return handleCreateDynamicQr(request, env, url, corsHeaders);
      if (path === "api/qr/dynamic/accept-terms" && method === "POST") return handleAcceptQrDynamicTerms(request, env, corsHeaders);
      if (path.startsWith("api/qr/dynamic/") && method === "PUT") return handleUpdateDynamicQr(request, env, url, decodeURIComponent(path.slice("api/qr/dynamic/".length)), corsHeaders);
      if (path.startsWith("api/qr/dynamic/") && method === "DELETE") return handleDeleteDynamicQr(request, env, decodeURIComponent(path.slice("api/qr/dynamic/".length)), corsHeaders);

      // ===== 4g. QR INSPECT (Scanner QR — public, read-only) =====
      if (path === "api/inspect" && method === "GET") return handleInspectQr(request, env, url, corsHeaders);

      // ===== 5. REPORTS (public submit) =====
      if (path === "api/reports" && method === "POST") return handleCreateReport(request, env, corsHeaders);

      // ===== 6. ADMIN ONLY =====
      if (path === "api/admin/users" && method === "GET") return handleAdminListUsers(request, env, corsHeaders);
      if (path === "api/admin/users/role" && method === "POST") return handleAdminSetRole(request, env, corsHeaders);
      if (path === "api/admin/reports" && method === "GET") return handleAdminListReports(request, env, corsHeaders);
      if (path === "api/admin/reports/dismiss" && method === "POST") return handleAdminDismissReport(request, env, corsHeaders);
      if (path === "api/admin/feedback" && method === "GET") return handleAdminListFeedback(request, env, corsHeaders);
      if (path === "api/admin/feedback/reply" && method === "POST") return handleAdminReplyFeedback(request, env, corsHeaders);
      if (path === "api/admin/feedback/status" && method === "POST") return handleAdminUpdateFeedbackStatus(request, env, corsHeaders);
      if (path === "api/admin/feedback/delete" && method === "POST") return handleAdminDeleteFeedback(request, env, corsHeaders);
      if (path === "api/admin/feedback/translate" && method === "POST") return handleAdminTranslateFeedback(request, env, corsHeaders);
      if (path === "api/admin/audit-logs" && method === "GET") return handleAdminListAuditLogs(request, env, corsHeaders);
      if (path === "api/admin/maintenance" && method === "GET") return handleGetMaintenance(request, env, corsHeaders);
      if (path === "api/admin/maintenance" && method === "POST") return handleSetMaintenance(request, env, corsHeaders);
      if (path === "api/maintenance-status" && method === "GET") return handleGetMaintenanceStatus(request, env, corsHeaders);
      if (path === "api/blacklist" && method === "GET") return handleGetBlacklist(request, env, corsHeaders);
      if (path === "api/blacklist" && method === "POST") return handleAddBlacklist(request, env, corsHeaders);
      if (path === "api/blacklist" && method === "DELETE") return handleRemoveBlacklist(request, env, corsHeaders);
      // ===== 6b. ADMIN: DELETE USER + BROADCAST NOTIFICATION =====
      if (path.startsWith("api/admin/users/") && method === "DELETE") return handleAdminDeleteUser(request, env, decodeURIComponent(path.slice(16)), corsHeaders);
      if (path === "api/admin/users/ban" && method === "POST") return handleAdminBanUser(request, env, corsHeaders);
      if (path === "api/admin/users/search" && method === "GET") return handleAdminSearchUsers(request, env, corsHeaders);
      if (path === "api/admin/settings" && method === "GET") return handleAdminGetSettings(request, env, corsHeaders);
      if (path === "api/admin/settings" && method === "POST") return handleAdminSaveSettings(request, env, corsHeaders);
      // ===== 6c. ADMIN: BLOG POSTS (stored in KV, no deploy needed to publish) =====
      if (path === "api/admin/blog" && method === "GET") return handleAdminListBlogPosts(request, env, corsHeaders);
      if (path === "api/admin/blog" && method === "POST") return handleAdminSaveBlogPost(request, env, corsHeaders, null);
      if (path.startsWith("api/admin/blog/") && method === "GET") return handleAdminGetBlogPost(request, env, decodeURIComponent(path.slice(15)), corsHeaders);
      if (path.startsWith("api/admin/blog/") && method === "PUT") return handleAdminSaveBlogPost(request, env, corsHeaders, decodeURIComponent(path.slice(15)));
      if (path.startsWith("api/admin/blog/") && method === "DELETE") return handleAdminDeleteBlogPost(request, env, decodeURIComponent(path.slice(15)), corsHeaders);
      if (path === "api/admin/vouchers/apply" && method === "POST") return handleAdminApplyVoucher(request, env, corsHeaders);
      if (path === "api/admin/notifications" && method === "POST") return handleAdminBroadcastNotification(request, env, corsHeaders);
      if (path === "api/admin/notifications" && method === "GET") return handleAdminListNotifications(request, env, corsHeaders);
      if (path.startsWith("api/admin/notifications/") && method === "DELETE") return handleAdminDeleteNotification(request, env, decodeURIComponent(path.slice(24)), corsHeaders);
      if (path === "api/notifications" && method === "GET") return handleGetMyNotifications(request, env, corsHeaders);
      if (path.startsWith("api/notifications/") && method === "POST") return handleMarkNotificationRead(request, env, decodeURIComponent(path.slice(18)), corsHeaders);

      // ===== 7. EXPORT WORKER SOURCE (Admin Portal > Cloudflare Worker Code tab) =====
      if (path === "api/export/cloudflare-worker" && method === "GET") return await handleExportWorker(request, env, corsHeaders);
      
      // ===== 7b. PRICING — redirect to SPA route =====
      if (path === "pricing") return Response.redirect(url.origin + "/#/pricing", 302);

      // ===== 8. ROOT =====
      if (!path) {
        return new Response(renderAppHtml(env), { headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://static.cloudflareinsights.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' data: blob: https://api.resend.com https://api.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.com.vn https://www.googleadservices.com https://ad.doubleclick.net https://static.cloudflareinsights.com https://cloudflareinsights.com; frame-src https://pagead2.googlesyndication.com; worker-src 'self' blob:;",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
          "Cross-Origin-Opener-Policy": "same-origin",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff"
        } });
      }
      // ===== 8b. FAVICON =====
      if (path === "favicon.ico") {
        const bytes = Uint8Array.from(atob(FAVICON_PNG_BASE64), c => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" } });
      }
      // Ảnh minh hoạ unDraw (đã đổi màu thương hiệu, chuyển sang PNG) dùng trong email hệ thống —
      // Gmail/Outlook không render SVG dưới bất kỳ hình thức nào nên phải host PNG thật ở đây,
      // tham chiếu qua <img src="https://shurlvn.com/email-assets/<name>.png"> trong buildEmailShell.
      // Lưu base64 trong KV (wrangler --path bị crash khi ghi thẳng binary trên Windows).
      if (path.startsWith("email-assets/") && path.endsWith(".png")) {
        const imgKey = path.slice("email-assets/".length, -".png".length);
        const b64 = await env.LINKS_KV.get("emailimg_b64:" + imgKey);
        if (!b64) return new Response("Not found", { status: 404 });
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" } });
      }
      // ===== 8c. QR-SCANNER LIBRARY (same-origin proxy — the UMD build's worker file
      // uses a relative dynamic import() that fails to resolve when loaded cross-origin
      // from a CDN, so we mirror both files under our own origin) =====
      if (path === "assets/qr-scanner.umd.min.js" || path === "assets/qr-scanner-worker.min.js") {
        const upstream = await fetch("https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/" + path.slice("assets/".length));
        if (!upstream.ok) return new Response("Not found", { status: 404 });
        return new Response(upstream.body, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable" } });
      }
      if (path === "robots.txt") {
        const robots = "User-agent: *\nAllow: /\nSitemap: https://shurlvn.com/sitemap.xml\n";
        return new Response(robots, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
      if (path === "sitemap.xml") {
        const today = new Date().toISOString().split("T")[0];
        const publishedPosts = await getPublishedBlogPosts(env);
        const urls = [
          { loc: "https://shurlvn.com/", changefreq: "daily", priority: "1.0", lastmod: today },
          { loc: "https://shurlvn.com/blog", changefreq: "weekly", priority: "0.8", lastmod: today }
        ].concat(publishedPosts.map(p => ({ loc: "https://shurlvn.com/blog/" + p.slug, changefreq: "monthly", priority: "0.7", lastmod: p.date })));
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` + urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n") + `
</urlset>`;
        return new Response(sitemap, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      }
      // ===== 8c. BLOG (server-rendered, indexable; posts stored in KV) =====
      if (path === "blog") {
        const publishedPosts = await getPublishedBlogPosts(env);
        return html(renderBlogIndexPage(publishedPosts, env));
      }
      if (path.startsWith("blog/")) {
        const slug = path.slice(5);
        const post = await getBlogPost(env, slug);
        if (post && isPostPublished(post)) return html(renderBlogPostPage(post, env));
        return html('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Không tìm thấy bài viết</title></head><body style="font-family:system-ui;text-align:center;padding:60px;"><h1>404</h1><p>Bài viết không tồn tại.</p><a href="/blog">← Xem tất cả bài viết</a></body></html>', 404);
      }
      // ===== 9. SHORTLINK REDIRECT (/:code) =====
      return await handleRedirect(request, env, url, path, ctx);
    } catch (err) {
      return json({ error: err && err.message ? err.message : "Internal Worker Error" }, 500, corsHeaders);
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshCfAnalyticsCache(env));
    ctx.waitUntil(purgeExpiredLinksLogged(env));
  }
};

// Wraps purgeExpiredLinks with a KV-persisted run log so admin/overview can show whether the
// hourly cleanup cron actually ran and what it did — a silent failure here would otherwise be
// invisible (there's no other signal that purgeExpiredLinks stopped running).
async function purgeExpiredLinksLogged(env) {
  const ranAt = new Date().toISOString();
  try {
    const result = await purgeExpiredLinks(env);
    await env.LINKS_KV.put("cron_purge_log", JSON.stringify({ ok: true, ranAt, checked: result.checked, purged: result.purged }));
  } catch (e) {
    await env.LINKS_KV.put("cron_purge_log", JSON.stringify({ ok: false, ranAt, error: String(e && e.message || e) }));
  }
}

// ===================== TIỆN ÍCH CHUNG =====================

// Server-side escaping for HTML generated directly by the Worker (redirect/pixel/warning pages) —
// distinct from the client-side esc() helper embedded in the SPA bundle, which only runs in the browser.

// Safely embeds a value as a JS string literal inside an inline <script> tag: JSON.stringify
// escapes quotes/backslashes/control chars, and the extra "<" -> "<" pass stops a value like
// "</script>" from closing the surrounding <script> tag at the HTML-parser level (before any JS runs).

// Blocklist-based SSRF guard for user-supplied webhook URLs — blocks the obvious internal/
// loopback/link-local/cloud-metadata targets. Doesn't defend against DNS rebinding (would need
// resolving the hostname and re-checking at fetch time), but stops the direct, common case.

// CSPRNG 6-digit code (e.g. password reset) — Math.random() is not cryptographically secure.

// ===================== KV: USERS =====================

// ===================== KV: LINKS =====================

// ===================== KV: DYNAMIC QR (QR động) =====================
// A dynamic QR is just a saved mapping { id -> shortUrl code + display/customization }.
// The destination is always resolved live from the underlying link record (getLink),
// so retargeting the link (via handleUpdateDynamicQr) changes where the printed QR goes
// without ever regenerating the QR image itself.

// ===================== KV: CLICKS =====================

// ===================== KV: REPORTS =====================

// ===================== KV: BLACKLIST =====================

// ===================== SEED DỮ LIỆU MẪU (chạy 1 lần duy nhất) =====================

// ===================== AUTH =====================

// ===================== HANDLERS: AUTH =====================
async function handleRegister(request, env, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, password, email } = body || {};

  if (!username || !password) {
    return json({ error: st("enter_user_pass", request) }, 400, corsHeaders);
  }
  if (username.length < 8 || username.length > 25) {
    return json({ error: st("username_length", request) }, 400, corsHeaders);
  }
  if (password.length < 9 || !/[A-Z]/.test(password)) {
    return json({ error: st("password_policy", request) }, 400, corsHeaders);
  }

  const cleanUser = username.trim().toLowerCase();
  const existing = await getUser(env, cleanUser);
  if (existing) {
    return json({ error: st("username_exists", request) }, 400, corsHeaders);
  }

  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const user = {
    id: "usr_" + randomHex(8),
    username: username.trim(),
    email: (email || "").trim(),
    role: "free",
    createdAt: new Date().toISOString(),
    salt, hash
  };
  await putUser(env, user);

  const welcomeLang = (body.lang || "vi").toLowerCase();
  const welcomeTpl = renderNotificationTemplate("welcome", welcomeLang, { username: user.username });
  if (welcomeTpl) {
    await notifyUser(env, {
      username: user.username, type: "welcome", from: "system",
      title: welcomeTpl.title, message: welcomeTpl.message,
      sendEmailToo: !!user.email, emailSubject: welcomeTpl.emailSubject, emailHtml: welcomeTpl.emailHtml
    });
  }

  const sessionToken = randomHex(32);
  await env.LINKS_KV.put("session:" + sessionToken, cleanUser, { expirationTtl: SESSION_TTL });

  return json({ ok: true, user: safeUser(user) }, 200, corsHeaders, {
    "Set-Cookie": setSessionCookieHeader(sessionToken, SESSION_TTL)
  });
}

async function handleLogin(request, env, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, password, totpCode } = body || {};

  if (!username || !password) {
    return json({ error: st("enter_user_pass", request) }, 400, corsHeaders);
  }

  const cleanUser = username.trim().toLowerCase();
  // Khóa theo username (không chỉ theo IP) — chặn brute-force dò mật khẩu 1 tài khoản
  // bằng cách đổi IP để né rate-limit chung.
  const attemptsKey = "login_attempts:" + cleanUser;
  const attempts = parseInt(await env.LINKS_KV.get(attemptsKey) || "0");
  if (attempts >= LOGIN_MAX_ATTEMPTS) {
    return json({ error: st("login_too_many_attempts", request) }, 429, corsHeaders);
  }

  async function recordFailedAttempt() {
    await env.LINKS_KV.put(attemptsKey, String(attempts + 1), { expirationTtl: LOGIN_LOCKOUT_TTL });
    // Global counter for admin visibility (separate from the per-username lockout above,
    // which only tracks enough to lock one account, not overall failed-login volume).
    const dayKey = "failedlogin_count:" + new Date().toISOString().slice(0, 10);
    const dayCount = parseInt(await env.LINKS_KV.get(dayKey) || "0");
    await env.LINKS_KV.put(dayKey, String(dayCount + 1), { expirationTtl: 2 * 86400 });
  }

  const user = await getUser(env, cleanUser);
  if (!user) {
    await recordFailedAttempt();
    return json({ error: st("invalid_credentials", request) }, 401, corsHeaders);
  }
  if (user.banned) {
    return json({ error: st("account_locked", request) }, 403, corsHeaders);
  }
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) {
    await recordFailedAttempt();
    return json({ error: st("invalid_credentials", request) }, 401, corsHeaders);
  }

  // Kiểm tra 2FA (chỉ admin)
  if (user.totpEnabled && user.totpSecret){
    if (!totpCode){
      return json({ requireTotp: true, message: "Vui lòng nhập mã TOTP từ Google Authenticator" }, 200, corsHeaders);
    }
    const expectedCode = await generateTotpCode(user.totpSecret);
    if (totpCode !== expectedCode){
      await recordFailedAttempt();
      return json({ error: st("totp_wrong", request) }, 401, corsHeaders);
    }
  }

  await env.LINKS_KV.delete(attemptsKey);

  const sessionToken = randomHex(32);
  await env.LINKS_KV.put("session:" + sessionToken, cleanUser, { expirationTtl: SESSION_TTL });

  return json({ ok: true, user: safeUser(user) }, 200, corsHeaders, {
    "Set-Cookie": setSessionCookieHeader(sessionToken, SESSION_TTL)
  });
}

async function handleLogout(request, env, corsHeaders) {
  const cookies = parseCookies(request);
  const sessionToken = cookies[SESSION_COOKIE];
  if (sessionToken) {
    await env.LINKS_KV.delete("session:" + sessionToken);
  }
  return json({ ok: true }, 200, corsHeaders, { "Set-Cookie": clearSessionCookieHeader() });
}

async function handleGoogleAuthStart(request, env, corsHeaders) {
  if (!env.GOOGLE_CLIENT_ID) {
    return json({ error: st("google_not_configured", request) }, 500, corsHeaders);
  }
  const url = new URL(request.url);
  const redirectUri = url.origin + "/api/auth/google/callback";
  const state = randomHex(16);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  return new Response(null, {
    status: 302,
    headers: {
      "Location": authUrl.toString(),
      "Set-Cookie": `${OAUTH_STATE_COOKIE}=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`
    }
  });
}

async function handleGoogleAuthCallback(request, env, corsHeaders) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");
  const cookies = parseCookies(request);
  const expectedState = cookies[OAUTH_STATE_COOKIE];

  function redirectToLogin(errCode) {
    const loginUrl = url.origin + "/" + (errCode ? "?google_error=" + encodeURIComponent(errCode) : "") + "#/login";
    return new Response(null, {
      status: 302,
      headers: { "Location": loginUrl, "Set-Cookie": clearOauthStateCookieHeader() }
    });
  }

  if (errorParam) return redirectToLogin(errorParam);
  if (!code || !state || !expectedState || state !== expectedState) return redirectToLogin("invalid_state");
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return redirectToLogin("not_configured");

  const redirectUri = url.origin + "/api/auth/google/callback";

  let tokenData;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString()
    });
    tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) throw new Error("token_exchange_failed");
  } catch (e) {
    return redirectToLogin("token_exchange_failed");
  }

  let profile;
  try {
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { "Authorization": "Bearer " + tokenData.access_token }
    });
    profile = await profileRes.json();
    if (!profileRes.ok || !profile.sub) throw new Error("profile_fetch_failed");
  } catch (e) {
    return redirectToLogin("profile_fetch_failed");
  }

  if (!profile.email || profile.email_verified === false) {
    return redirectToLogin("email_not_verified");
  }

  const googleEmail = String(profile.email).trim().toLowerCase();
  const googleSub = String(profile.sub);

  let username = await env.LINKS_KV.get("googleid:" + googleSub);
  let user = username ? await getUser(env, username) : null;

  if (!user) {
    // Lần đầu đăng nhập Google — KHÔNG tự gộp vào tài khoản có sẵn theo email, vì đăng ký
    // thường (handleRegister) không xác minh email: kẻ xấu có thể đăng ký trước bằng email
    // của nạn nhân, rồi khi nạn nhân đăng nhập Google bằng email đó sẽ bị gộp vào tài khoản
    // kẻ xấu đã tạo sẵn (mà kẻ xấu vẫn có mật khẩu truy cập). Luôn tạo tài khoản mới, việc
    // liên kết tài khoản có sẵn (nếu muốn) nên là thao tác chủ động của user khi đã đăng nhập.
    let base = googleEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    if (base.length < 3) base = (base + "user").slice(0, 20);
    let candidate = base;
    let suffix = 0;
    while (await getUser(env, candidate)) {
      suffix++;
      candidate = (base + suffix).slice(0, 25);
    }
    user = {
      id: "usr_" + randomHex(8),
      username: candidate,
      email: profile.email,
      role: "free",
      createdAt: new Date().toISOString(),
      authProvider: "google"
    };
    await putUser(env, user);
    await env.LINKS_KV.put("googleid:" + googleSub, user.username.toLowerCase());

    const welcomeTpl = renderNotificationTemplate("welcome", "vi", { username: user.username });
    if (welcomeTpl) {
      await notifyUser(env, {
        username: user.username, type: "welcome", from: "system",
        title: welcomeTpl.title, message: welcomeTpl.message,
        sendEmailToo: true, emailSubject: welcomeTpl.emailSubject, emailHtml: welcomeTpl.emailHtml
      });
    }
  }

  if (user.banned) return redirectToLogin("account_banned");

  const sessionToken = randomHex(32);
  await env.LINKS_KV.put("session:" + sessionToken, user.username.toLowerCase(), { expirationTtl: SESSION_TTL });

  const headers = new Headers();
  headers.set("Location", url.origin + "/#/dashboard");
  headers.append("Set-Cookie", setSessionCookieHeader(sessionToken, SESSION_TTL));
  headers.append("Set-Cookie", clearOauthStateCookieHeader());
  return new Response(null, { status: 302, headers: headers });
}

async function handleMe(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) {
    return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  }

  // Tự động hạ role nếu hết hạn
  if (user.roleExpiry && new Date(user.roleExpiry) < new Date()) {
    user.role = "free";
    delete user.roleExpiry;
    // getAuthenticatedUser() returns a sanitized copy without salt/hash — persisting it
    // directly would silently wipe the user's password. Fetch the full record to save instead.
    const fullUser = await getUser(env, user.username);
    if (fullUser) {
      fullUser.role = "free";
      delete fullUser.roleExpiry;
      await putUser(env, fullUser);
    }
  }

  try { await env.LINKS_KV.put("lastseen:" + user.username.toLowerCase(), String(Date.now()), { expirationTtl: 3600 }); } catch(e) {}

  return json({ user, limits: await getEffectiveTierConfig(env, user.role) }, 200, corsHeaders);
}

async function handleGenerateToken(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const user = await getUser(env, authedUser.username);
  if (!user) return json({ error: st("user_not_found", request) }, 400, corsHeaders);
  if (user.role === "guest" || user.role === "free") {
    return json({ error: st("api_pro_only", request) }, 400, corsHeaders);
  }

  if (user.apiToken) {
    await env.LINKS_KV.delete("apitoken:" + user.apiToken);
  }
  const newToken = `shurl_${user.role}_${randomHex(18)}`;
  user.apiToken = newToken;
  await putUser(env, user);
  await env.LINKS_KV.put("apitoken:" + newToken, user.username.toLowerCase());

  return json({ ok: true, apiToken: newToken }, 200, corsHeaders);
}

// Separate from handleGenerateToken: this one is open to every tier (not just Pro/Super).
// It powers the browser extension's Link Manager (read links + quick-shorten), which
// doesn't touch the paid API quota, so it's kept as its own token field (user.extToken)
// rather than reusing user.apiToken. Both are looked up the same way by
// getAuthenticatedUser() via the shared "apitoken:<token>" -> username KV prefix.
async function handleGenerateExtensionToken(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const user = await getUser(env, authedUser.username);
  if (!user) return json({ error: st("user_not_found", request) }, 400, corsHeaders);

  if (user.extToken) {
    await env.LINKS_KV.delete("apitoken:" + user.extToken);
  }
  const newToken = `shurlext_${randomHex(18)}`;
  user.extToken = newToken;
  await putUser(env, user);
  await env.LINKS_KV.put("apitoken:" + newToken, user.username.toLowerCase());

  return json({ ok: true, extToken: newToken }, 200, corsHeaders);
}

async function handleAskAi(request, env, corsHeaders) {
  const ip = getClientIp(request);
  const rateKey = "airate:" + ip + ":" + Math.floor(Date.now() / 3600000);
  const rateCount = parseInt(await env.LINKS_KV.get(rateKey) || "0");
  if (rateCount >= 20) {
    return json({ reply: "Bạn hỏi hơi nhanh — vui lòng đợi một lát rồi thử lại, hoặc xem hướng dẫn tại /blog." }, 200, corsHeaders);
  }
  await env.LINKS_KV.put(rateKey, String(rateCount + 1), { expirationTtl: 3600 });

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const message = (body && body.message || "").trim().slice(0, 500);
  const history = Array.isArray(body && body.history) ? body.history.slice(-6) : [];
  if (!message) return json({ error: "Thiếu nội dung câu hỏi." }, 400, corsHeaders);

  const messages = [{ role: "system", content: AI_ASSISTANT_SYSTEM_PROMPT }];
  for (const h of history) {
    if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
      messages.push({ role: h.role, content: h.content.slice(0, 500) });
    }
  }
  messages.push({ role: "user", content: message });

  try {
    const aiResult = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages, max_tokens: 500 });
    const reply = (aiResult && aiResult.response) ? aiResult.response.trim() : "";
    if (!reply) throw new Error("empty response");
    return json({ reply }, 200, corsHeaders);
  } catch (err) {
    console.error("ask-ai failed:", err);
    return json({ reply: "Xin lỗi, trợ lý AI đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút, hoặc xem hướng dẫn tại /blog.", degraded: true }, 200, corsHeaders);
  }
}

// ===================== QUÊN MẬT KHẨU (BACKEND) =====================

// Nhãn giao diện dùng chung cho khung email chuyên nghiệp (buildEmailShell) — brand tagline,
// điều khoản/chính sách, và 2 nhãn "Tài khoản"/"Gói" dùng trong khung chi tiết của các email
// thông báo tự động. Tách riêng khỏi nội dung từng email để không lặp lại ở mọi template.

// Khung email chuyên nghiệp dùng chung cho MỌI email hệ thống (reset password, voucher, chào
// mừng, thanh toán, cảnh báo bảo mật, admin broadcast) — nền kem ngoài, card trắng, khung chi
// tiết, nút CTA, footer có lý do nhận email + link hỗ trợ/điều khoản. Chỉ dùng inline style +
// <table> phẳng (không lồng bảng sâu — Gmail tự thu gọn thành "..." nếu lồng quá nhiều lớp) để
// tương thích rộng với Gmail/Outlook. Không dùng SVG cho phần trang trí — Gmail/Outlook không
// render SVG dưới bất kỳ hình thức nào (đã xác nhận qua email thật), chỉ dùng màu nền + chữ.

// Nhà cung cấp email duy nhất cho toàn bộ hệ thống — dùng chung cho reset password, voucher,
// và các thông báo tự động (đăng ký/thanh toán) qua notifyUser(). shurlvn.com đã verify trong
// Resend nên gửi được tới bất kỳ user nào, không giới hạn như sandbox onboarding@resend.dev.

// Điểm gọi thông báo dùng chung — ghi in-app notification (đúng shape đang dùng ở khắp nơi:
// notif:user:<username>:<id>) và, nếu truyền sendEmailToo + emailSubject/emailHtml, gửi thêm
// email qua sendEmail(). Không đổi hành vi các nơi gọi cũ (chỉ gộp code), chỉ những chỗ mới
// (đăng ký, thanh toán, admin broadcast) mới cần bật sendEmailToo.

// Gộp pattern "báo cho mọi admin" lặp lại ở nhiều nơi (báo cáo vi phạm, góp ý mới, thanh toán
// chờ duyệt...) — mỗi admin nhận 1 notif riêng (id riêng) qua notifyUser().

async function handleForgotPassword(request, env, corsHeaders) {
  try {
    let body;
    try { body = await request.json(); } catch (e) { body = {}; }
    const username = (body.username || "").trim().toLowerCase();
    const lang = (body.lang || "vi").toLowerCase();

    if (!username) return json({ error: "Thiếu tên đăng nhập" }, 400, corsHeaders);

    const user = await getUser(env, username);
    if (!user) return json({ success: true });
    if (!user.email) return json({ error: "Tài khoản chưa có email khôi phục" }, 400, corsHeaders);

    const code = randomSixDigitCode();
    await env.LINKS_KV.put("pw_reset:" + username, JSON.stringify({
      code: code,
      attempts: 0
    }), { expirationTtl: PW_RESET_TTL });

    const ok = await sendResetEmail(env, user.email, lang, code);
    if (!ok) return json({ error: "Không gửi được email. Vui lòng thử lại." }, 500, corsHeaders);

    return json({ success: true });
  } catch (e) {
    return json({ error: "Lỗi hệ thống: " + e.message }, 500, corsHeaders);
  }
}

async function handleResetPassword(request, env, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const username = (body.username || "").trim();
  const code = (body.code || "").trim();
  const newPassword = body.new_password || "";

  if (!username || !code || !newPassword) return json({ error: "Thiếu thông tin" }, 400, corsHeaders);
  if (newPassword.length < 9) return json({ error: "Mật khẩu phải tối thiểu 9 ký tự" }, 400, corsHeaders);

  const rawReset = await env.LINKS_KV.get("pw_reset:" + username.toLowerCase());
  if (!rawReset) return json({ error: "Mã hết hạn hoặc không tồn tại" }, 400, corsHeaders);
  const resetData = JSON.parse(rawReset);

  if (resetData.attempts >= 5) {
    await env.LINKS_KV.delete("pw_reset:" + username.toLowerCase());
    return json({ error: "Nhập sai mã quá nhiều lần" }, 429, corsHeaders);
  }
  if (resetData.code !== code) {
    resetData.attempts++;
    await env.LINKS_KV.put("pw_reset:" + username.toLowerCase(), JSON.stringify(resetData), { expirationTtl: PW_RESET_TTL });
    return json({ error: "Mã xác minh không đúng" }, 401, corsHeaders);
  }

  const user = await getUser(env, username.toLowerCase());
  if (!user) return json({ error: "Không tìm thấy tài khoản" }, 404, corsHeaders);

  const salt = randomHex(16);
  user.salt = salt;
  user.hash = await hashPassword(newPassword, salt);

  await putUser(env, user);
  await env.LINKS_KV.delete("pw_reset:" + username.toLowerCase());

  return json({ success: true });
}
// ===================== TOTP 2FA (Admin) =====================

// Tạo secret key TOTP (base32)
function generateTotpSecret(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 20; i++){
    secret += chars[(bytes[i] & 248) >> 3];
  }
  return secret;
}

// Tạo TOTP code từ secret + thời gian
async function generateTotpCode(secret, timeStep){
  const time = Math.floor(Date.now() / 30000);
  const timeBuf = new ArrayBuffer(8);
  const timeView = new DataView(timeBuf);
  timeView.setUint32(0, Math.floor(time / 0x100000000));
  timeView.setUint32(4, time & 0xFFFFFFFF);

  // Decode base32 secret
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (let i = 0; i < secret.length; i++){
    const val = chars.indexOf(secret[i]);
    if (val >= 0) bits += val.toString(2).padStart(5, "0");
  }
  const keyBytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < keyBytes.length; i++){
    keyBytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }

  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, timeBuf);
  const sigBytes = new Uint8Array(sig);
  const offset = sigBytes[sigBytes.length - 1] & 0x0F;
  const code = ((sigBytes[offset] & 0x7F) << 24) | ((sigBytes[offset + 1] & 0xFF) << 16) | ((sigBytes[offset + 2] & 0xFF) << 8) | (sigBytes[offset + 3] & 0xFF);
  return String(code % 1000000).padStart(6, "0");
}

// Tạo otpauth URL cho QR code
function getOtpAuthUrl(secret, username, domain){
  return "otpauth://totp/SHURL:" + encodeURIComponent(username) + "?secret=" + secret + "&issuer=SHURL&period=30&digits=6";
}

async function handleSetup2fa(request, env, corsHeaders){
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Chỉ admin mới được bật 2FA" }, 403, corsHeaders);

  const fullUser = await getUser(env, user.username);
  if (fullUser.totpSecret){
    return json({ error: "2FA đã được bật. Vui lòng tắt trước nếu muốn thiết lập lại." }, 400, corsHeaders);
  }

  const secret = generateTotpSecret();
  const domain = "shorturl.nguyennha24595.workers.dev";
  const otpUrl = getOtpAuthUrl(secret, user.username, domain);
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(otpUrl);

  // Lưu secret tạm thời (chưa verify)
  await env.LINKS_KV.put("totp_pending:" + user.username, secret, { expirationTtl: 300 });

  return json({ ok: true, secret: secret, qrUrl: qrUrl, otpUrl: otpUrl }, 200, corsHeaders);
}

async function handleVerify2fa(request, env, corsHeaders){
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Chỉ admin mới được bật 2FA" }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const code = (body.code || "").trim();

  const pendingSecret = await env.LINKS_KV.get("totp_pending:" + user.username);
  if (!pendingSecret) return json({ error: "Phiên thiết lập hết hạn. Vui lòng thử lại." }, 400, corsHeaders);

  const expectedCode = await generateTotpCode(pendingSecret);
  if (code !== expectedCode) return json({ error: st("totp_wrong", request) }, 401, corsHeaders);

  // Lưu secret vĩnh viễn
  const fullUser = await getUser(env, user.username);
  fullUser.totpSecret = pendingSecret;
  fullUser.totpEnabled = true;
  await putUser(env, fullUser);
  await env.LINKS_KV.delete("totp_pending:" + user.username);

  return json({ ok: true, message: "2FA đã được bật thành công!" }, 200, corsHeaders);
}

async function handleDisable2fa(request, env, corsHeaders){
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Chỉ admin mới được tắt 2FA" }, 403, corsHeaders);

  const fullUser = await getUser(env, user.username);
  delete fullUser.totpSecret;
  delete fullUser.totpEnabled;
  await putUser(env, fullUser);

  return json({ ok: true, message: "2FA đã tắt." }, 200, corsHeaders);
}

// ===================== HANDLERS: BLACKLIST / SECURITY CHECKS =====================

// ===================== HANDLERS: QUOTA =====================
// Admin có thể override dailyLinks/maxBulkBatch/monthlyApiLimit theo từng gói ở tab Cài đặt
// (sys:settings.tierOverrides) — merge lên trên TIER_CONFIG mặc định. Cache 30s như các list
// khác trong file này (env._linksCache, env._usersCache) để không đọc KV trên mỗi request.

// ===================== HANDLERS: LINKS (CORE) =====================

async function createLinkInternal(env, { url: targetUrl, owner, role, customCode, title, campaign, tags, expiryDate, customDomain, password, pixels, abUrls, abPercentages, deepLinks }) {
  if (!targetUrl || !targetUrl.startsWith("http")) {
    const e = new Error("URL_INVALID"); e.code = "URL_INVALID"; throw e;
  }
  if (await isDomainBlacklisted(env, targetUrl)) {
    const e = new Error("DOMAIN_BLACKLISTED"); e.code = "DOMAIN_BLACKLISTED"; throw e;
  }

  let code = customCode ? customCode.trim().replace(/[^a-zA-Z0-9_-]/g, "") : "";
  if (code) {
    if (await isKeywordBlacklisted(env, code, role)) {
      const e = new Error("KEYWORD_BLOCKED"); e.code = "KEYWORD_BLOCKED"; e.codeData = { code }; throw e;
    }
    if (await getLink(env, code)) {
      const e = new Error("CODE_TAKEN"); e.code = "CODE_TAKEN"; e.codeData = { code }; throw e;
    }
  } else {
    let attempts = 0;
    do {
      code = generateCode(attempts > 5 ? 7 : 6);
      attempts++;
    } while (await getLink(env, code));
  }

  let calculatedExpiry = null;
  if (role === "guest") {
    calculatedExpiry = new Date(Date.now()  + 1000 * 60 * 60 * 24 * 30).toISOString();
  } else if (expiryDate && isProOrAboveRole(role)) {
    calculatedExpiry = new Date(expiryDate).toISOString();
  } else {
    calculatedExpiry = null;
  }

  let safeTitle = (title || "").trim();
  if (!safeTitle) {
    try { safeTitle = new URL(targetUrl).hostname; } catch (e) { safeTitle = targetUrl; }
  }

  const newLink = {
    code,
    url: targetUrl,
    owner,
    role,
    createdAt: new Date().toISOString(),
    title: safeTitle,
    campaign: (campaign && campaign.trim()) || ((role === "pro" || role === "super") ? "Default" : undefined),
    tags: tags && tags.length > 0 ? tags : undefined,
    isEnabled: true,
    expiryDate: calculatedExpiry,
    customDomain: normalizeCustomDomain(customDomain),
    totalClicks: 0,
    destinationHistory: [],
    campaignHistory: campaign ? [{ campaign: campaign.trim(), changedAt: new Date().toISOString() }] : []
  };

  // === NEW FEATURES ===
  const limits = TIER_CONFIG[role];
  if (password && limits.hasPasswordLink) {
    const pwSalt = randomHex(16);
    const pwHash = await hashPassword(password, pwSalt);
    newLink.password = pwHash;
    newLink.passwordSalt = pwSalt;
    if (limits.hasPasswordBruteForce) newLink.pwMaxAttempts = 5;
    if (limits.hasPasswordBruteForce) newLink.pwLogAccess = true;
  }

  if (pixels && limits.hasPixel && Array.isArray(pixels)) {
    // Fix 1: Kiểm tra giới hạn số link có pixel (maxPixelLinks)
    if (limits.maxPixelLinks < 999999) {
      const allLinks = await listAllLinks(env);
      const pixelLinkCount = allLinks.filter(l => l.owner === owner && l.pixels && l.pixels.length > 0).length;
      if (pixelLinkCount >= limits.maxPixelLinks) {
        const e = new Error("PIXEL_LIMIT_REACHED"); e.code = "PIXEL_LIMIT_REACHED"; e.codeData = { limit: limits.maxPixelLinks }; throw e;
      }
    }
    newLink.pixels = pixels.slice(0, limits.maxPixelPerLink);
  }

  if (abUrls && limits.hasABTest && Array.isArray(abUrls)) {
    // Fix 2: Kiểm tra giới hạn số link A/B (maxABLinks)
    if (limits.maxABLinks < 999999) {
      const allLinks = await listAllLinks(env);
      const abLinkCount = allLinks.filter(l => l.owner === owner && l.abUrls && l.abUrls.length > 0).length;
      if (abLinkCount >= limits.maxABLinks) {
        const e = new Error("AB_LIMIT_REACHED"); e.code = "AB_LIMIT_REACHED"; e.codeData = { limit: limits.maxABLinks }; throw e;
      }
    }
    const filteredAbUrls = [];
    for (const u of abUrls.slice(0, limits.maxABUrls)) {
      if (!u || !u.trim()) continue;
      if (u.startsWith("http") && await isDomainBlacklisted(env, u)) continue;
      filteredAbUrls.push(u);
    }
    newLink.abUrls = filteredAbUrls;
    if (limits.hasCustomABPercent && abPercentages) {
      // Fix 3: Validate tổng % = 100
      const total = abPercentages.reduce((s, v) => s + v, 0);
      if (Math.abs(total - 100) > 1) {
        const e = new Error("AB_PERCENT_INVALID"); e.code = "AB_PERCENT_INVALID"; throw e;
      }
      newLink.abPercentages = abPercentages;
    }
  }

  if (deepLinks && limits.hasDeepLink) {
    var dlIos = deepLinks.ios || "";
    var dlAndroid = deepLinks.android || "";
    var dlFallback = deepLinks.fallback || targetUrl;
    if (dlFallback.startsWith("http") && await isDomainBlacklisted(env, dlFallback)) {
      dlFallback = targetUrl;
    }
    if (dlIos.startsWith("http") && await isDomainBlacklisted(env, dlIos)) {
      dlIos = "";
    }
    if (dlAndroid.startsWith("http") && await isDomainBlacklisted(env, dlAndroid)) {
      dlAndroid = "";
    }
    newLink.deepLinks = {
      ios: dlIos,
      android: dlAndroid,
      fallback: dlFallback
    };
  }

  await putLink(env, newLink);
  await incrementDailyQuota(env, owner, 1);
  return newLink;
}

// Link-in-bio pages reuse the "link:<code>" KV record (type:"bio" instead of a
// redirect target) so all existing cross-cutting infra — reports, blacklist,
// recordClick page-view counting, QR generation off the shortUrl — works for
// free. createLinkInternal isn't reusable directly since it's built around a
// single targetUrl rather than a list of sub-links.
async function createBioPageInternal(env, { owner, role, displayName, bio, links, customCode }) {
  const rawLinks = Array.isArray(links) ? links : [];
  const cleanLinks = [];
  for (const l of rawLinks.slice(0, MAX_BIO_SUBLINKS)) {
    const subUrl = (l && l.url || "").trim();
    const subTitle = (l && l.title || "").trim();
    if (!subUrl || !subUrl.startsWith("http") || !subTitle) continue;
    if (await isDomainBlacklisted(env, subUrl)) continue;
    cleanLinks.push({ id: "sl_" + randomHex(4), title: subTitle.slice(0, 80), url: subUrl, clicks: 0 });
  }
  if (cleanLinks.length === 0) {
    const e = new Error("BIO_LINKS_REQUIRED"); e.code = "BIO_LINKS_REQUIRED"; throw e;
  }

  let code = customCode ? customCode.trim().replace(/[^a-zA-Z0-9_-]/g, "") : "";
  if (code) {
    if (await isKeywordBlacklisted(env, code, role)) {
      const e = new Error("KEYWORD_BLOCKED"); e.code = "KEYWORD_BLOCKED"; e.codeData = { code }; throw e;
    }
    if (await getLink(env, code)) {
      const e = new Error("CODE_TAKEN"); e.code = "CODE_TAKEN"; e.codeData = { code }; throw e;
    }
  } else {
    let attempts = 0;
    do {
      code = generateCode(attempts > 5 ? 7 : 6);
      attempts++;
    } while (await getLink(env, code));
  }

  const newLink = {
    code,
    url: "",
    owner,
    role,
    type: "bio",
    createdAt: new Date().toISOString(),
    title: (displayName || "").trim().slice(0, 60) || owner,
    isEnabled: true,
    expiryDate: null,
    totalClicks: 0,
    destinationHistory: [],
    campaignHistory: [],
    bioProfile: { displayName: (displayName || "").trim().slice(0, 60), bio: (bio || "").trim().slice(0, 200) },
    bioLinks: cleanLinks
  };
  await putLink(env, newLink);
  return newLink;
}

async function handleListLinks(request, env, url, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return requireAuthResponse(corsHeaders, request);

  const allLinks = await listAllLinks(env);
  let filtered;
  if (user.role === "admin") {
    filtered = allLinks;
  } else {
    let ownerSet = new Set([user.username.toLowerCase()]);
    if (user.teamId) {
      const team = await getTeam(env, user.teamId);
      if (team && team.members) {
        team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); });
      }
    }
    filtered = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase()));
  }

  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const withShortUrl = filtered.map(l => ({ ...l, shortUrl: shortUrlFor(url, l.code, l.customDomain), isDeleted: l.isDeleted || false }));
  return json({ links: withShortUrl }, 200, corsHeaders);
}

async function handleCreateLink(request, env, url, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  let { url: targetUrl, customCode, title, campaign, tags, expiryDate, customDomain, password, pixels, abUrls, abPercentages, deepLinks } = body || {};

  if (!targetUrl) {
    return json({ error: st("url_required", request) }, 400, corsHeaders);
  }

  const authedUser = await getAuthenticatedUser(request, env);
  const role = authedUser ? authedUser.role : "guest";
  const owner = authedUser ? authedUser.username : `guest_${getClientIp(request).replace(/[^a-zA-Z0-9]/g, "_")}`;

  const userRecord = authedUser ? await getUser(env, authedUser.username) : null;
  const quotaCheck = await checkDailyQuota(env, userRecord, role, 1);
  if (!quotaCheck.ok) {
    return json({ success: false, error: { code: quotaCheck.code || "QUOTA_EXCEEDED", message: quotaCheck.message, upgrade_url: "#/pricing" } }, 403, corsHeaders);
  }
  // Guest quota bằng IP
  if (!authedUser) {
    const guestDailyLinks = (await getEffectiveTierConfig(env, "guest")).dailyLinks;
    const ip = getClientIp(request);
    const guestKey = "guest_quota:" + ip + ":" + todayStr();
    const guestCount = parseInt(await env.LINKS_KV.get(guestKey) || "0");
    if (guestCount >= guestDailyLinks) {
      return json({ error: "Khách chưa đăng ký chỉ được tạo " + guestDailyLinks + " link/ngày. Vui lòng đăng ký miễn phí." }, 403, corsHeaders);
    }
    await env.LINKS_KV.put(guestKey, String(guestCount + 1), { expirationTtl: 86400 });
  }

  if (customCode && customCode.trim() !== "") {
    if (!TIER_CONFIG[role].hasCustomAlias && role === "guest") {
      return json({ error: "Vui lòng đăng ký tài khoản (miễn phí) để đặt Custom Alias theo ý muốn." }, 403, corsHeaders);
    }
  }
  if (customDomain && customDomain.trim() !== "") {
    customDomain = normalizeCustomDomain(customDomain);
    if (!TIER_CONFIG[role].hasCustomDomain) {
      return json({ error: "Tính năng Custom Domain độc quyền chỉ dành cho gói SUPER hoặc ADMIN." }, 403, corsHeaders);
    }
  }

  try {
    const link = await createLinkInternal(env, { url: targetUrl, owner, role, customCode, title, campaign, tags, expiryDate, customDomain, password, pixels, abUrls, abPercentages, deepLinks });
    return json({ ok: true, link: { ...link, shortUrl: shortUrlFor(url, link.code, link.customDomain) } }, 200, corsHeaders);
  } catch (err) {
    return json({ error: err.message, errorCode: err.code || null, errorData: err.codeData || null }, 400, corsHeaders);
  }
}

async function handleBulkCreateLinks(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const role = authedUser.role;
  const owner = authedUser.username;
  const limits = TIER_CONFIG[role];

  if (!limits) {
    return json({ error: "Gói không hợp lệ." }, 403, corsHeaders);
  }
  if (!limits.hasBulkShorten) {
    return json({ error: "Gói của bạn chưa hỗ trợ tính năng Bulk Shortening (cần Pro hoặc Super)." }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }

  const rawUrls = Array.isArray(body.urls) ? body.urls : [];
  if (rawUrls.length === 0) {
    return json({ error: "Danh sách URLs không hợp lệ." }, 400, corsHeaders);
  }
  const effectiveMaxBulkBatch = (await getEffectiveTierConfig(env, role)).maxBulkBatch;
  if (rawUrls.length > effectiveMaxBulkBatch) {
    return json({ error: `Giới hạn mỗi lần tải lên tối đa ${effectiveMaxBulkBatch} links cho gói ${role.toUpperCase()}.` }, 400, corsHeaders);
  }

  // Normalize: chấp nhận cả string và object
  const items = [];
  for (const raw of rawUrls) {
    if (typeof raw === "string") {
      items.push({ url: raw.trim() });
    } else if (raw && typeof raw === "object" && raw.url) {
      items.push({
        url: String(raw.url).trim(),
        customCode: raw.customCode ? String(raw.customCode).trim() : undefined,
        title: raw.title,
        campaign: raw.campaign,
        tags: raw.tags
      });
    } else {
      items.push({ url: "", _invalid: true });
    }
  }

  // Lọc item hợp lệ để check quota
  const validItems = items.filter(function (i) { return i.url && i.url.startsWith("http"); });
  if (validItems.length === 0) {
    return json({ error: "Không có URL hợp lệ nào trong danh sách." }, 400, corsHeaders);
  }

  const userRecord = await getUser(env, owner);
  const quotaCheck = await checkDailyQuota(env, userRecord, role, validItems.length);
  if (!quotaCheck.ok) {
    return json({ error: quotaCheck.message }, 403, corsHeaders);
  }

  const created = [];
  const errors = [];

  for (const item of items) {
    if (item._invalid || !item.url || !item.url.startsWith("http")) {
      errors.push({ url: item.url || "", error: "URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)" });
      continue;
    }
    try {
      const link = await createLinkInternal(env, {
        url: item.url,
        owner: owner,
        role: role,
        customCode: item.customCode,
        title: item.title,
        campaign: item.campaign,
        tags: item.tags,
        expiryDate: undefined,
        customDomain: undefined
      });
      created.push({ ...link, shortUrl: shortUrlFor(url, link.code, link.customDomain) });
    } catch (e) {
      errors.push({ url: item.url, error: e.message || "Lỗi tạo link" });
    }
  }

  const status = created.length > 0 ? 200 : 400;
  return json({
    ok: created.length > 0,
    createdCount: created.length,
    errorCount: errors.length,
    created: created,
    errors: errors
  }, status, corsHeaders);
}

async function handleUpdateLink(request, env, url, code, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const role = authedUser.role;
  const owner = authedUser.username;

  if (!TIER_CONFIG[role].hasAdvancedManagement && role !== "admin") {
    return json({ error: "Tính năng nâng cao (đổi URL đích, bật/tắt link, quản lý chiến dịch) yêu cầu gói PRO hoặc SUPER." }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  let { url: newUrl, title, campaign, tags, isEnabled, expiryDate, customDomain } = body || {};

  const link = await getLink(env, code);
  if (!link) return json({ error: "Không tìm thấy link" }, 400, corsHeaders);
  if (role !== "admin" && link.owner !== owner) {
    const inTeam = authedUser.teamId ? await isUserInSameTeam(env, authedUser.username, link.owner) : false;
    if (!inTeam) return json({ error: "Bạn không có quyền chỉnh sửa link này" }, 400, corsHeaders);
  }

  if (newUrl && newUrl !== link.url) {
    if (!newUrl.startsWith("http")) {
      return json({ error: "URL mới không hợp lệ" }, 400, corsHeaders);
    }
    if (await isDomainBlacklisted(env, newUrl)) {
      return json({ error: "URL mới nằm trong danh sách đen bảo mật" }, 400, corsHeaders);
    }
    if (!link.destinationHistory) link.destinationHistory = [];
    link.destinationHistory.push({ oldUrl: link.url, changedAt: new Date().toISOString() });
    link.url = newUrl;
  }

  if (title !== undefined) link.title = title;
  if (campaign !== undefined && campaign !== link.campaign) {
    if (!link.campaignHistory) link.campaignHistory = [];
    if (link.campaign) link.campaignHistory.push({ campaign: link.campaign, changedAt: new Date().toISOString() });
    link.campaign = campaign;
  }
  if (tags !== undefined) link.tags = tags;
  if (isEnabled !== undefined) link.isEnabled = isEnabled;
  if (expiryDate !== undefined) link.expiryDate = expiryDate;
  if (customDomain !== undefined) {
    if (customDomain) customDomain = normalizeCustomDomain(customDomain);
    if (customDomain && !TIER_CONFIG[role].hasCustomDomain) {
      return json({ error: "Custom Domain chỉ dành cho gói SUPER hoặc ADMIN" }, 403, corsHeaders);
    }
    link.customDomain = normalizeCustomDomain(customDomain);
  }
  link.updatedAt = new Date().toISOString();

  await putLink(env, link);
  return json({ ok: true, link: { ...link, shortUrl: shortUrlFor(url, link.code, link.customDomain) } }, 200, corsHeaders);
}

// ===================== HANDLERS: LINK-IN-BIO =====================
async function handleCreateBioPage(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const role = authedUser.role;
  const owner = authedUser.username;
  const limit = (await getEffectiveTierConfig(env, role)).maxBioPages || 0;
  if (!limit) {
    return json({ error: "Trang Link-in-bio chỉ dành cho gói Plus trở lên.", code: "BIO_NOT_AVAILABLE", upgradeUrl: "#/pricing" }, 403, corsHeaders);
  }
  if (limit < 999999) {
    const allLinks = await listAllLinks(env);
    const existing = allLinks.filter(l => l.owner === owner && l.type === "bio" && !l.isDeleted).length;
    if (existing >= limit) {
      return json({ error: `Bạn đã đạt giới hạn ${limit} trang Link-in-bio của gói hiện tại.`, code: "BIO_LIMIT_REACHED" }, 403, corsHeaders);
    }
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { displayName, bio, links, customCode } = body || {};

  let bioPage;
  try {
    bioPage = await createBioPageInternal(env, { owner, role, displayName, bio, links, customCode });
  } catch (err) {
    if (err.code === "BIO_LINKS_REQUIRED") return json({ error: "Cần ít nhất 1 link hợp lệ (có tiêu đề và URL) cho trang Link-in-bio." }, 400, corsHeaders);
    if (err.code === "CODE_TAKEN") return json({ error: "Mã đã được sử dụng. Vui lòng chọn mã khác." }, 400, corsHeaders);
    if (err.code === "KEYWORD_BLOCKED") return json({ error: "Mã tùy chỉnh chứa từ khóa không được phép." }, 400, corsHeaders);
    return json({ error: err.message || "Không thể tạo trang." }, 400, corsHeaders);
  }

  return json({ ok: true, bioPage: { ...bioPage, shortUrl: shortUrlFor(url, bioPage.code, null) } }, 200, corsHeaders);
}

async function handleUpdateBioPage(request, env, url, code, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const link = await getLink(env, code);
  if (!link || link.type !== "bio") return json({ error: "Trang Link-in-bio không tồn tại." }, 404, corsHeaders);
  if (link.owner !== authedUser.username && authedUser.role !== "admin") {
    return json({ error: "Không có quyền" }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { displayName, bio, links, isEnabled } = body || {};

  if (displayName !== undefined || bio !== undefined) {
    link.bioProfile = {
      displayName: (displayName !== undefined ? displayName : link.bioProfile.displayName || "").trim().slice(0, 60),
      bio: (bio !== undefined ? bio : link.bioProfile.bio || "").trim().slice(0, 200)
    };
    link.title = link.bioProfile.displayName || link.title;
  }
  if (Array.isArray(links)) {
    const cleanLinks = [];
    for (const l of links.slice(0, MAX_BIO_SUBLINKS)) {
      const subUrl = (l && l.url || "").trim();
      const subTitle = (l && l.title || "").trim();
      if (!subUrl || !subUrl.startsWith("http") || !subTitle) continue;
      if (await isDomainBlacklisted(env, subUrl)) continue;
      // Preserve the existing click counter when a sub-link's id matches one already on the page.
      const existing = l.id && link.bioLinks.find(x => x.id === l.id);
      cleanLinks.push({ id: (existing && existing.id) || "sl_" + randomHex(4), title: subTitle.slice(0, 80), url: subUrl, clicks: (existing && existing.clicks) || 0 });
    }
    if (cleanLinks.length === 0) return json({ error: "Cần ít nhất 1 link hợp lệ." }, 400, corsHeaders);
    link.bioLinks = cleanLinks;
  }
  if (isEnabled !== undefined) link.isEnabled = isEnabled;
  link.updatedAt = new Date().toISOString();

  await putLink(env, link);
  return json({ ok: true, bioPage: { ...link, shortUrl: shortUrlFor(url, link.code, null) } }, 200, corsHeaders);
}

async function handleBioLinkClick(request, env, code, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { subLinkId } = body || {};
  if (!subLinkId) return json({ error: "Thiếu subLinkId" }, 400, corsHeaders);

  const link = await getLink(env, code);
  if (!link || link.type !== "bio") return json({ error: "Không tìm thấy" }, 404, corsHeaders);

  const sub = link.bioLinks.find(l => l.id === subLinkId);
  if (!sub) return json({ error: "Không tìm thấy link" }, 404, corsHeaders);
  sub.clicks = (sub.clicks || 0) + 1;
  await putLink(env, link);

  return json({ ok: true }, 200, corsHeaders);
}

async function handleDeleteLink(request, env, code, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  const raw = await env.LINKS_KV.get("link:" + code);
  if (!raw) return json({ error: "Link không tồn tại" }, 404, corsHeaders);
  const link = JSON.parse(raw);
  if (link.owner !== user.username && user.role !== "admin") {
    const inTeam = user.teamId ? await isUserInSameTeam(env, user.username, link.owner) : false;
    if (!inTeam) return json({ error: "Không có quyền" }, 403, corsHeaders);
  }
  link.isDeleted = true;
  link.deletedAt = new Date().toISOString();
  await env.LINKS_KV.put("link:" + code, JSON.stringify(link));
  if (user.role === "admin" && link.owner !== user.username) {
    await addAuditLog(env, user, "DELETE_LINK", { code, url: link.url, owner: link.owner }, request);
  }
  return json({ ok: true, message: "Đã chuyển vào thùng rác. Sẽ xóa sau 24h." }, 200, corsHeaders);
}
async function handleRestoreLink(request, env, code, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  const raw = await env.LINKS_KV.get("link:" + code);
  if (!raw) return json({ error: "Link không tồn tại" }, 404, corsHeaders);
  const link = JSON.parse(raw);
  if (link.owner !== user.username && user.role !== "admin") {
    const inTeam = user.teamId ? await isUserInSameTeam(env, user.username, link.owner) : false;
    if (!inTeam) return json({ error: "Không có quyền" }, 403, corsHeaders);
  }
  link.isDeleted = false;
  delete link.deletedAt;
  await env.LINKS_KV.put("link:" + code, JSON.stringify(link));
  return json({ ok: true, message: "Đã khôi phục link." }, 200, corsHeaders);
}

async function handleForceDeleteLink(request, env, code, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  const raw = await env.LINKS_KV.get("link:" + code);
  if (!raw) return json({ error: "Link không tồn tại" }, 404, corsHeaders);
  const link = JSON.parse(raw);
  if (link.owner !== user.username && user.role !== "admin") {
    const inTeam = user.teamId ? await isUserInSameTeam(env, user.username, link.owner) : false;
    if (!inTeam) return json({ error: "Không có quyền" }, 403, corsHeaders);
  }
  await deleteLinkKV(env, code);
  return json({ ok: true, message: "Đã xóa vĩnh viễn." }, 200, corsHeaders);
}

// ===================== HANDLERS: CLICK TRACKING & ANALYTICS =====================

async function handleGetLinkAnalytics(request, env, code, corsHeaders) {
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

async function handleAnalyticsOverview(request, env, corsHeaders) {
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

// ===================== HANDLERS: PUBLIC REST API v1 (dùng API Token) =====================
async function handleFeedback(request, env, corsHeaders) {
  try {
    var body = await request.json();
    var type = body.type || "other";
    var message = (body.message || "").trim();
    var email = (body.email || "").trim();
    var page = body.page || "";
    if (!message) return json({ success: false, error: "Message is required" }, 400, corsHeaders);
    if (message.length > 2000) return json({ success: false, error: "Message too long" }, 400, corsHeaders);
    var feedbackId = "fb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    var feedback = {
      id: feedbackId,
      type: type,
      message: message,
      email: email,
      page: page,
      status: "new",
      createdAt: new Date().toISOString()
    };
    // Try to get authenticated user (optional — feedback can be anonymous)
    try {
      var authedUser = await getAuthenticatedUser(request, env);
      if (authedUser) {
        feedback.username = authedUser.username;
        if (!email && authedUser.email) feedback.email = authedUser.email;
      }
    } catch(e) {}
    await env.LINKS_KV.put("feedback:" + feedbackId, JSON.stringify(feedback));
    // Send notification to all admin users
    try {
      await notifyAllAdmins(env, {
        type: "feedback",
        title: "Gop y moi tu " + (feedback.username || (feedback.email || "an danh")),
        message: feedback.message.substring(0, 200)
      });
    } catch(e) {}
    return json({ success: true, feedbackId: feedbackId }, 200, corsHeaders);
  } catch (e) {
    return json({ success: false, error: "Server error" }, 500, corsHeaders);
  }
}

async function handleApiShorten(request, env, url, corsHeaders) {
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

async function handleApiListLinks(request, env, url, corsHeaders) {
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

async function handleApiAnalytics(request, env, code, corsHeaders) {
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

// ===================== HANDLERS: QR CODE (trừ dailyQuota) =====================
async function handleCreateQr(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ error: "Vui lòng đăng nhập để tạo QR Code." }, 401, corsHeaders);

  const role = authedUser.role;
  const owner = authedUser.username;
  const userRecord = await getUser(env, owner);

  // Kiểm tra hạn mức daily
  const quotaCheck = await checkDailyQuota(env, userRecord, role, 1);
  if (!quotaCheck.ok) {
    return json({ error: quotaCheck.message }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { url: targetUrl, color, size, bgcolor, margin, format } = body || {};
  if (!targetUrl || !targetUrl.startsWith("http")) {
    return json({ error: "URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)" }, 400, corsHeaders);
  }

  // Trừ lượt
  await incrementDailyQuota(env, owner, 1);

  // Sinh QR image URL
  const qrColor = (color || "#6366f1").replace("#", "");
  const qrSize = parseInt(size) || 200;
  const qrFormat = (format === "svg") ? "svg" : "png";
  let qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=" + qrSize + "x" + qrSize + "&data=" + encodeURIComponent(targetUrl) + "&color=" + qrColor + "&format=" + qrFormat;

  const qrBgColor = bgcolor ? String(bgcolor).replace(/[^0-9a-fA-F]/g, "").slice(0, 6) : "";
  if (qrBgColor) qrSrc += "&bgcolor=" + qrBgColor;
  const qrMargin = parseInt(margin);
  const hasMargin = !isNaN(qrMargin) && qrMargin >= 0 && qrMargin <= 20;
  if (hasMargin) qrSrc += "&margin=" + qrMargin;

  return json({ ok: true, qrUrl: qrSrc, targetUrl: targetUrl, size: qrSize, color: qrColor, bgcolor: qrBgColor || null, margin: hasMargin ? qrMargin : null, format: qrFormat }, 200, corsHeaders);
}

// ===================== HANDLERS: DYNAMIC QR (QR động — QR Studio) =====================

// Anti bait-and-switch: a QR động's whole point is that its destination can change
// after the code is printed/shared — the exact opposite of what a payment link needs.
// Someone could set a real payment page as the destination to earn trust, then quietly
// swap it for a fraudulent one without the printed QR ever changing. So payment-looking
// URLs are refused as a QR động destination in both directions (create AND edit) — QR
// tĩnh (destination baked in, can never change) is the correct choice for those.
// This is a domain heuristic, not a guarantee: it catches common providers, not every
// possible payment page.

function looksLikePaymentUrl(u) {
  if (!u) return false;
  return PAYMENT_URL_PATTERNS.some(re => re.test(u));
}
function validateQrLogoDataUrl(logoDataUrl) {
  if (!logoDataUrl) return { ok: true, value: "" };
  if (typeof logoDataUrl !== "string" || !/^data:image\/(png|jpeg);base64,/.test(logoDataUrl)) {
    return { ok: false, error: "Logo không hợp lệ." };
  }
  // Client resizes to <=200x200 PNG before upload, so a valid logo is normally well
  // under this — this cap is just defense against a modified/direct API call.
  if (logoDataUrl.length > 300000) {
    return { ok: false, error: "Logo quá lớn." };
  }
  return { ok: true, value: logoDataUrl };
}

async function handleCreateDynamicQr(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const role = authedUser.role;
  const owner = authedUser.username;
  const userRecord = await getUser(env, owner);

  if (!userRecord.qrTermsAcceptedAt) {
    return json({ error: "Vui lòng đọc và đồng ý Cam kết sử dụng QR động trước khi tạo.", code: "QR_TERMS_NOT_ACCEPTED" }, 403, corsHeaders);
  }

  const quotaCheck = checkMonthlyDynamicQrQuota(userRecord, role);
  if (!quotaCheck.ok) {
    return json({ error: quotaCheck.message, code: quotaCheck.code, upgradeUrl: quotaCheck.upgradeUrl }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { shortCode, targetUrl, title, color, bgcolor, size, margin, dotStyle, logoDataUrl } = body || {};

  const logoCheck = validateQrLogoDataUrl(logoDataUrl);
  if (!logoCheck.ok) return json({ error: logoCheck.error }, 400, corsHeaders);

  let link;
  if (shortCode) {
    link = await getLink(env, shortCode);
    if (!link) return json({ error: "Không tìm thấy Short URL đã chọn." }, 404, corsHeaders);
    if (role !== "admin" && link.owner !== owner) {
      return json({ error: "Bạn không sở hữu Short URL này." }, 403, corsHeaders);
    }
    if (looksLikePaymentUrl(link.url)) {
      return json({ error: "Short URL này đang trỏ tới một trang thanh toán — không thể dùng cho QR động vì đích có thể bị đổi sau khi phát hành. Hãy dùng QR tĩnh cho nội dung thanh toán." }, 403, corsHeaders);
    }
  } else if (targetUrl) {
    if (looksLikePaymentUrl(targetUrl)) {
      return json({ error: "Không thể tạo QR động trỏ tới trang thanh toán — QR động cho phép đổi đích sau khi phát hành, tiềm ẩn rủi ro bị lợi dụng. Hãy dùng QR tĩnh (đích cố định) cho nội dung thanh toán." }, 403, corsHeaders);
    }
    const linkQuotaCheck = await checkDailyQuota(env, userRecord, role, 1);
    if (!linkQuotaCheck.ok) {
      return json({ error: linkQuotaCheck.message }, 403, corsHeaders);
    }
    try {
      link = await createLinkInternal(env, { url: targetUrl, owner, role });
    } catch (err) {
      return json({ error: err.message }, 400, corsHeaders);
    }
  } else {
    return json({ error: "Vui lòng chọn Short URL có sẵn hoặc nhập URL đích để tạo mới." }, 400, corsHeaders);
  }

  const qr = {
    id: generateQrId(),
    owner,
    code: link.code,
    title: (title || "").trim(),
    color: color || "#000000",
    bgcolor: bgcolor || "",
    size: parseInt(size) || 200,
    margin: (margin !== undefined && margin !== "" && !isNaN(parseInt(margin))) ? parseInt(margin) : null,
    dotStyle: VALID_QR_DOT_STYLES.includes(dotStyle) ? dotStyle : "square",
    logoDataUrl: logoCheck.value,
    createdAt: new Date().toISOString()
  };
  await putQrRecord(env, qr);
  await incrementMonthlyDynamicQrQuota(env, owner);

  return json({ ok: true, qr: qrRecordToResponse(qr, link, url, role), remaining: quotaCheck.remaining - 1, limit: quotaCheck.limit }, 200, corsHeaders);
}

async function handleAcceptQrDynamicTerms(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  // getAuthenticatedUser() returns a sanitized copy without salt/hash — persisting it
  // directly would silently wipe the user's password. Fetch the full record to save instead.
  const fullUser = await getUser(env, authedUser.username);
  if (!fullUser) return json({ error: "Không tìm thấy tài khoản." }, 400, corsHeaders);

  if (!fullUser.qrTermsAcceptedAt) {
    fullUser.qrTermsAcceptedAt = new Date().toISOString();
    await putUser(env, fullUser);
  }

  return json({ ok: true, qrTermsAcceptedAt: fullUser.qrTermsAcceptedAt }, 200, corsHeaders);
}

async function handleListDynamicQr(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const allQr = await listAllQrRecords(env);
  const mine = authedUser.role === "admin" ? allQr : allQr.filter(q => q.owner === authedUser.username);
  mine.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const withLinks = await Promise.all(mine.map(async (qr) => ({ qr, link: await getLink(env, qr.code) })));
  // A qr record with no link at all (not even a soft-deleted one) means its underlying link was
  // purged before the deleteLinkKV cascade existed — self-heal by dropping the orphan here
  // instead of showing a permanently-broken row (see deleteLinkKV above for the normal path).
  const orphaned = withLinks.filter(r => !r.link);
  if (orphaned.length) await Promise.all(orphaned.map(r => deleteQrRecord(env, r.qr.id)));
  const results = withLinks.filter(r => r.link).map(r => qrRecordToResponse(r.qr, r.link, url, authedUser.role));

  const role = authedUser.role;
  const userRecord = await getUser(env, authedUser.username);
  const quota = checkMonthlyDynamicQrQuota(userRecord, role);

  return json({ qrs: results, quota: { limit: quota.limit || 0, remaining: quota.ok ? quota.remaining : 0 } }, 200, corsHeaders);
}

async function handleUpdateDynamicQr(request, env, url, qrId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const qr = await getQrRecord(env, qrId);
  if (!qr) return json({ error: "Không tìm thấy QR động này." }, 404, corsHeaders);
  if (authedUser.role !== "admin" && qr.owner !== authedUser.username) {
    return json({ error: "Bạn không có quyền chỉnh sửa QR này." }, 403, corsHeaders);
  }

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { targetUrl, title, color, bgcolor, size, margin, dotStyle, logoDataUrl } = body || {};

  let logoCheck = { ok: true, value: qr.logoDataUrl };
  if (logoDataUrl !== undefined) {
    logoCheck = validateQrLogoDataUrl(logoDataUrl);
    if (!logoCheck.ok) return json({ error: logoCheck.error }, 400, corsHeaders);
  }

  const link = await getLink(env, qr.code);
  if (!link) return json({ error: "Short URL gốc của QR này không còn tồn tại." }, 404, corsHeaders);

  // Retargeting the destination is the whole point of a dynamic QR, so this is allowed
  // regardless of hasAdvancedManagement tier gating that applies to manual link edits.
  if (targetUrl && targetUrl !== link.url) {
    if (!targetUrl.startsWith("http")) {
      return json({ error: "URL đích mới không hợp lệ." }, 400, corsHeaders);
    }
    if (await isDomainBlacklisted(env, targetUrl)) {
      return json({ error: "URL đích mới nằm trong danh sách đen bảo mật." }, 400, corsHeaders);
    }
    if (looksLikePaymentUrl(targetUrl)) {
      return json({ error: "Không thể đổi đích QR động sang trang thanh toán — QR động có thể bị đổi đích sau này, tiềm ẩn rủi ro bị lợi dụng để lừa đảo. Hãy dùng QR tĩnh (đích cố định) cho nội dung thanh toán." }, 403, corsHeaders);
    }
    if (!link.destinationHistory) link.destinationHistory = [];
    link.destinationHistory.push({ oldUrl: link.url, changedAt: new Date().toISOString() });
    link.url = targetUrl;
    link.updatedAt = new Date().toISOString();
    await putLink(env, link);
  }

  if (title !== undefined) qr.title = title;
  if (color !== undefined) qr.color = color;
  if (bgcolor !== undefined) qr.bgcolor = bgcolor;
  if (size !== undefined) qr.size = parseInt(size) || qr.size;
  if (margin !== undefined) qr.margin = (margin === "" || margin === null) ? null : parseInt(margin);
  if (dotStyle !== undefined) qr.dotStyle = VALID_QR_DOT_STYLES.includes(dotStyle) ? dotStyle : qr.dotStyle;
  if (logoDataUrl !== undefined) qr.logoDataUrl = logoCheck.value;
  await putQrRecord(env, qr);

  return json({ ok: true, qr: qrRecordToResponse(qr, link, url, authedUser.role) }, 200, corsHeaders);
}

async function handleDeleteDynamicQr(request, env, qrId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);

  const qr = await getQrRecord(env, qrId);
  if (!qr) return json({ error: "Không tìm thấy QR động này." }, 404, corsHeaders);
  if (authedUser.role !== "admin" && qr.owner !== authedUser.username) {
    return json({ error: "Bạn không có quyền xoá QR này." }, 403, corsHeaders);
  }

  await deleteQrRecord(env, qrId);
  return json({ ok: true }, 200, corsHeaders);
}

// ===================== HANDLERS: QR INSPECTOR (Scanner QR) =====================
// Public, read-only lookup for whatever a scanned QR decodes to. Never records a click
// (unlike visiting the link itself) — this is purely "what would happen if I opened this?".
async function handleInspectQr(request, env, url, corsHeaders) {
  const reqUrl = new URL(request.url);
  const data = reqUrl.searchParams.get("data") || "";

  let parsed;
  try { parsed = new URL(data); } catch (e) { parsed = null; }
  if (!parsed || (parsed.protocol !== "http:" && parsed.protocol !== "https:")) {
    return json({ type: "text", raw: data }, 200, corsHeaders);
  }

  if (parsed.hostname === reqUrl.hostname) {
    const code = parsed.pathname.replace(/^\//, "").split("/")[0];
    const link = code ? await getLink(env, code) : null;
    if (link) {
      const qrRecords = await listAllQrRecords(env);
      const isDynamic = qrRecords.some(q => q.code === code);
      return json({
        type: "shurl_link",
        code,
        destination: link.url,
        isEnabled: link.isEnabled !== false,
        isExpired: !!(link.expiryDate && new Date(link.expiryDate) < new Date()),
        hasPassword: !!link.password,
        isDynamic
      }, 200, corsHeaders);
    }
  }

  return json({
    type: "url",
    hostname: parsed.hostname,
    isPaymentLike: looksLikePaymentUrl(data),
    isBlacklisted: await isDomainBlacklisted(env, data)
  }, 200, corsHeaders);
}

// ===================== HANDLERS: REPORTS =====================
async function handleCreateReport(request, env, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { code, reason } = body || {};
  if (!code) return json({ error: "Thiếu mã link" }, 400, corsHeaders);

  const link = await getLink(env, code);
  const report = {
    id: "rep_" + randomHex(6),
    code,
    url: link ? link.url : "unknown",
    reason: reason || "Báo cáo vi phạm an toàn",
    reportedAt: new Date().toISOString(),
    status: "pending"
  };
  await putReport(env, report);
  try {
    await notifyAllAdmins(env, {
      type: "warning",
      title: "Bao cao vi pham moi",
      message: "Link " + code + " bi bao cao: " + (reason || "Vi pham an toan")
    });
  } catch(e) {}
  return json({ ok: true, report }, 200, corsHeaders);
}
// ===================== RATE LIMIT MAT KHAU =====================

// ===================== HANDLERS: ADMIN =====================
async function handleAdminListUsers(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const users = await listAllUsers(env);
  return json({ users: users.map(safeUser) }, 200, corsHeaders);
}

async function handleAdminSetRole(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { username, role } = body || {};
  if (!username || !role) return json({ error: "Thiếu username hoặc role" }, 400, corsHeaders);
  if (!TIER_CONFIG[role]) return json({ error: "Hạng gói không hợp lệ" }, 400, corsHeaders);

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

async function handleAdminListReports(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const reports = await listReports(env);
  return json({ reports }, 200, corsHeaders);
}

async function handleAdminDismissReport(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  if (body && body.id) await deleteReport(env, body.id);
  await addAuditLog(env, authedUser, "DISMISS_REPORT", { reportId: body.id }, request);
  return json({ ok: true }, 200, corsHeaders);
}

async function handleAdminListFeedback(request, env, corsHeaders) {
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

async function handleAdminReplyFeedback(request, env, corsHeaders) {
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

async function handleAdminUpdateFeedbackStatus(request, env, corsHeaders) {
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

async function handleAdminDeleteFeedback(request, env, corsHeaders) {
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

async function handleAdminTranslateFeedback(request, env, corsHeaders) {
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
async function handleGetBlacklist(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);

  const bl = await getBlacklistRaw(env);
  return json({ domains: bl.domains, keywords: bl.keywords, defaults: DEFAULT_KEYWORDS }, 200, corsHeaders);
}

async function handleAddBlacklist(request, env, corsHeaders) {
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

async function handleRemoveBlacklist(request, env, corsHeaders) {
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

// ===================== AUDIT LOG =====================

async function handleAdminListAuditLogs(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders);
  const logs = await listAuditLogs(env, 200);
  return json({ logs }, 200, corsHeaders);
}

// ===================== HANDLERS: ADMIN =====================
async function handleExportWorker(request, env, corsHeaders) {
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

// ===================== BLOG (server-rendered, indexable by Google) =====================
// One-time seed data only — after the first request, posts live in KV (blog:<slug>) and are
// managed via /api/admin/blog. Editing this array after launch has no effect on production.

// ===================== REDIRECT & SAFETY WARNING =====================
async function handleRedirect(request, env, url, path, ctx) {
  const raw = await env.LINKS_KV.get("link:" + path);
  if (!raw) {
    return html('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Link không tồn tại</title></head><body style="font-family:system-ui;text-align:center;padding:60px;"><h1>404</h1><p>Link không tồn tại hoặc đã bị xoá.</p><a href="/">← Về trang chủ</a></body></html>', 404);
  }
  const link = JSON.parse(raw);

  if (link.isEnabled === false) {
    return html('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escHtml(st("link_disabled_title", request)) + '</title></head><body style="font-family:system-ui;text-align:center;padding:60px;"><h1>' + escHtml(st("link_disabled_title", request)) + '</h1><p>' + escHtml(st("link_disabled_desc", request)) + '</p></body></html>', 410);
  }

  if (link.expiryDate && new Date(link.expiryDate) < new Date()) {
    return html('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escHtml(st("link_expired_title", request)) + '</title></head><body style="font-family:system-ui;text-align:center;padding:60px;"><h1>' + escHtml(st("link_expired_title", request)) + '</h1><p>' + escHtml(st("link_expired_desc", request)) + '</p></body></html>', 410);
  }

  if (link.type === "bio") {
    ctx.waitUntil(recordClick(request, env, path, link));
    return renderBioPageHtml(link, url);
  }

  if (link.password) {
    const cookies = request.headers.get("Cookie") || "";
    const pwCookieMatch = cookies.includes("shurl_pw_" + path + "=ok");
    if (!pwCookieMatch) {
      return renderPasswordPage(path, url.origin, request);
    }
  }

  let destUrl = link.url;
  if (link.abUrls && link.abUrls.length > 0) {
    destUrl = pickABUrl(link.abUrls, link.abPercentages);
  }

  if (link.deepLinks) {
    const ua = request.headers.get("User-Agent") || "";
    if (/iPhone|iPad|iPod/i.test(ua) && link.deepLinks.ios) {
      destUrl = link.deepLinks.ios;
    } else if (/Android/i.test(ua) && link.deepLinks.android) {
      destUrl = link.deepLinks.android;
    }
    // Desktop/other UAs: keep destUrl as-is (link.url or the A/B pick above).
    // deepLinks.fallback always equals link.url at creation time, so applying it
    // here would silently override the A/B pick — see bug found via live testing.
  }

  if (link.pixels && link.pixels.length > 0) {
    ctx.waitUntil(recordClick(request, env, path, link));
    return renderPixelPage(destUrl, link.pixels);
  }

  ctx.waitUntil(recordClick(request, env, path, link));
  return Response.redirect(destUrl, 302);
}
function pickABUrl(urls, percentages) {
  if (!urls || urls.length === 0) return null;
  if (urls.length === 1) return urls[0];
  var rand = Math.random();
  if (percentages && percentages.length === urls.length) {
    // Fix 3: Validate tổng % = 100, nếu sai thì fallback chia đều
    var totalPct = 0;
    for (var i = 0; i < percentages.length; i++) totalPct += percentages[i];
    if (Math.abs(totalPct - 100) <= 1) {
      var cum = 0;
      for (var i = 0; i < urls.length; i++) {
        cum += percentages[i] / 100;
        if (rand < cum) return urls[i];
      }
    }
  }
  var idx = Math.floor(rand * urls.length);
  return urls[idx];
}

function renderPasswordPage(code, origin, request) {
  var pwTitle = escHtml(st("pw_page_title", request));
  return html(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + pwTitle + '</title>' +
    '<style>' +
    'body{font-family:system-ui;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}' +
    '.box{background:#1e293b;border-radius:16px;padding:32px;max-width:380px;width:90%;text-align:center;}' +
    'input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:16px;box-sizing:border-box;margin:8px 0;}' +
    'button{width:100%;padding:12px;border-radius:10px;border:none;background:#6366f1;color:#fff;font-size:16px;cursor:pointer;margin-top:8px;}' +
    'button:hover{background:#4f46e5;}' +
    '.err{color:#f87171;font-size:14px;margin-top:8px;display:none;}' +
    '</style></head><body>' +
    '<div class="box">' +
    '<h2>' + li('lock', 18) + ' ' + pwTitle + '</h2>' +
    '<p style="color:#94a3b8;font-size:14px;">' + escHtml(st("pw_page_prompt", request)) + '</p>' +
    '<input type="password" id="pw" placeholder="' + escHtml(st("pw_page_placeholder", request)) + '" onkeypress="if(event.key===\'Enter\')doVerify()">' +
    '<button onclick="doVerify()">' + escHtml(st("pw_page_btn", request)) + '</button>' +
    '<p class="err" id="err">' + escHtml(st("pw_page_wrong", request)) + '</p>' +
    '</div>' +
    '<script>' +
    'async function doVerify(){' +
    '  var pw=document.getElementById("pw").value;' +
    '  if(!pw)return;' +
    '  var r=await fetch("/api/verify/' + code + '",{' +
    '    method:"POST",' +
    '    headers:{"Content-Type":"application/json"},' +
    '    body:JSON.stringify({password:pw})' +
    '  });' +
    '  var d=await r.json();' +
    '  if(d.success){location.reload();}' +
    '  else{document.getElementById("err").style.display="block";}' +
    '}' +
    '</script></body></html>',
    200
  );
}

function renderPixelPage(destUrl, pixels) {
  var scripts = "";
  var noScripts = "";
  for (var i = 0; i < pixels.length; i++) {
    var p = pixels[i];
    if (p.type === "facebook" && p.id) {
      scripts +=
        "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
        "fbq('init'," + escJsString(p.id) + ");fbq('track','PageView');";
      noScripts += '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + encodeURIComponent(p.id) + '&ev=PageView&noscript=1"/>';
    } else if (p.type === "ga" && p.id) {
      scripts +=
        "var ga=document.createElement('script');ga.src=" + escJsString("https://www.googletagmanager.com/gtag/js?id=" + p.id) + ";ga.async=true;document.head.appendChild(ga);" +
        "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config'," + escJsString(p.id) + ");";
    } else if (p.type === "tiktok" && p.id) {
      scripts +=
        "!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement('script');o.type='text/javascript';o.async=!0;o.src=i+'?sdkid='+e+'&lib='+t;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};ttq.load(" + escJsString(p.id) + ");ttq.page()}(window,document,'ttq');";
    }
  }
  var destUrlAttr = escHtml(destUrl);
  var destUrlJs = escJsString(destUrl);
  return html(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta http-equiv="refresh" content="1;url=' + destUrlAttr + '">' +
    '<title>Đang chuyển hướng...</title></head><body>' +
    '<script>' + scripts + '</script>' +
    '<noscript>' + noScripts + '<meta http-equiv="refresh" content="0;url=' + destUrlAttr + '"></noscript>' +
    '<p style="font-family:system-ui;text-align:center;padding:40px;">Đang chuyển hướng... <a href="' + destUrlAttr + '">Bấm vào đây nếu không tự chuyển</a></p>' +
    '<script>setTimeout(function(){location.href=' + destUrlJs + ';},800);</script>' +
    '</body></html>',
    200
  );
}

async function handleVerifyPassword(request, env, code, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { password } = body || {};

  if (!password) {
    return json({ error: st("pw_page_wrong", request) }, 401, corsHeaders);
  }

  const raw = await env.LINKS_KV.get("link:" + code);
  if (!raw) return json({ error: st("link_not_found", request) }, 404, corsHeaders);
  const link = JSON.parse(raw);

  // Link không có mật khẩu → cho qua luôn
  if (!link.password) return json({ success: true }, 200, corsHeaders);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const attemptsKey = "pw_attempts:" + code + ":" + ip;

  // Mọi link có mật khẩu đều bị giới hạn — link cũ không có field thì fallback 20 lần
  const maxAttempts = parseInt(link.pwMaxAttempts) || PW_MAX_ATTEMPTS_FALLBACK;

  const attempts = parseInt(await env.LINKS_KV.get(attemptsKey) || "0");
  if (attempts >= maxAttempts) {
    return json({ error: st("pw_too_many_attempts", request) }, 429, corsHeaders);
  }

  const inputHash = await hashPassword(password, link.passwordSalt);
  if (inputHash !== link.password) {
    await env.LINKS_KV.put(attemptsKey, String(attempts + 1), { expirationTtl: PW_LOCKOUT_TTL });
    return json({ error: st("pw_page_wrong", request) }, 401, corsHeaders);
  }

  // Nhập đúng → reset bộ đếm
  await env.LINKS_KV.delete(attemptsKey);

  if (link.pwLogAccess) {
    const ua = request.headers.get("User-Agent") || "";
    await env.LINKS_KV.put(
      "pw_access:" + code + ":" + Date.now(),
      JSON.stringify({ ip, ua, time: new Date().toISOString(), status: "success" }),
      { expirationTtl: 86400 * 30 }
    );
  }

  return json({ success: true }, 200, corsHeaders, {
    "Set-Cookie": "shurl_pw_" + code + "=ok; Path=/; HttpOnly; Secure; Max-Age=86400; SameSite=Lax"
  });
}

// ===================== HTML RENDERING =====================
function renderSafetyWarningHtml(code, targetUrl) {
  let hostname = targetUrl;
  try { hostname = new URL(targetUrl).hostname; } catch (e) {}

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đang chuyển hướng an toàn — SHURL</title>
  <style>
    body { margin:0; background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #090d16 100%); color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; box-sizing:border-box; }
    .card { background:rgba(30,41,59,0.8); backdrop-filter:blur(16px); border:1px solid rgba(99,102,241,0.3); border-radius:24px; padding:36px; max-width:580px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); }
    .badge { display:inline-block; padding:4px 12px; background:rgba(99,102,241,0.2); border:1px solid rgba(99,102,241,0.4); color:#818cf8; border-radius:9999px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
    h1 { font-size:22px; margin:14px 0 8px; color:#e0e7ff; }
    .dest-box { background:rgba(15,23,42,0.9); border:1px dashed rgba(99,102,241,0.4); border-radius:14px; padding:16px 20px; margin:20px 0; word-break:break-all; font-family:monospace; font-size:15px; color:#38bdf8; font-weight:600; }
    .btn-primary { background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%); color:#fff; padding:14px 28px; border-radius:12px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(79,70,229,0.4); transition:transform 0.15s ease; }
    .btn-primary:hover { transform:translateY(-2px); }
    .btn-report { background:transparent; color:#94a3b8; border:1px solid rgba(148,163,184,0.2); padding:14px 20px; border-radius:12px; font-weight:600; cursor:pointer; font-family:inherit; }
    .btn-report:hover { color:#f43f5e; border-color:rgba(244,63,94,0.4); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">SHURL Safety Shield</div>
    <h1>🛡️ Cảnh Báo An Toàn Chuyển Hướng</h1>
    <p style="color:#94a3b8; line-height:1.6; margin:12px 0;">Bạn chuẩn bị truy cập đến liên kết do thành viên tạo trên hệ thống:</p>
    <div class="dest-box">${hostname}</div>
    <p style="font-size:13px; color:#64748b; line-height:1.5;">Hãy kiểm tra kỹ tên miền trang đích trước khi cung cấp mật khẩu, thông tin cá nhân hoặc thực hiện giao dịch tài chính.</p>
    <div style="display:flex; gap:12px; margin-top:28px; flex-wrap:wrap;">
      <a href="${targetUrl}" class="btn-primary">Tiếp tục đến trang đích →</a>
      <button class="btn-report" onclick="reportLink()">Báo cáo vi phạm</button>
    </div>
    <div id="repMsg" style="margin-top:14px; font-size:13px; font-weight:600;"></div>
  </div>
  <script>
    async function reportLink() {
      const msg = document.getElementById('repMsg');
      msg.textContent = 'Đang gửi báo cáo...';
      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: '${code}', reason: 'Người dùng báo cáo link từ trang cảnh báo' })
        });
        const data = await res.json();
        if (data.ok) {
          msg.style.color = '#10b981';
          msg.textContent = 'Cảm ơn bạn đã báo cáo. Đội ngũ kiểm duyệt sẽ xử lý trong thời gian sớm nhất.';
        } else {
          msg.style.color = '#f43f5e';
          msg.textContent = data.error || 'Có lỗi xảy ra khi gửi báo cáo.';
        }
      } catch (e) {
        msg.style.color = '#f43f5e';
        msg.textContent = 'Lỗi kết nối: ' + e.message;
      }
    }
  </script>
</body>
</html>`;
}

// ===================== GIAO DIỆN WEB (SPA nhúng sẵn — không cần build) =====================
// Toàn bộ trang web (trang chủ rút gọn link, đăng nhập/đăng ký, bảng điều khiển,
// bulk shorten, thống kê, quản trị...) được render trực tiếp từ Worker này bằng
// HTML/CSS/JS thuần (vanilla), điều hướng phía client qua hash (#/...), gọi thẳng
// các API /api/** ở trên cùng origin. Không cần package.json/npm/React/Vite/dist.
// ===================== UPGRADE USER ROLE (helper) =====================

async function upgradeUserRole(env, username, newTier, expiryDays) {
  const userKey = "user:" + username.toLowerCase();
  const raw = await env.LINKS_KV.get(userKey);
  if (!raw) return false;
  const userObj = JSON.parse(raw);
  var currentTier = userObj.role || "free";
  var currentRank = TIER_RANK[currentTier] || 0;
  var newRank = TIER_RANK[newTier] || 0;
  if (newRank > currentRank) {
    userObj.role = newTier;
    userObj.upgradedAt = new Date().toISOString();
    if (expiryDays && expiryDays > 0) {
      userObj.roleExpiry = new Date(Date.now() + expiryDays * 86400000).toISOString();
    }
  } else if (newTier === currentTier) {
    if (expiryDays && expiryDays > 0) {
      var base = (userObj.roleExpiry && new Date(userObj.roleExpiry) > new Date()) ? new Date(userObj.roleExpiry) : new Date();
      userObj.roleExpiry = new Date(base.getTime() + expiryDays * 86400000).toISOString();
    }
  }
  await env.LINKS_KV.put(userKey, JSON.stringify(userObj));
  return true;
}

// ===================== VOUCHER SYSTEM =====================
async function handleCreateVoucher(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier, maxUses = 1, expiryDays = 30 } = body || {};
  if (!["plus", "pro", "super"].includes(tier)) return json({ error: "Gói không hợp lệ" }, 400, corsHeaders);
  const code = tier.toUpperCase() + "-" + randomHex(4).toUpperCase() + "-" + randomHex(4).toUpperCase();
  const voucher = {
    code, tier, maxUses, usedCount: 0,
    expiresAt: new Date(Date.now() + expiryDays * 86400000).toISOString(),
    active: true, createdBy: user.username, createdAt: new Date().toISOString()
  };
  await env.LINKS_KV.put("voucher:" + code, JSON.stringify(voucher));
  await addAuditLog(env, user, "CREATE_VOUCHER", { code, tier, maxUses, expiryDays }, request);
  return json({ success: true, voucher }, 200, corsHeaders);
}

async function handleListVouchers(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  const list = await env.LINKS_KV.list({ prefix: "voucher:" });
  const vouchers = [];
  for (const key of list.keys) {
    if (key.name.includes(":used:")) continue;
    const val = await env.LINKS_KV.get(key.name);
    if (val) vouchers.push(JSON.parse(val));
  }
  return json({ vouchers }, 200, corsHeaders);
}

async function handleDeleteVoucher(request, env, code, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  await env.LINKS_KV.delete("voucher:" + code.toUpperCase());
  await addAuditLog(env, user, "DELETE_VOUCHER", { code }, request);
  return json({ success: true }, 200, corsHeaders);
}

async function handleRedeemVoucher(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { code } = body || {};
  if (!code) return json({ error: st("voucher_enter_code", request) }, 400, corsHeaders);
  const voucherKey = "voucher:" + code.toUpperCase();
  const raw = await env.LINKS_KV.get(voucherKey);
  if (!raw) return json({ error: st("voucher_not_found", request) }, 404, corsHeaders);
  const voucher = JSON.parse(raw);
  if (!voucher.active) return json({ error: st("voucher_disabled", request) }, 400, corsHeaders);
  if (new Date(voucher.expiresAt) < new Date()) return json({ error: st("voucher_expired", request) }, 400, corsHeaders);
  if (voucher.usedCount >= voucher.maxUses) return json({ error: st("voucher_no_uses_left", request) }, 400, corsHeaders);
  const usedKey = voucherKey + ":used:" + user.username;
  if (await env.LINKS_KV.get(usedKey)) return json({ error: st("voucher_already_used", request) }, 400, corsHeaders);
  var voucherDays = Math.ceil((new Date(voucher.expiresAt).getTime() - Date.now()) / 86400000);
  var currentRank = TIER_RANK[user.role] || 0;
  var voucherRank = TIER_RANK[voucher.tier] || 0;
  if (voucherRank < currentRank && user.role !== "admin") {
    return json({ error: st("voucher_cannot_downgrade", request).replace("{current}", user.role.toUpperCase()).replace("{voucherTier}", voucher.tier.toUpperCase()) }, 400, corsHeaders);
  }
  const ok = await upgradeUserRole(env, user.username, voucher.tier, voucherDays);
  if (!ok) return json({ error: st("user_not_found", request) }, 500, corsHeaders);
  voucher.usedCount++;
  await env.LINKS_KV.put(voucherKey, JSON.stringify(voucher));
  await env.LINKS_KV.put(usedKey, new Date().toISOString());
  var msg = voucherRank === currentRank ? st("voucher_days_added", request).replace("{days}", voucherDays).replace("{tier}", voucher.tier.toUpperCase()) : st("voucher_upgraded", request).replace("{tier}", voucher.tier.toUpperCase());
  return json({ success: true, message: msg, tier: voucher.tier }, 200, corsHeaders);
}

// ===================== STRIPE BILLING =====================
async function verifyStripeSignature(body, signatureHeader, secret) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find(function(p){ return p.startsWith("t="); });
  const signature = parts.find(function(p){ return p.startsWith("v1="); });
  if (!timestamp || !signature) return false;
  const ts = timestamp.slice(2);
  const sig = signature.slice(3);
  const age = Math.floor(Date.now() / 1000) - parseInt(ts);
  if (age > 300) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signedPayload = ts + "." + body;
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
  const expected = bytesToHex(new Uint8Array(sigBuf));
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++){
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

async function handleStripeCheckout(request, env, url, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier } = body || {};
  if (!["plus", "pro", "super"].includes(tier)) return json({ error: st("invalid_tier", request) }, 400, corsHeaders);
  var tierRank = { free: 0, plus: 1, pro: 2, super: 3 };
  if ((tierRank[user.role] || 0) > (tierRank[tier] || 0)) return json({ error: st("pricing_downgrade_blocked", request).replace("{tier}", (user.role || "free").toUpperCase()) }, 400, corsHeaders);

  var prices = { plus: 249, pro: 800, super: 2000 };
  var amount = prices[tier] || 0;
  if (!amount) return json({ error: st("invalid_tier", request) }, 400, corsHeaders);

  // Kiểm tra giảm giá từ promo settings
  var promoSettings = await env.LINKS_KV.get("promo:settings");
  var discount = 0;
  if (promoSettings) {
    try {
      var promo = JSON.parse(promoSettings);
      if (promo.active && promo.tiers && promo.tiers[tier]) {
        discount = promo.tiers[tier].discountPercent || 0;
      }
    } catch (e) {}
  }
  if (discount > 0 && discount <= 100) {
    amount = Math.round(amount * (100 - discount) / 100);
  }

  var origin = url.origin;
  var sresp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + env.STRIPE_SECRET_KEY2, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "mode": "payment",
      "payment_method_types[0]": "card",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(amount),
      "line_items[0][price_data][product_data][name]": "SHURL Upgrade — " + tier.toUpperCase() + (discount > 0 ? " (-" + discount + "%)" : ""),
      "success_url": origin + "/?upgrade=success",
      "cancel_url": origin + "/?upgrade=cancelled",
      "client_reference_id": user.username,
      "metadata[username]": user.username,
      "metadata[tier]": tier,
      "metadata[type]": "upgrade",  
      "metadata[amount]": String(amount),
      "metadata[discount]": String(discount)
    })
  });
  var session = await sresp.json();
  if (!sresp.ok) return json({ error: (session.error && session.error.message) || st("stripe_error_generic", request) }, 400, corsHeaders);
  try {
    await notifyAllAdmins(env, {
      type: "info",
      title: "Thanh toan Stripe moi",
      message: "User " + user.username + " vua bat dau thanh toan Stripe cho goi " + tier.toUpperCase()
    });
  } catch(e) {}
  return json({ url: session.url }, 200, corsHeaders);
}

// ===================== VOUCHER CHECKOUT (mua voucher trước) =====================
async function handleVoucherCheckout(request, env, url, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier, period } = body || {};
  if (!["plus", "pro", "super"].includes(tier)) return json({ error: "Gói không hợp lệ" }, 400, corsHeaders);
  if (!["week", "month", "year"].includes(period)) return json({ error: "Thời gian không hợp lệ" }, 400, corsHeaders);
  if (tier === "pro" && period === "week") return json({ error: "Gói Pro chỉ chọn 1 tháng hoặc 1 năm" }, 400, corsHeaders);

  var prices = { plus: 2.49, pro: 8, super: 20 };
  var months = period === "week" ? 1 : period === "month" ? 1 : 12;
  var basePrice = prices[tier] * months;
  var discount = period === "week" ? 0 : period === "month" ? 5 : 20;
  var finalPrice = (basePrice * (1 - discount / 100)).toFixed(2);
  var amount = Math.round(parseFloat(finalPrice) * 100);

  var origin = url.origin;
  var sresp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + env.STRIPE_SECRET_KEY2, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "mode": "payment",
      "payment_method_types[0]": "card",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(amount),
      "line_items[0][price_data][product_data][name]": "SHURL Voucher — " + tier.toUpperCase() + " (" + period + ")",
      "success_url": origin + "/?voucher=success",
      "cancel_url": origin + "/?voucher=cancelled",
      "client_reference_id": user.username,
      "metadata[username]": user.username,
      "metadata[tier]": tier,
      "metadata[period]": period,
      "metadata[type]": "voucher_purchase",
      "metadata[final_price]": finalPrice
    })
  });
  var session = await sresp.json();
  if (!sresp.ok) return json({ error: (session.error && session.error.message) || "Lỗi Stripe" }, 400, corsHeaders);
  return json({ url: session.url }, 200, corsHeaders);
}

// ===================== QR PAYMENT SYSTEM =====================
async function handleQrCheckout(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier, period } = body || {};
  if (!["plus", "pro", "super"].includes(tier)) return json({ error: st("invalid_tier", request) }, 400, corsHeaders);
  if (!["week", "month", "year"].includes(period)) return json({ error: st("invalid_period", request) }, 400, corsHeaders);
  var tierRank = { free: 0, plus: 1, pro: 2, super: 3 };
  if ((tierRank[user.role] || 0) > (tierRank[tier] || 0)) return json({ error: st("pricing_downgrade_blocked", request).replace("{tier}", (user.role || "free").toUpperCase()) }, 400, corsHeaders);
  var prices = { plus: 2.49, pro: 8, super: 20 };
  var months = period === "week" ? 1 : period === "month" ? 1 : 12;
  var basePrice = prices[tier] * months;
  var promoSettings = await env.LINKS_KV.get("promo:settings");
  var discount = 0;
  if (promoSettings) {
    try {
      var promo = JSON.parse(promoSettings);
      if (promo.active && promo.tiers && promo.tiers[tier] && promo.tiers[tier].active) {
        discount = promo.tiers[tier].discountPercent || 0;
      }
    } catch(e) {}
  }
  var finalPrice = (basePrice * (100 - discount) / 100).toFixed(2);
  var vndPrice = Math.round(parseFloat(finalPrice) * 27000);
  var tierPrefix = tier === "plus" ? "PL" : tier === "pro" ? "PR" : "SU";
  var orderId = body.orderId || (tierPrefix + "-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  var payment = {
    orderId: orderId, username: user.username, tier: tier, period: period,
    usdPrice: parseFloat(finalPrice), vndPrice: vndPrice,
    status: "pending", createdAt: new Date().toISOString(),
    approvedAt: null, rejectedAt: null
  };
  await env.LINKS_KV.put("qrpay:" + orderId, JSON.stringify(payment));
  try {
    await notifyAllAdmins(env, {
      type: "warning",
      title: "Thanh toan QR moi cho duyet",
      message: "User " + user.username + " vua tao thanh toan QR cho goi " + tier.toUpperCase() + " (" + vndPrice.toLocaleString() + "d) - Ma: " + orderId
    });
  } catch(e) {}
  return json({ success: true, orderId: orderId, vndPrice: vndPrice }, 200, corsHeaders);
}

// === VIETQR — Tạo QR động với số tiền + nội dung chuyển khoản ===
async function handleQrGenerate(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier, period, vndPrice, orderId } = body || {};
  if (!tier || !vndPrice || !orderId) return json({ error: st("missing_info", request) }, 400, corsHeaders);
  // Dùng img.vietqr.io — tạo QR trực tiếp qua URL, không cần API key
  var qrUrl = "https://img.vietqr.io/api/ACB/25105621/" + parseInt(vndPrice) + "/" + encodeURIComponent(orderId) + "/qr_only.png";
  return json({ success: true, qrUrl: qrUrl }, 200, corsHeaders);
}

// === MAINTENANCE SYSTEM ===

async function handleListQrPayments(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  const list = await env.LINKS_KV.list({ prefix: "qrpay:" });
  const payments = [];
  for (const key of list.keys) {
    const val = await env.LINKS_KV.get(key.name);
    if (val) payments.push(JSON.parse(val));
  }
  payments.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  return json({ payments }, 200, corsHeaders);
}

async function handleApproveQrPayment(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { orderId } = body || {};
  if (!orderId) return json({ error: "Thiếu orderId" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("qrpay:" + orderId);
  if (!raw) return json({ error: "Không tìm thấy giao dịch" }, 404, corsHeaders);
  const payment = JSON.parse(raw);
  if (payment.status !== "pending") return json({ error: "Giao dịch đã xử lý" }, 400, corsHeaders);
  var tierRank = { free: 0, plus: 1, pro: 2, super: 3 };
  var payUserRaw = await env.LINKS_KV.get("user:" + payment.username.toLowerCase());
  if (payUserRaw) {
    var payUserObj = JSON.parse(payUserRaw);
    if ((tierRank[payUserObj.role] || 0) > (tierRank[payment.tier] || 0)) return json({ error: "User đang ở gói " + (payUserObj.role || "free").toUpperCase() + ", không thể hạ cấp" }, 400, corsHeaders);
  }
  var periodDays = payment.period === "week" ? 7 : payment.period === "month" ? 30 : 365;
  const ok = await upgradeUserRole(env, payment.username, payment.tier);
  if (!ok) return json({ error: "Không thể nâng cấp user" }, 500, corsHeaders);
  const userKey = "user:" + payment.username.toLowerCase();
  const userRaw = await env.LINKS_KV.get(userKey);
  if (userRaw) {
    const userObj = JSON.parse(userRaw);
    // Snapshot trạng thái NGAY TRƯỚC khi nâng cấp — cho phép handleRevokeQrPayment khôi phục
    // chính xác nếu admin lỡ duyệt nhầm, thay vì phải đoán lại từ periodDays. Role phải lấy từ
    // payUserObj (đọc TRƯỚC upgradeUserRole ở trên) vì userObj vừa bị upgradeUserRole ghi đè
    // role rồi — tierExpiresAt/tierActivatedAt thì upgradeUserRole không đụng tới nên vẫn đúng.
    payment.beforeSnapshot = { role: (payUserObj && payUserObj.role) || "free", tierExpiresAt: userObj.tierExpiresAt || null, tierActivatedAt: userObj.tierActivatedAt || null };
    var baseTime = Date.now();
    if (userObj.tierExpiresAt) {
      var existingExpiry = new Date(userObj.tierExpiresAt).getTime();
      if (existingExpiry > Date.now()) {
        baseTime = existingExpiry;
      }
    }
    userObj.tierExpiresAt = new Date(baseTime + periodDays * 86400000).toISOString();
    if (!userObj.tierActivatedAt) userObj.tierActivatedAt = new Date().toISOString();
    await env.LINKS_KV.put(userKey, JSON.stringify(userObj));
  }
  payment.status = "approved";
  payment.approvedAt = new Date().toISOString();
  payment.approvedBy = user.username;
  await env.LINKS_KV.put("qrpay:" + orderId, JSON.stringify(payment));
  var qrPayRecord = {
    username: payment.username, tier: payment.tier, type: "upgrade",
    method: "bank_qr",
    amount: payment.vndPrice, currency: "VND",
    period: payment.period || null, status: "success",
    orderId: orderId, createdAt: new Date().toISOString()
  };
  var qrHistKey = "payhist:" + payment.username;
  var qrHistRaw = await env.LINKS_KV.get(qrHistKey);
  var qrHist = qrHistRaw ? JSON.parse(qrHistRaw) : [];
  if (!qrHist.some(function(h) { return h.orderId === orderId; })) {
    qrHist.unshift(qrPayRecord);
  }
  if (qrHist.length > 50) qrHist = qrHist.slice(0, 50);
  await env.LINKS_KV.put(qrHistKey, JSON.stringify(qrHist));
  return json({ success: true, payment }, 200, corsHeaders);
}

async function handleQrStatus(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  const list = await env.LINKS_KV.list({ prefix: "qrpay:" });
  const myPayments = [];
  for (const key of list.keys) {
    const val = await env.LINKS_KV.get(key.name);
    if (val) {
      const p = JSON.parse(val);
      if (p.username === user.username && (p.status === "approved" || p.status === "rejected" || p.status === "revoked")) {
        if (!p.notified) { myPayments.push(p); }
      }
    }
  }
  return json({ payments: myPayments }, 200, corsHeaders);
}

async function handleQrStatusAck(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { orderId } = body || {};
  if (!orderId) return json({ error: st("missing_order_id", request) }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("qrpay:" + orderId);
  if (!raw) return json({ error: st("not_found", request) }, 404, corsHeaders);
  const payment = JSON.parse(raw);
  if (payment.username !== user.username) return json({ error: "Không có quyền" }, 403, corsHeaders);
  payment.notified = true;
  await env.LINKS_KV.put("qrpay:" + orderId, JSON.stringify(payment));
  return json({ ok: true }, 200, corsHeaders);
}

async function handleRejectQrPayment(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { orderId, reason } = body || {};
  if (!orderId) return json({ error: "Thiếu orderId" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("qrpay:" + orderId);
  if (!raw) return json({ error: "Không tìm thấy giao dịch" }, 404, corsHeaders);
  const payment = JSON.parse(raw);
  if (payment.status !== "pending") return json({ error: "Giao dịch đã xử lý" }, 400, corsHeaders);
  payment.status = "rejected";
  payment.rejectReason = reason || "Không tìm thấy giao dịch khớp với nội dung chuyển khoản";
  payment.rejectedAt = new Date().toISOString();
  payment.rejectedBy = user.username;
  await env.LINKS_KV.put("qrpay:" + orderId, JSON.stringify(payment));
  return json({ success: true, payment }, 200, corsHeaders);
}

// Thu hồi 1 giao dịch QR đã duyệt NHẦM (vd: khách gửi 2 lệnh, 1 đã chuyển khoản 1 đã huỷ, admin
// đối chiếu nhầm duyệt cả 2). Khôi phục đúng role/tierExpiresAt từ beforeSnapshot đã lưu lúc
// duyệt (xem handleApproveQrPayment) — không đoán lại — và chỉ cho phép khi đây là lệnh duyệt
// GẦN NHẤT của user đó, để không vô tình xoá mất 1 giao dịch hợp lệ khác duyệt sau nó.
async function handleRevokeQrPayment(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { orderId, reason } = body || {};
  if (!orderId) return json({ error: "Thiếu orderId" }, 400, corsHeaders);
  const raw = await env.LINKS_KV.get("qrpay:" + orderId);
  if (!raw) return json({ error: "Không tìm thấy giao dịch" }, 404, corsHeaders);
  const payment = JSON.parse(raw);
  if (payment.status !== "approved") return json({ error: "Chỉ có thể thu hồi giao dịch đã duyệt" }, 400, corsHeaders);
  if (!payment.beforeSnapshot) return json({ error: "Giao dịch này được duyệt trước khi có tính năng thu hồi, không có dữ liệu để khôi phục — vui lòng điều chỉnh thủ công cho user." }, 400, corsHeaders);

  const list = await env.LINKS_KV.list({ prefix: "qrpay:" });
  const raws = await Promise.all(list.keys.map(k => env.LINKS_KV.get(k.name)));
  const laterApproved = raws.filter(Boolean).map(r => JSON.parse(r)).some(p =>
    p.orderId !== orderId && p.username === payment.username && p.status === "approved" &&
    p.approvedAt && payment.approvedAt && new Date(p.approvedAt).getTime() > new Date(payment.approvedAt).getTime()
  );
  if (laterApproved) {
    return json({ error: "Đã có giao dịch khác được duyệt SAU giao dịch này cho cùng user — không thể tự động thu hồi vì có thể xoá nhầm giao dịch hợp lệ. Vui lòng điều chỉnh thủ công." }, 400, corsHeaders);
  }

  const userKey = "user:" + payment.username.toLowerCase();
  const userRaw = await env.LINKS_KV.get(userKey);
  if (userRaw) {
    const userObj = JSON.parse(userRaw);
    userObj.role = payment.beforeSnapshot.role;
    userObj.tierExpiresAt = payment.beforeSnapshot.tierExpiresAt;
    userObj.tierActivatedAt = payment.beforeSnapshot.tierActivatedAt;
    await env.LINKS_KV.put(userKey, JSON.stringify(userObj));
  }

  payment.status = "revoked";
  payment.revokeReason = reason || "Lỗi trong quá trình kiểm tra giao dịch";
  payment.revokedAt = new Date().toISOString();
  payment.revokedBy = user.username;
  payment.notified = false; // đã bị "notified:true" từ lúc duyệt — reset để modal toàn màn hình hiện lại cho lần thu hồi này
  await env.LINKS_KV.put("qrpay:" + orderId, JSON.stringify(payment));

  // Đánh dấu lại dòng lịch sử thanh toán tương ứng — giữ lại (không xoá) nhưng không còn hiện
  // nhầm như 1 giao dịch thành công bình thường nữa.
  const qrHistKey = "payhist:" + payment.username;
  const qrHistRaw = await env.LINKS_KV.get(qrHistKey);
  if (qrHistRaw) {
    const qrHist = JSON.parse(qrHistRaw);
    const entry = qrHist.find(h => h.orderId === orderId);
    if (entry) entry.reversed = true;
    await env.LINKS_KV.put(qrHistKey, JSON.stringify(qrHist));
  }

  const payUserRaw = await env.LINKS_KV.get(userKey);
  const payUserLang = payUserRaw ? (JSON.parse(payUserRaw).lang || "vi") : "vi";
  const langTpl = renderNotificationTemplate("payment_revoked", payUserLang, { username: payment.username, orderId: orderId });
  await notifyUser(env, {
    username: payment.username, type: "payment_revoked", from: "system",
    title: langTpl.title, message: langTpl.message,
    sendEmailToo: true, emailSubject: langTpl.emailSubject, emailHtml: langTpl.emailHtml
  });

  await addAuditLog(env, user, "REVOKE_QR_PAYMENT", { orderId, username: payment.username, reason: payment.revokeReason }, request);
  return json({ success: true, payment }, 200, corsHeaders);
}

// ===================== SEND VOUCHER EMAIL (MailChannels) =====================

// Mẫu thông báo tự động đa ngôn ngữ (in-app + email) — dùng cho notifyUser() ở các điểm auto-trigger
// (đăng ký, thanh toán) và cho admin chọn nhanh khi gửi broadcast. Cùng pattern với SERVER_I18N ở trên.

// Minh hoạ (illustration key) + lý do nhận email (vi/en, fallback EMAIL_LABELS.reasonGeneric cho
// các ngôn ngữ khác) cho từng loại thông báo tự động, hiển thị ở đầu email (buildEmailShell).

// Trả về {title, message, emailSubject, emailHtml} đã điền {username}/{tier}... sẵn sàng đưa
// thẳng vào notifyUser(). Email dùng khung chuyên nghiệp dùng chung buildEmailShell() ở trên.

async function handleStripeWebhook(request, env, corsHeaders) {
  const body = await request.text();
  const signature = request.headers.get("Stripe-Signature");
  if (!signature) return json({ error: "Missing signature" }, 400, corsHeaders);
  const valid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return json({ error: "Invalid signature" }, 400, corsHeaders);
  const event = JSON.parse(body);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const username = session.metadata && session.metadata.username;
    const tier = session.metadata && session.metadata.tier;
    const type = session.metadata && session.metadata.type;
    const period = session.metadata && session.metadata.period;
    if (username && tier) {
      var tierRank = { free: 0, plus: 1, pro: 2, super: 3 };
      var swUserRaw = await env.LINKS_KV.get("user:" + username.toLowerCase());
      if (swUserRaw) {
        var swUserObj = JSON.parse(swUserRaw);
        if ((tierRank[swUserObj.role] || 0) > (tierRank[tier] || 0)) return json({ received: true }, 200, corsHeaders);
      }
      var payRecord = {
        username: username, tier: tier, type: type || "upgrade",
        method: "stripe",
        amount: session.amount_total, currency: session.currency,
        period: period || null, status: "success",
        sessionId: session.id, createdAt: new Date().toISOString()
      };
      await env.LINKS_KV.put("payment:" + session.id, JSON.stringify(payRecord));

      var histKey = "payhist:" + username;
      var histRaw = await env.LINKS_KV.get(histKey);
      var hist = histRaw ? JSON.parse(histRaw) : [];
      if (!hist.some(function(h) { return h.sessionId === session.id; })) {
        hist.unshift(payRecord);
      }
      if (hist.length > 50) hist = hist.slice(0, 50);
      await env.LINKS_KV.put(histKey, JSON.stringify(hist));

      if (type === "voucher_purchase") {
        var code = tier.toUpperCase() + "-" + randomHex(4).toUpperCase() + "-" + randomHex(4).toUpperCase();
        var voucher = {
          code: code, tier: tier, maxUses: 1, usedCount: 0,
          expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
          active: true, createdBy: username, createdAt: new Date().toISOString(),
          source: "purchase", period: period
        };
        await env.LINKS_KV.put("voucher:" + code, JSON.stringify(voucher));

        var userRaw = await env.LINKS_KV.get("user:" + username);
        if (userRaw) {
          var userObj = JSON.parse(userRaw);
          if (userObj.email) {
            var lang = userObj.lang || "vi";
            await sendVoucherEmail(env, userObj.email, code, tier, "https://" + new URL(request.url).hostname, lang);
          }
        }
      } else {
        await upgradeUserRole(env, username, tier);
        var upUserRaw = await env.LINKS_KV.get("user:" + username.toLowerCase());
        if (upUserRaw) {
          var upUserObj = JSON.parse(upUserRaw);
          var stripeBaseTime = Date.now();
          if (upUserObj.tierExpiresAt) {
            var stripeExistingExpiry = new Date(upUserObj.tierExpiresAt).getTime();
            if (stripeExistingExpiry > Date.now()) {
              stripeBaseTime = stripeExistingExpiry;
            }
          }
          upUserObj.tierExpiresAt = new Date(stripeBaseTime + 30 * 86400000).toISOString();
          if (!upUserObj.tierActivatedAt) upUserObj.tierActivatedAt = new Date().toISOString();
          await env.LINKS_KV.put("user:" + username.toLowerCase(), JSON.stringify(upUserObj));

          var payTierName = tier.charAt(0).toUpperCase() + tier.slice(1);
          var payTpl = renderNotificationTemplate("payment_success", upUserObj.lang || "vi", { username: upUserObj.username, tier: payTierName });
          if (payTpl) {
            await notifyUser(env, {
              username: upUserObj.username, type: "payment_success", from: "system",
              title: payTpl.title, message: payTpl.message,
              sendEmailToo: !!upUserObj.email, emailSubject: payTpl.emailSubject, emailHtml: payTpl.emailHtml
            });
          }
        }
      }
    }
  }
  return json({ received: true }, 200, corsHeaders);
}
// ===================== PAYMENT HISTORY (user) =====================
async function handlePaymentHistory(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: "Not authenticated" }, 401, corsHeaders);
  var histKey = "payhist:" + user.username;
  var histRaw = await env.LINKS_KV.get(histKey);
  var history = [];
  var needsCleanup = false;
  if (histRaw) {
    try {
      history = JSON.parse(histRaw);
      if (typeof history === "string") { history = JSON.parse(history); needsCleanup = true; }
      if (typeof history === "string") { history = JSON.parse(history); needsCleanup = true; }
      if (!Array.isArray(history)) { history = []; needsCleanup = true; }
    } catch(e) { history = []; needsCleanup = true; }
  }
  if (needsCleanup && Array.isArray(history)) {
    await env.LINKS_KV.put(histKey, JSON.stringify(history));
  }
  return json({ history }, 200, corsHeaders);
}

// ===================== PROMO SETTINGS (admin) =====================
async function handleGetPromoSettings(request, env, corsHeaders) {
  // Public — tất cả user đều đọc được để hiển thị giá giảm
  const raw = await env.LINKS_KV.get("promo:settings");
  const settings = raw ? JSON.parse(raw) : { active: false, tiers: {} };
  return json({ settings }, 200, corsHeaders);
}

async function handleSavePromoSettings(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Không có quyền" }, 403, corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  await env.LINKS_KV.put("promo:settings", JSON.stringify(body));
  return json({ ok: true }, 200, corsHeaders);
}

// ===================== DỌN DẸP LINK (cron) =====================
// Xóa vĩnh viễn các link đã ở trong "thùng rác" (isDeleted=true) quá 24h,
// đúng như lời hứa hiển thị cho user lúc bấm xóa ("Sẽ xóa sau 24h").
async function purgeExpiredLinks(env) {
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

// ===================== CLOUDFLARE ANALYTICS (Workers requests/errors/CPU) =====================
// Đọc bằng GraphQL Analytics API của Cloudflare (KHÔNG phải phân tích click link của SHURL).
// Cần secret CF_ANALYTICS_TOKEN (API Token quyền "Account > Account Analytics > Read")
// và var CF_ACCOUNT_ID (đã có sẵn trong wrangler.jsonc, không phải bí mật).
async function refreshCfAnalyticsCache(env) {
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

async function handleAdminOverview(request, env, corsHeaders) {
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

// ===================== PAYMENT REPORTS (admin) =====================
async function handlePaymentReports(request, env, corsHeaders) {
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

function t(key){
  var lang = i18n[currentLang] || i18n.vi;
  return lang[key] || i18n.vi[key] || key;
}

// Google Ads conversion tracking — id/label come from wrangler.jsonc vars
// (GOOGLE_ADS_ID / GOOGLE_ADS_CONVERSION_LABEL) so they can be changed without
// touching code. Also exposes GOOGLE_ADS_CONVERSION_SEND_TO for the client-side
// conversion-fire call in bindRegisterForm().

/* === LANGUAGE SWITCHER === */

// ===================== WEBHOOK HANDLERS (Pro/Super) =====================
async function handleCreateWebhook(request, env, corsHeaders) {
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

async function handleListWebhooks(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasApi) return json({ success: false, error: "Webhooks require Pro or Super plan" }, 403, corsHeaders);
  
  const key = "webhooks:" + authedUser.username.toLowerCase();
  const raw = await env.LINKS_KV.get(key);
  const hooks = raw ? JSON.parse(raw) : [];
  return json({ success: true, count: hooks.length, data: hooks }, 200, corsHeaders);
}

async function handleDeleteWebhook(request, env, hookId, corsHeaders) {
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

// ===================== DATA EXPORT HANDLERS (Pro/Super) =====================
async function handleExportCsv(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasDataExport) return json({ success: false, error: "Data export requires Pro or Super plan" }, 403, corsHeaders);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const campaignFilter = url.searchParams.get("campaign");
  if (campaignFilter) userLinks = userLinks.filter(l => (l.campaign || "") === campaignFilter);
  const origin = new URL(request.url).origin;

  const headers = ["code", "short_url", "destination", "title", "campaign", "tags", "total_clicks", "is_enabled", "created_at", "expires_at", "is_deleted"];
  const rows = userLinks.map(l => [
    l.code, origin + "/" + l.code, l.url, (l.title || ""), (l.campaign || ""), (l.tags || []).join("|"),
    (l.totalClicks || 0), (l.isEnabled !== false), (l.createdAt || ""), (l.expiryDate || ""), (l.isDeleted || false)
  ]);
  
  const csv = [headers.join(","), ...rows.map(r => r.map(c => {
    const s = String(c);
    return s.includes(",") || s.includes('"') ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(","))].join("\n");
  
  return new Response(csv, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"shurl-export.csv\""
    }
  });
}

async function handleExportJson(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasDataExport) return json({ success: false, error: "Data export requires Pro or Super plan" }, 403, corsHeaders);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const campaignFilter = url.searchParams.get("campaign");
  if (campaignFilter) userLinks = userLinks.filter(l => (l.campaign || "") === campaignFilter);

  const exportData = {
    exported_at: new Date().toISOString(),
    exported_by: authedUser.username,
    total_links: userLinks.length,
    links: userLinks.map(l => ({
      code: l.code,
      destination: l.url,
      title: l.title || "",
      total_clicks: l.totalClicks || 0,
      is_enabled: l.isEnabled !== false,
      created_at: l.createdAt,
      expires_at: l.expiryDate || null,
      is_deleted: l.isDeleted || false,
      campaign: l.campaign || null,
      tags: l.tags || []
    }))
  };
  
  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"shurl-export.json\""
    }
  });
}

// ===================== TEAM HANDLERS (Super/Admin) =====================
async function getTeam(env, teamId) {
  if (!teamId) return null;
  const raw = await env.LINKS_KV.get("team:" + teamId);
  return raw ? JSON.parse(raw) : null;
}
async function putTeam(env, team) {
  await env.LINKS_KV.put("team:" + team.id, JSON.stringify(team));
}
async function listAllTeams(env) {
  const teams = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "team:", cursor });
    const pageTeams = await Promise.all(page.keys.map(k => env.LINKS_KV.get(k.name)));
    for (const raw of pageTeams) { if (raw) teams.push(JSON.parse(raw)); }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return teams;
}
async function isUserInSameTeam(env, username1, username2) {
  if (!username1 || !username2 || username1.toLowerCase() === username2.toLowerCase()) return true;
  const user1 = await getUser(env, username1);
  if (!user1 || !user1.teamId) return false;
  const team = await getTeam(env, user1.teamId);
  if (!team || !team.members) return false;
  return team.members.some(m => m.username.toLowerCase() === username2.toLowerCase());
}

async function handleCreateTeam(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { name } = body || {};
  if (!name || !name.trim()) return json({ success: false, error: st("team_name_required", request) }, 400, corsHeaders);

  const teamId = "team_" + randomHex(8);
  const team = {
    id: teamId,
    name: name.trim(),
    ownerId: authedUser.id,
    members: [{ username: authedUser.username, role: "owner", addedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };
  await putTeam(env, team);

  // authedUser is the sanitized (no salt/hash) copy from getAuthenticatedUser() — persisting
  // it directly would silently wipe the user's password. Fetch the full record to save instead.
  const fullUser = await getUser(env, authedUser.username);
  if (fullUser) {
    fullUser.teamId = teamId;
    await putUser(env, fullUser);
  }

  return json({ success: true, team }, 201, corsHeaders);
}

async function handleListTeams(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: "Team yêu cầu gói Super" }, 403, corsHeaders);
  
  const allTeams = await listAllTeams(env);
  const userTeams = allTeams.filter(t => t.members && t.members.some(m => m.username.toLowerCase() === authedUser.username.toLowerCase()));
  return json({ success: true, count: userTeams.length, teams: userTeams }, 200, corsHeaders);
}

async function handleDeleteTeam(request, env, teamId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_delete", request) }, 403, corsHeaders);

  for (const m of (team.members || [])) {
    const mu = await getUser(env, m.username);
    if (mu && mu.teamId === teamId) { mu.teamId = null; await putUser(env, mu); }
  }
  await env.LINKS_KV.delete("team:" + teamId);
  return json({ success: true, message: st("team_deleted", request) }, 200, corsHeaders);
}

async function handleUpdateTeam(request, env, teamId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_edit", request) }, 403, corsHeaders);
  
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { name } = body || {};
  if (name && name.trim()) team.name = name.trim();
  await putTeam(env, team);
  return json({ success: true, team }, 200, corsHeaders);
}

async function handleAddTeamMember(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { teamId, username } = body || {};
  if (!teamId || !username) return json({ success: false, error: st("team_missing_id_or_username", request) }, 400, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_add_member", request) }, 403, corsHeaders);

  const maxMembers = limits.maxTeamMembers || 10;
  if (team.members.length >= maxMembers) return json({ success: false, error: st("team_max_members", request).replace("{count}", maxMembers) }, 400, corsHeaders);

  const cleanUsername = username.trim().toLowerCase();
  const targetUser = await getUser(env, cleanUsername);
  if (!targetUser) return json({ success: false, error: st("team_user_not_found", request) }, 404, corsHeaders);
  if (targetUser.teamId) return json({ success: false, error: st("team_user_in_other_team", request) }, 400, corsHeaders);
  if (team.members.some(m => m.username.toLowerCase() === cleanUsername)) return json({ success: false, error: st("team_already_member", request) }, 400, corsHeaders);
  
  team.members.push({ username: targetUser.username, role: "member", addedAt: new Date().toISOString() });
  await putTeam(env, team);
  
  targetUser.teamId = teamId;
  await putUser(env, targetUser);
  
  return json({ success: true, member: { username: targetUser.username, role: "member" } }, 201, corsHeaders);
}

async function handleRemoveTeamMember(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { teamId, username } = body || {};
  if (!teamId || !username) return json({ success: false, error: st("team_missing_id_or_username", request) }, 400, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_remove_member", request) }, 403, corsHeaders);

  const cleanUsername = username.trim().toLowerCase();
  const member = team.members.find(m => m.username.toLowerCase() === cleanUsername);
  if (!member) return json({ success: false, error: st("team_member_not_found", request) }, 404, corsHeaders);
  if (member.role === "owner") return json({ success: false, error: st("team_cannot_remove_owner", request) }, 400, corsHeaders);
  
  team.members = team.members.filter(m => m.username.toLowerCase() !== cleanUsername);
  await putTeam(env, team);
  
  const targetUser = await getUser(env, cleanUsername);
  if (targetUser && targetUser.teamId === teamId) { targetUser.teamId = null; await putUser(env, targetUser); }
  
  return json({ success: true, message: "Đã xóa thành viên" }, 200, corsHeaders);
}

// ===================== CAMPAIGN HANDLERS (Plus+) =====================
async function handleListCampaigns(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasCampaignHistory) return json({ success: false, error: "Campaign history yêu cầu gói Plus trở lên" }, 403, corsHeaders);
  const allLinks = await listAllLinks(env);
  let userLinks;
  if (authedUser.role === "admin") { userLinks = allLinks; } else {
    let ownerSet = new Set([authedUser.username.toLowerCase()]);
    if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); }
    userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase()));
  }
  const campaignMap = {};
  for (const link of userLinks) {
    if (!link.campaign) continue;
    if (!campaignMap[link.campaign]) campaignMap[link.campaign] = { name: link.campaign, linkCount: 0, totalClicks: 0 };
    campaignMap[link.campaign].linkCount++;
    campaignMap[link.campaign].totalClicks += (link.totalClicks || 0);
  }
  const campaigns = Object.values(campaignMap).sort((a, b) => b.linkCount - a.linkCount);
  return json({ success: true, count: campaigns.length, campaigns }, 200, corsHeaders);
}

async function handleCampaignHistory(request, env, campaignName, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasCampaignHistory) return json({ success: false, error: "Campaign history yêu cầu gói Plus trở lên" }, 403, corsHeaders);
  const allLinks = await listAllLinks(env);
  let userLinks;
  if (authedUser.role === "admin") { userLinks = allLinks; } else {
    let ownerSet = new Set([authedUser.username.toLowerCase()]);
    if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); }
    userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase()));
  }
  const matchingLinks = userLinks.filter(l => {
    if (l.campaign === campaignName) return true;
    if (l.campaignHistory && l.campaignHistory.some(h => h.campaign === campaignName)) return true;
    return false;
  });
  const links = matchingLinks.map(l => ({ code: l.code, url: l.url, shortUrl: l.shortUrl || "", campaign: l.campaign, totalClicks: l.totalClicks || 0, campaignHistory: l.campaignHistory || [] }));
  return json({ success: true, campaign: campaignName, count: links.length, links }, 200, corsHeaders);
}
// ===================== ADMIN: DELETE USER =====================
async function handleAdminDeleteUser(request, env, username, corsHeaders) {
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
// ===================== ADMIN: BAN/UNBAN USER =====================
async function handleAdminBanUser(request, env, corsHeaders) {
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

// ===================== ADMIN: SEARCH USERS =====================
async function handleAdminSearchUsers(request, env, corsHeaders) {
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

// ===================== ADMIN: SYSTEM SETTINGS =====================
async function handleAdminGetSettings(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const raw = await env.LINKS_KV.get("sys:settings");
  let settings = {};
  if (raw) { try { settings = JSON.parse(raw); } catch (e) { settings = {}; } }
  return json({ settings, tierConfig: TIER_CONFIG }, 200, corsHeaders);
}

async function handleAdminSaveSettings(request, env, corsHeaders) {
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

// ===================== ADMIN: BLOG POSTS (KV-backed, no deploy needed) =====================
async function handleAdminListBlogPosts(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const posts = await listAllBlogPosts(env);
  return json({ posts }, 200, corsHeaders);
}

async function handleAdminGetBlogPost(request, env, slug, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  const post = await getBlogPost(env, slug);
  if (!post) return json({ error: "Không tìm thấy bài viết" }, 404, corsHeaders);
  return json({ post }, 200, corsHeaders);
}

async function handleAdminSaveBlogPost(request, env, corsHeaders, slugParam) {
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

async function handleAdminDeleteBlogPost(request, env, slug, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return requireAuthResponse(corsHeaders, request);
  if (authedUser.role !== "admin") return requireAdminResponse(corsHeaders, request);
  await env.LINKS_KV.delete("blog:" + slug);
  await addAuditLog(env, authedUser, "DELETE_BLOG_POST", { slug }, request);
  return json({ ok: true }, 200, corsHeaders);
}

// ===================== ADMIN: APPLY VOUCHER TO USER =====================
async function handleAdminApplyVoucher(request, env, corsHeaders) {
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

// ===================== ADMIN: BROADCAST NOTIFICATION =====================
// Email đơn giản cho nội dung admin tự gõ (không có bản dịch đa ngôn ngữ như NOTIFICATION_TEMPLATES
// — gửi nguyên văn title/message admin đã nhập, dùng lại đúng khung/màu email đã có).
function buildAdminBroadcastEmailHtml(title, message) {
  return buildEmailShell({
    lang: "vi", illustration: "maintenance",
    title: title,
    introHtml: '<p style="white-space:pre-wrap;">' + message + '</p>',
    ctaText: "Truy cập SHURL", ctaUrl: "https://shurlvn.com",
    footerReason: "Bạn nhận được email này từ quản trị viên SHURL."
  });
}

async function handleAdminBroadcastNotification(request, env, corsHeaders) {
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
// ===================== ADMIN: LIST NOTIFICATIONS =====================
async function handleAdminListNotifications(request, env, corsHeaders) {
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
// ===================== ADMIN: DELETE NOTIFICATION =====================
async function handleAdminDeleteNotification(request, env, notifId, corsHeaders) {
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
// ===================== USER: GET MY NOTIFICATIONS =====================
async function handleGetMyNotifications(request, env, corsHeaders) {
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
// ===================== USER: MARK NOTIFICATION READ =====================
async function handleMarkNotificationRead(request, env, notifId, corsHeaders) {
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
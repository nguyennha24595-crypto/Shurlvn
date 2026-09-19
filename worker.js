// ==============================================================================
// SHURL — CLOUDFLARE WORKER FULL ENGINE (Nền tảng rút gọn link đa tầng)
// ==============================================================================
// ===================== CẤU HÌNH HẠN MỨC 5 TẦNG (khớp src/types.ts) ==========

import { purgeExpiredLinksLogged, purgeExpiredLinks, refreshCfAnalyticsCache } from "./src/cron.js";
import { handleRegister, handleLogin, handleLogout, handleGoogleAuthStart, handleGoogleAuthCallback, handleMe, handleGenerateToken, handleGenerateExtensionToken, handleForgotPassword, handleResetPassword, generateTotpSecret, generateTotpCode, getOtpAuthUrl, handleSetup2fa, handleVerify2fa, handleDisable2fa } from "./src/handlers/auth.js";
import { createLinkInternal, createBioPageInternal, handleListLinks, handleCreateLink, handleBulkCreateLinks, handleUpdateLink, handleCreateBioPage, handleUpdateBioPage, handleBioLinkClick, handleDeleteLink, handleRestoreLink, handleForceDeleteLink } from "./src/handlers/links.js";
import { handleCreateQr, looksLikePaymentUrl, validateQrLogoDataUrl, handleCreateDynamicQr, handleAcceptQrDynamicTerms, handleListDynamicQr, handleUpdateDynamicQr, handleDeleteDynamicQr, handleInspectQr } from "./src/handlers/qr.js";
import { handleGetLinkAnalytics, handleAnalyticsOverview, handleApiShorten, handleApiListLinks, handleApiAnalytics } from "./src/handlers/analytics.js";
import { handleFeedback, handleCreateReport } from "./src/handlers/feedback.js";
import { handleAskAi } from "./src/handlers/ai.js";
import { handleRedirect, pickABUrl, renderPasswordPage, renderPixelPage, handleVerifyPassword, renderSafetyWarningHtml } from "./src/handlers/redirect.js";
import { handleAdminListUsers, handleAdminSetRole, handleAdminListReports, handleAdminDismissReport, handleAdminListFeedback, handleAdminReplyFeedback, handleAdminUpdateFeedbackStatus, handleAdminDeleteFeedback, handleAdminTranslateFeedback, handleGetBlacklist, handleAddBlacklist, handleRemoveBlacklist, handleAdminListAuditLogs, handleExportWorker, handleAdminOverview, handlePaymentReports, t, handleAdminDeleteUser, handleAdminBanUser, handleAdminSearchUsers, handleAdminGetSettings, handleAdminSaveSettings, handleAdminListBlogPosts, handleAdminGetBlogPost, handleAdminSaveBlogPost, handleAdminDeleteBlogPost, handleAdminApplyVoucher, buildAdminBroadcastEmailHtml, handleAdminBroadcastNotification, handleAdminListNotifications, handleAdminDeleteNotification } from "./src/handlers/admin.js";
import { upgradeUserRole, handleCreateVoucher, handleListVouchers, handleDeleteVoucher, handleRedeemVoucher, verifyStripeSignature, handleStripeCheckout, handleVoucherCheckout, handleQrCheckout, handleQrGenerate, handleListQrPayments, handleApproveQrPayment, handleQrStatus, handleQrStatusAck, handleRejectQrPayment, handleRevokeQrPayment, handleStripeWebhook, handlePaymentHistory, handleGetPromoSettings, handleSavePromoSettings } from "./src/handlers/billing.js";
import { handleCreateWebhook, handleListWebhooks, handleDeleteWebhook } from "./src/handlers/webhooks.js";
import { handleExportCsv, handleExportJson } from "./src/handlers/export.js";
import { getTeam, putTeam, listAllTeams, isUserInSameTeam, handleCreateTeam, handleListTeams, handleDeleteTeam, handleUpdateTeam, handleAddTeamMember, handleRemoveTeamMember } from "./src/handlers/teams.js";
import { handleListCampaigns, handleCampaignHistory } from "./src/handlers/campaigns.js";
import { handleGetMyNotifications, handleMarkNotificationRead } from "./src/handlers/notifications.js";

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

// Separate from handleGenerateToken: this one is open to every tier (not just Pro/Super).
// It powers the browser extension's Link Manager (read links + quick-shorten), which
// doesn't touch the paid API quota, so it's kept as its own token field (user.extToken)
// rather than reusing user.apiToken. Both are looked up the same way by
// getAuthenticatedUser() via the shared "apitoken:<token>" -> username KV prefix.

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

// ===================== TOTP 2FA (Admin) =====================

// Tạo secret key TOTP (base32)

// Tạo TOTP code từ secret + thời gian

// Tạo otpauth URL cho QR code

// ===================== HANDLERS: BLACKLIST / SECURITY CHECKS =====================

// ===================== HANDLERS: QUOTA =====================
// Admin có thể override dailyLinks/maxBulkBatch/monthlyApiLimit theo từng gói ở tab Cài đặt
// (sys:settings.tierOverrides) — merge lên trên TIER_CONFIG mặc định. Cache 30s như các list
// khác trong file này (env._linksCache, env._usersCache) để không đọc KV trên mỗi request.

// ===================== HANDLERS: LINKS (CORE) =====================

// Link-in-bio pages reuse the "link:<code>" KV record (type:"bio" instead of a
// redirect target) so all existing cross-cutting infra — reports, blacklist,
// recordClick page-view counting, QR generation off the shortUrl — works for
// free. createLinkInternal isn't reusable directly since it's built around a
// single targetUrl rather than a list of sub-links.

// ===================== HANDLERS: LINK-IN-BIO =====================

// ===================== HANDLERS: CLICK TRACKING & ANALYTICS =====================

// ===================== HANDLERS: PUBLIC REST API v1 (dùng API Token) =====================

// ===================== HANDLERS: QR CODE (trừ dailyQuota) =====================

// ===================== HANDLERS: DYNAMIC QR (QR động — QR Studio) =====================

// Anti bait-and-switch: a QR động's whole point is that its destination can change
// after the code is printed/shared — the exact opposite of what a payment link needs.
// Someone could set a real payment page as the destination to earn trust, then quietly
// swap it for a fraudulent one without the printed QR ever changing. So payment-looking
// URLs are refused as a QR động destination in both directions (create AND edit) — QR
// tĩnh (destination baked in, can never change) is the correct choice for those.
// This is a domain heuristic, not a guarantee: it catches common providers, not every
// possible payment page.

// ===================== HANDLERS: QR INSPECTOR (Scanner QR) =====================
// Public, read-only lookup for whatever a scanned QR decodes to. Never records a click
// (unlike visiting the link itself) — this is purely "what would happen if I opened this?".

// ===================== HANDLERS: REPORTS =====================

// ===================== RATE LIMIT MAT KHAU =====================

// ===================== HANDLERS: ADMIN =====================

// ===================== AUDIT LOG =====================

// ===================== HANDLERS: ADMIN =====================

// ===================== BLOG (server-rendered, indexable by Google) =====================
// One-time seed data only — after the first request, posts live in KV (blog:<slug>) and are
// managed via /api/admin/blog. Editing this array after launch has no effect on production.

// ===================== REDIRECT & SAFETY WARNING =====================

// ===================== HTML RENDERING =====================

// ===================== GIAO DIỆN WEB (SPA nhúng sẵn — không cần build) =====================
// Toàn bộ trang web (trang chủ rút gọn link, đăng nhập/đăng ký, bảng điều khiển,
// bulk shorten, thống kê, quản trị...) được render trực tiếp từ Worker này bằng
// HTML/CSS/JS thuần (vanilla), điều hướng phía client qua hash (#/...), gọi thẳng
// các API /api/** ở trên cùng origin. Không cần package.json/npm/React/Vite/dist.
// ===================== UPGRADE USER ROLE (helper) =====================

// ===================== VOUCHER SYSTEM =====================

// ===================== STRIPE BILLING =====================

// ===================== VOUCHER CHECKOUT (mua voucher trước) =====================

// ===================== QR PAYMENT SYSTEM =====================

// === VIETQR — Tạo QR động với số tiền + nội dung chuyển khoản ===

// === MAINTENANCE SYSTEM ===

// Thu hồi 1 giao dịch QR đã duyệt NHẦM (vd: khách gửi 2 lệnh, 1 đã chuyển khoản 1 đã huỷ, admin
// đối chiếu nhầm duyệt cả 2). Khôi phục đúng role/tierExpiresAt từ beforeSnapshot đã lưu lúc
// duyệt (xem handleApproveQrPayment) — không đoán lại — và chỉ cho phép khi đây là lệnh duyệt
// GẦN NHẤT của user đó, để không vô tình xoá mất 1 giao dịch hợp lệ khác duyệt sau nó.

// ===================== SEND VOUCHER EMAIL (MailChannels) =====================

// Mẫu thông báo tự động đa ngôn ngữ (in-app + email) — dùng cho notifyUser() ở các điểm auto-trigger
// (đăng ký, thanh toán) và cho admin chọn nhanh khi gửi broadcast. Cùng pattern với SERVER_I18N ở trên.

// Minh hoạ (illustration key) + lý do nhận email (vi/en, fallback EMAIL_LABELS.reasonGeneric cho
// các ngôn ngữ khác) cho từng loại thông báo tự động, hiển thị ở đầu email (buildEmailShell).

// Trả về {title, message, emailSubject, emailHtml} đã điền {username}/{tier}... sẵn sàng đưa
// thẳng vào notifyUser(). Email dùng khung chuyên nghiệp dùng chung buildEmailShell() ở trên.

// ===================== PAYMENT HISTORY (user) =====================

// ===================== PROMO SETTINGS (admin) =====================

// ===================== DỌN DẸP LINK (cron) =====================
// Xóa vĩnh viễn các link đã ở trong "thùng rác" (isDeleted=true) quá 24h,
// đúng như lời hứa hiển thị cho user lúc bấm xóa ("Sẽ xóa sau 24h").

// ===================== CLOUDFLARE ANALYTICS (Workers requests/errors/CPU) =====================
// Đọc bằng GraphQL Analytics API của Cloudflare (KHÔNG phải phân tích click link của SHURL).
// Cần secret CF_ANALYTICS_TOKEN (API Token quyền "Account > Account Analytics > Read")
// và var CF_ACCOUNT_ID (đã có sẵn trong wrangler.jsonc, không phải bí mật).

// ===================== PAYMENT REPORTS (admin) =====================

// Google Ads conversion tracking — id/label come from wrangler.jsonc vars
// (GOOGLE_ADS_ID / GOOGLE_ADS_CONVERSION_LABEL) so they can be changed without
// touching code. Also exposes GOOGLE_ADS_CONVERSION_SEND_TO for the client-side
// conversion-fire call in bindRegisterForm().

/* === LANGUAGE SWITCHER === */

// ===================== WEBHOOK HANDLERS (Pro/Super) =====================

// ===================== DATA EXPORT HANDLERS (Pro/Super) =====================

// ===================== TEAM HANDLERS (Super/Admin) =====================

// ===================== CAMPAIGN HANDLERS (Plus+) =====================

// ===================== ADMIN: DELETE USER =====================

// ===================== ADMIN: BAN/UNBAN USER =====================

// ===================== ADMIN: SEARCH USERS =====================

// ===================== ADMIN: SYSTEM SETTINGS =====================

// ===================== ADMIN: BLOG POSTS (KV-backed, no deploy needed) =====================

// ===================== ADMIN: APPLY VOUCHER TO USER =====================

// ===================== ADMIN: BROADCAST NOTIFICATION =====================
// Email đơn giản cho nội dung admin tự gõ (không có bản dịch đa ngôn ngữ như NOTIFICATION_TEMPLATES
// — gửi nguyên văn title/message admin đã nhập, dùng lại đúng khung/màu email đã có).

// ===================== ADMIN: LIST NOTIFICATIONS =====================

// ===================== ADMIN: DELETE NOTIFICATION =====================

// ===================== USER: GET MY NOTIFICATIONS =====================

// ===================== USER: MARK NOTIFICATION READ =====================

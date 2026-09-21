import { MAX_BIO_SUBLINKS, normalizeCustomDomain } from "../config/constants.js";
import { TIER_CONFIG, isProOrAboveRole } from "../config/tiers.js";
import { getTeam, isUserInSameTeam } from "./teams.js";
import { st } from "../i18n/server.js";
import { addAuditLog } from "../kv/audit.js";
import { isDomainBlacklisted, isKeywordBlacklisted } from "../kv/blacklist.js";
import { deleteLinkKV, generateCode, getLink, listAllLinks, putLink, shortUrlFor } from "../kv/links.js";
import { getUser } from "../kv/users.js";
import { getAuthenticatedUser, requireAuthResponse } from "../utils/auth.js";
import { hashPassword, randomHex } from "../utils/crypto.js";
import { getClientIp, json, todayStr } from "../utils/http.js";
import { checkDailyQuota, getEffectiveTierConfig, incrementDailyQuota } from "../utils/quota.js";

// Links: create/edit/delete/restore, bulk shorten, link-in-bio.

export async function createLinkInternal(env, { url: targetUrl, owner, role, customCode, title, campaign, tags, expiryDate, customDomain, password, pixels, abUrls, abPercentages, deepLinks }) {
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

export async function createBioPageInternal(env, { owner, role, displayName, bio, links, customCode }) {
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

export async function handleListLinks(request, env, url, corsHeaders) {
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

export async function handleCreateLink(request, env, url, corsHeaders) {
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

export async function handleBulkCreateLinks(request, env, url, corsHeaders) {
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

export async function handleUpdateLink(request, env, url, code, corsHeaders) {
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

  // Giới hạn kiểu/độ dài để 1 request không làm phình bản ghi KV (giá trị tối đa 25MB, nhưng bản ghi link được đọc lại ở mọi lần list).
  if (title !== undefined && (typeof title !== "string" || title.length > 200)) return json({ error: "Tiêu đề phải là chuỗi tối đa 200 ký tự" }, 400, corsHeaders);
  if (campaign !== undefined && (typeof campaign !== "string" || campaign.length > 100)) return json({ error: "Chiến dịch phải là chuỗi tối đa 100 ký tự" }, 400, corsHeaders);
  if (tags !== undefined && (!Array.isArray(tags) || tags.length > 20 || tags.some(function(t){ return typeof t !== "string" || t.length > 50; }))) return json({ error: "Tags phải là mảng tối đa 20 mục, mỗi mục tối đa 50 ký tự" }, 400, corsHeaders);
  if (isEnabled !== undefined && typeof isEnabled !== "boolean") return json({ error: "isEnabled phải là true/false" }, 400, corsHeaders);
  if (expiryDate !== undefined && expiryDate !== null && expiryDate !== "" && (typeof expiryDate !== "string" || isNaN(new Date(expiryDate).getTime()))) return json({ error: "Ngày hết hạn không hợp lệ" }, 400, corsHeaders);
  if (newUrl !== undefined && (typeof newUrl !== "string" || newUrl.length > 2048)) return json({ error: "URL mới không hợp lệ" }, 400, corsHeaders);

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

export async function handleCreateBioPage(request, env, url, corsHeaders) {
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

export async function handleUpdateBioPage(request, env, url, code, corsHeaders) {
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

export async function handleBioLinkClick(request, env, code, corsHeaders) {
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

export async function handleDeleteLink(request, env, code, corsHeaders) {
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

export async function handleRestoreLink(request, env, code, corsHeaders) {
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

export async function handleForceDeleteLink(request, env, code, corsHeaders) {
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

import { PAYMENT_URL_PATTERNS, VALID_QR_DOT_STYLES } from "../config/constants.js";
import { createLinkInternal } from "./links.js";
import { isDomainBlacklisted } from "../kv/blacklist.js";
import { deleteLinkKV, getLink, putLink } from "../kv/links.js";
import { deleteQrRecord, generateQrId, getQrRecord, listAllQrRecords, putQrRecord, qrRecordToResponse } from "../kv/qr.js";
import { getUser, putUser } from "../kv/users.js";
import { getAuthenticatedUser, requireAuthResponse } from "../utils/auth.js";
import { json } from "../utils/http.js";
import { checkDailyQuota, checkMonthlyDynamicQrQuota, incrementDailyQuota, incrementMonthlyDynamicQrQuota } from "../utils/quota.js";

// QR: static/dynamic QR creation and management, scanner inspection.

export async function handleCreateQr(request, env, corsHeaders) {
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

export function looksLikePaymentUrl(u) {
  if (!u) return false;
  return PAYMENT_URL_PATTERNS.some(re => re.test(u));
}

export function validateQrLogoDataUrl(logoDataUrl) {
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

export async function handleCreateDynamicQr(request, env, url, corsHeaders) {
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

export async function handleAcceptQrDynamicTerms(request, env, corsHeaders) {
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

export async function handleListDynamicQr(request, env, url, corsHeaders) {
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

export async function handleUpdateDynamicQr(request, env, url, qrId, corsHeaders) {
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

export async function handleDeleteDynamicQr(request, env, qrId, corsHeaders) {
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

export async function handleInspectQr(request, env, url, corsHeaders) {
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

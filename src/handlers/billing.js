import { TIER_RANK } from "../config/tiers.js";
import { renderNotificationTemplate } from "../i18n/notifications.js";
import { st } from "../i18n/server.js";
import { addAuditLog } from "../kv/audit.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { bytesToHex, randomHex } from "../utils/crypto.js";
import { notifyAllAdmins, notifyUser, sendVoucherEmail } from "../utils/email.js";
import { json } from "../utils/http.js";

// Billing: Stripe checkout/webhook, VietQR manual-approval payments, vouchers, promo settings.

export async function upgradeUserRole(env, username, newTier, expiryDays) {
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

export async function handleCreateVoucher(request, env, corsHeaders) {
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

export async function handleListVouchers(request, env, corsHeaders) {
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

export async function handleDeleteVoucher(request, env, code, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user || user.role !== "admin") return json({ error: "Chỉ admin" }, 403, corsHeaders);
  await env.LINKS_KV.delete("voucher:" + code.toUpperCase());
  await addAuditLog(env, user, "DELETE_VOUCHER", { code }, request);
  return json({ success: true }, 200, corsHeaders);
}

export async function handleRedeemVoucher(request, env, corsHeaders) {
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

export async function verifyStripeSignature(body, signatureHeader, secret) {
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

export async function handleStripeCheckout(request, env, url, corsHeaders) {
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

export async function handleVoucherCheckout(request, env, url, corsHeaders) {
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

export async function handleQrCheckout(request, env, corsHeaders) {
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

export async function handleQrGenerate(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  let body; try { body = await request.json(); } catch (e) { body = {}; }
  const { tier, period, vndPrice, orderId } = body || {};
  if (!tier || !vndPrice || !orderId) return json({ error: st("missing_info", request) }, 400, corsHeaders);
  // Dùng img.vietqr.io — tạo QR trực tiếp qua URL, không cần API key
  var qrUrl = "https://img.vietqr.io/api/ACB/25105621/" + parseInt(vndPrice) + "/" + encodeURIComponent(orderId) + "/qr_only.png";
  return json({ success: true, qrUrl: qrUrl }, 200, corsHeaders);
}

export async function handleListQrPayments(request, env, corsHeaders) {
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

export async function handleApproveQrPayment(request, env, corsHeaders) {
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

export async function handleQrStatus(request, env, corsHeaders) {
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

export async function handleQrStatusAck(request, env, corsHeaders) {
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

export async function handleRejectQrPayment(request, env, corsHeaders) {
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

export async function handleRevokeQrPayment(request, env, corsHeaders) {
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

export async function handleStripeWebhook(request, env, corsHeaders) {
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

export async function handlePaymentHistory(request, env, corsHeaders) {
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

export async function handleGetPromoSettings(request, env, corsHeaders) {
  // Public — tất cả user đều đọc được để hiển thị giá giảm
  const raw = await env.LINKS_KV.get("promo:settings");
  const settings = raw ? JSON.parse(raw) : { active: false, tiers: {} };
  return json({ settings }, 200, corsHeaders);
}

export async function handleSavePromoSettings(request, env, corsHeaders) {
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Không có quyền" }, 403, corsHeaders);
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  await env.LINKS_KV.put("promo:settings", JSON.stringify(body));
  return json({ ok: true }, 200, corsHeaders);
}

import { getLink } from "../kv/links.js";
import { putReport } from "../kv/reports.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { randomHex } from "../utils/crypto.js";
import { notifyAllAdmins } from "../utils/email.js";
import { getClientIp, json } from "../utils/http.js";

// Public feedback submission and safety/abuse reports.

export async function handleFeedback(request, env, corsHeaders) {
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

// Nhãn loại vi phạm (tiếng Việt) để quản trị viên đọc trong tab Báo cáo.
const REPORT_CATEGORIES = {
  scam: "Lừa đảo / chiếm đoạt tiền", phishing: "Giả mạo trang đăng nhập / đánh cắp thông tin",
  impersonation: "Giả mạo cá nhân, thương hiệu, tổ chức", malware: "Mã độc", illegal: "Nội dung vi phạm pháp luật",
  spam: "Spam", other: "Khác"
};
const REPORT_MAX_PER_HOUR = 5;

// Báo cáo công khai (không cần đăng nhập). Nhận hoặc `code` (từ trang cảnh báo) hoặc `target` (form Báo cáo lạm dụng:
// link SHURL đầy đủ hoặc mô tả tự do, vd mã QR/tài khoản đáng ngờ).
export async function handleCreateReport(request, env, corsHeaders) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  body = body || {};
  const clean = (v, n) => String(v == null ? "" : v).trim().slice(0, n);
  let code = clean(body.code, 64);
  const target = clean(body.target, 500);
  const details = clean(body.details, 1000);
  const contact = clean(body.contact, 120);
  const category = REPORT_CATEGORIES[body.category] ? body.category : "";
  if (!code && !target) return json({ error: "Thiếu link hoặc nội dung cần báo cáo" }, 400, corsHeaders);

  // Endpoint công khai ghi vào KV: giới hạn theo IP để tránh spam báo cáo.
  const ip = getClientIp(request);
  const rlKey = "rl:report:" + ip;
  const used = parseInt(await env.LINKS_KV.get(rlKey), 10) || 0;
  if (used >= REPORT_MAX_PER_HOUR) return json({ error: "Bạn gửi quá nhiều báo cáo. Vui lòng thử lại sau." }, 429, corsHeaders);
  await env.LINKS_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });

  // Người dùng dán link SHURL đầy đủ (vd https://shurlvn.com/abc123) thì tách mã link để admin xử lý được.
  if (!code && target) {
    const m = target.match(/^(?:https?:\/\/)?(?:[a-z0-9-]+\.)*shurlvn\.com\/([A-Za-z0-9_-]{1,64})\/?(?:[?#].*)?$/i);
    if (m) code = m[1];
  }
  const link = code ? await getLink(env, code) : null;
  const catLabel = category ? REPORT_CATEGORIES[category] : "";
  const reasonParts = [catLabel, clean(body.reason, 200), details].filter(Boolean);
  const report = {
    id: "rep_" + randomHex(6),
    code,
    target,
    category,
    url: link ? link.url : (target || "unknown"),
    reason: reasonParts.join(" — ") || "Báo cáo vi phạm an toàn",
    contact,
    reportedAt: new Date().toISOString(),
    status: "pending"
  };
  await putReport(env, report);
  try {
    await notifyAllAdmins(env, {
      type: "warning",
      title: "Bao cao vi pham moi",
      message: "Bao cao: " + (code ? "/" + code : target.slice(0, 80)) + (catLabel ? " (" + catLabel + ")" : "")
    });
  } catch(e) {}
  return json({ ok: true }, 200, corsHeaders);
}

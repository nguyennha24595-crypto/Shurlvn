import { getLink } from "../kv/links.js";
import { putReport } from "../kv/reports.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { randomHex } from "../utils/crypto.js";
import { notifyAllAdmins } from "../utils/email.js";
import { json } from "../utils/http.js";

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

export async function handleCreateReport(request, env, corsHeaders) {
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

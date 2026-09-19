// Email sending (Resend API) and the shared in-app-notification (+optional email) helpers.

import { randomHex } from "./crypto.js";
import { getUser, listAllUsers } from "../kv/users.js";
import { SERVER_I18N } from "../i18n/server.js";
import { buildResetEmail, buildEmailShell } from "../views/emailTemplates.js";

export async function sendEmail(env, opts) {
  try {
    var res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "SHURL <noreply@shurlvn.com>",
        to: [opts.to],
        reply_to: "support@shurlvn.com",
        subject: opts.subject,
        html: opts.html
      })
    });
    if (!res.ok) {
      var errText = await res.text();
      console.log("Resend error:", errText);
    }
    return res.ok;
  } catch (e) {
    console.log("sendEmail exception:", e.message);
    return false;
  }
}

export async function sendResetEmail(env, toEmail, lang, code) {
  var domain = "shurlvn.com";
  var mail = buildResetEmail(lang, code, domain);
  return sendEmail(env, { to: toEmail, subject: mail.subject, html: mail.html });
}

export async function notifyUser(env, opts) {
  const notifId = "notif_" + Date.now() + "_" + randomHex(4);
  const notif = {
    id: notifId,
    title: opts.title,
    message: opts.message,
    type: opts.type || "info",
    from: opts.from || "system",
    createdAt: new Date().toISOString(),
    read: false
  };
  await env.LINKS_KV.put("notif:user:" + opts.username.toLowerCase() + ":" + notifId, JSON.stringify(notif));
  if (opts.sendEmailToo && opts.emailSubject && opts.emailHtml) {
    const user = await getUser(env, opts.username);
    if (user && user.email) await sendEmail(env, { to: user.email, subject: opts.emailSubject, html: opts.emailHtml });
  }
  return notifId;
}

export async function notifyAllAdmins(env, opts) {
  const allUsers = await listAllUsers(env);
  for (const u of allUsers) {
    if (u.role === "admin") {
      await notifyUser(env, { username: u.username, type: opts.type, title: opts.title, message: opts.message, from: opts.from || "system" });
    }
  }
}

export async function sendVoucherEmail(env, toEmail, voucherCode, tier, origin, lang) {
  var L = SERVER_I18N[lang] || SERVER_I18N.vi;
  var voucherLang = SERVER_I18N[lang] ? lang : "vi";
  var tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
  var subject = L.subject + " " + tierName;
  var introHtml = "<p>" + L.thanks_1 + ' <b>"' + tierName + '"</b> ' + L.thanks_2 + " " + L.brand + "</p><p>" + L.instruction + "</p>";
  var afterHtml = "<p>" + L.activate_note + ' <b>"' + tierName + '"</b> ' + L.activate_note_2 + "</p><p>" + L.closing + "</p>";
  var voucherReason = voucherLang === "vi" ? "Bạn nhận được email này vì vừa nhận hoặc mua một voucher SHURL." : "You're receiving this email because you just received or purchased a SHURL voucher.";
  var htmlBody = buildEmailShell({
    lang: voucherLang, illustration: "voucher",
    title: L.subject, introHtml: introHtml, code: voucherCode, afterHtml: afterHtml,
    ctaText: null, ctaUrl: null,
    warningHtml: L.warning, footerReason: voucherReason
  });

  return sendEmail(env, { to: toEmail, subject: subject, html: htmlBody });
}

// Email/misc HTML fragments: maintenance page, forgot-password mini view (client-side, kept as-is), shared email shell, reset-password email.

import { EMAIL_LABELS } from "../i18n/notifications.js";

export function MAINTENANCE_HTML(note) {
  return '<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bao tri he thong</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#1e293b,#0f172a);color:#e2e8f0;} .container{text-align:center;max-width:500px;padding:40px;} .icon{font-size:64px;margin-bottom:20px;} h1{font-size:24px;margin:0 0 12px;} p{font-size:15px;color:#94a3b8;line-height:1.6;} .note{margin-top:16px;padding:12px 20px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:8px;color:#a5b4fc;font-size:14px;} .footer{margin-top:30px;font-size:12px;color:#475569;}</style></head><body><div class="container"><div class="icon">' + li('wrench', 64) + '</div><h1>He thong dang bao tri</h1><p>Chung toi dang nang cap he thong de phuc vu ban tot hon. Vui long quay lai sau it phut.</p>' + (note ? '<div class="note">' + note + '</div>' : '') + '<div class="footer">Powered by Cloudflare</div></div></body></html>';
}

export function renderForgotPassword(app){
  app.innerHTML =
    '<div class="card" style="max-width:420px;margin:0 auto;">' +
    '<h1>' + t("forgot_password") + '</h1>' +
    '<p class="sub">' + t("forgot_sub") + '</p>' +
    '<form id="forgotForm">' +
      '<label>' + t("reg_username") + '</label><input type="text" id="f_user" required>' +
      '<div id="forgotMsg"></div>' +
      '<div style="margin-top:18px;"><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center;">' + t("forgot_submit") + '</button></div>' +
    '</form>' +
    '<form id="resetForm" style="display:none;">' +
      '<label>' + t("reset_code") + '</label><input type="text" id="r_code" maxlength="6" required>' +
      '<label>' + t("reg_newpassword") + '</label><input type="password" id="r_pass" required>' +
      '<div id="resetMsg"></div>' +
      '<div style="margin-top:18px;"><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center;">' + t("reset_submit") + '</button></div>' +
    '</form>' +
    '<p class="hint" style="margin-top:16px;"><a href="#/login">' + t("back_to_login") + '</a></p>' +
    '</div>';

  document.getElementById("forgotForm").addEventListener("submit", function(e){
    e.preventDefault();
    var msg = document.getElementById("forgotMsg");
    msg.innerHTML = "";
    api("/api/auth/forgot", "POST", {
      username: document.getElementById("f_user").value.trim(),
      lang: currentLang || "vi"
    }).then(function(data){
      document.getElementById("forgotForm").style.display = "none";
      document.getElementById("resetForm").style.display = "block";
      msg.innerHTML = "";
    }).catch(function(err){
      msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  });

  document.getElementById("resetForm").addEventListener("submit", function(e){
    e.preventDefault();
    var msg = document.getElementById("resetMsg");
    msg.innerHTML = "";
    api("/api/auth/reset", "POST", {
      username: document.getElementById("f_user").value.trim(),
      code: document.getElementById("r_code").value.trim(),
      new_password: document.getElementById("r_pass").value
    }).then(function(){
      navigate("login"); render();
    }).catch(function(err){
      msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  });
}

export function buildEmailShell(opts) {
  var L = EMAIL_LABELS[opts.lang] || EMAIL_LABELS.vi;
  var FONT = "Arial,Helvetica,'Segoe UI',sans-serif";
  var codeBoxHtml = opts.code ? (
    '<div style="text-align:center;margin:24px 0;">' +
    '<span style="display:inline-block;background:#eef2ff;border:2px solid #6366f1;border-radius:12px;padding:16px 32px;font-size:26px;font-weight:800;letter-spacing:4px;color:#4338ca;font-family:' + FONT + ';">' + opts.code + '</span>' +
    '</div>'
  ) : "";
  var detailBoxHtml = "";
  if (opts.detailRows && opts.detailRows.length) {
    detailBoxHtml = '<div style="background:#faf9f7;border:1px solid #e5e5e5;border-radius:12px;margin:24px 0;padding:14px 20px;">' +
      opts.detailRows.map(function(r, i){
        var top = i > 0 ? "border-top:1px solid #e5e5e5;padding-top:10px;margin-top:10px;" : "";
        return '<div style="' + top + '">' +
          '<div style="font-size:12px;color:#767676;font-family:' + FONT + ';">' + r.label + '</div>' +
          '<div style="font-size:14px;color:#1a1a1a;font-weight:700;font-family:' + FONT + ';margin-top:2px;">' + r.value + '</div>' +
          '</div>';
      }).join("") +
      '</div>';
  }
  var logoBadge =
    '<span style="display:inline-block;width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);vertical-align:middle;"></span>' +
    '<span style="display:inline-block;width:8px;"></span>' +
    '<span style="display:inline-block;vertical-align:middle;font-size:20px;font-weight:700;letter-spacing:-0.3px;color:#1a1a1a;font-family:' + FONT + ';">SHURL</span>';
  var footerReason = opts.footerReason || L.reasonGeneric;
  // Ảnh unDraw thật host tại /email-assets/<key>.png (route trong fetch handler) — dùng <img>
  // thường (không phải SVG) vì Gmail/Outlook không render SVG dưới bất kỳ hình thức nào.
  var illustrationHtml = opts.illustration ? (
    '<div style="text-align:center;margin:16px 0 4px;">' +
    '<img src="https://shurlvn.com/email-assets/' + opts.illustration + '.png" width="200" alt="" style="width:200px;max-width:100%;height:auto;display:block;margin:0 auto;border:0;">' +
    '</div>'
  ) : "";
  var cardBody =
    '<div style="text-align:center;">' + logoBadge + '</div>' +
    illustrationHtml +
    '<h1 style="text-align:center;font-size:20px;color:#1a1a1a;margin:8px 0 16px;font-family:' + FONT + ';">' + opts.title + '</h1>' +
    '<div style="font-size:14px;line-height:1.7;color:#4b4b4b;font-family:' + FONT + ';text-align:center;">' + opts.introHtml + '</div>' +
    codeBoxHtml +
    detailBoxHtml +
    (opts.afterHtml ? '<div style="font-size:13px;line-height:1.6;color:#767676;margin-top:16px;font-family:' + FONT + ';text-align:center;">' + opts.afterHtml + '</div>' : "") +
    (opts.ctaText ? '<div style="text-align:center;margin:28px 0 4px;"><a href="' + opts.ctaUrl + '" style="display:inline-block;background:#6366f1;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;font-family:' + FONT + ';">' + opts.ctaText + '</a></div>' : "") +
    (opts.warningHtml ? '<p style="font-size:12px;color:#ef4444;margin-top:20px;font-family:' + FONT + ';text-align:center;">' + opts.warningHtml + '</p>' : "") +
    '<div style="border-top:1px solid #e5e5e5;margin-top:32px;padding-top:20px;text-align:center;">' +
    '<div style="font-size:12px;color:#888888;line-height:1.7;font-family:' + FONT + ';">' +
    footerReason + '<br>' +
    L.support + ' <a href="mailto:nguyennha24595@gmail.com" style="color:#888888;text-decoration:underline;">nguyennha24595@gmail.com</a><br>' +
    '<a href="https://shurlvn.com/#/terms" style="color:#888888;text-decoration:underline;">' + L.terms + '</a>' +
    '<span> &middot; </span>' +
    '<a href="https://shurlvn.com/#/privacy" style="color:#888888;text-decoration:underline;">' + L.privacy + '</a>' +
    '</div>' +
    '</div>';
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf9f5;">' +
    '<tr><td align="center" style="padding:40px 16px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;">' +
    '<tr><td style="padding:40px;">' + cardBody + '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '</table>';
}

export function buildResetEmail(lang, code, domain) {
  var T = {
    vi: {
      subject: "[SHURL] Mã khôi phục mật khẩu: " + code,
      title: "Khôi phục mật khẩu",
      intro: "Bạn vừa yêu cầu khôi phục mật khẩu cho tài khoản tại <b>" + domain + "</b>. Nhập mã bên dưới tại trang đặt lại mật khẩu để tiếp tục:",
      cta: "Đặt lại mật khẩu",
      warning: "Nếu bạn không yêu cầu mã này, có thể ai đó đang cố truy cập tài khoản của bạn. Không chia sẻ mã này với bất kỳ ai.",
      reason: "Bạn nhận được email này vì có yêu cầu khôi phục mật khẩu cho tài khoản SHURL của bạn."
    },
    en: {
      subject: "[SHURL] Your password reset code: " + code,
      title: "Password Recovery",
      intro: "You recently requested to reset your password at <b>" + domain + "</b>. Enter the code below on the reset page to continue:",
      cta: "Reset password",
      warning: "If you didn't request this code, someone may be trying to access your account. Don't share this code with anyone.",
      reason: "You're receiving this email because of a password reset request for your SHURL account."
    }
  };
  var m = T[lang] || T.en;
  var html = buildEmailShell({
    lang: lang, illustration: "reset",
    title: m.title, introHtml: "<p>" + m.intro + "</p>", code: code,
    ctaText: m.cta, ctaUrl: "https://" + domain + "/#/forgot-password",
    warningHtml: m.warning, footerReason: m.reason
  });
  return { subject: m.subject, html: html };
}

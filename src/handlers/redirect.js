import { PW_LOCKOUT_TTL, PW_MAX_ATTEMPTS_FALLBACK } from "../config/constants.js";
import { st } from "../i18n/server.js";
import { recordClick } from "../kv/clicks.js";
import { hashPassword } from "../utils/crypto.js";
import { escHtml, escJsString, html, json } from "../utils/http.js";
import { renderBioPageHtml } from "../views/bioHtml.js";

// Short-link redirect: password gate, pixel tracking, A/B routing, safety warning interstitial.

export async function handleRedirect(request, env, url, path, ctx) {
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

export function pickABUrl(urls, percentages) {
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

export function renderPasswordPage(code, origin, request) {
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

export function renderPixelPage(destUrl, pixels) {
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

export async function handleVerifyPassword(request, env, code, corsHeaders) {
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

export function renderSafetyWarningHtml(code, targetUrl) {
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

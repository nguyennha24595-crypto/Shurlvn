import { LOGIN_LOCKOUT_TTL, LOGIN_MAX_ATTEMPTS, OAUTH_STATE_COOKIE, PW_RESET_TTL, SESSION_COOKIE, SESSION_TTL } from "../config/constants.js";
import { renderNotificationTemplate } from "../i18n/notifications.js";
import { st } from "../i18n/server.js";
import { getUser, putUser, safeUser } from "../kv/users.js";
import { clearOauthStateCookieHeader, getAuthenticatedUser, requireAuthResponse } from "../utils/auth.js";
import { hashPassword, randomHex, randomSixDigitCode } from "../utils/crypto.js";
import { notifyUser, sendResetEmail } from "../utils/email.js";
import { clearSessionCookieHeader, json, parseCookies, setSessionCookieHeader } from "../utils/http.js";
import { getEffectiveTierConfig } from "../utils/quota.js";

// Auth: register/login/logout, Google OAuth, tokens, forgot/reset password, 2FA.

export async function handleRegister(request, env, corsHeaders) {
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

export async function handleLogin(request, env, corsHeaders) {
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

export async function handleLogout(request, env, corsHeaders) {
  const cookies = parseCookies(request);
  const sessionToken = cookies[SESSION_COOKIE];
  if (sessionToken) {
    await env.LINKS_KV.delete("session:" + sessionToken);
  }
  return json({ ok: true }, 200, corsHeaders, { "Set-Cookie": clearSessionCookieHeader() });
}

export async function handleGoogleAuthStart(request, env, corsHeaders) {
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

export async function handleGoogleAuthCallback(request, env, corsHeaders) {
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

export async function handleMe(request, env, corsHeaders) {
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

export async function handleGenerateToken(request, env, corsHeaders) {
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

export async function handleGenerateExtensionToken(request, env, corsHeaders) {
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

export async function handleForgotPassword(request, env, corsHeaders) {
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

export async function handleResetPassword(request, env, corsHeaders) {
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

export function generateTotpSecret(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 20; i++){
    secret += chars[(bytes[i] & 248) >> 3];
  }
  return secret;
}

export async function generateTotpCode(secret, timeStep){
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

export function getOtpAuthUrl(secret, username, domain){
  return "otpauth://totp/SHURL:" + encodeURIComponent(username) + "?secret=" + secret + "&issuer=SHURL&period=30&digits=6";
}

export async function handleSetup2fa(request, env, corsHeaders){
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

export async function handleVerify2fa(request, env, corsHeaders){
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

export async function handleDisable2fa(request, env, corsHeaders){
  const user = await getAuthenticatedUser(request, env);
  if (!user) return json({ error: st("not_logged_in", request) }, 401, corsHeaders);
  if (user.role !== "admin") return json({ error: "Chỉ admin mới được tắt 2FA" }, 403, corsHeaders);

  const fullUser = await getUser(env, user.username);
  delete fullUser.totpSecret;
  delete fullUser.totpEnabled;
  await putUser(env, fullUser);

  return json({ ok: true, message: "2FA đã tắt." }, 200, corsHeaders);
}

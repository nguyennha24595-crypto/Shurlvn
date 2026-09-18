// HTTP/response helpers: JSON/HTML responses, escaping, cookies, client IP, webhook SSRF guard.

import { SESSION_COOKIE } from "../config/constants.js";

export function json(body, status, corsHeaders, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", ...(extraHeaders || {}) }
  });
}

export function html(body, status, extraHeaders) {
  return new Response(body, {
    status: status || 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Cross-Origin-Opener-Policy": "same-origin",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      ...(extraHeaders || {})
    }
  });
}

export function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escJsString(s) {
  return JSON.stringify(String(s == null ? "" : s)).replace(/</g, "\\u003C");
}

export function isBlockedWebhookHost(hostname) {
  const h = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  if (!h) return true;
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
    if (a === 127 || a === 10 || a === 0) return true;               // loopback, 10.0.0.0/8, 0.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true;                 // 172.16.0.0/12
    if (a === 192 && b === 168) return true;                          // 192.168.0.0/16
    if (a === 169 && b === 254) return true;                          // link-local, incl. cloud metadata (169.254.169.254)
    return false;
  }
  if (h === "::1" || h === "::") return true;
  if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) return true; // IPv6 link-local / unique-local
  return false;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function thisMonthStr() {
  return new Date().toISOString().slice(0, 7);
}

export function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach(part => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

export function setSessionCookieHeader(token, maxAgeSeconds) {
  const attrs = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Secure",
    `Max-Age=${maxAgeSeconds}`
  ];
  return attrs.join("; ");
}

export function clearSessionCookieHeader() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

export function getClientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "127.0.0.1";
}

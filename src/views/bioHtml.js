// Public link-in-bio page renderer.

import { escHtml, html } from "../utils/http.js";

export function renderBioPageHtml(link, url) {
  var profile = link.bioProfile || {};
  var displayName = escHtml(profile.displayName || link.title || link.code);
  var bioText = escHtml(profile.bio || "");
  var linksHtml = (link.bioLinks || []).map(function (l) {
    // l.id is always server-generated ("sl_" + randomHex(4)), never user input — safe to inline directly.
    return '<a class="bio-link" href="' + escHtml(l.url) + '" target="_blank" rel="noopener" onclick="trackBioClick(\'' + l.id + '\')">' + escHtml(l.title) + '</a>';
  }).join("");
  return html(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + displayName + ' · SHURL</title>' +
    '<style>' +
    '*{box-sizing:border-box;}' +
    'body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;margin:0;display:flex;justify-content:center;padding:48px 16px;}' +
    '.wrap{max-width:420px;width:100%;text-align:center;}' +
    '.avatar{width:72px;height:72px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto 16px;}' +
    'h1{font-size:20px;margin:0 0 6px;}' +
    '.bio{color:#94a3b8;font-size:14px;margin:0 0 28px;white-space:pre-wrap;}' +
    '.bio-link{display:block;background:#1e293b;color:#e2e8f0;text-decoration:none;padding:14px 18px;border-radius:12px;margin-bottom:12px;font-size:15px;font-weight:600;border:1px solid #334155;transition:background 0.15s;}' +
    '.bio-link:hover{background:#334155;}' +
    'footer{margin-top:32px;font-size:12px;color:#64748b;}' +
    'footer a{color:#818cf8;text-decoration:none;}' +
    '</style></head><body>' +
    '<div class="wrap">' +
    '<div class="avatar">' + escHtml((profile.displayName || "?").trim().charAt(0).toUpperCase()) + '</div>' +
    '<h1>' + displayName + '</h1>' +
    (bioText ? '<p class="bio">' + bioText + '</p>' : '') +
    linksHtml +
    '<footer>Tạo bởi <a href="https://shurlvn.com" target="_blank">SHURL</a></footer>' +
    '</div>' +
    '<script>' +
    'function trackBioClick(id){try{navigator.sendBeacon("/api/links/bio/' + link.code + '/click", new Blob([JSON.stringify({subLinkId:id})],{type:"application/json"}));}catch(e){}}' +
    '</script></body></html>',
    200
  );
}

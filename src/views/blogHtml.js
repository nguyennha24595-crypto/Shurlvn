// Server-rendered blog pages (layout, index, single post) + the deferred Google Ads gtag head snippet.

import { escHtml } from "../utils/http.js";

// opts (tuỳ chọn, các trang tools dùng): { lang, ogType, headExtra, footerHtml } — mặc định giữ nguyên hành vi trang blog.
export function renderBlogLayout(titleText, descriptionText, canonicalPath, bodyHtml, env, opts) {
  const o = opts || {};
  const t = escHtml(titleText), d = escHtml(descriptionText);
  return `<!DOCTYPE html>
<html lang="${o.lang || 'vi'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="https://shurlvn.com${canonicalPath}">
<meta property="og:type" content="${o.ogType || 'article'}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="https://shurlvn.com${canonicalPath}">
<link rel="icon" type="image/png" href="/favicon.ico">
${o.headExtra || ''}
${googleAdsGtagHead(env)}
<style>
body{margin:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.7;}
.wrap{max-width:760px;margin:0 auto;padding:24px 20px 60px;}
header{padding:18px 0;border-bottom:1px solid rgba(15,23,42,0.08);margin-bottom:28px;}
header a{font-weight:800;font-size:20px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;text-decoration:none;}
h1{font-size:28px;line-height:1.3;margin:0 0 10px;color:#0f172a;}
h2{font-size:20px;margin:30px 0 10px;color:#0f172a;}
h3{font-size:17px;margin:24px 0 8px;color:#0f172a;}
p,li{font-size:16px;color:#334155;}
.meta{color:#64748b;font-size:13px;margin-bottom:24px;}
a{color:#6366f1;}
img{max-width:100%;border-radius:12px;border:1px solid rgba(15,23,42,0.08);box-shadow:0 4px 16px rgba(15,23,42,0.08);margin:18px 0;}
blockquote{background:rgba(99,102,241,0.07);border-left:3px solid #6366f1;border-radius:8px;margin:20px 0;padding:14px 18px;color:#1e293b;}
.cta{margin-top:40px;background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(192,132,252,0.12));border:1px solid rgba(99,102,241,0.25);border-radius:16px;padding:28px;text-align:center;}
.cta h3{margin:0 0 10px;color:#0f172a;font-size:20px;}
.cta a{display:inline-block;margin-top:10px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;font-weight:700;padding:12px 26px;border-radius:10px;}
.postlist a{color:#0f172a;text-decoration:none;font-weight:700;font-size:18px;}
.postlist li{list-style:none;margin-bottom:22px;}
footer{margin-top:50px;text-align:center;color:#94a3b8;font-size:13px;}
footer a{color:#64748b;}
.mockup{border:1px solid rgba(15,23,42,0.1);border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);margin:20px 0;}
.mockup-topbar{background:#eef0f4;padding:10px 14px;display:flex;align-items:center;gap:6px;}
.mockup-dot{width:9px;height:9px;border-radius:50%;background:#d1d5db;display:inline-block;}
.mockup-url{margin-left:8px;font-size:12px;color:#64748b;background:#fff;border-radius:6px;padding:3px 10px;}
.mockup-body{background:#fff;padding:22px;}
.mockup-brand{font-weight:800;font-size:15px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:16px;}
.mockup-card-title{font-size:20px;font-weight:800;color:#0f172a;margin:0 0 6px;}
.mockup-card-sub{font-size:13px;color:#64748b;margin:0 0 16px;}
.mockup-label{display:block;font-size:12px;font-weight:600;color:#334155;margin-bottom:6px;}
.mockup-input{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;font-size:13px;color:#0f172a;margin-bottom:14px;}
.mockup-input.ph{color:#94a3b8;}
.mockup-btn{display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;font-weight:700;font-size:13px;padding:9px 18px;border-radius:8px;}
.mockup-result{margin-top:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:11px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.mockup-result .link{font-family:monospace;color:#6366f1;font-weight:700;font-size:13px;}
.mockup-result .copy{font-weight:600;color:#334155;background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:4px 10px;font-size:12px;white-space:nowrap;}
.mockup-dest{font-size:12px;color:#94a3b8;margin-top:8px;}
.mockup-caption{text-align:center;font-size:13px;color:#94a3b8;margin:-10px 0 24px;font-style:italic;}
.qr-row{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;margin:20px 0;}
.qr-row figure{margin:0;text-align:center;}
.qr-row img{margin:0 0 8px;}
.qr-row figcaption{font-size:12px;color:#64748b;}
.cmp-table-wrap{overflow-x:auto;margin:20px 0;}
.cmp-table{width:100%;border-collapse:collapse;font-size:14px;}
.cmp-table th,.cmp-table td{border:1px solid #e2e8f0;padding:10px 12px;text-align:left;}
.cmp-table th{background:#f1f5f9;color:#0f172a;font-weight:700;}
.cmp-table td:first-child{font-weight:600;color:#0f172a;white-space:nowrap;}
.cmp-table .yes{color:#16a34a;font-weight:700;}
.cmp-table .no{color:#94a3b8;}
.cmp-table td:last-child,.cmp-table th:last-child{background:rgba(99,102,241,0.06);}
.cmp-table th:last-child{background:rgba(99,102,241,0.15);}
</style>
</head>
<body>
<div class="wrap">
<header><a href="/"><img src="data:image/png;base64,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" width="24" height="24" alt="SHURL" style="width:24px;height:24px;aspect-ratio:1/1;vertical-align:middle;margin:0 6px 0 0;border:none;box-shadow:none;"> SHORT URL</a></header>
${bodyHtml}
<footer>${o.footerHtml || '<a href="/">← Về trang chủ SHURL</a> · <a href="/tools">Công cụ</a> · <a href="/blog">Xem tất cả bài viết</a>'}</footer>
</div>
</body>
</html>`;
}

export function renderBlogIndexPage(posts, env) {
  const items = posts.map(p =>
    `<li><a href="/blog/${escHtml(p.slug)}">${escHtml(p.title)}</a><p class="meta">${escHtml(p.date)}</p><p>${escHtml(p.description)}</p></li>`
  ).join("");
  const body = `<h1>Blog SHURL</h1><p class="meta">Mẹo và hướng dẫn công nghệ, kèm theo cách dùng SHURL để chia sẻ link nhanh gọn hơn.</p><ul class="postlist">${items}</ul>`;
  return renderBlogLayout("Blog SHURL — Mẹo công nghệ & rút gọn link", "Tổng hợp bài viết hướng dẫn công nghệ và mẹo dùng SHURL để rút gọn link, tạo mã QR miễn phí.", "/blog", body, env);
}

export function renderBlogPostPage(post, env) {
  const body = `<h1>${escHtml(post.title)}</h1><p class="meta">Cập nhật: ${escHtml(post.date)}</p>${post.contentHtml}` +
    `<div class="cta"><h3>🚀 Trải nghiệm công cụ Rút gọn link &amp; Tạo mã QR miễn phí tại Shurlvn.com ngay hôm nay!</h3>` +
    `<p>Rút gọn mọi đường link dài thành link ngắn gọn, dễ nhớ, kèm mã QR tạo tức thì — hoàn toàn miễn phí, không cần đăng ký.</p>` +
    `<a href="https://shurlvn.com">Dùng thử Shurlvn.com miễn phí</a></div>`;
  return renderBlogLayout(post.title, post.description, "/blog/" + post.slug, body, env);
}

export function googleAdsGtagHead(env) {
  const id = env && env.GOOGLE_ADS_ID;
  if (!id) return '';
  const label = (env && env.GOOGLE_ADS_CONVERSION_LABEL) || '';
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // Trì hoãn 'config' (kích hoạt GTM tải/khởi tạo nặng, ~149 KiB) tới khi rảnh main thread,
  // để không chặn FCP/LCP của lần vẽ đầu tiên.
  if ('requestIdleCallback' in window) { requestIdleCallback(function(){ gtag('config', '${id}'); }, { timeout: 2500 }); }
  else { setTimeout(function(){ gtag('config', '${id}'); }, 2500); }
  var GOOGLE_ADS_CONVERSION_SEND_TO = ${JSON.stringify(label ? (id + '/' + label) : '')};
</script>`;
}

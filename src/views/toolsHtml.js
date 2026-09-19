// Trang công cụ trình duyệt dựng phía server (để Google lập chỉ mục), song ngữ vi/en.
// Tái dùng khung trang blog (renderBlogLayout) để giữ nguyên style, logo và thẻ Google Ads.

import { renderBlogLayout } from "./blogHtml.js";
import { escHtml } from "../utils/http.js";
import { listTools, toolPath, toolsIndexPath } from "../tools/registry.js";

const ORIGIN = "https://shurlvn.com";

const UI = {
  vi: {
    indexTitle: "Công cụ miễn phí cho marketing & mạng xã hội | SHURL",
    indexH1: "Công cụ miễn phí",
    indexDesc: "Bộ công cụ chạy ngay trên trình duyệt cho marketing và mạng xã hội: đếm ký tự caption, quảng cáo, SEO. Miễn phí, không cần đăng ký.",
    indexIntro: "Các công cụ nhỏ chạy hoàn toàn trên trình duyệt của bạn — nhanh, miễn phí, không lưu dữ liệu.",
    related: "Công cụ khác",
    switchLang: "English version",
    footer: '<a href="/">← Về trang chủ SHURL</a> · <a href="/tools">Công cụ</a> · <a href="/blog">Blog</a>',
    notFoundTitle: "Không tìm thấy công cụ",
    notFoundText: "Công cụ này không tồn tại.",
    notFoundBack: "← Xem tất cả công cụ"
  },
  en: {
    indexTitle: "Free Marketing & Social Media Tools | SHURL",
    indexH1: "Free tools",
    indexDesc: "Browser-based tools for marketers and social media: character counter for captions, ads and SEO. Free, no sign-up.",
    indexIntro: "Small tools that run entirely in your browser — fast, free, and nothing is stored.",
    related: "More tools",
    switchLang: "Phiên bản tiếng Việt",
    footer: '<a href="/">← Back to SHURL</a> · <a href="/en/tools">Tools</a> · <a href="/blog">Blog</a>',
    notFoundTitle: "Tool not found",
    notFoundText: "This tool does not exist.",
    notFoundBack: "← See all tools"
  }
};

// JSON nhúng trong <script type="application/ld+json">: escape "<" để không thể đóng thẻ script sớm.
function ldJson(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, "\\u003C") + "</script>";
}

function alternates(viPath, enPath) {
  return '<link rel="alternate" hreflang="vi" href="' + ORIGIN + viPath + '">\n' +
    '<link rel="alternate" hreflang="en" href="' + ORIGIN + enPath + '">\n' +
    '<link rel="alternate" hreflang="x-default" href="' + ORIGIN + viPath + '">';
}

export function renderToolPage(tool, lang, env) {
  const T = tool[lang];
  const U = UI[lang];
  const other = lang === "vi" ? "en" : "vi";
  const canonical = toolPath(tool, lang);
  const headExtra = alternates(toolPath(tool, "vi"), toolPath(tool, "en")) + "\n" +
    ldJson({
      "@context": "https://schema.org", "@type": "WebApplication",
      name: T.h1, url: ORIGIN + canonical, description: T.description, inLanguage: lang,
      applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    }) + "\n" +
    ldJson({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: T.faq.map(function (f) { return { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }; })
    });

  const others = listTools().filter(function (t) { return t.id !== tool.id; });
  const relatedHtml = others.length
    ? '<div class="ct-sec"><h2>' + escHtml(U.related) + '</h2><ul>' +
      others.map(function (t) { return '<li><a href="' + toolPath(t, lang) + '">' + escHtml(t[lang].navName) + "</a> — " + escHtml(t[lang].short) + "</li>"; }).join("") +
      "</ul></div>"
    : "";

  const body =
    "<h1>" + escHtml(T.h1) + "</h1>" +
    T.intro.map(function (p) { return "<p>" + escHtml(p) + "</p>"; }).join("") +
    tool.renderApp(lang) +
    '<div class="ct-sec"><h2>' + escHtml(T.guideTitle) + "</h2><ol>" +
    T.guide.map(function (g) { return "<li>" + escHtml(g) + "</li>"; }).join("") + "</ol></div>" +
    '<div class="ct-sec ct-faq"><h2>' + escHtml(T.faqTitle) + "</h2>" +
    T.faq.map(function (f) { return "<details><summary>" + escHtml(f.q) + "</summary><p>" + escHtml(f.a) + "</p></details>"; }).join("") + "</div>" +
    relatedHtml +
    '<div class="cta"><h3>' + escHtml(T.ctaTitle) + "</h3><p>" + escHtml(T.ctaText) + '</p><a href="' + ORIGIN + '/">' + escHtml(T.ctaBtn) + "</a></div>" +
    '<p class="meta"><a href="' + toolPath(tool, other) + '" hreflang="' + other + '">' + escHtml(U.switchLang) + "</a></p>";

  return renderBlogLayout(T.title, T.description, canonical, body, env, {
    lang: lang, ogType: "website", headExtra: headExtra, footerHtml: U.footer
  });
}

export function renderToolsIndexPage(lang, env) {
  const U = UI[lang];
  const other = lang === "vi" ? "en" : "vi";
  const items = listTools().map(function (t) {
    return '<li><a href="' + toolPath(t, lang) + '">' + escHtml(t[lang].h1) + "</a><p>" + escHtml(t[lang].short) + "</p></li>";
  }).join("");
  const body = "<h1>" + escHtml(U.indexH1) + "</h1><p>" + escHtml(U.indexIntro) + '</p><ul class="postlist">' + items + "</ul>" +
    '<p class="meta"><a href="' + toolsIndexPath(other) + '" hreflang="' + other + '">' + escHtml(U.switchLang) + "</a></p>";
  return renderBlogLayout(U.indexTitle, U.indexDesc, toolsIndexPath(lang), body, env, {
    lang: lang, ogType: "website", headExtra: alternates(toolsIndexPath("vi"), toolsIndexPath("en")), footerHtml: U.footer
  });
}

export function renderToolNotFound(lang) {
  const U = UI[lang];
  return '<!DOCTYPE html><html lang="' + lang + '"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>' + escHtml(U.notFoundTitle) +
    '</title></head><body style="font-family:system-ui;text-align:center;padding:60px;"><h1>404</h1><p>' + escHtml(U.notFoundText) +
    '</p><a href="' + toolsIndexPath(lang) + '">' + escHtml(U.notFoundBack) + "</a></body></html>";
}

// Các URL công cụ (kèm bản dịch) dùng cho sitemap.xml.
export function toolSitemapEntries() {
  const entries = [];
  entries.push({ vi: toolsIndexPath("vi"), en: toolsIndexPath("en") });
  for (const t of listTools()) entries.push({ vi: toolPath(t, "vi"), en: toolPath(t, "en") });
  return entries;
}

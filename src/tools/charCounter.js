// Công cụ "Đếm ký tự" — chạy hoàn toàn trên trình duyệt (không gọi API, không lưu dữ liệu).
// Client script viết bằng ES5 thuần, KHÔNG dùng template literal / ${} bên trong để tránh lỗi escape.
// Số giới hạn lấy từ tài liệu chính thức/nguồn tổng hợp, kiểm chứng 09/2026 — cập nhật ở LIMITS bên dưới.

const LIMITS = [
  { id: "ig", limit: 2200, type: "hard", vi: "Caption Instagram", en: "Instagram caption" },
  { id: "tt", limit: 4000, type: "hard", vi: "Caption TikTok", en: "TikTok caption" },
  { id: "x", limit: 280, type: "hard", vi: "Bài đăng X (Twitter)", en: "X (Twitter) post" },
  { id: "fb", limit: 63206, type: "hard", vi: "Bài đăng Facebook", en: "Facebook post" },
  { id: "yt", limit: 100, type: "hard", vi: "Tiêu đề YouTube", en: "YouTube title" },
  { id: "ytd", limit: 5000, type: "hard", vi: "Mô tả YouTube", en: "YouTube description" },
  { id: "gh", limit: 30, type: "hard", mode: "ads", vi: "Tiêu đề Google Ads", en: "Google Ads headline" },
  { id: "gd", limit: 90, type: "hard", mode: "ads", vi: "Mô tả Google Ads", en: "Google Ads description" },
  { id: "mt", limit: 60, type: "rec", vi: "Thẻ meta title (SEO)", en: "Meta title tag (SEO)" },
  { id: "md", limit: 160, type: "rec", vi: "Thẻ meta description (SEO)", en: "Meta description tag (SEO)" }
];

const TEXT = {
  vi: {
    slug: "dem-ky-tu",
    navName: "Đếm ký tự",
    title: "Đếm ký tự online — kiểm tra giới hạn caption, quảng cáo, SEO | SHURL",
    h1: "Đếm ký tự online",
    description: "Đếm ký tự, từ, dòng, câu ngay khi gõ. Kiểm tra giới hạn caption Instagram, TikTok, X, Facebook, tiêu đề Google Ads và thẻ meta SEO. Miễn phí, không cần đăng ký.",
    short: "Đếm ký tự, từ, dòng và so với giới hạn caption, quảng cáo, SEO.",
    intro: [
      "Dán hoặc gõ nội dung vào ô bên dưới để biết ngay số ký tự, số từ, số dòng và số câu. Công cụ so sánh nội dung của bạn với giới hạn của từng nền tảng để bạn chỉnh trước khi đăng, tránh bị cắt chữ hoặc bị từ chối quảng cáo.",
      "Mọi thứ xử lý ngay trên trình duyệt của bạn: nội dung không được gửi đi đâu và không được lưu lại, tải lại trang là mất."
    ],
    placeholder: "Gõ hoặc dán nội dung của bạn vào đây…",
    labels: {
      chars: "Ký tự (có khoảng trắng)", charsNoSpace: "Ký tự (không khoảng trắng)", words: "Từ", lines: "Dòng", sentences: "Câu", bytes: "Byte (UTF-8)",
      copy: "Sao chép", copied: "Đã sao chép", clear: "Xoá", sample: "Thử với văn bản mẫu",
      left: "còn", over: "vượt", hard: "giới hạn", rec: "khuyến nghị",
      limitsTitle: "So với giới hạn từng nền tảng", colName: "Nền tảng", colUsage: "Đã dùng", colKind: "Loại",
      sampleText: "Khuyến mãi tháng 9: giảm 30% cho mọi đơn hàng đầu tiên! Xem chi tiết tại shurlvn.com 🎉"
    },
    limitsNote: "Giới hạn tính đến 09/2026. \"Giới hạn\" là mức nền tảng bắt buộc; \"khuyến nghị\" là độ dài nên giữ để Google không cắt bớt khi hiển thị. Riêng Google Ads, mỗi chữ Trung/Nhật/Hàn tính 2 ký tự. Bài đăng X có quy tắc riêng cho link và emoji nên số đếm chỉ mang tính tham khảo.",
    guideTitle: "Cách dùng",
    guide: [
      "Dán nội dung caption, tiêu đề quảng cáo hoặc mô tả vào ô nhập.",
      "Xem số liệu cập nhật ngay khi gõ ở phía trên.",
      "Nhìn bảng bên dưới: thanh chuyển vàng khi gần đầy, chuyển đỏ khi vượt giới hạn — rút bớt chữ cho tới khi thanh xanh trở lại.",
      "Bấm Sao chép để lấy nội dung đã chỉnh."
    ],
    faqTitle: "Câu hỏi thường gặp",
    faq: [
      { q: "Ký tự có dấu tiếng Việt được tính thế nào?", a: "Mỗi chữ có dấu như \"ệ\" hay \"ư\" được tính là 1 ký tự, kể cả khi văn bản dùng dạng dấu tổ hợp. Công cụ chuẩn hoá về một dạng trước khi đếm nên kết quả không bị gấp đôi." },
      { q: "Emoji tính là mấy ký tự?", a: "Công cụ đếm mỗi emoji là 1 ký tự. Một số nền tảng tính khác (ví dụ X tính emoji là 2 ký tự và link luôn là 23 ký tự), nên hãy chừa dư một chút khi nội dung sát giới hạn." },
      { q: "Tiêu đề Google Ads tối đa bao nhiêu ký tự?", a: "Quảng cáo tìm kiếm thích ứng cho phép tiêu đề tối đa 30 ký tự và mô tả tối đa 90 ký tự. Chữ Trung, Nhật, Hàn tính 2 ký tự mỗi chữ." },
      { q: "Nội dung tôi nhập có bị lưu lại hoặc gửi đi không?", a: "Không. Công cụ chạy hoàn toàn trên trình duyệt của bạn, không gọi máy chủ và không lưu gì. Tải lại trang là nội dung mất." },
      { q: "Độ dài tối ưu của thẻ meta title và meta description là bao nhiêu?", a: "Nên giữ tiêu đề khoảng 60 ký tự và mô tả khoảng 160 ký tự. Đây là mức khuyến nghị: Google cắt theo độ rộng hiển thị chứ không theo số ký tự cố định." }
    ],
    ctaTitle: "Chia sẻ link gọn gàng hơn cùng SHURL",
    ctaText: "Rút gọn link dài, tạo mã QR và xem thống kê lượt click — miễn phí.",
    ctaBtn: "Rút gọn link miễn phí"
  },
  en: {
    slug: "character-counter",
    navName: "Character counter",
    title: "Character Counter Online — Check Caption, Ad & SEO Limits | SHURL",
    h1: "Online character counter",
    description: "Count characters, words, lines and sentences as you type. Check limits for Instagram, TikTok, X, Facebook captions, Google Ads headlines and SEO meta tags. Free, no sign-up.",
    short: "Count characters, words, lines and compare against caption, ad and SEO limits.",
    intro: [
      "Paste or type your text below to see the character, word, line and sentence count instantly. The tool compares your text with each platform's limit so you can fix it before posting, avoiding cut-off text or rejected ads.",
      "Everything runs in your browser: your text is never sent anywhere or stored, and it disappears when you reload the page."
    ],
    placeholder: "Type or paste your text here…",
    labels: {
      chars: "Characters (with spaces)", charsNoSpace: "Characters (no spaces)", words: "Words", lines: "Lines", sentences: "Sentences", bytes: "Bytes (UTF-8)",
      copy: "Copy", copied: "Copied", clear: "Clear", sample: "Try sample text",
      left: "left", over: "over", hard: "limit", rec: "recommended",
      limitsTitle: "Compared with platform limits", colName: "Platform", colUsage: "Used", colKind: "Type",
      sampleText: "September sale: 30% off your first order! Details at shurlvn.com 🎉"
    },
    limitsNote: "Limits as of 09/2026. \"Limit\" is enforced by the platform; \"recommended\" is the length to keep so Google does not truncate the snippet. For Google Ads, each Chinese/Japanese/Korean character counts as 2. X has its own rules for links and emoji, so its count is indicative only.",
    guideTitle: "How to use",
    guide: [
      "Paste your caption, ad headline or description into the box.",
      "Watch the numbers update as you type.",
      "Check the table below: a bar turns amber when nearly full and red when over the limit — trim text until it turns green again.",
      "Click Copy to take your edited text."
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "How are accented (Vietnamese) characters counted?", a: "Each accented letter such as \"ệ\" or \"ư\" counts as 1 character, even when the text uses combining marks. The tool normalizes the text before counting, so nothing is double-counted." },
      { q: "How many characters is an emoji?", a: "This tool counts each emoji as 1 character. Some platforms count differently (for example X counts an emoji as 2 and every link as 23), so leave some margin when you are close to a limit." },
      { q: "What is the Google Ads headline limit?", a: "Responsive search ads allow headlines up to 30 characters and descriptions up to 90 characters. Chinese, Japanese and Korean characters count as 2 each." },
      { q: "Is my text stored or sent anywhere?", a: "No. The tool runs entirely in your browser, makes no server calls and stores nothing. Reloading the page clears your text." },
      { q: "What is the ideal length for a meta title and meta description?", a: "Aim for about 60 characters for the title and about 160 for the description. These are recommendations: Google truncates by displayed pixel width, not by a fixed character count." }
    ],
    ctaTitle: "Share cleaner links with SHURL",
    ctaText: "Shorten long links, create QR codes and track clicks — free.",
    ctaBtn: "Shorten a link for free"
  }
};

function safeJson(v) {
  // Escape "<" và 2 ký tự phân dòng Unicode để JSON nhúng trong <script> luôn an toàn.
  return JSON.stringify(v).replace(/</g, "\\u003C").split(String.fromCharCode(8232)).join("\\u2028").split(String.fromCharCode(8233)).join("\\u2029");
}

const STYLE = [
  "<style>",
  ".wrap{max-width:900px;}",
  ".ct-box{margin:22px 0;}",
  ".ct-ta{width:100%;min-height:200px;padding:14px 16px;border:1px solid #cbd5e1;border-radius:12px;font-size:16px;line-height:1.6;font-family:inherit;color:#0f172a;background:#fff;resize:vertical;box-sizing:border-box;}",
  ".ct-ta:focus{outline:2px solid #6366f1;outline-offset:1px;border-color:#6366f1;}",
  ".ct-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:14px 0;}",
  ".ct-stat{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;}",
  ".ct-stat b{display:block;font-size:24px;color:#4f46e5;line-height:1.2;}",
  ".ct-stat span{font-size:12px;color:#64748b;}",
  ".ct-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px;}",
  ".ct-btn{border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:10px;padding:9px 16px;font-size:14px;font-weight:600;cursor:pointer;min-height:40px;}",
  ".ct-btn:hover{border-color:#6366f1;color:#4f46e5;}",
  ".ct-table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;font-size:14px;}",
  ".ct-table th,.ct-table td{padding:10px 12px;text-align:left;border-bottom:1px solid #eef2f7;vertical-align:middle;}",
  ".ct-table th{background:#f1f5f9;color:#0f172a;font-size:13px;}",
  ".ct-name{font-weight:600;color:#0f172a;white-space:nowrap;}",
  ".ct-bar{height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;min-width:120px;}",
  ".ct-bar i{display:block;height:100%;width:0;background:#22c55e;border-radius:999px;transition:width .15s ease,background .15s ease;}",
  ".ct-bar.warn i{background:#f59e0b;}",
  ".ct-bar.over i{background:#ef4444;}",
  ".ct-num{font-size:12px;color:#475569;margin-top:4px;}",
  ".ct-num.over{color:#dc2626;font-weight:700;}",
  ".ct-kind{font-size:12px;color:#64748b;white-space:nowrap;}",
  ".ct-note{font-size:13px;color:#64748b;margin:10px 0 0;}",
  ".ct-sec h2{margin-top:34px;}",
  ".ct-faq details{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;margin:8px 0;}",
  ".ct-faq summary{cursor:pointer;font-weight:600;color:#0f172a;}",
  ".ct-faq p{margin:8px 0 0;}",
  "@media(max-width:640px){.ct-table th:nth-child(3),.ct-table td:nth-child(3){display:none;}.ct-name{white-space:normal;}}",
  "</style>"
].join("\n");

// Đoạn script client (ES5). Nhãn/giới hạn được tiêm dưới dạng JSON đã escape "<".
function clientScript(lang) {
  const L = TEXT[lang];
  const limits = LIMITS.map(function (x) { return { id: x.id, limit: x.limit, type: x.type, mode: x.mode || "", name: x[lang] }; });
  return [
    "<script>",
    "(function(){",
    "var L=" + safeJson(L.labels) + ";",
    "var LIMITS=" + safeJson(limits) + ";",
    "function norm(s){return s.normalize?s.normalize('NFC'):s;}",
    "function cps(s){return Array.from?Array.from(s).length:s.length;}",
    "var WIDE=/[\\u1100-\\u115F\\u2E80-\\uA4CF\\uAC00-\\uD7A3\\uF900-\\uFAFF\\uFE30-\\uFE6F\\uFF00-\\uFF60\\uFFE0-\\uFFE6]/;",
    "function adsLen(s){var n=0,a=Array.from?Array.from(s):s.split('');for(var i=0;i<a.length;i++){n+=WIDE.test(a[i])?2:1;}return n;}",
    "function bytes(s){if(typeof TextEncoder!=='undefined'){return new TextEncoder().encode(s).length;}return unescape(encodeURIComponent(s)).length;}",
    "function computeStats(raw){",
    "  var s=norm(raw||'');var t=s.trim();",
    "  var sentences=(s.match(/[^.!?\\u2026\\n]+[.!?\\u2026]+|[^.!?\\u2026\\n]+$/g)||[]).filter(function(x){return x.trim().length>0;}).length;",
    "  return {chars:cps(s),charsNoSpace:cps(s.replace(/\\s/g,'')),words:t?t.split(/\\s+/).length:0,lines:s===''?0:s.split(/\\r\\n|\\r|\\n/).length,sentences:sentences,bytes:bytes(s),ads:adsLen(s),text:s};",
    "}",
    "var $=function(id){return document.getElementById(id);};",
    "var ta=$('ct-text');if(!ta){return;}",
    "function fmt(n){return String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g,',');}",
    "function render(){",
    "  var st=computeStats(ta.value);",
    "  var keys=['chars','charsNoSpace','words','lines','sentences','bytes'];",
    "  for(var i=0;i<keys.length;i++){var el=$('ct-'+keys[i]);if(el){el.textContent=fmt(st[keys[i]]);}}",
    "  for(var j=0;j<LIMITS.length;j++){",
    "    var lim=LIMITS[j];var used=lim.mode==='ads'?st.ads:st.chars;var pct=Math.min(100,Math.round(used/lim.limit*100));",
    "    var bar=$('ct-bar-'+lim.id),num=$('ct-num-'+lim.id);if(!bar||!num){continue;}",
    "    bar.className='ct-bar'+(used>lim.limit?' over':(used>=lim.limit*0.8?' warn':''));",
    "    bar.firstChild.style.width=pct+'%';",
    "    bar.setAttribute('aria-valuenow',String(used));",
    "    num.className='ct-num'+(used>lim.limit?' over':'');",
    "    num.textContent=fmt(used)+' / '+fmt(lim.limit)+' · '+(used>lim.limit?(L.over+' '+fmt(used-lim.limit)):(L.left+' '+fmt(lim.limit-used)));",
    "  }",
    "}",
    "ta.addEventListener('input',render);",
    "var copyBtn=$('ct-copy');",
    "if(copyBtn){copyBtn.addEventListener('click',function(){",
    "  var done=function(){var old=copyBtn.textContent;copyBtn.textContent=L.copied;setTimeout(function(){copyBtn.textContent=old;},1500);};",
    "  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(done,function(){});}",
    "  else{ta.select();try{document.execCommand('copy');done();}catch(e){}}",
    "});}",
    "var clearBtn=$('ct-clear');if(clearBtn){clearBtn.addEventListener('click',function(){ta.value='';render();ta.focus();});}",
    "var sampleBtn=$('ct-sample');if(sampleBtn){sampleBtn.addEventListener('click',function(){ta.value=L.sampleText;render();ta.focus();});}",
    "if(typeof window!=='undefined'){window.ShurlCharCounter={computeStats:computeStats};}",
    "render();",
    "})();",
    "</script>"
  ].join("\n");
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderApp(lang) {
  const L = TEXT[lang];
  const lb = L.labels;
  const stat = function (id, label) {
    return '<div class="ct-stat"><b id="ct-' + id + '">0</b><span>' + esc(label) + "</span></div>";
  };
  const rows = LIMITS.map(function (x) {
    return "<tr><td class=\"ct-name\">" + esc(x[lang]) + "</td>" +
      "<td><div class=\"ct-bar\" id=\"ct-bar-" + x.id + "\" role=\"progressbar\" aria-label=\"" + esc(x[lang]) + "\" aria-valuemin=\"0\" aria-valuemax=\"" + x.limit + "\" aria-valuenow=\"0\"><i></i></div>" +
      "<div class=\"ct-num\" id=\"ct-num-" + x.id + "\">0 / " + x.limit + "</div></td>" +
      "<td class=\"ct-kind\">" + esc(x.type === "hard" ? lb.hard : lb.rec) + "</td></tr>";
  }).join("");
  return STYLE +
    '<div class="ct-box">' +
    '<textarea id="ct-text" class="ct-ta" placeholder="' + esc(L.placeholder) + '" aria-label="' + esc(L.h1) + '"></textarea>' +
    '<div class="ct-actions">' +
    '<button type="button" class="ct-btn" id="ct-copy">' + esc(lb.copy) + "</button>" +
    '<button type="button" class="ct-btn" id="ct-clear">' + esc(lb.clear) + "</button>" +
    '<button type="button" class="ct-btn" id="ct-sample">' + esc(lb.sample) + "</button>" +
    "</div></div>" +
    '<div class="ct-stats">' +
    stat("chars", lb.chars) + stat("charsNoSpace", lb.charsNoSpace) + stat("words", lb.words) +
    stat("lines", lb.lines) + stat("sentences", lb.sentences) + stat("bytes", lb.bytes) +
    "</div>" +
    "<h2>" + esc(lb.limitsTitle) + "</h2>" +
    '<table class="ct-table"><thead><tr><th>' + esc(lb.colName) + "</th><th>" + esc(lb.colUsage) + "</th><th>" + esc(lb.colKind) + "</th></tr></thead><tbody>" + rows + "</tbody></table>" +
    '<p class="ct-note">' + esc(L.limitsNote) + "</p>" +
    clientScript(lang);
}

export const charCounter = { id: "char-counter", vi: TEXT.vi, en: TEXT.en, renderApp: renderApp };

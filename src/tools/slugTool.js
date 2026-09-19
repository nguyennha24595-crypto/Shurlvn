// Công cụ "Bỏ dấu tiếng Việt / tạo slug" — chạy hoàn toàn trên trình duyệt (không gọi API, không lưu dữ liệu).
// Client script viết bằng ES5 thuần, KHÔNG dùng template literal / dấu đô-la-ngoặc-nhọn bên trong.
// Các ký tự đặc biệt (dấu tổ hợp U+0300-036F, đ/Đ) dựng bằng String.fromCharCode để không bị escape sai.

import { esc, safeJson, BASE_CSS, btnLabel } from "./shared.js";

const TEXT = {
  vi: {
    slug: "bo-dau-tieng-viet",
    navName: "Bỏ dấu tiếng Việt / tạo slug",
    title: "Bỏ dấu tiếng Việt online & tạo slug đường dẫn thân thiện | SHURL",
    h1: "Bỏ dấu tiếng Việt & tạo slug",
    description: "Bỏ dấu tiếng Việt và chuyển tiêu đề thành slug (đường dẫn thân thiện) ngay khi gõ. Hỗ trợ nhiều dòng cùng lúc, gạch nối hoặc gạch dưới, giới hạn độ dài. Miễn phí.",
    short: "Bỏ dấu tiếng Việt và chuyển tiêu đề thành slug đường dẫn.",
    intro: [
      "Dán tiêu đề bài viết, tên sản phẩm hoặc tên chiến dịch vào ô bên dưới. Công cụ trả về hai kết quả cùng lúc: văn bản đã bỏ dấu tiếng Việt và slug sẵn sàng dùng làm đường dẫn (ví dụ khuyen-mai-mua-he-2026).",
      "Mọi thứ xử lý ngay trên trình duyệt của bạn: nội dung không được gửi đi đâu và không được lưu lại, tải lại trang là mất."
    ],
    labels: {
      input: "Văn bản cần chuyển", placeholder: "Nhập hoặc dán tiêu đề… (mỗi dòng một tiêu đề nếu bật \"Mỗi dòng một slug\")",
      sep: "Ký tự nối", sepDash: "Gạch nối (-) — khuyến nghị", sepUnder: "Gạch dưới (_)",
      lower: "Chuyển thành chữ thường", lines: "Mỗi dòng một slug", max: "Độ dài tối đa", maxPh: "Không giới hạn",
      plain: "Văn bản không dấu", slug: "Slug",
      copy: "Sao chép", copied: "Đã sao chép", clear: "Xoá", sample: "Thử với văn bản mẫu",
      preview: "Ví dụ đường dẫn:", previewBase: "https://ten-mien-cua-ban.com/",
      sampleText: "Khuyến mãi mùa hè 2026: Giảm giá 50% – Đường phố Đà Nẵng!\nHướng dẫn rút gọn link miễn phí"
    },
    noteText: "Chữ cái ngoài bảng chữ Latinh (ví dụ tiếng Trung, Nhật, Hàn) sẽ bị bỏ khỏi slug. Khi đặt độ dài tối đa, slug được cắt ở ranh giới từ để không bị cụt giữa chữ.",
    guideTitle: "Cách dùng",
    guide: [
      "Dán tiêu đề hoặc văn bản tiếng Việt vào ô nhập — có thể dán nhiều dòng cùng lúc.",
      "Chọn ký tự nối, chữ thường và độ dài tối đa nếu cần.",
      "Xem hai kết quả bên dưới: văn bản không dấu và slug.",
      "Bấm Sao chép, rồi dán vào đường dẫn bài viết, tên file, hoặc tên link tuỳ chỉnh."
    ],
    faqTitle: "Câu hỏi thường gặp",
    faq: [
      { q: "Bỏ dấu tiếng Việt là gì?", a: "Là chuyển chữ có dấu thành chữ không dấu, ví dụ \"Việt Nam\" thành \"Viet Nam\". Chữ \"đ\" được đổi thành \"d\" và \"Đ\" thành \"D\"." },
      { q: "Slug là gì và vì sao nên dùng?", a: "Slug là phần cuối của đường dẫn, mô tả nội dung trang, ví dụ /khuyen-mai-mua-he-2026. Slug ngắn, chữ thường, không dấu giúp link dễ đọc, dễ chia sẻ và thân thiện với công cụ tìm kiếm." },
      { q: "Nên dùng gạch nối hay gạch dưới trong slug?", a: "Nên dùng gạch nối (-). Google khuyến nghị dùng dấu gạch nối để phân tách các từ trong đường dẫn, còn gạch dưới không được coi là dấu phân tách từ." },
      { q: "Slug nên dài bao nhiêu?", a: "Càng ngắn gọn càng tốt, thường 3 đến 5 từ chính. Bạn có thể đặt độ dài tối đa, công cụ sẽ cắt ở ranh giới từ để slug không bị cụt." },
      { q: "Nội dung tôi nhập có bị lưu lại hoặc gửi đi không?", a: "Không. Công cụ chạy hoàn toàn trên trình duyệt của bạn, không gọi máy chủ và không lưu gì. Tải lại trang là nội dung mất." }
    ],
    ctaTitle: "Chia sẻ link gọn gàng hơn cùng SHURL",
    ctaText: "Rút gọn link dài, tạo mã QR và xem thống kê lượt click — miễn phí.",
    ctaBtn: "Rút gọn link miễn phí"
  },
  en: {
    slug: "slug-generator",
    navName: "Vietnamese accent remover / slug generator",
    title: "Vietnamese Accent Remover & URL Slug Generator Online | SHURL",
    h1: "Vietnamese accent remover & slug generator",
    description: "Remove Vietnamese accents and turn titles into clean URL slugs as you type. Handles many lines at once, hyphen or underscore, length limit. Free, no sign-up.",
    short: "Remove Vietnamese accents and turn titles into URL slugs.",
    intro: [
      "Paste an article title, product name or campaign name below. The tool returns two results at once: the text with Vietnamese accents removed, and a slug ready to use in a URL (for example khuyen-mai-mua-he-2026).",
      "Everything runs in your browser: nothing is sent anywhere or stored, and it disappears when you reload the page."
    ],
    labels: {
      input: "Text to convert", placeholder: "Type or paste titles… (one title per line when \"One slug per line\" is on)",
      sep: "Separator", sepDash: "Hyphen (-) — recommended", sepUnder: "Underscore (_)",
      lower: "Convert to lowercase", lines: "One slug per line", max: "Maximum length", maxPh: "No limit",
      plain: "Text without accents", slug: "Slug",
      copy: "Copy", copied: "Copied", clear: "Clear", sample: "Try sample text",
      preview: "Example URL:", previewBase: "https://your-domain.com/",
      sampleText: "Khuyến mãi mùa hè 2026: Giảm giá 50% – Đường phố Đà Nẵng!\nHướng dẫn rút gọn link miễn phí"
    },
    noteText: "Letters outside the Latin alphabet (for example Chinese, Japanese, Korean) are dropped from the slug. When you set a maximum length, the slug is cut at a word boundary so it never ends mid-word.",
    guideTitle: "How to use",
    guide: [
      "Paste a title or any Vietnamese text into the box — several lines at once is fine.",
      "Choose the separator, lowercase and a maximum length if needed.",
      "Read the two results below: text without accents, and the slug.",
      "Click Copy and paste it into a post URL, a file name, or a custom short-link name."
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "What does removing Vietnamese accents mean?", a: "It converts accented letters into plain ones, for example \"Việt Nam\" becomes \"Viet Nam\". The letter \"đ\" becomes \"d\" and \"Đ\" becomes \"D\"." },
      { q: "What is a slug and why use one?", a: "A slug is the last part of a URL that describes the page, for example /summer-sale-2026. A short, lowercase, accent-free slug makes links readable, easy to share and friendly to search engines." },
      { q: "Should I use hyphens or underscores in a slug?", a: "Use hyphens (-). Google recommends hyphens to separate words in URLs, while underscores are not treated as word separators." },
      { q: "How long should a slug be?", a: "As short as possible, usually 3 to 5 key words. You can set a maximum length and the tool cuts at a word boundary so the slug does not end mid-word." },
      { q: "Is my text stored or sent anywhere?", a: "No. The tool runs entirely in your browser, makes no server calls and stores nothing. Reloading the page clears your text." }
    ],
    ctaTitle: "Share cleaner links with SHURL",
    ctaText: "Shorten long links, create QR codes and track clicks — free.",
    ctaBtn: "Shorten a link for free"
  }
};

const STYLE = [
  "<style>",
  BASE_CSS,
  ".sl-in{width:100%;min-height:140px;padding:14px 16px;border:1px solid #cbd5e1;border-radius:12px;font-size:16px;line-height:1.6;font-family:inherit;color:#0f172a;background:#fff;resize:vertical;box-sizing:border-box;}",
  ".sl-in:focus,.sl-ctl:focus{outline:2px solid #6366f1;outline-offset:1px;border-color:#6366f1;}",
  ".sl-label{display:block;font-size:13px;font-weight:600;color:#334155;margin:0 0 5px;}",
  ".sl-opts{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:flex-end;margin:14px 0;font-size:14px;color:#334155;}",
  ".sl-opt{display:flex;flex-direction:column;}",
  ".sl-chk{display:flex;align-items:center;gap:7px;cursor:pointer;min-height:40px;}",
  ".sl-ctl{padding:9px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:14px;font-family:inherit;color:#0f172a;background:#fff;min-height:40px;box-sizing:border-box;}",
  ".sl-ctl[type=number]{width:130px;}",
  ".sl-outs{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin:8px 0;}",
  ".sl-out{width:100%;min-height:120px;padding:12px 14px;border:1px solid #c7d2fe;border-radius:12px;background:#f5f7ff;font:14px/1.6 ui-monospace,Menlo,Consolas,monospace;color:#1e1b4b;word-break:break-all;resize:vertical;box-sizing:border-box;}",
  ".sl-prev{font-size:13px;color:#475569;margin:8px 0 0;word-break:break-all;min-height:18px;}",
  ".sl-prev b{color:#4338ca;}",
  "</style>"
].join("\n");

function clientScript(lang) {
  const L = TEXT[lang].labels;
  return [
    "<script>",
    "(function(){",
    "var L=" + safeJson({ copied: L.copied, sampleText: L.sampleText, previewBase: L.previewBase, preview: L.preview }) + ";",
    "var A=String.fromCharCode;",
    "var COMB=new RegExp('['+A(768)+'-'+A(879)+']','g');",
    "function stripAccents(s){",
    "  if(!s||!s.normalize){return s||'';}",
    "  return s.normalize('NFD').replace(COMB,'').split(A(273)).join('d').split(A(272)).join('D').normalize('NFC');",
    "}",
    "function trimSep(t,sep){while(t.length&&t.charAt(0)===sep){t=t.slice(1);}while(t.length&&t.charAt(t.length-1)===sep){t=t.slice(0,-1);}return t;}",
    "function slugify(s,opt){",
    "  var sep=opt.sep==='_'?'_':'-';",
    "  var t=stripAccents(s);if(opt.lower){t=t.toLowerCase();}",
    "  t=trimSep(t.replace(/[^A-Za-z0-9]+/g,sep),sep);",
    "  var max=opt.max>0?Math.floor(opt.max):0;",
    "  if(max>0&&t.length>max){",
    "    var cut=t.slice(0,max);",
    "    if(t.charAt(max)!==sep){var k=cut.lastIndexOf(sep);if(k>0){cut=cut.slice(0,k);}}",
    "    t=trimSep(cut,sep);",
    "  }",
    "  return t;",
    "}",
    "function compute(text,opt){",
    "  var slugs=[];",
    "  if(opt.lines){var ls=text.split(/\\r\\n|\\r|\\n/);for(var i=0;i<ls.length;i++){slugs.push(slugify(ls[i],opt));}}",
    "  else{slugs.push(slugify(text.replace(/\\s*[\\r\\n]+\\s*/g,' '),opt));}",
    "  return {plain:stripAccents(text),slugs:slugs};",
    "}",
    "var $=function(id){return document.getElementById(id);};",
    "var inp=$('sl-in');if(!inp){return;}",
    "var outPlain=$('sl-plain'),outSlug=$('sl-slug'),prev=$('sl-prev');",
    "function opts(){return {sep:$('sl-sep').value,lower:$('sl-lower').checked,lines:$('sl-lines').checked,max:Number($('sl-max').value)||0};}",
    "function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');}",
    "function render(){",
    "  var r=compute(inp.value,opts());",
    "  outPlain.value=r.plain;outSlug.value=r.slugs.join('\\n');",
    "  var first='';for(var i=0;i<r.slugs.length;i++){if(r.slugs[i]){first=r.slugs[i];break;}}",
    "  prev.innerHTML=first?(esc(L.preview)+' '+esc(L.previewBase)+'<b>'+esc(first)+'</b>'):'';",
    "}",
    "var ids=['sl-in','sl-sep','sl-lower','sl-lines','sl-max'];",
    "for(var q=0;q<ids.length;q++){var el=$(ids[q]);el.addEventListener('input',render);el.addEventListener('change',render);}",
    "function bindCopy(btnId,srcEl){var b=$(btnId);if(!b){return;}b.addEventListener('click',function(){",
    "  if(!srcEl.value){return;}",
    "  var done=function(){var lbl=b.querySelector('.ct-lbl')||b;var old=lbl.textContent;lbl.textContent=L.copied;setTimeout(function(){lbl.textContent=old;},1500);};",
    "  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(srcEl.value).then(done,function(){srcEl.select();try{document.execCommand('copy');done();}catch(e){}});}",
    "  else{srcEl.select();try{document.execCommand('copy');done();}catch(e){}}",
    "});}",
    "bindCopy('sl-copy-plain',outPlain);bindCopy('sl-copy-slug',outSlug);",
    "$('sl-clear').addEventListener('click',function(){inp.value='';render();inp.focus();});",
    "$('sl-sample').addEventListener('click',function(){inp.value=L.sampleText;render();inp.focus();});",
    "if(typeof window!=='undefined'){window.ShurlSlug={stripAccents:stripAccents,slugify:slugify,compute:compute};}",
    "render();",
    "})();",
    "</script>"
  ].join("\n");
}

function renderApp(lang) {
  const L = TEXT[lang].labels;
  return STYLE +
    '<div class="ct-box">' +
    '<label class="sl-label" for="sl-in">' + esc(L.input) + "</label>" +
    '<textarea id="sl-in" class="sl-in" placeholder="' + esc(L.placeholder) + '"></textarea>' +
    '<div class="sl-opts">' +
    '<div class="sl-opt"><label class="sl-label" for="sl-sep">' + esc(L.sep) + "</label>" +
    '<select id="sl-sep" class="sl-ctl"><option value="-">' + esc(L.sepDash) + '</option><option value="_">' + esc(L.sepUnder) + "</option></select></div>" +
    '<div class="sl-opt"><label class="sl-label" for="sl-max">' + esc(L.max) + "</label>" +
    '<input id="sl-max" class="sl-ctl" type="number" min="0" max="200" step="1" placeholder="' + esc(L.maxPh) + '"></div>' +
    '<label class="sl-chk"><input type="checkbox" id="sl-lower" checked> ' + esc(L.lower) + "</label>" +
    '<label class="sl-chk"><input type="checkbox" id="sl-lines" checked> ' + esc(L.lines) + "</label>" +
    "</div>" +
    '<div class="sl-outs">' +
    '<div><label class="sl-label" for="sl-plain">' + esc(L.plain) + "</label>" +
    '<textarea id="sl-plain" class="sl-out" readonly></textarea>' +
    '<div class="ct-actions"><button type="button" class="ct-btn" id="sl-copy-plain">' + btnLabel("copy", L.copy) + "</button></div></div>" +
    '<div><label class="sl-label" for="sl-slug">' + esc(L.slug) + "</label>" +
    '<textarea id="sl-slug" class="sl-out" readonly></textarea>' +
    '<div class="ct-actions"><button type="button" class="ct-btn" id="sl-copy-slug">' + btnLabel("copy", L.copy) + "</button></div></div>" +
    "</div>" +
    '<div class="sl-prev" id="sl-prev" role="status"></div>' +
    '<div class="ct-actions" style="margin-top:14px">' +
    '<button type="button" class="ct-btn" id="sl-clear">' + btnLabel("trash", L.clear) + "</button>" +
    '<button type="button" class="ct-btn" id="sl-sample">' + btnLabel("sparkles", L.sample) + "</button>" +
    "</div>" +
    '<p class="ct-note">' + esc(TEXT[lang].noteText) + "</p>" +
    "</div>" +
    clientScript(lang);
}

export const slugTool = { id: "slug-tool", icon: "hash", vi: TEXT.vi, en: TEXT.en, renderApp: renderApp };

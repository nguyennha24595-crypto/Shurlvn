// Công cụ "Tạo link UTM" — chạy hoàn toàn trên trình duyệt (không gọi API, không lưu dữ liệu).
// Client script viết bằng ES5 thuần, KHÔNG dùng template literal / dấu đô-la-ngoặc-nhọn bên trong.

import { esc, safeJson, BASE_CSS } from "./shared.js";

const PRESETS = [
  { label: "Facebook", source: "facebook", medium: "social" },
  { label: "Instagram", source: "instagram", medium: "social" },
  { label: "TikTok", source: "tiktok", medium: "social" },
  { label: "Zalo", source: "zalo", medium: "social" },
  { label: "YouTube", source: "youtube", medium: "video" },
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Email", source: "newsletter", medium: "email" }
];

const TEXT = {
  vi: {
    slug: "tao-link-utm",
    navName: "Tạo link UTM",
    title: "Tạo link UTM online — gắn tham số theo dõi chiến dịch | SHURL",
    h1: "Tạo link UTM online",
    description: "Tạo link gắn tham số UTM (source, medium, campaign, term, content) để theo dõi hiệu quả chiến dịch trong Google Analytics. Tự chuẩn hoá chữ thường, miễn phí, không cần đăng ký.",
    short: "Gắn tham số UTM vào link để theo dõi nguồn khách trong Google Analytics.",
    intro: [
      "Điền link đích và thông tin chiến dịch, công cụ sẽ tạo link đã gắn UTM để bạn biết khách đến từ đâu (Facebook, Zalo, email…) trong Google Analytics. Tên chiến dịch được chuẩn hoá thành chữ thường, thay khoảng trắng bằng dấu gạch nối để dữ liệu không bị tách nhỏ.",
      "Mọi thứ xử lý ngay trên trình duyệt của bạn: nội dung không được gửi đi đâu và không được lưu lại, tải lại trang là mất."
    ],
    labels: {
      url: "Link đích (bắt buộc)", urlPh: "https://shurlvn.com/khuyen-mai",
      source: "Nguồn — utm_source (bắt buộc)", sourcePh: "facebook, zalo, newsletter",
      medium: "Phương tiện — utm_medium (bắt buộc)", mediumPh: "social, cpc, email",
      campaign: "Tên chiến dịch — utm_campaign (bắt buộc)", campaignPh: "khuyen-mai-thang-9",
      term: "Từ khoá — utm_term (tuỳ chọn)", termPh: "giay-the-thao",
      content: "Nội dung — utm_content (tuỳ chọn)", contentPh: "banner-xanh",
      presets: "Điền nhanh nguồn và phương tiện:",
      ascii: "Bỏ dấu tiếng Việt (khuyến nghị)", lower: "Chuyển thành chữ thường (khuyến nghị)", dash: "Thay khoảng trắng bằng dấu gạch nối (-)",
      result: "Link đã gắn UTM", resultPh: "Điền đủ các mục bắt buộc để tạo link…",
      copy: "Sao chép", copied: "Đã sao chép", clear: "Xoá", sample: "Thử với dữ liệu mẫu",
      shorten: "Rút gọn link này bằng SHURL",
      paramsTitle: "Tham số đã gắn",
      errBadUrl: "Link không hợp lệ. Hãy nhập địa chỉ bắt đầu bằng http:// hoặc https://.",
      errMissing: "Còn thiếu: ",
      warnReplaced: "Link gốc đã có tham số UTM — công cụ đã thay bằng giá trị mới.",
      sampleUrl: "https://shurlvn.com/khuyen-mai", sampleCampaign: "Khuyến mãi tháng 9", sampleContent: "Banner xanh"
    },
    guideTitle: "Cách dùng",
    guide: [
      "Nhập link trang bạn muốn khách vào (trang sản phẩm, trang đăng ký…).",
      "Bấm nút nền tảng (Facebook, Zalo, Email…) để điền nhanh nguồn và phương tiện, hoặc tự nhập.",
      "Đặt tên chiến dịch ngắn gọn, dễ nhớ, ví dụ khuyen-mai-thang-9.",
      "Sao chép link, hoặc bấm Rút gọn bằng SHURL để có link ngắn đẹp hơn khi đăng lên mạng xã hội."
    ],
    faqTitle: "Câu hỏi thường gặp",
    faq: [
      { q: "UTM là gì?", a: "UTM là các tham số gắn vào cuối đường dẫn (utm_source, utm_medium, utm_campaign…) để công cụ phân tích như Google Analytics biết lượt truy cập đến từ nguồn và chiến dịch nào." },
      { q: "Tham số nào bắt buộc?", a: "Ba tham số nên có đủ là utm_source (nguồn, ví dụ facebook), utm_medium (phương tiện, ví dụ social hoặc cpc) và utm_campaign (tên chiến dịch). utm_term và utm_content là tuỳ chọn, dùng để phân biệt từ khoá hoặc mẫu quảng cáo." },
      { q: "Nên đặt tên UTM như thế nào?", a: "Dùng chữ thường, không dấu, không khoảng trắng và giữ thống nhất giữa các chiến dịch. Google Analytics phân biệt hoa thường nên \"Facebook\" và \"facebook\" bị tính là hai nguồn khác nhau." },
      { q: "Có nên gắn UTM cho link nội bộ trên website của mình không?", a: "Không. Gắn UTM vào link giữa các trang của chính bạn sẽ làm mất nguồn truy cập ban đầu của khách. Chỉ dùng UTM cho link đặt ở bên ngoài như mạng xã hội, email, quảng cáo." },
      { q: "Link UTM dài, làm sao để đẹp hơn?", a: "Bạn có thể rút gọn link UTM bằng SHURL. Link ngắn vẫn chuyển tới đúng địa chỉ đã gắn tham số nên số liệu trong Google Analytics không đổi." }
    ],
    ctaTitle: "Chia sẻ link gọn gàng hơn cùng SHURL",
    ctaText: "Rút gọn link dài, tạo mã QR và xem thống kê lượt click — miễn phí.",
    ctaBtn: "Rút gọn link miễn phí"
  },
  en: {
    slug: "utm-link-builder",
    navName: "UTM link builder",
    title: "UTM Link Builder Online — Add Campaign Tracking Parameters | SHURL",
    h1: "UTM link builder",
    description: "Build links with UTM parameters (source, medium, campaign, term, content) to track campaign performance in Google Analytics. Auto-lowercase cleanup, free, no sign-up.",
    short: "Add UTM parameters to a link to track traffic sources in Google Analytics.",
    intro: [
      "Enter your destination link and campaign details and the tool builds a UTM-tagged link so you can see where visitors come from (Facebook, Zalo, email…) in Google Analytics. Values are cleaned to lowercase with spaces replaced by hyphens so your data is not split across variants.",
      "Everything runs in your browser: nothing is sent anywhere or stored, and it disappears when you reload the page."
    ],
    labels: {
      url: "Destination link (required)", urlPh: "https://shurlvn.com/sale",
      source: "Source — utm_source (required)", sourcePh: "facebook, zalo, newsletter",
      medium: "Medium — utm_medium (required)", mediumPh: "social, cpc, email",
      campaign: "Campaign name — utm_campaign (required)", campaignPh: "september-sale",
      term: "Term — utm_term (optional)", termPh: "running-shoes",
      content: "Content — utm_content (optional)", contentPh: "blue-banner",
      presets: "Quick fill source and medium:",
      ascii: "Remove Vietnamese accents (recommended)", lower: "Convert to lowercase (recommended)", dash: "Replace spaces with hyphens (-)",
      result: "UTM-tagged link", resultPh: "Fill in the required fields to build the link…",
      copy: "Copy", copied: "Copied", clear: "Clear", sample: "Try sample data",
      shorten: "Shorten this link with SHURL",
      paramsTitle: "Parameters added",
      errBadUrl: "Invalid link. Enter an address starting with http:// or https://.",
      errMissing: "Missing: ",
      warnReplaced: "The original link already had UTM parameters — they were replaced with the new values.",
      sampleUrl: "https://shurlvn.com/sale", sampleCampaign: "September sale", sampleContent: "Blue banner"
    },
    guideTitle: "How to use",
    guide: [
      "Enter the page you want visitors to land on (product page, sign-up page…).",
      "Click a platform button (Facebook, Zalo, Email…) to quick-fill source and medium, or type your own.",
      "Give the campaign a short, memorable name, for example september-sale.",
      "Copy the link, or click Shorten with SHURL for a cleaner short link to share on social media."
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "What is a UTM parameter?", a: "UTM parameters are tags added to the end of a URL (utm_source, utm_medium, utm_campaign…) that let analytics tools such as Google Analytics know which source and campaign a visit came from." },
      { q: "Which parameters are required?", a: "You should always include utm_source (for example facebook), utm_medium (for example social or cpc) and utm_campaign (the campaign name). utm_term and utm_content are optional and help tell keywords or ad variants apart." },
      { q: "How should I name UTM values?", a: "Use lowercase, no accents, no spaces, and stay consistent across campaigns. Google Analytics is case-sensitive, so \"Facebook\" and \"facebook\" are counted as two different sources." },
      { q: "Should I add UTM parameters to internal links on my own site?", a: "No. Adding UTM tags to links between your own pages overwrites the visitor's original traffic source. Use UTM only for links placed outside your site, such as social media, email and ads." },
      { q: "My UTM link is very long. How can I make it cleaner?", a: "Shorten it with SHURL. The short link still redirects to the exact tagged address, so your Google Analytics data stays the same." }
    ],
    ctaTitle: "Share cleaner links with SHURL",
    ctaText: "Shorten long links, create QR codes and track clicks — free.",
    ctaBtn: "Shorten a link for free"
  }
};

const STYLE = [
  "<style>",
  BASE_CSS,
  ".ut-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:14px 0;}",
  ".ut-field label{display:block;font-size:13px;font-weight:600;color:#334155;margin-bottom:5px;}",
  ".ut-in{width:100%;padding:11px 13px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;font-family:inherit;color:#0f172a;background:#fff;box-sizing:border-box;}",
  ".ut-in:focus{outline:2px solid #6366f1;outline-offset:1px;border-color:#6366f1;}",
  ".ut-wide{grid-column:1/-1;}",
  ".ut-presets{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0 4px;font-size:13px;color:#64748b;}",
  ".ut-chip{border:1px solid #c7d2fe;background:#eef2ff;color:#4338ca;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;cursor:pointer;min-height:34px;font-family:inherit;}",
  ".ut-chip:hover{background:#e0e7ff;}",
  ".ut-opts{display:flex;flex-wrap:wrap;gap:8px 22px;margin:12px 0;font-size:14px;color:#334155;}",
  ".ut-opts label{display:flex;align-items:center;gap:7px;cursor:pointer;}",
  ".ut-out{width:100%;min-height:90px;padding:12px 14px;border:1px solid #c7d2fe;border-radius:12px;background:#f5f7ff;font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;color:#1e1b4b;word-break:break-all;resize:vertical;box-sizing:border-box;}",
  ".ut-msg{font-size:13px;margin:8px 0 0;min-height:18px;}",
  ".ut-msg.err{color:#dc2626;font-weight:600;}",
  ".ut-msg.warn{color:#b45309;}",
  ".ut-params{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;font-size:13px;margin-top:12px;}",
  ".ut-params td{padding:8px 12px;border-bottom:1px solid #eef2f7;word-break:break-all;}",
  ".ut-params td:first-child{font-weight:600;color:#4338ca;white-space:nowrap;width:1%;}",
  "a.ct-btn{text-decoration:none;display:inline-flex;align-items:center;}",
  "a.ct-btn.disabled{opacity:.45;pointer-events:none;}",
  "</style>"
].join("\n");

function clientScript(lang) {
  const L = TEXT[lang].labels;
  const presets = PRESETS.map(function (p) { return { label: p.label, source: p.source, medium: p.medium }; });
  return [
    "<script>",
    "(function(){",
    "var L=" + safeJson(L) + ";",
    "var KEYS=['source','medium','campaign','term','content'];",
    "var UTM_RE=/^utm_(source|medium|campaign|term|content|id)(=|$)/i;",
    "function clean(v,lower,dash,ascii){",
    "  v=(v||'').replace(/^\\s+|\\s+$/g,'');",
    "  if(v.normalize){v=v.normalize('NFC');}",
    "  if(ascii&&v.normalize){v=v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0111/g,'d').replace(/\u0110/g,'D').normalize('NFC');}",
    "  if(lower){v=v.toLowerCase();}",
    "  if(dash){v=v.replace(/\\s+/g,'-');}",
    "  return v;",
    "}",
    "function buildUtm(input){",
    "  var raw=(input.url||'').replace(/^\\s+|\\s+$/g,'');",
    "  var vals={};for(var i=0;i<KEYS.length;i++){vals[KEYS[i]]=clean(input[KEYS[i]],input.lower,input.dash,input.ascii);}",
    "  var missing=[];",
    "  if(!raw){missing.push('url');}",
    "  var req=['source','medium','campaign'];for(var r=0;r<req.length;r++){if(!vals[req[r]]){missing.push('utm_'+req[r]);}}",
    "  if(missing.length){return {ok:false,missing:missing,url:''};}",
    "  if(!/^[a-z][a-z0-9+.\\-]*:/i.test(raw)){raw='https://'+raw;}",
    "  var u;try{u=new URL(raw);}catch(e){return {ok:false,badUrl:true,missing:[],url:''};}",
    "  if(u.protocol!=='http:'&&u.protocol!=='https:'){return {ok:false,badUrl:true,missing:[],url:''};}",
    "  var existing=u.search.replace(/^\\?/,'').split('&').filter(function(p){return p!=='';});",
    "  var kept=existing.filter(function(p){return !UTM_RE.test(p);});",
    "  var replaced=kept.length!==existing.length;",
    "  var params=[];",
    "  for(var k=0;k<KEYS.length;k++){if(vals[KEYS[k]]){params.push(['utm_'+KEYS[k],vals[KEYS[k]]]);}}",
    "  for(var q=0;q<params.length;q++){kept.push(params[q][0]+'='+encodeURIComponent(params[q][1]));}",
    "  u.search=kept.join('&');",
    "  return {ok:true,url:u.toString(),params:params,replaced:replaced,missing:[]};",
    "}",
    "var $=function(id){return document.getElementById(id);};",
    "var f={url:$('ut-url'),source:$('ut-source'),medium:$('ut-medium'),campaign:$('ut-campaign'),term:$('ut-term'),content:$('ut-content')};",
    "var out=$('ut-out'),msg=$('ut-msg'),tbl=$('ut-params'),lowerEl=$('ut-lower'),dashEl=$('ut-dash'),asciiEl=$('ut-ascii'),shortenEl=$('ut-shorten');",
    "if(!f.url||!out){return;}",
    "function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');}",
    "function render(){",
    "  var res=buildUtm({url:f.url.value,source:f.source.value,medium:f.medium.value,campaign:f.campaign.value,term:f.term.value,content:f.content.value,lower:lowerEl.checked,dash:dashEl.checked,ascii:asciiEl.checked});",
    "  var typed=f.url.value||f.source.value||f.medium.value||f.campaign.value;",
    "  msg.className='ut-msg';msg.textContent='';",
    "  if(res.ok){",
    "    out.value=res.url;",
    "    if(res.replaced){msg.className='ut-msg warn';msg.textContent=L.warnReplaced;}",
    "    var rows='';for(var i=0;i<res.params.length;i++){rows+='<tr><td>'+esc(res.params[i][0])+'</td><td>'+esc(res.params[i][1])+'</td></tr>';}",
    "    tbl.innerHTML=rows;tbl.style.display='';",
    "    shortenEl.href='/?shorten='+encodeURIComponent(res.url);shortenEl.className='ct-btn primary';",
    "  }else{",
    "    out.value='';tbl.innerHTML='';tbl.style.display='none';",
    "    shortenEl.removeAttribute('href');shortenEl.className='ct-btn primary disabled';",
    "    if(typed){",
    "      if(res.badUrl){msg.className='ut-msg err';msg.textContent=L.errBadUrl;}",
    "      else if(res.missing.length){msg.className='ut-msg err';msg.textContent=L.errMissing+res.missing.join(', ');}",
    "    }",
    "  }",
    "}",
    "for(var key in f){if(f.hasOwnProperty(key)){f[key].addEventListener('input',render);}}",
    "lowerEl.addEventListener('change',render);dashEl.addEventListener('change',render);asciiEl.addEventListener('change',render);",
    "var presets=" + safeJson(presets) + ";",
    "var chips=document.querySelectorAll('.ut-chip');",
    "for(var c=0;c<chips.length;c++){(function(btn){btn.addEventListener('click',function(){var p=presets[Number(btn.getAttribute('data-i'))];f.source.value=p.source;f.medium.value=p.medium;render();});})(chips[c]);}",
    "var copyBtn=$('ut-copy');",
    "if(copyBtn){copyBtn.addEventListener('click',function(){",
    "  if(!out.value){return;}",
    "  var done=function(){var old=copyBtn.textContent;copyBtn.textContent=L.copied;setTimeout(function(){copyBtn.textContent=old;},1500);};",
    "  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(out.value).then(done,function(){});}",
    "  else{out.select();try{document.execCommand('copy');done();}catch(e){}}",
    "});}",
    "$('ut-clear').addEventListener('click',function(){for(var k in f){if(f.hasOwnProperty(k)){f[k].value='';}}render();f.url.focus();});",
    "$('ut-sample').addEventListener('click',function(){f.url.value=L.sampleUrl;f.source.value='facebook';f.medium.value='social';f.campaign.value=L.sampleCampaign;f.term.value='';f.content.value=L.sampleContent;render();});",
    "if(typeof window!=='undefined'){window.ShurlUtm={buildUtm:buildUtm};}",
    "render();",
    "})();",
    "</script>"
  ].join("\n");
}

function renderApp(lang) {
  const L = TEXT[lang].labels;
  const field = function (id, label, ph, wide) {
    return '<div class="ut-field' + (wide ? " ut-wide" : "") + '"><label for="ut-' + id + '">' + esc(label) + "</label>" +
      '<input class="ut-in" id="ut-' + id + '" type="text" autocomplete="off" placeholder="' + esc(ph) + '"></div>';
  };
  const chips = PRESETS.map(function (p, i) {
    return '<button type="button" class="ut-chip" data-i="' + i + '">' + esc(p.label) + "</button>";
  }).join("");
  return STYLE +
    '<div class="ct-box">' +
    '<div class="ut-grid">' +
    field("url", L.url, L.urlPh, true) +
    field("source", L.source, L.sourcePh) + field("medium", L.medium, L.mediumPh) +
    field("campaign", L.campaign, L.campaignPh, true) +
    field("term", L.term, L.termPh) + field("content", L.content, L.contentPh) +
    "</div>" +
    '<div class="ut-presets"><span>' + esc(L.presets) + "</span>" + chips + "</div>" +
    '<div class="ut-opts">' +
    '<label><input type="checkbox" id="ut-ascii" checked> ' + esc(L.ascii) + "</label>" +
    '<label><input type="checkbox" id="ut-lower" checked> ' + esc(L.lower) + "</label>" +
    '<label><input type="checkbox" id="ut-dash" checked> ' + esc(L.dash) + "</label>" +
    "</div>" +
    '<div class="ut-field"><label for="ut-out">' + esc(L.result) + "</label>" +
    '<textarea id="ut-out" class="ut-out" readonly placeholder="' + esc(L.resultPh) + '"></textarea></div>' +
    '<div class="ut-msg" id="ut-msg" role="status"></div>' +
    '<div class="ct-actions">' +
    '<button type="button" class="ct-btn" id="ut-copy">' + esc(L.copy) + "</button>" +
    '<a class="ct-btn primary disabled" id="ut-shorten" target="_blank" rel="noopener">' + esc(L.shorten) + "</a>" +
    '<button type="button" class="ct-btn" id="ut-clear">' + esc(L.clear) + "</button>" +
    '<button type="button" class="ct-btn" id="ut-sample">' + esc(L.sample) + "</button>" +
    "</div>" +
    '<h2 style="font-size:16px;margin:22px 0 0;">' + esc(L.paramsTitle) + "</h2>" +
    '<table class="ut-params" id="ut-params" style="display:none"></table>' +
    "</div>" +
    clientScript(lang);
}

export const utmBuilder = { id: "utm-builder", vi: TEXT.vi, en: TEXT.en, renderApp: renderApp };

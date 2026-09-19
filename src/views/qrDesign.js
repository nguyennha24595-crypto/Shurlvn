// Thiết kế thẻ/bảng in sẵn quanh mã QR cho VietQR và Danh thiếp (QR Studio).
// QR_DESIGN_CLIENT_SRC là mã ES5 chạy trên trình duyệt, nhúng nguyên văn vào script client của appHtml.js (cạnh qrTypes.js).
// Viết bằng String.raw nên backslash giữ nguyên; TUYỆT ĐỐI không dùng dấu backtick hoặc dấu đô-la-ngoặc-nhọn bên trong.
// Nguyên tắc: mã QR được dựng đúng kích thước đích rồi vẽ 1:1 (không co giãn) lên thẻ, phần thiết kế chỉ nằm bên ngoài,
// nên không thể làm hỏng khả năng quét. Dữ liệu chỉ xử lý trên trình duyệt.

export const QR_DESIGN_CLIENT_SRC = String.raw`
var QD_SWATCHES = ["#6366f1", "#16a34a", "#dc2626", "#ea580c", "#1e293b"];
var QD_FONT = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
var QD_LAYOUTS = {
  vietqr: [ { id: "portrait", W: 1080, H: 1640, qr: 680 }, { id: "landscape", W: 1600, H: 900, qr: 700 } ],
  vcard:  [ { id: "landscape", W: 1050, H: 600, qr: 380 }, { id: "portrait", W: 600, H: 1050, qr: 340 } ]
};
var QD_T = {
  vi: {
    toggle: "Thêm thiết kế (tuỳ chọn)", on: "Dùng thiết kế in sẵn (thẻ / bảng)",
    lay_vq0: "Bảng đứng", lay_vq1: "Ngang", lay_vc0: "Thẻ ngang", lay_vc1: "Thẻ đứng",
    layout: "Bố cục", color: "Màu chủ đạo", title: "Tiêu đề trên bảng", title_def: "QUÉT MÃ ĐỂ CHUYỂN KHOẢN",
    holder: "Tên chủ tài khoản (chỉ hiện trên bảng, không nằm trong mã QR)", holder_ph: "NGUYEN VAN AN",
    show_amount: "Hiện số tiền", show_content: "Hiện nội dung", brand: "Hiện dòng shurlvn.com ở chân thẻ",
    note: "Tải về dạng PNG để in hoặc đăng. Mã QR giữ nguyên, phần thiết kế chỉ nằm bên ngoài; công cụ tự quét lại thẻ để kiểm tra.",
    dl: "Tải thẻ PNG",
    vq_acc: "Số tài khoản", vq_amount: "Số tiền", vq_content: "Nội dung", vq_foot: "Quét bằng app ngân hàng bất kỳ · VietQR",
    l_tel: "ĐT", l_email: "Email", l_web: "Web", l_addr: "Đ/c", cur: "VND"
  },
  en: {
    toggle: "Add design (optional)", on: "Use a ready-to-print design (card / sign)",
    lay_vq0: "Portrait sign", lay_vq1: "Landscape", lay_vc0: "Wide card", lay_vc1: "Tall card",
    layout: "Layout", color: "Accent color", title: "Sign title", title_def: "SCAN TO TRANSFER",
    holder: "Account holder name (shown on the sign only, not inside the QR code)", holder_ph: "NGUYEN VAN AN",
    show_amount: "Show amount", show_content: "Show message", brand: "Show shurlvn.com at the bottom",
    note: "Download as PNG to print or post. The QR code is untouched, the design sits only around it; the tool re-scans the card to verify.",
    dl: "Download card PNG",
    vq_acc: "Account number", vq_amount: "Amount", vq_content: "Message", vq_foot: "Scan with any banking app · VietQR",
    l_tel: "Tel", l_email: "Email", l_web: "Web", l_addr: "Addr", cur: "VND"
  }
};
function qdT(key){
  var lang = (typeof currentLang !== "undefined" && currentLang === "vi") ? "vi" : "en";
  return QD_T[lang][key] || QD_T.en[key] || key;
}

// ---------- Màu ----------
function qdRgb(hex){
  hex = String(hex || "").replace("#", "");
  if (hex.length === 3) { hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2); }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) { return [99, 102, 241]; }
  return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
}
function qdLuma(hex){
  var c = qdRgb(hex);
  return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
}
// Màu chữ đặt trên nền hex: trắng trên nền tối, xanh đen trên nền sáng.
function qdTextOn(hex){
  return qdLuma(hex) < 0.6 ? "#ffffff" : "#0f172a";
}
// Màu nhấn dùng làm chữ trên nền trắng: nếu màu chủ đạo quá sáng thì làm đậm lại để đọc được.
function qdInk(hex){
  var c = qdRgb(hex);
  var l = qdLuma(hex);
  if (l <= 0.62) { return hex; }
  var k = 0.55;
  return "rgb(" + Math.round(c[0] * k) + "," + Math.round(c[1] * k) + "," + Math.round(c[2] * k) + ")";
}

// ---------- Vẽ chữ (đo bằng ctx.measureText) ----------
function qdFontStr(weight, size){
  return weight + " " + size + "px " + QD_FONT;
}
function qdWidth(ctx, text, weight, size){
  ctx.font = qdFontStr(weight, size);
  return ctx.measureText(text).width;
}
// Ngắt dòng theo từ; từ quá dài thì ngắt theo ký tự. Trả về tối đa maxLines dòng, dòng cuối có "…" nếu bị cắt.
function qdWrap(ctx, text, weight, size, maxW, maxLines){
  var words = String(text == null ? "" : text).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ");
  if (words.length === 1 && words[0] === "") { return []; }
  var lines = [], cur = "", i, w;
  for (i = 0; i < words.length; i++) {
    w = words[i];
    var trial = cur === "" ? w : cur + " " + w;
    if (qdWidth(ctx, trial, weight, size) <= maxW) { cur = trial; continue; }
    if (cur !== "") { lines.push(cur); cur = ""; }
    while (qdWidth(ctx, w, weight, size) > maxW && w.length > 1) {
      var k = w.length;
      while (k > 1 && qdWidth(ctx, w.slice(0, k), weight, size) > maxW) { k--; }
      lines.push(w.slice(0, k));
      w = w.slice(k);
    }
    cur = w;
  }
  if (cur !== "") { lines.push(cur); }
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    var last = lines[maxLines - 1];
    while (last.length > 1 && qdWidth(ctx, last + "…", weight, size) > maxW) { last = last.slice(0, -1); }
    lines[maxLines - 1] = last + "…";
  }
  return lines;
}
// Bố trí khối chữ: thu nhỏ cỡ chữ (không dưới minSize) cho tới khi số dòng <= maxLines, rồi mới cắt "…".
function qdLayoutText(ctx, text, o){
  var size = o.size, min = o.minSize || o.size, maxLines = o.maxLines || 1, lines;
  if (o.oneLineFirst && maxLines > 1) {
    for (var fs1 = o.size; fs1 >= min; fs1 -= 1) {
      if (qdWidth(ctx, String(text).replace(/\s+/g, " "), o.weight, fs1) <= o.maxW) {
        return { lines: [String(text).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")], size: fs1, lh: Math.round(fs1 * (o.lh || 1.25)), h: Math.round(fs1 * (o.lh || 1.25)), weight: o.weight };
      }
    }
  }
  while (true) {
    lines = qdWrap(ctx, text, o.weight, size, o.maxW, 0);
    if (lines.length <= maxLines || size <= min) { break; }
    size -= 2;
  }
  if (lines.length > maxLines) { lines = qdWrap(ctx, text, o.weight, size, o.maxW, maxLines); }
  var lh = Math.round(size * (o.lh || 1.25));
  return { lines: lines, size: size, lh: lh, h: lines.length * lh, weight: o.weight };
}
function qdDrawLines(ctx, lay, x, y, o){
  ctx.font = qdFontStr(lay.weight, lay.size);
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align || "left";
  ctx.textBaseline = "top";
  var prev = ctx.globalAlpha;
  if (o.alpha != null) { ctx.globalAlpha = o.alpha; }
  for (var i = 0; i < lay.lines.length; i++) { ctx.fillText(lay.lines[i], x, y + i * lay.lh); }
  ctx.globalAlpha = prev;
}
// Vẽ 1 khối chữ tại (x, y) và trả về chiều cao đã dùng (0 nếu chuỗi rỗng).
function qdText(ctx, text, x, y, o){
  if (text == null || String(text).replace(/\s+/g, "") === "") { return 0; }
  var lay = qdLayoutText(ctx, text, o);
  qdDrawLines(ctx, lay, x, y, o);
  return lay.h;
}
function qdRoundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
// Khung trắng bo góc chứa QR (có bóng nhẹ + viền màu chủ đạo), rồi vẽ QR 1:1 tại toạ độ số nguyên.
function qdQrPanel(ctx, img, x, y, qs, pad, accent){
  x = Math.round(x); y = Math.round(y);
  var pw = qs + pad * 2;
  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.18)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#ffffff";
  qdRoundRect(ctx, x, y, pw, pw, 28);
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 8;
  ctx.strokeStyle = accent;
  qdRoundRect(ctx, x, y, pw, pw, 28);
  ctx.stroke();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x + pad, y + pad, qs, qs);
  return pw;
}
function qdBrand(ctx, W, y, show, align, x){
  if (!show) { return; }
  qdText(ctx, "shurlvn.com", x == null ? W / 2 : x, y, { size: 26, weight: "600", color: "#94a3b8", align: align || "center", maxW: W - 80 });
}

// ---------- Bố cục VietQR ----------
// s: { accent, title, bank, holder, account, amount, content, brand, qrImg, qr, W, H }
function qdVqPortrait(ctx, s){
  var W = s.W, H = s.H, on = qdTextOn(s.accent), ink = qdInk(s.accent);
  ctx.fillStyle = "#f1f5f9"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, 210);
  var tl = qdLayoutText(ctx, s.title, { size: 64, minSize: 34, weight: "800", maxW: W - 120, maxLines: 2, lh: 1.15 });
  qdDrawLines(ctx, tl, W / 2, Math.round((210 - tl.h) / 2), { color: on, align: "center" });
  var pad = 40, pw = s.qr + pad * 2;
  qdQrPanel(ctx, s.qrImg, (W - pw) / 2, 250, s.qr, pad, s.accent);
  var y = 250 + pw + 44, cx = W / 2, mw = W - 140;
  y += qdText(ctx, s.bank, cx, y, { size: 46, minSize: 28, weight: "700", color: ink, align: "center", maxW: mw }) + 10;
  y += qdText(ctx, s.holder, cx, y, { size: 58, minSize: 34, weight: "800", color: "#0f172a", align: "center", maxW: mw, maxLines: 1, lh: 1.15 }) + 14;
  if (s.account) {
    y += qdText(ctx, qdT("vq_acc"), cx, y, { size: 28, weight: "500", color: "#64748b", align: "center", maxW: mw });
    y += qdText(ctx, s.account, cx, y, { size: 74, minSize: 36, weight: "800", color: "#0f172a", align: "center", maxW: mw }) + 12;
  }
  if (s.amount) { y += qdText(ctx, qdT("vq_amount") + ": " + s.amount, cx, y, { size: 48, minSize: 28, weight: "800", color: ink, align: "center", maxW: mw }) + 8; }
  if (s.content) { y += qdText(ctx, qdT("vq_content") + ": " + s.content, cx, y, { size: 34, minSize: 24, weight: "500", color: "#475569", align: "center", maxW: mw, maxLines: 2 }); }
  qdText(ctx, qdT("vq_foot"), cx, H - 92, { size: 28, weight: "500", color: "#64748b", align: "center", maxW: mw });
  qdBrand(ctx, W, H - 52, s.brand);
}
function qdVqLandscape(ctx, s){
  var W = s.W, H = s.H, ink = qdInk(s.accent);
  ctx.fillStyle = "#f1f5f9"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, 26, H);
  var pad = 40, pw = s.qr + pad * 2;
  qdQrPanel(ctx, s.qrImg, 80, (H - pw) / 2, s.qr, pad, s.accent);
  var x0 = 80 + pw + 70, mw = W - x0 - 70, y = 92;
  y += qdText(ctx, s.title, x0, y, { size: 50, minSize: 30, weight: "800", color: ink, maxW: mw, maxLines: 2, lh: 1.15 }) + 14;
  ctx.fillStyle = s.accent; ctx.fillRect(x0, y, 110, 8); y += 34;
  y += qdText(ctx, s.bank, x0, y, { size: 42, minSize: 26, weight: "700", color: ink, maxW: mw }) + 10;
  y += qdText(ctx, s.holder, x0, y, { size: 54, minSize: 34, weight: "800", color: "#0f172a", maxW: mw, maxLines: 2, lh: 1.15, oneLineFirst: true }) + 12;
  if (s.account) {
    y += qdText(ctx, qdT("vq_acc"), x0, y, { size: 26, weight: "500", color: "#64748b", maxW: mw });
    y += qdText(ctx, s.account, x0, y, { size: 66, minSize: 32, weight: "800", color: "#0f172a", maxW: mw }) + 10;
  }
  if (s.amount) { y += qdText(ctx, qdT("vq_amount") + ": " + s.amount, x0, y, { size: 44, minSize: 26, weight: "800", color: ink, maxW: mw }) + 8; }
  if (s.content) { y += qdText(ctx, qdT("vq_content") + ": " + s.content, x0, y, { size: 32, minSize: 22, weight: "500", color: "#475569", maxW: mw, maxLines: 2 }); }
  qdText(ctx, qdT("vq_foot"), x0, H - 110, { size: 26, weight: "500", color: "#64748b", maxW: mw });
  qdBrand(ctx, W, H - 70, s.brand, "left", x0);
}

// ---------- Bố cục Danh thiếp ----------
// s: { accent, name, title, org, lines:[{k,v}], brand, qrImg, qr, W, H }
function qdContactRows(ctx, s, x, y, width, size, gap){
  var labelW = 92;
  for (var i = 0; i < s.lines.length; i++) {
    var row = s.lines[i];
    qdText(ctx, row.k, x, y + 2, { size: size - 4, weight: "800", color: qdInk(s.accent), maxW: labelW - 8 });
    var lay = qdLayoutText(ctx, row.v, { size: size, minSize: size - 7, weight: "500", maxW: width - labelW, maxLines: 2, lh: 1.2, oneLineFirst: true });
    qdDrawLines(ctx, lay, x + labelW, y, { color: "#1e293b" });
    y += Math.max(lay.h, Math.round(size * 1.2)) + gap;
  }
  return y;
}
function qdVcLandscape(ctx, s){
  var W = s.W, H = s.H, ink = qdInk(s.accent);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, 24, H);
  var pad = 24, pw = s.qr + pad * 2;
  qdQrPanel(ctx, s.qrImg, W - pw - 52, (H - pw) / 2, s.qr, pad, s.accent);
  var x = 68, mw = W - pw - 52 - 40 - x, y = 62;
  y += qdText(ctx, s.name, x, y, { size: 62, minSize: 30, weight: "800", color: "#0f172a", maxW: mw, maxLines: 2, lh: 1.1 }) + 6;
  y += qdText(ctx, s.title, x, y, { size: 30, minSize: 20, weight: "700", color: ink, maxW: mw, maxLines: 2 }) + 4;
  y += qdText(ctx, s.org, x, y, { size: 28, minSize: 20, weight: "500", color: "#475569", maxW: mw, maxLines: 2 }) + 14;
  ctx.fillStyle = s.accent; ctx.fillRect(x, y, 90, 6); y += 30;
  var endY = qdContactRows(ctx, s, x, y, mw, 25, 10);
  if (endY < H - 58) { qdBrand(ctx, W, H - 44, s.brand, "left", x); }
}
function qdVcPortrait(ctx, s){
  var W = s.W, H = s.H, on = qdTextOn(s.accent);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, 300);
  var mw = W - 100, y = 56;
  y += qdText(ctx, s.name, W / 2, y, { size: 54, minSize: 28, weight: "800", color: on, align: "center", maxW: mw, maxLines: 2, lh: 1.1 }) + 8;
  y += qdText(ctx, s.title, W / 2, y, { size: 28, minSize: 20, weight: "700", color: on, align: "center", maxW: mw, maxLines: 2, alpha: 0.95 }) + 4;
  qdText(ctx, s.org, W / 2, y, { size: 26, minSize: 18, weight: "500", color: on, align: "center", maxW: mw, maxLines: 2, alpha: 0.85 });
  var pad = 22, pw = s.qr + pad * 2;
  qdQrPanel(ctx, s.qrImg, (W - pw) / 2, 340, s.qr, pad, s.accent);
  var endY = qdContactRows(ctx, s, 56, 340 + pw + 44, W - 112, 25, 10);
  if (endY < H - 58) { qdBrand(ctx, W, H - 44, s.brand); }
}

// Dựng canvas thẻ từ ảnh QR đã tải. spec: { kind, layout(0|1), qrImg, + trường theo bố cục }
function qrDesignRender(spec){
  var L = QD_LAYOUTS[spec.kind][spec.layout] || QD_LAYOUTS[spec.kind][0];
  var canvas = document.createElement("canvas");
  canvas.width = L.W; canvas.height = L.H;
  var ctx = canvas.getContext("2d");
  var s = {};
  for (var k in spec) { if (spec.hasOwnProperty(k)) { s[k] = spec[k]; } }
  s.W = L.W; s.H = L.H; s.qr = L.qr;
  if (spec.kind === "vietqr") { if (L.id === "portrait") { qdVqPortrait(ctx, s); } else { qdVqLandscape(ctx, s); } }
  else { if (L.id === "landscape") { qdVcLandscape(ctx, s); } else { qdVcPortrait(ctx, s); } }
  return canvas;
}

// ---------- Định dạng dữ liệu hiển thị ----------
function qdGroupDigits(s, n){
  s = String(s || "").replace(/[\s.\-]/g, "");
  var out = [];
  for (var i = 0; i < s.length; i += n) { out.push(s.slice(i, i + n)); }
  return out.join(" ");
}
function qdMoney(raw){
  var d = String(raw || "").replace(/[^0-9]/g, "").replace(/^0+/, "");
  if (d === "") { return ""; }
  return d.replace(/\B(?=([0-9]{3})+(?![0-9]))/g, ".") + " " + qdT("cur");
}

// ---------- Giao diện: panel "Thêm thiết kế" ----------
var qdLayout = 0;
var qdAccent = "#6366f1";

function qdSwatchesHtml(){
  var h = "";
  for (var i = 0; i < QD_SWATCHES.length; i++) {
    h += '<button type="button" class="qr-preset-swatch qd-swatch" data-qdcolor="' + QD_SWATCHES[i] + '" style="background:' + QD_SWATCHES[i] + ';" title="' + QD_SWATCHES[i] + '"></button>';
  }
  return h;
}

function qrDesignPanelHtml(){
  return '' +
    '<div class="qr-collapsible-toggle" id="qrWsDesignToggle" style="display:none;">' + li('plus', 12) + ' ' + qdT("toggle") + '</div>' +
    '<div id="qrWsDesignPanel" class="qd-panel" style="display:none;">' +
      '<label class="qd-chk"><input type="checkbox" id="qd_on"> ' + qdT("on") + '</label>' +
      '<div id="qdOptions" style="display:none;">' +
        '<label>' + qdT("layout") + '</label>' +
        '<div class="qr-size-row" id="qdLayoutRow"><button type="button" class="qr-size-btn active" data-qdlayout="0"></button><button type="button" class="qr-size-btn" data-qdlayout="1"></button></div>' +
        '<label>' + qdT("color") + '</label>' +
        '<div class="qr-color-input-wrap" style="max-width:220px;"><input type="color" id="qd_color" value="#6366f1"><input type="text" id="qd_color_hex" value="#6366f1"></div>' +
        '<div class="qd-swatches">' + qdSwatchesHtml() + '</div>' +
        '<div id="qd_vq" style="display:none;">' +
          '<label for="qd_title">' + qdT("title") + '</label><input type="text" id="qd_title" class="qr-existing-select" style="margin-top:0;" maxlength="60" placeholder="' + qdT("title_def") + '">' +
          '<label for="qd_holder">' + qdT("holder") + '</label><input type="text" id="qd_holder" class="qr-existing-select" style="margin-top:0;" maxlength="60" placeholder="' + qdT("holder_ph") + '">' +
          '<label class="qd-chk"><input type="checkbox" id="qd_show_amount" checked> ' + qdT("show_amount") + '</label>' +
          '<label class="qd-chk"><input type="checkbox" id="qd_show_content" checked> ' + qdT("show_content") + '</label>' +
        '</div>' +
        '<label class="qd-chk"><input type="checkbox" id="qd_brand" checked> ' + qdT("brand") + '</label>' +
        '<p class="hint" style="margin:8px 0 0;font-size:12px;">' + qdT("note") + '</p>' +
      '</div>' +
    '</div>';
}

function qdIsDesignType(type){ return type === "vietqr" || type === "vcard"; }

// Có đang dùng thiết kế cho loại hiện tại không.
function qrDesignActive(type){
  if (!qdIsDesignType(type)) { return false; }
  var on = document.getElementById("qd_on");
  var panel = document.getElementById("qrWsDesignPanel");
  return !!(on && on.checked && panel && panel.style.display !== "none");
}

// Gọi khi đổi loại QR: hiện/ẩn toggle thiết kế, đổi nhãn bố cục, ẩn khối UTM khi không phải URL.
function qrDesignSetType(type){
  var isD = qdIsDesignType(type);
  var toggle = document.getElementById("qrWsDesignToggle");
  var panel = document.getElementById("qrWsDesignPanel");
  if (toggle) { toggle.style.display = isD ? "" : "none"; }
  if (panel && !isD) { panel.style.display = "none"; }
  var utmToggle = document.getElementById("qrWsUtmToggle");
  var utmFields = document.getElementById("utmFields");
  if (utmToggle) { utmToggle.style.display = (type === "url") ? "" : "none"; }
  if (utmFields && type !== "url") { utmFields.style.display = "none"; }
  if (isD) {
    var btns = document.querySelectorAll("#qdLayoutRow .qr-size-btn");
    var pre = type === "vietqr" ? "lay_vq" : "lay_vc";
    for (var i = 0; i < btns.length; i++) { btns[i].textContent = qdT(pre + i); }
    var vq = document.getElementById("qd_vq");
    if (vq) { vq.style.display = type === "vietqr" ? "block" : "none"; }
  }
}

function qdSetColor(hex){
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) { return; }
  qdAccent = hex;
  var c = document.getElementById("qd_color"), h = document.getElementById("qd_color_hex");
  if (c) { c.value = hex; }
  if (h) { h.value = hex; }
}

// Đọc form -> spec để vẽ thẻ ("" nếu loại không hỗ trợ).
function qrDesignCollect(type){
  var brand = document.getElementById("qd_brand");
  var spec = { kind: type, layout: qdLayout, accent: qdAccent, brand: !!(brand && brand.checked) };
  if (type === "vietqr") {
    var bankSel = document.getElementById("qt_vq_bank");
    var bankName = bankSel && bankSel.selectedIndex >= 0 && bankSel.value ? bankSel.options[bankSel.selectedIndex].text : "";
    var showA = document.getElementById("qd_show_amount"), showC = document.getElementById("qd_show_content");
    spec.title = qtVal("qd_title") || qdT("title_def");
    spec.bank = bankName;
    spec.holder = qtVal("qd_holder");
    spec.account = qdGroupDigits(qtVal("qt_vq_acc"), 4);
    spec.amount = (showA && showA.checked) ? qdMoney(qtVal("qt_vq_amount")) : "";
    spec.content = (showC && showC.checked) ? qrCleanVietQrContent(qtVal("qt_vq_content")) : "";
  } else if (type === "vcard") {
    var last = qtVal("qt_vc_last").replace(/^\s+|\s+$/g, ""), first = qtVal("qt_vc_first").replace(/^\s+|\s+$/g, "");
    var lang = (typeof currentLang !== "undefined" && currentLang === "vi") ? "vi" : "en";
    spec.name = (lang === "vi" ? (last + " " + first) : (first + " " + last)).replace(/^\s+|\s+$/g, "");
    spec.title = qtVal("qt_vc_title");
    spec.org = qtVal("qt_vc_org");
    var rows = [];
    if (qtVal("qt_vc_phone")) { rows.push({ k: qdT("l_tel"), v: qtVal("qt_vc_phone") }); }
    if (qtVal("qt_vc_email")) { rows.push({ k: qdT("l_email"), v: qtVal("qt_vc_email") }); }
    if (qtVal("qt_vc_web")) { rows.push({ k: qdT("l_web"), v: qtVal("qt_vc_web").replace(/^https?:\/\//i, "") }); }
    if (qtVal("qt_vc_addr")) { rows.push({ k: qdT("l_addr"), v: qtVal("qt_vc_addr") }); }
    spec.lines = rows;
  }
  return spec;
}

var qdToken = 0;
// Dựng thẻ: tạo QR đúng kích thước đích (nền trắng) -> tải thành ảnh -> vẽ 1:1 lên canvas. Trả về Promise<canvas>.
function qrDesignBuild(data, type){
  var L = QD_LAYOUTS[type][qdLayout] || QD_LAYOUTS[type][0];
  var base = qrWsReadFormOptions();
  var opts = { color: base.color, bg: "#ffffff", size: L.qr, margin: Math.round(L.qr * 0.075) };
  var spec = qrDesignCollect(type);
  var qr = qrWsBuildStyling(data, opts, L.qr);
  return qr.getRawData("png").then(function(blob){
    if (!blob) { throw new Error("no blob"); }
    return new Promise(function(resolve, reject){
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function(){ URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function(){ URL.revokeObjectURL(url); reject(new Error("img")); };
      img.src = url;
    });
  }).then(function(img){
    spec.qrImg = img;
    return qrDesignRender(spec);
  });
}

function qrDesignDownload(canvas){
  canvas.toBlob(function(blob){
    if (!blob) { return; }
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "qr_card_" + Date.now() + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  }, "image/png");
}

function qrDesignBind(onChange){
  qdLayout = 0;
  qdAccent = "#6366f1";
  var toggle = document.getElementById("qrWsDesignToggle");
  var panel = document.getElementById("qrWsDesignPanel");
  if (toggle && panel) {
    toggle.addEventListener("click", function(){ panel.style.display = panel.style.display === "none" ? "block" : "none"; onChange(); });
  }
  var on = document.getElementById("qd_on"), opts = document.getElementById("qdOptions");
  if (on && opts) {
    on.addEventListener("change", function(){ opts.style.display = on.checked ? "block" : "none"; onChange(); });
  }
  var lbtns = document.querySelectorAll("#qdLayoutRow .qr-size-btn");
  for (var i = 0; i < lbtns.length; i++) {
    (function(b){
      b.addEventListener("click", function(){
        qdLayout = parseInt(b.getAttribute("data-qdlayout"), 10) || 0;
        for (var j = 0; j < lbtns.length; j++) { lbtns[j].classList.toggle("active", lbtns[j] === b); }
        onChange();
      });
    })(lbtns[i]);
  }
  var sw = document.querySelectorAll(".qd-swatch");
  for (var k = 0; k < sw.length; k++) {
    (function(b){ b.addEventListener("click", function(){ qdSetColor(b.getAttribute("data-qdcolor")); onChange(); }); })(sw[k]);
  }
  var col = document.getElementById("qd_color"), hex = document.getElementById("qd_color_hex");
  if (col) { col.addEventListener("input", function(){ qdSetColor(col.value); onChange(); }); }
  if (hex) { hex.addEventListener("change", function(){ qdSetColor(hex.value); onChange(); }); }
  var others = document.querySelectorAll("#qd_vq input, #qd_brand");
  for (var m = 0; m < others.length; m++) {
    others[m].addEventListener("input", onChange);
    others[m].addEventListener("change", onChange);
  }
}
`;

// Thiết kế thẻ/bảng in sẵn quanh mã QR cho VietQR và Danh thiếp (QR Studio).
// QR_DESIGN_CLIENT_SRC là mã ES5 chạy trên trình duyệt, nhúng nguyên văn vào script client của appHtml.js (cạnh qrTypes.js).
// Viết bằng String.raw nên backslash giữ nguyên; TUYỆT ĐỐI không dùng dấu backtick hoặc dấu đô-la-ngoặc-nhọn bên trong.
// Nguyên tắc: mã QR được dựng đúng kích thước đích rồi vẽ 1:1 (không co giãn) lên thẻ, phần thiết kế chỉ nằm bên ngoài,
// nên không thể làm hỏng khả năng quét. Dữ liệu chỉ xử lý trên trình duyệt.

export const QR_DESIGN_CLIENT_SRC = String.raw`
var QD_SWATCHES = ["#6366f1", "#16a34a", "#dc2626", "#ea580c", "#1e293b"];
var QD_FONT = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
var QD_LAYOUTS = {
  vietqr: [ { id: "portrait", W: 1080, H: 1720, qr: 680 }, { id: "landscape", W: 1600, H: 900, qr: 680 } ],
  vcard:  [
    { id: "classic", W: 1050, H: 600, qr: 380 }, { id: "tall", W: 600, H: 1050, qr: 340 },
    { id: "bold", W: 1050, H: 600, qr: 340 }, { id: "split", W: 1050, H: 600, qr: 300 },
    { id: "minimal", W: 1050, H: 600, qr: 280 }, { id: "dark", W: 600, H: 1050, qr: 340 }
  ]
};
var QD_T = {
  vi: {
    toggle: "Thêm thiết kế (tuỳ chọn)", on: "Dùng thiết kế in sẵn (thẻ / bảng)",
    lay_vq0: "Bảng đứng", lay_vq1: "Ngang", lay_vc0: "Cổ điển", lay_vc1: "Thẻ đứng", lay_vc2: "Nền đậm", lay_vc3: "Chia đôi", lay_vc4: "Tối giản", lay_vc5: "Đứng tối",
    layout: "Bố cục", color: "Màu chủ đạo", title: "Tiêu đề trên bảng", title_def: "QUÉT MÃ ĐỂ CHUYỂN KHOẢN",
    holder: "Tên chủ tài khoản (chỉ hiện trên bảng, không nằm trong mã QR)", holder_ph: "NGUYEN VAN AN",
    show_amount: "Hiện số tiền", show_content: "Hiện nội dung", brand: "Hiện dòng \"Tạo bởi shurlvn.com\" ở chân thẻ", made_by: "Tạo bởi shurlvn.com", vq_check: "Kiểm tra tên người nhận trong app trước khi chuyển", brand_locked: "Từ gói Plus trở lên mới bỏ được dòng này. Bấm để xem bảng giá.",
    note: "Tải về dạng PNG để in hoặc đăng. Mã QR giữ nguyên, phần thiết kế chỉ nằm bên ngoài; công cụ tự quét lại thẻ để kiểm tra.",
    dl: "Tải thẻ PNG",
    vq_acc: "Số tài khoản", vq_amount: "Số tiền", vq_content: "Nội dung", vq_foot: "Quét bằng app ngân hàng bất kỳ · VietQR",
    l_tel: "ĐT", l_email: "Email", l_web: "Web", l_addr: "Đ/c", cur: "VND"
  },
  en: {
    toggle: "Add design (optional)", on: "Use a ready-to-print design (card / sign)",
    lay_vq0: "Portrait sign", lay_vq1: "Landscape", lay_vc0: "Classic", lay_vc1: "Tall card", lay_vc2: "Bold", lay_vc3: "Split", lay_vc4: "Minimal", lay_vc5: "Dark tall",
    layout: "Layout", color: "Accent color", title: "Sign title", title_def: "SCAN TO TRANSFER",
    holder: "Account holder name (shown on the sign only, not inside the QR code)", holder_ph: "NGUYEN VAN AN",
    show_amount: "Show amount", show_content: "Show message", brand: "Show \"Made with shurlvn.com\" at the bottom", made_by: "Made with shurlvn.com", vq_check: "Check the recipient name in your app before transferring", brand_locked: "Plus plan and above can remove this line. Click to see plans.",
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
  qdText(ctx, qdT("made_by"), x == null ? W / 2 : x, y, { size: 26, weight: "600", color: "#94a3b8", align: align || "center", maxW: W - 80 });
}

// ---------- Màu phụ ----------
// Pha màu hex với trắng: t = tỉ lệ trắng (0 = màu gốc, 1 = trắng).
function qdMix(hex, t){
  var c = qdRgb(hex);
  return "rgb(" + Math.round(c[0] + (255 - c[0]) * t) + "," + Math.round(c[1] + (255 - c[1]) * t) + "," + Math.round(c[2] + (255 - c[2]) * t) + ")";
}
// Màu nhấn dùng làm chữ/nhãn trên nền TỐI: màu tối thì sáng lên để đọc được.
function qdLift(hex){
  return qdLuma(hex) < 0.5 ? qdMix(hex, 0.6) : hex;
}
function qdCircle(ctx, cx, cy, r, fill, alpha){
  var prev = ctx.globalAlpha;
  if (alpha != null) { ctx.globalAlpha = alpha; }
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = prev;
}
// Thẻ trắng bo góc có bóng mềm (nền của khối thông tin/QR).
function qdSoftCard(ctx, x, y, w, h, r){
  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.16)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = "#ffffff";
  qdRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}
// Nền chuyển sắc nhạt theo màu chủ đạo.
function qdTintBg(ctx, W, H, accent, horizontal){
  var g = horizontal ? ctx.createLinearGradient(0, 0, W, 0) : ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, qdMix(accent, 0.8));
  g.addColorStop(horizontal ? 1 : 0.6, qdMix(accent, 0.94));
  if (!horizontal) { g.addColorStop(1, "#ffffff"); }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
// Vẽ QR 1:1 tại toạ độ số nguyên (không làm mịn) lên nền trắng của thẻ.
function qdDrawQr(ctx, img, x, y, qs){
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, Math.round(x), Math.round(y), qs, qs);
}

// ---------- Bố cục VietQR ----------
// s: { accent, title, bank, holder, account, amount, content, brand, qrImg, qr, W, H }
// Nền chuyển sắc nhạt, thẻ trắng bo góc: tên chủ tài khoản + số tài khoản ở đầu thẻ, QR ở giữa (kiểu thẻ ngân hàng).
function qdVqHeaderRow(ctx, s, x, y, w, ink, on){
  var initial = String(s.holder || s.bank || "?").replace(/^\s+/, "").charAt(0).toUpperCase();
  qdCircle(ctx, x + 64, y + 64, 64, s.accent);
  qdText(ctx, initial, x + 64, y + 64 - 36, { size: 72, weight: "800", color: on, align: "center", maxW: 100 });
  var tx = x + 164, mw = w - 164;
  if (s.holder) {
    qdText(ctx, s.holder, tx, y + 10, { size: 46, minSize: 26, weight: "800", color: "#0f172a", maxW: mw, maxLines: 1, lh: 1.15 });
    qdText(ctx, s.account, tx, y + 72, { size: 44, minSize: 26, weight: "600", color: "#334155", maxW: mw, maxLines: 1 });
  } else {
    qdText(ctx, s.account, tx, y + 40, { size: 48, minSize: 26, weight: "700", color: "#0f172a", maxW: mw, maxLines: 1 });
  }
}
function qdVqPill(ctx, text, cx, y, accent, on, maxW){
  var lay = qdLayoutText(ctx, text, { size: 52, minSize: 30, weight: "800", maxW: maxW - 100, maxLines: 1 });
  var tw = qdWidth(ctx, lay.lines[0] || "", "800", lay.size);
  var pw = Math.round(tw + 100);
  ctx.fillStyle = accent;
  qdRoundRect(ctx, Math.round(cx - pw / 2), y, pw, 92, 46);
  ctx.fill();
  qdDrawLines(ctx, lay, cx, y + Math.round((92 - lay.size) / 2) - 2, { color: on, align: "center" });
}
function qdVqPortrait(ctx, s){
  var W = s.W, H = s.H, ink = qdInk(s.accent), on = qdTextOn(s.accent), cx = W / 2;
  qdTintBg(ctx, W, H, s.accent, false);
  qdText(ctx, s.title, cx, 92, { size: 34, minSize: 22, weight: "700", color: ink, align: "center", maxW: W - 160, maxLines: 1, alpha: 0.85 });
  qdText(ctx, s.bank, cx, 150, { size: 96, minSize: 44, weight: "800", color: ink, align: "center", maxW: W - 160, maxLines: 1, lh: 1.1 });
  var cw = 880, cardX = 100, cardY = 320, ch = 1200;
  qdSoftCard(ctx, cardX, cardY, cw, ch, 56);
  qdVqHeaderRow(ctx, s, cardX + 56, cardY + 56, cw - 112, ink, on);
  var divY = cardY + 240;
  ctx.fillStyle = "#e2e8f0"; ctx.fillRect(cardX, divY, cw, 2);
  // Khối QR + số tiền + nội dung canh giữa theo chiều dọc trong phần còn lại của thẻ.
  var blockH = s.qr + (s.amount ? 24 + 92 : 0) + (s.content ? 18 + 44 : 0);
  var top = divY + 2, y = Math.round(top + (cardY + ch - top - blockH) / 2);
  qdDrawQr(ctx, s.qrImg, cardX + (cw - s.qr) / 2, y, s.qr);
  y += s.qr;
  if (s.amount) { y += 24; qdVqPill(ctx, s.amount, cx, y, s.accent, on, cw - 100); y += 92; }
  if (s.content) { y += 18; qdText(ctx, qdT("vq_content") + ": " + s.content, cx, y, { size: 34, minSize: 22, weight: "500", color: "#475569", align: "center", maxW: cw - 120, maxLines: 1 }); }
  qdText(ctx, qdT("vq_foot"), cx, H - 164, { size: 28, weight: "500", color: "#64748b", align: "center", maxW: W - 160 });
  // Dòng nhắc chống lừa đảo: luôn hiện trên thẻ VietQR (người chuyển tự đối chiếu tên với app ngân hàng).
  qdText(ctx, qdT("vq_check"), cx, H - 118, { size: 30, minSize: 22, weight: "700", color: "#334155", align: "center", maxW: W - 120, maxLines: 1 });
  qdBrand(ctx, W, H - 64, s.brand);
}
function qdVqLandscape(ctx, s){
  var W = s.W, H = s.H, ink = qdInk(s.accent), on = qdTextOn(s.accent);
  qdTintBg(ctx, W, H, s.accent, true);
  qdSoftCard(ctx, 70, 70, 760, 760, 56);
  qdDrawQr(ctx, s.qrImg, 70 + (760 - s.qr) / 2, 70 + (760 - s.qr) / 2, s.qr);
  var x0 = 920, mw = W - x0 - 90, y = 100;
  y += qdText(ctx, s.title, x0, y, { size: 30, minSize: 20, weight: "700", color: ink, maxW: mw, maxLines: 2, alpha: 0.85 }) + 8;
  y += qdText(ctx, s.bank, x0, y, { size: 88, minSize: 40, weight: "800", color: ink, maxW: mw, maxLines: 1, lh: 1.1 }) + 8;
  ctx.fillStyle = s.accent; ctx.fillRect(x0, y, 110, 8); y += 38;
  y += qdText(ctx, s.holder, x0, y, { size: 50, minSize: 30, weight: "800", color: "#0f172a", maxW: mw, maxLines: 2, lh: 1.15, oneLineFirst: true }) + 10;
  if (s.account) {
    y += qdText(ctx, qdT("vq_acc"), x0, y, { size: 26, weight: "500", color: "#64748b", maxW: mw });
    y += qdText(ctx, s.account, x0, y, { size: 62, minSize: 30, weight: "800", color: "#0f172a", maxW: mw, maxLines: 1 }) + 16;
  }
  if (s.amount) {
    var lay = qdLayoutText(ctx, s.amount, { size: 46, minSize: 28, weight: "800", maxW: mw - 80, maxLines: 1 });
    var pw = Math.round(qdWidth(ctx, lay.lines[0] || "", "800", lay.size) + 80);
    ctx.fillStyle = s.accent; qdRoundRect(ctx, x0, y, pw, 82, 41); ctx.fill();
    qdDrawLines(ctx, lay, x0 + 40, y + Math.round((82 - lay.size) / 2) - 2, { color: on });
    y += 82 + 16;
  }
  if (s.content) { qdText(ctx, qdT("vq_content") + ": " + s.content, x0, y, { size: 32, minSize: 22, weight: "500", color: "#475569", maxW: mw, maxLines: 2 }); }
  qdText(ctx, qdT("vq_check"), x0, H - 150, { size: 28, minSize: 22, weight: "700", color: "#334155", maxW: mw, maxLines: 2 });
  qdBrand(ctx, W, H - 70, s.brand, "left", x0);
}

// ---------- Bố cục Danh thiếp ----------
// s: { accent, name, title, org, lines:[{k,v}], brand, qrImg, qr, W, H }
// 6 kiểu: 0 Cổ điển, 1 Thẻ đứng, 2 Nền đậm, 3 Chia đôi, 4 Tối giản, 5 Đứng tối.
function qdContactRows(ctx, s, x, y, width, size, gap, labelColor, valColor){
  var labelW = 92;
  for (var i = 0; i < s.lines.length; i++) {
    var row = s.lines[i];
    qdText(ctx, row.k, x, y + 2, { size: size - 4, weight: "800", color: labelColor || qdInk(s.accent), maxW: labelW - 8 });
    var lay = qdLayoutText(ctx, row.v, { size: size, minSize: size - 7, weight: "500", maxW: width - labelW, maxLines: 2, lh: 1.2, oneLineFirst: true });
    qdDrawLines(ctx, lay, x + labelW, y, { color: valColor || "#1e293b" });
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
// Nền đậm: cả thẻ tô màu chủ đạo, chữ sáng/tối tự đổi theo độ sáng nền, QR trong khung trắng bên phải.
function qdVcBold(ctx, s){
  var W = s.W, H = s.H, on = qdTextOn(s.accent);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, H);
  qdCircle(ctx, W - 30, -10, 280, on, 0.07);
  qdCircle(ctx, 60, H + 40, 200, on, 0.06);
  var pad = 24, pw = s.qr + pad * 2, px = W - pw - 56;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#ffffff"; qdRoundRect(ctx, px, Math.round((H - pw) / 2), pw, pw, 28); ctx.fill();
  ctx.restore();
  qdDrawQr(ctx, s.qrImg, px + pad, Math.round((H - pw) / 2) + pad, s.qr);
  var x = 64, mw = px - 40 - x, y = 62;
  y += qdText(ctx, s.name, x, y, { size: 60, minSize: 30, weight: "800", color: on, maxW: mw, maxLines: 2, lh: 1.1 }) + 6;
  y += qdText(ctx, s.title, x, y, { size: 30, minSize: 20, weight: "700", color: on, maxW: mw, maxLines: 2, alpha: 0.95 }) + 4;
  y += qdText(ctx, s.org, x, y, { size: 28, minSize: 20, weight: "500", color: on, maxW: mw, maxLines: 2, alpha: 0.8 }) + 16;
  ctx.fillStyle = on; ctx.globalAlpha = 0.5; ctx.fillRect(x, y, 90, 5); ctx.globalAlpha = 1; y += 28;
  var endY = qdContactRows(ctx, s, x, y, mw, 25, 10, on, on);
  if (endY < H - 58 && s.brand) { qdText(ctx, qdT("made_by"), x, H - 44, { size: 24, weight: "600", color: on, maxW: mw, alpha: 0.6 }); }
}
// Chia đôi: cột trái tô màu chủ đạo chứa QR, cột phải trắng chứa tên và thông tin liên hệ.
function qdVcSplit(ctx, s){
  var W = s.W, H = s.H, on = qdTextOn(s.accent), ink = qdInk(s.accent), lw = 400;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, lw, H);
  qdCircle(ctx, 0, 0, 170, on, 0.08);
  qdCircle(ctx, lw, H, 130, on, 0.06);
  var pad = 20, pw = s.qr + pad * 2, px = Math.round((lw - pw) / 2), py = Math.round((H - pw) / 2) - 8;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#ffffff"; qdRoundRect(ctx, px, py, pw, pw, 24); ctx.fill();
  ctx.restore();
  qdDrawQr(ctx, s.qrImg, px + pad, py + pad, s.qr);
  if (s.brand) { qdText(ctx, qdT("made_by"), lw / 2, H - 46, { size: 24, weight: "600", color: on, align: "center", maxW: lw - 40, alpha: 0.7 }); }
  var x = lw + 50, mw = W - x - 50, y = 62;
  y += qdText(ctx, s.name, x, y, { size: 58, minSize: 30, weight: "800", color: "#0f172a", maxW: mw, maxLines: 2, lh: 1.1 }) + 6;
  y += qdText(ctx, s.title, x, y, { size: 30, minSize: 20, weight: "700", color: ink, maxW: mw, maxLines: 2 }) + 4;
  y += qdText(ctx, s.org, x, y, { size: 28, minSize: 20, weight: "500", color: "#475569", maxW: mw, maxLines: 2 }) + 14;
  ctx.fillStyle = s.accent; ctx.fillRect(x, y, 90, 6); y += 30;
  qdContactRows(ctx, s, x, y, mw, 25, 10);
}
// Tối giản: nền trắng, vạch màu nhỏ, chữ gọn bên trái, QR không khung ở góc phải dưới.
function qdVcMinimal(ctx, s){
  var W = s.W, H = s.H, ink = qdInk(s.accent);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, 12);
  var qx = W - s.qr - 60, qy = H - s.qr - 50;
  qdDrawQr(ctx, s.qrImg, qx, qy, s.qr);
  var x = 64, mw = qx - 40 - x, y = 62;
  ctx.fillStyle = s.accent; ctx.fillRect(x, y, 70, 8); y += 32;
  y += qdText(ctx, s.name, x, y, { size: 62, minSize: 30, weight: "800", color: "#0f172a", maxW: mw, maxLines: 2, lh: 1.1 }) + 6;
  y += qdText(ctx, s.title, x, y, { size: 30, minSize: 20, weight: "700", color: ink, maxW: mw, maxLines: 2 }) + 4;
  y += qdText(ctx, s.org, x, y, { size: 28, minSize: 20, weight: "500", color: "#64748b", maxW: mw, maxLines: 2 }) + 26;
  var endY = qdContactRows(ctx, s, x, y, mw, 25, 10, "#94a3b8", "#1e293b");
  if (endY < H - 58) { qdBrand(ctx, W, H - 44, s.brand, "left", x); }
}
// Đứng tối: nền xanh đen, vạch màu chủ đạo trên đầu, QR trong khung trắng.
function qdVcDark(ctx, s){
  var W = s.W, H = s.H, lift = qdLift(s.accent);
  ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.accent; ctx.fillRect(0, 0, W, 18);
  var mw = W - 100, y = 70;
  y += qdText(ctx, s.name, W / 2, y, { size: 54, minSize: 28, weight: "800", color: "#ffffff", align: "center", maxW: mw, maxLines: 2, lh: 1.1 }) + 8;
  y += qdText(ctx, s.title, W / 2, y, { size: 28, minSize: 20, weight: "700", color: lift, align: "center", maxW: mw, maxLines: 2 }) + 4;
  y += qdText(ctx, s.org, W / 2, y, { size: 26, minSize: 18, weight: "500", color: "#94a3b8", align: "center", maxW: mw, maxLines: 2 });
  var pad = 22, pw = s.qr + pad * 2, py = Math.max(y + 36, 330);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#ffffff"; qdRoundRect(ctx, Math.round((W - pw) / 2), py, pw, pw, 28); ctx.fill();
  ctx.restore();
  qdDrawQr(ctx, s.qrImg, (W - pw) / 2 + pad, py + pad, s.qr);
  var endY = qdContactRows(ctx, s, 56, py + pw + 44, W - 112, 25, 10, lift, "#e2e8f0");
  if (endY < H - 58 && s.brand) { qdText(ctx, qdT("made_by"), W / 2, H - 44, { size: 26, weight: "600", color: "#64748b", align: "center", maxW: W - 80 }); }
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
  var fns = {
    "vietqr:portrait": qdVqPortrait, "vietqr:landscape": qdVqLandscape,
    "vcard:classic": qdVcLandscape, "vcard:tall": qdVcPortrait, "vcard:bold": qdVcBold,
    "vcard:split": qdVcSplit, "vcard:minimal": qdVcMinimal, "vcard:dark": qdVcDark
  };
  fns[spec.kind + ":" + L.id](ctx, s);
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
var qdLastType = "";
var qdAccent = "#6366f1";

function qdSwatchesHtml(){
  var h = "";
  for (var i = 0; i < QD_SWATCHES.length; i++) {
    h += '<button type="button" class="qr-preset-swatch qd-swatch" data-qdcolor="' + QD_SWATCHES[i] + '" style="background:' + QD_SWATCHES[i] + ';" title="' + QD_SWATCHES[i] + '"></button>';
  }
  return h;
}

// Chỉ gói Plus trở lên (cờ canRemoveQrBrand trong TIER_CONFIG) mới được bỏ dòng thương hiệu; khách/Free thấy ổ khoá.
function qdBrandRemovable(){
  return !!(typeof state !== "undefined" && state.user && state.limits && state.limits.canRemoveQrBrand);
}
function qdBrandLockedClick(){
  if (typeof state !== "undefined" && state.user) { navigate("pricing"); } else { navRegister(); }
}
function qdBrandRowHtml(){
  if (qdBrandRemovable()) {
    return '<label class="qd-chk"><input type="checkbox" id="qd_brand" checked> ' + qdT("brand") + '</label>';
  }
  return '<div class="qd-chk qd-chk-locked" onclick="qdBrandLockedClick()" title="' + qdT("brand_locked") + '">' +
    '<input type="checkbox" id="qd_brand" checked disabled> <span>' + qdT("brand") + '</span>' +
    '<span class="qd-lock">' + li('lock_icon', 11) + '</span></div>' +
    '<p class="hint" style="margin:2px 0 0;font-size:12px;">' + qdT("brand_locked") + '</p>';
}

function qrDesignPanelHtml(){
  return '' +
    '<div class="qr-collapsible-toggle" id="qrWsDesignToggle" style="display:none;">' + li('plus', 12) + ' ' + qdT("toggle") + '</div>' +
    '<div id="qrWsDesignPanel" class="qd-panel" style="display:none;">' +
      '<label class="qd-chk"><input type="checkbox" id="qd_on"> ' + qdT("on") + '</label>' +
      '<div id="qdOptions" style="display:none;">' +
        '<label>' + qdT("layout") + '</label>' +
        '<div class="qr-size-row" id="qdLayoutRow"></div>' +
        '<label>' + qdT("color") + '</label>' +
        '<div class="qr-color-input-wrap" style="max-width:220px;"><input type="color" id="qd_color" value="#6366f1"><input type="text" id="qd_color_hex" value="#6366f1"></div>' +
        '<div class="qd-swatches">' + qdSwatchesHtml() + '</div>' +
        '<div id="qd_vq" style="display:none;">' +
          '<label for="qd_title">' + qdT("title") + '</label><input type="text" id="qd_title" class="qr-existing-select" style="margin-top:0;" maxlength="60" placeholder="' + qdT("title_def") + '">' +
          '<label for="qd_holder">' + qdT("holder") + '</label><input type="text" id="qd_holder" class="qr-existing-select" style="margin-top:0;" maxlength="60" placeholder="' + qdT("holder_ph") + '">' +
          '<label class="qd-chk"><input type="checkbox" id="qd_show_amount" checked> ' + qdT("show_amount") + '</label>' +
          '<label class="qd-chk"><input type="checkbox" id="qd_show_content" checked> ' + qdT("show_content") + '</label>' +
        '</div>' +
        qdBrandRowHtml() +
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
    // Số nút bố cục khác nhau theo loại (VietQR 2 kiểu, Danh thiếp 6 kiểu): dựng lại khi đổi loại.
    var row = document.getElementById("qdLayoutRow");
    var pre = type === "vietqr" ? "lay_vq" : "lay_vc";
    var count = QD_LAYOUTS[type].length;
    if (qdLastType !== type) { qdLayout = 0; qdLastType = type; }
    if (row) {
      var bh = "";
      for (var i = 0; i < count; i++) {
        bh += '<button type="button" class="qr-size-btn' + (i === qdLayout ? " active" : "") + '" data-qdlayout="' + i + '">' + qdT(pre + i) + "</button>";
      }
      row.innerHTML = bh;
    }
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
  // Gói thấp: dòng "Tạo bởi shurlvn.com" luôn được gắn (ô chọn bị khoá); từ gói Plus mới bỏ chọn được.
  var spec = { kind: type, layout: qdLayout, accent: qdAccent, brand: !qdBrandRemovable() || !!(brand && brand.checked) };
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
  qdLastType = "";
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
  var lrow = document.getElementById("qdLayoutRow");
  if (lrow) {
    lrow.addEventListener("click", function(e){
      var b = e.target;
      while (b && b !== lrow && !(b.getAttribute && b.getAttribute("data-qdlayout") !== null)) { b = b.parentNode; }
      if (!b || b === lrow) { return; }
      qdLayout = parseInt(b.getAttribute("data-qdlayout"), 10) || 0;
      var lbtns = lrow.querySelectorAll(".qr-size-btn");
      for (var j = 0; j < lbtns.length; j++) { lbtns[j].classList.toggle("active", lbtns[j] === b); }
      onChange();
    });
  }
  var sw = document.querySelectorAll(".qd-swatch");
  for (var k = 0; k < sw.length; k++) {
    (function(b){ b.addEventListener("click", function(){ qdSetColor(b.getAttribute("data-qdcolor")); onChange(); }); })(sw[k]);
  }
  var col = document.getElementById("qd_color"), hex = document.getElementById("qd_color_hex");
  if (col) { col.addEventListener("input", function(){ qdSetColor(col.value); onChange(); }); }
  if (hex) { hex.addEventListener("change", function(){ qdSetColor(hex.value); onChange(); }); }
  // Chọn ngân hàng thì tự đặt màu chủ đạo theo ngân hàng đó (người dùng vẫn đổi lại được).
  var bankSel = document.getElementById("qt_vq_bank");
  if (bankSel) {
    bankSel.addEventListener("change", function(){
      var c = QR_BANK_COLORS[bankSel.value];
      if (c) { qdSetColor(c); }
      onChange();
    });
  }
  var others = document.querySelectorAll("#qd_vq input, #qd_brand");
  for (var m = 0; m < others.length; m++) {
    others[m].addEventListener("input", onChange);
    others[m].addEventListener("change", onChange);
  }
}
`;

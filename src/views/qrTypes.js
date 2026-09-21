// Mã QR đặc biệt cho QR Studio: VietQR chuyển khoản, Zalo, WiFi, Danh thiếp (vCard).
// QR_TYPES_CLIENT_SRC là mã ES5 chạy trên trình duyệt, được nhúng nguyên văn vào script client của appHtml.js
// (giá trị nội suy không bị template ngoài xử lý escape lại). Viết bằng String.raw nên backslash giữ nguyên;
// TUYỆT ĐỐI không dùng dấu backtick hoặc dấu đô-la-ngoặc-nhọn bên trong.
// Dữ liệu chỉ xử lý trên trình duyệt, không gửi lên máy chủ. Danh sách BIN ngân hàng đối chiếu với API VietQR (09/2026).

export const QR_TYPES_CLIENT_SRC = String.raw`
var QR_BANKS = [
  ["Vietcombank","970436"],["VietinBank","970415"],["BIDV","970418"],["Agribank","970405"],["MBBank","970422"],
  ["Techcombank","970407"],["ACB","970416"],["VPBank","970432"],["TPBank","970423"],["Sacombank","970403"],
  ["HDBank","970437"],["VIB","970441"],["SHB","970443"],["OCB","970448"],["MSB","970426"],["SeABank","970440"],
  ["Eximbank","970431"],["LPBank","970449"],["NamABank","970428"],["VietBank","970433"],["PVcomBank","970412"],
  ["NCB","970419"],["ABBANK","970425"],["SCB","970429"],["BacABank","970409"],["SaigonBank","970400"],
  ["VietCapitalBank","970454"],["KienLongBank","970452"],["PGBank","970430"],["BaoVietBank","970438"],
  ["ShinhanBank","970424"],["VietABank","970427"],["COOPBANK","970446"]
];
// Màu chủ đạo gần đúng theo nhận diện từng ngân hàng (chỉ MÀU, không dùng logo/font vì là nhãn hiệu); khoá = mã BIN.
// Ngân hàng không có trong bảng thì giữ nguyên màu đang chọn.
var QR_BANK_COLORS = {
  "970436": "#00794e", "970415": "#1c56a4", "970418": "#1e5aa8", "970405": "#a6193c", "970422": "#1f3a9e",
  "970407": "#e31b23", "970416": "#1a4f9e", "970432": "#0a8f4a", "970423": "#6b2a86", "970403": "#1d4e9e",
  "970437": "#d9262c", "970441": "#0066b3", "970443": "#ee7623", "970448": "#2a9250", "970426": "#e2101b",
  "970440": "#d32029", "970431": "#0a58a6"
};
var QR_T = {
  vi: {
    t_vietqr:"VietQR", t_zalo:"Zalo", t_wifi:"WiFi", t_vcard:"Danh thiếp",
    priv:"Dữ liệu chỉ xử lý trên trình duyệt của bạn, không gửi lên máy chủ.",
    vq_bank:"Ngân hàng", vq_bank_ph:"Chọn ngân hàng…", vq_acc:"Số tài khoản", vq_amount:"Số tiền (VND, tuỳ chọn)",
    vq_content:"Nội dung chuyển khoản (tuỳ chọn, tối đa 25 ký tự, tự bỏ dấu)",
    vq_note:"Mã theo chuẩn VietQR/NAPAS 247, quét được bằng app ngân hàng. Hãy quét thử và kiểm tra tên người nhận trước khi in hoặc chia sẻ.",
    vq_safe:"Lưu ý an toàn: tên chủ tài khoản hiển thị trên thẻ do người tạo tự nhập, SHURL không xác minh. Không dùng để lừa đảo hoặc giả mạo cá nhân/tổ chức khác. Phát hiện lạm dụng, vui lòng báo về",
    e_bank:"Hãy chọn ngân hàng.", e_acc:"Số tài khoản chỉ gồm chữ số (6 đến 19 số).", e_amount:"Số tiền không hợp lệ (chỉ nhập số, tối đa 12 chữ số).",
    zl_id:"Số điện thoại hoặc ID Zalo OA", zl_note:"QR mở thẳng cuộc trò chuyện Zalo với số điện thoại hoặc trang OA này.",
    e_zalo:"Nhập số điện thoại (8 đến 15 số) hoặc ID Zalo OA (chữ, số, dấu chấm, gạch nối, gạch dưới).",
    wf_ssid:"Tên mạng (SSID)", wf_sec:"Bảo mật", wf_wpa:"WPA/WPA2/WPA3", wf_wep:"WEP", wf_none:"Không mật khẩu",
    wf_pass:"Mật khẩu", wf_hidden:"Mạng WiFi ẩn", wf_note:"Quét bằng camera điện thoại là tự kết nối vào mạng này.",
    e_ssid:"Nhập tên mạng WiFi.", e_pass_req:"Nhập mật khẩu WiFi.", e_pass:"Mật khẩu WPA cần từ 8 đến 63 ký tự.",
    vc_last:"Họ và tên đệm", vc_first:"Tên", vc_org:"Công ty", vc_title:"Chức vụ", vc_phone:"Điện thoại",
    vc_email:"Email", vc_web:"Website", vc_addr:"Địa chỉ", vc_note:"Quét bằng camera điện thoại để lưu thẳng vào danh bạ.",
    e_name:"Nhập họ hoặc tên.", e_email:"Email không hợp lệ.", e_phone:"Số điện thoại không hợp lệ."
  },
  en: {
    t_vietqr:"VietQR", t_zalo:"Zalo", t_wifi:"WiFi", t_vcard:"Contact card",
    priv:"Data is processed only in your browser and never sent to a server.",
    vq_bank:"Bank", vq_bank_ph:"Select a bank…", vq_acc:"Account number", vq_amount:"Amount (VND, optional)",
    vq_content:"Transfer message (optional, max 25 chars, accents removed)",
    vq_note:"Follows the VietQR / NAPAS 247 standard and scans in Vietnamese banking apps. Test-scan it and check the recipient name before printing or sharing.",
    vq_safe:"Safety notice: the account holder name shown on the card is typed in by the creator and is not verified by SHURL. Do not use this to scam or impersonate any person or organization. To report abuse, contact",
    e_bank:"Please select a bank.", e_acc:"Account number must be digits only (6 to 19 digits).", e_amount:"Invalid amount (digits only, max 12 digits).",
    zl_id:"Phone number or Zalo OA ID", zl_note:"The QR opens a Zalo chat with this phone number or OA page.",
    e_zalo:"Enter a phone number (8 to 15 digits) or a Zalo OA ID (letters, digits, dot, hyphen, underscore).",
    wf_ssid:"Network name (SSID)", wf_sec:"Security", wf_wpa:"WPA/WPA2/WPA3", wf_wep:"WEP", wf_none:"No password",
    wf_pass:"Password", wf_hidden:"Hidden network", wf_note:"Scanning with a phone camera connects to this network automatically.",
    e_ssid:"Enter the WiFi network name.", e_pass_req:"Enter the WiFi password.", e_pass:"A WPA password must be 8 to 63 characters.",
    vc_last:"Last name", vc_first:"First name", vc_org:"Company", vc_title:"Job title", vc_phone:"Phone",
    vc_email:"Email", vc_web:"Website", vc_addr:"Address", vc_note:"Scan with a phone camera to save straight to contacts.",
    e_name:"Enter a first or last name.", e_email:"Invalid email address.", e_phone:"Invalid phone number."
  }
};
function qrT(key){
  var lang = (typeof currentLang !== "undefined" && currentLang === "vi") ? "vi" : "en";
  return QR_T[lang][key] || QR_T.en[key] || key;
}

// Thư viện qr-code-styling ghi chuỗi ở dạng Latin-1 (ký tự như "ễ" bị cắt mất) nên phải đổi sang chuỗi byte UTF-8 trước khi tạo QR.
// Chuỗi thuần ASCII giữ nguyên. Điện thoại/máy quét đọc lại đúng UTF-8.
function qrUtf8(s){
  s = String(s == null ? "" : s);
  for (var i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) { return unescape(encodeURIComponent(s)); }
  }
  return s;
}

function qrStripAccents(s){
  s = String(s == null ? "" : s);
  if (!s.normalize) { return s; }
  var comb = new RegExp("[" + String.fromCharCode(768) + "-" + String.fromCharCode(879) + "]", "g");
  return s.normalize("NFD").replace(comb, "").split(String.fromCharCode(273)).join("d").split(String.fromCharCode(272)).join("D").normalize("NFC");
}

// CRC16-CCITT (poly 0x1021, init 0xFFFF) — dùng cho trường 63 của VietQR/EMVCo.
function qrCrc16(str){
  var crc = 0xFFFF;
  for (var i = 0; i < str.length; i++){
    crc ^= (str.charCodeAt(i) & 0xFF) << 8;
    for (var b = 0; b < 8; b++){
      crc = (crc & 0x8000) ? (((crc << 1) ^ 0x1021) & 0xFFFF) : ((crc << 1) & 0xFFFF);
    }
  }
  var hex = crc.toString(16).toUpperCase();
  while (hex.length < 4) { hex = "0" + hex; }
  return hex;
}

function qrTlv(tag, value){
  var len = String(value.length);
  if (len.length < 2) { len = "0" + len; }
  return tag + len + value;
}

// Làm sạch nội dung chuyển khoản: bỏ dấu, chỉ giữ ký tự an toàn, tối đa 25 ký tự (dùng cho cả mã QR lẫn thẻ thiết kế).
function qrCleanVietQrContent(s){
  return qrStripAccents(s || "").replace(/[^A-Za-z0-9 ._,-]/g, "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").slice(0, 25);
}

// o: { bin, account, amount, content } -> { data, error }
function qrBuildVietQr(o){
  var bin = String(o.bin || "");
  if (!/^[0-9]{6}$/.test(bin)) { return { data: "", error: "e_bank" }; }
  var account = String(o.account || "").replace(/[\s.\-]/g, "");
  if (!/^[0-9]{6,19}$/.test(account)) { return { data: "", error: "e_acc" }; }
  var amountRaw = String(o.amount || "").replace(/[\s.,]/g, "");
  var amount = "";
  if (amountRaw !== "") {
    if (!/^[0-9]{1,12}$/.test(amountRaw)) { return { data: "", error: "e_amount" }; }
    amount = String(parseInt(amountRaw, 10));
    if (amount === "0") { amount = ""; }
  }
  var content = qrCleanVietQrContent(o.content);
  var merchant = qrTlv("00", "A000000727") + qrTlv("01", qrTlv("00", bin) + qrTlv("01", account)) + qrTlv("02", "QRIBFTTA");
  var s = qrTlv("00", "01") + qrTlv("01", amount ? "12" : "11") + qrTlv("38", merchant) + qrTlv("53", "704") +
    (amount ? qrTlv("54", amount) : "") + qrTlv("58", "VN") + (content ? qrTlv("62", qrTlv("08", content)) : "");
  s += "6304";
  s += qrCrc16(s);
  return { data: s, error: "" };
}

// o: { id } -> { data, error }
function qrBuildZalo(o){
  var raw = String(o.id || "").replace(/^\s+|\s+$/g, "");
  if (raw === "") { return { data: "", error: "e_zalo" }; }
  var compact = raw.replace(/[\s.\-()]/g, "");
  if (/^\+?[0-9]{8,15}$/.test(compact)) {
    var digits = compact.replace(/^\+/, "");
    if (digits.indexOf("84") === 0 && digits.length >= 11) { digits = "0" + digits.slice(2); }
    return { data: "https://zalo.me/" + digits, error: "" };
  }
  if (/^[A-Za-z0-9._-]{3,50}$/.test(raw)) { return { data: "https://zalo.me/" + raw, error: "" }; }
  return { data: "", error: "e_zalo" };
}

function qrEscWifi(s){
  return String(s).replace(/([\\;,:"])/g, "\\$1");
}

// o: { ssid, password, security (WPA|WEP|nopass), hidden } -> { data, error }
function qrBuildWifi(o){
  var ssid = String(o.ssid || "");
  if (ssid === "") { return { data: "", error: "e_ssid" }; }
  var sec = (o.security === "WEP" || o.security === "nopass") ? o.security : "WPA";
  var pass = String(o.password || "");
  if (sec !== "nopass") {
    if (pass === "") { return { data: "", error: "e_pass_req" }; }
    if (sec === "WPA" && (pass.length < 8 || pass.length > 63)) { return { data: "", error: "e_pass" }; }
  }
  var s = "WIFI:T:" + sec + ";S:" + qrEscWifi(ssid) + ";";
  if (sec !== "nopass") { s += "P:" + qrEscWifi(pass) + ";"; }
  if (o.hidden) { s += "H:true;"; }
  s += ";";
  return { data: s, error: "" };
}

function qrEscVcard(s){
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r\n|\r|\n/g, "\\n");
}

// o: { last, first, org, title, phone, email, web, addr } -> { data, error }
function qrBuildVcard(o){
  var last = String(o.last || "").replace(/^\s+|\s+$/g, "");
  var first = String(o.first || "").replace(/^\s+|\s+$/g, "");
  if (last === "" && first === "") { return { data: "", error: "e_name" }; }
  var email = String(o.email || "").replace(/^\s+|\s+$/g, "");
  if (email !== "" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { return { data: "", error: "e_email" }; }
  var phone = String(o.phone || "").replace(/^\s+|\s+$/g, "");
  if (phone !== "") {
    var pd = phone.replace(/[^0-9]/g, "");
    if (!/^[0-9+() .\-]+$/.test(phone) || pd.length < 6 || pd.length > 15) { return { data: "", error: "e_phone" }; }
  }
  var web = String(o.web || "").replace(/^\s+|\s+$/g, "");
  if (web !== "" && !/^[a-z][a-z0-9+.\-]*:/i.test(web)) { web = "https://" + web; }
  var lang = (typeof currentLang !== "undefined" && currentLang === "vi") ? "vi" : "en";
  var full = lang === "vi" ? (last + " " + first) : (first + " " + last);
  full = full.replace(/^\s+|\s+$/g, "");
  var lines = ["BEGIN:VCARD", "VERSION:3.0", "N:" + qrEscVcard(last) + ";" + qrEscVcard(first) + ";;;", "FN:" + qrEscVcard(full)];
  if (o.org) { lines.push("ORG:" + qrEscVcard(o.org)); }
  if (o.title) { lines.push("TITLE:" + qrEscVcard(o.title)); }
  if (phone !== "") { lines.push("TEL;TYPE=CELL:" + qrEscVcard(phone)); }
  if (email !== "") { lines.push("EMAIL:" + qrEscVcard(email)); }
  if (web !== "") { lines.push("URL:" + qrEscVcard(web)); }
  if (o.addr) { lines.push("ADR;TYPE=WORK:;;" + qrEscVcard(o.addr) + ";;;;"); }
  lines.push("END:VCARD");
  return { data: lines.join("\r\n"), error: "" };
}

// ---------- Giao diện (chỉ chạy trong trình duyệt) ----------
var QR_TYPE_IDS = ["vietqr", "zalo", "wifi", "vcard"];

function qtField(id, labelKey, placeholder, extra){
  return '<div><label for="' + id + '">' + qrT(labelKey) + '</label><input type="text" id="' + id + '" class="qr-existing-select" style="margin-top:0;" autocomplete="off" placeholder="' + (placeholder || "") + '"' + (extra || "") + '></div>';
}

function qrTypesFormsHtml(){
  var bankOpts = '<option value="">' + qrT("vq_bank_ph") + '</option>';
  for (var i = 0; i < QR_BANKS.length; i++) {
    bankOpts += '<option value="' + QR_BANKS[i][1] + '">' + QR_BANKS[i][0] + '</option>';
  }
  var priv = '<p class="hint" style="margin:6px 0 0;font-size:12px;">' + qrT("priv") + '</p>';
  var err = function(k){ return '<div class="qr-tp-err" id="qt_err_' + k + '" role="status"></div>'; };
  return '' +
    '<div class="qr-tp" data-qrpanel="vietqr" style="display:none;">' +
      '<label for="qt_vq_bank">' + qrT("vq_bank") + '</label><select id="qt_vq_bank" class="qr-existing-select" style="margin-top:0;">' + bankOpts + '</select>' +
      qtField("qt_vq_acc", "vq_acc", "0123456789", ' inputmode="numeric"') +
      qtField("qt_vq_amount", "vq_amount", "50000", ' inputmode="numeric"') +
      qtField("qt_vq_content", "vq_content", "Thanh toan don hang", ' maxlength="40"') +
      '<p class="hint" style="margin:6px 0 0;font-size:12px;">' + qrT("vq_note") + '</p>' + priv + err("vietqr") +
      '<div class="qr-safe-note">' + qrT("vq_safe") + ' <a href="mailto:support@shurlvn.com">support@shurlvn.com</a>.</div>' +
    '</div>' +
    '<div class="qr-tp" data-qrpanel="zalo" style="display:none;">' +
      qtField("qt_zl_id", "zl_id", "0912345678") +
      '<p class="hint" style="margin:6px 0 0;font-size:12px;">' + qrT("zl_note") + '</p>' + priv + err("zalo") +
    '</div>' +
    '<div class="qr-tp" data-qrpanel="wifi" style="display:none;">' +
      qtField("qt_wf_ssid", "wf_ssid", "Cafe-WiFi") +
      '<label for="qt_wf_sec">' + qrT("wf_sec") + '</label><select id="qt_wf_sec" class="qr-existing-select" style="margin-top:0;">' +
        '<option value="WPA">' + qrT("wf_wpa") + '</option><option value="WEP">' + qrT("wf_wep") + '</option><option value="nopass">' + qrT("wf_none") + '</option></select>' +
      qtField("qt_wf_pass", "wf_pass", "") +
      '<label style="display:flex;align-items:center;gap:8px;margin-top:10px;cursor:pointer;"><input type="checkbox" id="qt_wf_hidden" style="width:auto;"> ' + qrT("wf_hidden") + '</label>' +
      '<p class="hint" style="margin:6px 0 0;font-size:12px;">' + qrT("wf_note") + '</p>' + priv + err("wifi") +
    '</div>' +
    '<div class="qr-tp" data-qrpanel="vcard" style="display:none;">' +
      '<div class="row">' + qtField("qt_vc_last", "vc_last", "Nguyễn Văn") + qtField("qt_vc_first", "vc_first", "An") + '</div>' +
      '<div class="row">' + qtField("qt_vc_org", "vc_org", "") + qtField("qt_vc_title", "vc_title", "") + '</div>' +
      '<div class="row">' + qtField("qt_vc_phone", "vc_phone", "0912 345 678", ' inputmode="tel"') + qtField("qt_vc_email", "vc_email", "ten@congty.vn", ' inputmode="email"') + '</div>' +
      qtField("qt_vc_web", "vc_web", "https://congty.vn") + qtField("qt_vc_addr", "vc_addr", "") +
      '<p class="hint" style="margin:6px 0 0;font-size:12px;">' + qrT("vc_note") + '</p>' + priv + err("vcard") +
    '</div>';
}

function qtVal(id){
  var el = document.getElementById(id);
  return el && el.value ? el.value : "";
}

// Đọc form của loại đang chọn -> chuỗi dữ liệu QR ("" nếu chưa hợp lệ) + hiện lỗi dưới khung nếu người dùng đã nhập gì đó.
function qrTypeBuildData(type){
  var res, filled;
  if (type === "vietqr") {
    res = qrBuildVietQr({ bin: qtVal("qt_vq_bank"), account: qtVal("qt_vq_acc"), amount: qtVal("qt_vq_amount"), content: qtVal("qt_vq_content") });
    filled = qtVal("qt_vq_bank") || qtVal("qt_vq_acc") || qtVal("qt_vq_amount") || qtVal("qt_vq_content");
  } else if (type === "zalo") {
    res = qrBuildZalo({ id: qtVal("qt_zl_id") });
    filled = qtVal("qt_zl_id");
  } else if (type === "wifi") {
    var hid = document.getElementById("qt_wf_hidden");
    res = qrBuildWifi({ ssid: qtVal("qt_wf_ssid"), password: qtVal("qt_wf_pass"), security: qtVal("qt_wf_sec"), hidden: !!(hid && hid.checked) });
    filled = qtVal("qt_wf_ssid") || qtVal("qt_wf_pass");
  } else if (type === "vcard") {
    res = qrBuildVcard({ last: qtVal("qt_vc_last"), first: qtVal("qt_vc_first"), org: qtVal("qt_vc_org"), title: qtVal("qt_vc_title"), phone: qtVal("qt_vc_phone"), email: qtVal("qt_vc_email"), web: qtVal("qt_vc_web"), addr: qtVal("qt_vc_addr") });
    filled = qtVal("qt_vc_last") || qtVal("qt_vc_first") || qtVal("qt_vc_org") || qtVal("qt_vc_phone") || qtVal("qt_vc_email");
  } else {
    return "";
  }
  var errEl = document.getElementById("qt_err_" + type);
  if (errEl) { errEl.textContent = (res.error && filled) ? qrT(res.error) : ""; }
  return res.data;
}

function qrTypeIsSpecial(type){
  return QR_TYPE_IDS.indexOf(type) !== -1;
}

function qrTypesBind(onChange){
  var els = document.querySelectorAll(".qr-tp input, .qr-tp select");
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener("input", onChange);
    els[i].addEventListener("change", onChange);
  }
}
`;

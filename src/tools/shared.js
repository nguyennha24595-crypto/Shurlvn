// Phần dùng chung cho các công cụ trình duyệt: escape HTML, JSON an toàn khi nhúng trong <script>, CSS nền.

export function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// JSON nhúng trong <script>: escape "<" (chặn "</script>") và 2 ký tự phân dòng Unicode.
export function safeJson(v) {
  return JSON.stringify(v).replace(/</g, "\\u003C").split(String.fromCharCode(8232)).join("\\u2028").split(String.fromCharCode(8233)).join("\\u2029");
}

// Icon SVG inline (nét Lucide, viền currentColor) — không cần file ảnh. Thêm icon: thêm 1 dòng vào ICON_PATHS.
const ICON_PATHS = {
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  align: '<line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'
};

export function icon(name, size) {
  const n = size || 16;
  return '<svg class="ct-ic" xmlns="http://www.w3.org/2000/svg" width="' + n + '" height="' + n + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICON_PATHS[name] || "") + "</svg>";
}

// Nội dung nút: icon + nhãn nằm trong <span class="ct-lbl"> để script client đổi chữ (vd "Đã sao chép") mà không mất icon.
export function btnLabel(iconName, text) {
  return icon(iconName) + '<span class="ct-lbl">' + esc(text) + "</span>";
}

// CSS chung (không kèm thẻ <style>): nút, ghi chú, hướng dẫn, FAQ, khung rộng hơn trang blog.
export const BASE_CSS = [
  ".wrap{max-width:900px;}",
  ".ct-box{margin:22px 0;}",
  ".ct-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px;}",
  ".ct-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:10px;padding:9px 16px;font-size:14px;font-weight:600;cursor:pointer;min-height:40px;font-family:inherit;}",
  ".ct-ic{flex:none;}",
  ".ct-lead{color:#6366f1;margin-right:8px;vertical-align:-3px;}",
  ".ct-btn:hover{border-color:#6366f1;color:#4f46e5;}",
  ".ct-btn.primary{background:#4f46e5;border-color:#4f46e5;color:#fff;}",
  ".ct-btn.primary:hover{background:#4338ca;color:#fff;}",
  ".ct-note{font-size:13px;color:#64748b;margin:10px 0 0;}",
  ".ct-sec h2{margin-top:34px;}",
  ".ct-faq details{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;margin:8px 0;}",
  ".ct-faq summary{cursor:pointer;font-weight:600;color:#0f172a;}",
  ".ct-faq p{margin:8px 0 0;}"
].join("\n");

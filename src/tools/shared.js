// Phần dùng chung cho các công cụ trình duyệt: escape HTML, JSON an toàn khi nhúng trong <script>, CSS nền.

export function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// JSON nhúng trong <script>: escape "<" (chặn "</script>") và 2 ký tự phân dòng Unicode.
export function safeJson(v) {
  return JSON.stringify(v).replace(/</g, "\\u003C").split(String.fromCharCode(8232)).join("\\u2028").split(String.fromCharCode(8233)).join("\\u2029");
}

// CSS chung (không kèm thẻ <style>): nút, ghi chú, hướng dẫn, FAQ, khung rộng hơn trang blog.
export const BASE_CSS = [
  ".wrap{max-width:900px;}",
  ".ct-box{margin:22px 0;}",
  ".ct-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px;}",
  ".ct-btn{border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:10px;padding:9px 16px;font-size:14px;font-weight:600;cursor:pointer;min-height:40px;font-family:inherit;}",
  ".ct-btn:hover{border-color:#6366f1;color:#4f46e5;}",
  ".ct-btn.primary{background:#4f46e5;border-color:#4f46e5;color:#fff;}",
  ".ct-btn.primary:hover{background:#4338ca;color:#fff;}",
  ".ct-note{font-size:13px;color:#64748b;margin:10px 0 0;}",
  ".ct-sec h2{margin-top:34px;}",
  ".ct-faq details{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;margin:8px 0;}",
  ".ct-faq summary{cursor:pointer;font-weight:600;color:#0f172a;}",
  ".ct-faq p{margin:8px 0 0;}"
].join("\n");

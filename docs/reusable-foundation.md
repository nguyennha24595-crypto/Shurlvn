# SHURL — Reusable Foundation Reference

Tài liệu này liệt kê những phần hạ tầng SaaS tổng quát (không liên quan tới nghiệp vụ rút gọn link/QR) đã xây trong SHURL, để tái sử dụng khi bắt đầu một dự án Cloudflare Worker mới (ví dụ: web tử vi/lá số). Dùng làm checklist tham khảo khi thiết kế + khi bootstrap code cho dự án mới — có thể copy nguyên file này vào repo mới hoặc dán vào phiên Claude Code mới khi bắt đầu.

Mọi đường dẫn file bên dưới là tương đối so với repo SHURL (`C:\Users\Administrator\Downloads\code\short`), sau khi đã tách thành `src/` (module hoá).

---

## 1. Auth & accounts

- **Đăng ký**: `src/handlers/auth.js` `handleRegister(request, env, corsHeaders)`
  - Validate `username` (8-25 ký tự), `password` (≥9 ký tự, ≥1 chữ hoa).
  - `salt = randomHex(16)`, `hash = hashPassword(password, salt)`, lưu KV `user:<username-lowercase>`.
  - Bắn thông báo "welcome" (xem mục 4) và tự động đăng nhập luôn sau khi đăng ký.
- **Đăng nhập/session cookie**: `handleLogin` (cùng file)
  - Chặn brute-force theo username: KV `login_attempts:<username>`, giới hạn `LOGIN_MAX_ATTEMPTS=10` (`src/config/constants.js`), khoá `LOGIN_LOCKOUT_TTL=900`s. Có thêm bộ đếm toàn cục theo ngày `failedlogin_count:<YYYY-MM-DD>` để admin theo dõi.
  - Thành công: `sessionToken = randomHex(32)`; KV `session:<token>` → username, TTL 30 ngày (`SESSION_TTL`).
  - Cookie set qua `src/utils/http.js` `setSessionCookieHeader(token, maxAgeSeconds)` → `HttpOnly; SameSite=Lax; Secure`, tên cookie `SESSION_COOKIE = "shurl_session"`. Xoá qua `clearSessionCookieHeader()`.
- **Hash mật khẩu**: `src/utils/crypto.js` `hashPassword(password, saltHex)` — PBKDF2-SHA256, 100,000 vòng lặp, output 256-bit, dùng WebCrypto `crypto.subtle` (không cần thư viện ngoài).
- **Thứ tự xác thực trong `getAuthenticatedUser`** (`src/utils/auth.js`):
  1. Session cookie → KV `session:<token>` → username → `getUser()`. Trả `null` nếu `user.banned`.
  2. Không có cookie thì thử header `Authorization: Bearer <token>` hoặc `x-api-key` → KV `apitoken:<token>` → username. Tự hạ role về `"free"` nếu gói trả phí đã hết hạn ngay tại đây.
  - Helper chặn quyền: `requireAuthResponse`/`requireAdminResponse` (401/403 JSON, có i18n qua `st()`).
- **API token**: `handleGenerateToken`/`handleGenerateExtensionToken` — token dạng `shurl_<role>_<hex18>` / `shurlext_<hex18>`, lưu 2 chiều (KV `apitoken:<token>` → username, và field trên user record).
- **2FA/TOTP** (áp dụng cho admin nhưng cơ chế dùng lại được cho mọi role):
  - `generateTotpSecret()` — 20 byte ngẫu nhiên, encode base32.
  - `generateTotpCode(secret)` — tự cài thuật toán TOTP (RFC 6238): bước 30s, HMAC-SHA1 qua WebCrypto, không cần thư viện ngoài.
  - `getOtpAuthUrl(secret, username, domain)` — build URI `otpauth://totp/...`, client render QR qua API công khai `api.qrserver.com`.
  - Luồng: `handleSetup2fa` lưu secret tạm ở KV `totp_pending:<username>` (TTL 300s) → user quét QR → `handleVerify2fa` xác nhận rồi lưu vĩnh viễn `user.totpSecret` + `user.totpEnabled=true` → `handleDisable2fa` xoá 2 field.
- **Quên/đặt lại mật khẩu**: `handleForgotPassword`/`handleResetPassword`
  - Mã 6 số qua `randomSixDigitCode()`, lưu KV `pw_reset:<username>` = `{code, attempts}`, TTL 900s.
  - Giới hạn tối đa 5 lần nhập sai trước khi mã bị vô hiệu (429).
  - Gửi mail qua `sendResetEmail` (xem mục 4).

## 2. Google OAuth

- Handler: `handleGoogleAuthStart` / `handleGoogleAuthCallback` (`src/handlers/auth.js`).
- **Cần khai báo** (Worker secrets, KHÔNG để trong `wrangler.jsonc`): `env.GOOGLE_CLIENT_ID`, `env.GOOGLE_CLIENT_SECRET` (set qua `wrangler secret put`). Redirect URI đăng ký trên Google Cloud Console phải khớp CHÍNH XÁC `<origin>/api/auth/google/callback` cho từng domain deploy (cả `*.workers.dev` lẫn domain thật nếu test cả hai).
- **Scope xin quyền**: `openid email profile`.
- **Chống CSRF bằng state-cookie**:
  - Cookie tên `OAUTH_STATE_COOKIE = "shurl_oauth_state"`.
  - Bước start: tạo `state = randomHex(16)`, redirect sang URL authorize của Google kèm `state`, đồng thời set cookie state `HttpOnly; SameSite=Lax; Secure; Max-Age=600`.
  - Bước callback: so khớp `state` trên query param với cookie — không khớp hoặc thiếu 1 trong 2 thì từ chối (redirect về login kèm lỗi). Luôn xoá cookie state sau khi xử lý xong (dù thành công hay thất bại).
- **Logic liên kết tài khoản đáng học lại**: KHÔNG tự gộp tài khoản Google mới vào tài khoản local có cùng email (cố ý, để tránh kẻ xấu chiếm tài khoản bằng cách đăng ký trước email nạn nhân). Thay vào đó tạo tài khoản mới với username sinh tự động từ phần trước `@` của email, và map `googleid:<google-sub>` → username để lần sau nhận diện lại đúng user.
- Đổi code lấy token: POST `https://oauth2.googleapis.com/token` với `code/client_id/client_secret/redirect_uri/grant_type=authorization_code`; lấy profile từ `https://www.googleapis.com/oauth2/v3/userinfo`. Yêu cầu `profile.email_verified !== false`.

## 3. Trang pháp lý (điều khoản/chính sách bảo mật)

- **Định tuyến**: hoàn toàn phía client, bên trong script SPA nhúng trong `src/views/appHtml.js`. Router xử lý `route === "terms"` / `route === "privacy"` → gọi `renderTerms(app)` / `renderPrivacy(app)`, mỗi hàm build mảng section `{h, p}` (song ngữ vi/en tuỳ `currentLang`) rồi đưa vào layout dùng chung `renderLegalPage(app, title, subtitle, sections)`. Không cần route server riêng — nội dung nằm sẵn trong bundle SPA, phục vụ qua cùng 1 trang index.html, điều hướng bằng hash (`#/terms`).
- **Pattern "modal cam kết điều khoản lần đầu"** (dùng cho QR động, có thể tái dùng cho bất kỳ tính năng nào cần chặn bằng 1 lần đồng ý rõ ràng):
  - Chặn ở server: trong handler tạo/sửa (`src/handlers/qr.js` `handleCreateDynamicQr`) — trước khi cho phép hành động, kiểm tra `if (!userRecord.qrTermsAcceptedAt) return 403 {error, code:"QR_TERMS_NOT_ACCEPTED"}`.
  - Endpoint đồng ý: `handleAcceptQrDynamicTerms` — chỉ cần đã đăng nhập; set `user.qrTermsAcceptedAt = new Date().toISOString()` một lần (idempotent, không ghi đè nếu đã có) rồi lưu.
  - Client: trước khi thực hiện hành động, kiểm tra `if (!state.user.qrTermsAcceptedAt) { showTermsModal(callbackToRetryAction); return; }`. Modal hiện danh sách quy tắc đánh số + link `#/terms` + 2 nút "Để sau"/"Đồng ý"; bấm đồng ý thì gọi endpoint accept, lưu timestamp trả về vào state, rồi tự gọi lại hành động ban đầu.
  - **Điểm cốt lõi để tái dùng**: cổng chặn = 1 field timestamp ISO trên user record (`<feature>TermsAcceptedAt`), LUÔN kiểm tra ở server (không thể bypass từ client), set 1 lần qua 1 endpoint POST nhỏ riêng, client bắt lỗi "chưa đồng ý" để hiện modal rồi tự động thử lại hành động sau khi đồng ý.

## 4. Thông báo & email

- **`src/utils/email.js`**
  - `sendEmail(env, {to, subject, html})` — POST tới `https://api.resend.com/emails`, header `Authorization: Bearer ${env.RESEND_API_KEY}` (Worker secret, set qua `wrangler secret put RESEND_API_KEY`). `from` hard-code `"SHURL <noreply@shurlvn.com>"` — **domain gửi phải verify trên Resend (bản ghi DNS SPF/DKIM) trước khi gửi được** — dự án mới cần domain riêng đã verify + địa chỉ `from` riêng.
  - `notifyUser(env, opts)` — ghi 1 thông báo in-app vào KV `notif:user:<username-lowercase>:<notifId>` (`notifId = "notif_" + Date.now() + "_" + randomHex(4)`), kèm gửi email nếu `opts.sendEmailToo && opts.emailSubject && opts.emailHtml`.
  - `notifyAllAdmins(env, opts)` — lặp qua `listAllUsers`, gọi `notifyUser` cho mọi user `role === "admin"`.
- **`src/views/emailTemplates.js` `buildEmailShell(opts)`** — khung email HTML dùng chung, tái sử dụng được ngay.
  - Nhận `{lang, illustration, title, introHtml, code, detailRows, afterHtml, ctaText, ctaUrl, warningHtml, footerReason}`.
  - **Ràng buộc tương thích Gmail (đã xác nhận qua email thật, ghi rõ trong comment source)**: KHÔNG dùng `<svg>` — minh hoạ là `<img>` PNG thật host ở route tĩnh (`/email-assets/<key>.png`), vì Gmail/Outlook không render SVG dưới bất kỳ hình thức nào. Chỉ dùng tối đa 2 `<table>` lồng nhau (bảng ngoài full-width + bảng card max-width:580px) — mọi bố cục khác dùng `<div>` + inline style, không lồng thêm bảng, để tránh Gmail tự thu gọn email thành "..." (Nội dung mở rộng).
  - Toàn bộ style là inline (`style="..."` trên từng thẻ), font `Arial,Helvetica,'Segoe UI',sans-serif` — vì client email strip `<style>`/CSS ngoài.
  - Footer tự thêm dòng lý do nhận mail, link mailto hỗ trợ, link `#/terms`/`#/privacy`.
- **`src/i18n/notifications.js`**
  - `NOTIFICATION_TEMPLATES` — key theo tên sự kiện (`welcome`, `payment_success`, `security_alert`, `payment_revoked`), mỗi key có bản dịch 8 ngôn ngữ (`vi/en/ko/zh/hi/ja/fr/es`) dạng `{title, message, emailSubject, emailIntro, emailCta}`; token `{placeholder}` điền qua `fillTemplate(s, params)` (regex `{key}` đơn giản).
  - `EMAIL_LABELS` — chuỗi UI dùng chung cho khung email theo ngôn ngữ (tagline, nhãn link điều khoản/bảo mật, dòng "cần hỗ trợ").
  - `NOTIF_EMAIL_META` — metadata theo từng template: key ảnh minh hoạ dùng, chuỗi lý do nhận mail theo ngôn ngữ.
  - `renderNotificationTemplate(key, lang, params)` — ghép tất cả lại: tra template, điền placeholder, build `detailRows`, gọi `buildEmailShell`, trả `{title, message, emailSubject, emailHtml}` sẵn sàng đưa thẳng vào `notifyUser`.

## 5. Trang quản trị (admin)

`src/handlers/admin.js` — mọi endpoint theo cùng 1 khuôn: `getAuthenticatedUser` → 401 nếu chưa đăng nhập → `role !== "admin"` → 403 → xử lý → thường gọi `addAuditLog`. Nhóm theo chức năng:

- **Quản lý user**: `handleAdminListUsers`, `handleAdminSearchUsers` (tìm theo username/email/role/trạng thái ban), `handleAdminSetRole` (validate theo `TIER_CONFIG`), `handleAdminBanUser` (thu hồi luôn mọi session + API token), `handleAdminDeleteUser` (xoá theo tầng: link sở hữu → mọi session → API token → mọi thông báo → user record).
- **Báo cáo/góp ý (hộp thư hỗ trợ)**: `handleAdminListReports`/`handleAdminDismissReport`; `handleAdminListFeedback`/`handleAdminReplyFeedback`/`handleAdminUpdateFeedbackStatus`/`handleAdminDeleteFeedback`/`handleAdminTranslateFeedback` (dùng Google Translate/MyMemory API miễn phí, không cần key).
- **Audit log**: `handleAdminListAuditLogs` (bọc `listAuditLogs`, xem bên dưới).
- **Blacklist**: `handleGetBlacklist`/`handleAddBlacklist`/`handleRemoveBlacklist` (domain + từ khoá, lưu qua `src/kv/blacklist.js`, key `blacklist`).
- **Bật/tắt bảo trì**: xem mục 6.
- **Gửi thông báo hàng loạt**: `handleAdminBroadcastNotification` — nhắm 1 user hoặc toàn bộ user không phải admin; build email qua `buildAdminBroadcastEmailHtml` (bọc `buildEmailShell`); `handleAdminListNotifications`/`handleAdminDeleteNotification` để quản lý thông báo đã gửi.
- **CMS blog**: `handleAdminListBlogPosts`/`handleAdminGetBlogPost`/`handleAdminSaveBlogPost`/`handleAdminDeleteBlogPost` — bài viết lưu KV `blog:<slug>`, slug validate `^[a-z0-9-]+$`, ngày validate `^\d{4}-\d{2}-\d{2}$`.
- **Cài đặt hệ thống**: `handleAdminGetSettings`/`handleAdminSaveSettings` — 1 khối JSON duy nhất ở KV `sys:settings` (SHURL dùng cho `tierOverrides`; dự án khác có thể lưu bất kỳ config admin muốn chỉnh theo cùng cách này).
- **Dashboard tổng quan**: `handleAdminOverview` — tổng hợp user đang hoạt động (scan KV `lastseen:*`, cửa sổ 15 phút), tăng trưởng user 30 ngày, thanh toán, cache phân tích Cloudflare (KV `cf_analytics_cache`), số báo cáo đang chờ.
- **Áp voucher**: `handleAdminApplyVoucher` — pattern chung cho mã quyền lợi admin cấp tay (`voucher:<CODE>` = `{active, expiresAt, maxUses, usedCount, tier}`), đánh dấu đã dùng theo user ở `voucher:<CODE>:used:<username>`.

**`src/kv/audit.js` `addAuditLog(env, adminUser, action, details, request)`** — pattern audit log append-only có giới hạn:
- Mỗi entry lưu key riêng `audit_<Date.now()>_<randomHex(4)>` → `{id, admin, action, details, ip, timestamp}`.
- 1 danh sách index riêng ở KV `audit_index` (mảng JSON các id, mới nhất trước, `unshift`), giới hạn 500 entry gần nhất qua `.slice(0, 500)` mỗi lần ghi.
- Đọc (`listAuditLogs(env, limit)`) lấy index, cắt theo `limit`, rồi `Promise.all` lấy từng entry — tránh phải `list()` quét toàn bộ KV mỗi lần đọc.

## 6. Chế độ bảo trì (maintenance mode)

`src/utils/maintenance.js` — bật/tắt bảo trì theo từng tính năng, lưu KV:
- `isMaintenance(env, feature)` đọc KV `maintenance:<feature>` → `{active, note, setAt, setBy}` hoặc `null`.
- `handleSetMaintenance` (chỉ admin) — `active:true` → ghi `maintenance:<feature>`; `active:false` → xoá key (không có key = không bảo trì, khỏi cần record mặc định cho từng feature).
- `checkMaintenance(env, feature, corsHeaders, request)` — hàm chặn gọi ngay đầu handler: trả về response 503 (đã i18n) nếu đang bảo trì, hoặc `null` (nghĩa là "cho qua"). Cách dùng: `const m = await checkMaintenance(env, "ten_tinh_nang", corsHeaders, request); if (m) return m;`.
- `handleGetMaintenance` (admin, trạng thái đầy đủ theo danh sách feature cố định) và `handleGetMaintenanceStatus` (public, tập con feature dùng để client tắt sẵn UI) đều lặp qua mảng tên feature cố định và điền mặc định cho feature chưa set.
- Mỗi lần bật/tắt đều ghi audit log (`MAINTENANCE_TOGGLE`).

## 7. Giao diện: icon/theming

- **Icon helper**: `src/views/appHtml.js`, hàm `li(icon, size)` (tên không liên quan "list item" — đây là hàm render SVG icon, gọi khắp script client, ví dụ `li('shield', 14)`).
  - Cấu trúc: `size` mặc định 16; 1 chuỗi style stroke dùng chung `p = 'fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round'`; object `icons` map tên icon → nội dung `<path>/<circle>/<line>/...` SVG thô (phong cách Lucide icons, path data chép tay, ~60+ icon).
  - Hàm tra `icons[icon]`, bọc trong `<svg viewBox="0 0 24 24" width={size} height={size} style="{p}">...</svg>`, trả về chuỗi SVG inline (dùng trực tiếp như HTML qua nối chuỗi, không qua React/DOM API).
  - Thêm icon mới = thêm 1 dòng `key: '<path .../>'` vào object `icons`; không cần build step hay file asset. Copy được thẳng sang dự án mới (chọn lọc bộ icon cần).
- **Theming (sáng/tối)**: attribute `data-theme` trên `<html>` + `localStorage`.
  - Khởi tạo trước khi vẽ trang qua `<script>` inline trong `<head>`: đọc `localStorage.getItem("shurl_theme")`, set `document.documentElement.setAttribute("data-theme", t==="dark"?"dark":"light")` (mặc định sáng, bọc try/catch cho trình duyệt chặn localStorage).
  - CSS dùng `[data-theme="light"] { --bien-mau: ...; }` (và tương tự cho dark) để đổi bộ biến màu.
  - `toggleTheme()` đổi attribute, lưu `localStorage.setItem("shurl_theme", newTheme)`, vẽ lại icon mặt trời/mặt trăng.
  - Pattern rất dễ mang sang: 1 key localStorage + 1 attribute gốc + biến CSS theo attribute selector.

## 8. Cấu trúc i18n

- **Server-side**: `src/i18n/server.js`
  - `getServerLang(request)` — đọc header `Accept-Language`, so khớp danh sách cố định (`en, ko, zh, ja, fr, es, hi`), mặc định `"vi"`.
  - `st(key, request)` — tra `SERVER_I18N[lang][key]`, fallback `SERVER_I18N.vi[key]`, fallback chính key đó (an toàn khi thiếu bản dịch).
  - `SERVER_I18N` — object phẳng `key: "chuỗi"` theo từng ngôn ngữ (dùng cho message lỗi/JSON phía server). Các ngôn ngữ ngoài vi/en chỉ có tập con (ví dụ phần email voucher) — server-side i18n cố tình không phủ hết, phần lớn chuỗi UI nằm ở client.
- **Client-side**: nằm trong `<script>` nhúng của `src/views/appHtml.js`.
  - `var i18n = { vi: {...}, en: {...}, ... }` — 1 object lớn theo từng ngôn ngữ, mỗi cái là map phẳng `key: "chuỗi"` (cùng 8 ngôn ngữ như server). Ví dụ key: `home:"Trang chủ"`, `login_sub:"Chào mừng quay lại SHURL."`.
  - Hàm tra `t(key)`: `var lang = i18n[currentLang] || i18n.vi; return lang[key] || i18n.vi[key] || key;` — cùng kiểu fallback 3 tầng như `st()` server. `currentLang` là biến global client, lấy từ preference đã lưu/ngôn ngữ trình duyệt.
  - Component gọi `t("ten_key")` ngay trong lúc build chuỗi HTML.

## 9. Quy ước tên key KV

| Prefix | Ý nghĩa |
|---|---|
| `user:<username>` | bản ghi user (JSON) |
| `session:<token>` | session token → username |
| `apitoken:<token>` | API token → username |
| `googleid:<sub>` | Google OAuth subject → username |
| `login_attempts:<username>` | đếm khoá brute-force (có TTL) |
| `failedlogin_count:<date>` | đếm đăng nhập sai toàn cục theo ngày |
| `pw_reset:<username>` | mã reset mật khẩu + số lần thử (TTL) |
| `totp_pending:<username>` | secret TOTP chưa xác nhận (TTL) |
| `lastseen:<username>` | thời điểm hoạt động gần nhất (TTL, dùng cho thống kê "đang hoạt động") |
| `notif:user:<username>:<notifId>` | 1 thông báo in-app |
| `audit_<id>` + index `audit_index` | audit log append-only có giới hạn (mục 5) |
| `maintenance:<feature>` | trạng thái bảo trì theo tính năng |
| `sys:settings` | 1 khối JSON cài đặt admin có thể chỉnh |
| `blacklist` | 1 khối JSON `{domains, keywords}` |
| `blog:<slug>` | bài viết CMS |
| `feedback:<id>` | góp ý/ticket hỗ trợ |
| `voucher:<CODE>` / `voucher:<CODE>:used:<username>` | mã quyền lợi + đánh dấu đã dùng theo user |
| `link:` / `clicks:` / `qr:` / `qrpay:` / `payment:` / `report:` / `team:` / `webhooks:` | dữ liệu nghiệp vụ riêng của SHURL (rút gọn link) — không tái dùng nội dung, nhưng CÁCH đặt tên (`<entity>:<id>`, giá trị JSON, TTL cho state tạm thời) thì nên giữ |

Quy ước chung nên mang sang: danh từ số ít viết thường + dấu `:` + id (thường là username hoặc hex/timestamp ngẫu nhiên), giá trị luôn `JSON.stringify`, dùng `expirationTtl` cho bất kỳ thứ gì có giới hạn thời gian (session, khoá đăng nhập, mã reset, TOTP tạm, presence), và dùng "danh sách index" (như `audit_index`) khi cần truy cập có thứ tự/phân trang trên 1 namespace mà KV chỉ hỗ trợ liệt kê theo prefix.

## 10. Quy ước `wrangler.jsonc`

```jsonc
{
  "name": "shorturl",
  "main": "src/index.js",
  "compatibility_date": "2026-09-01",
  "kv_namespaces": [{ "binding": "LINKS_KV", "id": "c9b55fe1b2574330923003a5d68f4591" }],
  "ai": { "binding": "AI" },
  "triggers": { "crons": ["0 * * * *"] },
  "vars": { "CF_ACCOUNT_ID": "...", "GOOGLE_ADS_ID": "...", "GOOGLE_ADS_CONVERSION_LABEL": "..." }
}
```
- Chỉ 1 KV namespace (`LINKS_KV`) cho toàn bộ app — dự án mới cần tạo namespace riêng (`wrangler kv namespace create <TEN>`) với `id` mới.
- Binding `ai` (Cloudflare Workers AI) dùng cho tính năng "Hỏi AI" trong app — tuỳ chọn, chỉ thêm nếu dự án mới cũng muốn có chat AI.
- `triggers.crons` — cron theo giờ (`src/cron.js`) — hữu ích nếu dự án mới cần dọn dẹp định kỳ/gửi email tổng hợp/refresh cache theo lịch.
- `vars` chỉ chứa giá trị KHÔNG bí mật (analytics ID). **Secret** (`RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) cố tình không có trong file này — phải set bằng `wrangler secret put <TEN>` riêng theo môi trường, và trong code chỉ truy cập qua `env.<TEN>`.
- Dự án mới nên theo đúng khuôn này: `name` riêng, KV namespace riêng, `ai` binding chỉ khi cần, cron riêng, `vars` không bí mật riêng — và tuyệt đối không commit secret vào `wrangler.jsonc`.

---

## Cách dùng tài liệu này

1. Đi tham khảo nội dung/giao diện cho web tử vi (nội dung lá số, phong cách UI) — tài liệu này không liên quan phần đó, chỉ là hạ tầng.
2. Khi bắt đầu dự án mới: tạo thư mục/repo riêng, copy file này vào đó (ví dụ `docs/reusable-foundation.md`), mở phiên Claude Code mới ở thư mục đó và trỏ vào file này khi cần dựng lại 1 phần hạ tầng (auth, email, admin...).
3. Không copy nguyên code SHURL — mỗi phần trên chỉ nên dùng làm THAM KHẢO CƠ CHẾ, viết lại code mới cho sạch, đúng nhu cầu dự án tử vi (ví dụ: không cần phần voucher/QR/link nếu không liên quan).

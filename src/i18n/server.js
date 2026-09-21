// Server-side i18n: language detection and string lookup for server-rendered text.

export function getServerLang(request) {
  const acceptLang = (request.headers.get("Accept-Language") || "vi").toLowerCase();
  if (acceptLang.startsWith("en")) return "en";
  if (acceptLang.startsWith("ko")) return "ko";
  if (acceptLang.startsWith("zh")) return "zh";
  if (acceptLang.startsWith("ja")) return "ja";
  if (acceptLang.startsWith("fr")) return "fr";
  if (acceptLang.startsWith("es")) return "es";
  if (acceptLang.startsWith("hi")) return "hi";
  return "vi";
}

export function st(key, request) {
  const lang = getServerLang(request);
  return (SERVER_I18N[lang] && SERVER_I18N[lang][key]) || SERVER_I18N.vi[key] || key;
}

export var SERVER_I18N = {
  vi: { 
    brand:"SHURL", subject:"Voucher SHURL — Mã kích hoạt gói", thanks_1:"Cảm ơn bạn đã sử dụng gói", thanks_2:"của", instruction:"Hãy copy voucher này và dán vào ô nhập voucher ở phần tài khoản để kích hoạt:", activate_note:"Gói voucher", activate_note_2:"được kích hoạt ngay sau khi nhập mã.", warning:"Vui lòng không share mã voucher ra ngoài tránh trường hợp mất.", closing:"Xin cảm ơn bạn đã đóng góp cho nền tảng này phát triển.", signature:"Trân trọng,",
    require_auth:"Vui lòng đăng nhập để thực hiện thao tác này.", require_admin:"Yêu cầu quyền Quản trị viên (Admin).", enter_user_pass:"Vui lòng nhập tên đăng nhập và mật khẩu.", username_length:"Tên đăng nhập phải từ 8-25 ký tự.", password_policy:"Mật khẩu tối thiểu 9 ký tự và có ít nhất 1 chữ viết hoa.", username_exists:"Tên đăng nhập đã tồn tại trong hệ thống.", enter_user_pass_full:"Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", wrong_credentials:"Sai tên đăng nhập hoặc mật khẩu.", not_logged_in:"Chưa đăng nhập.", user_not_found:"Không tìm thấy tài khoản.", api_pro_only:"Tính năng API chỉ mở cho gói PRO hoặc SUPER.",
    maintenance_global:"Hệ thống đang bảo trì. Vui lòng quay lại sau.", maintenance_feature_prefix:"Tính năng đang bảo trì",
    account_locked:"Tài khoản đã bị khóa. Vui lòng liên hệ admin.", totp_wrong:"Mã TOTP không đúng.", login_too_many_attempts:"Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau 15 phút.", google_not_configured:"Đăng nhập Google chưa được cấu hình.",
    url_required:"URL không được để trống.",
    pw_page_title:"Link được bảo vệ", pw_page_prompt:"Nhập mật khẩu để tiếp tục", pw_page_placeholder:"Mật khẩu", pw_page_btn:"Vào link →", pw_page_wrong:"Mật khẩu không đúng",
    link_expired_title:"Link hết hạn", link_expired_desc:"Link này đã hết hạn sử dụng.",
    link_disabled_title:"Link đã tắt", link_disabled_desc:"Link này đã bị vô hiệu hoá.",
    team_requires_super:"Team yêu cầu gói Super", team_not_found:"Team không tồn tại", team_only_owner_delete:"Chỉ owner mới xóa được team", team_only_owner_edit:"Chỉ owner mới sửa được team", team_only_owner_add_member:"Chỉ owner mới thêm thành viên", team_only_owner_remove_member:"Chỉ owner mới xóa thành viên", team_deleted:"Team đã xóa", team_name_required:"Tên team là bắt buộc", team_missing_id_or_username:"Thiếu teamId hoặc username", team_max_members:"Tối đa {count} thành viên", team_user_not_found:"User không tồn tại", team_user_in_other_team:"User đã ở trong team khác", team_already_member:"Đã là thành viên", team_member_not_found:"Thành viên không tồn tại", team_cannot_remove_owner:"Không thể xóa owner",
    pricing_downgrade_blocked:"Bạn đang ở gói {tier}, không thể mua gói thấp hơn", invalid_tier:"Gói không hợp lệ", invalid_period:"Thời gian không hợp lệ",
  },
  en: { brand:"SHURL", subject:"SHURL Voucher — Plan activation code", thanks_1:"Thank you for using the", thanks_2:"plan of", instruction:"Copy this voucher and paste it into the voucher field in your account to activate:", activate_note:"Voucher plan", activate_note_2:"is activated immediately after entering the code.", warning:"Please do not share this voucher code to avoid losing it.", closing:"Thank you for supporting the growth of this platform.", signature:"Best regards,",
    require_auth:"Please log in to perform this action.", require_admin:"Administrator access required.", enter_user_pass:"Please enter your username and password.", username_length:"Username must be 8-25 characters.", password_policy:"Password must be at least 9 characters with at least 1 uppercase letter.", username_exists:"This username already exists.", enter_user_pass_full:"Please enter both username and password.", wrong_credentials:"Wrong username or password.", not_logged_in:"Not logged in.", user_not_found:"Account not found.", api_pro_only:"API access is only available on the PRO or SUPER plan.",
    maintenance_global:"The system is under maintenance. Please check back later.", maintenance_feature_prefix:"This feature is under maintenance",
    account_locked:"This account has been locked. Please contact an admin.", totp_wrong:"Incorrect TOTP code.", login_too_many_attempts:"Too many failed login attempts. Please try again in 15 minutes.", google_not_configured:"Google sign-in isn't configured yet.",
    url_required:"URL is required.",
    pw_page_title:"Protected link", pw_page_prompt:"Enter the password to continue", pw_page_placeholder:"Password", pw_page_btn:"Continue →", pw_page_wrong:"Incorrect password",
    link_expired_title:"Link expired", link_expired_desc:"This link has expired.",
    link_disabled_title:"Link disabled", link_disabled_desc:"This link has been disabled.",
    team_requires_super:"Team requires the Super plan", team_not_found:"Team not found", team_only_owner_delete:"Only the owner can delete the team", team_only_owner_edit:"Only the owner can edit the team", team_only_owner_add_member:"Only the owner can add members", team_only_owner_remove_member:"Only the owner can remove members", team_deleted:"Team deleted", team_name_required:"Team name is required", team_missing_id_or_username:"Missing teamId or username", team_max_members:"Maximum {count} members", team_user_not_found:"User not found", team_user_in_other_team:"User is already in another team", team_already_member:"Already a member", team_member_not_found:"Member not found", team_cannot_remove_owner:"Cannot remove the owner",
    pricing_downgrade_blocked:"You're currently on the {tier} plan and can't switch to a lower one", invalid_tier:"Invalid plan", invalid_period:"Invalid period",
  },
  ko: { brand:"SHURL", subject:"SHURL 바우처 — 플랜 활성화 코드", thanks_1:"사용해 주셔서 감사합니다", thanks_2:"플랜", instruction:"이 바우처를 복사하여 계정의 바우처 입력란에 붙여넣어 활성화하세요:", activate_note:"바우처 플랜", activate_note_2:"은 코드 입력 즉시 활성화됩니다.", warning:"바우처 코드를 외부에 공유하지 마세요.", closing:"플랫폼 성장을 위해 기여해 주셔서 감사합니다.", signature:"감사합니다," },
  zh: { brand:"SHURL", subject:"SHURL 优惠券 — 套餐激活码", thanks_1:"感谢您使用", thanks_2:"的", instruction:"请复制此优惠券并粘贴到账户中的优惠券输入框以激活：", activate_note:"优惠券套餐", activate_note_2:"在输入代码后立即激活。", warning:"请勿将优惠券代码分享给他人，以免丢失。", closing:"感谢您为平台发展做出贡献。", signature:"此致，" },
  hi: { brand:"SHURL", subject:"SHURL वाउचर — प्लान सक्रियण कोड", thanks_1:"का उपयोग करने के लिए धन्यवाद", thanks_2:"प्लान", instruction:"इस वाउचर को कॉपी करें और अपने खाते के वाउचर फ़ील्ड में पेस्ट करें:", activate_note:"वाउचर प्लान", activate_note_2:"कोड दर्ज करने के तुरंत बाद सक्रिय हो जाता है।", warning:"वाउचर कोड किसी के साथ शेयर न करें।", closing:"इस प्लेटफॉर्म के विकास में योगदान के लिए धन्यवाद।", signature:"सादर," },
  ja: { brand:"SHURL", subject:"SHURL バウチャー — プラン有効化コード", thanks_1:"をご利用いただきありがとうございます", thanks_2:"プラン", instruction:"このバウチャーをコピーしてアカウントのバウチャー入力欄に貼り付けて有効化してください：", activate_note:"バウチャープラン", activate_note_2:"はコード入力後すぐに有効化されます。", warning:"バウチャーコードを外部に共有しないでください。", closing:"このプラットフォームの成長にご貢献いただきありがとうございます。", signature:"敬具、" },
  fr: { brand:"SHURL", subject:"Bon SHURL — Code d'activation du plan", thanks_1:"Merci d'utiliser le plan", thanks_2:"de", instruction:"Copiez ce bon et collez-le dans le champ bon de votre compte pour activer :", activate_note:"Le plan du bon", activate_note_2:"est activé immédiatement après la saisie du code.", warning:"Veuillez ne pas partager ce code de bon pour éviter de le perdre.", closing:"Merci de contribuer à la croissance de cette plateforme.", signature:"Cordialement," },
  es: { brand:"SHURL", subject:"Cupón SHURL — Código de activación del plan", thanks_1:"Gracias por usar el plan", thanks_2:"de", instruction:"Copia este cupón y pégalo en el campo de cupón de tu cuenta para activar:", activate_note:"El plan del cupón", activate_note_2:"se activa inmediatamente después de ingresar el código.", warning:"Por favor no compartas el código del cupón para evitar perderlo.", closing:"Gracias por contribuir al crecimiento de esta plataforma.", signature:"Atentamente," }
};

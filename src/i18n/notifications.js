// Multi-language notification/email templates and rendering helpers.

export var EMAIL_LABELS = {
  vi: { tagline:"Nền tảng rút gọn link đa tầng", terms:"Điều khoản sử dụng", privacy:"Chính sách bảo mật", account:"Tài khoản", plan:"Gói", reasonGeneric:"Bạn nhận được email này vì đây là thông báo liên quan tới tài khoản SHURL của bạn.", support:"Cần hỗ trợ? Liên hệ" },
  en: { tagline:"The multi-tier link shortening platform", terms:"Terms of Service", privacy:"Privacy Policy", account:"Account", plan:"Plan", reasonGeneric:"You're receiving this email because it relates to your SHURL account.", support:"Need help? Contact" },
  ko: { tagline:"다단계 링크 단축 플랫폼", terms:"이용약관", privacy:"개인정보 처리방침", account:"계정", plan:"플랜", reasonGeneric:"이 이메일은 회원님의 SHURL 계정과 관련된 알림이기 때문에 발송되었습니다.", support:"도움이 필요하신가요? 문의:" },
  zh: { tagline:"多层级链接缩短平台", terms:"服务条款", privacy:"隐私政策", account:"账户", plan:"套餐", reasonGeneric:"您收到此邮件是因为它与您的 SHURL 账户相关。", support:"需要帮助？联系" },
  hi: { tagline:"मल्टी-टियर लिंक शॉर्टनिंग प्लेटफ़ॉर्म", terms:"सेवा की शर्तें", privacy:"गोपनीयता नीति", account:"खाता", plan:"प्लान", reasonGeneric:"आपको यह ईमेल इसलिए मिला है क्योंकि यह आपके SHURL खाते से संबंधित है।", support:"मदद चाहिए? संपर्क करें" },
  ja: { tagline:"マルチティア・リンク短縮プラットフォーム", terms:"利用規約", privacy:"プライバシーポリシー", account:"アカウント", plan:"プラン", reasonGeneric:"このメールはお客様のSHURLアカウントに関連する通知のため送信されています。", support:"サポートが必要ですか？連絡先:" },
  fr: { tagline:"La plateforme de raccourcissement de liens multi-niveaux", terms:"Conditions d'utilisation", privacy:"Politique de confidentialité", account:"Compte", plan:"Forfait", reasonGeneric:"Vous recevez cet e-mail car il concerne votre compte SHURL.", support:"Besoin d'aide ? Contactez" },
  es: { tagline:"La plataforma de acortamiento de enlaces multinivel", terms:"Términos de servicio", privacy:"Política de privacidad", account:"Cuenta", plan:"Plan", reasonGeneric:"Recibes este correo porque está relacionado con tu cuenta de SHURL.", support:"¿Necesitas ayuda? Contacta" }
};

export var NOTIFICATION_TEMPLATES = {
  welcome: {
    vi: { title:"Chào mừng đến với SHURL!", message:"Cảm ơn bạn đã tạo tài khoản {username}. Bắt đầu rút gọn link, tạo QR và khám phá các tính năng ngay nhé!", emailSubject:"Chào mừng đến với SHURL!", emailIntro:"Cảm ơn bạn đã tạo tài khoản trên SHURL — nền tảng rút gọn link đa tầng. Tài khoản <b>{username}</b> của bạn đã sẵn sàng sử dụng.", emailCta:"Bắt đầu ngay tại" },
    en: { title:"Welcome to SHURL!", message:"Thanks for creating your account, {username}. Start shortening links, generating QR codes and exploring the platform!", emailSubject:"Welcome to SHURL!", emailIntro:"Thanks for creating an account on SHURL — the multi-tier link shortening platform. Your account <b>{username}</b> is ready to go.", emailCta:"Get started at" },
    ko: { title:"SHURL에 오신 것을 환영합니다!", message:"{username} 계정을 만들어 주셔서 감사합니다. 링크 단축, QR 코드 생성 등 다양한 기능을 지금 바로 이용해 보세요!", emailSubject:"SHURL에 오신 것을 환영합니다!", emailIntro:"SHURL — 다단계 링크 단축 플랫폼에 가입해 주셔서 감사합니다. <b>{username}</b> 계정이 준비되었습니다.", emailCta:"지금 시작하기" },
    zh: { title:"欢迎使用 SHURL！", message:"感谢您创建账户 {username}。立即开始缩短链接、生成二维码，探索更多功能吧！", emailSubject:"欢迎使用 SHURL！", emailIntro:"感谢您在 SHURL（多层级链接缩短平台）注册账户。您的账户 <b>{username}</b> 已准备就绪。", emailCta:"立即开始" },
    hi: { title:"SHURL में आपका स्वागत है!", message:"{username} खाता बनाने के लिए धन्यवाद। अभी लिंक छोटा करना, QR कोड बनाना और सभी सुविधाएं देखना शुरू करें!", emailSubject:"SHURL में आपका स्वागत है!", emailIntro:"SHURL — मल्टी-टियर लिंक शॉर्टनिंग प्लेटफ़ॉर्म पर खाता बनाने के लिए धन्यवाद। आपका खाता <b>{username}</b> तैयार है।", emailCta:"अभी शुरू करें" },
    ja: { title:"SHURLへようこそ！", message:"{username} アカウントを作成いただきありがとうございます。今すぐリンクの短縮やQRコードの作成をお試しください！", emailSubject:"SHURLへようこそ！", emailIntro:"SHURL（マルチティア・リンク短縮プラットフォーム）にご登録いただきありがとうございます。アカウント <b>{username}</b> の準備が整いました。", emailCta:"今すぐ始める" },
    fr: { title:"Bienvenue sur SHURL !", message:"Merci d'avoir créé votre compte {username}. Commencez dès maintenant à raccourcir des liens, générer des QR codes et explorer la plateforme !", emailSubject:"Bienvenue sur SHURL !", emailIntro:"Merci d'avoir créé un compte sur SHURL — la plateforme de raccourcissement de liens multi-niveaux. Votre compte <b>{username}</b> est prêt.", emailCta:"Commencer sur" },
    es: { title:"¡Bienvenido a SHURL!", message:"Gracias por crear tu cuenta {username}. ¡Empieza ya a acortar enlaces, generar códigos QR y explorar la plataforma!", emailSubject:"¡Bienvenido a SHURL!", emailIntro:"Gracias por crear una cuenta en SHURL, la plataforma de acortamiento de enlaces multinivel. Tu cuenta <b>{username}</b> ya está lista.", emailCta:"Empezar en" }
  },
  payment_success: {
    vi: { title:"Thanh toán thành công!", message:"Bạn đã nâng cấp lên gói {tier} thành công. Cảm ơn bạn đã đồng hành cùng SHURL!", emailSubject:"Thanh toán thành công — Gói {tier}", emailIntro:"Thanh toán của bạn đã được xử lý thành công. Tài khoản <b>{username}</b> đã được nâng cấp lên gói <b>{tier}</b>.", emailCta:"Xem tài khoản tại" },
    en: { title:"Payment successful!", message:"You've successfully upgraded to the {tier} plan. Thanks for supporting SHURL!", emailSubject:"Payment successful — {tier} plan", emailIntro:"Your payment was processed successfully. Your account <b>{username}</b> has been upgraded to the <b>{tier}</b> plan.", emailCta:"View your account at" },
    ko: { title:"결제가 완료되었습니다!", message:"{tier} 플랜으로 업그레이드가 완료되었습니다. SHURL을 이용해 주셔서 감사합니다!", emailSubject:"결제 완료 — {tier} 플랜", emailIntro:"결제가 성공적으로 처리되었습니다. <b>{username}</b> 계정이 <b>{tier}</b> 플랜으로 업그레이드되었습니다.", emailCta:"계정 확인하기" },
    zh: { title:"支付成功！", message:"您已成功升级到 {tier} 套餐。感谢您使用 SHURL！", emailSubject:"支付成功 — {tier} 套餐", emailIntro:"您的付款已成功处理。您的账户 <b>{username}</b> 已升级至 <b>{tier}</b> 套餐。", emailCta:"查看账户" },
    hi: { title:"भुगतान सफल!", message:"आप {tier} प्लान में सफलतापूर्वक अपग्रेड हो गए हैं। SHURL का साथ देने के लिए धन्यवाद!", emailSubject:"भुगतान सफल — {tier} प्लान", emailIntro:"आपका भुगतान सफलतापूर्वक प्रोसेस हो गया है। आपका खाता <b>{username}</b> <b>{tier}</b> प्लान में अपग्रेड कर दिया गया है।", emailCta:"अपना खाता देखें" },
    ja: { title:"お支払いが完了しました！", message:"{tier} プランへのアップグレードが完了しました。SHURLをご利用いただきありがとうございます！", emailSubject:"お支払い完了 — {tier} プラン", emailIntro:"お支払いが正常に処理されました。アカウント <b>{username}</b> は <b>{tier}</b> プランにアップグレードされました。", emailCta:"アカウントを確認する" },
    fr: { title:"Paiement réussi !", message:"Vous avez été mis à niveau vers le forfait {tier} avec succès. Merci de soutenir SHURL !", emailSubject:"Paiement réussi — Forfait {tier}", emailIntro:"Votre paiement a été traité avec succès. Votre compte <b>{username}</b> a été mis à niveau vers le forfait <b>{tier}</b>.", emailCta:"Voir votre compte sur" },
    es: { title:"¡Pago exitoso!", message:"Has actualizado correctamente al plan {tier}. ¡Gracias por apoyar a SHURL!", emailSubject:"Pago exitoso — Plan {tier}", emailIntro:"Tu pago se procesó correctamente. Tu cuenta <b>{username}</b> se actualizó al plan <b>{tier}</b>.", emailCta:"Ver tu cuenta en" }
  },
  security_alert: {
    vi: { title:"Cảnh báo bảo mật", message:"Có hoạt động bất thường trên tài khoản của bạn. Nếu không phải bạn, vui lòng đổi mật khẩu ngay.", emailSubject:"Cảnh báo bảo mật tài khoản SHURL", emailIntro:"Chúng tôi phát hiện hoạt động bất thường trên tài khoản <b>{username}</b>. Nếu không phải bạn thực hiện, vui lòng đổi mật khẩu ngay lập tức.", emailCta:"Đổi mật khẩu tại" },
    en: { title:"Security alert", message:"We noticed unusual activity on your account. If this wasn't you, please change your password right away.", emailSubject:"SHURL account security alert", emailIntro:"We detected unusual activity on your account <b>{username}</b>. If this wasn't you, please change your password immediately.", emailCta:"Change your password at" },
    ko: { title:"보안 경고", message:"계정에서 비정상적인 활동이 감지되었습니다. 본인이 아니라면 즉시 비밀번호를 변경하세요.", emailSubject:"SHURL 계정 보안 경고", emailIntro:"계정 <b>{username}</b>에서 비정상적인 활동이 감지되었습니다. 본인이 아니라면 즉시 비밀번호를 변경해 주세요.", emailCta:"비밀번호 변경하기" },
    zh: { title:"安全警报", message:"我们检测到您的账户存在异常活动。如果不是您本人操作，请立即修改密码。", emailSubject:"SHURL 账户安全警报", emailIntro:"我们检测到账户 <b>{username}</b> 存在异常活动。如果不是您本人操作，请立即修改密码。", emailCta:"修改密码" },
    hi: { title:"सुरक्षा चेतावनी", message:"आपके खाते में असामान्य गतिविधि देखी गई है। यदि यह आप नहीं थे, तो कृपया तुरंत पासवर्ड बदलें।", emailSubject:"SHURL खाता सुरक्षा चेतावनी", emailIntro:"हमने खाता <b>{username}</b> में असामान्य गतिविधि का पता लगाया है। यदि यह आपने नहीं किया, तो कृपया तुरंत पासवर्ड बदलें।", emailCta:"पासवर्ड बदलें" },
    ja: { title:"セキュリティ警告", message:"アカウントで異常なアクティビティが検出されました。心当たりがない場合は、すぐにパスワードを変更してください。", emailSubject:"SHURLアカウントのセキュリティ警告", emailIntro:"アカウント <b>{username}</b> で異常なアクティビティが検出されました。心当たりがない場合は、すぐにパスワードを変更してください。", emailCta:"パスワードを変更する" },
    fr: { title:"Alerte de sécurité", message:"Nous avons détecté une activité inhabituelle sur votre compte. Si ce n'était pas vous, veuillez changer votre mot de passe immédiatement.", emailSubject:"Alerte de sécurité — Compte SHURL", emailIntro:"Nous avons détecté une activité inhabituelle sur votre compte <b>{username}</b>. Si ce n'était pas vous, veuillez changer votre mot de passe immédiatement.", emailCta:"Changer votre mot de passe sur" },
    es: { title:"Alerta de seguridad", message:"Detectamos actividad inusual en tu cuenta. Si no fuiste tú, cambia tu contraseña de inmediato.", emailSubject:"Alerta de seguridad de tu cuenta SHURL", emailIntro:"Detectamos actividad inusual en tu cuenta <b>{username}</b>. Si no fuiste tú, cambia tu contraseña de inmediato.", emailCta:"Cambiar tu contraseña en" }
  },
  payment_revoked: {
    vi: { title:"Giao dịch đã được thu hồi", message:"Đã xảy ra lỗi trong quá trình kiểm tra giao dịch {orderId}. Chúng tôi thành thật xin lỗi vì sự bất tiện này. Nếu bạn đã chuyển khoản, vui lòng liên hệ hỗ trợ để được xử lý ngay.", emailSubject:"Giao dịch {orderId} đã được thu hồi", emailIntro:"Đã xảy ra lỗi trong quá trình kiểm tra giao dịch <b>{orderId}</b> của bạn. Chúng tôi thành thật xin lỗi vì sự bất tiện này. Nếu bạn đã thực hiện chuyển khoản, vui lòng liên hệ với chúng tôi để được hỗ trợ xử lý ngay.", emailCta:"Xem tài khoản tại" },
    en: { title:"Transaction reversed", message:"An error occurred while verifying transaction {orderId}. We sincerely apologize for the inconvenience. If you already made the bank transfer, please contact support so we can resolve this right away.", emailSubject:"Transaction {orderId} was reversed", emailIntro:"An error occurred while verifying your transaction <b>{orderId}</b>. We sincerely apologize for the inconvenience. If you already made the bank transfer, please contact us so we can resolve this right away.", emailCta:"View your account at" },
    ko: { title:"거래가 취소되었습니다", message:"거래 {orderId} 확인 과정에서 오류가 발생했습니다. 불편을 드려 진심으로 사과드립니다. 이미 계좌이체를 하셨다면 즉시 처리해 드릴 수 있도록 고객지원에 문의해 주세요.", emailSubject:"거래 {orderId}가 취소되었습니다", emailIntro:"거래 <b>{orderId}</b> 확인 과정에서 오류가 발생했습니다. 불편을 드려 진심으로 사과드립니다. 이미 계좌이체를 하셨다면 즉시 처리해 드릴 수 있도록 문의해 주세요.", emailCta:"계정 확인하기" },
    zh: { title:"交易已被撤销", message:"在核实交易 {orderId} 时发生了错误，对由此带来的不便我们深表歉意。如果您已完成转账，请联系客服以便我们立即为您处理。", emailSubject:"交易 {orderId} 已被撤销", emailIntro:"在核实您的交易 <b>{orderId}</b> 时发生了错误，对由此带来的不便我们深表歉意。如果您已完成转账，请联系我们以便立即处理。", emailCta:"查看账户" },
    hi: { title:"लेन-देन वापस ले लिया गया", message:"लेन-देन {orderId} की जांच के दौरान एक त्रुटि हुई। असुविधा के लिए हमें खेद है। यदि आपने पहले ही बैंक ट्रांसफर कर दिया है, तो कृपया तुरंत सहायता के लिए संपर्क करें।", emailSubject:"लेन-देन {orderId} वापस ले लिया गया", emailIntro:"आपके लेन-देन <b>{orderId}</b> की जांच के दौरान एक त्रुटि हुई। असुविधा के लिए हमें खेद है। यदि आपने पहले ही बैंक ट्रांसफर कर दिया है, तो कृपया तुरंत सहायता के लिए हमसे संपर्क करें।", emailCta:"अपना खाता देखें" },
    ja: { title:"取引が取り消されました", message:"取引 {orderId} の確認中にエラーが発生しました。ご不便をおかけし誠に申し訳ございません。すでにお振込みが完了している場合は、すぐに対応いたしますのでサポートまでご連絡ください。", emailSubject:"取引 {orderId} が取り消されました", emailIntro:"お客様の取引 <b>{orderId}</b> の確認中にエラーが発生しました。ご不便をおかけし誠に申し訳ございません。すでにお振込みが完了している場合は、すぐに対応いたしますのでご連絡ください。", emailCta:"アカウントを確認する" },
    fr: { title:"Transaction annulée", message:"Une erreur s'est produite lors de la vérification de la transaction {orderId}. Nous sommes sincèrement désolés pour ce désagrément. Si vous avez déjà effectué le virement, veuillez contacter le support pour une résolution immédiate.", emailSubject:"La transaction {orderId} a été annulée", emailIntro:"Une erreur s'est produite lors de la vérification de votre transaction <b>{orderId}</b>. Nous sommes sincèrement désolés pour ce désagrément. Si vous avez déjà effectué le virement, veuillez nous contacter pour une résolution immédiate.", emailCta:"Voir votre compte sur" },
    es: { title:"Transacción revertida", message:"Ocurrió un error al verificar la transacción {orderId}. Lamentamos sinceramente las molestias. Si ya realizaste la transferencia, contacta a soporte para resolverlo de inmediato.", emailSubject:"La transacción {orderId} fue revertida", emailIntro:"Ocurrió un error al verificar tu transacción <b>{orderId}</b>. Lamentamos sinceramente las molestias. Si ya realizaste la transferencia, contáctanos para resolverlo de inmediato.", emailCta:"Ver tu cuenta en" }
  }
};

export function fillTemplate(s, params) {
  return String(s || "").replace(/\{(\w+)\}/g, function(_, k) { return (params && params[k] != null) ? params[k] : ""; });
}

export var NOTIF_EMAIL_META = {
  welcome: { illustration: "welcome", reason: { vi: "Bạn nhận được email này vì vừa tạo tài khoản mới tại SHURL.", en: "You're receiving this email because you just created a SHURL account." } },
  payment_success: { illustration: "payment", reason: { vi: "Bạn nhận được email này vì vừa hoàn tất thanh toán nâng cấp gói trên SHURL.", en: "You're receiving this email because you just completed a plan upgrade payment on SHURL." } },
  security_alert: { illustration: "security", reason: { vi: "Bạn nhận được email này vì có cảnh báo bảo mật liên quan tới tài khoản SHURL của bạn.", en: "You're receiving this email because of a security alert on your SHURL account." } },
  payment_revoked: { illustration: "security", reason: { vi: "Bạn nhận được email này vì một giao dịch của bạn vừa được admin thu hồi do lỗi kiểm tra.", en: "You're receiving this email because one of your transactions was just reversed by an admin due to a verification error." } }
};

export function renderNotificationTemplate(key, lang, params) {
  var byLang = NOTIFICATION_TEMPLATES[key];
  if (!byLang) return null;
  var tpl = byLang[lang] || byLang.vi;
  var L = EMAIL_LABELS[lang] || EMAIL_LABELS.vi;
  var meta = NOTIF_EMAIL_META[key] || { reason: {} };
  var detailRows = [];
  if (params && params.username) detailRows.push({ label: L.account, value: params.username });
  if (key === "payment_success" && params && params.tier) detailRows.push({ label: L.plan, value: params.tier });
  var ctaUrl = key === "welcome" ? "https://shurlvn.com" : "https://shurlvn.com/#/account";
  var emailHtml = buildEmailShell({
    lang: lang, illustration: meta.illustration,
    title: fillTemplate(tpl.emailSubject, params),
    introHtml: "<p>" + fillTemplate(tpl.emailIntro, params) + "</p>",
    detailRows: detailRows,
    ctaText: fillTemplate(tpl.emailCta, params),
    ctaUrl: ctaUrl,
    footerReason: meta.reason[lang] || meta.reason.en
  });
  return {
    title: fillTemplate(tpl.title, params),
    message: fillTemplate(tpl.message, params),
    emailSubject: fillTemplate(tpl.emailSubject, params),
    emailHtml: emailHtml
  };
}

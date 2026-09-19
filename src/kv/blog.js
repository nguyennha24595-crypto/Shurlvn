// KV: blog posts (seed data + CRUD), server-rendered blog pages read from here.

export const BLOG_POSTS_SEED = [
  {
    slug: "rut-gon-link-affiliate-khong-bi-chan-facebook",
    title: "Vì Sao Link Affiliate Shopee/TikTok Hay Bị Facebook Chặn — Và Cách Khắc Phục",
    description: "Lý do link affiliate Shopee, Lazada, TikTok Shop dễ bị Facebook hạn chế hiển thị, và cách dùng link rút gọn kèm tên miền riêng trên Shurlvn để giảm rủi ro.",
    date: "2026-09-18",
    contentHtml: `
      <p>Nếu bạn làm affiliate marketing cho Shopee, Lazada hay TikTok Shop, chắc hẳn đã từng gặp cảnh: đăng bài kèm link sản phẩm lên Facebook xong thấy lượt tiếp cận (reach) tụt thảm hại, hoặc tệ hơn là bài viết bị ẩn, cảnh báo "liên kết không an toàn". Đây là nỗi đau rất phổ biến của dân affiliate. Bài viết này giải thích vì sao và cách giảm thiểu rủi ro đó.</p>

      <h2>Vì sao link affiliate hay bị Facebook "để ý"?</h2>
      <ul>
        <li><b>Link gốc quá dài và rối:</b> link affiliate thường có hàng loạt tham số theo dõi (tracking ID, subid...) khiến link trông dài loằng ngoằng, dễ bị thuật toán xếp vào nhóm "đáng ngờ"</li>
        <li><b>Domain rút gọn dùng chung bị lạm dụng:</b> các dịch vụ rút gọn link miễn phí phổ biến từng bị nhiều đối tượng lợi dụng để phát tán link lừa đảo, khiến Facebook có xu hướng thận trọng hơn với TOÀN BỘ domain rút gọn đó — kể cả khi link của bạn hoàn toàn hợp lệ, bạn vẫn bị vạ lây vì dùng chung tên miền với những link xấu của người khác</li>
        <li><b>Đăng lặp lại cùng một link nhiều lần trong thời gian ngắn:</b> hành vi này giống spam, dù nội dung là hợp pháp</li>
      </ul>

      <h2>Shurlvn giúp gì cho vấn đề này?</h2>
      <h3>1. Rút gọn link để loại bỏ tham số rối mắt</h3>
      <p>Thay vì dán nguyên link affiliate dài với hàng chục ký tự tracking, bạn rút gọn lại bằng Shurlvn thành một link ngắn, sạch sẽ — vẫn giữ nguyên đích đến và tracking ID phía sau (người dùng không thấy tham số nhưng hệ thống affiliate vẫn ghi nhận hoa hồng bình thường).</p>

      <h3>2. Dùng tên miền riêng để không bị "vạ lây" từ người dùng khác</h3>
      <p>Đây là điểm quan trọng nhất: khi bạn dùng domain rút gọn CHUNG (kể cả shurlvn.com hay bất kỳ dịch vụ rút gọn phổ biến nào khác), uy tín domain đó phụ thuộc vào hành vi của TẤT CẢ người dùng khác. Với tính năng <a href="/blog/tao-ten-mien-rieng-cho-link">tên miền riêng (custom domain)</a> của gói Super, link của bạn sẽ mang tên miền của chính bạn — độ uy tín hoàn toàn tách biệt, không phụ thuộc vào việc người khác có lạm dụng domain rút gọn chung hay không.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://shopee.vn/product/xxxx?af_id=...&sub_id=...&utm_...</div>
          <label class="mockup-label">Tên miền riêng</label>
          <div class="mockup-input">shop.tenbandcuaban.com</div>
          <div class="mockup-btn">Rút gọn ngay</div>
        </div>
      </div>
      <p class="mockup-caption">Link Shopee dài, rối mắt được rút gọn dưới chính tên miền của bạn</p>

      <h3>3. Theo dõi hiệu quả bằng Facebook Pixel ngay trên link rút gọn</h3>
      <p>Với tài khoản Pro trở lên, bạn có thể gắn Facebook Pixel ID trực tiếp vào link rút gọn khi tạo — mỗi lượt click sẽ được Pixel ghi nhận, giúp bạn tối ưu quảng cáo và đo lường chuyển đổi chính xác hơn mà không cần chỉnh sửa gì ở trang đích.</p>

      <blockquote>💡 <b>Lưu ý quan trọng:</b> Không có công cụ nào đảm bảo 100% link không bao giờ bị hạn chế — thuật toán của Facebook xét nhiều yếu tố (nội dung bài viết, lịch sử tài khoản, tốc độ đăng bài...). Dùng tên miền riêng giúp <i>giảm rủi ro</i> do bị vạ lây từ domain dùng chung, chứ không phải "vé miễn trừ" tuyệt đối.</blockquote>

      <h2>Vài mẹo thực tế thêm cho dân affiliate</h2>
      <ul>
        <li>Không đăng lại y hệt một link nhiều lần liên tục trong thời gian ngắn</li>
        <li>Đặt tên alias gợi nhớ sản phẩm (vd: <i>shop.tenbandcuaban.com/tai-nghe-sale</i>) thay vì để mã ngẫu nhiên, vừa chuyên nghiệp vừa dễ khiến người xem tin tưởng bấm vào</li>
        <li>Nếu chạy nhiều sản phẩm cùng lúc, dùng tính năng <a href="/blog/rut-gon-link-hang-loat">rút gọn hàng loạt</a> để tạo toàn bộ link chỉ trong một lần nhập</li>
      </ul>
    `
  },
  {
    slug: "utm-tracking-la-gi-ket-hop-rut-gon-link",
    title: "UTM Tracking Là Gì? Cách Kết Hợp UTM Với Link Rút Gọn Để Đo Lường Chiến Dịch Chính Xác",
    description: "UTM Tracking là gì và cách kết hợp UTM với công cụ rút gọn link Shurlvn để đo lường chính xác hiệu quả quảng cáo Facebook, Google — xem rõ nguồn traffic đến từ đâu.",
    date: "2026-09-17",
    contentHtml: `
      <p>Bạn chạy quảng cáo trên cả Facebook lẫn Google, đăng thêm vài bài trên các hội nhóm — nhưng cuối tháng nhìn vào Google Analytics lại không biết chính xác đơn hàng nào đến từ kênh nào? Đó là lúc bạn cần đến UTM Tracking.</p>

      <h2>UTM Tracking là gì?</h2>
      <p>UTM (Urchin Tracking Module) là các tham số nhỏ được gắn thêm vào cuối một URL, giúp công cụ phân tích (như Google Analytics, Facebook Ads Manager) biết chính xác lượt truy cập đến từ đâu. Có 5 tham số UTM phổ biến:</p>
      <ul>
        <li><b>utm_source</b> — nguồn traffic (vd: facebook, google, zalo)</li>
        <li><b>utm_medium</b> — kênh/hình thức (vd: cpc, social, email)</li>
        <li><b>utm_campaign</b> — tên chiến dịch (vd: sale-thang9)</li>
        <li><b>utm_term</b> — từ khoá (thường dùng cho quảng cáo tìm kiếm)</li>
        <li><b>utm_content</b> — phân biệt các phiên bản quảng cáo/nội dung khác nhau trong cùng chiến dịch</li>
      </ul>
      <p>Vấn đề là một URL gắn đủ 5 tham số UTM thường dài và xấu, không thể đăng trực tiếp lên bài quảng cáo hay in trên standee. Đây là lúc kết hợp với công cụ rút gọn link phát huy tác dụng.</p>

      <h2>Cách tạo link vừa có UTM vừa được rút gọn trên Shurlvn</h2>
      <p>Shurlvn tích hợp sẵn UTM Builder ngay trong màn hình tạo link — bạn không cần tự ghép chuỗi tham số bằng tay.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://vi-du.com/san-pham</div>
          <label class="mockup-label">Nguồn (utm_source)</label>
          <div class="mockup-input">facebook</div>
          <label class="mockup-label">Kênh (utm_medium)</label>
          <div class="mockup-input">cpc</div>
          <div class="mockup-btn">Áp dụng UTM</div>
        </div>
      </div>
      <p class="mockup-caption">Điền UTM Builder, Shurlvn tự ghép vào link đích trước khi rút gọn</p>
      <p>Sau khi áp dụng, link đích thực tế sẽ mang đầy đủ tham số UTM (ví dụ <span style="font-family:monospace;">?utm_source=facebook&utm_medium=cpc&utm_campaign=sale-thang9</span>), nhưng bạn chỉ cần chia sẻ một link rút gọn ngắn gọn — khi khách bấm vào, họ vẫn được chuyển tới đúng trang đích kèm đầy đủ tham số UTM để Google Analytics hay Facebook Ads Manager của bạn ghi nhận chính xác.</p>

      <h2>Xem thêm lượt click và nguồn truy cập ngay trên Shurlvn</h2>
      <p>Song song với việc UTM chảy về công cụ phân tích của riêng bạn, Shurlvn còn ghi lại một lớp thống kê độc lập ngay trên link rút gọn — không cần chờ báo cáo từ nơi khác:</p>
      <ul>
        <li><b>Nguồn giới thiệu (referrer):</b> link được bấm từ trang/ứng dụng nào (Facebook, Zalo, trực tiếp...)</li>
        <li><b>Thiết bị và trình duyệt:</b> điện thoại hay máy tính, Chrome hay Safari...</li>
        <li><b>Quốc gia truy cập</b></li>
        <li><b>Lịch sử từng lượt click theo thời gian thực</b></li>
      </ul>
      <p>Vào mục thống kê chi tiết của từng link trong Dashboard để xem các biểu đồ này.</p>

      <blockquote>💡 <b>Mẹo:</b> Đặt tên campaign giống với utm_campaign khi tạo link (ví dụ cùng là "sale-thang9") — sau đó bạn có thể vào mục Campaigns để xem tổng lượt click gộp của toàn bộ link thuộc cùng một chiến dịch, tiện so sánh hiệu quả giữa các đợt chạy quảng cáo.</blockquote>

      <h2>Lưu ý khi dùng UTM</h2>
      <ul>
        <li>Thống nhất quy tắc đặt tên UTM trong cả team (chữ thường, không dấu, không khoảng trắng) để tránh Google Analytics tách thành nhiều dòng khác nhau cho cùng một nguồn</li>
        <li>Không gắn UTM cho link nội bộ giữa các trang trên chính website của bạn — chỉ dùng cho link dẫn từ bên ngoài vào</li>
        <li>utm_campaign nên đặt trùng với tên chiến dịch nội bộ để dễ đối chiếu báo cáo sau này</li>
      </ul>
    `
  },
  {
    slug: "loi-ich-branded-link-cho-doanh-nghiep",
    title: "Branded Link Là Gì? Vì Sao Doanh Nghiệp Nên Dùng Link Mang Tên Miền Riêng",
    description: "Phân tích lợi ích của Branded Link (link rút gọn mang tên miền riêng của doanh nghiệp) so với link rút gọn dùng domain chung — về uy tín, nhận diện thương hiệu và bảo mật.",
    date: "2026-09-16",
    contentHtml: `
      <p>Với một cá nhân, một link dạng <b>shurlvn.com/abc123</b> đã đủ dùng. Nhưng với doanh nghiệp đang xây dựng thương hiệu, mỗi điểm chạm với khách hàng — kể cả một đường link ngắn — đều là cơ hội để củng cố (hoặc làm giảm) niềm tin. Đó là lý do khái niệm <b>Branded Link</b> (link mang tên miền riêng của doanh nghiệp) ngày càng được các thương hiệu chú trọng.</p>

      <h2>Branded Link là gì?</h2>
      <p>Thay vì dùng domain rút gọn dùng chung với hàng nghìn người dùng khác, Branded Link sử dụng chính tên miền (hoặc tên miền phụ) của doanh nghiệp bạn — ví dụ <b>di.tencongty.com/km-thang9</b> thay vì <b>shurlvn.com/aXb92k</b>.</p>

      <h2>So sánh Branded Link và link rút gọn dùng chung</h2>
      <div class="cmp-table-wrap"><table class="cmp-table">
        <tr><th></th><th>Link rút gọn dùng chung</th><th>Branded Link</th></tr>
        <tr><td>Nhận diện thương hiệu</td><td class="no">Không có, trông giống mọi link rút gọn khác</td><td class="yes">Ngay lập tức nhận ra là link của doanh nghiệp bạn</td></tr>
        <tr><td>Độ tin cậy với người nhận</td><td class="no">Người dùng dè dặt hơn với domain lạ</td><td class="yes">Tên miền quen thuộc giúp tăng tỷ lệ click</td></tr>
        <tr><td>Uy tín domain</td><td class="no">Phụ thuộc hành vi của TẤT CẢ người dùng khác trên cùng domain</td><td class="yes">Độc lập, chỉ phụ thuộc vào chính bạn</td></tr>
        <tr><td>Đồng bộ đa kênh</td><td class="no">Mỗi kênh (email, MXH, in ấn) có thể trông rời rạc</td><td class="yes">Cùng một tên miền xuất hiện xuyên suốt mọi kênh</td></tr>
      </table></div>

      <h2>Ba lợi ích cụ thể cho doanh nghiệp</h2>
      <h3>1. Tăng tỷ lệ click (CTR)</h3>
      <p>Người dùng có xu hướng ngần ngại bấm vào link từ domain họ không quen biết, đặc biệt trong bối cảnh lừa đảo qua link ngày càng phổ biến. Một link mang đúng tên miền công ty tạo cảm giác an toàn hơn hẳn.</p>

      <h3>2. Củng cố nhận diện thương hiệu ở từng điểm chạm nhỏ</h3>
      <p>Từ email marketing, bài đăng mạng xã hội, đến mã QR in trên bao bì sản phẩm — mọi đường link đều là cơ hội nhắc khách hàng nhớ tới tên thương hiệu, thay vì nhắc tới tên một dịch vụ rút gọn link trung gian.</p>

      <h3>3. Không bị ảnh hưởng bởi việc người khác lạm dụng domain chung</h3>
      <p>Một số nền tảng (đặc biệt là mạng xã hội) có xu hướng thận trọng hơn với các domain rút gọn bị nhiều người dùng lạm dụng cho mục đích xấu. Dùng tên miền riêng giúp uy tín link của bạn hoàn toàn tách biệt khỏi hành vi của người dùng khác.</p>

      <h2>Doanh nghiệp cần gì để bắt đầu?</h2>
      <p>Trên Shurlvn, tính năng tên miền riêng dành cho gói <b>Super</b> và cần trỏ DNS tên miền của bạn về hạ tầng SHURL. Xem hướng dẫn chi tiết từng bước tại bài viết <a href="/blog/tao-ten-mien-rieng-cho-link">Tạo Tên Miền Riêng Cho Link Rút Gọn</a>.</p>
    `
  },
  {
    slug: "so-sanh-bitly-tinyurl-shurlvn",
    title: "So Sánh Bitly, TinyURL Và Shurlvn — Nên Chọn Công Cụ Rút Gọn Link Nào?",
    description: "So sánh khách quan 3 công cụ rút gọn link phổ biến Bitly, TinyURL và Shurlvn về tính năng, tên miền riêng, mã QR, thống kê và ngôn ngữ giao diện.",
    date: "2026-09-15",
    contentHtml: `
      <p>Thị trường công cụ rút gọn link có khá nhiều lựa chọn, mỗi cái mạnh một kiểu. Bài viết này so sánh khách quan ba cái tên quen thuộc với người dùng Việt Nam: <b>Bitly</b>, <b>TinyURL</b> và <b>Shurlvn</b> — để bạn chọn đúng công cụ cho nhu cầu của mình.</p>

      <div class="cmp-table-wrap"><table class="cmp-table">
        <tr><th></th><th>Bitly</th><th>TinyURL</th><th>Shurlvn</th></tr>
        <tr><td>Miễn phí sử dụng cơ bản</td><td class="yes">Có (giới hạn)</td><td class="yes">Có</td><td class="yes">Có</td></tr>
        <tr><td>Cần đăng ký tài khoản</td><td>Có, để dùng đủ tính năng</td><td class="no">Không bắt buộc</td><td class="no">Không bắt buộc (khách vẫn rút gọn được)</td></tr>
        <tr><td>Tạo mã QR miễn phí</td><td>Giới hạn ở gói trả phí</td><td class="no">Không có sẵn</td><td class="yes">Có, tuỳ chỉnh màu/kích thước, miễn phí</td></tr>
        <tr><td>Thống kê click (referrer, thiết bị, quốc gia)</td><td>Có, đầy đủ hơn ở gói trả phí</td><td class="no">Rất hạn chế</td><td class="yes">Có sẵn cho tài khoản đăng ký</td></tr>
        <tr><td>Tên miền riêng (branded domain)</td><td>Yêu cầu nâng cấp gói trả phí</td><td class="no">Không hỗ trợ</td><td>Yêu cầu gói Super</td></tr>
        <tr><td>Giao diện tiếng Việt</td><td class="no">Không</td><td class="no">Không</td><td class="yes">Có, mặc định tiếng Việt</td></tr>
        <tr><td>Hạ tầng</td><td>Máy chủ riêng</td><td>Máy chủ riêng</td><td>Cloudflare Workers (mạng lưới máy chủ biên toàn cầu)</td></tr>
      </table></div>

      <h2>Bitly phù hợp với ai?</h2>
      <p>Bitly là cái tên lâu đời, phổ biến toàn cầu, phù hợp với doanh nghiệp quốc tế cần tích hợp sâu vào các nền tảng marketing lớn. Nhược điểm là giao diện chỉ có tiếng Anh, và nhiều tính năng nâng cao (branded domain, thống kê chi tiết) yêu cầu nâng cấp gói trả phí khá sớm.</p>

      <h2>TinyURL phù hợp với ai?</h2>
      <p>TinyURL đơn giản đến mức tối đa — phù hợp nếu bạn chỉ cần rút gọn một link nhanh, dùng một lần, không cần theo dõi thống kê hay quản lý lâu dài. Đổi lại, gần như không có công cụ quản lý, không mã QR, không thống kê chi tiết.</p>

      <h2>Vì sao nhiều người dùng Việt Nam chọn Shurlvn?</h2>
      <ul>
        <li><b>Giao diện tiếng Việt mặc định</b> — dễ dùng cho người mới, không cần đoán nghĩa thuật ngữ tiếng Anh</li>
        <li><b>Miễn phí ngay cả khi chưa đăng ký</b> — khách vãng lai vẫn rút gọn được 5 link/ngày, có tài khoản Free thì nhiều tính năng hơn (đặt tên tuỳ chỉnh, thống kê...) mà không cần trả phí</li>
        <li><b>Mã QR tuỳ chỉnh màu sắc miễn phí</b> — nhiều đối thủ giới hạn tính năng này ở gói trả phí</li>
        <li><b>Chạy trên hạ tầng Cloudflare</b> — tận dụng mạng lưới máy chủ biên (edge network) phủ khắp toàn cầu, giúp tốc độ phản hồi nhanh dù người dùng ở bất kỳ đâu</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Không có công cụ nào "tốt nhất" cho mọi trường hợp — Bitly mạnh về hệ sinh thái quốc tế, TinyURL nhanh gọn cho nhu cầu dùng một lần, còn Shurlvn phù hợp nhất nếu bạn muốn một công cụ tiếng Việt, miễn phí ngay từ đầu, có sẵn mã QR và thống kê cơ bản mà không phải trả phí ngay từ những tính năng đầu tiên.</p>
    `
  },
  {
    slug: "rut-gon-link-hang-loat",
    title: "Rút Gọn Link Hàng Loạt (Bulk) — Xử Lý Cả Trăm Link Trong 1 Lần",
    description: "Hướng dẫn rút gọn nhiều link cùng lúc bằng tính năng Bulk trên Shurlvn.com, kèm cách đặt alias và campaign riêng cho từng link ngay trong 1 lần nhập.",
    date: "2026-09-14",
    contentHtml: `
      <p>Nếu công việc của bạn cần rút gọn hàng chục, hàng trăm đường link cùng lúc — ví dụ danh sách sản phẩm, link tài liệu cho từng chi nhánh — việc tạo từng link một sẽ rất mất thời gian. Tính năng <b>Rút gọn hàng loạt (Bulk)</b> trên Shurlvn.com giúp bạn xử lý toàn bộ chỉ trong một lần nhập.</p>

      <h2>Tính năng này dành cho ai?</h2>
      <p>Rút gọn hàng loạt là tính năng từ gói <b>Plus</b> trở lên (Plus, Pro, Super). Mỗi gói có giới hạn số link tối đa cho một lần xử lý khác nhau — gói càng cao, giới hạn mỗi lần càng lớn.</p>

      <h2>Cách sử dụng</h2>
      <h3>Bước 1: Vào mục Bulk trong Dashboard</h3>
      <p>Sau khi đăng nhập, chọn mục <b>Bulk</b> ở thanh điều hướng bên trái.</p>

      <h3>Bước 2: Nhập danh sách link theo đúng định dạng</h3>
      <p>Mỗi dòng là một link, có thể kèm thêm alias (tên rút gọn riêng) và tên campaign, phân tách nhau bằng dấu phẩy. Alias và campaign là tuỳ chọn, có thể bỏ trống nếu muốn hệ thống tự đặt tên.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">Tạo hàng loạt</p>
          <p class="mockup-card-sub">Nhập mỗi URL trên 1 dòng. Giới hạn tối đa 300 link/lần.</p>
          <div class="mockup-input">https://vi-du.com/san-pham-a,sp-a,Q1-Sale<br>https://vi-du.com/san-pham-b,sp-b,Q1-Sale<br>https://vi-du.com/san-pham-c</div>
          <div class="mockup-btn">Tạo hàng loạt</div>
        </div>
      </div>
      <p class="mockup-caption">Định dạng: URL,alias,campaign — alias và campaign có thể bỏ trống</p>

      <h3>Bước 3: Nhận kết quả và tải về Excel</h3>
      <p>Hệ thống xử lý toàn bộ danh sách và hiển thị link rút gọn tương ứng cho từng dòng, kèm thông báo dòng nào bị lỗi (nếu có, ví dụ URL sai định dạng hoặc alias đã bị trùng). Bạn có thể tải luôn toàn bộ kết quả ra file Excel để lưu trữ hoặc gửi cho đồng nghiệp.</p>

      <blockquote>💡 <b>Mẹo:</b> Nên đặt tên campaign giống nhau cho các link thuộc cùng một chiến dịch marketing — sau này bạn có thể lọc và xem thống kê gộp theo từng campaign trong mục Analytics.</blockquote>

      <h2>Lưu ý khi dùng</h2>
      <ul>
        <li>Vượt quá giới hạn số link/lần của gói hiện tại sẽ bị báo lỗi — chia nhỏ danh sách thành nhiều lần nhập nếu cần</li>
        <li>Alias trùng với link đã tồn tại sẽ bị báo lỗi cho dòng đó, các dòng còn lại vẫn được xử lý bình thường</li>
        <li>Nên kiểm tra lại vài link ngẫu nhiên trong kết quả trước khi gửi hàng loạt cho khách hàng</li>
      </ul>
    `
  },
  {
    slug: "dat-ten-link-tuy-chinh",
    title: "Đặt Tên Link Tuỳ Chỉnh (Custom Alias) Để Link Dễ Nhớ, Dễ Nhận Diện",
    description: "Hướng dẫn đặt tên riêng cho link rút gọn trên Shurlvn.com thay vì để hệ thống tự sinh ngẫu nhiên — giúp link chuyên nghiệp và dễ nhớ hơn.",
    date: "2026-09-14",
    contentHtml: `
      <p>Một link dạng <b>shurlvn.com/x7Yq2</b> hoạt động tốt, nhưng khó nhớ và không truyền tải được nội dung bên trong. Với tính năng <b>đặt tên link tuỳ chỉnh (custom alias)</b>, bạn có thể biến nó thành <b>shurlvn.com/khuyen-mai-thang9</b> — vừa dễ nhớ, vừa dễ đọc khi chia sẻ bằng lời.</p>

      <h2>Ai dùng được tính năng này?</h2>
      <p>Khác với các tính năng nâng cao khác, đặt tên tuỳ chỉnh có sẵn ngay từ <b>tài khoản miễn phí</b> — chỉ cần đăng ký tài khoản (không cần nâng cấp gói trả phí) là dùng được. Khách chưa đăng nhập thì chưa thấy được ô này.</p>

      <h2>Cách đặt tên link tuỳ chỉnh</h2>
      <p>Khi tạo link mới (ở trang chủ hoặc trong Dashboard), điền vào ô "Tên rút gọn tuỳ chỉnh" cái tên bạn muốn — chỉ nên dùng chữ, số và dấu gạch ngang để tránh lỗi.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://vi-du.com/chuong-trinh-khuyen-mai-thang-9</div>
          <label class="mockup-label">Tên rút gọn tuỳ chỉnh</label>
          <div class="mockup-input">khuyen-mai-thang9</div>
          <div class="mockup-btn">Rút gọn ngay</div>
          <div class="mockup-result"><span class="link">shurlvn.com/khuyen-mai-thang9</span><span class="copy">Chép</span></div>
        </div>
      </div>
      <p class="mockup-caption">Đặt tên gợi nhớ thay vì để hệ thống tự sinh ký tự ngẫu nhiên</p>

      <h2>Vài gợi ý khi đặt tên</h2>
      <ul>
        <li>Ưu tiên tên ngắn, liên quan trực tiếp tới nội dung (ví dụ: <i>bao-gia-2026</i>, <i>tuyen-dung-hn</i>)</li>
        <li>Tránh khoảng trắng và ký tự có dấu — hệ thống sẽ báo lỗi hoặc tự loại bỏ ký tự không hợp lệ</li>
        <li>Mỗi tên chỉ dùng được một lần trên toàn hệ thống — nếu báo trùng, hãy thử thêm hậu tố như năm hoặc phòng ban</li>
        <li>Một số từ khoá nhạy cảm (liên quan thương hiệu lớn, ngân hàng...) bị chặn để chống giả mạo, dùng tên khác nếu gặp trường hợp này</li>
      </ul>
    `
  },
  {
    slug: "bao-ve-link-bang-mat-khau",
    title: "Bảo Vệ Link Bằng Mật Khẩu — Chỉ Người Có Mật Khẩu Mới Xem Được",
    description: "Hướng dẫn đặt mật khẩu bảo vệ cho link rút gọn trên Shurlvn.com để giới hạn ai được truy cập nội dung — tính năng từ gói Pro trở lên.",
    date: "2026-09-14",
    contentHtml: `
      <p>Không phải link nào cũng nên công khai cho tất cả mọi người bấm vào — ví dụ tài liệu nội bộ, link họp riêng tư, hay ưu đãi chỉ dành cho một nhóm khách hàng nhất định. Với tính năng <b>bảo vệ link bằng mật khẩu</b> trên Shurlvn, chỉ ai có mật khẩu mới xem được nội dung đích.</p>

      <h2>Tính năng này dành cho ai?</h2>
      <p>Bảo vệ link bằng mật khẩu là tính năng từ gói <b>Pro</b> trở lên (Pro, Super). Ô nhập mật khẩu vẫn hiển thị cho mọi tài khoản đã đăng nhập, nhưng chỉ thực sự có hiệu lực với gói Pro trở lên — tài khoản Free/Plus điền vào ô này sẽ không có tác dụng bảo vệ.</p>

      <h2>Cách đặt mật khẩu cho link</h2>
      <p>Khi tạo link mới ở trang chủ (sau khi đăng nhập), điền mật khẩu bạn muốn vào ô "Bảo vệ bằng mật khẩu" — để trống nếu không cần bảo vệ.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://vi-du.com/tai-lieu-noi-bo</div>
          <label class="mockup-label">Bảo vệ bằng mật khẩu (tùy chọn)</label>
          <div class="mockup-input">••••••••</div>
          <div class="mockup-btn">Rút gọn ngay</div>
        </div>
      </div>
      <p class="mockup-caption">Để trống ô mật khẩu nếu không cần giới hạn truy cập</p>

      <h2>Trải nghiệm của người nhận link</h2>
      <p>Khi ai đó bấm vào link đã được bảo vệ, thay vì được chuyển thẳng tới trang đích, họ sẽ thấy màn hình yêu cầu nhập mật khẩu trước:</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com/tai-lieu-noi-bo</span></div>
        <div class="mockup-body">
          <p class="mockup-card-title">🔒 Link được bảo vệ</p>
          <p class="mockup-card-sub">Nhập mật khẩu để tiếp tục</p>
          <div class="mockup-input ph">Mật khẩu</div>
          <div class="mockup-btn">Vào link →</div>
        </div>
      </div>
      <p class="mockup-caption">Màn hình yêu cầu mật khẩu mà người nhận link sẽ thấy</p>

      <h2>Lưu ý khi dùng</h2>
      <ul>
        <li>Chia sẻ mật khẩu qua một kênh khác với kênh gửi link (ví dụ gửi link qua email, đọc mật khẩu qua điện thoại) để tăng bảo mật</li>
        <li>Gói Super còn giới hạn thêm số lần nhập sai mật khẩu liên tiếp để chống dò mật khẩu tự động</li>
        <li>Đổi mật khẩu định kỳ nếu link được chia sẻ cho nhóm lớn hoặc dùng trong thời gian dài</li>
      </ul>
    `
  },
  {
    slug: "dat-ngay-het-han-cho-link",
    title: "Đặt Ngày Hết Hạn Cho Link — Tự Động Vô Hiệu Hoá Đúng Lúc",
    description: "Hướng dẫn đặt ngày hết hạn cho link rút gọn trên Shurlvn.com để link tự động ngừng hoạt động sau chương trình khuyến mãi hoặc sự kiện — tính năng gói Pro trở lên.",
    date: "2026-09-14",
    contentHtml: `
      <p>Nhiều link chỉ có giá trị trong một khoảng thời gian nhất định — link đăng ký sự kiện, link mã giảm giá theo đợt, link tải tài liệu tạm thời. Thay vì phải nhớ tự tay xoá hoặc vô hiệu hoá link sau khi hết hạn dùng, bạn có thể để Shurlvn tự động làm việc đó đúng ngày bạn chọn.</p>

      <h2>Tính năng này dành cho ai?</h2>
      <p>Đặt ngày hết hạn tuỳ chỉnh là tính năng từ gói <b>Pro</b> trở lên (Pro, Super). Riêng với <b>khách chưa đăng nhập</b> tạo link (không tài khoản), link sẽ tự động hết hạn sau <b>30 ngày</b> kể từ lúc tạo — đây là cơ chế mặc định áp dụng chung, không tuỳ chỉnh được. Tài khoản Free/Plus tạo link thì link tồn tại không giới hạn thời gian, nhưng cũng chưa tự đặt được ngày hết hạn riêng như Pro trở lên.</p>

      <h2>Cách đặt ngày hết hạn cho link</h2>
      <p>Khi tạo link mới (với tài khoản Pro trở lên), điền vào ô "Ngày hết hạn" ngày bạn muốn link ngừng hoạt động.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://vi-du.com/su-kien-thang-9</div>
          <label class="mockup-label">Ngày hết hạn (tùy chọn)</label>
          <div class="mockup-input">30/09/2026</div>
          <div class="mockup-btn">Rút gọn ngay</div>
        </div>
      </div>
      <p class="mockup-caption">Sau ngày này, link sẽ tự động ngừng chuyển hướng</p>

      <p>Sau ngày hết hạn, người bấm vào link sẽ thấy thông báo link đã hết hạn thay vì được chuyển tới trang đích — tránh trường hợp khách hàng bấm vào một chương trình khuyến mãi đã kết thúc từ lâu.</p>

      <blockquote>💡 <b>Mẹo:</b> Kết hợp ngày hết hạn với tên đặt theo đợt (ví dụ <i>sale-thang9</i>) để dễ dọn dẹp và theo dõi lịch sử các chương trình đã chạy trong mục Campaigns.</blockquote>

      <h2>Lưu ý khi dùng</h2>
      <ul>
        <li>Link hết hạn không bị xoá khỏi hệ thống — bạn vẫn xem được thống kê lượt click trước đó trong Dashboard</li>
        <li>Có thể chỉnh sửa lại ngày hết hạn sau khi tạo link nếu chương trình được gia hạn</li>
        <li>Nên đặt ngày hết hạn muộn hơn thời điểm kết thúc chương trình thực tế một chút, để tránh link tắt sớm khi vẫn còn người truy cập</li>
      </ul>
    `
  },
  {
    slug: "tao-ma-qr-mien-phi-doi-mau",
    title: "Tạo Mã QR Miễn Phí, Tuỳ Chỉnh Màu Sắc Trong Vài Giây Với Shurlvn",
    description: "Hướng dẫn tạo mã QR miễn phí từ link hoặc văn bản, đổi màu và kích thước tuỳ ý bằng công cụ QR của Shurlvn.com — không cần đăng ký, có ví dụ QR thật.",
    date: "2026-09-14",
    contentHtml: `
      <p>Mã QR ngày nay xuất hiện ở khắp mọi nơi: menu quán ăn, poster sự kiện, danh thiếp, bao bì sản phẩm... Thay vì trả phí cho các công cụ tạo QR chuyên nghiệp, bạn hoàn toàn có thể tạo mã QR đẹp, tuỳ chỉnh màu sắc theo bộ nhận diện thương hiệu của mình miễn phí bằng công cụ QR có sẵn trên <a href="https://shurlvn.com" target="_blank" rel="noopener">Shurlvn.com</a>. Bài viết này hướng dẫn chi tiết cách làm, kèm theo vài mã QR thật để bạn thấy rõ mức độ tuỳ biến.</p>

      <h2>Vì sao nên tự tạo mã QR thay vì chụp màn hình có sẵn?</h2>
      <ul>
        <li>Mã QR tự tạo luôn rõ nét ở mọi kích thước, không bị vỡ hình như ảnh chụp màn hình</li>
        <li>Tuỳ chỉnh được màu sắc để đồng bộ với bộ nhận diện thương hiệu, thay vì mã đen-trắng mặc định</li>
        <li>Có thể mã hoá trực tiếp văn bản (số điện thoại, địa chỉ, ghi chú...) chứ không chỉ đường link</li>
        <li>Tạo và tải về ngay lập tức, không watermark, không giới hạn số lần dùng</li>
      </ul>

      <h2>Hướng dẫn tạo mã QR trên Shurlvn.com</h2>
      <p>Công cụ QR nằm ngay trên trang chủ hoặc ở mục QR Codes trên Shurlvn — dùng được ngay không cần tạo tài khoản.</p>

      <h3>Bước 1: Chọn loại nội dung</h3>
      <p>Bạn có thể mã hoá một đường link (URL) hoặc một đoạn văn bản bất kỳ tuỳ vào nhu cầu.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">Tạo QR Code</p>
          <p class="mockup-card-sub">Tạo và tùy chỉnh QR Code trực tiếp — thay đổi gì cũng thấy ngay, không cần bấm tạo lại.</p>
          <label class="mockup-label">Chọn loại mã QR</label>
          <div class="mockup-input">🔗 URL &nbsp;&nbsp;&nbsp; 📄 Văn bản</div>
          <label class="mockup-label">Nhập dữ liệu</label>
          <div class="mockup-input ph">https://shurlvn.com</div>
        </div>
      </div>
      <p class="mockup-caption">Bước chọn loại nội dung và nhập dữ liệu cần tạo QR</p>

      <h3>Bước 2: Tuỳ chỉnh màu sắc, kích thước</h3>
      <p>Đây là phần thú vị nhất — bạn có thể đổi màu mã QR, màu nền (hoặc để nền trong suốt), chọn kích thước và độ rộng viền, xem trước kết quả ngay lập tức mà không cần bấm nút tạo lại.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <label class="mockup-label">Tùy chỉnh</label>
          <div class="mockup-input">Màu sắc: #6366f1 &nbsp;·&nbsp; Màu nền: Trong suốt</div>
          <div class="mockup-input">Kích cỡ: 300px &nbsp;·&nbsp; Viền (margin): Mặc định</div>
        </div>
      </div>
      <p class="mockup-caption">Đổi màu, kích thước và xem kết quả cập nhật theo thời gian thực</p>

      <p>Dưới đây là 3 mã QR thật, cùng trỏ về shurlvn.com, được tạo với các tuỳ chỉnh màu khác nhau bằng chính công cụ trên — bạn có thể quét thử bằng điện thoại:</p>
      <div class="qr-row">
        <figure><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fshurlvn.com&color=000000&format=png" alt="Mã QR màu đen mặc định trỏ về shurlvn.com" width="180" height="180"><figcaption>Mặc định (đen)</figcaption></figure>
        <figure><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fshurlvn.com&color=7c3aed&format=png" alt="Mã QR màu tím thương hiệu trỏ về shurlvn.com" width="180" height="180"><figcaption>Màu tím thương hiệu</figcaption></figure>
        <figure><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fshurlvn.com&color=ffffff&bgcolor=0f172a&format=png" alt="Mã QR đảo màu nền tối chữ trắng trỏ về shurlvn.com" width="180" height="180"><figcaption>Đảo màu (nền tối)</figcaption></figure>
      </div>

      <h3>Bước 3: Tải về hoặc dùng ngay</h3>
      <p>Sau khi ưng ý với mẫu QR, bấm tải PNG hoặc SVG về máy để in ấn, hoặc bấm sao chép để dán trực tiếp vào tài liệu, slide thuyết trình.</p>

      <blockquote>💡 <b>Mẹo:</b> Nếu cần tạo hàng loạt mã QR cùng lúc từ một danh sách link (ví dụ vài chục sản phẩm), Shurlvn có thêm tính năng "Tạo QR hàng loạt" dành cho gói Super, xuất luôn ra file Excel tiện quản lý.</blockquote>

      <h2>Một vài lưu ý khi dùng mã QR</h2>
      <ul>
        <li>Chọn độ tương phản màu đủ rõ giữa mã và nền để máy quét đọc được, tránh phối 2 màu quá gần nhau</li>
        <li>Nếu in mã QR kích thước nhỏ (dưới 2cm), nên chọn viền (margin) mặc định để mã không bị "nghẹt" khi in</li>
        <li>Luôn quét thử mã sau khi tạo trước khi in hàng loạt hoặc đăng công khai</li>
      </ul>
    `
  },
  {
    slug: "tao-ten-mien-rieng-cho-link",
    title: "Tạo Tên Miền Riêng Cho Link Rút Gọn — Hướng Dẫn Dành Cho Gói Super",
    description: "Hướng dẫn gắn tên miền riêng (custom domain) của bạn vào link rút gọn trên Shurlvn.com để tăng độ tin cậy và nhận diện thương hiệu — tính năng gói Super.",
    date: "2026-09-14",
    contentHtml: `
      <p>Một đường link dạng <b>shurlvn.com/abc123</b> đã ngắn gọn, nhưng nếu bạn đang xây dựng thương hiệu riêng, một link mang tên miền của chính bạn — ví dụ <b>di.tencongty.com/abc123</b> — sẽ tạo cảm giác chuyên nghiệp và đáng tin hơn hẳn với khách hàng. Đó chính là tính năng <b>tên miền riêng (custom domain)</b> trên Shurlvn.</p>

      <h2>Tên miền riêng là gì và vì sao nên dùng?</h2>
      <ul>
        <li><b>Nhận diện thương hiệu:</b> người nhận thấy ngay link đến từ công ty/thương hiệu của bạn, không phải một dịch vụ rút gọn lạ</li>
        <li><b>Tăng độ tin cậy:</b> khách hàng có xu hướng ngần ngại bấm vào link từ domain lạ hơn là domain quen thuộc của chính bạn</li>
        <li><b>Đồng bộ với các kênh khác:</b> link chia sẻ, mã QR trên bao bì hay email marketing đều mang cùng một tên miền nhất quán</li>
      </ul>

      <h2>Điều kiện sử dụng</h2>
      <p>Tên miền riêng hiện là tính năng dành riêng cho <b>gói Super</b> (chưa áp dụng ở các gói Free, Plus hay Pro). Bạn cần nâng cấp tài khoản lên gói Super trước khi thiết lập.</p>

      <h2>Các bước thiết lập tên miền riêng</h2>

      <h3>Bước 1: Nâng cấp lên gói Super</h3>
      <p>Vào mục <b>Bảng giá</b> trên Shurlvn, chọn gói Super và hoàn tất thanh toán.</p>

      <h3>Bước 2: Điền tên miền khi tạo link mới</h3>
      <p>Ở Dashboard, khi tạo một link rút gọn mới, bạn sẽ thấy thêm ô "Tên miền riêng" — điền tên miền bạn muốn dùng vào đây.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">Tạo Short URL</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input ph">https://tencongty.com/khuyen-mai-thang-9</div>
          <label class="mockup-label">Tên miền riêng</label>
          <div class="mockup-input ph">ten.shurl.com</div>
          <div class="mockup-btn">Tạo link</div>
        </div>
      </div>
      <p class="mockup-caption">Ô "Tên miền riêng" chỉ hiển thị và dùng được với tài khoản gói Super</p>

      <h3>Bước 3: Trỏ DNS tên miền của bạn về SHURL</h3>
      <p>Để tên miền riêng thực sự hoạt động (chứ không chỉ hiển thị dưới dạng chữ), bạn cần cấu hình bản ghi DNS của tên miền đó trỏ về hạ tầng của SHURL. Vì cấu hình DNS chính xác phụ thuộc vào tên miền và nhà cung cấp DNS của từng khách hàng, đội ngũ SHURL sẽ hỗ trợ trực tiếp bước này — liên hệ qua email <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@shurlvn.com&su=SHURL%20Custom%20Domain" target="_blank" rel="noopener">support@shurlvn.com</a> kèm tên miền bạn muốn sử dụng để được hướng dẫn trỏ DNS cụ thể.</p>

      <h2>Một vài lưu ý</h2>
      <ul>
        <li>Mỗi tên miền riêng chỉ nên gắn với một tài khoản để tránh xung đột khi quản lý link</li>
        <li>Sau khi trỏ DNS, thời gian để tên miền hoạt động có thể mất một khoảng thời gian ngắn để lan truyền (DNS propagation)</li>
        <li>Vẫn nên theo dõi thống kê lượt click như bình thường ngay cả khi dùng tên miền riêng</li>
      </ul>
    `
  },
  {
    slug: "cach-rut-gon-link-mien-phi",
    title: "Cách Rút Gọn Link (Cắt Link) Miễn Phí Chỉ Trong Vài Giây Với Shurlvn",
    description: "Link rút gọn là gì, vì sao nên dùng, và hướng dẫn cắt link miễn phí bằng Shurlvn.com — kèm ảnh minh hoạ giao diện thật, không cần đăng ký tài khoản.",
    date: "2026-09-14",
    contentHtml: `
      <p>Bạn từng phải gửi cho ai đó một đường link dài cả trăm ký tự, đầy tham số lạ và ký tự phần trăm loằng ngoằng? Đó chính là lý do các công cụ "cắt link" (rút gọn link) ra đời. Trong bài này, mình sẽ giải thích ngắn gọn link rút gọn là gì, vì sao nên dùng, và hướng dẫn cắt link chỉ trong vài giây bằng công cụ miễn phí <a href="https://shurlvn.com" target="_blank" rel="noopener">Shurlvn.com</a> — kèm ảnh minh hoạ giao diện thật của công cụ.</p>

      <h2>Link rút gọn là gì?</h2>
      <p>Nói đơn giản, đây là dịch vụ chuyển một đường dẫn (URL) dài, khó nhớ thành một liên kết ngắn gọn hơn nhiều, nhưng khi bấm vào vẫn dẫn thẳng tới đúng địa chỉ gốc. Ví dụ một link tải phần mềm dài gần 100 ký tự có thể được rút lại chỉ còn vài chục ký tự, dễ đọc, dễ gửi và trông chuyên nghiệp hơn hẳn.</p>

      <h2>Vì sao nên rút gọn link?</h2>
      <ul>
        <li><b>Dễ chia sẻ:</b> link ngắn gọn hơn khi gửi qua tin nhắn, in trên name card, hay đọc trực tiếp cho người khác nghe.</li>
        <li><b>Trông chuyên nghiệp, đáng tin hơn:</b> một link rõ ràng, ngắn gọn tạo thiện cảm hơn hẳn một chuỗi ký tự rối rắm dễ bị nhầm là link lừa đảo.</li>
        <li><b>Theo dõi được lượt click:</b> nhiều công cụ rút gọn link (trong đó có Shurlvn) cho phép xem link của bạn được bấm vào bao nhiêu lần, từ đâu.</li>
        <li><b>Tạo mã QR đi kèm:</b> từ một link rút gọn, bạn có thể xuất ngay mã QR để in ấn hoặc chia sẻ offline.</li>
      </ul>

      <h2>Hướng dẫn cắt link bằng Shurlvn.com (3 bước)</h2>
      <p>Khác với nhiều công cụ yêu cầu tạo tài khoản mới cho dùng, Shurlvn cho phép rút gọn link ngay lập tức mà không cần đăng ký — khách vãng lai được rút gọn miễn phí 5 link mỗi ngày.</p>

      <h3>Bước 1: Truy cập Shurlvn.com</h3>
      <p>Mở trình duyệt và vào thẳng <a href="https://shurlvn.com" target="_blank" rel="noopener">shurlvn.com</a>. Ngay trên trang chủ, bạn sẽ thấy khung "URL cần rút gọn" — không cần đăng nhập hay điền thông tin gì thêm.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <p class="mockup-card-sub">Nền tảng rút gọn link đa tầng — an toàn, thống kê chi tiết, quản lý chiến dịch.</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input ph">https://vi-du.com/duong-dan-rat-dai</div>
          <div class="mockup-btn">Rút gọn ngay</div>
        </div>
      </div>
      <p class="mockup-caption">Giao diện thật của trang chủ Shurlvn.com</p>

      <h3>Bước 2: Dán link cần rút gọn</h3>
      <p>Dán đường link dài của bạn vào ô nhập. Nếu tạo tài khoản (miễn phí), bạn còn có thể đặt tên ngắn gọn tuỳ ý cho link thay vì để hệ thống tự sinh ngẫu nhiên.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <p class="mockup-card-sub">Nền tảng rút gọn link đa tầng — an toàn, thống kê chi tiết, quản lý chiến dịch.</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://www.microsoft.com/vi-vn/software-download/windows11</div>
          <div class="mockup-btn">Rút gọn ngay</div>
        </div>
      </div>
      <p class="mockup-caption">Dán link gốc vào ô, ví dụ link tải Windows 11 từ Microsoft</p>

      <h3>Bước 3: Bấm "Rút gọn ngay" và nhận kết quả</h3>
      <p>Chỉ sau chưa đầy 1 giây, hệ thống trả về ngay đường link rút gọn kèm nút "Chép" tiện lợi. Ví dụ dưới đây là một link rút gọn thật mình vừa tạo trực tiếp trên Shurlvn.com khi viết bài này — bạn có thể bấm thử.</p>
      <div class="mockup">
        <div class="mockup-topbar"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-url">shurlvn.com</span></div>
        <div class="mockup-body">
          <div class="mockup-brand">SHORT URL</div>
          <p class="mockup-card-title">SHURL</p>
          <p class="mockup-card-sub">Nền tảng rút gọn link đa tầng — an toàn, thống kê chi tiết, quản lý chiến dịch.</p>
          <label class="mockup-label">URL cần rút gọn</label>
          <div class="mockup-input">https://www.microsoft.com/vi-vn/software-download/windows11</div>
          <div class="mockup-btn">Rút gọn ngay</div>
          <div class="mockup-result"><a class="link" href="https://shurlvn.com/cVQgKz" target="_blank" rel="noopener">https://shurlvn.com/cVQgKz</a><span class="copy">Chép</span></div>
          <div class="mockup-dest">Đích: https://www.microsoft.com/vi-vn/software-download/windows11</div>
        </div>
      </div>
      <p class="mockup-caption">Link rút gọn thật, tạo trực tiếp từ Shurlvn.com — bấm để kiểm chứng</p>

      <blockquote>💡 <b>Mẹo:</b> Ngay trên trang chủ Shurlvn còn có sẵn công cụ tạo mã QR miễn phí. Sau khi có link rút gọn, bạn có thể chuyển luôn thành mã QR để dán lên poster, tờ rơi hay slide thuyết trình — không cần thêm phần mềm nào khác.</blockquote>

      <h2>Một số lưu ý khi dùng link rút gọn</h2>
      <ul>
        <li>Luôn kiểm tra nguồn gốc link trước khi bấm vào link rút gọn từ người lạ, vì bản chất link đã được "che" địa chỉ thật</li>
        <li>Với nhu cầu cá nhân/dự án nhỏ, dùng miễn phí là đủ; nếu cần đặt tên riêng, xem thống kê chi tiết hay quản lý số lượng lớn link, nên tạo tài khoản</li>
        <li>Một số nền tảng mạng xã hội có thể giới hạn hiển thị với link rút gọn lạ — nên ưu tiên dịch vụ uy tín, có tên miền rõ ràng như Shurlvn</li>
      </ul>
    `
  },
  {
    slug: "cach-cai-dat-windows-11",
    title: "Hướng Dẫn Cách Cài Đặt Windows 11 Bằng USB Nhanh Nhất (Cập Nhật 2026)",
    description: "Hướng dẫn từng bước cài đặt Windows 11 bằng USB: kiểm tra cấu hình, tải ISO, tạo USB boot bằng Rufus và cài đặt hoàn chỉnh — đơn giản, dễ làm theo.",
    date: "2026-09-14",
    contentHtml: `
      <p>Windows 11 mang đến giao diện hiện đại, hiệu năng mượt mà và nhiều tính năng bảo mật vượt trội so với người tiền nhiệm. Nếu bạn đang muốn tự tay nâng cấp hệ điều hành cho máy tính của mình mà không cần mang ra tiệm, bài viết dưới đây sẽ hướng dẫn bạn toàn bộ quy trình cài đặt Windows 11 bằng USB, từ A đến Z, chỉ trong vài bước đơn giản.</p>

      <h2>Bước 1: Kiểm tra xem máy tính của bạn có "chạy" được Windows 11 không</h2>
      <p>Trước khi tải bất cứ thứ gì, hãy dành 2 phút kiểm tra cấu hình máy. Vào <b>Settings &gt; System &gt; About</b>, bạn sẽ thấy các thông tin cơ bản như dòng CPU, dung lượng RAM và loại hệ thống (32-bit hay 64-bit). Đây là bước quan trọng vì Windows 11 có yêu cầu phần cứng khắt khe hơn Windows 10, đặc biệt là về chip bảo mật TPM 2.0 và Secure Boot. Bỏ qua bước này có thể khiến bạn tải nhầm phiên bản hoặc cài đặt thất bại giữa chừng.</p>

      <h2>Bước 2: Tải file ISO Windows 11 chính chủ từ Microsoft</h2>
      <p>Truy cập trang tải xuống chính thức của Microsoft, chọn ngôn ngữ phù hợp và tải bản Windows 11 64-bit — đây cũng là phiên bản duy nhất mà Microsoft hiện phân phối cho hệ điều hành này. File ISO khá nặng (thường trên 5GB) nên hãy đảm bảo đường truyền internet ổn định trong lúc tải.</p>
      <blockquote>💡 <b>Mẹo nhỏ:</b> Đường link tải ISO từ Microsoft khá dài và khó nhớ, bạn có thể dùng công cụ rút gọn link miễn phí tại <a href="https://shurlvn.com" target="_blank" rel="noopener">shurlvn.com</a> để tạo short-link hoặc lưu lại dưới dạng mã QR quét trên điện thoại nhanh chóng — cực tiện khi bạn cần gửi link cho đồng nghiệp hoặc lưu lại để tải trên máy khác mà không phải gõ lại cả đường dẫn dài ngoằn ngoèo.</blockquote>

      <h2>Bước 3: Tạo USB Boot bằng Rufus</h2>
      <p>Sau khi có file ISO, bạn cần một chiếc USB (tối thiểu 8GB) và phần mềm Rufus để biến nó thành USB cài đặt. Cắm USB vào máy, mở Rufus lên và thực hiện theo thứ tự:</p>
      <ul>
        <li>Chọn đúng USB ở mục thiết bị</li>
        <li>Trỏ tới file ISO Windows 11 vừa tải</li>
        <li>Chọn phân vùng <b>GPT</b> nếu máy dùng UEFI, hoặc <b>MBR</b> nếu máy dùng BIOS đời cũ</li>
        <li>Định dạng hệ thống file là <b>NTFS</b> hoặc <b>FAT32</b></li>
      </ul>
      <p>Sau khi bấm Start, Rufus sẽ tự động xử lý phần còn lại, thường chỉ mất vài phút tùy tốc độ USB.</p>
      <blockquote>💡 <b>Mẹo tiện lợi:</b> Bạn cần chia sẻ link tải file ISO hoặc bộ phần mềm Rufus cho bạn bè? Hãy dùng ngay <a href="https://shurlvn.com" target="_blank" rel="noopener">Rút Gọn Link Shurlvn</a> để biến đường link dài ngoằn ngoèo thành link ngắn gọn chỉ trong 3 giây!</blockquote>

      <h2>Bước 4: Cài đặt Windows 11 từ USB</h2>
      <p>Khởi động lại máy tính và boot vào USB vừa tạo (thường bằng cách nhấn F12, F2 hoặc Del khi máy vừa mở, tùy dòng máy). Khi màn hình cài đặt hiện ra:</p>
      <ol>
        <li>Nhấn <b>Install now</b></li>
        <li>Nhập key bản quyền (hoặc chọn "Tôi không có key" để cài trước, kích hoạt sau)</li>
        <li>Chọn phiên bản <b>Windows 11 Pro</b></li>
        <li>Đồng ý điều khoản sử dụng</li>
        <li>Chọn kiểu cài đặt <b>Custom</b></li>
        <li>Chọn ổ đĩa muốn cài Windows vào</li>
      </ol>
      <p>Quá trình cài đặt sẽ tự động diễn ra và mất khoảng 10–30 phút, tùy cấu hình máy.</p>

      <h2>Một vài lưu ý trước khi bắt tay vào làm</h2>
      <ul>
        <li>Sao lưu dữ liệu quan trọng trước khi cài, phòng trường hợp chọn nhầm ổ đĩa</li>
        <li>Đảm bảo mạng internet ổn định trong suốt quá trình</li>
        <li>Tạm tắt phần mềm diệt virus để tránh xung đột khi tạo USB boot</li>
        <li>Nếu dùng laptop, hãy cắm sạc đầy đủ, tránh cài dở dang do hết pin</li>
        <li>Ghi lại key bản quyền (nếu có) ở nơi dễ tìm</li>
      </ul>
    `
  }
];

export function isPostPublished(post) {
  const today = new Date().toISOString().split("T")[0];
  return post.date <= today;
}

export async function seedBlogPostsIfNeeded(env) {
  const flag = await env.LINKS_KV.get("seed:blog:v1");
  if (flag) return;
  await Promise.all(BLOG_POSTS_SEED.map(p => env.LINKS_KV.put("blog:" + p.slug, JSON.stringify(p))));
  await env.LINKS_KV.put("seed:blog:v1", "1");
}

export async function listAllBlogPosts(env) {
  const list = await env.LINKS_KV.list({ prefix: "blog:" });
  const raws = await Promise.all(list.keys.map(k => env.LINKS_KV.get(k.name)));
  const posts = raws.filter(Boolean).map(r => JSON.parse(r));
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); // newest date first
  return posts;
}

export async function getPublishedBlogPosts(env) {
  const all = await listAllBlogPosts(env);
  return all.filter(isPostPublished);
}

export async function getBlogPost(env, slug) {
  const raw = await env.LINKS_KV.get("blog:" + slug);
  return raw ? JSON.parse(raw) : null;
}

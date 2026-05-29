## Ngữ cảnh từ các bài trước (Context)
Bài 03 xác lập repo là nguồn sự thật mà agent có thể đọc được: hướng dẫn, ràng buộc, lệnh xác minh và trạng thái phải được lưu bền vững trong workspace thay vì nằm trong trí nhớ con người hay hội thoại tạm thời. Tuy nhiên, việc đưa tri thức vào repo chưa đủ; nếu dồn toàn bộ tri thức vào một tệp đầu vào quá lớn, agent lại khó tìm thấy điều quan trọng và tốn ngữ cảnh không cần thiết.

## Tóm tắt Bài 04
- **Luận điểm trung tâm:** `AGENTS.md` không nên là bách khoa toàn thư của dự án. Nó nên là một tệp định tuyến ngắn, đưa agent đến đúng tài liệu chi tiết theo nhiệm vụ hiện tại.
- **Vòng lặp gây phình hướng dẫn:** Mỗi khi agent phạm lỗi, nhóm thêm một quy tắc mới vào cùng tệp. Cách sửa cục bộ này tích lũy dần thành tệp lớn, chứa quy tắc không còn liên quan, trùng lặp hoặc mâu thuẫn.
- **Chi phí ngữ cảnh:** Tệp hướng dẫn lớn tiêu thụ cửa sổ ngữ cảnh trước khi agent đọc mã, chạy công cụ và phân tích kết quả. Một tác vụ sửa lỗi đơn giản có thể bị buộc phải mang theo hướng dẫn triển khai, lịch sử sự cố và quy tắc của module không liên quan.
- **Hiệu ứng "lạc giữa đường":** Bài giảng dựa trên nghiên cứu *Lost in the Middle* để chỉ ra rằng thông tin quan trọng bị chôn ở giữa văn bản dài dễ bị sử dụng kém hơn thông tin ở đầu hoặc cuối. Vì vậy, một ràng buộc bảo mật trong giữa tệp dài có nguy cơ bị bỏ qua.
- **Mơ hồ về ưu tiên:** Khi ràng buộc bắt buộc, khuyến nghị thiết kế và ghi chú lịch sử nằm cùng một danh sách, agent khó nhận biết điều nào không được vi phạm. Mâu thuẫn tích lũy cũng làm hành vi thiếu nhất quán.
- **Instruction SNR:** Chất lượng tệp hướng dẫn phụ thuộc vào tỷ lệ nội dung liên quan với tác vụ đang làm. Hướng dẫn không liên quan làm giảm tín hiệu, khiến agent tốn lượt đọc mà không cải thiện quyết định.
- **Progressive disclosure:** Chỉ cung cấp tổng quan và luật toàn cục khi bắt đầu; tải chi tiết API, database, testing hoặc deployment khi tác vụ thực sự chạm tới chủ đề đó. Cách này giữ ngữ cảnh tập trung vào công việc hiện tại.
- **Cấu trúc khuyến nghị cho `AGENTS.md`:** Duy trì khoảng 50-200 dòng, gồm mô tả dự án ngắn, lệnh khởi động/xác minh, tối đa một nhóm nhỏ ràng buộc cứng toàn cục, và danh sách liên kết đến tài liệu chủ đề kèm điều kiện phải đọc.
- **Tài liệu theo chủ đề:** Đưa các quy tắc chi tiết vào các tệp như `docs/api-patterns.md`, `docs/database-rules.md` và `docs/testing-standards.md`, hoặc đặt chúng cạnh module mà chúng chi phối. Type và chú thích cấu hình nên nằm trực tiếp trong mã khi đó là nơi agent tự nhiên đọc tới.
- **Bảo trì hướng dẫn như mã:** Mỗi hướng dẫn nên thể hiện lý do tồn tại, phạm vi áp dụng và lúc có thể xóa. Cần kiểm toán định kỳ để loại bỏ quy tắc lỗi thời, dư thừa hoặc mâu thuẫn; ghi chú sự cố có thể chuyển thành test thay vì sống mãi trong tệp hướng dẫn.
- **Kết quả ví dụ thực tế trong bài:** Sau khi một nhóm cắt `AGENTS.md` từ 600 xuống 80 dòng và tách tài liệu chủ đề, bài giảng báo cáo tỷ lệ thành công tác vụ tăng từ 45% lên 72%, còn tuân thủ ràng buộc bảo mật tăng từ 60% lên 95%.

### Minh họa từ ví dụ kèm bài
- `AGENTS-short.md` minh họa một entrypoint gọn: chỉ nêu tài liệu phải đọc, lệnh `npm run dev`/`npm run check`, và ba quy tắc cứng về ranh giới Electron, xác minh và trạng thái bàn giao.
- `anti-patterns.md` liệt kê các dấu hiệu cần tránh: gom toàn bộ kiến thức vào một tệp, lặp quy tắc nhiều nơi, giữ luật lỗi thời, viết điều kiện quá chuyên biệt, và đưa hướng dẫn công cụ dài vào ngữ cảnh khởi động.
- `split-vs-monolithic.ts` mô phỏng tìm quy tắc trong một tệp 200 dòng so với bốn tệp chủ đề 50 dòng. Với bốn truy vấn mẫu, cách nguyên khối cần đọc trung bình khoảng 126 dòng, còn cách chia nhỏ chỉ khoảng 26 dòng; theo phép tính của script, lượng đọc trung bình giảm xấp xỉ 79%.

## Sự liên kết / Giải quyết vấn đề
Bài 03 yêu cầu đưa kiến thức vào repo để agent không phải đoán. Bài 04 bổ sung một giới hạn quan trọng: tri thức có thể khám phá được vẫn phải được định tuyến theo mức độ ưu tiên và phạm vi áp dụng. Nếu Bài 03 giải quyết việc "thông tin có tồn tại cho agent hay không", thì Bài 04 giải quyết việc "agent có thấy đúng thông tin vào đúng lúc hay không". Thiết kế kết hợp là một entrypoint ngắn trỏ đến tài liệu và trạng thái nằm gần phần mã liên quan, nhờ đó vừa vượt qua cold-start test vừa bảo vệ ngân sách ngữ cảnh.

## Bài tập / Hành động tiếp theo
- Kiểm toán một tệp chỉ dẫn hiện có: chọn năm loại tác vụ thường gặp, đánh dấu quy tắc nào thực sự áp dụng cho từng tác vụ, rồi xác định phần nội dung đang làm giảm Instruction SNR.
- Nếu tệp đầu vào vượt quá khoảng 300 dòng, tách nó thành một routing file ngắn và 3-5 tài liệu chủ đề; giữ luật cứng toàn cục ở vị trí dễ thấy và ghi rõ khi nào cần đọc từng tệp chi tiết.
- Chuyển các ghi chú lịch sử có thể kiểm chứng thành test hoặc validation tự động, thay vì tiếp tục thêm cảnh báo dài vào entrypoint.
- Trong Project 02, áp dụng đồng thời Bài 03 và 04: dùng tài liệu repo cùng `session-handoff.md` để duy trì ngữ cảnh giữa phiên, nhưng tổ chức entrypoint đủ gọn để phiên mới nhanh chóng tìm đúng kiến trúc, sản phẩm, tiến độ và lệnh xác minh.

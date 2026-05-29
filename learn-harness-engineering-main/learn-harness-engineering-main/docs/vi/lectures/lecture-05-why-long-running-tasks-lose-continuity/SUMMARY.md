## Ngữ cảnh từ các bài trước (Context)
Bài 04 chỉ ra rằng repo chỉ hữu ích cho agent khi thông tin được tổ chức đúng mức: `AGENTS.md` nên là entrypoint gọn, định tuyến đến tài liệu chuyên biệt thay vì nhồi mọi tri thức vào một tệp lớn. Khi một phiên đã tìm đúng hướng và bắt đầu triển khai, vẫn còn một vấn đề chưa giải quyết: phiên tiếp theo cần biết công việc đang ở đâu, quyết định nào đã được đưa ra và bằng chứng xác minh nào đã có.

## Tóm tắt Bài 05
- **Luận điểm trung tâm:** Agent làm tác vụ dài cần được đối xử như một kỹ sư giỏi nhưng mất ký ức sau mỗi phiên. Không thể dựa vào lịch sử hội thoại; trạng thái cần được ghi thành artifact bền vững trong repo để phiên mới tiếp tục chính xác.
- **Cửa sổ ngữ cảnh là hữu hạn:** Dù cửa sổ lớn đến đâu, một tác vụ đủ dài vẫn tiêu hao nó bởi mã nguồn, kết quả công cụ, lịch sử quyết định và trao đổi. Nâng kích thước context không thay thế việc quản lý trạng thái.
- **Mất phần "tại sao":** Mã đã sửa thường chỉ cho thấy kết quả cuối cùng, không cho thấy lý do chọn thiết kế B thay vì A hay lý do cố ý không tối ưu một phần. Nén hội thoại có thể giữ "đã làm gì" nhưng đánh mất "tại sao".
- **Context anxiety / hội tụ sớm:** Bài giảng dẫn nghiên cứu của Anthropic để mô tả việc agent gần hết ngữ cảnh có xu hướng vội kết luận, rút ngắn giải pháp hoặc bỏ qua xác minh. Vì vậy cần chuẩn bị bàn giao trước khi context bị dồn đến giới hạn.
- **Chi phí tái xây dựng (rebuild cost):** Phiên mới không có bàn giao phải đọc lại repo, đoán ý định và chạy lại xác minh trước khi làm tiếp. Mục tiêu của harness là giảm thời gian phục hồi trạng thái xuống mức rất ngắn, bài giảng đặt mốc tham chiếu khoảng ba phút.
- **Trôi dạt (drift):** Nếu mỗi phiên tự tái diễn giải mục tiêu và quyết định cũ, triển khai dần lệch khỏi yêu cầu hoặc làm lại công việc đã hoàn thành. Drift tích lũy mạnh nhất khi không ghi lại tiến độ, vấn đề mở và tiêu chí xác minh.
- **Artifact tính liên tục tối thiểu:** Một `PROGRESS.md` hoặc `session-handoff.md` phải ghi trạng thái repo, phần đã hoàn thành, phần đang làm, lỗi/vướng mắc đã biết, kết quả test/lint và bước tốt nhất tiếp theo.
- **Lưu lý do thiết kế:** Với quyết định ảnh hưởng lâu dài, dùng `DECISIONS.md` để ghi quyết định, lý do, phương án bị loại và ràng buộc đi kèm. Đây là phần giúp phiên sau không vô tình đảo ngược một lựa chọn có chủ ý.
- **Git checkpoint và luồng khởi tạo:** Commit nhỏ sau các đơn vị công việc đã xác minh tạo mốc trạng thái có thể truy vết. `AGENTS.md` hoặc script khởi tạo cần yêu cầu phiên mới đọc handoff/quyết định và chạy kiểm tra nền trước khi tiếp tục; trước khi kết thúc phiên phải cập nhật handoff và xác minh lại.
- **Nén và đặt lại là hai công cụ khác nhau:** Nén giữ phiên đang chạy nhưng có thể làm mất rationale; mở phiên mới loại bỏ áp lực context nhưng chỉ hiệu quả nếu artifact bàn giao đủ rõ. Harness nên chọn chiến lược theo độ dài tác vụ và đặc tính agent/mô hình đang dùng.
- **Quy tắc thực dụng:** Tác vụ ngắn có thể hoàn thành trong một phiên; tác vụ dài hoặc đã dùng phần lớn ngân sách ngữ cảnh phải chủ động tạo/cập nhật artifact bàn giao trước khi dừng.

### Minh họa từ ví dụ kèm bài
- `continuity-checklist.md` đặt bốn câu hỏi phục hồi: agent mới có biết công việc gần đây trong dưới năm phút, có thấy đường khởi động ổn định, công việc chưa xong và tác vụ tiếp theo hay không.
- `session-handoff.md` minh họa một bàn giao ngắn nhưng hành động được: liệt kê phần đã hoàn thành, phần hỏng/chưa xác minh và bước tốt nhất tiếp theo.
- `session-simulator.ts` mô phỏng sáu bước công việc qua hai phiên. Không có handoff, phiên B làm lại ba bước đầu, tổng công giả lập là `590ms`; có handoff, phiên B bắt đầu từ bước 4, tổng công còn `400ms`, tránh toàn bộ ba bước trùng lặp và tiết kiệm `190ms`.

## Sự liên kết / Giải quyết vấn đề
Bài 04 tối ưu cách agent **tìm tri thức cần thiết** khi bắt đầu làm việc; Bài 05 bổ sung cách agent **mang trạng thái công việc đã hình thành** qua một phiên mới. Một routing file gọn giúp khởi động đúng hướng, nhưng handoff, progress log, decision log, bằng chứng xác minh và git checkpoint mới ngăn phiên sau khám phá lại hoặc thay đổi ý định cũ. Đây là bước chuyển từ repo như thư viện hướng dẫn sang repo như bản ghi vận hành liên tục.

Project 03 áp dụng trực tiếp ý tưởng này: so sánh luồng làm việc thiếu artifact restart với solution có `init.sh`, `session-handoff.md`, `claude-progress.md`, `clean-state-checklist.md` và bằng chứng trong `feature_list.json`. Tiêu chuẩn không chỉ là agent tạo ra tính năng, mà là một phiên mới có thể khôi phục trạng thái và tiếp tục mà không đánh dấu hoàn thành khi chưa xác minh.

## Bài tập / Hành động tiếp theo
- Chọn một tác vụ cần nhiều phiên và đo thời gian phiên mới phải bỏ ra để hiểu trạng thái khi không có handoff; sau đó lặp lại với một tệp bàn giao có cấu trúc để so sánh rebuild cost.
- Viết mẫu `session-handoff.md` tối giản gồm commit/trạng thái repo, kết quả xác minh, phần đã hoàn thành, blockers và bước tiếp theo; thử cho một phiên mới chỉ dựa vào mẫu này để tiếp tục.
- Lưu các quyết định có khả năng bị đảo ngược vào `DECISIONS.md`, gồm lý do chọn và phương án đã loại, thay vì chỉ lưu diff mã.
- Trong Project 03, duy trì vòng đời phiên: đọc handoff và chạy kiểm tra lúc bắt đầu; cập nhật tiến độ, kết quả kiểm tra và checkpoint khi kết thúc.
- Sang Bài 06, tìm hiểu cách chuẩn hóa chính bước khởi tạo phiên để việc phục hồi trạng thái không còn phụ thuộc vào agent tự nhớ phải đọc artifact nào.

## Ngữ cảnh từ các bài trước (Context)
Bài 02 định nghĩa harness là hạ tầng bên ngoài mô hình gồm hướng dẫn, công cụ, môi trường, trạng thái và phản hồi. Qua thực hành Project 01, việc công khai đường chạy PowerShell và bắt buộc `check`/`test`/`build` đã cải thiện độ tin cậy; các lượt ablation đồng thời cho thấy thiếu artefact trạng thái làm giảm khả năng truy vết và tiếp tục công việc, ngay cả khi chức năng cuối cùng vẫn chạy đúng.

## Tóm tắt Bài 03
- **Luận điểm trung tâm:** Với agent, kiến thức không nằm trong repo về thực chất là không tồn tại. Agent chỉ thấy prompt, tệp trong workspace và kết quả công cụ; nó không thể tự hỏi đồng nghiệp hay truy cập các quyết định đang nằm trong Slack, Jira, Confluence hoặc trí nhớ con người.
- **Repo là system of record:** Kho mã phải là nguồn có thẩm quyền cho quyết định kiến trúc, ràng buộc kỹ thuật, lệnh vận hành, tiêu chuẩn xác minh và trạng thái hiện tại. Đây là cách biến “repo là spec” thành điều kiện làm việc thực tế cho agent.
- **Knowledge Visibility Gap:** Khoảng cách giữa tổng kiến thức cần để phát triển dự án và phần đã được biểu diễn trong repo. Khoảng cách càng lớn, agent càng phải đoán; sai sót và chi phí khôi phục ngữ cảnh ở mỗi phiên mới càng tăng.
- **Cold-start test:** Một phiên agent mới, chỉ đọc repo, cần trả lời được năm câu hỏi:
  1. Hệ thống này là gì?
  2. Nó được tổ chức như thế nào?
  3. Chạy nó bằng cách nào?
  4. Xác minh kết quả bằng cách nào?
  5. Công việc đang ở trạng thái nào?
  Nếu thiếu câu trả lời, repo chưa đóng vai trò bản đồ đầy đủ.
- **Discovery Cost và Knowledge Decay:** Thông tin có tồn tại nhưng bị chôn sâu vẫn tiêu tốn ngữ cảnh để tìm; tài liệu lỗi thời còn nguy hiểm hơn thiếu tài liệu vì dẫn agent ra quyết định sai với sự tự tin giả.
- **Bốn nguyên tắc đặt kiến thức:**
  1. Đặt kiến thức gần phần mã mà nó chi phối, như `ARCHITECTURE.md` hoặc `CONSTRAINTS.md` tại module liên quan.
  2. Dùng entrypoint chuẩn như `AGENTS.md`/`CLAUDE.md` để trỏ nhanh đến mục tiêu, cách chạy, cách kiểm chứng và các luật cứng.
  3. Viết tối giản nhưng đủ để vượt qua cold-start test, thay vì tích lũy tài liệu dài không phục vụ quyết định.
  4. Cập nhật tài liệu cùng thay đổi mã để giảm suy giảm kiến thức.
- **Cấu trúc repo gợi ý:** `AGENTS.md` ở gốc làm bản đồ vào hệ thống; tài liệu kiến trúc/ràng buộc đặt gần module; `PROGRESS.md` hoặc feature list ghi tiến độ; `Makefile` hay package scripts cung cấp lệnh chuẩn để chạy và xác minh.
- **ACID cho trạng thái agent:**
  - **Atomicity:** mỗi thay đổi logic nên là một đơn vị có thể hoàn thành hoặc khôi phục sạch, thường gắn với commit.
  - **Consistency:** chỉ coi trạng thái là hợp lệ khi các kiểm tra như test, lint, type-check đạt.
  - **Isolation:** tách công việc song song bằng branch hoặc tệp tiến độ riêng để agent không ghi đè nhau.
  - **Durability:** kiến thức cần dùng xuyên phiên phải nằm trong tệp được git theo dõi, không chỉ trong hội thoại hoặc trí nhớ tạm thời.
- **Kinh nghiệm chuyển đổi:** Một nhóm microservices giảm đáng kể việc phải can thiệp thủ công sau khi gom tri thức quan trọng vào `AGENTS.md`, tài liệu kiến trúc theo service, tệp ràng buộc rõ ràng và `PROGRESS.md`. Bài học là chất lượng agent tăng khi ràng buộc ẩn trở thành thông tin agent có thể đọc.

### Minh họa từ ví dụ kèm bài
- `system-of-record-checklist.md` chuyển cold-start test thành danh sách kiểm tra thực dụng: sản phẩm, hành vi người dùng, kiến trúc, startup, health check, tiến độ và tiêu chuẩn chất lượng có khám phá được từ repo hay không.
- `repo-knowledge-layout.txt` minh họa layout gọn: entrypoint `AGENTS.md`, thư mục `docs/` chứa kiến trúc/sản phẩm/độ tin cậy, rồi mới tới `src/` và `scripts/`.
- `repo-reader.ts` là bộ chấm điểm discoverability 100 điểm dựa trên dấu hiệu có thể đọc được của repo: instruction entrypoint, docs, kiến trúc, feature tracking, handoff/progress, test, cấu hình và README. Script đo khả năng tìm thấy artefact, không tự chứng minh rằng nội dung artefact đúng hoặc còn mới.

## Sự liên kết / Giải quyết vấn đề
Bài 02 nói harness cần có hướng dẫn, trạng thái và phản hồi; Bài 03 trả lời câu hỏi các thành phần đó phải sống ở đâu và được tổ chức thế nào để phiên mới sử dụng được. Kết quả thực hành Bài 02 đã cho thấy rõ điều này: khi thiếu feature registry, code và test vẫn có thể pass nhưng evidence cho bàn giao bị đứt; khi hướng dẫn startup mâu thuẫn môi trường, agent gặp lỗi không phản ánh chất lượng sản phẩm. Vì vậy, repo làm system of record không chỉ hỗ trợ viết mã, mà còn bảo toàn tính liên tục, khả năng kiểm chứng và khả năng diễn giải kết quả thí nghiệm.

## Bài tập / Hành động tiếp theo
- Thực hiện cold-start test trên một workspace thực tế: yêu cầu phiên mới trả lời năm câu hỏi nền tảng chỉ từ nội dung repo, rồi ghi lại mọi câu phải đoán hoặc phải hỏi lại.
- Lập danh sách các quyết định/ràng buộc đang cần để phát triển, đánh dấu mục nào còn ngoài repo và tính `Knowledge Visibility Gap`; ưu tiên đưa tỷ lệ này xuống dưới 10%.
- Đánh giá trạng thái dự án theo ACID: thay đổi có khôi phục sạch không, Definition of Done có kiểm chứng được không, công việc song song có tách biệt không, và handoff/evidence có được lưu bền vững không.
- Áp dụng cho bước thực hành kế tiếp ở Project 02 bằng cách thiết kế workspace agent-readable: entrypoint ngắn, tài liệu kiến trúc gần mã, lệnh kiểm chứng rõ và artefact tiến độ để phiên sau tiếp tục không cần ngữ cảnh miệng.

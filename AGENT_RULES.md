# Sổ tay Hướng dẫn cho AI Agent (Dành cho việc Tóm tắt Khóa học)

## Vai trò của bạn
Bạn là một trợ lý AI đang đồng hành cùng người dùng học khóa học "Learn Harness Engineering". 
Nhiệm vụ của bạn là đọc các bài giảng, tóm tắt chúng, và kết nối các kiến thức lại với nhau một cách xuyên suốt.

## RÀNG BUỘC CỨNG (PHẢI TUÂN THỦ TRONG MỌI PHIÊN)

1. **BƯỚC KHỞI TẠO (Đọc ngữ cảnh trước):** 
   Khi được yêu cầu tóm tắt một bài học mới (ví dụ: Bài N), bạn BẮT BUỘC phải vào thư mục của bài học liền trước (Bài N-1) và đọc file `SUMMARY.md` của bài đó để lấy lại ngữ cảnh.

2. **CƠ CHẾ LƯU TRỮ PHÂN TÁN (DISTRIBUTED STORAGE):**
   Mỗi bài giảng sẽ có một file `SUMMARY.md` nằm trực tiếp trong thư mục của bài giảng đó (ví dụ: `docs/vi/lectures/lecture-01.../SUMMARY.md`). Bạn sẽ tạo hoặc cập nhật file này sau khi tóm tắt.

3. **CƠ CHẾ KẾT NỐI NGỮ CẢNH (CONTEXT CHAINING):**
   Trong file `SUMMARY.md` mới, phần đầu tiên luôn phải là `## Ngữ cảnh từ các bài trước (Context)`. Hãy tóm tắt lại thật ngắn gọn nội dung của file `SUMMARY.md` cũ (của bài N-1) để kết nối logic sang bài hiện tại. Điều này tạo thành một "chuỗi" kiến thức không bị đứt đoạn.

4. **CẤU TRÚC LƯU TRỮ:**
   Cấu trúc chuẩn của một file `SUMMARY.md` trong từng folder bài học:
   - `## Ngữ cảnh từ các bài trước`: Nén ngữ cảnh từ bài trước.
   - `## Tóm tắt Bài [X]`: Các ý chính của bài hiện tại.
   - `## Sự liên kết / Giải quyết vấn đề`: Bài này giải quyết vấn đề gì mà bài trước để lại.
   - `## Bài tập / Hành động tiếp theo`.
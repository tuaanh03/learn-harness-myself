# Tóm tắt: Tổng quan Khóa học (README)

## Ngữ cảnh từ các bài trước (Context)
Đây là phần mở đầu của khóa học "Learn Harness Engineering", thiết lập cái nhìn toàn cảnh và mục tiêu cốt lõi, do đó chưa có ngữ cảnh từ bài trước. Đây sẽ là điểm neo gốc cho toàn bộ chuỗi kiến thức.

## Tóm tắt Tổng quan (README)
- **Vấn đề cốt lõi:** Mô hình AI (dù thông minh đến đâu) cũng sẽ thất bại trong các tác vụ kỹ thuật thực tế nếu không có môi trường phù hợp. Harness (bộ yên cương) chính là môi trường đó.
- **Định nghĩa Harness:** Không làm mô hình thông minh hơn, mà làm cho kết quả đầu ra của nó đáng tin cậy hơn thông qua 5 hệ thống con:
  1. **Hướng dẫn (Instructions):** Phân chia rõ ràng (AGENTS.md) để AI biết làm gì.
  2. **Trạng thái (State):** Nhật ký tiến trình, giúp AI không "mất trí nhớ" giữa các phiên.
  3. **Kiểm chứng (Verification):** Test, lint ép AI phải có bằng chứng trước khi báo cáo "đã xong".
  4. **Phạm vi (Scope):** Chỉ làm 1 tính năng mỗi lần, giới hạn bằng danh sách tính năng.
  5. **Vòng đời phiên (Session Lifecycle):** Khởi tạo rõ ràng, dọn dẹp sạch sẽ khi kết thúc.
- **Dự án thực hành (Capstone):** Xây dựng ứng dụng Desktop Personal Knowledge Base bằng Electron qua 6 giai đoạn tiến hóa (P01 - P06).

## Sự liên kết / Giải quyết vấn đề
Tài liệu này giải quyết vấn đề "lạc lối" của người học, cung cấp bức tranh toàn cảnh về tư duy (Shift mindset từ "prompt engineering" sang "harness engineering") và làm nền móng để đi sâu vào 12 bài giảng tiếp theo.

## Bài tập / Hành động tiếp theo
- **Bắt đầu nhanh:** Thử tạo 4 file cơ bản (`AGENTS.md`, `init.sh`, `feature_list.json`, `progress.md`) cho một dự án hiện tại để thấy ngay sự khác biệt.
- **Theo lộ trình:** Tiến tới **Bài giảng 01 (L01): Mô hình Mạnh Không có nghĩa là Thực thi Đáng tin cậy**.
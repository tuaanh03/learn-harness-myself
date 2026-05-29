# Tóm tắt: Bài 01. Mô hình Mạnh Không có nghĩa là Thực thi Đáng tin cậy

## Ngữ cảnh từ các bài trước (Context)
Từ Tổng quan (README): Mô hình AI dù thông minh đến đâu cũng sẽ thất bại nếu thiếu môi trường phù hợp (Harness). Harness không làm AI thông minh hơn, mà ép nó làm việc đáng tin cậy thông qua 5 hệ thống con: Hướng dẫn, Trạng thái, Kiểm chứng, Phạm vi, và Vòng đời. 

## Tóm tắt Bài 01
- **Sự thật cốt lõi:** Cùng một mô hình (như GPT-4o hay Claude), nếu chạy "trần" sẽ thất bại, nếu có Harness sẽ thành công. Lỗi thường nằm ở cấu trúc môi trường, không phải do mô hình "ngu".
- **Khoảng cách xác minh:** Chế độ lỗi phổ biến nhất là AI tự tin hô "đã xong" dù code chưa chạy được, vì nó thiếu công cụ để tự test.
- **Khi gặp lỗi, sửa Harness trước:** Đừng vội đổi mô hình. Hãy dùng "Vòng lặp chẩn đoán" (Gặp lỗi -> Tìm nguyên nhân do môi trường -> Sửa Harness -> Chạy lại).
- **Hành động thiết thực nhất:** Viết "Định nghĩa hoàn thành" rõ ràng (VD: phải pass test nào) và tạo ngay file `AGENTS.md` ở thư mục gốc để chứa luật của dự án.

## Sự liên kết / Giải quyết vấn đề
Bài này là minh chứng thực tế cho tư duy "chuyển dịch sang Harness" đã nêu ở phần README. Nó giải quyết sai lầm cốt lõi của lập trình viên: thói quen đổ lỗi cho AI và đổi mô hình liên tục. Đồng thời, nó cung cấp công cụ phòng vệ lớp đầu tiên cho 5 hệ thống con, đó là file Hướng dẫn `AGENTS.md`.

## Bài tập / Hành động tiếp theo
- **Thí nghiệm so sánh:** Chạy thử agent chạy "trần" vs. chạy với `AGENTS.md`.
- **Đo lường:** Tính tỷ lệ "báo cáo láo" của AI (khoảng cách xác minh).
- **Vòng lặp chẩn đoán:** Gặp lỗi -> Xác định loại lỗi -> Sửa Harness -> Chạy lại.

### Kết quả thực hành Project 01: Prompt-only vs. Minimal Harness

Đã thực hiện hai lượt trên ứng dụng Electron knowledge base của `projects/project-01`:

| Tiêu chí | Experiment A: Prompt-only | Experiment B: Có Harness |
|---|---|---|
| Ngữ cảnh ban đầu | Chỉ có prompt mô tả ứng dụng | Có `AGENTS.md`, tài liệu kiến trúc/sản phẩm và `feature_list.json` |
| Kết luận của agent | Tuyên bố `Implementation is done` | Cập nhật bằng chứng hoàn thành theo từng feature |
| Type check | Thất bại khi xác minh độc lập | `npm.cmd run check`: pass |
| Test | Không có test file | `npm.cmd test`: pass, 2/2 test |
| Build | Pass nhưng không phát hiện lỗi type của renderer | `npm.cmd run build`: pass |
| Trạng thái / bằng chứng | Không có feature list hoặc progress artifact | `feature_list.json` ghi bằng chứng cho 8 feature |

#### Phát hiện chính

- **Verification Gap của lượt prompt-only:** Agent A báo hoàn thành, nhưng kiểm tra độc lập phát hiện lỗi TypeScript ở phần renderer (sai đường dẫn import type và kiểu `any` ngầm định). Với một lần báo hoàn thành và một lần bị chứng minh chưa đạt, verification gap quan sát được là `1/1 = 100%`.
- **Harness tạo ra kết quả có thể kiểm tra:** Agent B có quy tắc dự án và tiêu chí xác minh rõ ràng, bổ sung bài test vòng đời cho import, indexing, Q&A có citation, lưu lịch sử và dọn dữ liệu khi xóa.
- **Build đơn lẻ chưa phải Definition of Done:** Build của A vẫn chạy được dù type-check renderer thất bại; vì vậy cần kết hợp `check`, `test` và `build`, thay vì chỉ dựa vào một tín hiệu.

#### Quy lỗi theo năm lớp phòng thủ

| Quan sát | Lớp harness liên quan |
|---|---|
| Prompt A mơ hồ nhưng agent tự mở rộng phạm vi thay đổi lớn | Đặc tả tác vụ |
| A không có hướng dẫn kiến trúc hoặc feature contract cục bộ | Cung cấp ngữ cảnh |
| A không có dependencies khả dụng tại thời điểm tự kiểm chứng | Môi trường thực thi |
| A tuyên bố xong dù type-check thực tế thất bại và không có test | Phản hồi xác minh |
| A không có artefact lưu tiến độ; B cập nhật feature list nhưng ban đầu chưa cập nhật progress log | Quản lý trạng thái |

#### Giới hạn của thí nghiệm

- `experiment-b` được khởi tạo từ thư mục `solution`, vốn đã chứa harness và các feature nền được đánh dấu `pass`. Vì vậy kết quả minh họa độ tin cậy và chất lượng kiểm chứng tốt hơn, nhưng không phải đối chứng tuyệt đối từ cùng một trạng thái mã khởi đầu.
- Lượt A có transcript lưu trong `results`, trong khi lượt B được quan sát tương tác và đánh giá qua artefact cùng các lệnh xác minh sau khi hoàn tất.

#### Kết luận thực hành

Kết quả củng cố luận điểm của Bài 01: năng lực sinh mã không đồng nghĩa với thực thi đáng tin cậy. Vấn đề ở lượt A không phải agent không thể viết mã, mà là thiếu harness để chỉ định phạm vi, chuẩn bị môi trường, bắt buộc kiểm chứng và lưu trạng thái. Bước tiếp theo là kiểm toán năm hệ thống phụ của harness trong Bài 02, ưu tiên cải thiện môi trường chạy trên Windows và cơ chế lưu tiến độ.

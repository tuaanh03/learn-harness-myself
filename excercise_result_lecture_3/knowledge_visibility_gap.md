# Định lượng Ngoại hóa Kiến thức - Project 02

## Phạm vi đánh giá

- Workspace được quan sát: `projects/project-02/starter/`
- Bằng chứng trước handoff: `result_exercise_before_handoff`
- Bằng chứng sau handoff: `results_after_handoff.md`, `session-handoff.md`
- Mục tiêu: đo mức tri thức cần cho một phiên agent tiếp quản đã được biểu diễn rõ trong repo.

## Thang điểm

| Điểm | Ý nghĩa |
|---:|---|
| `1` | Kiến thức được ghi rõ trực tiếp trong artefact repo, phiên mới không cần suy luận. |
| `0.5` | Repo có dấu vết, nhưng phiên mới phải đọc mã, diff hoặc tự suy luận để kết luận. |
| `0` | Không có bằng chứng đủ tin cậy hoặc phiên mới phải hỏi lại. |

## Bước 4 - Bảng đánh giá Before / After Handoff

| STT | Kiến thức quan trọng | Before handoff | Bằng chứng before | After handoff | Bằng chứng after | Nhận xét |
|---:|---|---:|---|---:|---|---|
| 1 | Sản phẩm là gì và phục vụ người dùng thế nào | `1` | `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` | `1` | Cùng artefact | Đã rõ trước khi có handoff. |
| 2 | Phạm vi riêng của Project 02 | `1` | `feature_list.json` | `1` | `feature_list.json` | Tracker mô tả import, detail và persistence. |
| 3 | Các layer chính và ranh giới kiến trúc | `1` | `docs/ARCHITECTURE.md`, `AGENTS.md` | `1` | Cùng artefact | Không phụ thuộc handoff. |
| 4 | Cách cài đặt và chạy ứng dụng | `1` | `AGENTS.md`, `package.json` | `1` | Cùng artefact | Có lệnh khởi tạo/type-check và script dự án. |
| 5 | Cách xác minh một thay đổi | `0.5` | `AGENTS.md`, `package.json` | `0.5` | `AGENTS.md`, `package.json`, `session-handoff.md` | Có `check`, nhưng chưa có Definition of Done đầy đủ hoặc runtime evidence. |
| 6 | Feature đã hoàn thành và còn thiếu | `1` | `feature_list.json` | `1` | `feature_list.json`, `session-handoff.md` | Handoff xác nhận lại trạng thái đã có. |
| 7 | Phạm vi Session A đã thực hiện | `0.5` | Phải đối chiếu tracker và diff mã | `1` | `session-handoff.md` - `Scope Completed` | Handoff nói rõ chỉ làm `document-import`. |
| 8 | Import hiện chỉ hoạt động session-only | `0.5` | Evidence ngắn trong `feature_list.json`, cần đọc mã để hiểu hệ quả | `1` | `session-handoff.md` - `Scope Completed`, `Implementation Notes` | Sau handoff không cần đoán phạm vi triển khai. |
| 9 | Content chưa được lưu xuống filesystem | `0.5` | Cần suy luận từ `DocumentService` và các service phụ thuộc | `1` | `session-handoff.md` - `Explicitly Not Implemented` | Handoff ngoại hóa khoảng trống tích hợp quan trọng. |
| 10 | Kiểm chứng Session A thực sự đã chạy | `0.5` | `feature_list.json` chỉ ghi `npm run check passed` trong evidence của import | `1` | `session-handoff.md` - `Verification` | Sau handoff biết rõ đã chạy gì và chưa chạy Electron. |
| 11 | File đã thay đổi và lý do | `0.5` | Phải xem diff để nhận biết các file sửa | `0.5` | `session-handoff.md` liệt kê file nhưng không giải thích từng lý do | Có tiến bộ về danh sách, chưa đủ cho mục đích thay đổi. |
| 12 | Ưu tiên tiếp theo và lý do | `0.5` | Phiên mới chọn `document-detail` bằng suy luận từ tracker/TODO | `1` | `session-handoff.md` - `Notes For The Next Session` | Handoff làm rõ nhu cầu nối lại filesystem-backed persistence. |

## Tính điểm

### Before handoff

| Chỉ số | Kết quả |
|---|---:|
| Tổng điểm | `8.5 / 12` |
| Knowledge Externalization Score | `70.8%` |
| Knowledge Visibility Gap | `29.2%` |

Trước handoff, repo mô tả tốt sản phẩm, kiến trúc và trạng thái feature, nhưng phiên tiếp quản vẫn phải suy luận đáng kể về phạm vi triển khai thực tế, dữ liệu chưa được lưu, bằng chứng xác minh và ưu tiên kỹ thuật tiếp theo.

### After handoff

| Chỉ số | Kết quả |
|---|---:|
| Tổng điểm | `11 / 12` |
| Knowledge Externalization Score | `91.7%` |
| Knowledge Visibility Gap | `8.3%` |

Sau handoff, năm mục chuyển từ cần suy luận sang rõ ràng trực tiếp: phạm vi Session A, đặc tính session-only của import, việc content chưa được lưu, kiểm chứng đã chạy và hướng ưu tiên tiếp theo.

### Mức cải thiện

| Chỉ số | Before | After | Thay đổi |
|---|---:|---:|---:|
| Knowledge Externalization Score | `70.8%` | `91.7%` | `+20.9` điểm phần trăm |
| Knowledge Visibility Gap | `29.2%` | `8.3%` | `-20.9` điểm phần trăm |

## Bước 5 - Khoảng trống còn lại và cải tiến đề xuất

| Khoảng trống sau handoff | Bằng chứng | Rủi ro đối với phiên tiếp theo | Cải tiến đề xuất |
|---|---|---|---|
| Definition of Done chưa đủ rõ | `AGENTS.md` chỉ yêu cầu `npm install && npm run check`; handoff xác nhận chưa chạy Electron | Agent có thể báo hoàn tất dù luồng UI/runtime chưa được xác minh | Bổ sung vào `AGENTS.md` yêu cầu `check`, test/build khi áp dụng và smoke test Electron cho luồng người dùng thay đổi. |
| Evidence xác minh cho `document-import` chưa đủ sâu | `feature_list.json` và `session-handoff.md` thống nhất import là `pass`, còn persistence là `not-started`; tuy nhiên evidence mới ghi static check và chưa chạy Electron | Phiên mới biết trạng thái đúng nhưng chưa thể tin chắc hành vi UI import đã được kiểm thử thực tế | Ghi smoke test runtime của import vào tracker/handoff, đồng thời giữ ranh giới riêng giữa import và persistence. |
| Danh sách file sửa chưa có lý do theo từng file | `session-handoff.md` có mục `Files Changed` nhưng chỉ liệt kê đường dẫn | Phiên mới vẫn phải xem diff để phân biệt thay đổi chính, sửa lỗi build và thay đổi phụ | Ghi mỗi file kèm một dòng mục đích thay đổi trong handoff. |
| Chưa có bằng chứng hành vi runtime | `session-handoff.md` nói không chạy Electron; `feature_list.json` chỉ ghi static check pass | Chưa chứng minh chọn file, validation, hiển thị lỗi hoặc giới hạn 10 MB hoạt động thực tế | Chạy smoke test có kịch bản và ghi kết quả/evidence vào tracker hoặc handoff. |
| Evidence của feature kế thừa còn chung chung | Bốn feature cũ chỉ ghi `Carried over from P1 -- verified working` | Phiên mới không biết chúng đã được xác minh trên worktree hiện tại hay chưa | Ghi rõ evidence hiện hành hoặc đánh dấu chưa tái xác minh trong Project 02. |

## Kết luận

`feature_list.json` đã đủ tốt để cho phiên mới biết feature nào được công bố là hoàn thành hoặc chưa bắt đầu, nhưng chưa đủ để bàn giao trạng thái triển khai đang chuyển động. Việc thêm `session-handoff.md` làm Knowledge Visibility Gap giảm từ `29.2%` xuống `8.3%`, chủ yếu nhờ ngoại hóa các quyết định và giới hạn mà trước đó phải suy luận từ mã.

Tracker và handoff nhất quán về phạm vi: `document-import` đã hoàn thành, trong khi `document-detail` và `basic-persistence` chưa bắt đầu; import session-only không mâu thuẫn với persistence được theo dõi như feature riêng. Khoảng trống quan trọng nhất còn lại là thiếu bằng chứng runtime và thiếu lý do chi tiết cho các file thay đổi. Đây là các điểm nên xử lý trước khi coi workspace là một system of record đáng tin cậy cho phiên phát triển tiếp theo.

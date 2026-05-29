# Tóm tắt: Bài 02. Harness Thực sự Có nghĩa là Gì

## Ngữ cảnh từ các bài trước (Context)
Bài 01 cho thấy năng lực sinh mã của mô hình không đồng nghĩa với thực thi đáng tin cậy: agent có thể tuyên bố hoàn thành dù type-check hoặc test chưa đạt. Thí nghiệm Project 01 nhấn mạnh nhu cầu có hướng dẫn dự án, môi trường chạy được, các lệnh kiểm chứng rõ ràng và artefact theo dõi tiến độ để thu hẹp verification gap.

## Tóm tắt Bài 02
- **Định nghĩa cốt lõi:** Harness là toàn bộ cơ sở hạ tầng kỹ thuật bên ngoài trọng số mô hình, không chỉ là một prompt hoặc một file luật. Nó quyết định mức độ năng lực của mô hình được chuyển thành kết quả thực tế.
- **Repo là nguồn sự thật của agent:** Mọi ngữ cảnh cần thiết phải được biểu diễn trong repo qua tài liệu, cấu trúc thư mục, cấu hình và lệnh có thể chạy. Điều agent không nhìn thấy hoặc không thao tác được gần như không tồn tại đối với nó.
- **Bản đồ thay vì cẩm nang:** `AGENTS.md` hoặc `CLAUDE.md` nên ngắn gọn, chỉ rõ mục tiêu, stack, lệnh khởi động, ràng buộc bất biến và liên kết đến tài liệu chi tiết, thay vì cố nhồi toàn bộ kiến thức dự án vào một file.
- **Năm hệ thống phụ của harness:**
  1. **Hướng dẫn:** luật dự án, mục đích, kiến trúc và lệnh căn bản.
  2. **Công cụ:** khả năng đọc/ghi file, chạy shell, dùng git và thực thi kiểm tra với quyền phù hợp.
  3. **Môi trường:** dependencies, phiên bản runtime và cách dựng môi trường tái lập.
  4. **Trạng thái:** tiến độ, việc đang làm, điểm bị chặn và lịch sử có thể tiếp tục qua phiên.
  5. **Phản hồi:** test, lint, type-check, build hoặc evaluator cho biết kết quả thật sự đúng hay sai.
- **Ưu tiên phản hồi xác minh:** Trong nhiều dự án, việc nêu rõ các lệnh kiểm chứng là cải tiến ít tốn công nhưng tạo giá trị lớn nhất, vì nó ngăn agent tự kết luận hoàn thành dựa trên cảm giác.
- **Ràng buộc thay vì vi quản lý:** Harness nên thực thi các bất biến như phạm vi tác vụ và yêu cầu test, để agent vẫn linh hoạt trong cách triển khai nhưng không vượt khỏi tiêu chí chất lượng.
- **Đo giá trị bằng thí nghiệm tháo thành phần:** Giữ nguyên mô hình và tác vụ, lần lượt bỏ hướng dẫn, phản hồi hoặc trạng thái để đo mức giảm hiệu suất. Kết quả cho biết đóng góp biên của từng phần, còn nguyên nhân nghẽn thực sự vẫn cần được đối chiếu bằng log lỗi.
- **Harness cần được bảo trì:** Khi dự án, công cụ hoặc cách kiểm chứng thay đổi, tài liệu và vòng phản hồi cũ có thể trở thành nợ kỹ thuật làm agent sai lệch.

### Minh họa từ ví dụ mã
- `minimal-harness-loop.ts` biểu diễn vòng tối thiểu: agent chọn một tool action, thực thi công cụ và đưa kết quả quay lại ngữ cảnh làm việc.
- `harness-vs-no-harness.ts` mô phỏng cùng tập tác vụ trong hai chế độ. Khi không có harness, các thay đổi thiếu test hoặc ngoài phạm vi vẫn bị báo `PASS`; khi có luật và kiểm chứng, chúng bị chặn hoặc cảnh báo.
- `harness-components.md` mở rộng định nghĩa harness sang system prompt, quyền tool, hệ thống file, git, script khởi động, test, lint, stop hook và vòng evaluator.

### Trường hợp thực tế được nêu trong bài
Với cùng một mô hình trên dự án TypeScript + React, tỷ lệ thành công tăng từ khoảng 20% khi chỉ có README, lên 60% sau khi thêm hướng dẫn, 80% sau khi công khai lệnh xác minh, và ổn định ở mức 80-100% khi bổ sung theo dõi tiến độ. Kết quả minh họa rằng cải thiện harness có thể tăng độ tin cậy mà không cần đổi mô hình.

## Sự liên kết / Giải quyết vấn đề
Bài 01 xác định triệu chứng: agent có thể báo hoàn thành giả do thiếu xác minh và thiếu cấu trúc hỗ trợ. Bài 02 biến nhận định đó thành mô hình hành động cụ thể gồm năm hệ thống phụ. Đối với Project 01, mô hình này giải thích vì sao lượt có quy tắc, lệnh `check`/`test`/`build` và feature tracking đáng tin cậy hơn lượt prompt-only; đồng thời chỉ ra rằng cần đánh giá riêng từng lớp thay vì chỉ kết luận chung rằng agent làm tốt hay kém.

## Bài tập / Hành động tiếp theo
- Kiểm toán một dự án đang dùng agent theo năm hệ thống phụ, chấm điểm từng phần từ 1-5 và ưu tiên nâng cấp phần yếu nhất.
- Thực hiện thí nghiệm tháo từng thành phần trong cùng một tác vụ và cùng một mô hình để đo vai trò của hướng dẫn, phản hồi và trạng thái.
- Ghi lại lỗi theo nhóm nguyên nhân: ý định mơ hồ, thiếu ngữ cảnh, môi trường không tái lập, thiếu phản hồi xác minh hoặc đứt trạng thái.
- Với Project 01, kiểm tra độ ổn định của lệnh chạy trên Windows, tính nhất quán của artefact tiến độ, và việc dùng `check`, `test`, `build` như Definition of Done bắt buộc.

## Phần 2: Tôi đã hiểu và cần làm gì tiếp theo

### Điều tôi đã hiểu
Tôi không cần vội đổi mô hình khi agent làm sai. Tôi cần xem dự án đã cung cấp đủ năm phần của harness hay chưa: hướng dẫn, công cụ, môi trường, trạng thái và phản hồi. Bằng chứng tốt không phải là câu nói "đã hoàn thành", mà là lệnh kiểm chứng chạy đạt và trạng thái công việc được lưu lại để phiên sau đọc được.

### Việc tôi cần làm ngay sau bài này
1. Dùng chính kết quả `projects/project-01/experiment-b/` làm đối tượng kiểm toán vì đây là lượt đã có minimal harness và có thể so sánh với `experiment-a/`.
2. Lập bảng đánh giá năm hệ thống phụ, mỗi mục chấm từ 1-5 và ghi bằng chứng cụ thể từ repo hoặc kết quả lệnh chạy.
3. Chọn đúng một điểm yếu để cải thiện trước. Với kết quả Bài 01 hiện có, hai ứng viên cần ưu tiên là khả năng chạy ổn định trên Windows và việc cập nhật artefact tiến độ nhất quán.
4. Sau khi cải thiện, chạy lại cùng bộ kiểm chứng (`check`, `test`, `build`) và ghi sự khác biệt thay vì chỉ ghi cảm nhận.
5. Chỉ sau khi hoàn tất kiểm toán Bài 02 mới chuyển sang Project 02, vì Project 02 thực hành khả năng repo tự mô tả và bàn giao qua phiên, gắn trực tiếp hơn với Bài 03-04.

### Cách thực hiện bài tập Bài 02 trên Project 01

#### Bài tập 1: Kiểm toán harness năm hệ thống

Tạo một bảng kết quả cho `experiment-b` theo mẫu sau và điền bằng chứng thực tế:

| Hệ thống phụ | Cần kiểm tra | Bằng chứng cần thu thập | Điểm 1-5 |
|---|---|---|---|
| Hướng dẫn | Agent có biết mục tiêu, phạm vi và Definition of Done không | `AGENTS.md`, tài liệu sản phẩm/kiến trúc | Chưa chấm |
| Công cụ | Agent có chạy được lệnh cần thiết không | quyền shell, npm, khả năng đọc/ghi file | Chưa chấm |
| Môi trường | Có thể cài và chạy lại dự án ổn định không | `package.json`, cách chạy trên Windows, lỗi cài đặt nếu có | Chưa chấm |
| Trạng thái | Phiên mới có biết việc nào đã xong không | `feature_list.json`, `claude-progress.md` | Chưa chấm |
| Phản hồi | Hoàn thành có bị ràng buộc bởi kiểm chứng không | kết quả `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build` | Chưa chấm |

Quy tắc chấm điểm:

- `1`: thiếu hoàn toàn hoặc không sử dụng được.
- `3`: có artefact nhưng còn phải suy đoán hoặc chưa buộc agent làm đúng.
- `5`: rõ ràng, chạy được, có bằng chứng và đủ để một phiên mới tiếp tục.

Kết quả cần tạo ra: tìm hệ thống điểm thấp nhất và viết một cải tiến nhỏ, có thể xác minh được trong khoảng 30 phút.

#### Bài tập 2: Thí nghiệm tháo thành phần

Không sửa hoặc xóa trực tiếp kết quả gốc của Bài 01. Tạo các bản sao thí nghiệm từ cùng một điểm bắt đầu, rồi chạy cùng một tác vụ nhỏ và cùng tiêu chí kiểm chứng:

| Lượt chạy | Thành phần bị bỏ | Điều cần quan sát |
|---|---|---|
| Baseline | Không bỏ gì khỏi `experiment-b` | Mức chuẩn để so sánh |
| Không hướng dẫn | Bỏ hoặc làm mờ hướng dẫn tác vụ trong bản sao | Agent có lệch phạm vi hoặc bỏ sót quy ước không |
| Không phản hồi | Không cung cấp lệnh `check`/`test`/`build` trong bản sao | Agent có báo xong khi chưa được kiểm tra không |
| Không trạng thái | Không cung cấp feature/progress artefact trong bản sao | Phiên tiếp theo mất bao lâu để hiểu lại tiến độ |

Mỗi lượt phải ghi lại: prompt/tác vụ cố định, thời gian bắt đầu-kết thúc, file thay đổi, lệnh đã chạy, kết quả kiểm chứng và lỗi được phát hiện. Chỉ so sánh sau khi dùng cùng một Definition of Done cho tất cả lượt.

#### Bài tập 3: Phân tích khoảng cách thao tác và đánh giá

Chọn một lỗi đã gặp ở Bài 01 và phân loại:

| Hiện tượng | Phân loại | Cải tiến harness phù hợp |
|---|---|---|
| Agent không biết lệnh đúng để chạy trên Windows | Gulf of Execution | Ghi lệnh Windows đã xác minh vào `AGENTS.md` hoặc script chạy chuẩn |
| Agent báo hoàn thành dù type-check thất bại | Gulf of Evaluation | Bắt buộc `check`, `test`, `build` trước khi đánh dấu hoàn thành |
| Phiên mới không biết tính năng nào đã pass | Gulf of Execution và continuity | Cập nhật `feature_list.json` và progress log trước khi kết thúc phiên |

### Có nên dọn dẹp bài tập cũ của Bài 01 không?

Chưa nên xóa `experiment-a/`, `experiment-b/` hoặc `results/` ở thời điểm này. Đây là dữ liệu đầu vào để thực hiện bài tập Bài 02: đối chiếu prompt-only với minimal harness, chấm điểm năm hệ thống phụ và làm mốc baseline cho thí nghiệm tháo thành phần.

Quyết định dọn dẹp hợp lý:

1. Giữ nguyên artefact Bài 01 trong khi làm Bài 02; không chỉnh sửa dữ liệu gốc để tránh mất mốc so sánh.
2. Nếu cần thí nghiệm mới, tạo thư mục mới hoặc bản sao có tên rõ ràng; không chạy đè lên hai lượt cũ.
3. Sau khi có bảng kiểm toán và kết luận cuối cùng, chỉ dọn các file phát sinh không có giá trị bằng chứng như `node_modules`, build output, cache hoặc dữ liệu chạy tạm.
4. Giữ lại báo cáo, progress artefact, feature list và kết quả kiểm chứng vì chúng là hồ sơ học tập cho các bài tiếp theo.

## Kết quả thực hành Bài tập 1: Kiểm toán Harness của Project 01 Experiment B

### Bằng chứng xác minh trước cải tiến

| Lệnh | Kết quả | Bằng chứng |
|---|---|---|
| `npm.cmd run check` | Pass | TypeScript không báo lỗi. |
| `npm.cmd test` | Pass | `1` test file pass, `2/2` test case pass. |
| `npm.cmd run build` | Pass | Vite production build thành công. |

Ghi nhận không chặn: khi chạy test xuất hiện cảnh báo Vite CJS Node API đã deprecated, nhưng cảnh báo không làm test hoặc build thất bại.

### Kiểm toán hiện trạng

| Hệ thống phụ | Điểm | Bằng chứng chính |
|---|---:|---|
| Hướng dẫn | 4/5 | Có `AGENTS.md`, tài liệu kiến trúc/sản phẩm, layer boundaries và Definition of Done; hướng dẫn khởi tạo ban đầu chưa phù hợp PowerShell. |
| Công cụ | 5/5 | Có thể sử dụng npm, test runner và build tool; ba lệnh xác minh đều chạy thành công. |
| Môi trường | 3/5 | Có lockfile và dự án chạy được, nhưng `bash init.sh` không chạy trong môi trường hiện tại do WSL chưa có distribution. |
| Trạng thái | 4/5 | `feature_list.json` lưu bằng chứng của tám feature và `claude-progress.md` ghi lại so sánh hai lượt chạy. |
| Phản hồi | 4/5 | Có type-check, test và build hoạt động; trước cải tiến Definition of Done chưa bắt buộc rõ test và build. |

### Cải tiến vòng 1 và kết quả chạy lại

Agent đã cập nhật `AGENTS.md` để thêm mục `Windows / PowerShell Verification`, chỉ rõ các lệnh `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build`, đồng thời bổ sung test và build vào Definition of Done.

Sau thay đổi, kết quả xác minh được báo cáo:

| Lệnh | Kết quả |
|---|---|
| `npm.cmd run check` | Pass, TypeScript không có lỗi. |
| `npm.cmd test` | Pass, `1` test file và `2/2` test case đạt. |
| `npm.cmd run build` | Pass, Vite production build thành công. |

### Đánh giá sau cải tiến vòng 1

| Hệ thống phụ | Điểm sau vòng 1 | Thay đổi |
|---|---:|---|
| Hướng dẫn | 4/5 | Có thêm nhánh lệnh PowerShell, nhưng Startup Rules vẫn yêu cầu `bash init.sh` trước tiên. |
| Công cụ | 5/5 | Không đổi; công cụ hoạt động. |
| Môi trường | 3/5 | Chưa tăng điểm vì luồng khởi động bắt buộc vẫn thất bại trên Windows trước khi người dùng tự chọn đường PowerShell. |
| Trạng thái | 4/5 | Không đổi. |
| Phản hồi | 5/5 | Tăng điểm vì Definition of Done đã bắt buộc type-check, test và build trước khi đánh dấu hoàn thành. |

### Phát hiện cần hoàn thiện

Cải tiến vòng 1 đã nâng hệ thống Phản hồi, nhưng chưa giải quyết trọn vẹn điểm yếu Môi trường. `AGENTS.md` hiện có hai chỉ dẫn không đồng nhất: `Startup Rules` yêu cầu chạy `bash init.sh`, trong khi mục Windows/PowerShell cung cấp lệnh thay thế chỉ ở cuối tệp. Trên máy thực hành hiện tại, agent làm theo thứ tự startup vẫn va vào lỗi WSL không có distribution.

Cải tiến cuối cần thực hiện là làm cho bước startup nhận biết hệ điều hành: dùng `bash init.sh` khi môi trường bash khả dụng; trên Windows PowerShell dùng chuỗi `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build` thay thế, và không diễn giải việc thiếu WSL là lỗi build của sản phẩm.

### Kiểm tra vòng cải thiện tiếp theo: xác minh đạt nhưng thay đổi mục tiêu chưa được áp dụng

Báo cáo vòng tiếp theo cho biết `npm.cmd run check`, `npm.cmd test` và `npm.cmd run build` đều pass; không có thay đổi mã nguồn ứng dụng, và cảnh báo Vite CJS Node API vẫn là cảnh báo không chặn.

Tuy nhiên, khi đọc lại artefact sau vòng chạy, `AGENTS.md` vẫn giữ yêu cầu trong `Startup Rules` rằng agent phải chạy `bash init.sh` và sửa lỗi build nếu lệnh này thất bại. Vì môi trường Windows hiện tại đã chứng minh lệnh đó thất bại do thiếu WSL distribution, vòng này chưa triển khai cải tiến môi trường đã chọn.

Do đó, kết quả chấm điểm chưa thay đổi so với vòng 1:

| Hệ thống phụ | Điểm hiện tại | Lý do |
|---|---:|---|
| Hướng dẫn | 4/5 | Có lệnh PowerShell nhưng chỉ dẫn startup vẫn mâu thuẫn. |
| Công cụ | 5/5 | Bộ công cụ xác minh hoạt động. |
| Môi trường | 3/5 | Đường startup bắt buộc vẫn không chạy được trên máy thực hành. |
| Trạng thái | 4/5 | Không có thay đổi về lưu trạng thái. |
| Phản hồi | 5/5 | Bộ `check`/`test`/`build` được yêu cầu và đều chạy đạt. |

Bài tập 1 chỉ được chốt sau khi `Startup Rules` thực sự được cập nhật để nêu nhánh PowerShell thay thế cho `bash init.sh`, rồi bộ xác minh được chạy lại thành công.

### Kết quả vòng hoàn thiện và chốt Bài tập 1

Vòng hoàn thiện đã áp dụng đúng cải tiến còn thiếu. Trong `AGENTS.md`, `Startup Rules` nay nêu rõ hai đường khởi tạo:

- dùng `bash init.sh` trên macOS/Linux hoặc Windows đã có Bash/WSL;
- dùng `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build` trên Windows PowerShell không có WSL;
- việc Bash/WSL không khả dụng không được xem là lỗi build của sản phẩm.

Bộ xác minh sau thay đổi:

| Lệnh | Kết quả |
|---|---|
| `npm.cmd run check` | Pass, TypeScript không có lỗi. |
| `npm.cmd test` | Pass, `2/2` test trong `tests/knowledge-base.test.ts` đạt. |
| `npm.cmd run build` | Pass, Vite production build thành công. |

Ghi nhận còn lại: cảnh báo Vite CJS Node API deprecated không chặn kết quả, nhưng là khoản bảo trì môi trường/cấu hình nên xử lý ở một bài hoặc phiên riêng.

### Điểm cuối sau cải tiến

| Hệ thống phụ | Trước cải tiến | Điểm cuối | Kết luận |
|---|---:|---:|---|
| Hướng dẫn | 4/5 | 5/5 | Hướng dẫn khởi động và Definition of Done đã rõ cho môi trường đang dùng. |
| Công cụ | 5/5 | 5/5 | Các công cụ xác minh hoạt động đầy đủ. |
| Môi trường | 3/5 | 4/5 | Có đường chạy PowerShell hợp lệ; chưa đạt tuyệt đối do còn cảnh báo Vite deprecated. |
| Trạng thái | 4/5 | 4/5 | Có feature evidence và progress log; chưa có handoff chuyên biệt. |
| Phản hồi | 4/5 | 5/5 | Type-check, test và build đã thành ràng buộc hoàn thành và đều pass. |

### Kết luận bài tập

Bài tập 1 đã hoàn thành. Kiểm toán phát hiện điểm yếu thực sự không nằm ở mã ứng dụng mà ở hướng dẫn runtime không phù hợp hệ điều hành. Một thay đổi nhỏ trong harness đã loại bỏ đường khởi động gây hiểu nhầm, đồng thời củng cố yêu cầu kiểm chứng trước khi báo hoàn thành. Artefact Bài 01 tiếp tục được giữ lại làm baseline cho thí nghiệm tháo thành phần ở Bài tập 2.

## Bài tập 2: Thí nghiệm tháo thành phần Harness

### Lượt 0 - Baseline với harness đầy đủ

Tác vụ cố định: thêm hiển thị số lượng trích dẫn của câu trả lời gần nhất trên giao diện Q&A, cập nhật kiểm chứng phù hợp và báo cáo bằng chứng hoàn thành.

| Thuộc tính | Kết quả |
|---|---|
| Biến thể | Baseline, không tháo thành phần harness |
| Thư mục thực thi | `projects/project-01/experiment-b/` |
| Thời gian hoàn thành được ghi nhận | 4 phút 06 giây |
| Thay đổi sản phẩm | Thêm `LatestCitationCount.tsx`; gắn component vào `App.tsx` |
| Thay đổi kiểm chứng | Thêm test render citation count của câu trả lời mới nhất và trường hợp không có citation |
| Thay đổi trạng thái | Thêm feature `latest-citation-count` trạng thái `pass` kèm evidence trong `feature_list.json` |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`4/4`); `npm.cmd run build`: pass |
| Ghi nhận không chặn | Vite CJS Node API deprecated warning vẫn xuất hiện khi test |

### Đánh giá Baseline

Lượt harness đầy đủ hoàn thành đúng phạm vi, có code tích hợp, test mới và bằng chứng trạng thái; không chỉ dựa vào tuyên bố của agent. Component lấy response cuối từ lịch sử và hiển thị độ dài mảng citations; các test mới xác minh chọn câu trả lời mới nhất và hiển thị `0` khi câu trả lời cuối không có citation.

Lưu ý kiểm soát thí nghiệm: lượt baseline đã được thực hiện trực tiếp trong `experiment-b`, vì vậy thư mục này hiện là **kết quả baseline sau tác vụ**, không còn là điểm bắt đầu sạch. Các lượt `no-instructions`, `no-feedback` và `no-state` chỉ so sánh hợp lệ nếu chúng đã được sao chép từ trạng thái trước khi tính năng `latest-citation-count` được thêm vào; dấu hiệu hiện có là các bản sao chưa chứa `LatestCitationCount.tsx`.

### Pilot `no-instructions`: sản phẩm đạt nhưng thí nghiệm bị nhiễu

Lượt được đặt tên `experiment-b-ablation-no-instructions` đã triển khai thành công cùng tác vụ hiển thị số citation của câu trả lời gần nhất:

| Thuộc tính | Kết quả kiểm tra |
|---|---|
| Code sản phẩm | Có `LatestCitationCount.tsx` và được tích hợp trong `App.tsx`. |
| Test | Có test riêng cho câu trả lời gần nhất và trạng thái chưa có câu trả lời. |
| Trạng thái | `feature_list.json` ghi feature mới ở trạng thái `pass` kèm evidence. |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`2` test files, `4/4` tests); `npm.cmd run build`: pass. |
| Thời gian quan sát từ ảnh báo cáo | `4m 40s`; cần tách riêng thời gian chờ cấp quyền nếu muốn dùng số đo active-work khác. |

Tuy nhiên, lượt này không đo được tác động của việc bỏ hệ thống Hướng dẫn:

- trong chính thư mục biến thể vẫn còn `CLAUDE.md`, chứa tổng quan dự án, kiến trúc, các bước thêm feature và lệnh test/build;
- ở thư mục cha `projects/project-01/` còn có `AGENTS.md`, chứa quy tắc kiến trúc, Definition of Done và hướng dẫn xác minh PowerShell;
- vì vậy agent vẫn có thể nhận hướng dẫn harness dù `AGENTS.md` cục bộ của biến thể đã bị bỏ.

Kết luận: đây là một **pilot triển khai thành công nhưng bị nhiễu biến độc lập**, không được dùng để so sánh hiệu năng `baseline` với `no-instructions`. Cần chạy lại từ một bản sao sạch trước tính năng mới, bảo đảm không có `AGENTS.md` ở chuỗi thư mục cha áp dụng cho phiên chạy và không có `CLAUDE.md`/tài liệu hướng dẫn được agent nạp trong biến thể.

### Pilot `no-state`: phục hồi tên file trạng thái, chưa phải tháo trạng thái

Trong biến thể `experiment-b-ablation-no-state`, agent hoàn thành tác vụ trong thời gian hiển thị `5m 22s`, thêm `LatestCitationCount.tsx`, nối component vào `App.tsx`, bổ sung test trong `tests/knowledge-base.test.ts` và tạo lại `feature_list.json` với feature mới ở trạng thái `pass`.

Xác minh độc lập:

| Lệnh | Kết quả |
|---|---|
| `npm.cmd run check` | Pass |
| `npm.cmd test` | Pass, `1` test file và `4/4` tests đạt |
| `npm.cmd run build` | Pass |

Tuy nhiên, lượt này chưa tháo hệ thống Trạng thái:

- `def.json` vẫn chứa toàn bộ nội dung feature list nền với tám feature và evidence cũ; đây vẫn là trạng thái, chỉ bị đổi tên;
- `abc.md` vẫn tồn tại và có dấu hiệu là progress artefact đã đổi tên;
- `AGENTS.md` và `CLAUDE.md` vẫn tồn tại, trong đó hướng dẫn nêu `feature_list.json` là nguồn sự thật và cần được cập nhật.

Vì vậy hành vi agent tạo lại `feature_list.json` không phải bằng chứng rằng trạng thái không quan trọng. Nó cho thấy khi **payload trạng thái còn trong repo nhưng sai tên**, hướng dẫn tốt giúp agent phục hồi cấu trúc chuẩn. Đây là một quan sát hữu ích về khả năng phục hồi, nhưng không được tính vào phép đo `no-state` thuần.

Để chạy `no-state` hợp lệ, bản sao mới phải bắt đầu từ trạng thái trước feature mới và không chứa nội dung tương đương với `feature_list.json` hoặc progress log dưới bất kỳ tên thay thế nào; vẫn giữ instruction và feedback để chỉ tháo đúng biến Trạng thái.

### Vòng kiểm soát mới: tính năng nhãn confidence

Do hai pilot citation count bị nhiễu bởi instruction/state còn sót, một vòng so sánh mới sử dụng cùng tác vụ cho tất cả biến thể: hiển thị nhãn `Confidence: High`, `Confidence: Medium` hoặc `Confidence: Low` cho câu trả lời gần nhất, và không hiển thị nhãn khi chưa có câu trả lời.

#### Baseline confidence - harness đầy đủ

| Thuộc tính | Kết quả |
|---|---|
| Biến thể | Baseline, không tháo thành phần harness |
| Thư mục thực thi | `projects/project-01/experiment-b/` |
| Thời gian | 5 phút 09 giây |
| Code mới | `src/renderer/components/LatestAnswerConfidence.tsx` |
| Tích hợp | `App.tsx` chỉ render nhãn cạnh câu trả lời mới nhất |
| Kiểm thử được thêm | Trạng thái chưa có answer và các ngưỡng `0.5`/`0.8` trong `tests/knowledge-base.test.ts` |
| Trạng thái | `feature_list.json` ghi `latest-answer-confidence` ở trạng thái `pass` kèm evidence |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`8/8`); `npm.cmd run build`: pass |
| Ghi nhận không chặn | Vite CJS Node API deprecated warning vẫn xuất hiện khi test |

Baseline confidence đạt yêu cầu sản phẩm và tạo đầy đủ feedback/state evidence, nên có thể dùng làm mốc tham chiếu nếu các biến thể bắt đầu từ trạng thái trước khi có `LatestAnswerConfidence.tsx`.

Tại thời điểm kiểm tra, ba thư mục trong `projects/ablation-runs/` đã đều chứa `LatestAnswerConfidence.tsx` với thời gian chỉnh sửa sau baseline. Chúng vì vậy là kết quả đã chạy hoặc đã bị thay đổi, không còn là bản đầu vào sạch để khởi chạy mới; cần đánh giá như kết quả nếu có báo cáo phiên tương ứng, hoặc dựng bản sao sạch khác cho một lượt chạy lại.

#### No-instructions confidence - bỏ instruction entrypoint

| Thuộc tính | Kết quả |
|---|---|
| Biến thể | `projects/ablation-runs/experiment-b-ablation-no-instructions/` |
| Thành phần tháo | Không có `AGENTS.md` hoặc `CLAUDE.md` trong thư mục biến thể; không có `AGENTS.md` ở `projects/ablation-runs/`, `projects/` hoặc gốc repo |
| Thời gian báo cáo | 2 phút 51 giây |
| Code mới | `src/renderer/components/LatestAnswerConfidence.tsx`, tích hợp trong `App.tsx` |
| Test được thêm | `tests/latest-answer-confidence.test.ts`, kiểm tra ba ngưỡng, latest answer và trạng thái rỗng |
| Sự cố trong phiên | Test ban đầu lỗi load `vitest.config.ts` do import config; agent sửa config rồi chạy lại thành công |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`3` test files, `9/9` tests); `npm.cmd run build`: pass |
| Trạng thái sau tác vụ | `feature_list.json` không có entry cho feature confidence mới |

Lượt này cho thấy bỏ instruction entrypoint không khiến tác vụ UI nhỏ thất bại: agent vẫn đọc được code, tự thêm test, sửa lỗi chạy test và hoàn thành build. Tuy nhiên, khác với baseline, agent không ghi tính năng mới vào trạng thái có cấu trúc mặc dù `feature_list.json` vẫn tồn tại. Đây là suy giảm về traceability/continuity, không phải lỗi chức năng trực tiếp.

Giới hạn diễn giải:

- Lỗi `vitest.config.ts` phát sinh trong phiên khiến thời gian `2m51s` không phải phép đo latency thuần cho cùng đầu vào; cần coi thời gian là quan sát tham khảo.
- Thư mục vẫn giữ docs, `feature_list.json`, `claude-progress.md` và `init.sh`, nên đây là ablation của **instruction entrypoint**, không phải xóa toàn bộ ngữ cảnh hoặc feedback.
- Repo gốc còn `CLAUDE.md`; nếu phiên được chạy bằng công cụ tự động nạp `CLAUDE.md` từ ancestor thì lượt này có khả năng rò instruction và cần gắn nhãn pilot.

#### No-state confidence - bỏ feature list, còn progress memory

| Thuộc tính | Kết quả |
|---|---|
| Biến thể | `projects/ablation-runs/experiment-b-ablation-no-state/` |
| Thành phần đã tháo | Không có `feature_list.json` tại thời điểm kiểm tra sau lượt chạy |
| Thành phần còn sót | `abc.md` vẫn chứa nội dung của `claude-progress.md` cũ; instructions/docs/feedback vẫn còn |
| Thời gian báo cáo | 5 phút 23 giây |
| Code mới | `src/renderer/components/LatestAnswerConfidence.tsx`, tích hợp trong `App.tsx` |
| Test được thêm | Test confidence trong `tests/knowledge-base.test.ts`, bao phủ empty state, ba ngưỡng và latest answer |
| Sự cố trong phiên | Agent sửa import cấu hình Vitest bị lỗi sẵn để `npm.cmd test` khởi động được |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`10/10` tests); `npm.cmd run build`: pass |
| Trạng thái sau tác vụ | Agent không tạo `feature_list.json` mới và báo không có file trạng thái để cập nhật evidence |

Lượt này đo được tác động của việc thiếu **feature registry**: agent vẫn hoàn thành sản phẩm và kiểm chứng vì instructions/feedback còn đầy đủ, nhưng không thể lưu pass/evidence theo hợp đồng trạng thái mà `AGENTS.md` yêu cầu. Đây là mất khả năng truy vết trạng thái của tính năng mới, dù functionality vẫn pass.

Lượt này chưa phải `no-state` hoàn toàn, vì `abc.md` vẫn giữ memory từ progress log cũ. Một lượt chạy lại xóa cả `feature_list.json`, `claude-progress.md` và mọi bản đổi tên chứa nội dung tương đương sẽ đo rõ hơn khả năng agent hoạt động khi không có memory trạng thái.

#### No-feedback confidence - bỏ yêu cầu xác minh bắt buộc

| Thuộc tính | Kết quả |
|---|---|
| Biến thể | `projects/ablation-runs/experiment-b-ablation-no-feedback/` |
| Thành phần đã tháo | `AGENTS.md` không còn yêu cầu chạy `check`, `test`, `build`, `dev` hoặc smoke test; không có `CLAUDE.md`; `init.sh` đã disabled |
| Dấu vết feedback còn lại | `claude-progress.md` và evidence cũ trong `feature_list.json` vẫn nhắc đến test/build đã chạy ở các phiên trước |
| Thời gian báo cáo | 3 phút 30 giây |
| Code mới | `src/renderer/components/LatestAnswerConfidence.tsx`, tích hợp trong `App.tsx` |
| Test được thêm | `tests/latest-answer-confidence.test.ts`, kiểm tra empty state, các ngưỡng và latest answer |
| Sự cố trong phiên | Agent sửa import cấu hình Vitest bị lỗi sẵn để test khởi động được |
| State mới | `feature_list.json` có entry `latest-answer-confidence` ở trạng thái `pass` kèm evidence kiểm chứng |
| Xác minh agent tự chạy | Agent tự báo `npm.cmd run check`, `npm.cmd test` (`9` tests), `npm.cmd run build` đều pass |
| Xác minh độc lập | `npm.cmd run check`: pass; `npm.cmd test`: pass (`3` test files, `9/9` tests); `npm.cmd run build`: pass |

Lượt này là phát hiện quan trọng: khi bỏ yêu cầu xác minh khỏi instruction chính, agent vẫn chủ động viết test, sửa lỗi test runner và chạy đủ bộ kiểm chứng. Với tác vụ UI nhỏ này, việc tháo feedback cưỡng chế không tạo verification gap quan sát được.

Không nên suy luận rằng feedback là không cần thiết. Có ba cách diễn giải thận trọng hơn:

- mô hình/agent đang dùng có hành vi tự kiểm chứng mạnh ngay cả khi không bị bắt buộc;
- `claude-progress.md` và evidence cũ trong `feature_list.json` vẫn tạo tiền lệ rằng dự án coi trọng kiểm chứng;
- tác vụ confidence label nhỏ, dễ kiểm tra, nên chưa tạo áp lực đủ lớn để làm lộ lỗi khi thiếu feedback bắt buộc.

### So sánh vòng confidence hiện tại

| Biến thể | Thời gian | Functionality | Test độc lập | State của feature mới | Phát hiện chính |
|---|---:|---|---|---|---|
| Baseline | 5m09s | Pass | `8/8` pass | Có | Harness đầy đủ tạo evidence đầy đủ. |
| No-instructions | 2m51s | Pass | `9/9` pass | Không ghi feature mới | Chức năng đạt nhưng continuity giảm. |
| No-state một phần | 5m23s | Pass | `10/10` pass | Không có feature list để ghi | Mất registry làm đứt evidence dù code đúng. |
| No-feedback giảm thiểu | 3m30s | Pass | `9/9` pass | Có | Agent tự kiểm chứng dù không bị instruction bắt buộc. |

Kết quả vòng confidence cho thấy với một tác vụ nhỏ, cả bốn lượt đều có thể hoàn thành sản phẩm. Sự khác biệt rõ nhất hiện nằm ở chất lượng quản lý trạng thái và tính sạch của phép thử, chưa phải ở chức năng chạy cuối cùng. Để tìm verification gap do thiếu feedback, cần một tác vụ rủi ro hơn hoặc chạy lại `no-feedback` sau khi loại bỏ cả các dấu vết lịch sử về test/build trong state/progress.

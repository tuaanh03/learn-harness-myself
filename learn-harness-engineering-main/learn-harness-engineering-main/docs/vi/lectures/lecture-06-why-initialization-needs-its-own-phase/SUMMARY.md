## Ngữ cảnh từ các bài trước (Context)
Bài 05 chỉ ra rằng tác vụ dài không thể dựa vào ký ức hội thoại của agent. Trạng thái cần được ghi lại thành artifact bền vững trong repo như `PROGRESS.md`, `session-handoff.md`, `DECISIONS.md`, kết quả kiểm chứng và git checkpoint. Nhờ đó, một phiên mới có thể phục hồi bối cảnh, hiểu việc đã làm, biết phần còn mở và tiếp tục mà không phải khám phá lại từ đầu.

Bài 06 tiếp nối trực tiếp vấn đề đó: nếu phiên mới cần đọc handoff, kiểm tra môi trường, hiểu lệnh chạy/test và chọn bước tiếp theo, thì chính quá trình khởi động phiên cũng phải được chuẩn hóa. Không thể để agent tự nhớ hoặc tự đoán phải làm gì trước khi bắt đầu code.

## Tóm tắt Bài 06
- **Luận điểm trung tâm:** Khởi tạo phiên agent phải là một giai đoạn riêng, tách khỏi triển khai tính năng. Phiên đầu hoặc bước đầu của một phiên không nên nhảy ngay vào code, mà phải đảm bảo môi trường, test, tài liệu vận hành và danh sách tác vụ đã sẵn sàng.
- **Khởi tạo và triển khai tối ưu cho hai mục tiêu khác nhau:** Triển khai tối ưu cho việc tạo tính năng đã xác minh; khởi tạo tối ưu cho độ tin cậy và hiệu quả của mọi phiên sau. Khi trộn hai việc này, agent thường ưu tiên phần dễ thấy là viết code tính năng và bỏ yếu phần nền.
- **Rủi ro của phiên hỗn hợp:** Agent có thể viết nhiều mã trước khi framework test, dependency, lệnh chạy hoặc cấu trúc repo được xác minh. Kết quả là mã tích lũy nhưng chưa có bằng chứng chạy được, khiến lỗi thiết kế hoặc lỗi môi trường chỉ lộ ra muộn.
- **Chi phí tái xây dựng tăng:** Nếu không có bước khởi tạo rõ, phiên sau phải tự suy ra cách chạy dự án, cách test, trạng thái hiện tại và việc tiếp theo. Đây chính là rebuild cost mà Bài 05 đã cảnh báo.
- **Bẫy giả định ẩn:** Trong lúc khởi tạo, agent đưa ra nhiều quyết định như chọn test framework, layout thư mục, cách quản lý dependency. Nếu các quyết định này không được ghi lại, phiên sau có thể vô tình làm ngược hoặc tạo quy ước mâu thuẫn.
- **Bootstrap Contract:** Đây là hợp đồng tối thiểu để một agent mới vận hành repo không mơ hồ. Dự án phải trả lời được bốn câu hỏi: bắt đầu thế nào, test thế nào, tiến độ ở đâu, và bước tiếp theo là gì.
- **Cold start vs. warm start:** Khởi động lạnh từ thư mục trống buộc agent phải tự dựng mọi quy ước. Khởi động ấm từ template hoặc project đã có scaffold giúp giảm rủi ro vì nhiều phần nền như cấu trúc, dependency và test framework đã được định hình.
- **Handoff readiness:** Repo phải ở trạng thái mà một agent mới có thể tiếp quản bất kỳ lúc nào chỉ bằng nội dung trong repo, không cần lời giải thích ngoài luồng.
- **Time to First Verification:** Chỉ số quan trọng không phải là agent viết được bao nhiêu code sớm, mà là mất bao lâu để có điểm xác minh đầu tiên chạy thành công. Khởi tạo tốt làm điểm xác minh đầu tiên đến sớm và đáng tin hơn.
- **Downstream usability:** Chất lượng khởi tạo được đo bằng việc các phiên sau có thể thực hiện tác vụ thành công mà không cần kiến thức ẩn. Nếu phiên sau vẫn phải hỏi hoặc đoán nhiều, bootstrap contract còn thiếu.
- **Kết quả của khởi tạo:** Không phải tính năng kinh doanh, mà là hạ tầng vận hành: môi trường chạy được, test mẫu vượt qua, tài liệu bootstrap contract, danh sách tác vụ có tiêu chí chấp nhận và checkpoint git sạch.
- **Tiêu chí hoàn thành khởi tạo:** Dự án có lệnh setup/run/test rõ ràng, có ít nhất một test mẫu vượt qua, có artifact tiến độ, có task breakdown, và trạng thái khởi tạo đã được commit.

### Minh họa từ ví dụ kèm bài
- `init.sh` là ví dụ script khởi tạo tối giản: cài dependencies bằng `npm install`, chỉ ra lệnh chạy docs tùy chọn và để chỗ cho bước startup riêng của từng dự án.
- `init-check.ts` biến khởi tạo thành kiểm tra có thể chạy được. Script kiểm tra Node.js version, `package.json`, `node_modules`, TypeScript, `tsconfig.json`, thư mục source, thư mục test và git repo.
- `init-check.ts` cũng so sánh hai kịch bản: không có init phase thì agent phát hiện lỗi muộn trong lúc làm việc; có init phase thì lỗi prerequisite được phát hiện trước khi bắt đầu triển khai.
- `initializer-output-checklist.md` rút gọn đầu ra cần có của khởi tạo: lệnh khởi động chuẩn, lệnh xác minh chuẩn, artifact tiến độ đầu tiên, commit ổn định đầu tiên và bề mặt tính năng cho các lần chạy sau.

## Sự liên kết / Giải quyết vấn đề
Bài 05 giải quyết vấn đề mất liên tục bằng cách yêu cầu repo lưu trạng thái giữa các phiên. Bài 06 bổ sung rằng trạng thái đó chỉ hữu ích khi phiên mới có một quy trình khởi tạo bắt buộc để đọc, kiểm tra và sử dụng nó. Nói cách khác, Bài 05 tạo ra artifact bàn giao; Bài 06 biến việc tiêu thụ artifact đó thành một pha vận hành có kỷ luật.

Chuỗi logic đến đây là: Bài 03 xem repo là system of record, Bài 04 dạy cách chia nhỏ hướng dẫn để agent đọc đúng thứ, Bài 05 lưu lại trạng thái và lý do qua nhiều phiên, còn Bài 06 chuẩn hóa nghi thức bắt đầu phiên để agent không nhảy thẳng vào code khi nền chưa vững.

Trong Project 03, bài này củng cố yêu cầu có `init.sh`, handoff, progress log và clean checkpoint. Một phiên agent tốt không chỉ làm tiếp tính năng, mà trước hết phải chứng minh repo có thể chạy, có thể test, có thể hiểu tiến độ và có thể chọn tác vụ kế tiếp từ artifact trong repo.

## Bài tập / Hành động tiếp theo
- Viết bootstrap contract cho một project thật, gồm lệnh cài đặt, lệnh chạy, lệnh test, trạng thái hiện tại, cấu trúc thư mục và nơi đọc tiến độ.
- Mở một phiên agent mới chỉ dựa vào nội dung repo, yêu cầu nó chạy setup/test và nói bước tiếp theo. Mọi chỗ agent phải đoán chính là phần bootstrap contract còn thiếu.
- Tạo hoặc cải thiện `init.sh` để kiểm tra dependency, môi trường, cấu hình và lệnh xác minh trước khi agent triển khai tính năng.
- Thêm một test mẫu tối thiểu để chứng minh test framework thực sự chạy được.
- Tạo task breakdown với ít nhất ba tác vụ, mỗi tác vụ có tiêu chí chấp nhận rõ ràng.
- Sau khi khởi tạo đạt checklist, commit checkpoint sạch để các phiên sau bắt đầu từ nền đã xác minh.
- Sang Bài 07, tiếp tục học cách kiểm soát phạm vi để agent không làm quá rộng hoặc hoàn thành thiếu sau khi đã có bước khởi tạo ổn định.

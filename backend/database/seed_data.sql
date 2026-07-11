-- ========================================================
-- CHÈN DỮ LIỆU MẪU (SEED DATA) CHO PYTHON AI LEARNING
-- ========================================================
USE python_ai_learning_db;

-- Ngắt kiểm tra để đảm bảo quá trình chèn chuỗi sạch không bị kẹt ngắt quãng
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM `admin_audit_logs`;
DELETE FROM `notifications`;
DELETE FROM `contact_messages`;
DELETE FROM `learning_activities`;
DELETE FROM `lesson_progress`;
DELETE FROM `enrollments`;
DELETE FROM `quiz_attempt_answers`;
DELETE FROM `quiz_attempts`;
DELETE FROM `quiz_options`;
DELETE FROM `quiz_questions`;
DELETE FROM `quizzes`;
DELETE FROM `ai_retrieval_logs`;
DELETE FROM `ai_chat_messages`;
DELETE FROM `ai_chat_sessions`;
DELETE FROM `transcript_chunks`;
DELETE FROM `lesson_summaries`;
DELETE FROM `lesson_transcripts`;
DELETE FROM `lesson_videos`;
DELETE FROM `lessons`;
DELETE FROM `course_sections`;
DELETE FROM `courses`;
DELETE FROM `user_settings`;
DELETE FROM `password_reset_tokens`;
DELETE FROM `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- NHÓM 1: NGƯỜI DÙNG VÀ TÀI KHOẢN
-- --------------------------------------------------------

-- Chèn dữ liệu bảng users (Password giả lập đã được băm mã hóa)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `phone`, `full_name`, `avatar_url`, `role`, `status`) VALUES
(1, 'admin_system', 'admin@pythonailearning.edu.vn', '$2b$12$hFRC27ygA5jLG9GID8V5QOjVz6oSieLyFlPe9aC4WwDh2Y0jjV/ea', '0905111222', 'ADMIN', 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin', 'admin', 'active'),
(2, 'thinh_tran', 'thinhnguyen@student.edu.vn', '$2b$12$hFRC27ygA5jLG9GID8V5QOjVz6oSieLyFlPe9aC4WwDh2Y0jjV/ea', '0905333444', 'Trần Kim Thịnh', 'https://api.dicebear.com/7.x/adventurer/svg?seed=thinh', 'student', 'active'),
(3, 'huydz252', '252quanghuy@gmail.com', '$2b$12$hFRC27ygA5jLG9GID8V5QOjVz6oSieLyFlPe9aC4WwDh2Y0jjV/ea', '0813118974', 'Trần Quang Huy', 'https://api.dicebear.com/7.x/adventurer/svg?seed=huy', 'student', 'active'),
(4, 'tien_nguyen', 'tiennguyen@student.edu.vn', '$2b$12$hFRC27ygA5jLG9GID8V5QOjVz6oSieLyFlPe9aC4WwDh2Y0jjV/ea', '0905777888', 'Tiến Nguyễn', 'https://api.dicebear.com/7.x/adventurer/svg?seed=nguyen', 'student', 'active');

-- Chèn dữ liệu cấu hình mặc định user_settings
INSERT INTO `user_settings` (`id`, `user_id`, `two_factor_enabled`, `save_ai_history`, `learning_reminder_enabled`, `theme`) VALUES
(1, 1, 1, 1, 0, 'dark'),
(2, 2, 0, 1, 1, 'system'),
(3, 3, 0, 1, 1, 'light'),
(4, 4, 0, 0, 1, 'system');


-- --------------------------------------------------------
-- NHÓM 2: KHÓA HỌC, CHƯƠNG, BÀI HỌC VÀ VIDEO
-- --------------------------------------------------------

-- Chèn dữ liệu bảng courses
INSERT INTO `courses` (`id`, `title`, `slug`, `description`, `thumbnail_url`, `level`, `price`, `status`, `created_by`) VALUES
(1,'Lập trình Python Cơ Bản đến Nâng Cao', 'python-co-ban-den-nang-cao', 'Khóa học cung cấp nền tảng lập trình Python từ cơ bản đến nâng cao, giúp người học nắm vững cú pháp, tư duy giải quyết vấn đề và cách ứng dụng AI Assistant để hỗ trợ viết code hiệu quả hơn.', 'https://storage.googleapis.com/python-ai-assets/thumbnails/python-basic.png', 'beginner', 0.00, 'published', 1),
(2,'Khóa học lập trình website với Python Django','lap-trinh-website-voi-python-django','Khóa học hướng dẫn xây dựng website bằng Python Django từ cơ bản, bao gồm tạo project, tạo web app, xử lý template, làm việc với database, hệ thống admin, form đăng ký, đăng nhập, generic view và xử lý bình luận.','https://storage.googleapis.com/python-ai-assets/thumbnails/python-django.png','beginner',0.00,'published',1);

-- Chèn dữ liệu cấu trúc chương học course_sections
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `sort_order`) VALUES
(1, 1, 'Học Công Nghệ', 1),
(2,2,'K-Team',1);

-- Chèn danh sách bài học chi tiết lessons
INSERT INTO `lessons` (`id`, `course_id`, `section_id`, `title`, `description`, `duration_seconds`, `sort_order`, `is_free`, `status`) VALUES
(1, 1, 1, 'Giới thiệu khóa học lập trình Python hoàn toàn miễn phí trên kênh học công nghệ', 'Giới thiệu tổng quan khóa học, nội dung học và định hướng học Python từ cơ bản.', 294, 1, 1, 'published'),
(2, 1, 1, 'Giới thiệu về khoá học Lập trình Python - Cài đặt Python và Visual Studio Code', 'Hướng dẫn cài đặt Python, Visual Studio Code và chuẩn bị môi trường lập trình.', 1716, 2, 1, 'published'),
(3, 1, 1, 'Lập trình Python cơ bản - nâng cao: Xử lý một số lỗi thường gặp khi không chạy được Python', 'Hướng dẫn nhận biết và xử lý các lỗi thường gặp khi cài đặt hoặc chạy Python.', 475, 3, 1, 'published'),
(4, 1, 1, 'Thực hành Code một số ví dụ đơn giản trên Python', 'Thực hành các ví dụ lập trình Python đơn giản để làm quen với cú pháp.', 1353, 4, 1, 'published'),
(5, 1, 1, 'Hướng dẫn sử dụng Website ideone để lưu trữ code lập trình trực tuyến một cách dễ dàng nhất', 'Hướng dẫn sử dụng công cụ trực tuyến để viết, lưu trữ và chạy thử code Python.', 628, 5, 1, 'published'),
(6, 1, 1, 'Khai báo biến trong Python', 'Tìm hiểu cách khai báo biến, đặt tên biến và sử dụng biến trong Python.', 459, 6, 1, 'published'),

(7, 1, 1, 'Kiểu dữ liệu CHUỖI trong Python', 'Giới thiệu kiểu dữ liệu chuỗi và các thao tác cơ bản với chuỗi trong Python.', 1449, 7, 1, 'published'),
(8, 1, 1, 'Kiểu dữ liệu CHUỖI trong Python (phần 2)', 'Thực hành nâng cao các thao tác xử lý chuỗi trong Python.', 1861, 8, 1, 'published'),
(9, 1, 1, 'Kiểu dữ liệu SỐ, toán tử trong lập trình Python', 'Tìm hiểu kiểu dữ liệu số và các toán tử cơ bản trong Python.', 1422, 9, 1, 'published'),
(10, 1, 1, 'Phép toán thao tác bit (bitwise) trong Python', 'Giới thiệu các phép toán thao tác bit và cách sử dụng trong Python.', 975, 10, 1, 'published'),
(11, 1, 1, 'Bài tập luyện tập xử lý, tính toán cơ bản trong Python', 'Luyện tập các bài toán tính toán cơ bản bằng Python.', 819, 11, 1, 'published'),
(12, 1, 1, 'Hàm nhập dữ liệu, thêm thư viện (import) và chuyển đổi kiểu dữ liệu trong Python', 'Hướng dẫn nhập dữ liệu, import thư viện và chuyển đổi kiểu dữ liệu.', 0, 12, 1, 'published'),

(13, 1, 1, 'Một số bài tập vận dụng tính toán cơ bản bằng Python', 'Thực hành thêm các bài tập vận dụng toán tử và tính toán cơ bản.', 355, 13, 1, 'published'),
(14, 1, 1, 'Sử dụng cấu trúc rẽ nhánh IF trong lập trình Python', 'Tìm hiểu cấu trúc điều kiện IF và cách rẽ nhánh chương trình.', 888, 14, 1, 'published'),
(15, 1, 1, 'Bài tập vận dụng cấu trúc IF trong Python (Phần 1)', 'Luyện tập xử lý điều kiện bằng cấu trúc IF trong Python.', 0, 15, 1, 'published'),
(16, 1, 1, 'Bài tập vận dụng cấu trúc IF trong Python (Phần 2)', 'Tiếp tục luyện tập các bài toán sử dụng cấu trúc IF.', 1764, 16, 1, 'published'),
(17, 1, 1, 'Cấu trúc lặp FOR, WHILE và lệnh BREAK, CONTINUE trong Python', 'Giới thiệu vòng lặp for, while và cách dùng break, continue.', 2182, 17, 1, 'published'),
(18, 1, 1, 'Một số bài tập vận dụng cấu trúc lặp FOR trong lập trình Python', 'Luyện tập sử dụng vòng lặp FOR để giải các bài toán cơ bản.', 0, 18, 1, 'published'),
(19, 1, 1, 'Một số bài tập vận dụng cấu trúc lặp WHILE trong lập trình Python', 'Luyện tập sử dụng vòng lặp WHILE trong các bài toán thực hành.', 1581, 19, 1, 'published'),

(20, 1, 1, 'Chữa bài tiền xu - đề thi Học sinh giỏi Trung học Cơ sở - code bằng Python', 'Chữa bài toán tiền xu bằng ngôn ngữ Python.', 787, 20, 1, 'published'),
(21, 1, 1, 'Cấu trúc dữ liệu danh sách (list) trong Python', 'Tìm hiểu danh sách list và các thao tác xử lý list trong Python.', 2346, 21, 1, 'published'),
(22, 1, 1, 'Code ứng dụng mô phỏng máy rút tiền ATM bằng Python', 'Thực hành xây dựng chương trình mô phỏng máy rút tiền ATM bằng Python.', 1016, 22, 1, 'published'),
(23, 1, 1, 'Bài tập luyện tập sử dụng cấu trúc dữ liệu danh sách (LIST) trong Python', 'Luyện tập các bài toán sử dụng cấu trúc dữ liệu list.', 1210, 23, 1, 'published'),
(24, 1, 1, 'Cấu trúc dữ liệu từ điển (dict) trong Python', 'Giới thiệu dictionary và cách lưu trữ dữ liệu dạng khóa - giá trị.', 1306, 24, 1, 'published'),
(25, 1, 1, 'Bài tập luyện tập sử dụng cấu trúc dữ liệu từ điển (DICT) trong Python', 'Luyện tập xử lý dữ liệu bằng dictionary trong Python.', 1895, 25, 1, 'published'),

(26, 1, 1, 'Xây dựng hàm (thủ tục) trong Python (phần 1)', 'Giới thiệu cách xây dựng hàm và tái sử dụng code trong Python.', 1013, 26, 1, 'published'),
(27, 1, 1, 'Xây dựng hàm (thủ tục) trong Python (phần 2)', 'Tiếp tục tìm hiểu cách xây dựng và sử dụng hàm trong Python.', 827, 27, 1, 'published'),
(28, 1, 1, 'Bài tập luyện tập về xây dựng hàm (thủ tục) trong Python (phần 1)', 'Luyện tập xây dựng hàm thông qua các bài toán thực hành.', 1936, 28, 1, 'published'),
(29, 1, 1, 'Bài tập luyện tập về xây dựng hàm (thủ tục) trong Python (phần 2)', 'Tiếp tục luyện tập xây dựng hàm trong Python.', 1663, 29, 1, 'published'),
(30, 1, 1, 'Đọc ghi file (tệp) trong Python', 'Hướng dẫn đọc và ghi file trong Python.', 3025, 30, 1, 'published'),

(31, 1, 1, 'Giới thiệu về thư viện Pandas trong Python và cách sử dụng cơ bản', 'Giới thiệu thư viện Pandas và các thao tác sử dụng cơ bản.', 2142, 31, 1, 'published'),
(32, 1, 1, 'Chữa bài tập đọc ghi file trong python', 'Chữa bài tập thực hành đọc và ghi file trong Python.', 1585, 32, 1, 'published'),
(33, 1, 1, 'Lập trình hướng đối tượng (OOP) trong Python', 'Giới thiệu lập trình hướng đối tượng trong Python.', 2031, 33, 1, 'published'),
(34, 1, 1, 'Quản lý sinh viên - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP với bài toán quản lý sinh viên.', 823, 34, 1, 'published'),
(35, 1, 1, 'Quản lý địa chỉ - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP với bài toán quản lý địa chỉ.', 466, 35, 1, 'published'),
(36, 1, 1, 'Quản lý điểm - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP với bài toán quản lý điểm.', 520, 36, 1, 'published'),

(37, 1, 1, 'Đồng hồ đơn giản - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP xây dựng chương trình đồng hồ đơn giản.', 1056, 37, 1, 'published'),
(38, 1, 1, 'Quản lý điểm danh - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP với bài toán quản lý điểm danh.', 719, 38, 1, 'published'),
(39, 1, 1, 'Hình chữ nhật - Chữa bài tập lập trình hướng đối tượng bằng Python', 'Chữa bài tập OOP với bài toán hình chữ nhật.', 437, 39, 1, 'published'),
(40, 1, 1, 'Chữa bài tập về hướng đối tượng (OOP) trong Python: Bài toán quản lý môn học (Phần 1)', 'Chữa bài tập OOP về bài toán quản lý môn học phần 1.', 1920, 40, 1, 'published'),
(41, 1, 1, 'Chữa bài tập về hướng đối tượng (OOP) trong Python: Bài toán quản lý môn học (Phần 2)', 'Chữa bài tập OOP về bài toán quản lý môn học phần 2.', 1759, 41, 1, 'published'),
(42, 1, 1, 'Chữa bài tập về hướng đối tượng (OOP) trong Python: Xây dựng lớp phương trình bậc 2 (Phần 3)', 'Chữa bài tập OOP xây dựng lớp phương trình bậc 2.', 2220, 42, 1, 'published'),

(43, 1, 1, 'Xây dựng chương trình quản lý sách (phần 1)', 'Thực hành xây dựng chương trình quản lý sách bằng Python phần 1.', 2000, 43, 1, 'published'),
(44, 1, 1, 'Xây dựng chương trình quản lý sách (phần 2)', 'Thực hành xây dựng chương trình quản lý sách bằng Python phần 2.', 1693, 44, 1, 'published'),
(45, 1, 1, 'Xây dựng chương trình quản lý sách (phần 3)', 'Thực hành xây dựng chương trình quản lý sách bằng Python phần 3.', 1213, 45, 1, 'published'),
(46, 1, 1, 'Xây dựng chương trình phát nhạc từ Internet bằng Python (phần 1)', 'Thực hành xây dựng chương trình phát nhạc từ Internet phần 1.', 1053, 46, 1, 'published'),
(47, 1, 1, 'Xây dựng chương trình phát nhạc từ Internet bằng Python (phần 2)', 'Thực hành xây dựng chương trình phát nhạc từ Internet phần 2.', 1499, 47, 1, 'published'),
(48, 1, 1, 'Xây dựng chương trình phát nhạc từ Internet bằng Python (phần 3)', 'Thực hành xây dựng chương trình phát nhạc từ Internet phần 3.', 1548, 48, 1, 'published'),
(49, 1, 1, 'Xây dựng chương trình phát nhạc từ Internet bằng Python (phần 4)', 'Thực hành xây dựng chương trình phát nhạc từ Internet phần 4.', 1320, 49, 1, 'published'),
(50, 1, 1, 'Xây dựng chương trình phát nhạc từ Internet bằng Python (phần 5)', 'Thực hành xây dựng chương trình phát nhạc từ Internet phần 5.', 2094, 50, 1, 'published'),

(51, 1, 1, 'Xây dựng ứng dụng sinh PASSWORD hoàn toàn ngẫu nhiên Code bằng Python', 'Thực hành xây dựng ứng dụng sinh mật khẩu ngẫu nhiên bằng Python.', 1311, 51, 1, 'published'),
(52, 1, 1, 'Làm Game Oẳn Tù Tì chơi với máy tính rất sinh động chỉ với 70 dòng Code bằng Python', 'Thực hành xây dựng game Oẳn Tù Tì bằng Python.', 1046, 52, 1, 'published'),
(53, 1, 1, 'Làm Game Hangman (đoán ô chữ) chơi với máy tính rất sinh động chỉ với 90 dòng Code bằng Python', 'Thực hành xây dựng game Hangman bằng Python.', 2121, 53, 1, 'published'),
(54, 1, 1, 'Làm chương trình mã hóa (code) và giải mã (encode) Caesar Cipher bằng Python', 'Thực hành xây dựng chương trình mã hóa và giải mã Caesar Cipher.', 1822, 54, 1, 'published'),
(55, 1, 1, 'Lập trình Game "Phiên đấu giá thầm lặng" bằng Python', 'Thực hành xây dựng game phiên đấu giá thầm lặng bằng Python.', 1042, 55, 1, 'published'),
(56, 1, 1, 'Lập trình Game "Đoán số" (Guess Number) bằng Python', 'Thực hành xây dựng game đoán số bằng Python.', 2520, 56, 1, 'published'),
(57, 1, 1, 'Lập trình Game "Cao hơn và Thấp hơn" bằng Python', 'Thực hành xây dựng game Cao hơn và Thấp hơn bằng Python.', 1902, 57, 1, 'published'),
(58, 1, 1, 'Giới thiệu, hướng dẫn Đăng ký - Sử dụng hệ thống luyện code "Học Công Nghệ Online Judge"', 'Hướng dẫn đăng ký và sử dụng hệ thống luyện code Học Công Nghệ Online Judge.', 1156, 58, 1, 'published'),
(59, 1, 1, 'Hướng dẫn cài đặt thêm thư viện trong Python sử dụng Pip Install và gỡ bỏ một thư viện', 'Hướng dẫn cài đặt và gỡ bỏ thư viện Python bằng pip.', 678, 59, 1, 'published'),
----------------------------------------------------
(60, 2, 2, 'Bài 1: Giới thiệu Django', 'Giới thiệu tổng quan về Django và vai trò của Django trong lập trình website bằng Python.', 114, 1, 1, 'published'),
(61, 2, 2, 'Bài 2: Tạo project Django', 'Hướng dẫn khởi tạo project Django đầu tiên và làm quen với cấu trúc thư mục cơ bản.', 256, 2, 1, 'published'),
(62, 2, 2, 'Bài 3: Tạo WebApp', 'Hướng dẫn tạo web app trong Django và kết nối app với project chính.', 689, 3, 1, 'published'),
(63, 2, 2, 'Bài 4: Template và Jinja', 'Tìm hiểu cách sử dụng template và cú pháp Jinja để hiển thị nội dung trên giao diện web.', 298, 4, 1, 'published'),
(64, 2, 2, 'Bài 5: Xử lý file', 'Hướng dẫn tổ chức, liên kết và xử lý các file cần thiết trong project Django.', 452, 5, 1, 'published'),
(65, 2, 2, 'Bài 6: Hoàn chỉnh blog', 'Thực hành hoàn thiện các phần cơ bản của website blog bằng Django.', 633, 6, 1, 'published'),

(66, 2, 2, 'Bài 7: Dùng Model tạo Database', 'Tìm hiểu cách sử dụng Model trong Django để tạo cấu trúc database.', 252, 7, 1, 'published'),
(67, 2, 2, 'Bài 8: Tương tác Database', 'Hướng dẫn tương tác với database thông qua Model và các thao tác dữ liệu cơ bản.', 352, 8, 1, 'published'),
(68, 2, 2, 'Bài 9: Hệ thống admin', 'Giới thiệu hệ thống quản trị admin có sẵn trong Django và cách sử dụng.', 350, 9, 1, 'published'),
(69, 2, 2, 'Bài 10: Liệt kê danh sách', 'Hướng dẫn lấy dữ liệu từ database và hiển thị danh sách dữ liệu lên giao diện.', 499, 10, 1, 'published'),
(70, 2, 2, 'Bài 11: Hiển thị bài viết', 'Thực hành hiển thị nội dung chi tiết của từng bài viết trên website Django.', 802, 11, 1, 'published'),
(71, 2, 2, 'Bài 12: Loại bỏ hardcode', 'Hướng dẫn thay thế dữ liệu hardcode bằng dữ liệu động từ database.', 210, 12, 1, 'published'),

(72, 2, 2, 'Bài 13: Xử lý lỗi 404', 'Hướng dẫn xử lý lỗi 404 khi người dùng truy cập vào nội dung không tồn tại.', 413, 13, 1, 'published'),
(73, 2, 2, 'Bài 14: Mô hình MVC', 'Giới thiệu mô hình MVC và cách Django tổ chức logic theo mô hình tương ứng.', 103, 14, 1, 'published'),
(74, 2, 2, 'Bài 15: Upload file', 'Hướng dẫn xây dựng chức năng upload file trong website Django.', 523, 15, 1, 'published'),
(75, 2, 2, 'Bài 16: Tạo form đăng ký', 'Thực hành tạo form đăng ký người dùng trong Django.', 1440, 16, 1, 'published'),
(76, 2, 2, 'Bài 17: Login - Logout', 'Hướng dẫn xây dựng chức năng đăng nhập và đăng xuất người dùng.', 619, 17, 1, 'published'),
(77, 2, 2, 'Bài 18: Generic view', 'Tìm hiểu Generic View trong Django để rút gọn code xử lý view.', 653, 18, 1, 'published'),
(78, 2, 2, 'Bài 19: Xử lý bình luận', 'Thực hành xây dựng chức năng xử lý bình luận cho bài viết trong website Django.', 1643, 19, 1, 'published');

-- Chèn dữ liệu lưu trữ video liên kết lesson_videos
INSERT INTO `lesson_videos` (`id`, `lesson_id`, `video_url`, `storage_provider`, `file_name`, `file_size`, `duration_seconds`, `processing_status`) VALUES
(1, 1, 'https://www.youtube.com/watch?v=ET3_kuuIGZs&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=1', 'YouTube', NULL, NULL, 294, 'completed'),
(2, 2, 'https://www.youtube.com/watch?v=FgPtO6ytP_w&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=2', 'YouTube', NULL, NULL, 1716, 'completed'),
(3, 3, 'https://www.youtube.com/watch?v=cTxQVlhCrgg&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=3', 'YouTube', NULL, NULL, 475, 'completed'),
(4, 4, 'https://www.youtube.com/watch?v=qCn3G-zJ6cQ&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=4', 'YouTube', NULL, NULL, 1353, 'completed'),
(5, 5, 'https://www.youtube.com/watch?v=b8BBaRlOqzk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=5', 'YouTube', NULL, NULL, 628, 'completed'),
(6, 6, 'https://www.youtube.com/watch?v=dN5RH2q0wqE&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=6', 'YouTube', NULL, NULL, 459, 'completed'),
(7, 7, 'https://www.youtube.com/watch?v=UNi-yVO_Njk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=7', 'YouTube', NULL, NULL, 1449, 'completed'),
(8, 8, 'http://youtube.com/watch?v=kHO1EU3Q6UA&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=8', 'YouTube', NULL, NULL, 1861, 'completed'),
(9, 9, 'https://www.youtube.com/watch?v=Ofh7X8fddKo&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=9', 'YouTube', NULL, NULL, 1422, 'completed'),
(10, 10, 'https://www.youtube.com/watch?v=kd7edoternk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=10', 'YouTube', NULL, NULL, 975, 'completed'),
(11, 11, 'https://www.youtube.com/watch?v=mRC5Sl-VAu8&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=11', 'YouTube', NULL, NULL, 819, 'completed'),
(12, 12, 'https://www.youtube.com/watch?v=-_i7qCLB3hE&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=12', 'YouTube', NULL, NULL, 0, 'completed'),
(13, 13, 'https://www.youtube.com/watch?v=t8RTk4yXzbk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=13', 'YouTube', NULL, NULL, 355, 'completed'),
(14, 14, 'https://www.youtube.com/watch?v=o3EkvqVHCQU&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=14', 'YouTube', NULL, NULL, 888, 'completed'),
(15, 15, 'https://www.youtube.com/watch?v=4embyg_k29s&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=15', 'YouTube', NULL, NULL, 0, 'completed'),
(16, 16, 'https://www.youtube.com/watch?v=b5Pntxx4sSI&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=16', 'YouTube', NULL, NULL, 1764, 'completed'),
(17, 17, 'https://www.youtube.com/watch?v=fkoBRTznbGs&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=17', 'YouTube', NULL, NULL, 2182, 'completed'),
(18, 18, 'https://www.youtube.com/watch?v=-oEN14IVxk8&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=18', 'YouTube', NULL, NULL, 0, 'completed'),
(19, 19, 'https://www.youtube.com/watch?v=yBODKOnRmU4&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=19', 'YouTube', NULL, NULL, 1581, 'completed'),
(20, 20, 'https://www.youtube.com/watch?v=U3OajWLWojE&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=20', 'YouTube', NULL, NULL, 787, 'completed'),
(21, 21, 'https://www.youtube.com/watch?v=0fvEb2ASdVM&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=21', 'YouTube', NULL, NULL, 2346, 'completed'),
(22, 22, 'https://www.youtube.com/watch?v=huUubvjFUTk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=22', 'YouTube', NULL, NULL, 1016, 'completed'),
(23, 23, 'https://www.youtube.com/watch?v=lU4Scr_6Jhs&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=23', 'YouTube', NULL, NULL, 1210, 'completed'),
(24, 24, 'https://www.youtube.com/watch?v=xNyAXOYRSds&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=24', 'YouTube', NULL, NULL, 1306, 'completed'),
(25, 25, 'https://www.youtube.com/watch?v=iFd8c169io4&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=25', 'YouTube', NULL, NULL, 1895, 'completed'),
(26, 26, 'https://www.youtube.com/watch?v=pKpGJsjhlZI&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=26', 'YouTube', NULL, NULL, 1013, 'completed'),
(27, 27, 'https://www.youtube.com/watch?v=VD_ilCe85Ik&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=27', 'YouTube', NULL, NULL, 827, 'completed'),
(28, 28, 'https://www.youtube.com/watch?v=MKw4HXEADCg&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=28', 'YouTube', NULL, NULL, 1936, 'completed'),
(29, 29, 'https://www.youtube.com/watch?v=B8cpFG8tUns&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=29', 'YouTube', NULL, NULL, 1663, 'completed'),
(30, 30, 'https://www.youtube.com/watch?v=Uj_IdLmjk5A&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=30', 'YouTube', NULL, NULL, 3025, 'completed'),
(31, 31, 'https://www.youtube.com/watch?v=lbEuqHPbK2g&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=31', 'YouTube', NULL, NULL, 2142, 'completed'),
(32, 32, 'https://www.youtube.com/watch?v=lxTNSuLnh4U&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=32', 'YouTube', NULL, NULL, 1585, 'completed'),
(33, 33, 'https://www.youtube.com/watch?v=Nai9mGLRheU&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=33', 'YouTube', NULL, NULL, 2031, 'completed'),
(34, 34, 'https://www.youtube.com/watch?v=SZtAQsdwIgI&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=34', 'YouTube', NULL, NULL, 823, 'completed'),
(35, 35, 'https://www.youtube.com/watch?v=xpCPZyNgPZc&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=35', 'YouTube', NULL, NULL, 466, 'completed'),
(36, 36, 'https://www.youtube.com/watch?v=Z4hndJgeK7E&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=36', 'YouTube', NULL, NULL, 520, 'completed'),
(37, 37, 'https://www.youtube.com/watch?v=dneN70gNgIc&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=37', 'YouTube', NULL, NULL, 1056, 'completed'),
(38, 38, 'https://www.youtube.com/watch?v=sb5TkjT-dfQ&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=38', 'YouTube', NULL, NULL, 719, 'completed'),
(39, 39, 'https://www.youtube.com/watch?v=JM5coJDDKCU&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=39', 'YouTube', NULL, NULL, 437, 'completed'),
(40, 40, 'https://www.youtube.com/watch?v=u4kw4Kc9QO0&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=40', 'YouTube', NULL, NULL, 1920, 'completed'),
(41, 41, 'https://www.youtube.com/watch?v=Bd2hF95iRCA&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=41', 'YouTube', NULL, NULL, 1759, 'completed'),
(42, 42, 'https://www.youtube.com/watch?v=3PBhpKvwkas&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=42', 'YouTube', NULL, NULL, 2220, 'completed'),
(43, 43, 'https://www.youtube.com/watch?v=eE5jg_mrL3g&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=43', 'YouTube', NULL, NULL, 2000, 'completed'),
(44, 44, 'https://www.youtube.com/watch?v=OLJ2e4qkyXc&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=44', 'YouTube', NULL, NULL, 1693, 'completed'),
(45, 45, 'https://www.youtube.com/watch?v=5qBEHclPglM&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=45', 'YouTube', NULL, NULL, 1213, 'completed'),
(46, 46, 'https://www.youtube.com/watch?v=9Zob-3Pod2I&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=46', 'YouTube', NULL, NULL, 1053, 'completed'),
(47, 47, 'https://www.youtube.com/watch?v=W6r8X-G6vf8&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=47', 'YouTube', NULL, NULL, 1499, 'completed'),
(48, 48, 'https://www.youtube.com/watch?v=pxTIDRDmEKk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=48', 'YouTube', NULL, NULL, 1548, 'completed'),
(49, 49, 'https://www.youtube.com/watch?v=O3SVuvzR5Dc&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=49', 'YouTube', NULL, NULL, 1320, 'completed'),
(50, 50, 'https://www.youtube.com/watch?v=UVDO27GM32o&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=50', 'YouTube', NULL, NULL, 2094, 'completed'),
(51, 51, 'https://www.youtube.com/watch?v=FqAf2rhtnu4&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=51', 'YouTube', NULL, NULL, 1311, 'completed'),
(52, 52, 'https://www.youtube.com/watch?v=hsZTwMNSZEk&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=52', 'YouTube', NULL, NULL, 1046, 'completed'),
(53, 53, 'https://www.youtube.com/watch?v=mXTga-RvVbs&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=53', 'YouTube', NULL, NULL, 2121, 'completed'),
(54, 54, 'https://www.youtube.com/watch?v=YjveRSgQJno&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=54', 'YouTube', NULL, NULL, 1822, 'completed'),
(55, 55, 'https://www.youtube.com/watch?v=kidAgHOn_YI&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=55', 'YouTube', NULL, NULL, 1042, 'completed'),
(56, 56, 'https://www.youtube.com/watch?v=nEUJJPyMGYM&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=56', 'YouTube', NULL, NULL, 2520, 'completed'),
(57, 57, 'https://www.youtube.com/watch?v=f9MBz3VGkfM&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=57', 'YouTube', NULL, NULL, 1902, 'completed'),
(58, 58, 'https://www.youtube.com/watch?v=W0IBds-7VnE&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=58', 'YouTube', NULL, NULL, 1156, 'completed'),
(59, 59, 'https://www.youtube.com/watch?v=OthFcakjl7o&list=PLzQuu4-Qxlh44nsjdQH2quvfKePtAaI3_&index=59', 'YouTube', NULL, NULL, 678, 'completed'),
---------------------------------------------------------
(60, 60, 'https://www.youtube.com/watch?v=VF0oC9mkkno&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=1', 'YouTube', NULL, NULL, 114, 'completed'),
(61, 61, 'https://www.youtube.com/watch?v=r18_RvCOb9s&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=2', 'YouTube', NULL, NULL, 256, 'completed'),
(62, 62, 'https://www.youtube.com/watch?v=zIhLrQCFmic&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=3', 'YouTube', NULL, NULL, 689, 'completed'),
(63, 63, 'https://www.youtube.com/watch?v=p1q39gPvDAI&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=4', 'YouTube', NULL, NULL, 298, 'completed'),
(64, 64, 'https://www.youtube.com/watch?v=_D5WGp2chtk&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=5', 'YouTube', NULL, NULL, 452, 'completed'),
(65, 65, 'https://www.youtube.com/watch?v=TzWwzM0SBRk&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=6', 'YouTube', NULL, NULL, 633, 'completed'),

(66, 66, 'https://www.youtube.com/watch?v=Sc2fy1XGFMc&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=7', 'YouTube', NULL, NULL, 252, 'completed'),
(67, 67, 'https://www.youtube.com/watch?v=SlWOyt9-Tvg&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=8', 'YouTube', NULL, NULL, 352, 'completed'),
(68, 68, 'https://www.youtube.com/watch?v=ngvLEU8qOL0&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=9', 'YouTube', NULL, NULL, 350, 'completed'),
(69, 69, 'https://www.youtube.com/watch?v=iKdt5tINHRI&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=10', 'YouTube', NULL, NULL, 499, 'completed'),
(70, 70, 'https://www.youtube.com/watch?v=82D3wwoCS68&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=11', 'YouTube', NULL, NULL, 802, 'completed'),
(71, 71, 'https://www.youtube.com/watch?v=mZzsEq7vYMg&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=12', 'YouTube', NULL, NULL, 210, 'completed'),

(72, 72, 'https://www.youtube.com/watch?v=R3_1J41t5Bc&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=13', 'YouTube', NULL, NULL, 413, 'completed'),
(73, 73, 'https://www.youtube.com/watch?v=f5KbZxOoT_k&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=14', 'YouTube', NULL, NULL, 103, 'completed'),
(74, 74, 'https://www.youtube.com/watch?v=XoZJ5gDMKQA&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=15', 'YouTube', NULL, NULL, 523, 'completed'),
(75, 75, 'https://www.youtube.com/watch?v=uLSto4HtZZs&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=16', 'YouTube', NULL, NULL, 1440, 'completed'),
(76, 76, 'https://www.youtube.com/watch?v=UU9mVwZocLo&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=17', 'YouTube', NULL, NULL, 619, 'completed'),
(77, 77, 'https://www.youtube.com/watch?v=OZnssR3TqIg&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=18', 'YouTube', NULL, NULL, 653, 'completed'),
(78, 78, 'https://www.youtube.com/watch?v=rlJh36N_IYU&list=PL33lvabfss1z8GYxjyMulCnhcYGk5ah8P&index=19', 'YouTube', NULL, NULL, 1643, 'completed');

-- chèn tổng quan nội dung video - lesson_summaries:
INSERT INTO lesson_summaries
(
    lesson_id,
    summary_text,
    key_points,
    generated_by
)
VALUES
-- (
--     1,
--     'Bài 1: Cài đặt, chạy Python và xử lý lỗi không chạy được

--     1. Giới thiệu môi trường Python.
--     Tìm hiểu Python là gì, vì sao cần cài đúng môi trường và vai trò của trình thông dịch khi chạy chương trình.

--     2. Cài đặt Python trên máy tính.
--     Thực hiện cài đặt Python, kiểm tra phiên bản và chú ý tùy chọn thêm Python vào PATH để có thể chạy lệnh từ Terminal hoặc Command Prompt.

--     3. Chạy chương trình Python đầu tiên.
--     Tạo file .py đơn giản, viết lệnh in kết quả ra màn hình và chạy thử để kiểm tra môi trường đã hoạt động đúng.

--     4. Nhận diện lỗi không chạy được.
--     Phân biệt lỗi do chưa cài Python, sai đường dẫn, sai interpreter, chạy nhầm thư mục hoặc lỗi cú pháp trong file code.

--     5. Tạo thói quen kiểm tra ban đầu.
--     Trước khi học cú pháp sâu hơn, cần biết cách mở terminal, kiểm tra phiên bản, chạy file và đọc thông báo lỗi cơ bản.',
--     '["Python", "Cài đặt Python", "python -version", "PATH", "Interpreter", "File .py", "Terminal/Command Prompt", "Lỗi cú pháp"]',
--     'AI Assistant'
-- ),
-- (
--     2,
--     'Bài 2: Các kiểu dữ liệu và khai báo biến trong Python

--     1. Giới thiệu biến trong Python.
--     Biến được dùng để lưu giá trị trong chương trình và có thể thay đổi trong quá trình chạy.

--     2. Tìm hiểu các kiểu dữ liệu cơ bản.
--     Làm quen với số nguyên, số thực, chuỗi ký tự và kiểu boolean để biểu diễn các dạng dữ liệu thường gặp.

--     3. Gán giá trị và in dữ liệu.
--     Sử dụng phép gán để đưa dữ liệu vào biến, sau đó dùng print() để hiển thị kết quả ra màn hình.

--     4. Kiểm tra kiểu dữ liệu.
--     Dùng type() để xem biến đang thuộc kiểu dữ liệu nào, từ đó tránh nhầm lẫn khi tính toán hoặc xử lý chuỗi.

--     5. Quy tắc đặt tên biến.
--     Đặt tên biến rõ nghĩa, không bắt đầu bằng số, không chứa ký tự đặc biệt không hợp lệ và không trùng từ khóa của Python.',
--     '["Biến", "Kiểu dữ liệu", "int", "float", "str", "bool", "type()", "print()", "Quy tắc đặt tên biến"]',
--     'AI Assistant'
-- ),
-- (
--     3,
--     'Bài 3: Hàm nhập dữ liệu, import thư viện và chuyển đổi kiểu dữ liệu

--     1. Nhập dữ liệu từ bàn phím.
--     Sử dụng input() để nhận dữ liệu do người dùng nhập, giúp chương trình có tính tương tác thay vì chỉ chạy dữ liệu cố định.

--     2. Đặc điểm dữ liệu nhập vào.
--     Hiểu rằng dữ liệu nhận từ input() luôn ở dạng chuỗi, kể cả khi người dùng nhập số.

--     3. Chuyển đổi kiểu dữ liệu.
--     Dùng int(), float() và str() để chuyển dữ liệu sang kiểu phù hợp trước khi tính toán hoặc nối chuỗi.

--     4. Import thư viện.
--     Dùng import để gọi các thư viện có sẵn, từ đó mở rộng khả năng của chương trình mà không cần tự viết mọi thứ.

--     5. Xử lý lỗi do sai kiểu.
--     Nhận biết lỗi thường gặp khi lấy chuỗi đi tính toán hoặc ép kiểu dữ liệu không hợp lệ.',
--     '["input()", "import", "int()", "float()", "str()", "Ép kiểu", "Dữ liệu nhập", "Thư viện"]',
--     'AI Assistant'
-- ),
-- (
--     4,
--     'Bài 4: Kiểu dữ liệu số và toán tử trong lập trình Python

--     1. Giới thiệu kiểu dữ liệu số.
--     Tìm hiểu cách Python biểu diễn số nguyên và số thực trong các phép tính cơ bản.

--     2. Sử dụng toán tử số học.
--     Thực hành các phép cộng, trừ, nhân, chia và cách viết biểu thức tính toán trong Python.

--     3. Phân biệt các phép chia.
--     Nắm rõ sự khác nhau giữa chia thường, chia lấy nguyên và chia lấy dư để tránh sai kết quả.

--     4. Tính lũy thừa và biểu thức phức hợp.
--     Dùng toán tử ** và dấu ngoặc để kiểm soát thứ tự ưu tiên trong biểu thức.

--     5. Kiểm tra kết quả tính toán.
--     Quan sát kiểu dữ liệu đầu ra và kiểm tra trường hợp kết quả số thực hoặc số nguyên không như mong muốn.',
--     '["int", "float", "Toán tử số học", "/", "//", "%", "**", "Thứ tự ưu tiên", "Biểu thức"]',
--     'AI Assistant'
-- ),
-- (
--     5,
--     'Bài 5: Bài tập luyện tập xử lý, tính toán cơ bản trong Python

--     1. Ôn lại biến và nhập dữ liệu.
--     Vận dụng biến, input() và ép kiểu để nhận dữ liệu từ người dùng trước khi xử lý.

--     2. Giải bài toán tính toán đơn giản.
--     Thực hành các bài như tính tổng, hiệu, diện tích, chu vi, chuyển đổi đơn vị hoặc tính giá trị biểu thức.

--     3. Tổ chức chương trình theo ba bước.
--     Rèn cách chia bài thành input - process - output để không bị rối khi viết code.

--     4. Hiển thị kết quả rõ ràng.
--     Dùng print() và định dạng thông báo để người dùng hiểu kết quả đang biểu thị điều gì.

--     5. Kiểm tra lại dữ liệu và công thức.
--     Soát lại kiểu dữ liệu, công thức tính và trường hợp nhập sai để hạn chế lỗi logic.',
--     '["Bài tập cơ bản", "input - process - output", "Biến", "Ép kiểu", "Toán tử", "print()", "Lỗi logic"]',
--     'AI Assistant'
-- ),
-- (
--     6,
--     'Bài 6: Toán tử bitwise trong Python

--     1. Giới thiệu xử lý dữ liệu ở mức bit.
--     Tìm hiểu cách số được biểu diễn dưới dạng nhị phân và vì sao có thể thao tác trực tiếp trên từng bit.

--     2. Sử dụng các toán tử bitwise.
--     Làm quen với AND, OR, XOR, NOT, dịch trái và dịch phải trong Python.

--     3. Phân biệt bitwise và logic.
--     Không nhầm toán tử & và | với and, or vì chúng hoạt động ở hai mức khác nhau.

--     4. Ứng dụng cơ bản của bitwise.
--     Hiểu bitwise thường dùng trong xử lý trạng thái, tối ưu, bài toán nhị phân hoặc một số bài thuật toán.

--     5. Cẩn trọng khi sử dụng.
--     Chỉ nên dùng bitwise khi thật sự hiểu biểu diễn nhị phâ!; nếu không, code dễ khó đọc và khó kiểm soát.',
--     '["Bitwise", "Nhị phân", "&", "|", "^", "~", "<<", ">>", "and/or"]',
--     'AI Assistant'
-- ),
(
    7,
    'Bài 7: Kiểu dữ liệu chuỗi STRING trong Python

    1. Giới thiệu chuỗi ký tự.
    Tìm hiểu string là kiểu dữ liệu dùng để lưu văn bản, ký tự, câu hoặc dữ liệu nhập dạng chữ.

    2. Khai báo và in chuỗi.
    Thực hành tạo chuỗi bằng dấu nháy đơn hoặc nháy kép, sau đó in chuỗi ra màn hình.

    3. Truy cập ký tự trong chuỗi.
    Dùng chỉ số để lấy từng ký tự và hiểu rằng chỉ số bắt đầu từ 0.

    4. Cắt chuỗi bằng slicing.
    Dùng cú pháp slicing để lấy một phần chuỗi theo vị trí bắt đầu, kết thúc và bước nhảy.

    5. Hiểu tính bất biến của chuỗi.
    Chuỗi trong Python là immutable, nghĩa là không thể sửa trực tiếp một ký tự trong chuỗi đã tạo.',
    '["String", "Chuỗi", "Index", "Slicing", "Immutable", "Nối chuỗi", "Ký tự", "Chỉ số 0"]',
    'AI Assistant'
),
(
    8,
    'Bài 8: Thao tác và xử lý chuỗi cơ bản

    1. Làm sạch dữ liệu chuỗi.
    Dùng strip() để loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi trước khi xử lý.

    2. Chuyển đổi chữ hoa và chữ thường.
    Dùng lower(), upper() hoặc các hàm liên quan để chuẩn hóa dữ liệu văn bản.

    3. Tìm kiếm và thay thế nội dung.
    Sử dụng các thao tác tìm chuỗi con và replace() để thay đổi nội dung trong chuỗi.

    4. Tách chuỗi thành danh sách.
    Dùng split() để chia chuỗi thành nhiều phần, thường dùng khi xử lý dữ liệu nhập hoặc dữ liệu từ file.

    5. Định dạng kết quả đầu ra.
    Biết cách ghép chuỗi hoặc định dạng chuỗi để hiển thị thông tin rõ ràng hơn.',
    '["strip()", "lower()", "upper()", "replace()", "split()", "Chuẩn hóa dữ liệu", "Định dạng chuỗi"]',
    'AI Assistant'
),
(
    9,
    'Bài 9: Cấu trúc rẽ nhánh IF trong Python

    1. Giới thiệu cấu trúc điều kiện.
    Tìm hiểu cách chương trình đưa ra quyết định dựa trên điều kiện đúng hoặc sai.

    2. Sử dụng if, elif, else.
    Viết các nhánh xử lý khác nhau cho từng trường hợp của bài toán.

    3. Dùng toán tử so sánh.
    Áp dụng các phép so sánh như >, <, ==, !=, >=, <= để tạo điều kiện.

    4. Kết hợp điều kiện logic.
    Dùng and, or, not khi bài toán cần xét nhiều điều kiện cùng lúc.

    5. Chú ý thụt lề.
    Python dùng thụt lề để xác định khối lệnh, nên sai indent có thể làm chương trình lỗi hoặc chạy sai logic.',
    '["if", "elif", "else", "Điều kiện", "Toán tử so sánh", "and", "or", "not", "Indentation"]',
    'AI Assistant'
),
(
    10,
    'Bài 10: Bài tập vận dụng cấu trúc IF - phần 1

    1. Luyện kiểm tra điều kiện đơn giản.
    Áp dụng if để kiểm tra số chẵn lẻ, số dương âm, điểm đạt hay không đạt.

    2. Phân loại dữ liệu đầu vào.
    Viết chương trình đưa dữ liệu vào các nhóm khác nhau dựa trên tiêu chí cho trước.

    3. Xử lý trường hợp biên.
    Chú ý các giá trị đặc biệt như 0, điểm đúng ngưỡng hoặc hai giá trị bằng nhau.

    4. Viết điều kiện rõ ràng.
    Không viết điều kiện quá rối! nên tách từng trường hợp để dễ kiểm tra.

    5. Rèn tư duy kiểm thử.
    Sau khi code, cần tự thử nhiều bộ dữ liệu để phát hiện lỗi logic.',
    '["Bài tập if", "Số chẵn lẻ", "Số dương âm", "Phân loại", "Trường hợp biên", "Kiểm thử"]',
    'AI Assistant'
),
(
    11,
    'Bài 11: Bài tập vận dụng cấu trúc IF - phần 2

    1. Xử lý bài toán nhiều điều kiện.
    Luyện các bài như xếp loại học lực, tính tiền theo mức, kiểm tra năm nhuận hoặc so sánh nhiều số.

    2. Sử dụng elif hợp lý.
    Dùng elif khi các trường hợp loại trừ nhau để chương trình không kiểm tra dư thừa.

    3. Kết hợp and và or.
    Áp dụng toán tử logic khi một kết quả phụ thuộc vào nhiều điều kiện cùng lúc.

    4. Tránh lỗi nhánh điều kiện chồng chéo.
    Sắp xếp điều kiện từ cụ thể đến tổng quát hoặc theo đúng thứ tự ngưỡng.

    5. Đọc lại đề trước khi code.
    Với bài nhiều điều kiện, hiểu sai yêu cầu thường nguy hiểm hơn sai cú pháp.',
    '["elif", "and", "or", "Nhiều điều kiện", "Xếp loại", "Năm nhuận", "Ngưỡng điều kiện"]',
    'AI Assistant'
),
(
    12,
    'Bài 12: Cấu trúc lặp FOR, WHILE và lệnh BREAK, CONTINUE

    1. Giới thiệu vòng lặp.
    Tìm hiểu cách lặp lại một khối lệnh nhiều lần thay vì viết code trùng lặp.

    2. Sử dụng vòng lặp for.
    Dùng for khi biết trước phạm vi lặp hoặc cần duyệt một dãy dữ liệu.

    3. Sử dụng vòng lặp while.
    Dùng while khi vòng lặp phụ thuộc vào điều kiện dừng chưa biết trước.

    4. Dừng hoặc bỏ qua vòng lặp.
    Sử dụng break để thoát vòng lặp sớm và continue để bỏ qua phần còn lại của lần lặp hiện tại.

    5. Tránh vòng lặp vô hạn.
    Luôn cập nhật biến điều kiện và xác định điểm dừng rõ ràng khi dùng while.',
    '["for", "while", "break", "continue", "range()", "Vòng lặp", "Điều kiện dừng", "Vòng lặp vô hạn"]',
    'AI Assistant'
),
(
    13,
    'Bài 13: Một số bài tập vận dụng cấu trúc lặp WHILE

    1. Luyện lặp theo điều kiện.
    Áp dụng while cho các bài mà số lần lặp phụ thuộc vào dữ liệu nhập hoặc trạng thái chương trình.

    2. Nhập dữ liệu đến khi hợp lệ.
    Viết chương trình yêu cầu người dùng nhập lại nếu dữ liệu chưa đúng điều kiện.

    3. Tính tổng và đếm theo điều kiện.
    Dùng while để cộng dồn, đếm số lần lặp hoặc xử lý dữ liệu cho đến khi đạt điều kiện dừng.

    4. Xây dựng menu đơn giản.
    Tạo menu lặp để người dùng chọn chức năng và thoát khi nhập lựa chọn kết thúc.

    5. Kiểm soát biến điều kiện.
    Cập nhật biến trong vòng lặp để tránh chương trình chạy mãi không dừng.',
    '["while", "Điều kiện dừng", "Nhập lại dữ liệu", "Menu", "Cộng dồn", "Đếm", "Vòng lặp vô hạn"]',
    'AI Assistant'
),
(
    14,
    'Bài 14: Bài tập vận dụng cấu trúc lặp FOR

    1. Luyện duyệt dãy số bằng for.
    Sử dụng for kết hợp range() để duyệt các dãy số theo yêu cầu.

    2. Tính toán trên nhiều phần tử.
    Thực hành tính tổng, đếm, tìm giá trị lớn nhất hoặc lọc phần tử thỏa điều kiện.

    3. In mẫu hình đơn giản.
    Dùng vòng lặp để in các mẫu lặp, giúp hiểu rõ biến chạy và số lần lặp.

    4. Sử dụng range() đúng cách.
    Hiểu start, stop, step và nhớ rằng stop không được bao gồm trong kết quả.

    5. Xác định đúng phạm vi lặp.
    Sai điểm đầu, điểm cuối hoặc bước nhảy có thể làm thiếu hoặc thừa dữ liệu.',
    '["for", "range()", "start", "stop", "step", "Tính tổng", "Đếm", "Mẫu hình"]',
    'AI Assistant'
),
(
    15,
    'Bài 15: Bài tập tổng hợp điều kiện và vòng lặp

    1. Kết hợp if với vòng lặp.
    Giải các bài toán cần vừa lặp qua dữ liệu vừa kiểm tra điều kiện trong từng lần lặp.

    2. Luyện bài toán thuật toán cơ bản.
    Thực hành kiểm tra số nguyên tố, tính giai thừa, xử lý dãy nhập vào hoặc thống kê dữ liệu đơn giản.

    3. Viết thuật toán trước khi code.
    Nên phác thảo các bước xử lý để tránh viết code theo cảm tính.

    4. Kiểm tra trường hợp biên.
    Thử các giá trị nhỏ, giá trị lớn, dữ liệu rỗng hoặc dữ liệu đúng ngưỡng.

    5. Rèn cách sửa lỗi logic.
    Quan sát biến thay đổi qua từng vòng lặp để tìm nguyên nhân khi kết quả sai.',
    '["if", "for", "while", "Thuật toán cơ bản", "Số nguyên tố", "Giai thừa", "Trường hợp biên"]',
    'AI Assistant'
),
(
    16,
    'Bài 16: Cấu trúc dữ liệu danh sách LIST trong Python

    1. Giới thiệu list.
    List là cấu trúc dữ liệu dùng để lưu nhiều giá trị theo thứ tự trong cùng một biến.

    2. Truy cập và thay đổi phần tử.
    Dùng chỉ số để lấy, sửa hoặc kiểm tra phần tử trong list.

    3. Thêm và xóa dữ liệu.
    Thực hành các thao tác append(), remove() hoặc các cách cập nhật danh sách.

    4. Duyệt list bằng vòng lặp.
    Kết hợp list với for để xử lý từng phần tử trong danh sách.

    5. Sắp xếp và kiểm tra kích thước.
    Dùng len(), sort() và các hàm cơ bản để quản lý dữ liệu trong list.',
    '["List", "append()", "remove()", "sort()", "len()", "Index", "Duyệt danh sách", "Mutable"]',
    'AI Assistant'
),
(
    17,
    'Bài 17: Bài tập luyện tập sử dụng LIST

    1. Nhập dữ liệu vào list.
    Thực hành tạo danh sách số, tên, điểm hoặc dữ liệu đơn giản từ người dùng.

    2. Tính toán trên list.
    Dùng vòng lặp để tính tổng, trung bình, đếm số phần tử hoặc tìm min/max.

    3. Lọc và sắp xếp dữ liệu.
    Chọn các phần tử thỏa điều kiện và sắp xếp danh sách theo yêu cầu.

    4. Tách bài toán thành từng bước.
    Phân chia rõ nhập dữ liệu, xử lý dữ liệu và hiển thị kết quả.

    5. Rèn kỹ năng kiểm tra chỉ số.
    Chú ý không truy cập vượt giới hạn list và xử lý list rỗng nếu có.',
    '["List", "Tính tổng", "Trung bình", "min()", "max()", "Lọc dữ liệu", "Sắp xếp", "IndexError"]',
    'AI Assistant'
),
(
    18,
    'Bài 18: Tuple, set và các cấu trúc dữ liệu liên quan

    1. Giới thiệu tuple.
    Tuple dùng để lưu dữ liệu có thứ tự nhưng ít thay đổi hoặc không cần chỉnh sửa sau khi tạo.

    2. Giới thiệu set.
    Set dùng để lưu tập hợp giá trị không trùng lặp và thường không quan tâm thứ tự.

    3. So sánh với list.
    Phân biệt cấu trúc có thể thay đổi và không thể thay đổi, có thứ tự và không có thứ tự.

    4. Ứng dụng loại bỏ trùng lặp.
    Dùng set khi cần lọc các giá trị lặp lại trong dữ liệu.

    5. Chọn cấu trúc phù hợp.
    Không phải bài nào cũng dùng list! cần chọn tuple, set hoặc list theo mục đích xử lý.',
    '["Tuple", "Set", "List", "Immutable", "Mutable", "Loại trùng", "Có thứ tự", "Không có thứ tự"]',
    'AI Assistant'
),
(
    19,
    'Bài 19: Cấu trúc dữ liệu DICTIONARY trong Python

    1. Giới thiệu dictionary.
    Dictionary lưu dữ liệu dưới dạng cặp khóa - giá trị, phù hợp với dữ liệu có nhãn.

    2. Truy cập dữ liệu bằng key.
    Dùng key để lấy giá trị thay vì dùng vị trí như list.

    3. Thêm, sửa và xóa phần tử.
    Thực hành cập nhật dictionary khi cần thay đổi thông tin của một đối tượng.

    4. Duyệt dictionary.
    Dùng vòng lặp để duyệt key, value hoặc cả hai tùy yêu cầu xử lý.

    5. Ứng dụng trong dữ liệu thực tế.
    Dictionary phù hợp để lưu thông tin học sinh, sản phẩm, tài khoản hoặc một bản ghi có nhiều thuộc tính.',
    '["Dictionary", "dict", "Key", "Value", "items()", "keys()", "values()", "KeyError", "Bản ghi"]',
    'AI Assistant'
),
(
    20,
    'Bài 20: Bài tập luyện tập sử dụng DICT

    1. Lưu dữ liệu có nhiều thuộc tính.
    Áp dụng dictionary để quản lý học sinh, điểm số, từ vựng hoặc sản phẩm.

    2. Kết hợp dict với list.
    Làm quen mô hình list chứa nhiều dict để lưu nhiều bản ghi cùng loại.

    3. Tìm kiếm và cập nhật dữ liệu.
    Thực hành lấy dữ liệu theo key, sửa thông tin và kiểm tra sự tồn tại của key.

    4. Xử lý dữ liệu dạng bảng đơn giản.
    Dùng dict để mô phỏng dữ liệu có cột và giá trị tương ứng.

    5. Tránh lỗi sai tên key.
    Cần thống nhất tên key vì chỉ cần sai một ký tự cũng có thể gây lỗi KeyError hoặc sai kết quả.',
    '["dict", "List of dict", "Key", "Value", "Quản lý dữ liệu", "Tìm kiếm", "Cập nhật", "KeyError"]',
    'AI Assistant'
),
(
    21,
    'Bài 21: Xây dựng hàm/thủ tục trong Python - phần 1

    1. Giới thiệu hàm.
    Hàm giúp gom một nhóm lệnh thành một khối có tên để gọi lại nhiều lần.

    2. Khai báo hàm bằng def.
    Dùng từ khóa def để tạo hàm và xác định phần thân hàm bằng thụt lề.

    3. Sử dụng tham số.
    Truyền dữ liệu vào hàm thông qua tham số để hàm xử lý linh hoạt hơn.

    4. Trả kết quả bằng return.
    Dùng return khi cần đưa kết quả xử lý ra ngoài hàm để tiếp tục sử dụng.

    5. Tách chương trình thành các phần nhỏ.
    Hiểu lợi ích của hàm trong việc giảm lặp code, dễ đọc và dễ kiểm thử.',
    '["Hàm", "def", "Tham số", "return", "print()", "Tái sử dụng code", "Kiểm thử"]',
    'AI Assistant'
),
(
    22,
    'Bài 22: Xây dựng hàm/thủ tục trong Python - phần 2

    1. Mở rộng cách dùng tham số.
    Tìm hiểu tham số mặc định và cách truyền dữ liệu vào hàm theo nhiều tình huống.

    2. Phạm vi biến.
    Phân biệt biến cục bộ trong hàm và biến toàn cục bên ngoài hàm.

    3. Tổ chức chương trình nhiều hàm.
    Chia một chương trình thành nhiều hàm nhỏ, mỗi hàm phụ trách một nhiệm vụ cụ thể.

    4. Hạn chế lạm dụng global.
    Biến toàn cục có thể làm chương trình khó kiểm soát nếu bị thay đổi từ nhiều nơi.

    5. Viết hàm dễ đọc.
    Tên hàm nên thể hiện hành động hoặc mục đích xử lý để người khác dễ hiểu code.',
    '["Tham số mặc định", "Local variable", "Global variable", "global", "Tổ chức chương trình", "Tên hàm"]',
    'AI Assistant'
),
(
    23,
    'Bài 23: Bài tập luyện tập về xây dựng hàm - phần 1

    1. Chuyển bài toán nhỏ thành hàm.
    Viết hàm cho các tác vụ như tính diện tích, kiểm tra số chẵn hoặc chuẩn hóa chuỗi.

    2. Xác định đầu vào của hàm.
    Trước khi code, cần biết hàm nhận những tham số nào.

    3. Xác định đầu ra của hàm.
    Quyết định hàm nên return kết quả hay chỉ in ra màn hình.

    4. Tái sử dụng logic.
    Gọi lại cùng một hàm với nhiều dữ liệu khác nhau để tránh viết lặp.

    5. Kiểm tra hàm độc lập.
    Thử từng hàm riêng trước khi ghép vào chương trình lớn.',
    '["def", "Tham số", "return", "Tính diện tích", "Kiểm tra số", "Chuẩn hóa chuỗi", "Tái sử dụng"]',
    'AI Assistant'
),
(
    24,
    'Bài 24: Bài tập luyện tập về xây dựng hàm - phần 2

    1. Giải bài toán phức tạp hơn bằng hàm.
    Kết hợp list, dict, điều kiện và vòng lặp trong các hàm riêng.

    2. Chia nhỏ chức năng.
    Một chương trình lớn nên được chia thành các hàm như nhập dữ liệu, xử lý và xuất kết quả.

    3. Tránh viết lặp code.
    Những đoạn xử lý xuất hiện nhiều lần nên được tách thành hàm.

    4. Đặt tên hàm rõ nghĩa.
    Tên hàm nên giúp người đọc biết hàm làm gì mà không cần đọc toàn bộ code.

    5. Kiểm soát luồng dữ liệu.
    Cần biết dữ liệu đi vào hàm, được biến đổi như thế nào và trả ra kết quả gì.',
    '["Hàm", "Chia nhỏ bài toán", "List", "Dict", "Vòng lặp", "return", "Tên hàm", "Refactor"]',
    'AI Assistant'
),
(
    25,
    'Bài 25: Bài tập luyện tập về xây dựng hàm - phần 3

    1. Củng cố tư duy lập trình có cấu trúc.
    Tiếp tục luyện viết chương trình bằng nhiều hàm thay vì một khối lệnh dài.

    2. Kết hợp nhiều hàm trong một chương trình.
    Một hàm có thể gọi hàm khác để tạo thành quy trình xử lý hoàn chỉnh.

    3. Xử lý dữ liệu đầu vào.
    Viết hàm kiểm tra hoặc chuẩn hóa dữ liệu trước khi đưa vào bước tính toán chính.

    4. Tăng khả năng bảo trì code.
    Khi chức năng thay đổi, chỉ cần sửa hàm liên quan thay vì sửa nhiều đoạn code lặp.

    5. Rèn cách đọc lỗi trong hàm.
    Khi lỗi xảy ra, cần xác định lỗi nằm ở hàm nào và dữ liệu truyền vào có đúng không.',
    '["Hàm con", "Gọi hàm", "Kiểm tra dữ liệu", "Bảo trì code", "Debug", "Refactor"]',
    'AI Assistant'
),
(
    26,
    'Bài 26: Bài tập tổng hợp nền tảng Python

    1. Ôn lại kiến thức đã học.
    Tổng hợp biến, kiểu dữ liệu, điều kiện, vòng lặp, list, dict và hàm trong một số bài thực hành.

    2. Phân tích yêu cầu trước khi code.
    Đọc đề, xác định dữ liệu vào, dữ liệu ra và các bước xử lý chính.

    3. Ghép nhiều kỹ thuật lại với nhau.
    Không học từng cú pháp riêng lẻ mà biết kết hợp chúng để giải bài toán hoàn chỉnh.

    4. Kiểm tra kết quả nhiều trường hợp.
    Thử dữ liệu bình thường, dữ liệu biên và dữ liệu dễ gây lỗi.

    5. Rút kinh nghiệm sau mỗi bài.
    Ghi lại lỗi thường gặp để tránh lặp lại trong các bài sau.',
    '["Tổng hợp Python", "Biến", "Điều kiện", "Vòng lặp", "List", "Dict", "Hàm", "Debug"]',
    'AI Assistant'
),
(
    27,
    'Bài 27: Làm việc với file trong Python

    1. Giới thiệu đọc ghi file.
    Tìm hiểu cách lưu dữ liệu ra file và đọc dữ liệu từ file để chương trình không mất dữ liệu sau khi tắt.

    2. Mở file với open().
    Sử dụng open() với các chế độ đọc, ghi hoặc ghi thêm tùy mục đích.

    3. Đọc nội dung file.
    Thực hành đọc toàn bộ nội dung hoặc đọc từng dòng để xử lý dữ liệu.

    4. Ghi dữ liệu vào file.
    Dùng write() hoặc các cách ghi khác để lưu kết quả xử lý ra file.

    5. Đóng file và xử lý an toàn.
    Ưu tiên dùng with open(...) để tự động đóng file và giảm lỗi quên giải phóng tài nguyên.',
    '["File", "open()", "read()", "readline()", "write()", "with open", "Chế độ r/w/a", "Đọc ghi dữ liệu"]',
    'AI Assistant'
),
(
    28,
    'Bài 28: Lập trình hướng đối tượng OOP trong Python - phần 1

    1. Giới thiệu lập trình hướng đối tượng.
    OOP giúp tổ chức chương trình quanh các đối tượng có dữ liệu và hành vi riêng.

    2. Khai báo lớp.
    Dùng class để định nghĩa khuôn mẫu cho các đối tượng cùng loại.

    3. Tạo đối tượng.
    Từ một lớp có thể tạo nhiều đối tượng với dữ liệu khác nhau.

    4. Sử dụng thuộc tính.
    Thuộc tính lưu thông tin của đối tượng, ví dụ tên, tuổi, điểm hoặc trạng thái.

    5. Hiểu vai trò của self.
    self đại diện cho chính đối tượng đang được thao tác trong phương thức.',
    '["OOP", "class", "object", "self", "Thuộc tính", "Đối tượng", "Lớp"]',
    'AI Assistant'
),
(
    29,
    'Bài 29: Lập trình hướng đối tượng OOP trong Python - phần 2

    1. Mở rộng khái niệm phương thức.
    Phương thức là hàm nằm trong lớp, dùng để xử lý dữ liệu của đối tượng.

    2. Hàm khởi tạo __init__.
    Dùng __init__ để gán giá trị ban đầu cho thuộc tính khi tạo đối tượng.

    3. Tổ chức dữ liệu trong đối tượng.
    Đưa dữ liệu và hành vi liên quan vào cùng một lớp để code dễ quản lý.

    4. Tái sử dụng lớp.
    Một lớp có thể dùng lại nhiều lần trong chương trình hoặc trong các bài toán tương tự.

    5. Tránh nhầm lớp và đối tượng.
    Lớp là khuôn mẫu, còn đối tượng là một thực thể cụ thể được tạo từ lớp.',
    '["OOP", "Phương thức", "__init__", "Class", "Object", "self", "Tái sử dụng"]',
    'AI Assistant'
),
(
    30,
    'Bài 30: Lập trình hướng đối tượng OOP trong Python - phần 3

    1. Củng cố cách thiết kế lớp.
    Xác định lớp cần có thuộc tính nào và phương thức nào dựa trên yêu cầu bài toán.

    2. Làm việc với nhiều đối tượng.
    Tạo nhiều đối tượng cùng lớp và quản lý chúng trong list hoặc cấu trúc dữ liệu khác.

    3. Cập nhật trạng thái đối tượng.
    Dùng phương thức để thay đổi thuộc tính của đối tượng một cách có kiểm soát.

    4. Tư duy mô hình hóa thực tế.
    Biến các thực thể như sách, học sinh, sản phẩm thành lớp trong chương trình.

    5. Chuẩn bị cho dự án quản lý.
    Các kiến thức OOP là nền tảng để xây dựng chương trình quản lý dữ liệu ở các bài sau.',
    '["Thiết kế lớp", "Nhiều đối tượng", "List object", "Thuộc tính", "Phương thức", "Mô hình hóa"]',
    'AI Assistant'
),
(
    31,
    'Bài 31: Kế thừa trong lập trình hướng đối tượng Python

    1. Giới thiệu kế thừa.
    Kế thừa cho phép lớp con sử dụng lại thuộc tính và phương thức của lớp cha.

    2. Xây dựng lớp cha và lớp con.
    Thiết kế phần chung trong lớp cha và phần riêng trong lớp con để tránh lặp code.

    3. Gọi lại xử lý của lớp cha.
    Dùng super() khi cần mở rộng hoặc tái sử dụng logic khởi tạo từ lớp cha.

    4. Ghi đè phương thức.
    Lớp con có thể định nghĩa lại phương thức nếu hành vi khác với lớp cha.

    5. Ứng dụng kế thừa hợp lý.
    Chỉ nên dùng kế thừa khi thật sự có quan hệ “là một”, tránh ép mô hình gây khó hiểu.',
    '["Kế thừa", "Lớp cha", "Lớp con", "super()", "Override", "Tái sử dụng code", "OOP"]',
    'AI Assistant'
),
(
    32,
    'Bài 32: Bài tập OOP và quản lý dữ liệu bằng Python

    1. Áp dụng OOP vào bài thực hành.
    Dùng lớp và đối tượng để quản lý dữ liệu thay vì chỉ dùng biến rời rạc.

    2. Xây dựng đối tượng dữ liệu.
    Tạo các lớp như học sinh, sách, sản phẩm hoặc tài khoản tùy bài toán.

    3. Quản lý danh sách đối tượng.
    Lưu nhiều object trong list để thêm, sửa, xóa hoặc tìm kiếm.

    4. Viết phương thức xử lý.
    Đưa logic liên quan vào trong lớp để chương trình gọn và đúng hướng OOP hơn.

    5. Kết hợp với kiến thức cũ.
    OOP vẫn cần dùng list, dict, vòng lặp, điều kiện và hàm để hoàn thiện chương trình.',
    '["OOP", "Object", "List object", "Quản lý dữ liệu", "Thêm sửa xóa", "Tìm kiếm", "Phương thức"]',
    'AI Assistant'
),
(
    33,
    'Bài 33: Xây dựng chương trình quản lý sách bằng Python - phần 1

    1. Giới thiệu bài toán quản lý sách.
    Xác định dữ liệu cần quản lý như mã sách, tên sách, tác giả, giá hoặc số lượng.

    2. Thiết kế cấu trúc dữ liệu.
    Chọn cách lưu sách bằng class, dict hoặc list tùy hướng triển khai.

    3. Xây dựng chức năng thêm sách.
    Tạo chức năng nhập thông tin sách và lưu vào danh sách quản lý.

    4. Hiển thị danh sách sách.
    In danh sách dữ liệu ra màn hình theo định dạng dễ đọc.

    5. Chuẩn bị mở rộng chương trình.
    Tổ chức code để có thể thêm chức năng tìm kiếm, sửa, xóa hoặc lưu file ở phần sau.',
    '["Quản lý sách", "Class", "List", "Thêm dữ liệu", "Hiển thị dữ liệu", "CRUD", "OOP"]',
    'AI Assistant'
),
(
    34,
    'Bài 34: Xây dựng chương trình quản lý sách bằng Python - phần 2

    1. Mở rộng chương trình quản lý sách.
    Bổ sung các chức năng nâng cao hơn so với phần tạo và hiển thị ban đầu.

    2. Tìm kiếm dữ liệu sách.
    Xây dựng chức năng tìm sách theo mã, tên hoặc tiêu chí phù hợp.

    3. Sửa và xóa thông tin.
    Cho phép cập nhật dữ liệu sách hoặc loại bỏ sách khỏi danh sách quản lý.

    4. Tổ chức chức năng bằng hàm/phương thức.
    Tách từng chức năng thành phần riêng để tránh viết lặp và dễ bảo trì.

    5. Hướng tới chương trình hoàn chỉnh.
    Có thể kết hợp thêm lưu file hoặc menu để người dùng thao tác thuận tiện hơn.',
    '["Quản lý sách", "Tìm kiếm", "Sửa", "Xóa", "CRUD", "Hàm", "Phương thức", "Lưu file"]',
    'AI Assistant'
),
(
    35,
    'Bài 35: Chữa bài tiền xu - đề thi học sinh giỏi THCS

    1. Đọc và phân tích đề bài.
    Xác định yêu cầu của bài toán tiền xu, dữ liệu đầu vào, dữ liệu đầu ra và điều kiện ràng buộc.

    2. Tìm quy luật xử lý.
    Suy nghĩ cách chọn hoặc đếm tiền xu sao cho đáp ứng yêu cầu đề bài.

    3. Xây dựng thuật toán.
    Viết các bước xử lý trước khi chuyển thành code Python.

    4. Kiểm tra ví dụ mẫu.
    So sánh kết quả chương trình với ví dụ hoặc cách tính thủ công.

    5. Rút kinh nghiệm làm bài thi.
    Trong bài thuật toán, hiểu đúng đề và ràng buộc quan trọng hơn việc code thật nhanh.',
    '["Bài tiền xu", "Thuật toán", "Input", "Output", "Ràng buộc", "Tối ưu", "Kiểm thử"]',
    'AI Assistant'
),
(
    36,
    'Bài 36: Giải đề thi học sinh giỏi Tin học bằng Python

    1. Tiếp cận đề thi Tin học.
    Tập đọc đề theo hướng xác định dữ liệu vào, dữ liệu ra, ví dụ mẫu và giới hạn dữ liệu.

    2. Phân tích thuật toán.
    Tìm cách giải phù hợp trước khi viết code, tránh chỉ thử ngẫu nhiên.

    3. Triển khai bằng Python.
    Chuyển thuật toán thành chương trình có biến, điều kiện, vòng lặp và cấu trúc dữ liệu cần thiết.

    4. Kiểm tra độ đúng.
    Chạy thử với nhiều bộ dữ liệu, đặc biệt là trường hợp biên và dữ liệu lớn.

    5. Tư duy tối ưu.
    Không chỉ cần đúng với ví dụ mẫu mà còn phải chạy được với ràng buộc của đề.',
    '["Đề thi Tin học", "Thuật toán", "Input", "Output", "Trường hợp biên", "Độ phức tạp", "Python"]',
    'AI Assistant'
),
(
    37,
    'Bài 37: Thuật toán quay lui Backtracking

    1. Giới thiệu backtracking.
    Backtracking là kỹ thuật thử một lựa chọn, đi tiếp nếu hợp lệ và quay lại khi lựa chọn đó không còn phù hợp.

    2. Xác định trạng thái và lựa chọn.
    Mỗi bước cần biết trạng thái hiện tại và các lựa chọn có thể thử tiếp.

    3. Thiết lập điều kiện dừng.
    Khi đạt được lời giải hoặc không còn lựa chọn hợp lệ, thuật toán cần dừng đúng chỗ.

    4. Hoàn tác sau khi thử.
    Sau mỗi lựa chọn, cần quay lại trạng thái trước đó để thử lựa chọn khác.

    5. Ứng dụng của quay lui.
    Thường dùng cho bài toán tổ hợp, hoán vị, liệt kê lời giải hoặc bài toán có ràng buộc.',
    '["Backtracking", "Quay lui", "Đệ quy", "Điều kiện dừng", "Hoàn tác", "Tổ hợp", "Hoán vị"]',
    'AI Assistant'
),
(
    38,
    'Bài 38: Bài toán luyện tư duy thuật toán nâng cao

    1. Rèn tư duy phân tích vấn đề.
    Tập nhìn bài toán theo dữ liệu, điều kiện, quy luật và mục tiêu cần tìm.

    2. Kết hợp nhiều kiến thức nền.
    Sử dụng vòng lặp, điều kiện, list, dict hoặc hàm để xử lý bài toán phức tạp hơn.

    3. Xem xét trường hợp biên.
    Chú ý dữ liệu nhỏ nhất, lớn nhất, dữ liệu rỗng hoặc dữ liệu đặc biệt.

    4. Đánh giá hiệu quả thuật toán.
    Không chỉ quan tâm code chạy được mà còn cần xem cách làm có đủ nhanh hay không.

    5. Luyện cách debug thuật toán.
    Theo dõi từng bước biến đổi của dữ liệu để tìm lỗi sai trong logic.',
    '["Tư duy thuật toán", "Điều kiện", "Vòng lặp", "Cấu trúc dữ liệu", "Trường hợp biên", "Tối ưu", "Debug"]',
    'AI Assistant'
),
(
    39,
    'Bài 39: Vẽ biểu đồ cột thể hiện thu nhập hàng tháng bằng Python

    1. Giới thiệu trực quan hóa dữ liệu.
    Biểu đồ giúp dữ liệu số trở nên dễ hiểu hơn so với chỉ nhìn bảng hoặc danh sách.

    2. Chuẩn bị dữ liệu biểu đồ.
    Xác định dữ liệu trục ngang, trục dọc, đơn vị đo và tiêu đề cần hiển thị.

    3. Vẽ biểu đồ cột.
    Sử dụng thư viện Python phù hợp để tạo biểu đồ cột thể hiện thu nhập theo tháng.

    4. Tùy chỉnh thông tin biểu đồ.
    Thêm tiêu đề, nhãn trục và chú thích để người xem hiểu đúng ý nghĩa dữ liệu.

    5. Đọc và đánh giá kết quả.
    Quan sát xu hướng tăng giảm qua từng tháng và kiểm tra biểu đồ có phản ánh đúng dữ liệu không.',
    '["Biểu đồ cột", "Trực quan hóa dữ liệu", "matplotlib", "Trục x", "Trục y", "Tiêu đề", "Nhãn trục"]',
    'AI Assistant'
),
(
    40,
    'Bài 40: Giới thiệu thư viện Pandas trong Python

    1. Giới thiệu Pandas.
    Pandas là thư viện mạnh để xử lý dữ liệu dạng bảng trong Python.

    2. Làm quen với Series và DataFrame.
    Hiểu DataFrame giống một bảng có hàng và cột, còn Series giống một cột dữ liệu.

    3. Đọc và xem dữ liệu.
    Thực hành đọc dữ liệu và dùng các lệnh xem nhanh như xem dòng đầu hoặc thông tin tổng quan.

    4. Chọn cột và lọc dữ liệu.
    Làm quen thao tác lấy một phần dữ liệu theo cột hoặc điều kiện.

    5. Ứng dụng trong Excel/CSV.
    Pandas rất hữu ích khi cần phân tích dữ liệu từ file bảng như Excel hoặc CSV.',
    '["Pandas", "Series", "DataFrame", "Excel", "CSV", "Lọc dữ liệu", "head()", "Cột dữ liệu"]',
    'AI Assistant'
),
(
    41,
    'Bài 41: Làm việc với dữ liệu dạng bảng bằng Pandas

    1. Xử lý dữ liệu dạng bảng.
    Tiếp tục thao tác với DataFrame để lọc, tính toán và thống kê dữ liệu.

    2. Kiểm tra tên cột và kiểu dữ liệu.
    Trước khi phân tích, cần biết dữ liệu gồm những cột nào và mỗi cột thuộc kiểu gì.

    3. Tính toán và tạo cột mới.
    Dùng Pandas để tính giá trị mới từ dữ liệu có sẵn và thêm vào bảng.

    4. Xử lý dữ liệu thiếu hoặc sai.
    Nhận biết giá trị thiếu, dữ liệu nhập không đúng kiểu hoặc tên cột bị sai.

    5. Xuất dữ liệu sau xử lý.
    Có thể lưu kết quả ra file để tiếp tục dùng hoặc chia sẻ.',
    '["Pandas", "DataFrame", "Lọc dữ liệu", "Thống kê", "Kiểu dữ liệu", "Giá trị thiếu", "Xuất file"]',
    'AI Assistant'
),
(
    42,
    'Bài 42: Xây dựng chương trình phát nhạc từ Internet bằng Python

    1. Giới thiệu mini-project phát nhạc.
    Bài học cho thấy Python có thể kết hợp thư viện ngoài để tạo ứng dụng thực tế.

    2. Xử lý nguồn nhạc từ Internet.
    Làm quen với việc dùng đường dẫn hoặc nguồn dữ liệu online làm đầu vào cho chương trình.

    3. Kết hợp thư viện hỗ trợ.
    Sử dụng thư viện phù hợp để phát âm thanh hoặc điều khiển tác vụ liên quan.

    4. Xử lý lỗi khi chạy ứng dụng.
    Cần chú ý lỗi kết nối, đường dẫn không hợp lệ hoặc thư viện chưa được cài đặt.

    5. Hiểu cách ghép nhiều phần.
    Một ứng dụng nhỏ thường gồm nhập dữ liệu, gọi thư viện, xử lý lỗi và phản hồi với người dùng.',
    '["Mini-project", "Phát nhạc", "Internet", "Thư viện ngoài", "Đường dẫn", "Xử lý lỗi", "Ứng dụng Python"]',
    'AI Assistant'
),
(
    43,
    'Bài 43: Giới thiệu khóa học lập trình Game với Python

    1. Chuyển hướng sang lập trình game.
    Bài học giới thiệu mục tiêu học game bằng Python sau khi đã có nền tảng cú pháp.

    2. Tìm hiểu thành phần của game.
    Một game thường có đối tượng, trạng thái, luật chơi, vòng lặp cập nhật và xử lý sự kiện.

    3. Giới thiệu thư viện Turtle và Pygame.
    Turtle phù hợp để học trực quan ban đầu, còn Pygame mạnh hơn cho game phức tạp.

    4. Tư duy thiết kế game.
    Trước khi code cần xác định nhân vật, mục tiêu, điều kiện thắng thua và cách người chơi điều khiển.

    5. Chuẩn bị cho các dự án nhỏ.
    Các bài sau sẽ dùng kiến thức cũ kết hợp với đồ họa, sự kiện và chuyển động.',
    '["Game Python", "Turtle", "Pygame", "Vòng lặp game", "Sự kiện", "Trạng thái", "Luật chơi"]',
    'AI Assistant'
),
(
    44,
    'Bài 44: Giới thiệu thư viện Turtle - phần 1

    1. Giới thiệu Turtle.
    Turtle là thư viện giúp vẽ hình và học lập trình trực quan thông qua chuyển động của con trỏ.

    2. Tạo màn hình vẽ.
    Thiết lập cửa sổ để hiển thị kết quả vẽ bằng Turtle.

    3. Điều khiển con trỏ.
    Dùng các lệnh di chuyển, quay trái, quay phải để tạo đường vẽ.

    4. Thay đổi màu sắc và nét vẽ.
    Làm quen với cách đặt màu, kích thước nét và các thuộc tính hiển thị.

    5. Hiểu tọa độ và góc.
    Turtle giúp người học hình dung mối quan hệ giữa tọa độ, hướng di chuyển và hình được vẽ.',
    '["Turtle", "Screen", "forward()", "backward()", "left()", "right()", "Màu sắc", "Tọa độ"]',
    'AI Assistant'
),
(
    45,
    'Bài 45: Giới thiệu thư viện Turtle - phần 2

    1. Mở rộng thao tác với Turtle.
    Tiếp tục học các lệnh nâng cao hơn để điều khiển đối tượng vẽ linh hoạt.

    2. Điều chỉnh tốc độ và vị trí.
    Thay đổi tốc độ, đưa turtle đến vị trí mới và kiểm soát hướng di chuyển.

    3. Vẽ hình bằng vòng lặp.
    Kết hợp Turtle với for để vẽ các hình lặp lại hoặc mẫu hình đều.

    4. Tạo nhiều đối tượng Turtle.
    Sử dụng nhiều turtle khác nhau để chuẩn bị cho các game có nhiều nhân vật.

    5. Xử lý sự kiện cơ bản.
    Bước đầu làm quen với việc phản hồi thao tác người dùng như nhấn phím hoặc click.',
    '["Turtle", "speed()", "goto()", "penup()", "pendown()", "Vòng lặp", "Nhiều đối tượng", "Sự kiện"]',
    'AI Assistant'
),
(
    46,
    'Bài 46: Giới thiệu game cuộc đua rùa bằng Turtle

    1. Giới thiệu ý tưởng game.
    Game cuộc đua rùa gồm nhiều rùa xuất phát cùng lúc và cạnh tranh để về đích trước.

    2. Xác định đối tượng trong game.
    Các đối tượng chính gồm nhiều turtle, vạch xuất phát, vạch đích và trạng thái cuộc đua.

    3. Thiết kế luật chơi.
    Cần xác định cách rùa di chuyển, điều kiện thắng và cách hiển thị kết quả.

    4. Chia nhỏ chức năng trước khi code.
    Tách các phần như tạo rùa, đặt vị trí, cho rùa chạy và kiểm tra người thắng.

    5. Chuẩn bị dùng random.
    Yếu tố ngẫu nhiên làm cuộc đua thay đổi mỗi lần chạy, giúp game sinh động hơn.',
    '["Game rùa", "Turtle", "Random", "Luật chơi", "Vạch đích", "Điều kiện thắng", "Đối tượng game"]',
    'AI Assistant'
),
(
    47,
    'Bài 47: Lập trình game cuộc đua rùa bằng Turtle

    1. Tạo các rùa tham gia đua.
    Khởi tạo nhiều đối tượng turtle và gán màu hoặc vị trí khác nhau.

    2. Thiết lập vị trí xuất phát.
    Đặt các rùa trên cùng một vạch xuất phát để bắt đầu cuộc đua công bằng.

    3. Tạo chuyển động ngẫu nhiên.
    Dùng random để mỗi rùa di chuyển một khoảng khác nhau qua từng lượt.

    4. Kiểm tra rùa về đích.
    Dừng game khi có rùa chạm hoặc vượt vạch đích.

    5. Hiển thị kết quả cuộc đua.
    Xác định rùa thắng cuộc và thông báo kết quả cho người chơi.',
    '["Turtle race", "random", "Object", "Vòng lặp game", "Điều kiện dừng", "Vạch đích", "Kết quả"]',
    'AI Assistant'
),
(
    48,
    'Bài 48: Giới thiệu game Pong bằng Turtle

    1. Giới thiệu game Pong.
    Pong là game phản xạ đơn giản gồm bóng, hai thanh đỡ và điểm số.

    2. Phân tích thành phần game.
    Các thành phần chính gồm màn hình, bóng, paddle trái, paddle phải và bảng điểm.

    3. Xác định luật va chạm.
    Bóng cần phản xạ khi chạm tường hoặc chạm paddle, và ghi điểm khi vượt qua người chơi.

    4. Thiết kế điều khiển người chơi.
    Người chơi dùng bàn phím để di chuyển paddle lên xuống.

    5. Chuẩn bị cấu trúc chương trình.
    Game Pong cần vòng lặp cập nhật liên tục để bóng chuyển động và màn hình thay đổi.',
    '["Pong", "Turtle", "Ball", "Paddle", "Va chạm", "Điểm số", "Bàn phím", "Game loop"]',
    'AI Assistant'
),
(
    49,
    'Bài 49: Lập trình game Pong bằng Python - phần 1

    1. Tạo màn hình game.
    Thiết lập cửa sổ Turtle, kích thước màn hình và màu nền phù hợp cho Pong.

    2. Tạo bóng và paddle.
    Khởi tạo các đối tượng chính của game và đặt vị trí ban đầu.

    3. Điều khiển bằng bàn phím.
    Gán phím để di chuyển paddle lên xuống theo thao tác người chơi.

    4. Xây dựng vòng lặp game.
    Cập nhật vị trí bóng liên tục để tạo cảm giác chuyển động.

    5. Tách các phần xử lý.
    Nên chia code thành phần tạo đối tượng, điều khiển và cập nhật màn hình để dễ sửa.',
    '["Pong", "Turtle", "Ball", "Paddle", "Keyboard", "Game loop", "screen.update()"]',
    'AI Assistant'
),
(
    50,
    'Bài 50: Hoàn thiện game Pong - phần 2

    1. Xử lý va chạm với tường.
    Đổi hướng bóng khi bóng chạm biên trên hoặc biên dưới của màn hình.

    2. Xử lý va chạm với paddle.
    Kiểm tra tọa độ bóng và paddle để bóng bật lại khi chạm thanh đỡ.

    3. Tính điểm cho người chơi.
    Cập nhật điểm khi bóng vượt qua một bên màn hình.

    4. Reset bóng sau khi ghi điểm.
    Đưa bóng về vị trí ban đầu và đổi hướng phù hợp sau mỗi lần ghi điểm.

    5. Hoàn thiện trải nghiệm chơi.
    Điều chỉnh tốc độ, điều kiện va chạm và hiển thị điểm để game mượt hơn.',
    '["Pong", "Va chạm", "Paddle", "Score", "Reset ball", "Tọa độ", "Điều kiện"]',
    'AI Assistant'
),
(
    51,
    'Bài 51: Giới thiệu game rắn săn mồi bằng Turtle

    1. Giới thiệu game Snake.
    Snake là game điều khiển rắn ăn thức ăn, tăng độ dài và tránh va chạm.

    2. Phân tích thành phần game.
    Các thành phần gồm đầu rắn, thân rắn, thức ăn, điểm số và màn hình.

    3. Xác định luật chơi.
    Rắn thua khi chạm tường hoặc chạm chính thân mình.

    4. Tư duy cập nhật vị trí theo chuỗi.
    Thân rắn cần di chuyển theo vị trí của segment phía trước.

    5. Chuẩn bị cấu trúc dữ liệu.
    List rất phù hợp để lưu các đoạn thân rắn và cập nhật theo thứ tự.',
    '["Snake", "Turtle", "Thức ăn", "Segment", "List", "Va chạm", "Điểm số", "Luật chơi"]',
    'AI Assistant'
),
(
    52,
    'Bài 52: Lập trình game rắn săn mồi - phần 1

    1. Tạo màn hình và con rắn.
    Thiết lập cửa sổ game và tạo phần đầu hoặc các đoạn ban đầu của rắn.

    2. Điều khiển hướng di chuyển.
    Dùng bàn phím để đổi hướng rắn lên, xuống, trái hoặc phải.

    3. Xây dựng vòng lặp cập nhật.
    Cập nhật vị trí rắn liên tục để tạo chuyển động mượt.

    4. Quản lý biến trạng thái hướng.
    Lưu hướng đi hiện tại để điều khiển chuyển động đúng logic.

    5. Tránh quay ngược trực tiếp.
    Không cho rắn đổi hướng ngược 180 độ ngay lập tức vì dễ tự va vào thân.',
    '["Snake", "Turtle", "Keyboard", "Direction", "Game loop", "Segment", "Trạng thái hướng"]',
    'AI Assistant'
),
(
    53,
    'Bài 53: Lập trình game rắn săn mồi - phần 2

    1. Thêm thức ăn vào game.
    Tạo đối tượng thức ăn và đặt ở vị trí ngẫu nhiên để rắn tìm đến.

    2. Tăng độ dài rắn.
    Khi rắn ăn thức ăn, thêm segment mới vào thân rắn.

    3. Cập nhật điểm số.
    Tăng điểm sau mỗi lần ăn và hiển thị điểm cho người chơi.

    4. Xử lý va chạm tường.
    Kết thúc hoặc reset game khi rắn vượt ra ngoài vùng chơi.

    5. Xử lý va chạm thân.
    Kiểm tra đầu rắn có chạm vào các segment thân hay không để xác định thua cuộc.',
    '["Snake", "Food", "Segment", "Score", "Collision", "Random position", "Game over"]',
    'AI Assistant'
),
(
    54,
    'Bài 54: Giới thiệu, cài đặt và xây dựng giao diện mặc định bằng Pygame

    1. Giới thiệu Pygame.
    Pygame là thư viện mạnh hơn Turtle, phù hợp để xây dựng game 2D với cửa sổ, hình ảnh và sự kiện.

    2. Cài đặt Pygame.
    Cài thư viện cần thiết và kiểm tra việc import Pygame trong chương trình.

    3. Tạo cửa sổ game.
    Khởi tạo màn hình, kích thước cửa sổ và tiêu đề ứng dụng.

    4. Xây dựng vòng lặp chính.
    Tạo vòng lặp để game luôn chạy, lắng nghe sự kiện và cập nhật hiển thị.

    5. Xử lý sự kiện thoát.
    Bắt sự kiện đóng cửa sổ để chương trình kết thúc đúng cách.',
    '["Pygame", "pygame.init()", "display.set_mode()", "Game loop", "Event", "QUIT", "pygame.quit()"]',
    'AI Assistant'
),
(
    55,
    'Bài 55: Vẽ các hình cơ bản lên giao diện Pygame

    1. Giới thiệu vẽ hình trong Pygame.
    Tìm hiểu cách vẽ các thành phần đồ họa trực tiếp lên cửa sổ game.

    2. Vẽ hình chữ nhật và hình tròn.
    Dùng các hàm vẽ để tạo rectangle, circle hoặc các đối tượng cơ bản.

    3. Vẽ đường thẳng và thành phần phụ.
    Sử dụng line hoặc các hình khác để tạo giao diện đơn giản.

    4. Làm quen hệ tọa độ Pygame.
    Tọa độ thường bắt đầu từ góc trên bên trái, khác với cách hình dung tọa độ toán học thông thường.

    5. Cập nhật màn hình sau khi vẽ.
    Sau khi vẽ cần update hoặc flip màn hình để thay đổi được hiển thị.',
    '["Pygame", "draw.rect", "draw.circle", "draw.line", "Tọa độ", "Màu sắc", "display.update()"]',
    'AI Assistant'
),
(
    56,
    'Bài 56: Làm đồng hồ thể thao bấm giờ/đếm ngược bằng Pygame

    1. Giới thiệu ứng dụng đồng hồ.
    Bài học xây dựng chương trình bấm giờ hoặc đếm ngược bằng Pygame.

    2. Quản lý thời gian.
    Sử dụng clock, thời điểm bắt đầu hoặc biến đếm để cập nhật thời gian theo thời gian thực.

    3. Hiển thị chữ trên màn hình.
    Tạo font và render text để hiện số giây, phút hoặc thông báo.

    4. Xử lý sự kiện điều khiển.
    Có thể dùng phím hoặc thao tác để bắt đầu, dừng, reset hoặc thoát chương trình.

    5. Cập nhật giao diện liên tục.
    Màn hình cần được vẽ lại sau mỗi vòng lặp để thời gian thay đổi chính xác.',
    '["Pygame", "Đồng hồ bấm giờ", "Đếm ngược", "Clock", "Font", "render text", "Event"]',
    'AI Assistant'
),
(
    57,
    'Bài 57: Lập trình game “Phiên đấu giá thầm lặng” bằng Python

    1. Giới thiệu game đấu giá thầm lặng.
    Nhiều người chơi lần lượt nhập tên và giá thầu, chương trình tìm người trả giá cao nhất.

    2. Lưu dữ liệu người chơi.
    Dùng dictionary để lưu tên người chơi và mức giá tương ứng.

    3. Lặp qua nhiều lượt nhập.
    Dùng vòng lặp để tiếp tục nhận giá thầu cho đến khi không còn người tham gia.

    4. Tìm giá trị cao nhất.
    Duyệt dictionary để xác định người thắng cuộc và mức giá cao nhất.

    5. Mô phỏng tính thầm lặng.
    Có thể xóa hoặc che dữ liệu giữa các lượt để người sau không thấy giá người trước.',
    '["Silent Auction", "Dictionary", "Tên người chơi", "Giá thầu", "Vòng lặp", "Max value", "Người thắng"]',
    'AI Assistant'
),
(
    58,
    'Bài 58: Lập trình game “Cao hơn và Thấp hơn” bằng Python

    1. Giới thiệu game so sánh.
    Người chơi chọn đối tượng nào có giá trị cao hơn hoặc thấp hơn dựa trên dữ liệu cho sẵn.

    2. Chuẩn bị dữ liệu game.
    Dữ liệu thường được lưu bằng list hoặc dictionary, mỗi phần tử có tên và thuộc tính dùng để so sánh.

    3. Chọn dữ liệu ngẫu nhiên.
    Dùng random để lấy hai đối tượng khác nhau cho mỗi lượt chơi.

    4. So sánh và kiểm tra đáp án.
    Chương trình so sánh thuộc tính mục tiêu để xác định người chơi trả lời đúng hay sai.

    5. Cập nhật điểm và vòng chơi.
    Nếu trả lời đúng thì tăng điểm và tiếp tục! nếu sai thì kết thúc hoặc hiển thị kết quả cuối.',
    '["Higher Lower", "Random", "List", "Dictionary", "So sánh", "Score", "Vòng lặp game"]',
    'AI Assistant'
),
(
    59,
    'Bài 59: Làm game Flappy Bird bằng Pygame - phần 1

    1. Giới thiệu dự án Flappy Bird.
    Bắt đầu xây dựng game Flappy Bird bằng Pygame với nhân vật chim, trọng lực và vật cản.

    2. Tạo cửa sổ và nhân vật.
    Thiết lập màn hình game, tạo đối tượng chim và vị trí ban đầu.

    3. Mô phỏng trọng lực và thao tác nhảy.
    Áp dụng vận tốc rơi xuống và cho chim bay lên khi người chơi nhấn phím.

    4. Tạo vật cản ban đầu.
    Xây dựng ống hoặc chướng ngại vật di chuyển để người chơi phải né.

    5. Chuẩn bị xử lý va chạm.
    Dự án yêu cầu kiểm tra va chạm giữa chim, ống và giới hạn màn hình nên cần chia nhỏ từng phần để hoàn thiện.',
    '["Flappy Bird", "Pygame", "Gravity", "Jump", "Pipe", "Collision", "Game loop", "Nhân vật chim"]',
    'AI Assistant'
);


INSERT INTO lesson_summaries
(
    lesson_id,
    summary_text,
    key_points,
    generated_by
)
VALUES
(
    60,
    'Bài 1: Generic View trong Django

1. Giới thiệu Generic View.
Tìm hiểu cách sử dụng Class-based View để thay thế Function-based View nhằm giảm số lượng mã nguồn phải viết và tăng khả năng tái sử dụng.

2. Thực hành với ListView.
Khai báo lớp kế thừa từ ListView để tự động lấy danh sách bài viết từ model Post và hiển thị ra giao diện.

3. Tùy chỉnh thuộc tính của ListView.
Cấu hình model, template_name, context_object_name và queryset để kiểm soát dữ liệu hiển thị.

4. Phân trang dữ liệu.
Sử dụng thuộc tính paginate_by để giới hạn số lượng bài viết trên mỗi trang.

5. Thực hành với DetailView.
Hiển thị nội dung chi tiết của một bài viết dựa trên khóa chính (pk).

6. Tối ưu mã nguồn.
Áp dụng kỹ thuật refactor bằng cách truyền tham số trực tiếp vào as_view() trong urls.py để giảm code trong views.py.',
    '["Generic View","Class-based View","ListView","DetailView","Pagination","paginate_by","queryset","as_view"]',
    'AI Assistant'
),

(
    61,
    'Bài 2: Khởi tạo Project Django

1. Tạo project mới.
Sử dụng lệnh django-admin startproject để khởi tạo một dự án Django và lựa chọn tên project phù hợp.

2. Thiết lập môi trường phát triển.
Mở project bằng Visual Studio Code và cài đặt các extension hỗ trợ Django.

3. Tìm hiểu cấu trúc thư mục.
Làm quen với các file quan trọng như manage.py, settings.py, urls.py và wsgi.py.

4. Vai trò của manage.py.
Sử dụng file này để thực hiện các tác vụ quản trị như chạy server, migrate database và tạo tài khoản quản trị.

5. Chạy server phát triển.
Khởi động website bằng lệnh python manage.py runserver và truy cập địa chỉ localhost.

6. Thay đổi cổng chạy.
Cấu hình port khác khi cổng mặc định 8000 đang được sử dụng.',
    '["startproject","manage.py","settings.py","urls.py","wsgi.py","VS Code","runserver","localhost"]',
    'AI Assistant'
),

(
    62,
    'Bài 3: Tạo App đầu tiên trong Django

1. Tạo ứng dụng mới.
Sử dụng lệnh startapp để tạo app home bên trong project Django.

2. Đăng ký App.
Thêm app vào danh sách INSTALLED_APPS trong file settings.py để Django nhận diện.

3. Thực hiện migrate.
Chạy migrate để cập nhật cơ sở dữ liệu với các cấu hình mặc định.

4. Tạo View đầu tiên.
Xây dựng hàm index sử dụng HttpResponse để trả về nội dung HTML đơn giản.

5. Cấu hình URL.
Tạo file urls.py cho app và liên kết với urls.py của project bằng include().

6. Kiểm tra hoạt động.
Truy cập đường dẫn /home để xác nhận View hoạt động chính xác.

7. Viết Test cơ bản.
Tạo SimpleTestCase để kiểm tra mã phản hồi HTTP của ứng dụng.',
    '["startapp","INSTALLED_APPS","HttpResponse","views.py","urls.py","include","migrate","SimpleTestCase"]',
    'AI Assistant'
),

(
    63,
    'Bài 4: Template và Template Inheritance

1. Tìm hiểu Template.
Sử dụng Template để tách phần giao diện HTML khỏi logic xử lý dữ liệu.

2. Tạo Base Template.
Xây dựng file base.html chứa cấu trúc giao diện dùng chung cho toàn bộ website.

3. Định nghĩa các block.
Sử dụng block title và block content để tạo các vùng nội dung có thể ghi đè.

4. Kế thừa giao diện.
Dùng extends để các trang khác tái sử dụng khung giao diện từ base.html.

5. Hiển thị Template bằng View.
Thay thế HttpResponse bằng hàm render để trả về giao diện HTML hoàn chỉnh.

6. Tăng khả năng bảo trì.
Giảm việc lặp lại mã HTML và giúp quản lý giao diện dễ dàng hơn.',
    '["Template","base.html","extends","block","render","Template Inheritance","HTML"]',
    'AI Assistant'
),

(
    64,
    'Bài 5: Static Files và Bootstrap

1. Tìm hiểu Static Files.
Quản lý các tài nguyên tĩnh như CSS, JavaScript và hình ảnh trong Django.

2. Giới thiệu Bootstrap.
Sử dụng framework Bootstrap để xây dựng giao diện responsive nhanh chóng.

3. Tạo thư mục static.
Lưu trữ các file CSS, JS và hình ảnh phục vụ giao diện website.

4. Load static trong Template.
Sử dụng thẻ load static và hàm static để nhúng tài nguyên vào HTML.

5. Thiết kế bố cục bằng Grid System.
Áp dụng container-fluid, row và col để chia bố cục trang web thành nhiều cột.

6. Hiển thị hình ảnh.
Sử dụng thẻ img kết hợp đường dẫn static để hiển thị logo hoặc ảnh minh họa.

7. Kiểm tra giao diện.
Khởi động lại server và xác nhận Bootstrap cùng các file tĩnh đã hoạt động đúng.',
    '["Static Files","Bootstrap","CSS","JavaScript","load static","Grid System","container-fluid","img"]',
    'AI Assistant'
),

(
    65,
    'Bài 6: Hoàn thiện giao diện Blog

1. Xây dựng khu vực Avatar và Menu.
Tạo cột bên trái để hiển thị ảnh đại diện và các liên kết điều hướng như Trang chủ, Bài viết và Liên hệ.

2. Tạo vùng nội dung chính.
Sử dụng block content để các trang khác nhau có thể chèn nội dung riêng vào giao diện chung.

3. Thiết kế Footer.
Xây dựng khu vực chân trang chứa các liên kết mạng xã hội và thông tin bổ sung.

4. Tùy chỉnh giao diện bằng CSS.
Thiết lập màu nền, khoảng cách và chiều cao tối thiểu giúp giao diện cân đối hơn.

5. Tạo trang Liên hệ.
Xây dựng contact.html, tạo view tương ứng và khai báo URL để người dùng truy cập.',
    '["Avatar","Menu","Footer","CSS","Contact Page","Bootstrap","Layout","block content"]',
    'AI Assistant'
),

(
    66,
    'Bài 7: Tạo Model và Database

1. Xây dựng Model Post.
Tạo lớp Post kế thừa từ models.Model để quản lý dữ liệu bài viết.

2. Khai báo các trường dữ liệu.
Bao gồm tiêu đề, nội dung và ngày tạo bài viết.

3. Thực hiện Migration.
Sử dụng makemigrations và migrate để tạo bảng trong cơ sở dữ liệu.

4. Tìm hiểu khóa chính.
Django tự động tạo trường id giúp định danh duy nhất mỗi bản ghi.

5. Kiểm tra dữ liệu.
Sử dụng DB Browser for SQLite để quan sát cấu trúc bảng vừa được tạo.',
    '["Model","Post","CharField","TextField","DateTimeField","Migration","SQLite","Database"]',
    'AI Assistant'
),

(
    67,
    'Bài 8: Thao tác dữ liệu với Django ORM

1. Sử dụng Django Shell.
Khởi động môi trường shell để thao tác trực tiếp với model và database.

2. Thêm dữ liệu.
Tạo mới các đối tượng Post và lưu xuống cơ sở dữ liệu bằng save().

3. Truy vấn dữ liệu.
Sử dụng objects.all() để lấy toàn bộ bản ghi và objects.get() để lấy dữ liệu cụ thể.

4. Hiển thị dữ liệu dễ đọc hơn.
Ghi đè phương thức __str__ để hiển thị tiêu đề bài viết thay vì Post object.

5. Cấu hình múi giờ.
Thiết lập TIME_ZONE nhằm hiển thị đúng thời gian theo giờ Việt Nam.',
    '["Django Shell","ORM","save","objects.all","objects.get","__str__","TIME_ZONE","CRUD"]',
    'AI Assistant'
),

(
    68,
    'Bài 9: Trang quản trị Django Admin

1. Tạo tài khoản quản trị.
Sử dụng createsuperuser để tạo tài khoản Superuser.

2. Đăng nhập Admin.
Truy cập đường dẫn /admin và đăng nhập bằng tài khoản vừa tạo.

3. Đăng ký Model.
Khai báo model Post trong admin.py để quản lý dữ liệu qua giao diện.

4. Tùy biến danh sách hiển thị.
Sử dụng list_display để bổ sung các cột cần thiết.

5. Tạo bộ lọc và tìm kiếm.
Áp dụng list_filter và search_fields giúp quản lý dữ liệu thuận tiện hơn.',
    '["Admin","Superuser","admin.py","list_display","list_filter","search_fields","PostAdmin"]',
    'AI Assistant'
),

(
    69,
    'Bài 10: Hiển thị danh sách bài viết

1. Lấy dữ liệu từ Database.
Sử dụng Post.objects.all() để truy xuất toàn bộ bài viết.

2. Sắp xếp dữ liệu.
Áp dụng order_by("-date") để hiển thị bài viết mới nhất trước.

3. Truyền dữ liệu ra Template.
Đưa danh sách bài viết vào context và render ra giao diện.

4. Hiển thị bằng vòng lặp.
Sử dụng cú pháp for của Django Template để duyệt danh sách bài viết.

5. Tạo liên kết bài viết.
Gắn đường dẫn cho từng tiêu đề để chuẩn bị cho trang chi tiết.',
    '["Post.objects.all","order_by","Template","Context","for loop","Blog List","Render"]',
    'AI Assistant'
),

(
    70,
    'Bài 11: Trang chi tiết bài viết

1. Tạo URL động.
Sử dụng tham số id trong URL để xác định bài viết cần hiển thị.

2. Truy xuất dữ liệu.
Lấy một bài viết cụ thể bằng Post.objects.get(id=id).

3. Thiết kế giao diện chi tiết.
Hiển thị tiêu đề, ngày đăng và nội dung bài viết.

4. Xử lý xuống dòng.
Áp dụng bộ lọc linebreaks để giữ nguyên định dạng nội dung.

5. Kiểm thử chức năng.
Viết TestCase để xác nhận URL và dữ liệu hoạt động chính xác.',
    '["Detail Page","URL Parameter","objects.get","linebreaks","Template","TestCase"]',
    'AI Assistant'
),

(
    71,
    'Bài 12: Sử dụng Named URL

1. Tìm hiểu hạn chế của Hardcode URL.
Việc ghi trực tiếp đường dẫn gây khó khăn khi thay đổi cấu trúc website.

2. Đặt tên cho URL.
Sử dụng thuộc tính name trong urls.py để tạo định danh cho từng đường dẫn.

3. Gọi URL trong Template.
Sử dụng thẻ url để sinh đường dẫn tự động.

4. Truyền tham số động.
Kết hợp url với id bài viết để tạo liên kết chi tiết.

5. Tăng khả năng bảo trì.
Chỉ cần thay đổi tại urls.py thay vì sửa nhiều file HTML.',
    '["Named URL","url tag","urls.py","Template","Dynamic URL","Maintainability"]',
    'AI Assistant'
),

(
    72,
    'Bài 13: Tùy chỉnh trang lỗi

1. Tìm hiểu lỗi HTTP.
Làm quen với lỗi 404 và 500 thường gặp trên website.

2. Tạo giao diện lỗi riêng.
Thiết kế file error.html để thay thế trang lỗi mặc định.

3. Khai báo Handler.
Cấu hình handler404 và handler500 trong urls.py.

4. Thiết lập môi trường Production.
Tắt DEBUG và cấu hình ALLOWED_HOSTS.

5. Nâng cao trải nghiệm người dùng.
Hiển thị thông báo thân thiện thay vì lỗi mặc định của Django.',
    '["404","500","handler404","handler500","DEBUG","ALLOWED_HOSTS","error.html"]',
    'AI Assistant'
),

(
    73,
    'Bài 14: Kiến trúc MVC và MVT

1. Tìm hiểu mô hình MVC.
Bao gồm Model, View và Controller trong quá trình xây dựng ứng dụng.

2. Luồng xử lý dữ liệu.
Theo dõi quá trình Request, xử lý dữ liệu và trả về Response.

3. MVC trong Django.
Django sử dụng kiến trúc MVT thay vì MVC truyền thống.

4. Vai trò của từng thành phần.
Model quản lý dữ liệu, Template hiển thị giao diện và View xử lý logic.

5. Hiểu cấu trúc framework.
Nắm được cách Django tổ chức ứng dụng để phát triển hiệu quả hơn.',
    '["MVC","MVT","Model","Template","View","Request","Response","Architecture"]',
    'AI Assistant'
),

(
    74,
    'Bài 15: Upload file hình ảnh

1. Cập nhật Model Post.
Thêm trường ImageField để lưu trữ hình ảnh cho bài viết.

2. Cấu hình Media.
Thiết lập MEDIA_URL và MEDIA_ROOT trong settings.py.

3. Hiển thị hình ảnh.
Sử dụng post.image.url để hiển thị ảnh trên giao diện.

4. Cấu hình URL Media.
Cho phép Django phục vụ file media trong quá trình phát triển.

5. Hoàn thiện bài viết.
Kết hợp hình ảnh với nội dung giúp website trực quan hơn.',
    '["ImageField","MEDIA_URL","MEDIA_ROOT","Media","Image Upload","post.image.url"]',
    'AI Assistant'
),

(
    75,
    'Bài 16: Đăng ký tài khoản người dùng

1. Tạo RegistrationForm.
Xây dựng form chứa username, email và mật khẩu.

2. Kiểm tra dữ liệu.
Xác thực tên đăng nhập và kiểm tra mật khẩu nhập lại.

3. Lưu người dùng.
Tạo tài khoản mới bằng User.objects.create_user().

4. Xử lý View.
Tiếp nhận dữ liệu POST và kiểm tra tính hợp lệ của form.

5. Xây dựng giao diện.
Hiển thị form đăng ký và bảo vệ bằng CSRF Token.',
    '["RegistrationForm","User","create_user","Validation","CSRF","Register"]',
    'AI Assistant'
),

(
    76,
    'Bài 17: Đăng nhập và đăng xuất

1. Sử dụng hệ thống Auth.
Khai thác các chức năng xác thực được Django cung cấp sẵn.

2. Cấu hình Login.
Khai báo URL đăng nhập và chỉ định template hiển thị.

3. Cấu hình Logout.
Cho phép người dùng đăng xuất và chuyển hướng về trang chủ.

4. Cập nhật giao diện.
Hiển thị menu khác nhau tùy trạng thái đăng nhập.

5. Hoàn thiện hệ thống tài khoản.
Người dùng có thể đăng ký, đăng nhập và đăng xuất dễ dàng.',
    '["Authentication","Login","Logout","auth_views","Template","User Session"]',
    'AI Assistant'
),

(
    77,
    'Bài 18: Generic View nâng cao

1. Ôn lại Generic View.
Tiếp tục sử dụng các Class-based View có sẵn của Django.

2. Cấu hình ListView.
Tùy chỉnh model, template và dữ liệu hiển thị.

3. Cấu hình DetailView.
Hiển thị nội dung chi tiết dựa trên khóa chính.

4. Áp dụng phân trang.
Giới hạn số lượng dữ liệu hiển thị trên mỗi trang.

5. Tối ưu mã nguồn.
Giảm thiểu code lặp lại bằng cách tận dụng Generic View.',
    '["Generic View","ListView","DetailView","Pagination","Class-based View","Refactor"]',
    'AI Assistant'
),

(
    78,
    'Bài 19: Chức năng bình luận

1. Tạo Model Comment.
Xây dựng bảng lưu trữ bình luận và liên kết với bài viết bằng ForeignKey.

2. Tạo CommentForm.
Sử dụng ModelForm để xử lý dữ liệu bình luận từ người dùng.

3. Cập nhật View.
Tiếp nhận dữ liệu POST và lưu bình luận khi form hợp lệ.

4. Hiển thị bình luận.
Duyệt danh sách bình luận và hiển thị dưới mỗi bài viết.

5. Kiểm tra đăng nhập.
Chỉ cho phép người dùng đã đăng nhập gửi bình luận mới.',
    '["Comment","ForeignKey","ModelForm","CommentForm","POST","Authentication","comments"]',
    'AI Assistant'
);
----------------------------------------------------------
-- NHÓM 4: AI ASSISTANT VÀ LỊCH SỬ CHAT
-- --------------------------------------------------------

-- Chèn phiên làm việc hội thoại ai_chat_sessions
INSERT INTO `ai_chat_sessions` (`id`, `user_id`, `course_id`, `lesson_id`, `title`) VALUES
(1, 2, 1, 1, 'Hỏi về lỗi không nhận diện lệnh python'),
(2, 3, 1, 2, 'Tìm hiểu sâu về cơ chế nháy đơn và nháy kép');

-- Chèn tin nhắn hội thoại ai_chat_messages
INSERT INTO `ai_chat_messages` (`id`, `session_id`, `sender`, `message_text`, `model_name`) VALUES
(1, 1, 'user', 'Mình gõ lệnh python trong cmd báo lỗi "not recognized" thì xử lý sao ạ?', NULL),
(2, 1, 'assistant', 'Lỗi này xuất hiện do bạn chưa thêm đường dẫn cài đặt Python vào biến môi trường Environment Variables (PATH). Hãy tích chọn ô "Add Python to PATH" lúc chạy lại file cài đặt nhé.', 'Qwen2.5-Coder-7B'),
(3, 2, 'user', 'Trong Python dùng dấu nháy đơn hay nháy kép để bọc chuỗi thì tốt hơn?', NULL),
(4, 2, 'assistant', 'Trong Python, cặp nháy đơn và nháy kép có giá trị sử dụng tương đương nhau. Tuy nhiên, nếu chuỗi của bạn chứa dấu nháy đơn, hãy bọc ngoài bằng dấu nháy kép để tránh lỗi cú pháp.', 'Qwen2.5-Coder-7B');


-- --------------------------------------------------------
-- NHÓM 5: QUIZ VÀ KẾT QUẢ KIỂM TRA
-- --------------------------------------------------------

-- Chèn đề mục bài tập trắc nghiệm quizzes
INSERT INTO `quizzes` (`id`, `lesson_id`, `title`, `description`, `time_limit_seconds`, `status`) VALUES
(1, 2, 'Bài trắc nghiệm khởi động nhanh', 'Kiểm tra kiến thức cơ bản về cách khai báo chuỗi văn bản và gọi hàm xuất dữ liệu.', 300, 'published');

-- Chèn danh sách câu hỏi quiz_questions
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `code_snippet`, `difficulty`, `explanation`, `sort_order`) VALUES
(1, 1, 'Hàm nào sau đây được dùng để in giá trị hoặc dữ liệu ra màn hình console trong Python?', NULL, 'easy', 'Hàm print() là hàm tích hợp sẵn (built-in) của ngôn ngữ Python để thực hiện xuất thông tin.', 1),
(2, 1, 'Đoạn mã lệnh sau đây có kết quả trả về là gì?', 'print("Python " + "AI")', 'easy', 'Phép toán toán tử dấu cộng (+) khi áp dụng trên hai đối tượng chuỗi văn bản sẽ thực thi hành động nối chuỗi nối tiếp nhau.', 2);

-- Chèn hệ thống đáp án lựa chọn quiz_options
INSERT INTO `quiz_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(1, 1, 'A', 'echo()', 0),
(2, 1, 'B', 'print()', 1),
(3, 1, 'C', 'console.log()', 0),
(4, 1, 'D', 'System.out.println()', 0),
(5, 2, 'A', 'Python AI', 1),
(6, 2, 'B', 'Python+AI', 0),
(7, 2, 'C', 'Lỗi cú pháp hệ thống', 0);

-- Chèn lượt làm bài kiểm tra quiz_attempts
INSERT INTO `quiz_attempts` (`id`, `quiz_id`, `user_id`, `total_questions`, `correct_answers`, `score`, `started_at`, `submitted_at`) VALUES
(1, 1, 2, 2, 2, 10.00, '2026-06-25 09:00:00', '2026-06-25 09:02:15'),
(2, 1, 3, 2, 1, 5.00, '2026-06-25 09:15:00', '2026-06-25 09:18:40');

-- Chèn chi tiết các phương án do người dùng click chọn quiz_attempt_answers
INSERT INTO `quiz_attempt_answers` (`id`, `attempt_id`, `question_id`, `selected_option_id`, `is_correct`) VALUES
(1, 1, 1, 2, 1), -- Thịnh chọn câu 1 đáp án B (Đúng)
(2, 1, 2, 5, 1), -- Thịnh chọn câu 2 đáp án A (Đúng)
(3, 2, 1, 2, 1), -- Huy chọn câu 1 đáp án B (Đúng)
(4, 2, 2, 6, 0); -- Huy chọn câu 2 đáp án B (Sai)


-- --------------------------------------------------------
-- NHÓM 6: ĐĂNG KÝ KHÓA HỌC VÀ TIẾN ĐỘ HỌC TẬP
-- --------------------------------------------------------

-- Chèn ghi nhận lượt tham gia học tập enrollments
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `status`, `current_lesson_id`, `progress_percent`, `completed_lessons_count`, `last_accessed_at`, `enrolled_at`, `completed_at`) VALUES
(1, 2, 1, 'active', 2, 17, 1, '2026-06-22 10:20:00', '2026-06-20 08:30:00', NULL),
(2, 3, 1, 'active', 1, 0, 0, '2026-06-21 14:20:00', '2026-06-21 14:00:00', NULL),
(3, 4, 1, 'completed', 6, 100, 6, '2026-06-24 17:30:00', '2026-06-15 09:00:00', '2026-06-24 17:30:00');

-- Chèn tiến trình phân tích thời lượng xem video bài học lesson_progress
INSERT INTO `lesson_progress` (`id`, `user_id`, `course_id`, `lesson_id`, `last_position_seconds`, `watched_seconds`, `duration_seconds`, `progress_percent`, `is_completed`, `completed_at`, `last_watched_at`) VALUES
(1, 2, 1, 1, 600, 600, 600, 100, 1, '2026-06-22 10:15:00', '2026-06-22 10:15:00'),
(2, 2, 1, 2, 120, 120, 700, 17, 0, NULL, '2026-06-22 10:20:00'),
(3, 3, 1, 1, 450, 450, 600, 75, 0, NULL, '2026-06-21 14:20:00');


-- --------------------------------------------------------
-- NHÓM 7: HOẠT ĐỘNG, LIÊN HỆ, THÔNG BÁO VÀ AUDIT
-- --------------------------------------------------------

-- Chèn dòng thời gian hoạt động tương tác hệ thống learning_activities
INSERT INTO `learning_activities` (`id`, `user_id`, `activity_type`, `title`, `description`, `related_course_id`, `related_lesson_id`, `related_quiz_id`, `action_url`) VALUES
(1, 2, 'video', 'Hoàn thành xem video', 'Đã xem trọn vẹn thời lượng bài hướng dẫn cài đặt môi trường.', 1, 1, NULL, '/learning/1/1'),
(2, 2, 'quiz', 'Nộp bài trắc nghiệm', 'Đạt điểm số tuyệt đối 10.00 tại Bài trắc nghiệm khởi động nhanh.', 1, 2, 1, '/quiz/2/result'),
(3, 2, 'ai', 'Đặt câu hỏi cho Trợ lý ảo AI', 'Yêu cầu hỗ trợ gỡ rối lỗi cấu hình PATH biến hệ thống.', 1, 1, NULL, '/ai-assistant');

-- Chèn thông tin hòm thư góp ý contact_messages
INSERT INTO `contact_messages` (`id`, `full_name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 'Trần Minh Hoàng', 'hoangtm@gmail.com', '0914999888', 'Hỏi về lộ trình Python AI', 'Chào ban quản trị, cho mình hỏi khóa học RAG FastAPI có yêu cầu kiến thức nền tảng gì quá sâu không ạ?', 'new');

-- Chèn trung tâm thông báo đẩy nhanh notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`) VALUES
(1, 2, 'Hệ thống AI xử lý hoàn tất!', 'Video bài học số 3 của bạn đã được bóc tách dữ liệu transcript và tóm tắt thành công.', 'ai_pipeline', 0),
(2, 3, 'Khuyến mãi khóa học mới', 'Giảm giá ngay 20% khi đăng ký khóa chuyên sâu RAG trong tuần này.', 'promotion', 1);

-- Chèn nhật ký hành động phân quyền nội bộ admin_audit_logs
INSERT INTO `admin_audit_logs` (`id`, `admin_id`, `action`, `target_table`, `target_id`, `description`) VALUES
(1, 1, 'create', 'courses', 2, 'Khởi tạo cấu trúc khóa nâng cao RAG FastAPI trên môi trường production.'),
(2, 1, 'process_ai', 'lesson_videos', 4, 'Kích hoạt pipeline AI trích xuất nội dung từ video bài học số 4.');

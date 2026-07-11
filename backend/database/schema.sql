-- ========================================================
-- KHỞI TẠO DATABASE CHO DỰ ÁN PYTHON AI LEARNING
-- ========================================================
CREATE DATABASE IF NOT EXISTS python_ai_learning_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE python_ai_learning_db;

-- --------------------------------------------------------
-- NHÓM 1: NGƯỜI DÙNG VÀ TÀI KHOẢN
-- --------------------------------------------------------

-- Bảng 1: users (Lưu tài khoản học viên và admin)
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `full_name` VARCHAR(100) NULL,
    `avatar_url` TEXT NULL,
    `role` ENUM('student', 'admin') DEFAULT 'student',
    `status` ENUM('active', 'blocked', 'inactive') DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB;

-- Bảng 2: password_reset_tokens (Token quên mật khẩu)
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `used_at` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pwd_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 3: user_settings (Cấu hình tùy chọn tài khoản)
CREATE TABLE IF NOT EXISTS `user_settings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `two_factor_enabled` BOOLEAN DEFAULT FALSE,
    `save_ai_history` BOOLEAN DEFAULT TRUE,
    `learning_reminder_enabled` BOOLEAN DEFAULT TRUE,
    `theme` ENUM('light', 'dark', 'system') DEFAULT 'system',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_settings_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 2: KHÓA HỌC, CHƯƠNG, BÀI HỌC VÀ VIDEO
-- --------------------------------------------------------

-- Bảng 4: courses (Thông tin khóa học tổng quan)
CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `thumbnail_url` TEXT NULL,
    `level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    `price` DECIMAL(12,2) DEFAULT 0.00,
    `status` ENUM('draft', 'published', 'hidden') DEFAULT 'draft',
    `created_by` BIGINT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_courses_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
    INDEX `idx_courses_slug` (`slug`)
) ENGINE=InnoDB;

-- Bảng 5: course_sections (Thay thế bảng chapters cũ)
CREATE TABLE IF NOT EXISTS `course_sections` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sections_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 6: lessons (Bài học chi tiết)
CREATE TABLE IF NOT EXISTS `lessons` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `section_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `duration_seconds` INT DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `is_free` BOOLEAN DEFAULT FALSE,
    `status` ENUM('draft', 'published', 'hidden') DEFAULT 'draft',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_lessons_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_lessons_sections` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 7: lesson_videos (Metadata video bài học)
CREATE TABLE IF NOT EXISTS `lesson_videos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `video_url` TEXT NOT NULL,
    `storage_provider` VARCHAR(50) DEFAULT 'Cloudflare',
    `file_name` VARCHAR(255) NULL,
    `file_size` BIGINT NULL,
    `duration_seconds` INT DEFAULT 0,
    `processing_status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_videos_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 3: TRANSCRIPT, TÓM TẮT VÀ DỮ LIỆU AI PIPELINE
-- --------------------------------------------------------

-- Bảng 8: lesson_transcripts (Lưu văn bản bóc tách từ video)
CREATE TABLE IF NOT EXISTS `lesson_transcripts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `transcript_text` LONGTEXT NOT NULL,
    `language` VARCHAR(20) DEFAULT 'vi',
    `generated_by` VARCHAR(100) NULL,
    `status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    `error_message` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_transcripts_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
<<<<<<< HEAD

-- Bảng 9: lesson_summaries (Tóm tắt từ AI)
CREATE TABLE IF NOT EXISTS `lesson_summaries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `summary_text` LONGTEXT NOT NULL,
    `key_points` JSON NULL,
    `generated_by` VARCHAR(100) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_summaries_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 10: transcript_chunks (Các mảnh cắt để mapping ChromaDB RAG)
CREATE TABLE IF NOT EXISTS `transcript_chunks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `transcript_id` BIGINT NOT NULL,
    `chunk_index` INT NOT NULL,
    `chunk_text` TEXT NOT NULL,
    `vector_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chunks_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chunks_transcripts` FOREIGN KEY (`transcript_id`) REFERENCES `lesson_transcripts` (`id`) ON DELETE CASCADE,
    INDEX `idx_chunks_lesson_transcript` (`lesson_id`, `transcript_id`)
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 4: AI ASSISTANT VÀ LỊCH SỬ CHAT
-- --------------------------------------------------------

-- Bảng 11: ai_chat_sessions (Quản lý phiên hội thoại trợ lý ảo)
CREATE TABLE IF NOT EXISTS `ai_chat_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NULL,
    `lesson_id` BIGINT NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'Đoạn hội thoại mới',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ai_sessions_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ai_sessions_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ai_sessions_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL,
    INDEX `idx_ai_sessions_user` (`user_id`, `updated_at`)
) ENGINE=InnoDB;

-- Bảng 12: ai_chat_messages (Chi tiết tin nhắn)
CREATE TABLE IF NOT EXISTS `ai_chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `session_id` BIGINT NOT NULL,
    `sender` ENUM('user', 'assistant') NOT NULL,
    `message_text` LONGTEXT NOT NULL,
    `model_name` VARCHAR(100) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ai_messages_sessions` FOREIGN KEY (`session_id`) REFERENCES `ai_chat_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 13: ai_retrieval_logs (Log truy vết nguồn dữ liệu RAG dùng để trả lời)
CREATE TABLE IF NOT EXISTS `ai_retrieval_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message_id` BIGINT NOT NULL,
    `chunk_id` BIGINT NOT NULL,
    `similarity_score` FLOAT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_logs_messages` FOREIGN KEY (`message_id`) REFERENCES `ai_chat_messages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_logs_chunks` FOREIGN KEY (`chunk_id`) REFERENCES `transcript_chunks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 5: QUIZ VÀ KẾT QUẢ KIỂM TRA
-- --------------------------------------------------------

-- Bảng 14: quizzes (Bài kiểm tra của bài học)
CREATE TABLE IF NOT EXISTS `quizzes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `time_limit_seconds` INT DEFAULT 0,
    `status` ENUM('draft', 'published', 'hidden') DEFAULT 'draft',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quizzes_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 15: quiz_questions (Câu hỏi trắc nghiệm)
CREATE TABLE IF NOT EXISTS `quiz_questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `question_text` TEXT NOT NULL,
    `code_snippet` TEXT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    `explanation` TEXT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_questions_quizzes` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 16: quiz_options (Các phương án lựa chọn A, B, C, D)
CREATE TABLE IF NOT EXISTS `quiz_options` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `question_id` BIGINT NOT NULL,
    `option_label` CHAR(1) NOT NULL, -- A, B, C, D
    `option_text` TEXT NOT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_options_questions` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 17: quiz_attempts (Lịch sử lượt làm bài của học viên)
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `total_questions` INT NOT NULL DEFAULT 0,
    `correct_answers` INT NOT NULL DEFAULT 0,
    `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `started_at` DATETIME NOT NULL,
    `submitted_at` DATETIME NOT NULL,
    CONSTRAINT `fk_attempts_quizzes` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attempts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_attempts_user_quiz` (`user_id`, `quiz_id`, `submitted_at`)
) ENGINE=InnoDB;

-- Bảng 18: quiz_attempt_answers (Chi tiết đáp án học viên chọn)
CREATE TABLE IF NOT EXISTS `quiz_attempt_answers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `selected_option_id` BIGINT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_ans_attempts` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ans_questions` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ans_options` FOREIGN KEY (`selected_option_id`) REFERENCES `quiz_options` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 6: ĐĂNG KÝ KHÓA HỌC VÀ TIẾN ĐỘ HỌC TẬP
-- --------------------------------------------------------

-- Bảng 19: enrollments (Quản lý học viên đăng ký khóa học)
=======

-- Bảng 9: lesson_summaries (Tóm tắt từ AI)
CREATE TABLE IF NOT EXISTS `lesson_summaries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `summary_text` LONGTEXT NOT NULL,
    `key_points` JSON NULL,
    `generated_by` VARCHAR(100) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_summaries_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 10: transcript_chunks (Các mảnh cắt để mapping ChromaDB RAG)
CREATE TABLE IF NOT EXISTS `transcript_chunks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `transcript_id` BIGINT NOT NULL,
    `chunk_index` INT NOT NULL,
    `chunk_text` TEXT NOT NULL,
    `vector_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chunks_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chunks_transcripts` FOREIGN KEY (`transcript_id`) REFERENCES `lesson_transcripts` (`id`) ON DELETE CASCADE,
    INDEX `idx_chunks_lesson_transcript` (`lesson_id`, `transcript_id`)
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 4: AI ASSISTANT VÀ LỊCH SỬ CHAT
-- --------------------------------------------------------

-- Bảng 11: ai_chat_sessions (Quản lý phiên hội thoại trợ lý ảo)
CREATE TABLE IF NOT EXISTS `ai_chat_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NULL,
    `lesson_id` BIGINT NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'Đoạn hội thoại mới',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ai_sessions_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ai_sessions_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ai_sessions_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL,
    INDEX `idx_ai_sessions_user` (`user_id`, `updated_at`)
) ENGINE=InnoDB;

-- Bảng 12: ai_chat_messages (Chi tiết tin nhắn)
CREATE TABLE IF NOT EXISTS `ai_chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `session_id` BIGINT NOT NULL,
    `sender` ENUM('user', 'assistant') NOT NULL,
    `message_text` LONGTEXT NOT NULL,
    `model_name` VARCHAR(100) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ai_messages_sessions` FOREIGN KEY (`session_id`) REFERENCES `ai_chat_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 13: ai_retrieval_logs (Log truy vết nguồn dữ liệu RAG dùng để trả lời)
CREATE TABLE IF NOT EXISTS `ai_retrieval_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message_id` BIGINT NOT NULL,
    `chunk_id` BIGINT NOT NULL,
    `similarity_score` FLOAT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_logs_messages` FOREIGN KEY (`message_id`) REFERENCES `ai_chat_messages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_logs_chunks` FOREIGN KEY (`chunk_id`) REFERENCES `transcript_chunks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 5: QUIZ VÀ KẾT QUẢ KIỂM TRA
-- --------------------------------------------------------

-- Bảng 14: quizzes (Bài kiểm tra của bài học)
CREATE TABLE IF NOT EXISTS `quizzes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `time_limit_seconds` INT DEFAULT 0,
    `status` ENUM('draft', 'published', 'hidden') DEFAULT 'draft',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quizzes_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 15: quiz_questions (Câu hỏi trắc nghiệm)
CREATE TABLE IF NOT EXISTS `quiz_questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `question_text` TEXT NOT NULL,
    `code_snippet` TEXT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    `explanation` TEXT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_questions_quizzes` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 16: quiz_options (Các phương án lựa chọn A, B, C, D)
CREATE TABLE IF NOT EXISTS `quiz_options` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `question_id` BIGINT NOT NULL,
    `option_label` CHAR(1) NOT NULL, -- A, B, C, D
    `option_text` TEXT NOT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_options_questions` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 17: quiz_attempts (Lịch sử lượt làm bài của học viên)
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `total_questions` INT NOT NULL DEFAULT 0,
    `correct_answers` INT NOT NULL DEFAULT 0,
    `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `started_at` DATETIME NOT NULL,
    `submitted_at` DATETIME NOT NULL,
    CONSTRAINT `fk_attempts_quizzes` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attempts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_attempts_user_quiz` (`user_id`, `quiz_id`, `submitted_at`)
) ENGINE=InnoDB;

-- Bảng 18: quiz_attempt_answers (Chi tiết đáp án học viên chọn)
CREATE TABLE IF NOT EXISTS `quiz_attempt_answers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `selected_option_id` BIGINT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_ans_attempts` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ans_questions` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ans_options` FOREIGN KEY (`selected_option_id`) REFERENCES `quiz_options` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- NHÓM 6: ĐĂNG KÝ KHÓA HỌC VÀ TIẾN ĐỘ HỌC TẬP
-- --------------------------------------------------------

-- Bảng 19: enrollments (Quản lý học viên đăng ký khóa học)
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NOT NULL,
    `status` ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    `current_lesson_id` BIGINT NULL,
    `progress_percent` INT DEFAULT 0,
    `completed_lessons_count` INT DEFAULT 0,
    `last_accessed_at` DATETIME NULL,
    `enrolled_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME NULL,
    CONSTRAINT `fk_enrollments_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_enrollments_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_enrollments_current_lesson` FOREIGN KEY (`current_lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL,
    CONSTRAINT `uq_user_course` UNIQUE (`user_id`, `course_id`)
) ENGINE=InnoDB;
<<<<<<< HEAD

-- Bảng 20: lesson_progress (Theo dõi tiến độ xem video bài học)
=======

-- Bảng 20: lesson_progress (Theo dõi tiến độ xem video bài học)
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
CREATE TABLE IF NOT EXISTS `lesson_progress` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NOT NULL,
    `lesson_id` BIGINT NOT NULL,
    `last_position_seconds` INT DEFAULT 0,
    `watched_seconds` INT DEFAULT 0,
    `duration_seconds` INT DEFAULT 0,
    `progress_percent` INT DEFAULT 0,
    `is_completed` BOOLEAN DEFAULT FALSE,
    `completed_at` DATETIME NULL,
    `last_watched_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_progress_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_progress_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_progress_lessons` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
    CONSTRAINT `unique_user_lesson` UNIQUE (`user_id`, `lesson_id`)
) ENGINE=InnoDB;
<<<<<<< HEAD


-- --------------------------------------------------------
-- NHÓM 7: HOẠT ĐỘNG, LIÊN HỆ, THÔNG BÁO VÀ AUDIT
-- --------------------------------------------------------

-- Bảng 21: learning_activities (Dòng thời gian hoạt động của học viên)
CREATE TABLE IF NOT EXISTS `learning_activities` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `activity_type` ENUM('video', 'quiz', 'ai', 'account', 'certificate', 'course') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `related_course_id` BIGINT NULL,
    `related_lesson_id` BIGINT NULL,
    `related_quiz_id` BIGINT NULL,
    `action_url` VARCHAR(255) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_activities_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_activities_courses` FOREIGN KEY (`related_course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_activities_lessons` FOREIGN KEY (`related_lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_activities_quizzes` FOREIGN KEY (`related_quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE SET NULL,
    INDEX `idx_activities_user` (`user_id`, `created_at`)
) ENGINE=InnoDB;

-- Bảng 22: contact_messages (Form nhận thông tin liên hệ từ trang chủ)
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `subject` VARCHAR(100) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'processing', 'resolved') DEFAULT 'new',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bảng 23: notifications (Thông báo hệ thống cho từng User)
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'general',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 24: admin_audit_logs (Nhật ký hành động của Admin)
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` BIGINT NOT NULL,
    `action` VARCHAR(100) NOT NULL, -- create, update, delete, upload, process_ai
    `target_table` VARCHAR(100) NOT NULL,
    `target_id` BIGINT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_users` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
=======


-- --------------------------------------------------------
-- NHÓM 7: HOẠT ĐỘNG, LIÊN HỆ, THÔNG BÁO VÀ AUDIT
-- --------------------------------------------------------

-- Bảng 21: learning_activities (Dòng thời gian hoạt động của học viên)
CREATE TABLE IF NOT EXISTS `learning_activities` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `activity_type` ENUM('video', 'quiz', 'ai', 'account', 'certificate', 'course') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `related_course_id` BIGINT NULL,
    `related_lesson_id` BIGINT NULL,
    `related_quiz_id` BIGINT NULL,
    `action_url` VARCHAR(255) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_activities_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_activities_courses` FOREIGN KEY (`related_course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_activities_lessons` FOREIGN KEY (`related_lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_activities_quizzes` FOREIGN KEY (`related_quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE SET NULL,
    INDEX `idx_activities_user` (`user_id`, `created_at`)
) ENGINE=InnoDB;

-- Bảng 22: contact_messages (Form nhận thông tin liên hệ từ trang chủ)
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `subject` VARCHAR(100) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'processing', 'resolved') DEFAULT 'new',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bảng 23: notifications (Thông báo hệ thống cho từng User)
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'general',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng 24: admin_audit_logs (Nhật ký hành động của Admin)
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` BIGINT NOT NULL,
    `action` VARCHAR(100) NOT NULL, -- create, update, delete, upload, process_ai
    `target_table` VARCHAR(100) NOT NULL,
    `target_id` BIGINT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_users` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
) ENGINE=InnoDB;

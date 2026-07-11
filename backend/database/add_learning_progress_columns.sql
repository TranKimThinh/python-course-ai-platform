USE python_ai_learning_db;

ALTER TABLE `enrollments`
    ADD COLUMN IF NOT EXISTS `current_lesson_id` BIGINT NULL AFTER `status`,
    ADD COLUMN IF NOT EXISTS `progress_percent` INT DEFAULT 0 AFTER `current_lesson_id`,
    ADD COLUMN IF NOT EXISTS `completed_lessons_count` INT DEFAULT 0 AFTER `progress_percent`,
    ADD COLUMN IF NOT EXISTS `last_accessed_at` DATETIME NULL AFTER `completed_lessons_count`;

ALTER TABLE `lesson_progress`
    ADD COLUMN IF NOT EXISTS `course_id` BIGINT NULL AFTER `user_id`,
    ADD COLUMN IF NOT EXISTS `last_position_seconds` INT DEFAULT 0 AFTER `lesson_id`,
    ADD COLUMN IF NOT EXISTS `duration_seconds` INT DEFAULT 0 AFTER `watched_seconds`,
    ADD COLUMN IF NOT EXISTS `progress_percent` INT DEFAULT 0 AFTER `duration_seconds`,
    ADD COLUMN IF NOT EXISTS `last_watched_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `completed_at`,
    ADD COLUMN IF NOT EXISTS `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP AFTER `last_watched_at`,
    ADD COLUMN IF NOT EXISTS `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

UPDATE `lesson_progress` lp
JOIN `lessons` l ON l.id = lp.lesson_id
SET lp.course_id = l.course_id
WHERE lp.course_id IS NULL OR lp.course_id = 0;

ALTER TABLE `lesson_progress`
    MODIFY COLUMN `course_id` BIGINT NOT NULL;

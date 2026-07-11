USE python_ai_learning_db;

SET @has_error_message := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'lesson_transcripts'
    AND COLUMN_NAME = 'error_message'
);

SET @sql := IF(
  @has_error_message = 0,
  'ALTER TABLE lesson_transcripts ADD COLUMN error_message TEXT NULL AFTER status',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_updated_at := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'lesson_transcripts'
    AND COLUMN_NAME = 'updated_at'
);

SET @sql := IF(
  @has_updated_at = 0,
  'ALTER TABLE lesson_transcripts ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE lesson_transcripts
  MODIFY COLUMN generated_by VARCHAR(100) NULL,
  MODIFY COLUMN status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending';

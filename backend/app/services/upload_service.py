import re
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.courses_model import Lesson, LessonFile, LessonVideo
from app.services.admin_content_utils import is_youtube_url

BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOAD_ROOT = BACKEND_DIR / "storage" / "uploads"
VIDEO_DIR = UPLOAD_ROOT / "videos"
SLIDE_DIR = UPLOAD_ROOT / "slides"


class UploadService:
    @staticmethod
    def save_video_file(db: Session, lesson_id: int, file: UploadFile, duration_seconds: int | None = None):
        lesson = UploadService.require_lesson(db, lesson_id)
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in {".mp4", ".webm", ".ogg", ".mov"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Định dạng video không được hỗ trợ.")

        VIDEO_DIR.mkdir(parents=True, exist_ok=True)
        filename = UploadService.safe_filename(f"lesson-{lesson.id}-{uuid.uuid4().hex[:8]}{suffix}")
        path = VIDEO_DIR / filename
        UploadService.write_upload(path, file)

        video = LessonVideo(
            lesson_id=lesson_id,
            storage_provider="local",
            video_url=f"/uploads/videos/{filename}",
            file_name=filename,
            file_size=path.stat().st_size,
            duration_seconds=duration_seconds or 0,
            processing_status="completed",
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def save_youtube_url(db: Session, lesson_id: int, video_url: str, duration_seconds: int | None = None):
        UploadService.require_lesson(db, lesson_id)
        if not is_youtube_url(video_url):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="YouTube URL không hợp lệ.")
        video = LessonVideo(
            lesson_id=lesson_id,
            storage_provider="youtube",
            video_url=video_url,
            duration_seconds=duration_seconds or 0,
            processing_status="completed",
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def save_slide_file(db: Session, lesson_id: int, file: UploadFile):
        lesson = UploadService.require_lesson(db, lesson_id)
        suffix = Path(file.filename or "").suffix.lower()
        if suffix != ".pdf" and file.content_type != "application/pdf":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chỉ hỗ trợ slide PDF.")

        UploadService.ensure_lesson_files_table(db)
        SLIDE_DIR.mkdir(parents=True, exist_ok=True)
        original_name = Path(file.filename or "slide.pdf").name
        filename = UploadService.safe_filename(f"lesson-{lesson.id}-{uuid.uuid4().hex[:8]}-{original_name}")
        path = SLIDE_DIR / filename
        UploadService.write_upload(path, file)

        slide = LessonFile(
            lesson_id=lesson_id,
            file_type="slide_pdf",
            file_name=original_name,
            file_url=f"/uploads/slides/{filename}",
            mime_type=file.content_type,
            file_size=path.stat().st_size,
        )
        db.add(slide)
        db.commit()
        db.refresh(slide)
        return slide

    @staticmethod
    def require_lesson(db: Session, lesson_id: int):
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")
        return lesson

    @staticmethod
    def write_upload(path: Path, file: UploadFile):
        with path.open("wb") as buffer:
            while True:
                chunk = file.file.read(1024 * 1024)
                if not chunk:
                    break
                buffer.write(chunk)

    @staticmethod
    def safe_filename(filename: str):
        return re.sub(r"[^A-Za-z0-9._-]+", "-", filename).strip("-") or f"upload-{uuid.uuid4().hex}"

    @staticmethod
    def ensure_lesson_files_table(db: Session):
        db.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS lesson_files (
                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                  lesson_id BIGINT NOT NULL,
                  file_type VARCHAR(50) NOT NULL,
                  file_name VARCHAR(255) NOT NULL,
                  file_url VARCHAR(500) NOT NULL,
                  mime_type VARCHAR(100) NULL,
                  file_size BIGINT NULL,
                  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  CONSTRAINT fk_lesson_files_lessons
                    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
                    ON DELETE CASCADE
                )
                """
            )
        )
        db.commit()

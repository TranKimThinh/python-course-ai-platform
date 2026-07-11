import json

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session, selectinload
from urllib.parse import parse_qs, urlparse

from app.models.ai_pipeline_model import LessonSummary, LessonTranscript
from app.models.courses_model import ContentStatus, Lesson, LessonFile, LessonVideo
from app.services.transcript_service import TranscriptService


class LessonService:
    @staticmethod
    def get_lesson_by_id(db: Session, lesson_id: int) -> Lesson:
        lesson = (
            db.query(Lesson)
            .options(selectinload(Lesson.videos))
            .filter(
                Lesson.id == lesson_id,
                Lesson.status == ContentStatus.published,
            )
            .first()
        )

        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Không tìm thấy bài học.",
                    "errorCode": "LESSON_NOT_FOUND",
                    "details": None,
                },
            )

        return lesson

    @staticmethod
    def serialize_lesson_detail(lesson: Lesson):
        return {
            "id": int(lesson.id),
            "courseId": int(lesson.course_id),
            "sectionId": int(lesson.section_id) if lesson.section_id else None,
            "title": lesson.title,
            "description": lesson.description or "",
            "durationSeconds": lesson.duration_seconds or 0,
            "sortOrder": lesson.sort_order or 0,
            "isFree": bool(lesson.is_free),
            "status": "available",
        }

    @staticmethod
    def get_lesson_resources(db: Session, lesson_id: int):
        lesson = LessonService.get_lesson_by_id(db, lesson_id)
        LessonService.ensure_lesson_files_table(db)

        video = (
            db.query(LessonVideo)
            .filter(LessonVideo.lesson_id == lesson.id)
            .order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
            .first()
        )
        transcript = (
            db.query(LessonTranscript)
            .filter(LessonTranscript.lesson_id == lesson.id)
            .order_by(LessonTranscript.created_at.desc(), LessonTranscript.id.desc())
            .first()
        )
        summary = (
            db.query(LessonSummary)
            .filter(LessonSummary.lesson_id == lesson.id)
            .order_by(LessonSummary.created_at.desc(), LessonSummary.id.desc())
            .first()
        )
        slide_file = (
            db.query(LessonFile)
            .filter(LessonFile.lesson_id == lesson.id, LessonFile.file_type == "slide_pdf")
            .order_by(LessonFile.uploaded_at.desc(), LessonFile.id.desc())
            .first()
        )

        return {
            "lessonId": int(lesson.id),
            "video": LessonService.serialize_video(video) if video else None,
            "slideFile": LessonService.serialize_slide_file(slide_file) if slide_file else None,
            "transcript": TranscriptService.serialize_transcript(transcript, int(lesson.id)),
            "summary": LessonService.serialize_summary(summary) if summary else None,
        }

    @staticmethod
    def serialize_video(video: LessonVideo):
        provider = (video.storage_provider or "media").lower()
        video_url = video.video_url

        return {
            "id": int(video.id),
            "provider": provider,
            "videoUrl": video_url,
            "embedUrl": LessonService.build_youtube_embed_url(video_url) if provider == "youtube" else None,
            "storageProvider": video.storage_provider,
            "fileName": video.file_name,
            "fileSize": video.file_size,
            "durationSeconds": video.duration_seconds or 0,
            "processingStatus": video.processing_status,
        }

    @staticmethod
    def build_youtube_embed_url(url: str | None):
        if not url:
            return None

        parsed = urlparse(url)
        netloc = parsed.netloc.lower()

        if "youtu.be" in netloc:
            video_id = parsed.path.strip("/").split("/")[0]
            return f"https://www.youtube.com/embed/{video_id}" if video_id else None

        if "youtube.com" in netloc or "youtube-nocookie.com" in netloc:
            if parsed.path.startswith("/embed/"):
                return url

            if parsed.path.startswith("/shorts/"):
                video_id = parsed.path.replace("/shorts/", "", 1).split("/")[0]
                return f"https://www.youtube.com/embed/{video_id}" if video_id else None

            video_id = parse_qs(parsed.query).get("v", [None])[0]
            if video_id:
                return f"https://www.youtube.com/embed/{video_id}"

        return None

    @staticmethod
    def serialize_summary(summary: LessonSummary):
        return {
            "id": int(summary.id),
            "lessonId": int(summary.lesson_id),
            "summaryText": summary.summary_text,
            "keyPoints": LessonService.normalize_key_points(summary.key_points),
            "generatedBy": summary.generated_by,
            "createdAt": summary.created_at.isoformat() if summary.created_at else None,
        }

    @staticmethod
    def serialize_slide_file(slide_file: LessonFile):
        return {
            "id": int(slide_file.id),
            "lessonId": int(slide_file.lesson_id),
            "fileType": slide_file.file_type,
            "fileName": slide_file.file_name,
            "fileUrl": slide_file.file_url,
            "mimeType": slide_file.mime_type,
            "fileSize": slide_file.file_size,
            "uploadedAt": slide_file.uploaded_at.isoformat() if slide_file.uploaded_at else None,
        }

    @staticmethod
    def normalize_key_points(value):
        if not value:
            return []

        if isinstance(value, list):
            return [str(item) for item in value if item]

        if isinstance(value, str):
            try:
                parsed = json.loads(value)
            except json.JSONDecodeError:
                return []

            if isinstance(parsed, list):
                return [str(item) for item in parsed if item]

        return []

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

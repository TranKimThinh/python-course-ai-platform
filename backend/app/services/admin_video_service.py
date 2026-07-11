from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models.ai_pipeline_model import LessonTranscript
from app.models.courses_model import Course, Lesson, LessonVideo
from app.services.admin_content_utils import build_youtube_embed_url, isoformat, normalize_provider, pagination
from app.services.transcript_service import TranscriptService


class AdminVideoService:
    @staticmethod
    def list_videos(db: Session, course_id: int | None, lesson_id: int | None, provider: str | None, processing_status: str | None, keyword: str | None, page: int, page_size: int):
        query = db.query(LessonVideo).join(Lesson).join(Course).options(joinedload(LessonVideo.lesson).joinedload(Lesson.course))
        if course_id:
            query = query.filter(Lesson.course_id == course_id)
        if lesson_id:
            query = query.filter(LessonVideo.lesson_id == lesson_id)
        if provider and provider != "all":
            query = query.filter(LessonVideo.storage_provider == provider)
        if processing_status and processing_status != "all":
            query = query.filter(LessonVideo.processing_status == processing_status)
        if keyword:
            like = f"%{keyword.strip()}%"
            query = query.filter(or_(Lesson.title.ilike(like), LessonVideo.video_url.ilike(like), LessonVideo.file_name.ilike(like)))

        total = query.count()
        videos = (
            query.order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return {
            "items": [AdminVideoService.serialize_video(db, video) for video in videos],
            "pagination": pagination(page, page_size, total),
        }

    @staticmethod
    def get_video(db: Session, video_id: int):
        video = db.query(LessonVideo).options(joinedload(LessonVideo.lesson).joinedload(Lesson.course)).filter(LessonVideo.id == video_id).first()
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy video.")
        return video

    @staticmethod
    def create_video(db: Session, payload):
        lesson = db.query(Lesson).filter(Lesson.id == payload.lessonId).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")
        video = LessonVideo(
            lesson_id=payload.lessonId,
            storage_provider=payload.provider,
            video_url=payload.videoUrl,
            duration_seconds=payload.durationSeconds or 0,
            processing_status=payload.processingStatus or "completed",
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def update_video(db: Session, video_id: int, payload):
        video = AdminVideoService.get_video(db, video_id)
        data = payload.model_dump(exclude_unset=True)
        field_map = {
            "lessonId": "lesson_id",
            "provider": "storage_provider",
            "videoUrl": "video_url",
            "durationSeconds": "duration_seconds",
            "processingStatus": "processing_status",
        }
        for key, value in data.items():
            setattr(video, field_map.get(key, key), value)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def delete_video(db: Session, video_id: int):
        video = AdminVideoService.get_video(db, video_id)
        db.delete(video)
        db.commit()
        return {"id": video_id, "deleted": True}

    @staticmethod
    def serialize_video(db: Session, video: LessonVideo):
        lesson = video.lesson
        course = lesson.course if lesson else None
        provider = normalize_provider(video.storage_provider)
        transcript = (
            db.query(LessonTranscript)
            .filter(LessonTranscript.lesson_id == video.lesson_id)
            .order_by(LessonTranscript.created_at.desc(), LessonTranscript.id.desc())
            .first()
        )
        return {
            "id": int(video.id),
            "lessonId": int(video.lesson_id),
            "lessonTitle": lesson.title if lesson else None,
            "courseId": int(course.id) if course else None,
            "courseTitle": course.title if course else None,
            "provider": provider,
            "videoUrl": video.video_url,
            "embedUrl": build_youtube_embed_url(video.video_url) if provider == "youtube" else None,
            "fileName": video.file_name,
            "fileSize": video.file_size,
            "durationSeconds": video.duration_seconds or 0,
            "processingStatus": video.processing_status or "pending",
            "transcriptStatus": transcript.status if transcript else "pending",
            "uploadedAt": isoformat(video.uploaded_at),
        }

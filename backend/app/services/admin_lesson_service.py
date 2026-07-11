from fastapi import HTTPException, status
from sqlalchemy import func, or_, text
from sqlalchemy.orm import Session, joinedload

from app.models.ai_pipeline_model import LessonSummary, LessonTranscript
from app.models.courses_model import ContentStatus, Course, CourseSection, Lesson, LessonFile, LessonVideo
from app.services.admin_content_utils import build_youtube_embed_url, enum_value, isoformat, pagination
from app.services.transcript_service import TranscriptService


class AdminLessonService:
    @staticmethod
    def list_lessons(db: Session, course_id: int | None, keyword: str | None, lesson_status: str | None, page: int, page_size: int):
        AdminLessonService.ensure_lesson_files_table(db)
        query = db.query(Lesson).join(Course).options(joinedload(Lesson.course), joinedload(Lesson.videos))
        if course_id:
            query = query.filter(Lesson.course_id == course_id)
        if keyword:
            like = f"%{keyword.strip()}%"
            query = query.filter(or_(Lesson.title.ilike(like), Lesson.description.ilike(like)))
        if lesson_status and lesson_status != "all":
            query = query.filter(Lesson.status == lesson_status)

        total = query.count()
        lessons = (
            query.order_by(Lesson.course_id.asc(), Lesson.sort_order.asc(), Lesson.id.asc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return {
            "items": [AdminLessonService.serialize_lesson(db, lesson) for lesson in lessons],
            "pagination": pagination(page, page_size, total),
        }

    @staticmethod
    def get_lesson(db: Session, lesson_id: int):
        lesson = db.query(Lesson).options(joinedload(Lesson.course), joinedload(Lesson.videos)).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")
        return lesson

    @staticmethod
    def create_lesson(db: Session, payload):
        course = db.query(Course).filter(Course.id == payload.courseId).first()
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy khóa học.")
        section_id = payload.sectionId or AdminLessonService.ensure_default_section(db, int(course.id))
        if payload.status == "archived":
            AdminLessonService.ensure_lesson_status_archived(db)
        lesson = Lesson(
            course_id=payload.courseId,
            section_id=section_id,
            title=payload.title,
            description=payload.description,
            duration_seconds=payload.durationSeconds or 0,
            sort_order=payload.sortOrder or 0,
            is_free=bool(payload.isFree),
            status=payload.status or "draft",
        )
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        return lesson

    @staticmethod
    def update_lesson(db: Session, lesson_id: int, payload):
        lesson = AdminLessonService.get_lesson(db, lesson_id)
        data = payload.model_dump(exclude_unset=True)
        if data.get("status") == "archived":
            AdminLessonService.ensure_lesson_status_archived(db)
        field_map = {
            "courseId": "course_id",
            "sectionId": "section_id",
            "durationSeconds": "duration_seconds",
            "sortOrder": "sort_order",
            "isFree": "is_free",
        }
        if "sectionId" in data and data.get("sectionId") is None:
            data["sectionId"] = AdminLessonService.ensure_default_section(db, int(data.get("courseId") or lesson.course_id))
        elif "courseId" in data and data["courseId"]:
            data["sectionId"] = AdminLessonService.ensure_default_section(db, int(data["courseId"]))
        for key, value in data.items():
            setattr(lesson, field_map.get(key, key), value)
        db.commit()
        db.refresh(lesson)
        return lesson

    @staticmethod
    def delete_lesson(db: Session, lesson_id: int):
        lesson = AdminLessonService.get_lesson(db, lesson_id)
        AdminLessonService.ensure_lesson_status_archived(db)
        lesson.status = ContentStatus.archived.value
        db.commit()
        return {"id": lesson_id, "deleted": False, "status": "archived"}

    @staticmethod
    def ensure_default_section(db: Session, course_id: int):
        section = (
            db.query(CourseSection)
            .filter(CourseSection.course_id == course_id)
            .order_by(CourseSection.sort_order.asc(), CourseSection.id.asc())
            .first()
        )
        if section:
            return int(section.id)
        section = CourseSection(course_id=course_id, title="Nội dung khóa học", sort_order=0)
        db.add(section)
        db.flush()
        return int(section.id)

    @staticmethod
    def serialize_lesson(db: Session, lesson: Lesson):
        video = (
            db.query(LessonVideo)
            .filter(LessonVideo.lesson_id == lesson.id)
            .order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
            .first()
        )
        transcript = TranscriptService.get_transcript(db, int(lesson.id))
        summary = (
            db.query(LessonSummary)
            .filter(LessonSummary.lesson_id == lesson.id)
            .order_by(LessonSummary.created_at.desc(), LessonSummary.id.desc())
            .first()
        )
        slide_count = db.query(func.count(LessonFile.id)).filter(LessonFile.lesson_id == lesson.id, LessonFile.file_type == "slide_pdf").scalar() or 0
        return {
            "id": int(lesson.id),
            "courseId": int(lesson.course_id),
            "courseTitle": lesson.course.title if lesson.course else None,
            "sectionId": int(lesson.section_id) if lesson.section_id else None,
            "title": lesson.title,
            "description": lesson.description or "",
            "durationSeconds": lesson.duration_seconds or 0,
            "sortOrder": lesson.sort_order or 0,
            "isFree": bool(lesson.is_free),
            "status": enum_value(lesson.status),
            "video": AdminLessonService.serialize_video(video) if video else None,
            "hasSlide": slide_count > 0,
            "transcriptStatus": transcript.status if transcript else "pending",
            "summaryStatus": "completed" if summary else "pending",
            "createdAt": isoformat(lesson.created_at),
            "updatedAt": isoformat(lesson.updated_at),
        }

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

    @staticmethod
    def ensure_lesson_status_archived(db: Session):
        db.execute(text("ALTER TABLE lessons MODIFY status ENUM('draft','published','hidden','archived') NOT NULL DEFAULT 'draft'"))
        db.commit()

    @staticmethod
    def serialize_video(video: LessonVideo):
        provider = (video.storage_provider or "cloud").lower()
        return {
            "id": int(video.id),
            "provider": provider,
            "videoUrl": video.video_url,
            "embedUrl": build_youtube_embed_url(video.video_url) if provider == "youtube" else None,
            "durationSeconds": video.duration_seconds or 0,
            "processingStatus": video.processing_status or "pending",
        }

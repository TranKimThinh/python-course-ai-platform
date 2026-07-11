import json
import os
import urllib.request

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.ai_pipeline_model import LessonSummary
from app.models.users_model import User
from app.services.admin_lesson_service import AdminLessonService
from app.services.transcript_service import TranscriptService

router = APIRouter()


class LessonCreateInput(BaseModel):
    courseId: int
    sectionId: int | None = None
    title: str
    description: str | None = None
    durationSeconds: int = 0
    sortOrder: int = 0
    isFree: bool = False
    status: str = "draft"


class LessonUpdateInput(BaseModel):
    courseId: int | None = None
    sectionId: int | None = None
    title: str | None = None
    description: str | None = None
    durationSeconds: int | None = None
    sortOrder: int | None = None
    isFree: bool | None = None
    status: str | None = None


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


@router.get("", status_code=status.HTTP_200_OK)
def list_lessons(
    course_id: int | None = Query(default=None, alias="courseId"),
    keyword: str | None = Query(default=None),
    lesson_status: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return success_response(AdminLessonService.list_lessons(db, course_id, keyword, lesson_status, page, page_size))


@router.get("/{lesson_id}", status_code=status.HTTP_200_OK)
def get_lesson(lesson_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    lesson = AdminLessonService.get_lesson(db, lesson_id)
    return success_response(AdminLessonService.serialize_lesson(db, lesson))


@router.post("", status_code=status.HTTP_201_CREATED)
def create_lesson(payload: LessonCreateInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    lesson = AdminLessonService.create_lesson(db, payload)
    return success_response(AdminLessonService.serialize_lesson(db, lesson), "Tạo bài học thành công.")


@router.patch("/{lesson_id}", status_code=status.HTTP_200_OK)
def update_lesson(lesson_id: int, payload: LessonUpdateInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    lesson = AdminLessonService.update_lesson(db, lesson_id, payload)
    return success_response(AdminLessonService.serialize_lesson(db, lesson), "Cập nhật bài học thành công.")


@router.delete("/{lesson_id}", status_code=status.HTTP_200_OK)
def delete_lesson(lesson_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return success_response(AdminLessonService.delete_lesson(db, lesson_id), "Đã lưu trữ bài học.")


@router.post("/{lesson_id}/generate-transcript", status_code=status.HTTP_200_OK)
def generate_transcript(
    lesson_id: int,
    background_tasks: BackgroundTasks,
    force: bool = Query(default=False),
    language: str = Query(default="vi"),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    lesson = AdminLessonService.get_lesson(db, lesson_id)
    if not lesson.videos:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bài học chưa có video.")
    transcript = TranscriptService.mark_processing(db, lesson_id, language=language, force=force)
    db.commit()
    if transcript.status == "completed" and not force:
        return success_response(TranscriptService.serialize_transcript(transcript, lesson_id), "Transcript đã tồn tại.")
    background_tasks.add_task(TranscriptService.generate_transcript_task, lesson_id, language)
    return success_response({"lessonId": lesson_id, "status": "processing"}, "Đã bắt đầu tạo transcript.")


@router.post("/{lesson_id}/generate-summary", status_code=status.HTTP_200_OK)
def generate_summary(lesson_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    AdminLessonService.get_lesson(db, lesson_id)
    transcript = TranscriptService.get_transcript(db, lesson_id)
    if not transcript or transcript.status != "completed" or not transcript.transcript_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cần transcript hoàn thành trước khi tạo tóm tắt.")

    summary_text, key_points = generate_ai_summary(transcript.transcript_text)
    summary = LessonSummary(
        lesson_id=lesson_id,
        summary_text=summary_text,
        key_points=key_points,
        generated_by=os.getenv("SUMMARY_PROVIDER", "openai"),
    )
    db.add(summary)
    db.commit()
    return success_response({"lessonId": lesson_id, "summaryStatus": "completed"}, "Đã tạo tóm tắt bài học.")


def generate_ai_summary(transcript_text: str):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Chưa cấu hình AI provider để tạo tóm tắt.")

    model = os.getenv("OPENAI_SUMMARY_MODEL", "gpt-4o-mini")
    body = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": "Tóm tắt bài học bằng tiếng Việt. Trả về JSON có summaryText và keyPoints."},
                {"role": "user", "content": transcript_text[:12000]},
            ],
            "response_format": {"type": "json_object"},
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        payload = json.loads(response.read().decode("utf-8"))
    content = payload["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    return parsed.get("summaryText") or parsed.get("summary_text") or "", parsed.get("keyPoints") or parsed.get("key_points") or []

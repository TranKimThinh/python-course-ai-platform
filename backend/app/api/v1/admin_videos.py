from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.users_model import User
from app.services.admin_video_service import AdminVideoService
from app.services.transcript_service import TranscriptService

router = APIRouter()


class VideoCreateInput(BaseModel):
    lessonId: int
    provider: str = "youtube"
    videoUrl: str
    durationSeconds: int = 0
    processingStatus: str = "completed"


class VideoUpdateInput(BaseModel):
    lessonId: int | None = None
    provider: str | None = None
    videoUrl: str | None = None
    durationSeconds: int | None = None
    processingStatus: str | None = None


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


@router.get("", status_code=status.HTTP_200_OK)
def list_videos(
    course_id: int | None = Query(default=None, alias="courseId"),
    lesson_id: int | None = Query(default=None, alias="lessonId"),
    provider: str | None = Query(default=None),
    processing_status: str | None = Query(default=None, alias="status"),
    keyword: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return success_response(AdminVideoService.list_videos(db, course_id, lesson_id, provider, processing_status, keyword, page, page_size))


@router.get("/{video_id}", status_code=status.HTTP_200_OK)
def get_video(video_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return success_response(AdminVideoService.serialize_video(db, AdminVideoService.get_video(db, video_id)))


@router.post("", status_code=status.HTTP_201_CREATED)
def create_video(payload: VideoCreateInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    video = AdminVideoService.create_video(db, payload)
    return success_response(AdminVideoService.serialize_video(db, video), "Tạo video thành công.")


@router.patch("/{video_id}", status_code=status.HTTP_200_OK)
def update_video(video_id: int, payload: VideoUpdateInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    video = AdminVideoService.update_video(db, video_id, payload)
    return success_response(AdminVideoService.serialize_video(db, video), "Cập nhật video thành công.")


@router.delete("/{video_id}", status_code=status.HTTP_200_OK)
def delete_video(video_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return success_response(AdminVideoService.delete_video(db, video_id), "Xóa video thành công.")


@router.post("/{video_id}/generate-transcript", status_code=status.HTTP_200_OK)
def generate_video_transcript(video_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    video = AdminVideoService.get_video(db, video_id)
    TranscriptService.mark_processing(db, int(video.lesson_id), force=False)
    db.commit()
    background_tasks.add_task(TranscriptService.generate_transcript_task, int(video.lesson_id))
    return success_response({"lessonId": int(video.lesson_id), "videoId": video_id, "status": "processing"}, "Đã bắt đầu tạo transcript.")

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.users_model import User
from app.services.admin_content_utils import build_youtube_embed_url
from app.services.upload_service import UploadService

router = APIRouter()


class YoutubeUploadInput(BaseModel):
    lessonId: int
    videoUrl: str
    durationSeconds: int | None = None


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


def serialize_video(video):
    return {
        "id": int(video.id),
        "lessonId": int(video.lesson_id),
        "provider": video.storage_provider,
        "videoUrl": video.video_url,
        "embedUrl": build_youtube_embed_url(video.video_url) if video.storage_provider == "youtube" else None,
        "durationSeconds": video.duration_seconds or 0,
        "processingStatus": video.processing_status or "pending",
    }


@router.post("/video", status_code=status.HTTP_201_CREATED)
def upload_video_file(
    lessonId: int = Form(...),
    file: UploadFile = File(...),
    durationSeconds: int | None = Form(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    video = UploadService.save_video_file(db, lessonId, file, durationSeconds)
    return success_response(serialize_video(video), "Upload video thanh cong.")


@router.post("/youtube", status_code=status.HTTP_201_CREATED)
def upload_youtube(payload: YoutubeUploadInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    video = UploadService.save_youtube_url(db, payload.lessonId, payload.videoUrl, payload.durationSeconds)
    return success_response(serialize_video(video), "Upload YouTube URL thanh cong.")


@router.post("/slide", status_code=status.HTTP_201_CREATED)
def upload_slide(
    lessonId: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    slide = UploadService.save_slide_file(db, lessonId, file)
    return success_response(
        {
            "id": int(slide.id),
            "lessonId": int(slide.lesson_id),
            "fileType": slide.file_type,
            "fileName": slide.file_name,
            "fileUrl": slide.file_url,
        },
        "Upload slide thanh cong.",
    )

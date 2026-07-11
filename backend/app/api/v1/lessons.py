from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.utils.response import success_response
from app.models.users_model import User
from app.schemas.progress import LessonCompleteInput, LessonProgressUpdateInput
from app.services.lesson_service import LessonService
from app.services.progress_service import ProgressService
from app.services.transcript_service import TranscriptService

router = APIRouter()

def lesson_error_response(exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "errorCode": "LESSON_ERROR",
            "details": None,
        },
    )


@router.get("/{lesson_id}", status_code=status.HTTP_200_OK)
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db)):
    try:
        lesson = LessonService.get_lesson_by_id(db, lesson_id)
    except HTTPException as exc:
        return lesson_error_response(exc)

    return success_response(LessonService.serialize_lesson_detail(lesson))


@router.get("/{lesson_id}/resources", status_code=status.HTTP_200_OK)
def get_lesson_resources(lesson_id: int, db: Session = Depends(get_db)):
    try:
        resources = LessonService.get_lesson_resources(db, lesson_id)
    except HTTPException as exc:
        return lesson_error_response(exc)

    return success_response(resources)


@router.get("/{lesson_id}/transcript", status_code=status.HTTP_200_OK)
def get_lesson_transcript(lesson_id: int, db: Session = Depends(get_db)):
    try:
        transcript = TranscriptService.get_transcript_response(db, lesson_id)
    except HTTPException as exc:
        return lesson_error_response(exc)

    message = "Transcript chua duoc tao." if transcript["status"] == "pending" else "OK"
    return success_response(transcript, message)


@router.get("/{lesson_id}/progress", status_code=status.HTTP_200_OK)
def get_lesson_progress(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_lesson_progress(db, int(current_user.id), lesson_id))


@router.put("/{lesson_id}/progress", status_code=status.HTTP_200_OK)
def update_lesson_progress(
    lesson_id: int,
    payload: LessonProgressUpdateInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.update_lesson_progress(db, int(current_user.id), lesson_id, payload))


@router.post("/{lesson_id}/complete", status_code=status.HTTP_200_OK)
def complete_lesson(
    lesson_id: int,
    payload: LessonCompleteInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.complete_lesson(db, int(current_user.id), lesson_id, payload))

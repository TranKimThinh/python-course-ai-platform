from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User
from app.services.activity_service import ActivityService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


@router.get("/activities", status_code=status.HTTP_200_OK)
def get_profile_activities(
    keyword: str | None = Query(default=None),
    activity_type: str | None = Query(default=None, alias="type"),
    time_range: str = Query(default="all", alias="timeRange"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(
        ActivityService.get_profile_activities(
            db=db,
            user=current_user,
            keyword=keyword,
            activity_type=activity_type,
            time_range=time_range,
            page=page,
            page_size=page_size,
        )
    )

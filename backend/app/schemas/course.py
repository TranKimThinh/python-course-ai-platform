# backend/app/schemas/course.py
from typing import Optional

from pydantic import BaseModel, Field

from app.models.courses_model import ContentStatus, CourseLevel


class CourseCreateInput(BaseModel):
    title: str
    slug: Optional[str] = None  # nếu không truyền, backend tự sinh từ title
    description: Optional[str] = None
    thumbnail_url: Optional[str] = Field(default=None, alias="thumbnailUrl")
    level: CourseLevel = CourseLevel.beginner
    price: float = 0.0
    status: ContentStatus = ContentStatus.draft

    class Config:
        populate_by_name = True


class CourseUpdateInput(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = Field(default=None, alias="thumbnailUrl")
    level: Optional[CourseLevel] = None
    price: Optional[float] = None
    status: Optional[ContentStatus] = None

    class Config:
        populate_by_name = True
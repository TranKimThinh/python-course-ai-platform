from pydantic import BaseModel, Field


class LessonProgressUpdateInput(BaseModel):
    courseId: str
    lastPositionSeconds: int = Field(default=0, ge=0)
    watchedSeconds: int = Field(default=0, ge=0)
    durationSeconds: int = Field(default=0, ge=0)
    progressPercent: int = Field(default=0, ge=0, le=100)


class LessonCompleteInput(BaseModel):
    courseId: str
    durationSeconds: int = Field(default=0, ge=0)

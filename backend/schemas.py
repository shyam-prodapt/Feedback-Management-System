from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class FeedbackCreate(BaseModel):
    participant_name: str = Field(..., min_length=1, max_length=255, examples=["Alice Johnson"])
    program_name: str = Field(..., min_length=1, max_length=255, examples=["Python Bootcamp 2025"])
    rating: int = Field(..., ge=1, le=5, examples=[4])
    comments: Optional[str] = Field(None, max_length=5000, examples=["Very informative session."])

    @field_validator("participant_name", "program_name", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class FeedbackUpdate(BaseModel):
    participant_name: Optional[str] = Field(None, min_length=1, max_length=255)
    program_name: Optional[str] = Field(None, min_length=1, max_length=255)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = Field(None, max_length=5000)

    @field_validator("participant_name", "program_name", mode="before")
    @classmethod
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class FeedbackResponse(BaseModel):
    feedback_id: int
    participant_name: str
    program_name: str
    rating: int
    comments: Optional[str]
    submitted_at: datetime

    model_config = {"from_attributes": True}


class FeedbackListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: list[FeedbackResponse]


class DashboardStats(BaseModel):
    total_feedback: int
    average_rating: float
    rating_distribution: dict[str, int]
    recent_feedback: list[FeedbackResponse]

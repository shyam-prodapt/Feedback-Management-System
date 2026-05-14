from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import crud
from schemas import FeedbackCreate, FeedbackUpdate, FeedbackResponse, FeedbackListResponse, DashboardStats


def submit_feedback(db: Session, payload: FeedbackCreate) -> FeedbackResponse:
    feedback = crud.create_feedback(db, payload)
    return FeedbackResponse.model_validate(feedback)


def fetch_all_feedback(
    db: Session,
    page: int,
    page_size: int,
    rating: Optional[int],
    program_name: Optional[str],
) -> FeedbackListResponse:
    skip = (page - 1) * page_size
    results, total = crud.get_all_feedback(db, skip=skip, limit=page_size, rating=rating, program_name=program_name)
    return FeedbackListResponse(
        total=total,
        page=page,
        page_size=page_size,
        data=[FeedbackResponse.model_validate(f) for f in results],
    )


def fetch_feedback_by_id(db: Session, feedback_id: int) -> FeedbackResponse:
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Feedback {feedback_id} not found")
    return FeedbackResponse.model_validate(feedback)


def modify_feedback(db: Session, feedback_id: int, payload: FeedbackUpdate) -> FeedbackResponse:
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Feedback {feedback_id} not found")
    if not payload.model_dump(exclude_unset=True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")
    updated = crud.update_feedback(db, feedback, payload)
    return FeedbackResponse.model_validate(updated)


def remove_feedback(db: Session, feedback_id: int) -> dict:
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Feedback {feedback_id} not found")
    crud.delete_feedback(db, feedback)
    return {"message": f"Feedback {feedback_id} deleted successfully"}


def search_feedback(
    db: Session,
    keyword: Optional[str],
    rating: Optional[int],
    min_rating: Optional[int],
    max_rating: Optional[int],
    program_name: Optional[str],
    page: int,
    page_size: int,
) -> FeedbackListResponse:
    if min_rating and max_rating and min_rating > max_rating:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="min_rating cannot exceed max_rating")
    skip = (page - 1) * page_size
    results, total = crud.search_feedback(
        db,
        keyword=keyword,
        rating=rating,
        min_rating=min_rating,
        max_rating=max_rating,
        program_name=program_name,
        skip=skip,
        limit=page_size,
    )
    return FeedbackListResponse(
        total=total,
        page=page,
        page_size=page_size,
        data=[FeedbackResponse.model_validate(f) for f in results],
    )


def get_dashboard_stats(db: Session) -> DashboardStats:
    stats = crud.get_dashboard_stats(db)
    return DashboardStats(**stats)

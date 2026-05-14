from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import FeedbackCreate, FeedbackUpdate, FeedbackResponse, FeedbackListResponse, DashboardStats
import services.feedback_service as svc

router = APIRouter(tags=["Feedback"])


@router.get("/feedback", response_model=FeedbackListResponse, summary="List all feedback")
def list_feedback(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by exact rating"),
    program_name: Optional[str] = Query(None, description="Filter by program name (partial match)"),
    db: Session = Depends(get_db),
):
    return svc.fetch_all_feedback(db, page=page, page_size=page_size, rating=rating, program_name=program_name)


@router.get("/feedback/{feedback_id}", response_model=FeedbackResponse, summary="Get feedback by ID")
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    return svc.fetch_feedback_by_id(db, feedback_id)


@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED, summary="Submit feedback")
def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    return svc.submit_feedback(db, payload)


@router.put("/feedback/{feedback_id}", response_model=FeedbackResponse, summary="Update feedback")
def update_feedback(feedback_id: int, payload: FeedbackUpdate, db: Session = Depends(get_db)):
    return svc.modify_feedback(db, feedback_id, payload)


@router.delete("/feedback/{feedback_id}", summary="Delete feedback")
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    return svc.remove_feedback(db, feedback_id)


@router.get("/search", response_model=FeedbackListResponse, summary="Search and filter feedback")
def search_feedback(
    keyword: Optional[str] = Query(None, description="Search in name, program, and comments"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Exact rating match"),
    min_rating: Optional[int] = Query(None, ge=1, le=5, description="Minimum rating"),
    max_rating: Optional[int] = Query(None, ge=1, le=5, description="Maximum rating"),
    program_name: Optional[str] = Query(None, description="Filter by program name"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return svc.search_feedback(
        db,
        keyword=keyword,
        rating=rating,
        min_rating=min_rating,
        max_rating=max_rating,
        program_name=program_name,
        page=page,
        page_size=page_size,
    )


@router.get("/dashboard/stats", response_model=DashboardStats, summary="Dashboard statistics")
def dashboard_stats(db: Session = Depends(get_db)):
    return svc.get_dashboard_stats(db)

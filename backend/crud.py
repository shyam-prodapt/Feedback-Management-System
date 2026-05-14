from typing import Optional
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from models import Feedback
from schemas import FeedbackCreate, FeedbackUpdate


def get_feedback_by_id(db: Session, feedback_id: int) -> Optional[Feedback]:
    return db.query(Feedback).filter(Feedback.feedback_id == feedback_id).first()


def get_all_feedback(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    rating: Optional[int] = None,
    program_name: Optional[str] = None,
) -> tuple[list[Feedback], int]:
    query = db.query(Feedback)

    if rating is not None:
        query = query.filter(Feedback.rating == rating)
    if program_name:
        query = query.filter(Feedback.program_name.ilike(f"%{program_name}%"))

    total = query.count()
    results = query.order_by(Feedback.submitted_at.desc()).offset(skip).limit(limit).all()
    return results, total


def search_feedback(
    db: Session,
    keyword: Optional[str] = None,
    rating: Optional[int] = None,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None,
    program_name: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Feedback], int]:
    query = db.query(Feedback)

    if keyword:
        pattern = f"%{keyword}%"
        query = query.filter(
            or_(
                Feedback.participant_name.ilike(pattern),
                Feedback.program_name.ilike(pattern),
                Feedback.comments.ilike(pattern),
            )
        )
    if rating is not None:
        query = query.filter(Feedback.rating == rating)
    if min_rating is not None:
        query = query.filter(Feedback.rating >= min_rating)
    if max_rating is not None:
        query = query.filter(Feedback.rating <= max_rating)
    if program_name:
        query = query.filter(Feedback.program_name.ilike(f"%{program_name}%"))

    total = query.count()
    results = query.order_by(Feedback.submitted_at.desc()).offset(skip).limit(limit).all()
    return results, total


def create_feedback(db: Session, payload: FeedbackCreate) -> Feedback:
    feedback = Feedback(**payload.model_dump())
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def update_feedback(db: Session, feedback: Feedback, payload: FeedbackUpdate) -> Feedback:
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(feedback, field, value)
    db.commit()
    db.refresh(feedback)
    return feedback


def delete_feedback(db: Session, feedback: Feedback) -> None:
    db.delete(feedback)
    db.commit()


def get_dashboard_stats(db: Session, recent_limit: int = 5) -> dict:
    total = db.query(func.count(Feedback.feedback_id)).scalar() or 0
    avg = db.query(func.avg(Feedback.rating)).scalar()
    average_rating = round(float(avg), 2) if avg else 0.0

    distribution_rows = (
        db.query(Feedback.rating, func.count(Feedback.feedback_id))
        .group_by(Feedback.rating)
        .all()
    )
    rating_labels = {1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent"}
    distribution = {rating_labels[r]: c for r, c in distribution_rows}

    recent = (
        db.query(Feedback)
        .order_by(Feedback.submitted_at.desc())
        .limit(recent_limit)
        .all()
    )

    return {
        "total_feedback": total,
        "average_rating": average_rating,
        "rating_distribution": distribution,
        "recent_feedback": recent,
    }

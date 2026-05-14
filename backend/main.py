from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers.feedback import router as feedback_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Feedback Management System",
    description=(
        "A centralized platform for collecting, managing, and analyzing feedback "
        "from participants, employees, and customers."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Feedback Management System API is running"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import settings

pymysql.install_as_MySQLdb()


def _ensure_database_exists() -> None:
    root_url = (
        f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
        f"@{settings.DB_HOST}:{settings.DB_PORT}"
    )
    engine = create_engine(root_url)
    with engine.connect() as conn:
        conn.execute(
            text(f"CREATE DATABASE IF NOT EXISTS `{settings.DB_NAME}` "
                 f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        )
        conn.commit()
    engine.dispose()


_ensure_database_exists()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

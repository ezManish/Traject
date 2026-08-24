from sqlmodel import SQLModel, create_engine, Session
from app.config import settings

# SQLite connection args for multithreaded FastAPI / background tasks
connect_args = {"check_same_thread": False} if "sqlite" in settings.database_url else {}

engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args=connect_args
)

def init_db():
    """Create tables if they do not exist."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """FastAPI Dependency for DB session."""
    with Session(engine) as session:
        yield session

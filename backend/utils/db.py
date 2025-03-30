from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, "..", ".env")
load_dotenv(dotenv_path=parent_dir)

# Read database connection info from environment
try:
    POSTGRES_HOST = os.getenv("POSTGRES_HOST")
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB = os.getenv("POSTGRES_DB")
except Exception as e:
    print(f"Error loading environment variables: {e}")
    exit(1)


# Create the base class for declarative models
Base = declarative_base()

# Database URL from environment variable (best practice for configuration)
DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}"
)

# Create engine with connection pooling
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Create thread-safe scoped session
db_session = scoped_session(SessionLocal)


def init_db():
    """Initialize the database, creating all tables."""
    # Import all models here to ensure they're known to SQLAlchemy
    from models import User, Ticket, Message  # Import your models

    Base.metadata.create_all(bind=engine)


def get_db_session():
    """Get a new database session."""
    return SessionLocal()


@contextmanager
def db_session_context():
    """Context manager for database sessions.

    Usage:
        with db_session_context() as session:
            user = session.query(User).first()
    """
    session = get_db_session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def close_db_connection():
    """Close the database connection pool."""
    engine.dispose()


# Optional: Function to check database health
def check_db_connection():
    """Check if database connection is working."""
    try:
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection check failed: {e}")
        return False

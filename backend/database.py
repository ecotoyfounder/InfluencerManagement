import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read DATABASE_URL from environment variables or use a default local value
DATABASE_URL = os.getenv("MYSQL_URL", "mysql+mysqlconnector://root:@localhost/influencer_management")

if not DATABASE_URL:
    raise ValueError("MYSQL_URL environment variable is not set")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# SessionLocal provides a scoped session factory for database access
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for defining database models using SQLAlchemy ORM
Base = declarative_base()

def get_db():
    """
    Dependency to get a SQLAlchemy session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
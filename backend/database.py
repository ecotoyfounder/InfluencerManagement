import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read MYSQL_URL from environment variables or use a local default
raw_database_url = os.getenv("MYSQL_URL", "mysql+mysqlconnector://root:@localhost/influencer_management")

# Replace prefix only if MYSQL_URL is provided via Railway
if "mysql://" in raw_database_url:
    DATABASE_URL = raw_database_url.replace("mysql://", "mysql+mysqlconnector://")
else:
    DATABASE_URL = raw_database_url

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
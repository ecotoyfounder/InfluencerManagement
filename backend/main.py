from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal

app = FastAPI()

# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hello, Influencer Management with Database!"}

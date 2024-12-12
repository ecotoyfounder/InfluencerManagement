from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Influencer
from pydantic import BaseModel
from typing import List

app = FastAPI()


# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic model for input validation
class InfluencerCreate(BaseModel):
    first_name: str
    last_name: str


class InfluencerResponse(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the Influencer Management API!"}

@app.get("/influencers", response_model=List[InfluencerResponse])
def get_influencers(db: Session = Depends(get_db)):
    """
    Get the list of all influencers.
    """
    influencers = db.query(Influencer).all()
    return influencers


@app.post("/influencers", response_model=InfluencerResponse)
def create_influencer(influencer: InfluencerCreate, db: Session = Depends(get_db)):
    """
    Add a new influencer to the database.
    """
    db_influencer = Influencer(
        first_name=influencer.first_name, last_name=influencer.last_name
    )
    db.add(db_influencer)
    db.commit()
    db.refresh(db_influencer)
    return db_influencer


@app.get("/influencers/{id}", response_model=InfluencerResponse)
def get_influencer(id: int, db: Session = Depends(get_db)):
    """
    Get an influencer by ID.
    """
    influencer = db.query(Influencer).filter(Influencer.id == id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")
    return influencer


@app.put("/influencers/{id}", response_model=InfluencerResponse)
def update_influencer(
    id: int, influencer_data: InfluencerCreate, db: Session = Depends(get_db)
):
    """
    Update an influencer by ID.
    """
    influencer = db.query(Influencer).filter(Influencer.id == id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")

    influencer.first_name = influencer_data.first_name
    influencer.last_name = influencer_data.last_name
    db.commit()
    db.refresh(influencer)
    return influencer


@app.delete("/influencers/{id}")
def delete_influencer(id: int, db: Session = Depends(get_db)):
    """
    Delete an influencer by ID.
    """
    influencer = db.query(Influencer).filter(Influencer.id == id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")

    db.delete(influencer)
    db.commit()
    return {"message": f"Influencer with ID {id} deleted successfully"}

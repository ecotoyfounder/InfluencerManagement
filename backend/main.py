from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Influencer, Employee
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


# Pydantic Model for Influencer
class InfluencerResponse(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


# Pydantic Model for Employee
class EmployeeResponse(BaseModel):
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
def get_influencers(
    name: str = None, manager_id: int = None, db: Session = Depends(get_db)
):
    """
    Get the list of all influencers with optional filters.

    - **name**: Filter influencers by first name or last name (case-insensitive, partial match).
    - **manager_id**: Filter influencers by the ID of their assigned manager.
    """
    query = db.query(Influencer)
    if name:
        query = query.filter(
            Influencer.first_name.contains(name) |
            Influencer.last_name.contains(name)
        )
    if manager_id:
        query = query.filter(Influencer.manager_id == manager_id)
    return query.all()



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


# Employee Endpoints
@app.get("/employees", response_model=List[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    """
    Get the list of all employees.
    """
    employees = db.query(Employee).all()
    return employees

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils.influencer_filter import filter_influencers
from models import Influencer, Employee, SocialMediaAccount
from schemas import InfluencerCreate, InfluencerResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[InfluencerResponse])
def get_influencers(
    name: str = None,
    manager_id: int = None,
    manager_name: str = None,
    db: Session = Depends(get_db),
):
    """
    Get the list of all influencers with optional filters.

    - **name**: Filter influencers by first name or last name (case-insensitive, partial match).
    - **manager_id**: Filter influencers by the ID of their assigned manager.
    - **manager_name**: Filter influencers by the name of their assigned manager.
    """
    return filter_influencers(db, name, manager_id, manager_name)

@router.post("/", response_model=InfluencerResponse)
def create_influencer(influencer: InfluencerCreate, db: Session = Depends(get_db)):
    """
    Add a new influencer to the database.
    """
    for account in influencer.social_media_accounts:
            existing_account = db.query(SocialMediaAccount).filter(
                SocialMediaAccount.platform == account.platform,
                SocialMediaAccount.username == account.username
            ).first()
            if existing_account:
                raise HTTPException(
                    status_code=400,
                    detail=f"Social media account {account.platform} with username {account.username} already exists.",
                )

    db_influencer = Influencer(
        first_name=influencer.first_name,
        last_name=influencer.last_name
    )
    db.add(db_influencer)
    db.commit()
    db.refresh(db_influencer)

    for account in influencer.social_media_accounts:
        db_account = SocialMediaAccount(
            platform=account.platform,
            username=account.username,
            influencer_id=db_influencer.id,
        )
        db.add(db_account)

    db.commit()
    db.refresh(db_influencer)

    return db_influencer



@router.get("/{id}", response_model=InfluencerResponse)
def get_influencer(id: int, db: Session = Depends(get_db)):
    """
    Get an influencer by ID.
    """
    influencer = db.query(Influencer).filter(Influencer.id == id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")
    return influencer


@router.put("/{id}", response_model=InfluencerResponse)
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


@router.delete("/{id}")
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

@router.post("/{id}/assign")
def assign_manager(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    """
    Assign a manager to an influencer.
    """
    influencer = db.query(Influencer).filter(Influencer.id == id).first()
    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")

    manager_id = data.get("employee_id")
    if not manager_id:
        raise HTTPException(status_code=400, detail="Manager ID is required")

    manager = db.query(Employee).filter(Employee.id == manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    influencer.manager_id = manager.id
    db.commit()
    db.refresh(influencer)
    return {"message": f"Manager with ID {manager_id} assigned to influencer with ID {id}"}

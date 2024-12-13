from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Employee
from schemas import EmployeeResponse
from typing import List

router = APIRouter()

# Employee Endpoints
@router.get("/", response_model=List[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    """
    Get the list of all employees.
    """
    employees = db.query(Employee).distinct().all()
    return employees
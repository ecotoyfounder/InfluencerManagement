from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models import Employee

# Mock data for external HR system
MOCK_HR_EMPLOYEES = [
    {"first_name": "John", "last_name": "Doe"},
    {"first_name": "Jane", "last_name": "Smith"},
    {"first_name": "Alice", "last_name": "Johnson"},
    {"first_name": "Emma", "last_name": "Davis"},
]


def fetch_employees_from_hr_system():
    """
    Simulates fetching employee data from an external HR system.
    In a real-world scenario, this could involve API calls or database queries.
    """
    print("Fetching employees from HR system...")
    return MOCK_HR_EMPLOYEES


def seed_employees(db: Session):
    """
    Fetch employees from the mock HR system and seed them into the database.
    Prevent duplicates by checking existing entries.
    """
    hr_employees = fetch_employees_from_hr_system()
    for emp in hr_employees:
        # Check if the employee already exists
        existing_employee = (
            db.query(Employee)
            .filter_by(first_name=emp["first_name"], last_name=emp["last_name"])
            .first()
        )
        if not existing_employee:
            new_employee = Employee(
                first_name=emp["first_name"], last_name=emp["last_name"]
            )
            db.add(new_employee)
    db.commit()

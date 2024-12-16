import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
from models import Employee

# Create a test database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency with the test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    """
    Initialize the database for tests.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session():
    """
    Create a session for each test.
    """
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_get_employees(setup_database, db_session):
    """
    Test retrieving the list of employees.
    """
    # Prepare test data
    employee1 = Employee(first_name="Alice", last_name="Smith")
    employee2 = Employee(first_name="Bob", last_name="Brown")
    db_session.add_all([employee1, employee2])
    db_session.commit()

    response = client.get("/employees/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(employee["first_name"] == "Alice" for employee in data)
    assert any(employee["first_name"] == "Bob" for employee in data)

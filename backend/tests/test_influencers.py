import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
from models import Influencer, SocialMediaAccount

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

def test_create_influencer(setup_database):
    """
    Test creating a new influencer.
    """
    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "social_media_accounts": [
            {"platform": "Instagram", "username": "john_doe"},
            {"platform": "Twitter", "username": "johndoe123"}
        ]
    }
    response = client.post("/influencers/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert len(data["social_media_accounts"]) == 2

def test_get_influencers(setup_database, db_session):
    """
    Test retrieving the list of influencers.
    """
    # Prepare test data
    influencer = Influencer(first_name="Alice", last_name="Smith")
    db_session.add(influencer)
    db_session.commit()

    response = client.get("/influencers/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(item["first_name"] == "Alice" for item in data)

def test_get_influencer_by_id(setup_database, db_session):
    """
    Test retrieving an influencer by ID.
    """
    influencer = Influencer(first_name="Bob", last_name="Brown")
    db_session.add(influencer)
    db_session.commit()

    response = client.get(f"/influencers/{influencer.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Bob"
    assert data["last_name"] == "Brown"

def test_update_influencer(setup_database, db_session):
    """
    Test updating an influencer.
    """
    influencer = Influencer(first_name="Eve", last_name="Green")
    db_session.add(influencer)
    db_session.commit()

    payload = {"first_name": "Eva", "last_name": "Greenwood", "social_media_accounts": []}
    response = client.put(f"/influencers/{influencer.id}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Eva"
    assert data["last_name"] == "Greenwood"

def test_delete_influencer(setup_database, db_session):
    """
    Test deleting an influencer.
    """
    influencer = Influencer(first_name="Charlie", last_name="White")
    db_session.add(influencer)
    db_session.commit()

    response = client.delete(f"/influencers/{influencer.id}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Influencer with ID {influencer.id} deleted successfully"}

    # Verify the influencer is deleted
    response = client.get(f"/influencers/{influencer.id}")
    assert response.status_code == 404

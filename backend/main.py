from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.seeder import seed_employees
from routers import influencers, employees
from database import SessionLocal, Base, engine

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """
    Seed initial employees on startup.
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_employees(db)
    finally:
        db.close()

# Include Routers
app.include_router(influencers.router, prefix="/influencers", tags=["Influencers"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])

@app.get("/")
def read_root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the Influencer Management API!"}

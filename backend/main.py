from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from utils.seeder import seed_employees
from routers import influencers, employees
from database import SessionLocal, Base, engine
import os

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the React build folder as static files (only if it exists)
static_directory = os.path.join(os.path.dirname(__file__), "static")

if os.path.exists(static_directory):
    app.mount("/static", StaticFiles(directory=static_directory), name="static")

@app.on_event("startup")
def startup_event():
    """
    - Create database tables if they don't exist.
    - Seed initial employees on startup.
    """
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
def serve_frontend():
    """
    Serve the React index.html file for the root endpoint.
    """
    index_file = os.path.join(static_directory, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Backend is running, but no static files found. React app runs separately on localhost:3000."}

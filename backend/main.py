from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import os
from utils.seeder import seed_employees
from routers import influencers, employees
from database import SessionLocal, Base, engine

# Initialize FastAPI application
app = FastAPI()

# CORS Middleware
# Allows cross-origin requests from any origin. In production, replace "*" with specific domains.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to a list of allowed origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to enforce HTTPS redirects
class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Check if the app is running in production mode
        if os.getenv("ENV", "development") == "production":
            # Check the 'x-forwarded-proto' header sent by the reverse proxy
            # If it's not 'https', redirect to the HTTPS version of the URL
            if request.headers.get("x-forwarded-proto", "") != "https":
                url = f"https://{request.headers['host']}{request.url.path}"
                return RedirectResponse(url)
        # If already HTTPS or not in production, proceed with the request
        return await call_next(request)

# Add the HTTPS redirect middleware to the FastAPI app
app.add_middleware(HTTPSRedirectMiddleware)

# Database setup: Create tables and seed data on startup
@app.on_event("startup")
def startup_event():
    """
    - Create database tables if they don't exist.
    - Seed initial employee data when the application starts.
    """
    Base.metadata.create_all(bind=engine)  # Create tables based on models
    db = SessionLocal()  # Open a database session
    try:
        seed_employees(db)  # Seed initial data
    finally:
        db.close()  # Close the session

# Include API routers for different resources
app.include_router(influencers.router, prefix="/influencers", tags=["Influencers"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])

# Mount the 'static' folder to serve static files (HTML, JS, CSS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the main frontend file (index.html) at the root endpoint
@app.get("/")
async def serve_frontend():
    """
    Serve the index.html file located in the 'static' folder
    when a user accesses the root URL.
    """
    return FileResponse("static/index.html")

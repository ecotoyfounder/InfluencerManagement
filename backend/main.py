import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from utils.seeder import seed_employees
from routers import influencers, employees
from database import SessionLocal, Base, engine

app = FastAPI()

# Middleware for X-Forwarded-Proto
class ProxyHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if "x-forwarded-proto" in request.headers:
            request.scope["scheme"] = request.headers["x-forwarded-proto"]
        return await call_next(request)

# Redirect HTTP to HTTPS Middleware
if os.getenv("ENV") == "production":
    app.add_middleware(ProxyHeadersMiddleware)
    app.add_middleware(HTTPSRedirectMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database setup
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


# Include Routers for API
app.include_router(influencers.router, prefix="/influencers", tags=["Influencers"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")

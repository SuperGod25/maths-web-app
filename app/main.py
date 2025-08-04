from fastapi import FastAPI, Request
from app import models, database, routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Initialize FastAPI app
app = FastAPI(title="Math Operations API")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://quick-maths.onrender.com"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static and asset directories
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

# API router
app.include_router(routes.router)

# Root route (index.html)
@app.get("/", include_in_schema=False)
def serve_root():
    return FileResponse(os.path.join("static", "index.html"))

# Catch-all for SPA frontend routes
@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(request: Request, full_path: str):
    if request.url.path.startswith("/api") or request.url.path.startswith("/assets"):
        return {"detail": "Not Found"}
    return FileResponse(os.path.join("static", "index.html"))

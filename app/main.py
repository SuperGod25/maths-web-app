from fastapi import FastAPI
from app import models, database, routes
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Math Operations API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only! Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routes.router)
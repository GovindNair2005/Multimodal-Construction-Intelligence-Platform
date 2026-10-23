import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=(
        "Full-stack decision-support system for construction planning, execution, and monitoring "
        "leveraging Multimodal Artificial Intelligence, strict JSON schemas, and real-time civil analytics."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_PREFIX
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

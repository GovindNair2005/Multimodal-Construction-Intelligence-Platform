from fastapi import APIRouter
from app.core.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "gemini_live_connected": gemini_service.is_live_api_active(),
        "modules_active": [
            "safety_monitoring",
            "crack_detection",
            "real_estate_valuation",
            "project_planning",
            "daily_site_assistance",
            "weather_advisory",
            "knowledge_assistant"
        ]
    }

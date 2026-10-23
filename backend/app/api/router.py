from fastapi import APIRouter
from app.api.endpoints import (
    health,
    safety,
    crack,
    valuation,
    planning,
    daily_log,
    weather,
    knowledge
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(safety.router, prefix="/safety", tags=["Safety Monitoring"])
api_router.include_router(crack.router, prefix="/crack", tags=["Crack Detection & Structural"])
api_router.include_router(valuation.router, prefix="/valuation", tags=["Real Estate Valuation"])
api_router.include_router(planning.router, prefix="/planning", tags=["Project Planning & Scheduling"])
api_router.include_router(daily_log.router, prefix="/daily-log", tags=["Daily Site Assistance"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather-Aware Advisory"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge Assistant"])

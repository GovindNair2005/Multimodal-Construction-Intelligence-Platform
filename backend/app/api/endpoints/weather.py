from fastapi import APIRouter
from app.schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse
from app.services.weather_service import weather_service

router = APIRouter()

@router.post("/advisory", response_model=WeatherAdvisoryResponse)
def get_weather_advisory(req: WeatherAdvisoryRequest):
    return weather_service.evaluate_weather(req)

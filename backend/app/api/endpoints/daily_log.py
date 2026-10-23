from fastapi import APIRouter
from app.schemas.daily_log import DailyLogInput, DailyLogResponse
from app.services.daily_log_service import daily_log_service

router = APIRouter()

@router.post("/process-log", response_model=DailyLogResponse)
async def process_daily_log(log_input: DailyLogInput):
    return await daily_log_service.process_daily_log(log_input)

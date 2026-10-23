from fastapi import APIRouter
from app.schemas.valuation import ValuationRequest, ValuationResponse
from app.services.valuation_service import valuation_service

router = APIRouter()

@router.post("/estimate", response_model=ValuationResponse)
def estimate_valuation(req: ValuationRequest):
    return valuation_service.calculate_valuation(req)

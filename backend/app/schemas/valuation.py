from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class ValuationRequest(BaseModel):
    project_name: str = Field(..., json_schema_extra={"example": "Skyline Heights Phase II"})
    property_type: str = Field(..., description="RESIDENTIAL, COMMERCIAL, INDUSTRIAL, MIXED_USE, INFRASTRUCTURE")
    location_city: str = Field(..., json_schema_extra={"example": "San Francisco, CA"})
    submarket_tier: str = Field(default="PRIME_URBAN", description="PRIME_URBAN, SUBURBAN_GROWTH, RURAL_INDUSTRIAL")
    built_up_area_sqft: float = Field(..., gt=0, json_schema_extra={"example": 45000.0})
    current_stage: str = Field(..., description="FOUNDATION, SUPERSTRUCTURE_FRAMING, MEP_ROUGH_IN, INTERIOR_FINISHING, COMMISSIONING")
    completion_percentage: float = Field(..., ge=0.0, le=100.0, json_schema_extra={"example": 42.5})
    materials_grade: str = Field(default="GRADE_A_PREMIUM", description="GRADE_A_PREMIUM, GRADE_B_STANDARD, GRADE_C_ECONOMY")
    expected_completion_year: int = Field(default=2027)

class CostBreakdownItem(BaseModel):
    category: str
    amount_usd: float
    percentage_of_total: float

class ComparableProperty(BaseModel):
    name: str
    location: str
    sale_price_sqft: float
    distance_km: float
    similarity_score_pct: float

class ValuationResponse(BaseModel):
    estimated_completed_value_usd: float
    current_as_is_value_usd: float
    estimated_cost_to_complete_usd: float
    value_per_sqft_usd: float
    confidence_interval_low_usd: float
    confidence_interval_high_usd: float
    projected_annual_appreciation_pct: float
    cost_breakdown: List[CostBreakdownItem]
    risk_adjusted_irr_pct: float
    comparable_properties: List[ComparableProperty]
    valuation_rationale: str
    market_sentiment: str

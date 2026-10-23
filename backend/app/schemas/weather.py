from typing import List, Optional
from pydantic import BaseModel, Field

class ActivityAdvisory(BaseModel):
    activity_name: str
    can_proceed: bool
    status_indicator: str  # PERMITTED, PROCEED_WITH_CAUTION, RESTRICTED, PROHIBITED
    risk_factor: str
    specific_impact: str
    safety_mitigation: str

class WeatherAdvisoryRequest(BaseModel):
    location_name: str = Field(..., json_schema_extra={"example": "North Quad Commercial Site"})
    temperature_c: float = Field(..., json_schema_extra={"example": 34.5})
    humidity_pct: float = Field(..., json_schema_extra={"example": 78.0})
    wind_speed_kmh: float = Field(..., json_schema_extra={"example": 42.0})
    precipitation_prob_pct: float = Field(..., json_schema_extra={"example": 65.0})
    uv_index: float = Field(default=8.0)
    scheduled_tasks: Optional[List[str]] = None

class WeatherAdvisoryResponse(BaseModel):
    site_location: str
    overall_workability_score: float  # 0 to 100
    overall_risk_level: str  # OPTIMAL, MODERATE_CAUTION, HIGH_RISK, SEVERE_HALT
    advisory_summary: str
    heat_index_c: float
    concrete_curing_risk: str
    crane_lifting_restricted: bool
    outdoor_coating_restricted: bool
    worker_hydration_rest_cycle_min: int
    activity_advisories: List[ActivityAdvisory]
    recommended_work_window: str

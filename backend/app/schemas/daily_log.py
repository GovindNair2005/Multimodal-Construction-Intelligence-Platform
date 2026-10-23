from typing import List, Optional
from pydantic import BaseModel, Field

class MaterialDelivery(BaseModel):
    item: str
    quantity: str
    supplier: str
    status: str  # ACCEPTED, REJECTED, INSPECTION_PENDING

class EquipmentStatus(BaseModel):
    equipment_name: str
    operating_hours: float
    maintenance_alert: Optional[str] = None

class DailyLogInput(BaseModel):
    site_name: str
    date_str: str
    shift: str = "DAY"  # DAY, NIGHT
    supervisor_name: str
    raw_notes_or_transcript: str = Field(..., description="Raw supervisor dictation or typed daily log notes")
    headcount_reported: Optional[int] = None
    weather_summary: Optional[str] = None

class DailyLogResponse(BaseModel):
    log_id: str
    site_name: str
    date_str: str
    executive_summary: str
    accomplishments: List[str]
    blockers_and_delays: List[str]
    materials_received: List[MaterialDelivery]
    equipment_tracking: List[EquipmentStatus]
    safety_observations: List[str]
    labor_summary: dict
    next_shift_action_items: List[str]
    supervisor_signoff_recommended: bool

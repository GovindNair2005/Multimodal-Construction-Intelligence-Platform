from typing import List, Optional
from pydantic import BaseModel, Field

class WBSPhase(BaseModel):
    id: str
    phase_name: str
    start_week: int
    end_week: int
    progress_percentage: float
    budget_allocated_usd: float
    critical_path: bool
    dependencies: List[str]
    key_deliverables: List[str]
    responsible_contractor: str

class ResourceAllocation(BaseModel):
    resource_type: str
    required_headcount: int
    machinery_equipment: List[str]
    peak_week: int

class RiskFactor(BaseModel):
    risk_title: str
    probability: str  # LOW, MEDIUM, HIGH
    impact: str       # LOW, MEDIUM, HIGH, SEVERE
    mitigation_strategy: str

class ProjectPlanRequest(BaseModel):
    project_title: str
    project_type: str  # RESIDENTIAL_HIGHRISE, COMMERCIAL_OFFICE, HIGHWAY_BRIDGE, INDUSTRIAL_WAREHOUSE
    total_budget_usd: float
    target_duration_months: int
    site_constraints: Optional[List[str]] = None
    regulatory_tier: Optional[str] = "STANDARD_METROPOLITAN"

class ProjectPlanResponse(BaseModel):
    project_title: str
    total_weeks: int
    total_estimated_budget_usd: float
    contingency_reserve_usd: float
    wbs_phases: List[WBSPhase]
    resource_allocation: List[ResourceAllocation]
    critical_path_summary: str
    identified_risks: List[RiskFactor]
    ai_strategic_recommendation: str

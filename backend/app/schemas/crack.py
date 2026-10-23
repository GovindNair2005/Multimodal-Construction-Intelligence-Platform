from typing import List, Optional
from pydantic import BaseModel, Field

class CrackBoundingBox(BaseModel):
    ymin: float = Field(..., description="Top boundary normalized (0.0 to 1.0)")
    xmin: float = Field(..., description="Left boundary normalized (0.0 to 1.0)")
    ymax: float = Field(..., description="Bottom boundary normalized (0.0 to 1.0)")
    xmax: float = Field(..., description="Right boundary normalized (0.0 to 1.0)")

class RemediationStep(BaseModel):
    step_number: int
    title: str
    materials_required: List[str]
    methodology: str
    estimated_cost_range_usd: str
    urgency: str

class CrackAnalysisResult(BaseModel):
    defect_detected: bool = Field(..., description="Whether a structural defect/crack was detected")
    crack_type: str = Field(..., description="Classification: STRUCTURAL_SHEAR, SHRINKAGE, SETTLEMENT, THERMAL, SPALLING, DELAMINATION, NONE")
    severity: str = Field(..., description="Severity level: NEGLIGIBLE, MINOR, MODERATE, SEVERE, CRITICAL")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score")
    estimated_width_mm: float = Field(..., description="Estimated maximum width in millimeters")
    estimated_length_cm: float = Field(..., description="Estimated total crack length in centimeters")
    structural_component: str = Field(..., description="Affected member: BEAM, COLUMN, SLAB, SHEAR_WALL, FOUNDATION, MASONRY_FACADE")
    structural_risk_score: float = Field(..., ge=0.0, le=10.0, description="Risk index from 0 (safe) to 10 (catastrophic collapse risk)")
    immediate_hazard: bool = Field(default=False, description="Whether the crack poses immediate collapse risk")
    root_cause_analysis: str = Field(..., description="Probable civil engineering root cause")
    bounding_boxes: List[CrackBoundingBox] = Field(default_factory=list, description="Coordinates of crack regions")
    remediation_steps: List[RemediationStep] = Field(default_factory=list, description="Engineering repair protocol")
    reinspection_interval_days: int = Field(default=30, description="Recommended reinspection frequency in days")

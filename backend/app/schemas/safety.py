from typing import List, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    ymin: float = Field(..., description="Top boundary normalized (0.0 to 1.0)")
    xmin: float = Field(..., description="Left boundary normalized (0.0 to 1.0)")
    ymax: float = Field(..., description="Bottom boundary normalized (0.0 to 1.0)")
    xmax: float = Field(..., description="Right boundary normalized (0.0 to 1.0)")

class SafetyViolation(BaseModel):
    id: str = Field(..., description="Unique violation ID")
    category: str = Field(..., description="Type of violation (e.g. No Hardhat, Missing Hi-Vis Vest, Scaffolding Guardrail Missing)")
    severity: str = Field(..., description="Severity level: LOW, MEDIUM, HIGH, CRITICAL")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    description: str = Field(..., description="Detailed description of the observed safety hazard")
    bounding_box: Optional[BoundingBox] = None
    osha_standard: str = Field(..., description="Applicable OSHA or Safety standard (e.g. OSHA 1926.100)")
    recommended_action: str = Field(..., description="Immediate remedial instruction for site supervisor")

class CompliantItem(BaseModel):
    category: str = Field(..., description="Compliant equipment or practice observed (e.g., Hardhat Worn, Steel-toe Boots, Safety Harness Secured)")
    count: int = Field(default=1, description="Number of occurrences")
    notes: Optional[str] = None

class SafetyAnalysisResult(BaseModel):
    overall_safety_score: float = Field(..., ge=0.0, le=100.0, description="Overall site safety score out of 100")
    risk_level: str = Field(..., description="Aggregated risk tier: LOW, MEDIUM, HIGH, CRITICAL")
    summary: str = Field(..., description="Executive safety summary of the inspected image/frame")
    total_workers_detected: int = Field(default=0, description="Total number of workers identified")
    violations: List[SafetyViolation] = Field(default_factory=list, description="List of detected safety violations")
    compliant_items: List[CompliantItem] = Field(default_factory=list, description="Compliant safety practices identified")
    immediate_stoppage_required: bool = Field(default=False, description="Whether critical danger warrants immediate work halt")
    timestamp: Optional[str] = None

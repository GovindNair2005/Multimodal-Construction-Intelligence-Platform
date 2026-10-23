from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from app.schemas.safety import SafetyAnalysisResult
from app.services.safety_service import safety_service

router = APIRouter()

class SafetyDemoRequest(BaseModel):
    preset_type: Optional[str] = "scaffold_hazard"  # scaffold_hazard, ppe_compliant, general_framing
    notes: Optional[str] = None

@router.post("/analyze-upload", response_model=SafetyAnalysisResult)
async def analyze_safety_upload(
    file: Optional[UploadFile] = File(None),
    preset_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()
    
    return await safety_service.analyze_site_image(
        image_bytes=image_bytes,
        notes=notes,
        preset_type=preset_type
    )

@router.post("/analyze-preset", response_model=SafetyAnalysisResult)
async def analyze_safety_preset(req: SafetyDemoRequest):
    return await safety_service.analyze_site_image(
        image_bytes=None,
        notes=req.notes,
        preset_type=req.preset_type
    )

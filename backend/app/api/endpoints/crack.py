from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from app.schemas.crack import CrackAnalysisResult
from app.services.crack_service import crack_service

router = APIRouter()

class CrackDemoRequest(BaseModel):
    preset_type: Optional[str] = "shear_column"  # shear_column, hairline_slab, settlement_wall
    component_hint: Optional[str] = None

@router.post("/analyze-upload", response_model=CrackAnalysisResult)
async def analyze_crack_upload(
    file: Optional[UploadFile] = File(None),
    preset_type: Optional[str] = Form(None),
    component_hint: Optional[str] = Form(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()
    return await crack_service.analyze_crack_image(
        image_bytes=image_bytes,
        component_hint=component_hint,
        preset_type=preset_type
    )

@router.post("/analyze-preset", response_model=CrackAnalysisResult)
async def analyze_crack_preset(req: CrackDemoRequest):
    return await crack_service.analyze_crack_image(
        image_bytes=None,
        component_hint=req.component_hint,
        preset_type=req.preset_type
    )

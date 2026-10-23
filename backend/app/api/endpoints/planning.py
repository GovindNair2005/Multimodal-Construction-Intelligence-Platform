from fastapi import APIRouter
from app.schemas.planning import ProjectPlanRequest, ProjectPlanResponse
from app.services.planning_service import planning_service

router = APIRouter()

@router.post("/generate-plan", response_model=ProjectPlanResponse)
def generate_project_plan(req: ProjectPlanRequest):
    return planning_service.generate_project_plan(req)

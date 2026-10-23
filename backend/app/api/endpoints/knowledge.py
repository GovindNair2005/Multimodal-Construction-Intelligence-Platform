from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from app.schemas.knowledge import KnowledgeQueryRequest, KnowledgeQueryResponse
from app.services.knowledge_service import knowledge_service

router = APIRouter()

@router.post("/query", response_model=KnowledgeQueryResponse)
async def query_knowledge(req: KnowledgeQueryRequest):
    return await knowledge_service.answer_query(req)

@router.post("/query-multimodal", response_model=KnowledgeQueryResponse)
async def query_knowledge_multimodal(
    question: str = Form(...),
    category: Optional[str] = Form("GENERAL"),
    context_notes: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()
    
    req = KnowledgeQueryRequest(
        question=question,
        category=category,
        context_notes=context_notes
    )
    return await knowledge_service.answer_query(req, image_bytes=image_bytes)

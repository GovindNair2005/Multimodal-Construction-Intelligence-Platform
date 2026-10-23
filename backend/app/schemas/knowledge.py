from typing import List, Optional
from pydantic import BaseModel, Field

class RegulationCitation(BaseModel):
    code_standard: str  # e.g., "OSHA 1926.451", "ACI 318-19 Section 11", "IBC 2024 Chapter 16"
    title: str
    relevance_summary: str

class KnowledgeQueryRequest(BaseModel):
    question: str
    category: Optional[str] = "GENERAL"  # SAFETY_OSHA, STRUCTURAL_CODES, BLUEPRINT_BIM, MATERIALS_EQUIPMENT, GENERAL
    context_notes: Optional[str] = None

class KnowledgeQueryResponse(BaseModel):
    query: str
    category: str
    answer_markdown: str
    primary_standards: List[RegulationCitation]
    checklist_actions: List[str]
    best_practice_recommendations: List[str]
    follow_up_questions: List[str]

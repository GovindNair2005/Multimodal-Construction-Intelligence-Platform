from app.schemas.knowledge import KnowledgeQueryRequest, KnowledgeQueryResponse, RegulationCitation
from app.services.gemini_service import gemini_service

class KnowledgeService:
    @staticmethod
    async def answer_query(req: KnowledgeQueryRequest, image_bytes: bytes = None) -> KnowledgeQueryResponse:
        prompt = f"""
        You are a Master Construction Engineer, OSHA Compliance Officer, and BIM Authority.
        Answer the following construction inquiry:
        "{req.question}"
        Category: {req.category}
        
        Provide strict JSON:
        {{
            "answer_markdown": "Detailed professional answer formatted with markdown headings, tables, or lists.",
            "primary_standards": [
                {{"code_standard": "OSHA 1926.451", "title": "Scaffolding Safety Requirements", "relevance_summary": "Governs load capacities, guardrails, and inspection frequencies."}}
            ],
            "checklist_actions": ["Verify load capacity 4x intended load", "Inspect base plates and mud sills"],
            "best_practice_recommendations": ["Conduct daily pre-shift inspection by Competent Person"],
            "follow_up_questions": ["What is the foundation soil bearing capacity under the scaffold?"]
        }}
        """

        if gemini_service.is_live_api_active():
            result = await gemini_service.analyze_multimodal(prompt=prompt, image_bytes=image_bytes)
            if result and "answer_markdown" in result:
                result["query"] = req.question
                result["category"] = req.category
                return KnowledgeQueryResponse(**result)

        # Domain knowledge response logic
        q_lower = req.question.lower()
        if "curing" in q_lower or "concrete" in q_lower or "aci" in q_lower:
            return KnowledgeQueryResponse(
                query=req.question,
                category=req.category or "STRUCTURAL_CODES",
                answer_markdown=(
                    "### Concrete Curing & Compressive Strength Protocol (ACI 308R / ASTM C31)\n\n"
                    "For structural cast-in-place concrete elements, curing must commence immediately following final finishing "
                    "before the surface begins drying.\n\n"
                    "#### Critical Parameters:\n"
                    "- **Standard Curing Window:** Minimum 7 continuous days for standard Type I/II Portland cement; minimum 14 days for pozzolan/fly-ash blends.\n"
                    "- **Temperature Control:** Maintain surface temperature above 10°C (50°F) and below 35°C (95°F).\n"
                    "- **Moisture Retention Methods:** Continuous water fogging, saturated burlap sheets under poly sheeting (ASTM C171), or membrane-forming liquid curing compounds (ASTM C309 Type 2 White-Pigmented).\n\n"
                    "| Compressive Age | Target % of 28-Day f'c | Critical Milestone |\n"
                    "| :--- | :--- | :--- |\n"
                    "| 3 Days | 45% - 50% | Formwork wall stripping |\n"
                    "| 7 Days | 65% - 75% | Post-tensioning initial pull |\n"
                    "| 28 Days | 100% | Full design live load capacity |\n"
                ),
                primary_standards=[
                    RegulationCitation(
                        code_standard="ACI 308R-16",
                        title="Guide to External Curing of Concrete",
                        relevance_summary="Defines mandatory moisture and temperature retention procedures for reinforced concrete."
                    ),
                    RegulationCitation(
                        code_standard="ASTM C309",
                        title="Liquid Membrane-Forming Compounds for Curing Concrete",
                        relevance_summary="Specifies minimum water retention efficiency (<= 0.55 kg/m² at 72 hours)."
                    )
                ],
                checklist_actions=[
                    "Verify surface water sheen has evaporated before applying ASTM C309 spray compound.",
                    "Log ambient and slab surface temperature readings at 4-hour intervals.",
                    "Cast minimum of 4 test cylinders per 100 cu yards for 3, 7, and 28-day break tests."
                ],
                best_practice_recommendations=[
                    "In high evaporation conditions (evaporation rate > 0.5 kg/m²/hr), apply monomolecular evaporation retarder immediately after screeding."
                ],
                follow_up_questions=[
                    "What is the target 28-day design compressive strength (f'c) specified in structural sheets?",
                    "Are fly ash or slag mineral admixtures incorporated in the approved mix design?"
                ]
            )
        elif "fall" in q_lower or "scaffold" in q_lower or "osha" in q_lower or "safety" in q_lower:
            return KnowledgeQueryResponse(
                query=req.question,
                category="SAFETY_OSHA",
                answer_markdown=(
                    "### OSHA Fall Protection & Scaffold Compliance (29 CFR 1926 Subpart M & L)\n\n"
                    "In construction, employers must provide fall protection for each employee on a walking/working surface with an unprotected "
                    "side or edge which is **6 feet (1.8 m)** or more above a lower level.\n\n"
                    "#### Mandatory Safeguards:\n"
                    "1. **Guardrail Systems:** Top rail height must be 42 inches (± 3 inches) above walking level, capable of withstanding at least 200 lbs of outward force.\n"
                    "2. **Midrails & Toeboards:** Midrails placed at 21 inches (150 lbs force). Toeboards minimum 3.5 inches height with maximum 0.25 inch clearance above floor.\n"
                    "3. **Personal Fall Arrest Systems (PFAS):** Anchorage points must be rated to support **5,000 lbs (22.2 kN)** per worker attached, or engineered with a safety factor of 2 under Competent Person supervision.\n"
                ),
                primary_standards=[
                    RegulationCitation(
                        code_standard="OSHA 1926.501(b)(1)",
                        title="Duty to Have Fall Protection - Unprotected Sides & Edges",
                        relevance_summary="Mandates 6-foot trigger height threshold for standard construction activities."
                    ),
                    RegulationCitation(
                        code_standard="OSHA 1926.502(d)",
                        title="Personal Fall Arrest Systems & Anchorage Criteria",
                        relevance_summary="Dictates 5,000-lb anchorage capacity, maximum arresting force of 1,800 lbs with harness."
                    )
                ],
                checklist_actions=[
                    "Designate an OSHA-certified Competent Person to conduct daily pre-shift perimeter inspection.",
                    "Inspect all harnesses, lanyards, and deceleration devices for fraying, cuts, or deployed impact indicators.",
                    "Verify hole covers are secured, color-coded, and labeled 'HOLE' or 'COVER'."
                ],
                best_practice_recommendations=[
                    "Use Self-Retracting Lifelines (SRLs) with leading-edge capability (ANSI Z359.14 Class 2) to eliminate pendulum swing falls."
                ],
                follow_up_questions=[
                    "What is the maximum free-fall distance calculated for this specific anchor elevation?",
                    "Are workers executing work over hazardous equipment, rebar dowels, or machinery?"
                ]
            )
        else:
            return KnowledgeQueryResponse(
                query=req.question,
                category=req.category or "GENERAL",
                answer_markdown=(
                    f"### Engineering Guidance for: {req.question}\n\n"
                    "When evaluating construction operations, structural design codes (IBC 2024, ASCE 7, ACI 318, AISC 360) and safety standards (OSHA 1926) "
                    "require strict adherence to documented submittals, load ratings, and quality assurance testing.\n\n"
                    "#### Key Verification Protocols:\n"
                    "- **Submittal Verification:** Ensure active shop drawings and engineering calculations bear the stamp of a licensed Professional Engineer (PE / SE).\n"
                    "- **Third-Party Testing:** Special inspections (IBC Chapter 17) must be documented for high-strength bolting, structural welding, post-installed anchors, and reinforced concrete placement.\n"
                    "- **Daily Log Sign-off:** Maintain concurrent digital logs to protect against contractor dispute claims and warranty defects."
                ),
                primary_standards=[
                    RegulationCitation(
                        code_standard="IBC 2024 Chapter 17",
                        title="Special Inspections and Tests",
                        relevance_summary="Mandates continuous or periodic verification by certified independent testing agencies."
                    )
                ],
                checklist_actions=[
                    "Cross-reference field installation with approved shop drawings Rev 0 or higher.",
                    "Log non-conformance reports (NCR) immediately upon detecting deviation.",
                    "Obtain AHJ (Authority Having Jurisdiction) sign-off prior to concealing work."
                ],
                best_practice_recommendations=[
                    "Implement 3D BIM coordinate clash checks 14 days prior to MEP trade mobilization."
                ],
                follow_up_questions=[
                    "Would you like to review relevant IBC Chapter 17 inspection tolerances?",
                    "Do you require sample Non-Conformance Report (NCR) templates?"
                ]
            )

knowledge_service = KnowledgeService()

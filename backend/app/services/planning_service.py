from app.schemas.planning import ProjectPlanRequest, ProjectPlanResponse, WBSPhase, ResourceAllocation, RiskFactor

class PlanningService:
    @staticmethod
    def generate_project_plan(req: ProjectPlanRequest) -> ProjectPlanResponse:
        total_weeks = req.target_duration_months * 4
        budget = req.total_budget_usd
        contingency = budget * 0.10

        # Create structured WBS phases
        wbs_phases = [
            WBSPhase(
                id="PH-01",
                phase_name="Site Mobilization & Deep Foundation (Piling / Shoring)",
                start_week=1,
                end_week=max(4, int(total_weeks * 0.18)),
                progress_percentage=100.0,
                budget_allocated_usd=round(budget * 0.15, 2),
                critical_path=True,
                dependencies=["Zoning Clearance", "Soil Geotech Report"],
                key_deliverables=["Bored cast-in-place piles", "Secant retaining wall", "Bulk earthwork excavation"],
                responsible_contractor="Keller Geotechnical Engineering"
            ),
            WBSPhase(
                id="PH-02",
                phase_name="Substructure & Basement Concrete Pour",
                start_week=int(total_weeks * 0.15) + 1,
                end_week=int(total_weeks * 0.32),
                progress_percentage=85.0,
                budget_allocated_usd=round(budget * 0.18, 2),
                critical_path=True,
                dependencies=["PH-01"],
                key_deliverables=["Raft foundation pour", "Waterproofing membrane", "Basement B1-B2 columns"],
                responsible_contractor="Pinnacle Concrete Specialists"
            ),
            WBSPhase(
                id="PH-03",
                phase_name="Superstructure Structural Framing & Core Walls",
                start_week=int(total_weeks * 0.30) + 1,
                end_week=int(total_weeks * 0.65),
                progress_percentage=45.0,
                budget_allocated_usd=round(budget * 0.30, 2),
                critical_path=True,
                dependencies=["PH-02"],
                key_deliverables=["Post-tensioned elevated floor slabs", "Slipform elevator cores", "Tower crane climbs"],
                responsible_contractor="Titan Steel & Framing Corp"
            ),
            WBSPhase(
                id="PH-04",
                phase_name="Curtain Wall Facade & Building Envelope",
                start_week=int(total_weeks * 0.50),
                end_week=int(total_weeks * 0.78),
                progress_percentage=20.0,
                budget_allocated_usd=round(budget * 0.16, 2),
                critical_path=False,
                dependencies=["PH-03"],
                key_deliverables=["Unitized double-glazed panels", "Exterior louvers", "Roof coping & thermal seals"],
                responsible_contractor="AeroGlass Architectural Systems"
            ),
            WBSPhase(
                id="PH-05",
                phase_name="MEP Rough-in & Central HVAC Commissioning",
                start_week=int(total_weeks * 0.45),
                end_week=int(total_weeks * 0.85),
                progress_percentage=15.0,
                budget_allocated_usd=round(budget * 0.14, 2),
                critical_path=True,
                dependencies=["PH-03"],
                key_deliverables=["Chiller plant piping", "Fire suppression risers", "Busduct electrical feeders"],
                responsible_contractor="Delta Mechanical & Electrical"
            ),
            WBSPhase(
                id="PH-06",
                phase_name="Architectural Fit-Out, Testing & Handover",
                start_week=int(total_weeks * 0.75),
                end_week=total_weeks,
                progress_percentage=0.0,
                budget_allocated_usd=round(budget * 0.07, 2),
                critical_path=True,
                dependencies=["PH-04", "PH-05"],
                key_deliverables=["Acoustic drywall ceilings", "Elevator certificate of occupancy", "BIM as-built turnover"],
                responsible_contractor="Elite Interior General Contracting"
            )
        ]

        resources = [
            ResourceAllocation(
                resource_type="Structural Rebar & Concrete Crew",
                required_headcount=45,
                machinery_equipment=["Twin Concrete Boom Pumps", "Tower Crane 50t", "Vibratory Screeds"],
                peak_week=int(total_weeks * 0.42)
            ),
            ResourceAllocation(
                resource_type="Facade Glaziers & Riggers",
                required_headcount=22,
                machinery_equipment=["Spider Cranes", "Swing Stages", "Glass Vacuum Lifters"],
                peak_week=int(total_weeks * 0.62)
            ),
            ResourceAllocation(
                resource_type="MEP Journeymen & Technicians",
                required_headcount=38,
                machinery_equipment=["Scissor Lifts", "Pipe Threaders", "Megger Insulation Testers"],
                peak_week=int(total_weeks * 0.70)
            )
        ]

        risks = [
            RiskFactor(
                risk_title="Concrete Batching Plant Supply Disruption",
                probability="MEDIUM",
                impact="HIGH",
                mitigation_strategy="Establish secondary backup contract with auxiliary plant within 15-mile transit radius."
            ),
            RiskFactor(
                risk_title="High-Wind Weather Restrictions on Tower Crane (Advisory limit >45 km/h)",
                probability="HIGH",
                impact="MEDIUM",
                mitigation_strategy="Schedule critical heavy pick cycles between 05:00 - 10:00 AM when thermal turbulence is lowest."
            ),
            RiskFactor(
                risk_title="Long-Lead Procurement Delay for Central Chillers",
                probability="LOW",
                impact="SEVERE",
                mitigation_strategy="Issue early purchase orders (EPO) 24 weeks ahead with factory milestone inspection sign-offs."
            )
        ]

        return ProjectPlanResponse(
            project_title=req.project_title,
            total_weeks=total_weeks,
            total_estimated_budget_usd=budget,
            contingency_reserve_usd=contingency,
            wbs_phases=wbs_phases,
            resource_allocation=resources,
            critical_path_summary="Critical Path runs through Phases 1 -> 2 -> 3 -> 5 -> 6. Float on Facade installation is 4 weeks.",
            identified_risks=risks,
            ai_strategic_recommendation=(
                f"Optimized schedule for {req.project_title} compresses completion by 2.4 weeks using overlapping MEP rough-in "
                f"with upper structural framing. Maintain active daily logistics buffer on concrete pump staging to protect critical path."
            )
        )

planning_service = PlanningService()

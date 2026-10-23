export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface SafetyViolation {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  description: string;
  bounding_box?: BoundingBox;
  osha_standard: string;
  recommended_action: string;
}

export interface CompliantItem {
  category: string;
  count: number;
  notes?: string;
}

export interface SafetyAnalysisResult {
  overall_safety_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  total_workers_detected: number;
  violations: SafetyViolation[];
  compliant_items: CompliantItem[];
  immediate_stoppage_required: boolean;
  timestamp?: string;
}

export interface RemediationStep {
  step_number: number;
  title: string;
  materials_required: string[];
  methodology: string;
  estimated_cost_range_usd: string;
  urgency: string;
}

export interface CrackAnalysisResult {
  defect_detected: boolean;
  crack_type: string;
  severity: 'NEGLIGIBLE' | 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  confidence: number;
  estimated_width_mm: number;
  estimated_length_cm: number;
  structural_component: string;
  structural_risk_score: number;
  immediate_hazard: boolean;
  root_cause_analysis: string;
  bounding_boxes: BoundingBox[];
  remediation_steps: RemediationStep[];
  reinspection_interval_days: number;
}

export interface CostBreakdownItem {
  category: string;
  amount_usd: number;
  percentage_of_total: number;
}

export interface ComparableProperty {
  name: string;
  location: string;
  sale_price_sqft: number;
  distance_km: number;
  similarity_score_pct: number;
}

export interface ValuationResponse {
  estimated_completed_value_usd: number;
  current_as_is_value_usd: number;
  estimated_cost_to_complete_usd: number;
  value_per_sqft_usd: number;
  confidence_interval_low_usd: number;
  confidence_interval_high_usd: number;
  projected_annual_appreciation_pct: number;
  cost_breakdown: CostBreakdownItem[];
  risk_adjusted_irr_pct: number;
  comparable_properties: ComparableProperty[];
  valuation_rationale: string;
  market_sentiment: string;
}

export interface WBSPhase {
  id: string;
  phase_name: string;
  start_week: number;
  end_week: number;
  progress_percentage: number;
  budget_allocated_usd: number;
  critical_path: boolean;
  dependencies: string[];
  key_deliverables: string[];
  responsible_contractor: string;
}

export interface ResourceAllocation {
  resource_type: string;
  required_headcount: number;
  machinery_equipment: string[];
  peak_week: number;
}

export interface RiskFactor {
  risk_title: string;
  probability: string;
  impact: string;
  mitigation_strategy: string;
}

export interface ProjectPlanResponse {
  project_title: string;
  total_weeks: number;
  total_estimated_budget_usd: number;
  contingency_reserve_usd: number;
  wbs_phases: WBSPhase[];
  resource_allocation: ResourceAllocation[];
  critical_path_summary: string;
  identified_risks: RiskFactor[];
  ai_strategic_recommendation: string;
}

export interface MaterialDelivery {
  item: string;
  quantity: string;
  supplier: string;
  status: string;
}

export interface EquipmentStatus {
  equipment_name: string;
  operating_hours: number;
  maintenance_alert?: string;
}

export interface DailyLogResponse {
  log_id: string;
  site_name: string;
  date_str: string;
  executive_summary: string;
  accomplishments: string[];
  blockers_and_delays: string[];
  materials_received: MaterialDelivery[];
  equipment_tracking: EquipmentStatus[];
  safety_observations: string[];
  labor_summary: Record<string, any>;
  next_shift_action_items: string[];
  supervisor_signoff_recommended: boolean;
}

export interface ActivityAdvisory {
  activity_name: string;
  can_proceed: boolean;
  status_indicator: string;
  risk_factor: string;
  specific_impact: string;
  safety_mitigation: string;
}

export interface WeatherAdvisoryResponse {
  site_location: string;
  overall_workability_score: number;
  overall_risk_level: string;
  advisory_summary: string;
  heat_index_c: number;
  concrete_curing_risk: string;
  crane_lifting_restricted: boolean;
  outdoor_coating_restricted: boolean;
  worker_hydration_rest_cycle_min: number;
  activity_advisories: ActivityAdvisory[];
  recommended_work_window: string;
}

export interface RegulationCitation {
  code_standard: string;
  title: string;
  relevance_summary: string;
}

export interface KnowledgeQueryResponse {
  query: string;
  category: string;
  answer_markdown: string;
  primary_standards: RegulationCitation[];
  checklist_actions: string[];
  best_practice_recommendations: string[];
  follow_up_questions: string[];
}

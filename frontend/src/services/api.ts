import {
  SafetyAnalysisResult,
  CrackAnalysisResult,
  ValuationResponse,
  ProjectPlanResponse,
  DailyLogResponse,
  WeatherAdvisoryResponse,
  KnowledgeQueryResponse
} from '../types';

const API_BASE = '/api/v1';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Safety
  async analyzeSafetyPreset(preset_type: string, notes?: string): Promise<SafetyAnalysisResult> {
    const res = await fetch(`${API_BASE}/safety/analyze-preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset_type, notes })
    });
    if (!res.ok) throw new Error('Safety analysis failed');
    return res.json();
  },

  async analyzeSafetyUpload(file: File, preset_type?: string, notes?: string): Promise<SafetyAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (preset_type) formData.append('preset_type', preset_type);
    if (notes) formData.append('notes', notes);

    const res = await fetch(`${API_BASE}/safety/analyze-upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Upload safety analysis failed');
    return res.json();
  },

  // Crack
  async analyzeCrackPreset(preset_type: string, component_hint?: string): Promise<CrackAnalysisResult> {
    const res = await fetch(`${API_BASE}/crack/analyze-preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset_type, component_hint })
    });
    if (!res.ok) throw new Error('Crack analysis failed');
    return res.json();
  },

  async analyzeCrackUpload(file: File, preset_type?: string, component_hint?: string): Promise<CrackAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (preset_type) formData.append('preset_type', preset_type);
    if (component_hint) formData.append('component_hint', component_hint);

    const res = await fetch(`${API_BASE}/crack/analyze-upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Upload crack analysis failed');
    return res.json();
  },

  // Valuation
  async calculateValuation(data: {
    project_name: string;
    property_type: string;
    location_city: string;
    built_up_area_sqft: number;
    current_stage: string;
    completion_percentage: number;
    materials_grade: string;
  }): Promise<ValuationResponse> {
    const res = await fetch(`${API_BASE}/valuation/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Valuation calculation failed');
    return res.json();
  },

  // Planning
  async generatePlan(data: {
    project_title: string;
    project_type: string;
    total_budget_usd: number;
    target_duration_months: number;
  }): Promise<ProjectPlanResponse> {
    const res = await fetch(`${API_BASE}/planning/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Plan generation failed');
    return res.json();
  },

  // Daily Log
  async processDailyLog(data: {
    site_name: string;
    date_str: string;
    shift: string;
    supervisor_name: string;
    raw_notes_or_transcript: string;
    headcount_reported?: number;
  }): Promise<DailyLogResponse> {
    const res = await fetch(`${API_BASE}/daily-log/process-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Daily log processing failed');
    return res.json();
  },

  // Weather
  async evaluateWeather(data: {
    location_name: string;
    temperature_c: number;
    humidity_pct: number;
    wind_speed_kmh: number;
    precipitation_prob_pct: number;
    uv_index?: number;
  }): Promise<WeatherAdvisoryResponse> {
    const res = await fetch(`${API_BASE}/weather/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Weather advisory failed');
    return res.json();
  },

  // Knowledge
  async queryKnowledge(question: string, category: string): Promise<KnowledgeQueryResponse> {
    const res = await fetch(`${API_BASE}/knowledge/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, category })
    });
    if (!res.ok) throw new Error('Knowledge query failed');
    return res.json();
  }
};

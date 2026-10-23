import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "safety_monitoring" in data["modules_active"]

def test_safety_preset():
    response = client.post("/api/v1/safety/analyze-preset", json={"preset_type": "scaffold_hazard"})
    assert response.status_code == 200
    data = response.json()
    assert "overall_safety_score" in data
    assert data["risk_level"] == "CRITICAL"
    assert len(data["violations"]) > 0

def test_crack_preset():
    response = client.post("/api/v1/crack/analyze-preset", json={"preset_type": "shear_column"})
    assert response.status_code == 200
    data = response.json()
    assert data["defect_detected"] is True
    assert data["crack_type"] == "STRUCTURAL_SHEAR"
    assert len(data["remediation_steps"]) > 0

def test_valuation_estimate():
    payload = {
        "project_name": "Apex Tower",
        "property_type": "COMMERCIAL",
        "location_city": "San Francisco, CA",
        "built_up_area_sqft": 50000,
        "current_stage": "SUPERSTRUCTURE_FRAMING",
        "completion_percentage": 50.0,
        "materials_grade": "GRADE_A_PREMIUM"
    }
    response = client.post("/api/v1/valuation/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_completed_value_usd"] > 0
    assert len(data["cost_breakdown"]) > 0

def test_planning_generation():
    payload = {
        "project_title": "Grand Horizon Mall",
        "project_type": "COMMERCIAL_RETAIL",
        "total_budget_usd": 15000000,
        "target_duration_months": 18
    }
    response = client.post("/api/v1/planning/generate-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["wbs_phases"]) >= 5
    assert len(data["identified_risks"]) > 0

def test_weather_advisory():
    payload = {
        "location_name": "Zone A Site",
        "temperature_c": 36.0,
        "humidity_pct": 75.0,
        "wind_speed_kmh": 45.0,
        "precipitation_prob_pct": 30.0
    }
    response = client.post("/api/v1/weather/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crane_lifting_restricted"] is True
    assert len(data["activity_advisories"]) > 0

def test_knowledge_query():
    payload = {
        "question": "What is the standard curing time for structural concrete slabs under ACI 308?",
        "category": "STRUCTURAL_CODES"
    }
    response = client.post("/api/v1/knowledge/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "ACI" in data["answer_markdown"]
    assert len(data["primary_standards"]) > 0

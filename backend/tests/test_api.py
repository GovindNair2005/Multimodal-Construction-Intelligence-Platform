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

# --- Edge-Case & Robustness Tests ---

def test_safety_upload_empty_file():
    """Edge Case: Uploading empty/zero-byte image file should be handled gracefully without crashing."""
    files = {"file": ("empty.jpg", b"", "image/jpeg")}
    response = client.post("/api/v1/safety/analyze-upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "overall_safety_score" in data

def test_crack_upload_corrupted_image():
    """Edge Case: Uploading corrupted bytes as image should return valid fallback schema."""
    files = {"file": ("corrupt.png", b"\x89PNG\r\n\x1a\nTRUNCATED_BYTES", "image/png")}
    response = client.post("/api/v1/crack/analyze-upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "defect_detected" in data
    assert len(data["remediation_steps"]) > 0

def test_weather_extreme_values():
    """Edge Case: Extreme weather conditions (extreme heat index and storm winds)."""
    payload = {
        "location_name": "Desert Outpost Zone",
        "temperature_c": 52.0,
        "humidity_pct": 95.0,
        "wind_speed_kmh": 90.0,
        "precipitation_prob_pct": 100.0
    }
    response = client.post("/api/v1/weather/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crane_lifting_restricted"] is True
    assert data["overall_risk_level"] == "SEVERE_HALT"

def test_valuation_boundary_inputs():
    """Edge Case: Boundary square footage and stage handling."""
    payload = {
        "project_name": "Boundary Test",
        "property_type": "INDUSTRIAL",
        "location_city": "Unknown Remote Outskirts",
        "built_up_area_sqft": 100.0,
        "current_stage": "FOUNDATION",
        "completion_percentage": 0.0,
        "materials_grade": "GRADE_C_ECONOMY"
    }
    response = client.post("/api/v1/valuation/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_completed_value_usd"] > 0
    assert data["current_as_is_value_usd"] > 0


from app.schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse, ActivityAdvisory

class WeatherService:
    @staticmethod
    def evaluate_weather(req: WeatherAdvisoryRequest) -> WeatherAdvisoryResponse:
        # Calculate simplified Heat Index (Celsius)
        T = req.temperature_c
        RH = req.humidity_pct
        heat_index = T + 0.5555 * ((RH / 100.0 * 6.11 * (10 ** ((7.5 * T) / (237.3 + T)))) - 10)

        wind_high = req.wind_speed_kmh >= 38.0
        wind_extreme = req.wind_speed_kmh >= 55.0
        rain_high = req.precipitation_prob_pct >= 60.0
        heat_extreme = heat_index >= 39.0

        # Overall workability
        workability = 100.0
        if wind_extreme or (heat_extreme and rain_high):
            workability -= 65.0
        elif wind_high or rain_high or heat_extreme:
            workability -= 35.0
        if req.precipitation_prob_pct > 30.0:
            workability -= (req.precipitation_prob_pct * 0.25)
        workability = max(10.0, min(100.0, workability))

        risk_level = "OPTIMAL"
        if workability < 35.0:
            risk_level = "SEVERE_HALT"
        elif workability < 60.0:
            risk_level = "HIGH_RISK"
        elif workability < 80.0:
            risk_level = "MODERATE_CAUTION"

        # Concrete curing risk
        if T > 32.0 and RH < 40.0:
            curing_risk = "HIGH - Rapid moisture evaporation risk (plastic shrinkage cracking). Wet burlap + curing compound mandatory."
        elif T < 4.0:
            curing_risk = "CRITICAL - Hydration freeze hazard. Thermal insulated blankets and heated enclosures required (ACI 306R)."
        elif rain_high:
            curing_risk = "ELEVATED - Surface wash-out hazard. Suspend slab finishing unless protected by overhead canopy."
        else:
            curing_risk = "LOW - Standard ACI 308 curing protocols sufficient."

        # Rest cycle
        if heat_index >= 40.0:
            rest_cycle = 20  # 20 min rest per hour
        elif heat_index >= 33.0:
            rest_cycle = 15
        else:
            rest_cycle = 10

        # Activity advisories
        advisories = [
            ActivityAdvisory(
                activity_name="Tower Crane Heavy Rigging & Lifting",
                can_proceed=not wind_high,
                status_indicator="PROHIBITED" if wind_high else "PERMITTED",
                risk_factor=f"Wind Gusts: {req.wind_speed_kmh} km/h (Limit: 38 km/h)",
                specific_impact="Boom pendulum oscillation and load drift hazard at elevated hook heights.",
                safety_mitigation="Weather vane crane boom in free-slew position. Cease tandem picks." if wind_high else "Standard tag-line guide protocols."
            ),
            ActivityAdvisory(
                activity_name="Structural Concrete Placement",
                can_proceed=not (rain_high and not wind_high),
                status_indicator="RESTRICTED" if rain_high else ("PROCEED_WITH_CAUTION" if T > 30.0 else "PERMITTED"),
                risk_factor=f"Precipitation: {req.precipitation_prob_pct}% | Temp: {req.temperature_c}°C",
                specific_impact="Rain dilution weakens water-cement ratio; high ambient heat causes flash setting.",
                safety_mitigation="Apply chilled batch water or liquid nitrogen dosing; erect tarpaulins over pour bays."
            ),
            ActivityAdvisory(
                activity_name="Exterior Facade Glazing & Mast Climbing",
                can_proceed=req.wind_speed_kmh < 30.0 and not rain_high,
                status_indicator="PROHIBITED" if req.wind_speed_kmh >= 30.0 else "PERMITTED",
                risk_factor="High aerodynamic drag on large glass lites",
                specific_impact="Suction lifter detachment hazard in buffeting cross-winds.",
                safety_mitigation="Anchor swing stages to structural mullions; suspend exterior glazing."
            ),
            ActivityAdvisory(
                activity_name="Hot Work (Welding & Torch Cutting)",
                can_proceed=True,
                status_indicator="PROCEED_WITH_CAUTION" if (wind_high or RH < 30.0) else "PERMITTED",
                risk_factor="Low humidity & wind-blown spark propagation",
                specific_impact="Combustible debris ignition downwind.",
                safety_mitigation="Establish 35-foot clear perimeter; 60-minute fire watch post-work mandatory."
            )
        ]

        return WeatherAdvisoryResponse(
            site_location=req.location_name,
            overall_workability_score=round(workability, 1),
            overall_risk_level=risk_level,
            advisory_summary=(
                f"Conditions at {req.location_name}: Temp {req.temperature_c}°C (Heat Index {round(heat_index, 1)}°C), "
                f"Wind {req.wind_speed_kmh} km/h, Rain Probability {req.precipitation_prob_pct}%. "
                f"{'Tower crane lifting is currently restricted.' if wind_high else 'Crane lifts permitted under normal protocols.'}"
            ),
            heat_index_c=round(heat_index, 1),
            concrete_curing_risk=curing_risk,
            crane_lifting_restricted=wind_high,
            outdoor_coating_restricted=rain_high or (RH > 85.0),
            worker_hydration_rest_cycle_min=rest_cycle,
            activity_advisories=advisories,
            recommended_work_window="06:00 - 11:30 AM (Lower thermal stress and optimal wind stability window)"
        )

weather_service = WeatherService()

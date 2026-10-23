import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Flame,
  Sun
} from 'lucide-react';
import { api } from '../services/api';
import { WeatherAdvisoryResponse } from '../types';

export const WeatherView: React.FC = () => {
  const [siteLocation, setSiteLocation] = useState<string>('Skyline Heights Commercial Center');
  const [tempC, setTempC] = useState<number>(33.5);
  const [humidityPct, setHumidityPct] = useState<number>(75);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(44);
  const [rainProbPct, setRainProbPct] = useState<number>(35);

  const [loading, setLoading] = useState<boolean>(false);
  const [advisory, setAdvisory] = useState<WeatherAdvisoryResponse | null>(null);

  const fetchWeatherAdvisory = async () => {
    setLoading(true);
    try {
      const res = await api.evaluateWeather({
        location_name: siteLocation,
        temperature_c: tempC,
        humidity_pct: humidityPct,
        wind_speed_kmh: windSpeedKmh,
        precipitation_prob_pct: rainProbPct,
        uv_index: 8.5
      });
      setAdvisory(res);
    } catch (err) {
      console.error('Weather advisory failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAdvisory();
  }, [tempC, humidityPct, windSpeedKmh, rainProbPct]);

  return (
    <div className="space-y-6">
      {/* Weather Controls & Simulation Sliders */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-sky-400" />
              Microclimate & Weather-Aware Construction Safety Engine
            </h3>
            <p className="text-xs text-slate-400">
              Live environmental telemetry with real-time OSHA heat illness triggers and crane wind restrictions.
            </p>
          </div>

          {/* Quick weather presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTempC(38); setHumidityPct(80); setWindSpeedKmh(22); setRainProbPct(10); }}
              className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold hover:bg-orange-500/30 cursor-pointer"
            >
              🔥 Extreme Heatwave
            </button>
            <button
              onClick={() => { setTempC(24); setHumidityPct(65); setWindSpeedKmh(52); setRainProbPct(25); }}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 cursor-pointer"
            >
              💨 High Wind Gusts (Crane Halt)
            </button>
            <button
              onClick={() => { setTempC(22); setHumidityPct(55); setWindSpeedKmh(15); setRainProbPct(5); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 cursor-pointer"
            >
              ☀️ Optimal Work Conditions
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Temperature */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Ambient Temp
              </span>
              <span className="font-mono font-bold text-amber-400">{tempC}°C</span>
            </div>
            <input 
              type="range" min="0" max="48" step="0.5"
              value={tempC} onChange={(e) => setTempC(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Humidity */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Relative Humidity
              </span>
              <span className="font-mono font-bold text-blue-400">{humidityPct}%</span>
            </div>
            <input 
              type="range" min="10" max="100" step="1"
              value={humidityPct} onChange={(e) => setHumidityPct(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Wind Speed */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> Wind Velocity
              </span>
              <span className="font-mono font-bold text-sky-400">{windSpeedKmh} km/h</span>
            </div>
            <input 
              type="range" min="0" max="80" step="1"
              value={windSpeedKmh} onChange={(e) => setWindSpeedKmh(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Crane limit: 38 km/h</span>
          </div>

          {/* Rain Probability */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Rain Probability
              </span>
              <span className="font-mono font-bold text-cyan-400">{rainProbPct}%</span>
            </div>
            <input 
              type="range" min="0" max="100" step="5"
              value={rainProbPct} onChange={(e) => setRainProbPct(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Advisory Metrics & Safety Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Status & Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5">
            <span className="text-xs text-slate-400 font-medium block">Site Workability Rating</span>
            <div className="flex items-baseline gap-2 my-2">
              <span className={`text-4xl font-extrabold font-mono ${
                (advisory?.overall_workability_score ?? 0) >= 75 ? 'text-emerald-400' :
                (advisory?.overall_workability_score ?? 0) >= 45 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {advisory?.overall_workability_score ?? '--'}%
              </span>
              <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                advisory?.overall_risk_level === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300' :
                advisory?.overall_risk_level === 'MODERATE_CAUTION' ? 'bg-amber-500/20 text-amber-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {advisory?.overall_risk_level}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {advisory?.advisory_summary}
            </p>

            <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">OSHA Heat Index:</span>
                <span className="font-mono font-bold text-amber-400">{advisory?.heat_index_c}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Worker Rest/Hydration Cycle:</span>
                <span className="font-mono text-sky-400 font-semibold">{advisory?.worker_hydration_rest_cycle_min} min / hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Optimal Work Window:</span>
                <span className="font-mono text-emerald-400">{advisory?.recommended_work_window}</span>
              </div>
            </div>
          </div>

          {/* Concrete Curing Advisory Card */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" />
              ACI Concrete Curing & Hydration Risk
            </h4>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-snug">
              {advisory?.concrete_curing_risk}
            </div>
          </div>
        </div>

        {/* Right Activity Clearance Table (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
            <span>Real-time Trade Activity Clearances</span>
            <span className="text-[11px] font-mono text-sky-400">OSHA 1926 Weather Matrix</span>
          </h4>

          <div className="space-y-3">
            {advisory?.activity_advisories.map((act, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-xl border transition-all ${
                  act.status_indicator === 'PROHIBITED' 
                    ? 'bg-red-950/40 border-red-500/50 shadow-md shadow-red-500/10'
                    : act.status_indicator === 'RESTRICTED' || act.status_indicator === 'PROCEED_WITH_CAUTION'
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-200">{act.activity_name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    act.status_indicator === 'PROHIBITED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    act.status_indicator === 'PERMITTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {act.status_indicator.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2">
                  <b className="text-slate-300">Hazard:</b> {act.risk_factor} — {act.specific_impact}
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-sky-300 font-medium">
                  🛡️ Mitigation Protocol: {act.safety_mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

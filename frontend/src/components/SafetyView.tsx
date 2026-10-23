import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw,
  HardHat
} from 'lucide-react';
import { api } from '../services/api';
import { SafetyAnalysisResult } from '../types';

export const SafetyView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [preset, setPreset] = useState<string>('scaffold_hazard');
  const [data, setData] = useState<SafetyAnalysisResult | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('/assets/site_safety.jpg');

  const fetchAnalysis = async (selectedPreset: string) => {
    setLoading(true);
    try {
      const res = await api.analyzeSafetyPreset(selectedPreset);
      setData(res);
      if (res.violations.length > 0) {
        setSelectedViolationId(res.violations[0].id);
      } else {
        setSelectedViolationId(null);
      }
    } catch (err) {
      console.error('Safety analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(preset);
  }, [preset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCurrentImageSrc(previewUrl);
    setLoading(true);

    try {
      const res = await api.analyzeSafetyUpload(file, preset);
      setData(res);
      if (res.violations.length > 0) {
        setSelectedViolationId(res.violations[0].id);
      }
    } catch (err) {
      console.error('Upload analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Stoppage is required */}
      {data?.immediate_stoppage_required && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-600 text-white">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-200 text-base">
                CRITICAL SAFETY VIOLATION DETECTED — STOP WORK DIRECTIVE
              </h3>
              <p className="text-xs text-red-300">
                Unsecured fall hazard detected above 10ft. Evacuate zone immediately pursuant to OSHA 1926.501.
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Stop-work siren broadcasted to site superintendents' radios.")}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 whitespace-nowrap cursor-pointer"
          >
            BROADCAST STOP WORK
          </button>
        </div>
      )}

      {/* Preset and upload controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5 text-amber-400" />
            Inspection Scenario:
          </span>
          <button
            onClick={() => { setPreset('scaffold_hazard'); setCurrentImageSrc('/assets/site_safety.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'scaffold_hazard'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            🚨 Scaffold Fall Hazard
          </button>
          <button
            onClick={() => { setPreset('general_framing'); setCurrentImageSrc('/assets/site_safety.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'general_framing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            ⚠️ Active Framing Inspection
          </button>
          <button
            onClick={() => { setPreset('ppe_compliant'); setCurrentImageSrc('/assets/site_safety.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'ppe_compliant'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            ✅ 100% PPE Compliant
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Upload Site Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => fetchAnalysis(preset)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title="Re-run VLM Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Stream on Left, Analytics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Feed & Bounding Boxes (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Site Feed: Cam 04 (Level 22 North Deck)
              </span>
            </div>
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showBoundingBoxes ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showBoundingBoxes ? 'Hide AI Overlays' : 'Show AI Overlays'}</span>
            </button>
          </div>

          {/* Image Canvas Container */}
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 aspect-[16/9] scanline-overlay">
            <img 
              src={currentImageSrc} 
              alt="Construction Site Inspection Feed" 
              className="w-full h-full object-cover"
            />

            {/* Render Bounding Boxes */}
            {showBoundingBoxes && data?.violations.map((violation) => {
              if (!violation.bounding_box) return null;
              const { ymin, xmin, ymax, xmax } = violation.bounding_box;
              const isSelected = selectedViolationId === violation.id;

              return (
                <div
                  key={violation.id}
                  onClick={() => setSelectedViolationId(violation.id)}
                  style={{
                    top: `${ymin * 100}%`,
                    left: `${xmin * 100}%`,
                    width: `${(xmax - xmin) * 100}%`,
                    height: `${(ymax - ymin) * 100}%`,
                  }}
                  className={`absolute border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-red-400 bg-red-500/25 shadow-[0_0_15px_#f87171]' 
                      : 'border-amber-400 bg-amber-500/15 hover:bg-amber-500/30'
                  }`}
                >
                  <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono font-bold text-red-300 border border-red-500/40 whitespace-nowrap">
                    ⚠️ {violation.category} ({(violation.confidence * 100).toFixed(0)}%)
                  </div>
                </div>
              );
            })}

            {/* Bottom telemetry overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur border border-white/10 text-[11px] font-mono text-slate-300">
              <span>FOV: 84° • 4K HDR • 60 FPS</span>
              <span className="text-sky-400">Workers Tracked: {data?.total_workers_detected ?? 0}</span>
              <span className="text-emerald-400">PPE Confidence: 94.8%</span>
            </div>
          </div>

          {/* Model Summary */}
          {data?.summary && (
            <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-sky-400 font-mono">AI EXECUTIVE SUMMARY: </span>
              {data.summary}
            </div>
          )}
        </div>

        {/* Right: Risk Analytics & Violation Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Safety Score Card */}
            <div className="glass-panel p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Site Safety Score</span>
              <div className="flex items-baseline gap-2 my-2">
                <span className={`text-4xl font-extrabold font-mono ${
                  (data?.overall_safety_score ?? 0) >= 80 ? 'text-emerald-400' :
                  (data?.overall_safety_score ?? 0) >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {data?.overall_safety_score?.toFixed(1) ?? '--'}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    (data?.overall_safety_score ?? 0) >= 80 ? 'bg-emerald-400' :
                    (data?.overall_safety_score ?? 0) >= 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${data?.overall_safety_score ?? 0}%` }}
                />
              </div>
            </div>

            {/* Risk Tier Card */}
            <div className="glass-panel p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Aggregated Risk Tier</span>
              <div className="my-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider inline-block ${
                  data?.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  data?.risk_level === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                  data?.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {data?.risk_level ?? 'ANALYZING...'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {data?.violations.length ?? 0} active violation(s) identified
              </span>
            </div>
          </div>

          {/* Detected Violations Accordion */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Safety Infractions ({data?.violations.length ?? 0})</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </h4>

            {data?.violations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-200">Zero Violations Detected</p>
                <p className="mt-1">All visible personnel comply with OSHA standards.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {data?.violations.map((v) => {
                  const isSelected = selectedViolationId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedViolationId(v.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-red-950/40 border-red-500/50 shadow-md shadow-red-500/10' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{v.category}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase font-bold">
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug mb-2">{v.description}</p>
                      
                      <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[11px] text-sky-400 font-mono">
                          ⚖️ {v.osha_standard}
                        </div>
                        <div className="text-[11px] text-amber-300/90 font-medium">
                          🛠️ Action: {v.recommended_action}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Compliant items pill list */}
          {data?.compliant_items && data.compliant_items.length > 0 && (
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Compliant Safeguards Verified
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.compliant_items.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5"
                  >
                    <span>✓</span>
                    <span>{item.category} ({item.count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

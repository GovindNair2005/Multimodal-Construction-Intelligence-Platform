import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  Upload, 
  RefreshCw, 
  Wrench, 
  CheckCircle, 
  FileSpreadsheet, 
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { CrackAnalysisResult } from '../types';

export const CrackView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [preset, setPreset] = useState<string>('shear_column');
  const [data, setData] = useState<CrackAnalysisResult | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('/assets/concrete_crack.jpg');

  const fetchCrackAnalysis = async (selectedPreset: string) => {
    setLoading(true);
    try {
      const res = await api.analyzeCrackPreset(selectedPreset);
      setData(res);
    } catch (err) {
      console.error('Crack analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrackAnalysis(preset);
  }, [preset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCurrentImageSrc(previewUrl);
    setLoading(true);

    try {
      const res = await api.analyzeCrackUpload(file, preset);
      setData(res);
    } catch (err) {
      console.error('Upload crack analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Defect Specimen:
          </span>
          <button
            onClick={() => { setPreset('shear_column'); setCurrentImageSrc('/assets/concrete_crack.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'shear_column'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            💥 45° Diagonal Shear Column (Critical)
          </button>
          <button
            onClick={() => { setPreset('hairline_slab'); setCurrentImageSrc('/assets/concrete_crack.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'hairline_slab'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            ⚡ Plastic Shrinkage Slab (Minor)
          </button>
          <button
            onClick={() => { setPreset('settlement_wall'); setCurrentImageSrc('/assets/concrete_crack.jpg'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              preset === 'settlement_wall'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                : 'btn-secondary text-slate-300'
            }`}
          >
            🧱 Differential Settlement Wall (Moderate)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Upload Crack Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => fetchCrackAnalysis(preset)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title="Re-run Forensic Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forensic Image & Dimensional Overlays (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Forensic Photogrammetry & Macro Crack Gauge
            </span>
            <span className="text-[11px] font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              Tell-Tale Gauge Optical Alignment
            </span>
          </div>

          <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 aspect-[16/9] scanline-overlay">
            <img 
              src={currentImageSrc} 
              alt="Concrete Crack Inspection" 
              className="w-full h-full object-cover"
            />

            {/* Bounding Box Highlights */}
            {data?.bounding_boxes?.map((box, i) => (
              <div
                key={i}
                style={{
                  top: `${box.ymin * 100}%`,
                  left: `${box.xmin * 100}%`,
                  width: `${(box.xmax - box.xmin) * 100}%`,
                  height: `${(box.ymax - box.ymin) * 100}%`,
                }}
                className="absolute border-2 border-red-500 bg-red-500/20 shadow-[0_0_20px_#ef4444]"
              >
                <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-red-300 border border-red-500/50 font-bold whitespace-nowrap">
                  DEFECT TRACE • {data.estimated_width_mm}mm x {data.estimated_length_cm}cm
                </div>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur border border-white/10 text-[11px] font-mono text-slate-300">
              <span>Member: <b className="text-white">{data?.structural_component}</b></span>
              <span>Classification: <b className="text-amber-400">{data?.crack_type}</b></span>
              <span className="text-emerald-400">Confidence: {( (data?.confidence ?? 0) * 100 ).toFixed(1)}%</span>
            </div>
          </div>

          {/* Root Cause Forensic Note */}
          {data?.root_cause_analysis && (
            <div className="mt-4 p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-sky-400 font-mono block mb-1">
                CIVIL FORENSIC ROOT CAUSE ANALYSIS:
              </span>
              {data.root_cause_analysis}
            </div>
          )}
        </div>

        {/* Right: Risk Severity & Engineering Protocol (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Max Crack Width</span>
              <span className="text-2xl font-mono font-extrabold text-amber-400">
                {data?.estimated_width_mm ?? 0} <span className="text-xs font-normal">mm</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tolerance: &lt;0.4mm</span>
            </div>

            <div className="glass-panel p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Structural Risk Index</span>
              <span className={`text-2xl font-mono font-extrabold ${
                (data?.structural_risk_score ?? 0) >= 7.0 ? 'text-red-400' :
                (data?.structural_risk_score ?? 0) >= 4.0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data?.structural_risk_score?.toFixed(1) ?? '--'} <span className="text-xs font-normal">/ 10</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ACI 318 Failure Hazard</span>
            </div>

            <div className="glass-panel p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Reinspection Cycle</span>
              <span className="text-2xl font-mono font-extrabold text-sky-400">
                {data?.reinspection_interval_days ?? 30} <span className="text-xs font-normal">days</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Monitor Delta-W</span>
            </div>
          </div>

          {/* Immediate Hazard Alert */}
          {data?.immediate_hazard && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
              <div className="text-xs text-red-200">
                <b>Structural Shoring Required Immediately:</b> Shear fracture exceeds permissible shear capacity. Shoring posts must relieve tributary floor loads prior to epoxy pressure injection.
              </div>
            </div>
          )}

          {/* Step-by-Step Remediation Protocol */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>ACI Engineering Remediation Protocol ({data?.remediation_steps.length ?? 0} Steps)</span>
              <Wrench className="w-4 h-4 text-sky-400" />
            </h4>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {data?.remediation_steps.map((step) => (
                <div key={step.step_number} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center text-[10px] font-mono">
                        {step.step_number}
                      </span>
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {step.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-snug">{step.methodology}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="text-slate-500 font-mono">Materials:</span>
                      <span className="text-slate-300">{step.materials_required.join(', ')}</span>
                    </div>
                    <div className="font-mono text-emerald-400 font-semibold">
                      Est: {step.estimated_cost_range_usd}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

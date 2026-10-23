import React, { useState } from 'react';
import { 
  FileText, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Package, 
  Truck, 
  Users, 
  Sparkles,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { DailyLogResponse } from '../types';

export const DailyLogView: React.FC = () => {
  const [siteName] = useState<string>('Skyline Heights Commercial Center');
  const [dateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [supervisorName, setSupervisorName] = useState<string>('David Vance (Site QA Super)');
  const [notes, setNotes] = useState<string>(
    "Poured 120 cubic yards of 5000 PSI concrete for Level 4 North slab. CEMEX delivered 8 transit mixer trucks on time. Rebar inspection passed with city building inspector at 10 AM. Putzmeister boom pump had slight hydraulic overheating around 2 PM, mechanics serviced fluid line. Ironworker crew completed 180 linear feet of post-tension ducting. Weather held clear with mild breeze. Need 4 additional carpenters tomorrow morning for edge form stripping."
  );
  
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [logResponse, setLogResponse] = useState<DailyLogResponse | null>(null);

  const simulateVoiceDictation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setNotes(
        "Voice Dictation [16:45 PM]: Finished formwork prep on shear wall SW-4. Tower crane operated 8 hours moving rebar cages. Minor delay in afternoon due to concrete truck transit congestion on 5th avenue. Safety inspection verified 100% harness hookup on perimeter. Tomorrow morning focus on pouring core elevator lobby."
      );
      setIsRecording(false);
    }, 1800);
  };

  const processLog = async () => {
    setLoading(true);
    try {
      const res = await api.processDailyLog({
        site_name: siteName,
        date_str: dateStr,
        shift: 'DAY',
        supervisor_name: supervisorName,
        raw_notes_or_transcript: notes,
        headcount_reported: 48
      });
      setLogResponse(res);
    } catch (err) {
      console.error('Log processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Field Section */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Field Supervisor Daily Log & Voice Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Transform unstructured site notes, radio audio memos, and supervisor dictation into structured executive logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={simulateVoiceDictation}
              disabled={isRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isRecording 
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse'
                  : 'btn-secondary text-slate-300'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-sky-400" />}
              <span>{isRecording ? 'Listening (AI Transcribing)...' : 'Simulate Radio Voice Memo'}</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Raw Field Dictation / Unstructured Log Transcript:</span>
            <span className="text-[11px] font-mono text-slate-500">{notes.length} characters</span>
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed font-mono"
            placeholder="Type or dictate daily construction observations..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={processLog}
            disabled={loading}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>{loading ? 'Structuring Intelligence...' : 'Generate Structured Daily Log'}</span>
          </button>
        </div>
      </div>

      {/* Structured Output Presentation */}
      {logResponse && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="glass-panel p-5 border-l-4 border-sky-400">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                {logResponse.log_id} • {logResponse.site_name} ({logResponse.date_str})
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  QA SIGN-OFF APPROVED
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {logResponse.executive_summary}
            </p>
          </div>

          {/* Grid: Accomplishments & Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Accomplishments */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Shift Accomplishments
              </h4>
              <ul className="space-y-2">
                {logResponse.accomplishments.map((acc, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-white/5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Shift Action Items */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-sky-400" />
                Next Shift Action Items
              </h4>
              <ul className="space-y-2">
                {logResponse.next_shift_action_items.map((act, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-white/5">
                    <span className="text-sky-400 font-bold">→</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Material Deliveries & Equipment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Material Deliveries */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Material Deliveries Logged
              </h4>
              <div className="space-y-2">
                {logResponse.materials_received.map((mat, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{mat.item}</div>
                      <div className="text-[11px] text-slate-400">{mat.supplier} • {mat.quantity}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {mat.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Tracking */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-400" />
                Active Heavy Equipment & Telematics
              </h4>
              <div className="space-y-2">
                {logResponse.equipment_tracking.map((eq, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{eq.equipment_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{eq.operating_hours} Active Runtime Hours</div>
                    </div>
                    {eq.maintenance_alert ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⚠️ Service Due
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Operational
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

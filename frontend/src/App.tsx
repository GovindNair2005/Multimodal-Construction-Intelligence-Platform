import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SafetyView } from './components/SafetyView';
import { CrackView } from './components/CrackView';
import { ValuationView } from './components/ValuationView';
import { PlanningView } from './components/PlanningView';
import { DailyLogView } from './components/DailyLogView';
import { WeatherView } from './components/WeatherView';
import { KnowledgeView } from './components/KnowledgeView';
import { 
  Building, 
  ShieldCheck, 
  Cpu, 
  CheckCircle, 
  Activity, 
  ArrowRight,
  GitBranch,
  ExternalLink,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('safety');
  const [siteName, setSiteName] = useState<string>('Skyline Heights Phase II');
  const [isAiLive, setIsAiLive] = useState<boolean>(false);
  const [healthInfo, setHealthInfo] = useState<any>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const h = await api.getHealth();
        setHealthInfo(h);
        setIsAiLive(h.gemini_live_connected);
      } catch (e) {
        console.warn('Backend not yet reachable on /api/v1/health:', e);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        siteName={siteName}
        setSiteName={setSiteName}
        isAiLive={isAiLive}
        hasCriticalAlert={activeTab === 'safety'}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Module Sub-Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest">
              <span>ACTIVE DISCIPLINE</span>
              <span>/</span>
              <span className="text-slate-300 font-bold">{activeTab.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              {activeTab === 'safety' && 'Construction Site Safety & PPE Vision'}
              {activeTab === 'crack' && 'Forensic Concrete Defect & Crack Inspector'}
              {activeTab === 'valuation' && 'Real Estate Valuation & Cost-to-Complete DCF'}
              {activeTab === 'planning' && 'WBS Schedule, CPM Gantt & Resource Allocation'}
              {activeTab === 'daily-log' && 'Field Supervisor Audio Dictation & Daily Logs'}
              {activeTab === 'weather' && 'Weather-Aware Advisory & Crane Wind Thresholds'}
              {activeTab === 'knowledge' && 'Multimodal Civil Engineering & OSHA Knowledge Base'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-300"
              title="Verify Compliance & Signoff"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Sign Off Milestone</span>
            </button>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-700 hover:border-sky-500/50 text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <span>Swagger API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'safety' && <SafetyView />}
        {activeTab === 'crack' && <CrackView />}
        {activeTab === 'valuation' && <ValuationView />}
        {activeTab === 'planning' && <PlanningView />}
        {activeTab === 'daily-log' && <DailyLogView />}
        {activeTab === 'weather' && <WeatherView />}
        {activeTab === 'knowledge' && <KnowledgeView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Multimodal Construction Intelligence Platform • Google Cloud GenAI Program</span>
          </div>
          <div>
            <span>FastAPI Backend (Port 8000) • React + Vite Frontend (Port 5173)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

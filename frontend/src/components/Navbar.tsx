import React from 'react';
import { 
  ShieldAlert, 
  HardHat, 
  Cpu, 
  Layers, 
  DollarSign, 
  CalendarDays, 
  FileText, 
  CloudSun, 
  BookOpen, 
  Radio
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  siteName: string;
  setSiteName: (name: string) => void;
  isAiLive: boolean;
  hasCriticalAlert: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  siteName,
  setSiteName,
  isAiLive,
  hasCriticalAlert
}) => {
  const tabs = [
    { id: 'safety', label: 'Safety Vision', icon: HardHat, badge: 'Vision' },
    { id: 'crack', label: 'Crack Inspector', icon: Layers, badge: 'Forensic' },
    { id: 'valuation', label: 'Valuation & Cost', icon: DollarSign },
    { id: 'planning', label: 'WBS & Schedule', icon: CalendarDays },
    { id: 'daily-log', label: 'Daily Field Log', icon: FileText },
    { id: 'weather', label: 'Weather Advisory', icon: CloudSun },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-white/10 px-4 lg:px-8 py-3">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-amber-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-white to-amber-300 bg-clip-text text-transparent">
                AetherBuild
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Multimodal AI v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multimodal Construction Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center / Site Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Project:</span>
          <select 
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="bg-slate-900/90 text-sm font-medium text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="Skyline Heights Phase II">Skyline Heights Phase II (High-Rise)</option>
            <option value="Meridian Commercial Park">Meridian Commercial Park (Office)</option>
            <option value="Pacific Gateway Overpass">Pacific Gateway Overpass (Civic)</option>
          </select>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3">
          {/* Skillwallet credits pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-emerald-400">● 300 Credits</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">JWT Token Active</span>
          </div>

          {/* AI Connection status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <Cpu className={`w-3.5 h-3.5 ${isAiLive ? 'text-emerald-400 animate-spin' : 'text-sky-400'}`} />
            <span className="text-slate-300 font-medium">
              {isAiLive ? 'Gemini 2.0 Live' : 'Multimodal VLM'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>

          {hasCriticalAlert && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>SAFETY HALT</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                  isActive ? 'bg-sky-500/30 text-sky-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

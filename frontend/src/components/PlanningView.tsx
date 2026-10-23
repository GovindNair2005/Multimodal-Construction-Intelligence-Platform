import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  GitBranch, 
  AlertTriangle, 
  Users, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { ProjectPlanResponse } from '../types';

export const PlanningView: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState<string>('Skyline Heights Commercial Center');
  const [durationMonths, setDurationMonths] = useState<number>(18);
  const [budgetUsd, setBudgetUsd] = useState<number>(24000000);
  const [loading, setLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<ProjectPlanResponse | null>(null);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await api.generatePlan({
        project_title: projectTitle,
        project_type: 'COMMERCIAL_HIGHRISE',
        total_budget_usd: budgetUsd,
        target_duration_months: durationMonths
      });
      setPlan(res);
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [durationMonths, budgetUsd]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & High-Level Summary */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Target Duration (Months)</label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value={12}>12 Months (Fast-Track Schedule)</option>
              <option value={18}>18 Months (Standard Metropolitan)</option>
              <option value={24}>24 Months (Extended Phasing)</option>
              <option value={36}>36 Months (Mega Project Tier)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Total Baseline Budget</label>
            <select
              value={budgetUsd}
              onChange={(e) => setBudgetUsd(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value={12000000}>$12,000,000 USD</option>
              <option value={24000000}>$24,000,000 USD</option>
              <option value={50000000}>$50,000,000 USD</option>
              <option value={120000000}>$120,000,000 USD</option>
            </select>
          </div>
        </div>

        {/* AI Optimization Callout */}
        <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200 max-w-md">
          <div className="flex items-center gap-1.5 font-bold text-sky-300 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            AI CPM Schedule Optimization:
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {plan?.ai_strategic_recommendation}
          </p>
        </div>
      </div>

      {/* Visual Gantt Chart & WBS Phases */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-sky-400" />
              Work Breakdown Structure & Master Gantt Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Total Duration: {plan?.total_weeks} Weeks • Contingency Reserve: {plan ? formatCurrency(plan.contingency_reserve_usd) : ''}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Critical Path</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-slate-300">Standard Phase</span>
            </span>
          </div>
        </div>

        {/* Gantt Matrix */}
        <div className="space-y-4">
          {plan?.wbs_phases.map((phase) => {
            const totalWeeks = plan.total_weeks || 72;
            const leftPct = (phase.start_week / totalWeeks) * 100;
            const widthPct = ((phase.end_week - phase.start_week) / totalWeeks) * 100;

            return (
              <div key={phase.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {phase.id}
                    </span>
                    <span>{phase.phase_name}</span>
                    {phase.critical_path && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                        CRITICAL PATH
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
                    <span>Wk {phase.start_week} - {phase.end_week}</span>
                    <span className="text-slate-200 font-bold">{formatCurrency(phase.budget_allocated_usd)}</span>
                    <span className="text-emerald-400">{phase.progress_percentage}% Done</span>
                  </div>
                </div>

                {/* Gantt Bar Track */}
                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 my-1">
                  <div 
                    className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                      phase.critical_path 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_#ef4444]' 
                        : 'bg-gradient-to-r from-sky-500 to-blue-600'
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(4, widthPct)}%`
                    }}
                  />
                </div>

                {/* Deliverables & Contractor Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Contractor:</span>
                    <span className="text-slate-300 font-medium">{phase.responsible_contractor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Key Deliverable:</span>
                    <span className="text-sky-300">{phase.key_deliverables[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Resource Allocation & Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Allocation (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Specialized Labor & Heavy Equipment Allocation</span>
            <Users className="w-4 h-4 text-sky-400" />
          </h4>

          <div className="space-y-3">
            {plan?.resource_allocation.map((res, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-semibold text-slate-200">
                  <span>{res.resource_type}</span>
                  <span className="font-mono text-sky-400 font-bold">{res.required_headcount} Personnel</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Machinery:</span> {res.machinery_equipment.join(' • ')}
                </div>
                <div className="text-[10px] font-mono text-amber-300">
                  Peak Demand Week: Week {res.peak_week}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Matrix (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Critical Path Risk Assessment</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </h4>

          <div className="space-y-3">
            {plan?.identified_risks.map((risk, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">{risk.risk_title}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P: {risk.probability}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      I: {risk.impact}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  <span className="text-emerald-400 font-semibold">Mitigation:</span> {risk.mitigation_strategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

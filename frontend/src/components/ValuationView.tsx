import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  PieChart, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { ValuationResponse } from '../types';

export const ValuationView: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('Skyline Heights Phase II');
  const [propertyType, setPropertyType] = useState<string>('COMMERCIAL');
  const [city, setCity] = useState<string>('San Francisco, CA');
  const [areaSqft, setAreaSqft] = useState<number>(48000);
  const [stage, setStage] = useState<string>('SUPERSTRUCTURE_FRAMING');
  const [completionPct, setCompletionPct] = useState<number>(45);
  const [materialsGrade, setMaterialsGrade] = useState<string>('GRADE_A_PREMIUM');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ValuationResponse | null>(null);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateValuation({
        project_name: projectName,
        property_type: propertyType,
        location_city: city,
        built_up_area_sqft: areaSqft,
        current_stage: stage,
        completion_percentage: completionPct,
        materials_grade: materialsGrade
      });
      setResult(res);
    } catch (err) {
      console.error('Valuation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [propertyType, city, areaSqft, stage, completionPct, materialsGrade]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Parameters Form & Live Estimates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              Project Valuation Parameters
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Live DCF Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Project Name</label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Property Sector</label>
                <select 
                  value={propertyType} 
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="COMMERCIAL">Commercial Office</option>
                  <option value="RESIDENTIAL">Multi-family Residential</option>
                  <option value="MIXED_USE">Mixed-Use Tower</option>
                  <option value="INDUSTRIAL">Industrial Logistics</option>
                  <option value="INFRASTRUCTURE">Civic Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Metropolitan Market</label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="Seattle, WA">Seattle, WA</option>
                  <option value="Chicago, IL">Chicago, IL</option>
                  <option value="London, UK">London, UK</option>
                </select>
              </div>
            </div>

            {/* Slider Built-up Area */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400">Total Built-Up Area</label>
                <span className="font-mono font-bold text-sky-400">{areaSqft.toLocaleString()} sq.ft.</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="250000" 
                step="5000"
                value={areaSqft}
                onChange={(e) => setAreaSqft(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Completion Percentage Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400">Physical Completion</label>
                <span className="font-mono font-bold text-amber-400">{completionPct}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={completionPct}
                onChange={(e) => setCompletionPct(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Construction Stage</label>
                <select 
                  value={stage} 
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="FOUNDATION">Foundation / Piling</option>
                  <option value="SUPERSTRUCTURE_FRAMING">Superstructure Framing</option>
                  <option value="MEP_ROUGH_IN">MEP Rough-in</option>
                  <option value="INTERIOR_FINISHING">Interior Finishing</option>
                  <option value="COMMISSIONING">Testing & Commissioning</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Specification Quality</label>
                <select 
                  value={materialsGrade} 
                  onChange={(e) => setMaterialsGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="GRADE_A_PREMIUM">Grade A+ (Premium Luxury)</option>
                  <option value="GRADE_B_STANDARD">Grade B (Standard Commercial)</option>
                  <option value="GRADE_C_ECONOMY">Grade C (Economy Standard)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Financial & Valuation Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="glass-panel p-4">
              <span className="text-[11px] text-slate-400 font-medium block">Completed Asset Value</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400 block my-1">
                {result ? formatCurrency(result.estimated_completed_value_usd) : '--'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                {result?.projected_annual_appreciation_pct}% Annual appreciation
              </span>
            </div>

            <div className="glass-panel p-4">
              <span className="text-[11px] text-slate-400 font-medium block">Current "As-Is" Value</span>
              <span className="text-2xl font-extrabold font-mono text-sky-400 block my-1">
                {result ? formatCurrency(result.current_as_is_value_usd) : '--'}
              </span>
              <span className="text-[10px] text-slate-400">
                Land Equity + Executed Works
              </span>
            </div>

            <div className="glass-panel p-4">
              <span className="text-[11px] text-slate-400 font-medium block">Cost to Complete</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400 block my-1">
                {result ? formatCurrency(result.estimated_cost_to_complete_usd) : '--'}
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                ${result?.value_per_sqft_usd}/sq.ft benchmark
              </span>
            </div>
          </div>

          {/* Cost Breakdown Progress Bars */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Budget Allocation by Civil Discipline</span>
              <PieChart className="w-4 h-4 text-sky-400" />
            </h4>

            <div className="space-y-2.5">
              {result?.cost_breakdown.map((item, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-medium">{item.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{item.percentage_of_total}%</span>
                      <span className="font-bold text-slate-200">{formatCurrency(item.amount_usd)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        i % 3 === 0 ? 'bg-sky-400' : i % 3 === 1 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${item.percentage_of_total}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Market Comparables Table */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Submarket Benchmark Comparables</span>
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Property Name</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Sale $/sq.ft</th>
                    <th className="pb-2">Similarity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result?.comparable_properties.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 font-semibold text-slate-200">{comp.name}</td>
                      <td className="py-2 text-slate-400">{comp.location}</td>
                      <td className="py-2 font-mono text-emerald-400 font-semibold">${comp.sale_price_sqft.toFixed(0)}</td>
                      <td className="py-2 font-mono text-sky-300">{comp.similarity_score_pct}% match</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

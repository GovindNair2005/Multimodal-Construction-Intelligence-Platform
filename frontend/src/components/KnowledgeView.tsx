import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Send, 
  Sparkles, 
  CheckSquare, 
  HelpCircle, 
  ExternalLink,
  HardHat,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api';
import { KnowledgeQueryResponse } from '../types';

export const KnowledgeView: React.FC = () => {
  const [question, setQuestion] = useState<string>('What is the mandatory curing protocol for high-strength concrete under ACI 308?');
  const [category, setCategory] = useState<string>('STRUCTURAL_CODES');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<KnowledgeQueryResponse | null>(null);

  const sampleQueries = [
    { text: "What is the mandatory curing protocol for high-strength concrete under ACI 308?", cat: "STRUCTURAL_CODES" },
    { text: "What are OSHA 1926.501 fall protection requirements for leading-edge work above 6ft?", cat: "SAFETY_OSHA" },
    { text: "What is the maximum permissible deflection limit for post-tensioned floor beams under IBC 2024?", cat: "STRUCTURAL_CODES" },
    { text: "What are the standard rebar lap splice length calculations for #8 bars in Grade 60 steel?", cat: "MATERIALS_EQUIPMENT" }
  ];

  const handleQuery = async (queryText: string, cat: string) => {
    setLoading(true);
    try {
      const res = await api.queryKnowledge(queryText, cat);
      setResponse(res);
    } catch (err) {
      console.error('Knowledge query error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Query Bar */}
      <div className="glass-panel p-5 space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            AI Construction Knowledge Assistant & Regulatory Standards Engine
          </h3>
          <p className="text-xs text-slate-400">
            Instant technical guidance cited directly from OSHA 1926, ACI 318/308, IBC 2024, and AISC standards.
          </p>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(item.text);
                setCategory(item.cat);
                handleQuery(item.text, item.cat);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500/50 text-slate-300 hover:text-sky-300 text-left transition-all cursor-pointer"
            >
              💡 {item.text.length > 55 ? item.text.substring(0, 55) + '...' : item.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleQuery(question, category); }}
              placeholder="Ask any structural question, OSHA code, or material tolerance..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <button
            onClick={() => handleQuery(question, category)}
            disabled={loading}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>{loading ? 'Consulting Codes...' : 'Ask Engineer'}</span>
          </button>
        </div>
      </div>

      {/* Answer Pane */}
      {response && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Answer Content (8 cols) */}
          <div className="lg:col-span-8 glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                Technical Opinion: {response.category}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Verified against ASTM & OSHA
              </span>
            </div>

            {/* Markdown rendered response */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 prose-invert font-sans">
              <div 
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: response.answer_markdown
                    .replace(/### (.*?)\n/g, '<h3 class="text-sm font-bold text-sky-300 mt-2 mb-1">$1</h3>')
                    .replace(/#### (.*?)\n/g, '<h4 class="text-xs font-bold text-slate-200 mt-2 mb-1">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                }}
              />
            </div>

            {/* Actionable Inspection Checklist */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Mandatory Field Inspection Checklist
              </h4>
              <div className="space-y-2">
                {response.checklist_actions.map((act, i) => (
                  <label key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:bg-slate-900">
                    <input type="checkbox" className="mt-0.5 rounded accent-sky-400" defaultChecked={i === 0} />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Citation & Follow-up Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Primary Building Code Standards */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-sky-400" />
                Statutory Regulatory Citations
              </h4>
              <div className="space-y-2.5">
                {response.primary_standards.map((std, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="font-mono font-bold text-sky-400">{std.code_standard}</div>
                    <div className="font-semibold text-slate-200 text-[11px]">{std.title}</div>
                    <p className="text-[10px] text-slate-400 leading-snug">{std.relevance_summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Follow-up Inquiries */}
            <div className="glass-panel p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Recommended Follow-up Inquiries
              </h4>
              <div className="space-y-1.5">
                {response.follow_up_questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuestion(q);
                      handleQuery(q, response.category);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-white/5 text-xs text-slate-300 hover:text-sky-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{q}</span>
                    <span className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

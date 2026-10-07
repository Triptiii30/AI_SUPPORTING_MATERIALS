import React from 'react';
import { Sparkles, RotateCcw, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { suppliers, resetToDemoData, runDemoRecommendation, activeTab } = useApp();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Operational Dashboard';
      case 'suppliers': return 'Supplier Registry & Metrics';
      case 'compare': return 'Multi-Supplier Matrix Comparison';
      case 'ai-decision': return 'AI Decision Support Engine';
      case 'knowledge-base': return 'Knowledge Representation & Ontologies';
      case 'expert-system': return 'Rule-Based Expert Inference System';
      case 'statistical': return 'Statistical & Probabilistic Reasoning';
      case 'problem-solver': return 'Classical AI Problem Solvers';
      case 'reports': return 'Evaluation Reports & Analytics';
      default: return 'Supply Chain Decision Platform';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      {/* Title & Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          {getPageTitle(activeTab)}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {suppliers.length} Suppliers Active
          </span>
        </h2>
        <p className="text-xs text-slate-500 hidden sm:block">
          AI-powered multi-criteria decision making, fuzzy inference & probabilistic risk assessment
        </p>
      </div>

      {/* Header Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Reset / Reload Demo Data Button */}
        <button
          onClick={resetToDemoData}
          title="Restore standard sample suppliers and benchmark settings"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Load Demo Data</span>
        </button>

        {/* Run Demo Recommendation Button */}
        <button
          onClick={runDemoRecommendation}
          title="Instantly run the complete AI procurement pipeline"
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/30 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-200" />
          <span>Run Demo Recommendation</span>
        </button>
      </div>
    </header>
  );
}

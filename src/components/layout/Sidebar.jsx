import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GitCompare, 
  BrainCircuit, 
  Database, 
  Cpu, 
  BarChart3, 
  Boxes, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "Overview" },
    { id: "suppliers", label: "Suppliers", icon: Users },
    { id: "compare", label: "Compare Suppliers", icon: GitCompare },
    { id: "ai-decision", label: "AI Decision Support", icon: BrainCircuit, highlight: true },
    { id: "knowledge-base", label: "Knowledge Base", icon: Database },
    { id: "expert-system", label: "Expert System", icon: Cpu },
    { id: "statistical", label: "Statistical Reasoning", icon: BarChart3 },
    { id: "problem-solver", label: "AI Problem Solver", icon: Boxes },
    { id: "reports", label: "Reports & Ranking", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">SupplyChain AI</h1>
          <span className="text-[11px] font-medium text-brand-300 tracking-wider uppercase">Decision Platform</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Decision System
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${item.highlight && !isActive ? "border border-brand-500/30 bg-brand-950/40 text-brand-300" : ""}`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : item.highlight ? "text-brand-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.highlight && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/30 text-brand-200">
                  Core
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* College PBL Project Metadata Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-brand-400 font-semibold mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>B.Tech CSE Project</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            AI-based Supply Chain Decision Support System
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Prototype v1.0</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Offline Ready
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

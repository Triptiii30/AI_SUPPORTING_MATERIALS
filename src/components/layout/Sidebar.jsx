import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GitCompare, 
  BrainCircuit, 
  Database, 
  Cpu, 
  ShieldAlert,
  Activity,
  FileText,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useApp();

  const navSections = [
    {
      title: "Supplier Data",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "suppliers", label: "Supplier Directory", icon: Users },
        { id: "compare", label: "Compare Alternatives", icon: GitCompare }
      ]
    },
    {
      title: "AI Decision Engines",
      items: [
        { id: "ai-decision", label: "Integrated Decision Support", icon: BrainCircuit, highlight: true },
        { id: "knowledge-base", label: "Knowledge Base & Logic", icon: Database },
        { id: "expert-system", label: "Expert System (+ CF)", icon: Cpu },
        { id: "supplier-risk", label: "Supplier Risk (Bayes)", icon: ShieldAlert },
        { id: "fuzzy-evaluation", label: "Fuzzy Evaluation", icon: Activity }
      ]
    },
    {
      title: "Procurement Reports",
      items: [
        { id: "reports", label: "Reports & Rankings", icon: FileText }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold shadow-md shadow-white/5">
          <BrainCircuit className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">SupplyChain AI</h1>
          <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider uppercase">PBL Decision DSS</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  } ${item.highlight && !isActive ? "border border-slate-800 bg-slate-900/60 text-slate-200" : ""}`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-300"
                    }`}>
                      Core
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* College PBL Project Metadata Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950">
        <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300 font-bold mb-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>NIET Greater Noida</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
            AI PBL (CCSAI0301) • Module 3 & 4
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Decision Support DSS</span>
            <span className="text-emerald-400 font-medium">● Local Standalone</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

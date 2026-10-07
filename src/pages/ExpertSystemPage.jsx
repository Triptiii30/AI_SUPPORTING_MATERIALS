import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Workflow, 
  Layers, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { EXPERT_RULES, evaluateExpertRules } from '../algorithms/expertSystem';

export default function ExpertSystemPage() {
  const { suppliers, requirements } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const evalResult = selectedSupplier ? evaluateExpertRules(selectedSupplier, requirements) : null;

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Forward Chaining Inference Engine</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Rule-Based Expert System</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            The Expert System evaluates supplier information using predefined knowledge and rules to provide a recommendation.
          </p>
        </div>

        {/* Supplier Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Simulate Supplier:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.product})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inference Pipeline Flow Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-brand-600" />
          Rule Evaluation & Inference Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Stage 1: Input Facts */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Stage 1</span>
              <h4 className="text-xs font-extrabold text-slate-800 mb-2">Input Working Memory Facts</h4>
              <div className="space-y-1 font-mono text-[11px] text-slate-600">
                <div>Quality = {evalResult?.facts.quality}%</div>
                <div>Reliability = {evalResult?.facts.reliability}%</div>
                <div>Lead Time = {evalResult?.facts.delivery}d</div>
                <div>Cost = ₹{evalResult?.facts.cost.toLocaleString()}</div>
                <div>Capacity = {evalResult?.facts.capacity}u</div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
              Extracted from registry
            </div>
          </div>

          {/* Stage 2: Rule Evaluation */}
          <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block mb-1">Stage 2</span>
              <h4 className="text-xs font-extrabold text-brand-900 mb-2">Pattern Matching</h4>
              <p className="text-[11px] text-brand-800 leading-relaxed">
                Rete / Forward chaining scans production rules against verified supplier facts.
              </p>
              <div className="mt-3">
                <span className="text-lg font-black text-brand-700">{evalResult?.firedCount} / {evalResult?.totalRulesEvaluated}</span>
                <span className="text-[11px] text-brand-700 block font-medium">Rules Satisfied</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-brand-200 text-[10px] text-brand-600">
              Conditions verified
            </div>
          </div>

          {/* Stage 3: Inference */}
          <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block mb-1">Stage 3</span>
              <h4 className="text-xs font-extrabold text-violet-900 mb-2">Conflict Resolution & Inference</h4>
              <p className="text-[11px] text-violet-800 leading-relaxed">
                Synthesizes fired consequences into synthesized operational status assertions.
              </p>
              <div className="mt-2 text-xs font-bold text-violet-900">
                Status: <span className="text-violet-700">{evalResult?.status}</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-violet-200 text-[10px] text-violet-600">
              Classification assigned
            </div>
          </div>

          {/* Stage 4: Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Stage 4</span>
              <h4 className="text-xs font-extrabold text-emerald-900 mb-2">Final Recommendation</h4>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                {evalResult?.grade} ({evalResult?.status})
              </span>
              <p className="text-[11px] text-emerald-800 mt-2 leading-relaxed">
                Vendor endorsed for procurement consideration under audited parameters.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200 text-[10px] text-emerald-600">
              Decision outcome
            </div>
          </div>
        </div>
      </div>

      {/* Production Rules Inspection Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Production Rule Base & Activation Status</h3>
            <p className="text-xs text-slate-500">Live evaluation against selected supplier: {selectedSupplier?.name}</p>
          </div>
          <Badge variant="brand">{EXPERT_RULES.length} Predefined Knowledge Rules</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPERT_RULES.map((rule) => {
            const isFired = evalResult?.firedRules.some(r => r.id === rule.id);

            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFired
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{rule.id}</span>
                    <h4 className="text-xs font-bold text-slate-800">{rule.name}</h4>
                  </div>
                  {isFired ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>FIRED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold">
                      <XCircle className="w-3 h-3 text-slate-400" />
                      <span>DORMANT</span>
                    </span>
                  )}
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1">
                  <div className="text-brand-300 font-semibold">{rule.conditionText}</div>
                  <div className="text-emerald-300 font-semibold">{rule.actionText}</div>
                </div>

                <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Explanation:</span> {rule.consequence}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

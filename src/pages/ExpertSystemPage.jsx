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
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  Sliders,
  HelpCircle,
  ShieldAlert,
  FileCheck2,
  Trash2
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { 
  DEFAULT_PRODUCTION_RULES, 
  extractWorkingMemory, 
  runForwardChainingInference 
} from '../algorithms/expertSystem';

export default function ExpertSystemPage() {
  const { suppliers, requirements } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  // Configurable Rule Base State (Knowledge Acquisition)
  const [activeRules, setActiveRules] = useState(DEFAULT_PRODUCTION_RULES);
  const [showAddRuleForm, setShowAddRuleForm] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleCategory, setNewRuleCategory] = useState("Recommendation");
  const [newRulePriority, setNewRulePriority] = useState(35);
  const [newRuleConditionText, setNewRuleConditionText] = useState("IF quality >= 80 AND cost <= maxBudget");
  const [newRuleActionText, setNewRuleActionText] = useState("THEN recommendation = 'Cost-Quality Qualified'");

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Extract working memory facts
  const workingMemory = extractWorkingMemory(selectedSupplier, requirements);

  // Run forward chaining inference over active rules
  const evalResult = runForwardChainingInference(workingMemory, activeRules);

  const handleToggleRule = (ruleId) => {
    setActiveRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleResetRules = () => {
    setActiveRules(DEFAULT_PRODUCTION_RULES);
  };

  const handleAddCustomRule = (e) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const id = `RULE-CUSTOM-${Date.now().toString().slice(-4)}`;
    const newRule = {
      id,
      name: newRuleName.trim(),
      priority: Number(newRulePriority),
      category: newRuleCategory,
      conditionText: newRuleConditionText,
      actionText: newRuleActionText,
      consequenceKey: "custom_status",
      consequenceVal: newRuleActionText.split("=")[1]?.replace(/['"]/g, '').trim() || "Qualified",
      evaluate: (facts) => {
        // Safe evaluation of standard attributes
        return facts.quality >= 80 && facts.cost <= facts.maxBudget;
      },
      rationale: "Custom user-defined production rule added via Knowledge Acquisition interface."
    };

    setActiveRules(prev => [newRule, ...prev]);
    setShowAddRuleForm(false);
    setNewRuleName("");
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5 text-slate-600" />
            <span>Modular Rule-Based Expert System</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Expert System for Supplier Evaluation</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Complete Expert System Architecture: Knowledge Base (Working Memory), Rule Base, Forward Chaining Inference Engine, Explanation Facility, and Knowledge Acquisition
          </p>
        </div>

        {/* Supplier Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Simulate Supplier:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.product})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modular Expert System Architecture Schematic */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-slate-800" />
          Expert System Architectural Pipeline (Forward Chaining Execution Trace)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Stage 1: Input Working Memory Facts */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Component 1</span>
              <h4 className="text-xs font-extrabold text-slate-800 mb-2">Working Memory (Facts)</h4>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>Quality = {workingMemory.quality}%</div>
                <div>Reliability = {workingMemory.reliability}%</div>
                <div>Lead Time = {workingMemory.deliveryTime}d</div>
                <div>Cost = ₹{workingMemory.cost.toLocaleString()}</div>
                <div>Capacity = {workingMemory.capacity}u</div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
              Extracted from {selectedSupplier.name}
            </div>
          </div>

          {/* Stage 2: Pattern Match / Inference */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Component 2 & 3</span>
              <h4 className="text-xs font-extrabold text-slate-900 mb-2">Inference Engine (Forward Chaining)</h4>
              <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                Evaluates production rules against working memory with priority conflict resolution.
              </p>
              <div className="mt-2 font-mono">
                <span className="text-lg font-black text-slate-900">{evalResult.firedCount} / {evalResult.totalRulesEvaluated}</span>
                <span className="text-[11px] text-slate-700 block font-medium">Rules Triggered</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-300 text-[10px] text-slate-600">
              Conflict Strategy: Priority Descending
            </div>
          </div>

          {/* Stage 3: Deduced Operational States */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Component 4</span>
              <h4 className="text-xs font-extrabold text-slate-800 mb-2">Deduced Assertions</h4>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-700">
                {evalResult.facts.status_quality_reliability && (
                  <div>• QR Status: <span className="font-bold">{evalResult.facts.status_quality_reliability}</span></div>
                )}
                {evalResult.facts.status_delivery && (
                  <div>• Delivery: <span className="font-bold">{evalResult.facts.status_delivery}</span></div>
                )}
                {evalResult.facts.status_budget_capacity && (
                  <div>• Feasibility: <span className="font-bold">{evalResult.facts.status_budget_capacity}</span></div>
                )}
                {evalResult.facts.risk_flag && (
                  <div className="text-rose-600 font-bold">• Risk: {evalResult.facts.risk_flag}</div>
                )}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
              Working Memory Updated
            </div>
          </div>

          {/* Stage 4: Recommendation Conclusion */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Component 5</span>
              <h4 className="text-xs font-extrabold text-white mb-2">Final Recommendation</h4>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-white text-slate-900 font-extrabold text-xs">
                {evalResult.recommendation}
              </span>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Audited against active production rules.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Derived Conclusion
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Facility Panel (Deep Introspection: WHY and HOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WHY Panel (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Explanation Facility: WHY Conclusion Reached</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-sans">
            {evalResult.explanation.whyExplanation}
          </p>

          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Rejection & Disqualification Diagnostics:</span>
            {evalResult.explanation.rejectionReasons.map((reason, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono text-slate-700 flex items-start space-x-2">
                <span className="font-bold text-slate-500">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HOW Trace Panel (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Workflow className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Explanation Facility: HOW (Inference Derivation Trace)</h3>
          </div>
          <p className="text-xs text-slate-500">Step-by-step firing sequence of production rules during forward chaining:</p>

          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {evalResult.executionTrace.map((trace, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span>Cycle {trace.cycle}: [{trace.ruleId}] {trace.ruleName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Priority {trace.priority}</span>
                </div>
                <div className="text-[11px] text-slate-600">{trace.condition}</div>
                <div className="text-[11px] font-bold text-slate-900">Derived: {trace.consequence}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rule Base Management (Knowledge Acquisition) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Knowledge Acquisition & Rule Base Management</h3>
            <p className="text-xs text-slate-500">Inspect, toggle, or append production rules to the Expert System knowledge base</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddRuleForm(!showAddRuleForm)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddRuleForm ? "Close Form" : "Add Production Rule"}</span>
            </button>
            <button
              onClick={handleResetRules}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Add Rule Form Modal/Dropdown */}
        {showAddRuleForm && (
          <form onSubmit={handleAddCustomRule} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Knowledge Acquisition: Add New IF-THEN Rule</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Bulk Capacity Incentive"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Priority (1 - 100)</label>
                <input
                  type="number"
                  value={newRulePriority}
                  onChange={(e) => setNewRulePriority(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Condition Expression (IF)</label>
                <input
                  type="text"
                  value={newRuleConditionText}
                  onChange={(e) => setNewRuleConditionText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Action Consequence (THEN)</label>
                <input
                  type="text"
                  value={newRuleActionText}
                  onChange={(e) => setNewRuleActionText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs"
            >
              Insert Rule into Production Base
            </button>
          </form>
        )}

        {/* Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Rule ID</th>
                <th className="py-2.5 px-3">Name & Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Production Condition & Action</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {activeRules.map((rule) => {
                const isFired = evalResult.firedRules.some(r => r.id === rule.id);
                return (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{rule.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-bold text-slate-900">{rule.name}</div>
                      <div className="text-[10px] text-slate-500">{rule.category}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{rule.priority}</td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-semibold">{rule.conditionText}</div>
                      <div className="text-slate-600">{rule.actionText}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isFired ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                      }`}>
                        {isFired ? "FIRED" : "DORMANT"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

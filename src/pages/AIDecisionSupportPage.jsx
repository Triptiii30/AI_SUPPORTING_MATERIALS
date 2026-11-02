import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Sliders, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Cpu, 
  BrainCircuit, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  BarChart2, 
  FileCheck2, 
  Scale, 
  Activity, 
  ShieldAlert,
  Database,
  ArrowDown
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { filterSuppliersByConstraints, scoreSuppliers } from '../algorithms/scoringEngine';
import { runFullIntegratedSupplierAnalysis } from '../algorithms/integratedDecisionEngine';

export default function AIDecisionSupportPage() {
  const { 
    suppliers, 
    requirements, 
    setRequirements, 
    weights, 
    setWeights, 
    availableProducts, 
    setInspectSupplier, 
    notify 
  } = useApp();

  const [hasGenerated, setHasGenerated] = useState(true);
  const [overrideSupplierId, setOverrideSupplierId] = useState("");

  // Step 1: Constraint Filtering
  const filterResults = filterSuppliersByConstraints(suppliers, requirements);
  const eligibleSuppliers = filterResults.filter(f => f.isEligible).map(f => f.supplier);

  // Step 2: Scoring Engine
  const scoredEligible = scoreSuppliers(eligibleSuppliers, weights, requirements);
  const topMatch = scoredEligible[0] || null;

  // Determine supplier to analyze: override selection or top scored match
  const analyzedSupplier = overrideSupplierId 
    ? (suppliers.find(s => s.id === overrideSupplierId) || topMatch?.supplier)
    : topMatch?.supplier;

  // Step 3: Run Full Unified Supplier Decision Analysis
  const integratedAnalysis = analyzedSupplier ? runFullIntegratedSupplierAnalysis(analyzedSupplier, {
    suppliers,
    products: availableProducts,
    requirements
  }) : null;

  const handleGenerate = () => {
    setHasGenerated(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    notify("AI Procurement Engine synthesized multi-criteria recommendation across all paradigms.");
  };

  const handleWeightChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: Number(val) }));
  };

  const totalWeight = weights.quality + weights.reliability + weights.cost + weights.delivery + weights.capacity;

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-slate-700" />
            <span>Integrated Supplier Decision Support Workflow</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Supplier Decision Support Dashboard</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Unified Decision Pipeline: Knowledge Base → Propositional Logic → Expert System Rules (+ Certainty Factors) → Fuzzy Suitability Evaluation → Bayesian Risk Estimation → Procurement Recommendation
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-300" />
            <span>Run Decision Support Synthesis</span>
          </button>
        </div>
      </div>

      {/* Decision Workflow Visual Ribbon */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 text-xs font-mono">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
          Procurement Reasoning Pipeline (Section 7 Architecture):
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">1. Supplier Data</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">2. Knowledge Base (Frames)</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">3. Propositional Eligibility</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">4. Expert Rules (CF)</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">5. Fuzzy Suitability</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">6. Bayesian Risk</span>
          <span className="text-slate-500">→</span>
          <span className="px-2.5 py-1 rounded bg-white text-slate-900 font-bold">7. Decision Synthesis</span>
        </div>
      </div>

      {/* Inputs Grid: Procurement Constraints & MCDM Weight Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Procurement Requirements Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Procurement Hard Constraints</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Strict Qualification Filter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Required Product */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Required Product</label>
              <select
                value={requirements.product}
                onChange={(e) => setRequirements({ ...requirements, product: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {availableProducts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Maximum Budget */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Maximum Budget: <span className="font-mono font-bold text-slate-900">₹{requirements.maxBudget.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step="2000"
                value={requirements.maxBudget}
                onChange={(e) => setRequirements({ ...requirements, maxBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            {/* Minimum Quality */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Quality: <span className="font-mono font-bold text-slate-900">{requirements.minQuality}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="95"
                value={requirements.minQuality}
                onChange={(e) => setRequirements({ ...requirements, minQuality: Number(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>

            {/* Maximum Delivery Lead Time */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Max Delivery Time: <span className="font-mono font-bold text-slate-900">{requirements.maxDelivery} Days</span>
              </label>
              <input
                type="range"
                min="2"
                max="14"
                value={requirements.maxDelivery}
                onChange={(e) => setRequirements({ ...requirements, maxDelivery: Number(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>

            {/* Minimum Reliability */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Min SLA Reliability: <span className="font-mono font-bold text-slate-900">{requirements.minReliability}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="95"
                value={requirements.minReliability}
                onChange={(e) => setRequirements({ ...requirements, minReliability: Number(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>

            {/* Required Batch Capacity */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Batch Capacity: <span className="font-mono font-bold text-slate-900">{requirements.requiredCapacity.toLocaleString()} Units</span>
              </label>
              <input
                type="number"
                step="100"
                value={requirements.requiredCapacity}
                onChange={(e) => setRequirements({ ...requirements, requiredCapacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right: MCDM Weights & Priority Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Multi-Criteria Weights</h3>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                totalWeight === 100 ? "bg-slate-100 text-slate-800" : "bg-amber-100 text-amber-800"
              }`}>
                Sum: {totalWeight}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Quality Priority</span>
                  <span className="font-mono font-bold text-slate-900">{weights.quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={weights.quality}
                  onChange={(e) => handleWeightChange('quality', e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Reliability Priority</span>
                  <span className="font-mono font-bold text-slate-900">{weights.reliability}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={weights.reliability}
                  onChange={(e) => handleWeightChange('reliability', e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Cost Priority</span>
                  <span className="font-mono font-bold text-slate-900">{weights.cost}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={weights.cost}
                  onChange={(e) => handleWeightChange('cost', e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Delivery Lead Priority</span>
                  <span className="font-mono font-bold text-slate-900">{weights.delivery}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.delivery}
                  onChange={(e) => handleWeightChange('delivery', e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Capacity Priority</span>
                  <span className="font-mono font-bold text-slate-900">{weights.capacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.capacity}
                  onChange={(e) => handleWeightChange('capacity', e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Normalizes factors dynamically into 100% total</span>
            <button
              onClick={() => setWeights({ quality: 25, reliability: 25, cost: 20, delivery: 15, capacity: 15 })}
              className="text-slate-800 font-semibold hover:underline"
            >
              Reset 25/25/20/15/15
            </button>
          </div>
        </div>
      </div>

      {/* Constraint Filtering Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Constraint Filtering Stage (Hard Gates)</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {eligibleSuppliers.length} of {suppliers.length} candidates qualify for scoring
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Supplier Name</th>
                <th className="py-2.5 px-2">Cost vs Budget</th>
                <th className="py-2.5 px-2">Quality</th>
                <th className="py-2.5 px-2">Lead Time</th>
                <th className="py-2.5 px-2">Reliability</th>
                <th className="py-2.5 px-2">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filterResults.map(({ supplier, isEligible, checks, failedReasons }) => (
                <tr key={supplier.id} className={isEligible ? "bg-white" : "bg-slate-50 text-slate-400"}>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {supplier.name}
                    {!checks.productMatch && (
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ({supplier.product})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.costCheck ? "text-slate-800" : "text-rose-600 font-bold"}>
                      ₹{supplier.cost.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.qualityCheck ? "text-slate-800 font-bold" : "text-rose-600 font-bold"}>
                      {supplier.quality}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.deliveryCheck ? "text-slate-800" : "text-rose-600 font-bold"}>
                      {supplier.deliveryTime}d
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.reliabilityCheck ? "text-slate-800 font-bold" : "text-rose-600 font-bold"}>
                      {supplier.reliability}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.capacityCheck ? "text-slate-800" : "text-rose-600 font-bold"}>
                      {supplier.capacity}u
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {isEligible ? (
                      <span className="inline-flex items-center text-emerald-800 font-bold gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-600 font-semibold gap-1 text-[11px]" title={failedReasons.join("; ")}>
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Filtered Out
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CENTRAL MULTI-PARADIGM DECISION SUPPORT RESULTS */}
      {analyzedSupplier && integratedAnalysis && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
          {/* Header & Winner Presentation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold shadow-md shrink-0">
                <Award className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Primary Decision Candidate Under Audit
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {analyzedSupplier.name}
                </h3>
                <p className="text-xs text-slate-300">
                  Product: {analyzedSupplier.product} • Base: {analyzedSupplier.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Supplier switcher dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Analyze Alternate:</span>
                <select
                  value={overrideSupplierId || analyzedSupplier.id}
                  onChange={(e) => setOverrideSupplierId(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {topMatch && topMatch.supplier.id === analyzedSupplier.id && (
                <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">MCDM Linear Score</span>
                  <span className="text-2xl font-black text-white leading-none">
                    {topMatch.finalScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Core Reasoning Paradigms Individual Output Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Propositional Logic Eligibility */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  1. Propositional Logic
                </span>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {integratedAnalysis.isEligible ? "ELIGIBLE VENDOR" : "INELIGIBLE"}
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Formula: P ∧ Q ∧ R evaluated against verified supplier performance thresholds.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/80 font-mono text-[10px] text-slate-400">
                Truth Values: P={String(integratedAnalysis.propositional.propEval.values.P)}, Q={String(integratedAnalysis.propositional.propEval.values.Q)}, R={String(integratedAnalysis.propositional.propEval.values.R)}
              </div>
            </div>

            {/* 2. Rule-Based Expert System (+ CF) */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  2. Expert System (+ CF)
                </span>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {integratedAnalysis.expertSystem.recommendation}
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Confidence: Certainty Factor CF = {integratedAnalysis.expertSystem.confidenceCF >= 0 ? `+${integratedAnalysis.expertSystem.confidenceCF.toFixed(2)}` : integratedAnalysis.expertSystem.confidenceCF.toFixed(2)} ({integratedAnalysis.expertSystem.confidencePercentage}%)
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/80 font-mono text-[10px] text-slate-400">
                {integratedAnalysis.expertSystem.firedCount} Rules Fired via Forward Chaining
              </div>
            </div>

            {/* 3. Mamdani Fuzzy Logic */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  3. Fuzzy Logic (Mamdani)
                </span>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">
                  Suitability: {integratedAnalysis.fuzzyLogic.suitabilityScore} / 100
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Linguistic Class: {integratedAnalysis.fuzzyLogic.recommendationCategory}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/80 font-mono text-[10px] text-slate-400">
                Centroid Center-of-Gravity Defuzzification
              </div>
            </div>

            {/* 4. Bayes' Theorem Posterior Risk */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  4. Bayes' Theorem Risk
                </span>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">
                  {(integratedAnalysis.bayesTheorem.posteriorAGivenB * 100).toFixed(1)}% Default Risk
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Prior Lapse: {(integratedAnalysis.bayesTheorem.priorA * 100).toFixed(1)}% • P(Delay): {integratedAnalysis.bayesTheorem.marginalEvidenceB.toFixed(3)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/80 font-mono text-[10px] text-slate-400">
                Law of Total Probability Applied
              </div>
            </div>
          </div>

          {/* Theoretical Comparison Table Contrasting Paradigms */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-400" />
                Comparative Analysis of AI Reasoning Paradigms for Procurement
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Distinct Non-Merged Outputs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Reasoning Paradigm</th>
                    <th className="py-2 px-3">Theoretical Basis</th>
                    <th className="py-2 px-3">Output Structure</th>
                    <th className="py-2 px-3">Model Result</th>
                    <th className="py-2 px-3">Mathematical Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px]">
                  {integratedAnalysis.paradigmComparisons.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-white">{p.paradigm}</td>
                      <td className="py-2 px-3 text-slate-400">{p.theoreticalBasis}</td>
                      <td className="py-2 px-3 text-slate-300">{p.outputForm}</td>
                      <td className="py-2 px-3 font-bold text-white">{p.result}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans text-[11px] leading-snug">{p.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

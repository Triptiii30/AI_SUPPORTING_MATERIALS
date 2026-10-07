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
  Scale
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { filterSuppliersByConstraints, scoreSuppliers } from '../algorithms/scoringEngine';
import { evaluateExpertRules } from '../algorithms/expertSystem';
import { evaluateFuzzySupplier } from '../algorithms/fuzzyLogic';
import { calculateBayesTheorem, calculateCertaintyFactor, calculateProbabilityMetrics } from '../algorithms/bayesianReasoning';

export default function AIDecisionSupportPage() {
  const { suppliers, requirements, setRequirements, weights, setWeights, availableProducts, setInspectSupplier, notify } = useApp();

  const [hasGenerated, setHasGenerated] = useState(true);
  const [selectedWinnerTab, setSelectedWinnerTab] = useState("overview");

  // Step 1: Constraint Filtering
  const filterResults = filterSuppliersByConstraints(suppliers, requirements);
  const eligibleSuppliers = filterResults.filter(f => f.isEligible).map(f => f.supplier);
  const eliminatedCount = suppliers.length - eligibleSuppliers.length;

  // Step 2: Scoring Engine
  const scoredEligible = scoreSuppliers(eligibleSuppliers, weights, requirements);
  const topMatch = scoredEligible[0] || null;

  // Step 3: Multi-AI Reasoning for the Top Match
  const expertEvaluation = topMatch ? evaluateExpertRules(topMatch.supplier, requirements) : null;
  const fuzzyEvaluation = topMatch ? evaluateFuzzySupplier(topMatch.supplier) : null;
  const bayesEvaluation = topMatch ? calculateBayesTheorem({
    priorReliable: 0.70,
    likelihoodHQGivenR: topMatch.supplier.reliability >= 90 ? 0.92 : 0.82,
    likelihoodHQGivenNotR: 0.20
  }) : null;
  const cfEvaluation = topMatch ? calculateCertaintyFactor(
    topMatch.supplier.quality / 100,
    topMatch.supplier.reliability / 100
  ) : null;

  const handleGenerate = () => {
    setHasGenerated(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    notify("AI Procurement Engine synthesized multi-criteria recommendation.");
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
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Multi-Model AI Decision Engine</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">AI Procurement Decision Support</h2>
          <p className="text-xs text-slate-500">
            Synthesizes Hard Constraint Filtering, MCDM Normalization, Rule Inference, Fuzzy Logic, and Bayesian Updating
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-sky-200" />
          <span>Generate AI Recommendation</span>
        </button>
      </div>

      {/* Inputs Grid: Procurement Constraints & MCDM Weight Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Procurement Requirements Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-800">1. Procurement Hard Constraints</h3>
            </div>
            <span className="text-xs text-slate-400">Strict filter gate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Required Product */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Required Product</label>
              <select
                value={requirements.product}
                onChange={(e) => setRequirements({ ...requirements, product: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {availableProducts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Maximum Budget */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Maximum Budget: <span className="text-brand-600 font-bold">₹{requirements.maxBudget.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step="2000"
                value={requirements.maxBudget}
                onChange={(e) => setRequirements({ ...requirements, maxBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Minimum Quality */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Quality: <span className="text-emerald-600 font-bold">{requirements.minQuality}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="95"
                value={requirements.minQuality}
                onChange={(e) => setRequirements({ ...requirements, minQuality: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>60%</span>
                <span>Current: {requirements.minQuality}%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Maximum Delivery Lead Time */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Max Delivery Time: <span className="text-violet-600 font-bold">{requirements.maxDelivery} Days</span>
              </label>
              <input
                type="range"
                min="2"
                max="12"
                value={requirements.maxDelivery}
                onChange={(e) => setRequirements({ ...requirements, maxDelivery: Number(e.target.value) })}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 days</span>
                <span>Current: {requirements.maxDelivery}d</span>
                <span>12 days</span>
              </div>
            </div>

            {/* Minimum Reliability */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Reliability: <span className="text-sky-600 font-bold">{requirements.minReliability}%</span>
              </label>
              <input
                type="range"
                min="65"
                max="98"
                value={requirements.minReliability}
                onChange={(e) => setRequirements({ ...requirements, minReliability: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>65%</span>
                <span>Current: {requirements.minReliability}%</span>
                <span>98%</span>
              </div>
            </div>

            {/* Required Capacity */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Required Monthly Capacity: <span className="text-amber-600 font-bold">{requirements.requiredCapacity} units</span>
              </label>
              <input
                type="number"
                step="50"
                value={requirements.requiredCapacity}
                onChange={(e) => setRequirements({ ...requirements, requiredCapacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Filter Status: <strong>{eligibleSuppliers.length}</strong> passed, <strong>{eliminatedCount}</strong> filtered out</span>
            <span className="text-brand-600 font-semibold cursor-pointer hover:underline" onClick={() => {
              setRequirements({
                product: "Industrial Steel",
                maxBudget: 60000,
                minQuality: 85,
                maxDelivery: 7,
                minReliability: 85,
                requiredCapacity: 900
              });
            }}>Reset Standard Constraints</span>
          </div>
        </div>

        {/* Right: MCDM Weights Configuration Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-800">2. Configurable Decision Weights</h3>
            </div>
            <span className={`text-xs font-bold ${totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
              Total: {totalWeight}%
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600">Quality Priority</span>
                <span className="text-emerald-700 font-bold">{weights.quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.quality}
                onChange={(e) => handleWeightChange('quality', e.target.value)}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Reliability Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600">Reliability Priority</span>
                <span className="text-sky-700 font-bold">{weights.reliability}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.reliability}
                onChange={(e) => handleWeightChange('reliability', e.target.value)}
                className="w-full accent-sky-600"
              />
            </div>

            {/* Cost Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600">Cost Priority</span>
                <span className="text-amber-700 font-bold">{weights.cost}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={weights.cost}
                onChange={(e) => handleWeightChange('cost', e.target.value)}
                className="w-full accent-amber-600"
              />
            </div>

            {/* Delivery Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600">Delivery Lead Priority</span>
                <span className="text-violet-700 font-bold">{weights.delivery}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weights.delivery}
                onChange={(e) => handleWeightChange('delivery', e.target.value)}
                className="w-full accent-violet-600"
              />
            </div>

            {/* Capacity Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600">Capacity Priority</span>
                <span className="text-teal-700 font-bold">{weights.capacity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weights.capacity}
                onChange={(e) => handleWeightChange('capacity', e.target.value)}
                className="w-full accent-teal-600"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Normalizes factors dynamically into 100% total</span>
            <button
              onClick={() => setWeights({ quality: 25, reliability: 25, cost: 20, delivery: 15, capacity: 15 })}
              className="text-brand-600 font-semibold hover:underline"
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
            <FileCheck2 className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-800">3. Constraint Filtering Stage (Hard Gates)</h3>
          </div>
          <span className="text-xs text-slate-500">
            {eligibleSuppliers.length} of {suppliers.length} candidates qualify for scoring
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-2">Cost vs Budget</th>
                <th className="py-2.5 px-2">Quality</th>
                <th className="py-2.5 px-2">Lead Time</th>
                <th className="py-2.5 px-2">Reliability</th>
                <th className="py-2.5 px-2">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filterResults.map(({ supplier, isEligible, checks, failedReasons }) => (
                <tr key={supplier.id} className={isEligible ? "bg-white" : "bg-rose-50/20 text-slate-400"}>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {supplier.name}
                    {!checks.productMatch && (
                      <span className="block text-[10px] text-rose-500 font-normal">
                        ({supplier.product})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.costCheck ? "text-slate-700" : "text-rose-600 font-bold"}>
                      ₹{supplier.cost.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.qualityCheck ? "text-emerald-700" : "text-rose-600 font-bold"}>
                      {supplier.quality}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.deliveryCheck ? "text-slate-700" : "text-rose-600 font-bold"}>
                      {supplier.deliveryTime}d
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.reliabilityCheck ? "text-sky-700" : "text-rose-600 font-bold"}>
                      {supplier.reliability}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-medium">
                    <span className={checks.capacityCheck ? "text-slate-700" : "text-rose-600 font-bold"}>
                      {supplier.capacity}u
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {isEligible ? (
                      <span className="inline-flex items-center text-emerald-700 font-bold gap-1 text-[11px]">
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

      {/* FINAL AI RECOMMENDATION DASHBOARD */}
      {topMatch ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 rounded-2xl p-6 text-white shadow-xl border border-slate-700 space-y-6">
          {/* Main Title & Champion Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                  AI Procurement Recommendation
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {topMatch.supplier.name}
                </h3>
                <p className="text-xs text-slate-300">
                  Product: {topMatch.supplier.product} • Logistics Base: {topMatch.supplier.location}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Decision Score</span>
                <span className="text-3xl font-black text-emerald-400 leading-none">
                  {topMatch.finalScore}%
                </span>
              </div>
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-1 font-bold uppercase">
                {expertEvaluation?.status || "Highly Recommended"}
              </Badge>
            </div>
          </div>

          {/* Transparent Score Calculation Breakdown (Section 9 Requirement) */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-brand-400" />
                Transparent Decision Score Calculation Breakdown
              </h4>
              <span className="text-[11px] font-mono text-emerald-400">
                Formula: ∑ (Normalized Attribute × Weight) = {topMatch.finalScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Quality ({weights.quality}%)</span>
                <span className="text-sm font-bold text-emerald-400">+{topMatch.contributions.quality} pts</span>
                <span className="text-[10px] text-slate-500 block">Rating: {topMatch.supplier.quality}%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Reliability ({weights.reliability}%)</span>
                <span className="text-sm font-bold text-sky-400">+{topMatch.contributions.reliability} pts</span>
                <span className="text-[10px] text-slate-500 block">Rating: {topMatch.supplier.reliability}%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Cost ({weights.cost}%)</span>
                <span className="text-sm font-bold text-amber-400">+{topMatch.contributions.cost} pts</span>
                <span className="text-[10px] text-slate-500 block">Quote: ₹{topMatch.supplier.cost.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Delivery ({weights.delivery}%)</span>
                <span className="text-sm font-bold text-violet-400">+{topMatch.contributions.delivery} pts</span>
                <span className="text-[10px] text-slate-500 block">Lead: {topMatch.supplier.deliveryTime} days</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Capacity ({weights.capacity}%)</span>
                <span className="text-sm font-bold text-teal-400">+{topMatch.contributions.capacity} pts</span>
                <span className="text-[10px] text-slate-500 block">Vol: {topMatch.supplier.capacity} units</span>
              </div>
            </div>
          </div>

          {/* Explainable AI Narrative (Section 24 Requirement) */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Explainable AI (XAI) Selection Rationale
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-white">{topMatch.supplier.name}</strong> was selected as the optimal vendor because it satisfies all mandatory constraints (within budget limit of ₹{requirements.maxBudget.toLocaleString()}, achieves ≥{requirements.minQuality}% quality, and delivers in ≤{requirements.maxDelivery} days) and achieved the highest weighted composite score of <strong className="text-emerald-400">{topMatch.finalScore}%</strong> among eligible suppliers. It showed exceptional performance in Quality ({topMatch.supplier.quality}%) and Reliability ({topMatch.supplier.reliability}%), which together formed {weights.quality + weights.reliability}% of your decision priority.
            </p>
          </div>

          {/* AI Multi-Model Reasoning Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Expert System</span>
              <span className="text-sm font-bold text-emerald-400">{expertEvaluation?.status || "Suitable"}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{expertEvaluation?.firedCount} rules triggered</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuzzy Evaluation</span>
              <span className="text-sm font-bold text-brand-300">{fuzzyEvaluation?.linguisticVerdict || "High"}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Defuzzified: {fuzzyEvaluation?.defuzzifiedScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bayesian Confidence</span>
              <span className="text-sm font-bold text-sky-400">{bayesEvaluation ? `${(bayesEvaluation.posterior * 100).toFixed(1)}%` : "89.2%"}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">P(Reliable | High Quality)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Certainty Factor</span>
              <span className="text-sm font-bold text-violet-400">{cfEvaluation ? `+${cfEvaluation.combinedCF}` : "+0.87"}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Combined Confidence: {cfEvaluation?.confidencePercentage}%</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setInspectSupplier(topMatch.supplier)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              Inspect Complete Supplier Dossier
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800">
          <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h4 className="font-bold text-sm">No Eligible Suppliers Found</h4>
          <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">
            All registered suppliers failed one or more hard constraints. Please relax the minimum quality, increase the budget, or adjust lead times.
          </p>
        </div>
      )}
    </div>
  );
}

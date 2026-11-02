import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Sliders, 
  CheckCircle, 
  Activity, 
  Layers, 
  TrendingUp, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { 
  generateMembershipCurves, 
  evaluateFuzzySupplier, 
  FUZZY_RULES,
  getCostMembership,
  getQualityMembership,
  getDeliveryMembership,
  getReliabilityMembership
} from '../algorithms/fuzzyLogic';

export default function FuzzyEvaluationPage() {
  const { suppliers } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  const fuzzyCurves = generateMembershipCurves();
  const fuzzyEvaluation = evaluateFuzzySupplier(selectedSupplier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-slate-700" />
            <span>Soft Computing • Mamdani Fuzzy Inference System</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fuzzy Logic Supplier Evaluation</h2>
          <p className="text-xs text-slate-500">
            Translates qualitative linguistic expressions into continuous membership grades and crisp suitability ratings via Centroid Defuzzification
          </p>
        </div>

        {/* Supplier Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Simulate Supplier:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.product})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Centroid Defuzzification Crisp Result Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Mamdani Center-of-Gravity (COG) Defuzzification Result
          </span>
          <h3 className="text-3xl font-black text-white tracking-tight">
            Suitability Score: <span className="font-mono text-white">{fuzzyEvaluation.suitabilityScore} / 100</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Synthesized Linguistic Grade: <span className="font-bold text-white uppercase">{fuzzyEvaluation.recommendationCategory}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Cost (₹{selectedSupplier.cost.toLocaleString()})</span>
            <span className="font-bold">
              Low: {fuzzyEvaluation.fuzzifiedInputs.cost.low}, Med: {fuzzyEvaluation.fuzzifiedInputs.cost.medium}, High: {fuzzyEvaluation.fuzzifiedInputs.cost.high}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Quality ({selectedSupplier.quality}%)</span>
            <span className="font-bold">
              Avg: {fuzzyEvaluation.fuzzifiedInputs.quality.average}, Good: {fuzzyEvaluation.fuzzifiedInputs.quality.good}, Exc: {fuzzyEvaluation.fuzzifiedInputs.quality.excellent}
            </span>
          </div>
        </div>
      </div>

      {/* Membership Function Curves Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Membership Functions Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quality Membership Functions (0 - 100%)</h4>
            <span className="text-xs font-mono text-slate-500">μ_Quality(q)</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuzzyCurves.qualityCurves}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Poor" stroke="#94a3b8" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Average" stroke="#64748b" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Good" stroke="#334155" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Excellent" stroke="#0f172a" dot={false} strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Lead Time Membership Functions Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Delivery Time Membership Functions (Days)</h4>
            <span className="text-xs font-mono text-slate-500">μ_Delivery(d)</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuzzyCurves.deliveryCurves}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Fast" stroke="#0f172a" dot={false} strokeWidth={2.5} />
                <Line type="monotone" dataKey="Moderate" stroke="#64748b" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Slow" stroke="#94a3b8" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Fuzzy Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mamdani Rule Base & Rule Firing Strengths</h3>
            <p className="text-xs text-slate-500">Evaluates minimum antecedent membership $\alpha = \min(\mu_A)$ for each production rule</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{FUZZY_RULES.length} Production Rules</span>
        </div>

        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Rule ID</th>
                <th className="py-2.5 px-3">Linguistic Antecedent (IF)</th>
                <th className="py-2.5 px-3">Consequent Output (THEN)</th>
                <th className="py-2.5 px-3">Firing Strength (α)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {fuzzyEvaluation.ruleActivations.map((rule) => (
                <tr key={rule.id} className={rule.isFired ? "bg-slate-50 font-bold" : "text-slate-400"}>
                  <td className="py-2.5 px-3">{rule.id}</td>
                  <td className="py-2.5 px-3">{rule.antecedentText}</td>
                  <td className="py-2.5 px-3 text-slate-900">{rule.consequentText}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      rule.isFired ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      α = {rule.strength}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


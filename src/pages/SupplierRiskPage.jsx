import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Info, 
  CheckCircle, 
  Sliders, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck2,
  Scale
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { 
  calculateProbabilityMetrics, 
  computeBayesTheorem,
  evaluateSupplierBayesRisk
} from '../algorithms/bayesTheorem';

export default function SupplierRiskPage() {
  const { suppliers } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Derive historical metrics from supplier
  const probMetrics = calculateProbabilityMetrics(selectedSupplier);

  // Default prior derived from supplier historical failure rate
  const historicalLapseRate = Math.max(0.05, Number(((selectedSupplier.historicalAudits - selectedSupplier.successfulDeliveries) / selectedSupplier.historicalAudits).toFixed(2)));

  const [priorA, setPriorA] = useState(historicalLapseRate);
  const [likelihoodBGivenA, setLikelihoodBGivenA] = useState(0.85);
  const [likelihoodBGivenNotA, setLikelihoodBGivenNotA] = useState(0.15);

  // Sync when supplier changes
  React.useEffect(() => {
    const audits = selectedSupplier.historicalAudits || 40;
    const successes = selectedSupplier.successfulDeliveries || Math.round(audits * (selectedSupplier.reliability / 100));
    const lapses = Math.max(1, audits - successes);
    const newPrior = Number((lapses / audits).toFixed(2));
    setPriorA(newPrior);
  }, [selectedSupplierId]);

  const bayesResult = computeBayesTheorem({
    priorA,
    likelihoodBGivenA,
    likelihoodBGivenNotA
  });

  const supplierRiskSummary = evaluateSupplierBayesRisk(selectedSupplier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
            <span>Probabilistic Risk Analysis • Bayes' Theorem</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supplier Operational Risk Estimation</h2>
          <p className="text-xs text-slate-500">
            Estimates posterior probability of supplier contractual lapse or default given observed delivery disruption signals
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

      {/* Classical Empirical Probability Baseline Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">1. Historical Operational Audit Data</h3>
            <p className="text-xs text-slate-500">Documented empirical records for <span className="font-bold text-slate-800">{selectedSupplier.name}</span></p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            Empirical Baseline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Historical Audits</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {probMetrics.successes} / {probMetrics.totalAudits}
            </span>
            <span className="text-xs text-slate-500">Verified SLA-compliant shipments</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Empirical Compliance Rate</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {probMetrics.percentage}%
            </span>
            <span className="text-xs text-slate-500 font-mono text-[11px]">{probMetrics.formula}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Prior Probability of Lapse P(A)</span>
              <span className="text-2xl font-black text-white mt-1 block font-mono">
                {(priorA * 100).toFixed(1)}%
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Baseline probability before observing current signals</span>
          </div>
        </div>
      </div>

      {/* Bayes' Theorem Parameter Inputs & Step-by-Step Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Bayesian Parameters</h3>
            <span className="text-xs font-mono text-slate-500">P(A|B) Updating</span>
          </div>
          <p className="text-xs text-slate-500">Configure prior and signal likelihoods to calculate posterior operational risk:</p>

          {/* Slider Prior P(A) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Prior Lapse Rate P(A):</span>
              <span className="font-mono font-bold text-slate-900">{(priorA * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.95"
              step="0.01"
              value={priorA}
              onChange={(e) => setPriorA(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <div className="text-[10px] text-slate-500">Probability of default based on supplier track record</div>
          </div>

          {/* Slider Likelihood P(B|A) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">True Signal Likelihood P(B | A):</span>
              <span className="font-mono font-bold text-slate-900">{(likelihoodBGivenA * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.99"
              step="0.01"
              value={likelihoodBGivenA}
              onChange={(e) => setLikelihoodBGivenA(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <div className="text-[10px] text-slate-500">Probability of observing delay given supplier is actually unreliable</div>
          </div>

          {/* Slider Likelihood P(B|¬A) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">False Positive Likelihood P(B | ¬A):</span>
              <span className="font-mono font-bold text-slate-900">{(likelihoodBGivenNotA * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.90"
              step="0.01"
              value={likelihoodBGivenNotA}
              onChange={(e) => setLikelihoodBGivenNotA(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <div className="text-[10px] text-slate-500">Probability of delay due to random transit bottleneck even for a reliable supplier</div>
          </div>

          {/* Mathematical Formula Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Bayes' Theorem Formula:</span>
            <div className="text-sm font-bold text-white">
              P(A | B) = [ P(B | A) × P(A) ] / P(B)
            </div>
            <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-800">
              Marginal Evidence P(B) = {bayesResult.marginalEvidenceB.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Step-by-Step Derivation & Contextual Interpretation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Step-by-Step Analytical Derivation</h3>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-900 text-white rounded">
              Posterior Risk P(A|B) = {bayesResult.posteriorPercentage}%
            </span>
          </div>

          <div className="space-y-2.5">
            {bayesResult.steps.map((st) => (
              <div key={st.step} className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span>Step {st.step}: {st.title}</span>
                </div>
                {st.formula && <div className="text-[11px] font-bold text-slate-700">{st.formula}</div>}
                <div className="text-[11px] text-slate-600 font-sans">{st.description}</div>
              </div>
            ))}
          </div>

          {/* Contextual Actionable Decision Note */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-100 text-xs font-sans text-slate-800 space-y-1">
            <span className="font-bold text-slate-900 block">
              Operational Procurement Decision for {selectedSupplier.name}:
            </span>
            <p className="text-slate-700 leading-relaxed">
              {supplierRiskSummary.contextSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


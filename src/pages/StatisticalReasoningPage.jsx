import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Sparkles, 
  Network, 
  Scale, 
  GitMerge, 
  Info,
  CheckCircle,
  Sliders,
  Layers,
  Activity
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
  calculateProbabilityMetrics, 
  calculateBayesTheorem, 
  calculateCertaintyFactor, 
  calculateDempsterShafer,
  BAYESIAN_NETWORK_NODES 
} from '../algorithms/bayesianReasoning';
import { 
  generateMembershipCurves, 
  evaluateFuzzySupplier 
} from '../algorithms/fuzzyLogic';

export default function StatisticalReasoningPage() {
  const { suppliers } = useApp();
  const [activeTab, setActiveTab] = useState("bayes");
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  // Bayes interactive state
  const [priorReliable, setPriorReliable] = useState(0.70);
  const [likelihoodHQGivenR, setLikelihoodHQGivenR] = useState(0.88);
  const [likelihoodHQGivenNotR, setLikelihoodHQGivenNotR] = useState(0.20);

  // CF interactive state
  const [qualityCF, setQualityCF] = useState(0.90);
  const [reliabilityCF, setReliabilityCF] = useState(0.80);

  // Dempster-Shafer interactive state
  const [dsSource1Suit, setDsSource1Suit] = useState(0.70);
  const [dsSource1NotSuit, setDsSource1NotSuit] = useState(0.10);
  const [dsSource2Suit, setDsSource2Suit] = useState(0.65);
  const [dsSource2NotSuit, setDsSource2NotSuit] = useState(0.15);

  // Selected Bayesian Network Node
  const [selectedBayesNode, setSelectedBayesNode] = useState("Suitability");

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Computations
  const probMetrics = calculateProbabilityMetrics(selectedSupplier);
  const bayesResult = calculateBayesTheorem({
    priorReliable,
    likelihoodHQGivenR,
    likelihoodHQGivenNotR
  });
  const cfResult = calculateCertaintyFactor(qualityCF, reliabilityCF);
  const dsResult = calculateDempsterShafer({
    m1_S: dsSource1Suit,
    m1_notS: dsSource1NotSuit,
    m2_S: dsSource2Suit,
    m2_notS: dsSource2NotSuit
  });
  const fuzzyCurves = generateMembershipCurves();
  const fuzzyEvaluation = evaluateFuzzySupplier(selectedSupplier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Uncertainty & Fuzzy Quantifications</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Statistical Reasoning & Soft Computing</h2>
          <p className="text-xs text-slate-500">
            Bayes' Theorem, Certainty Factors (MYCIN), Bayesian Networks, Dempster-Shafer Theory, and Fuzzy Logic
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("bayes")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "bayes" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bayes & Probability
          </button>
          <button
            onClick={() => setActiveTab("cf")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "cf" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Certainty Factors
          </button>
          <button
            onClick={() => setActiveTab("bayes-net")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "bayes-net" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bayesian Network
          </button>
          <button
            onClick={() => setActiveTab("dempster")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "dempster" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dempster-Shafer
          </button>
          <button
            onClick={() => setActiveTab("fuzzy")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "fuzzy" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fuzzy Logic
          </button>
        </div>
      </div>

      {/* TAB 1: BAYES & PROBABILITY */}
      {activeTab === "bayes" && (
        <div className="space-y-6">
          {/* Classical Probability Demo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800">1. Classical Empirical Probability</h3>
              </div>
              <Badge variant="warning">{probMetrics.label}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Audited Sample Events</span>
                <span className="text-xl font-black text-slate-800 mt-1 block">
                  {probMetrics.successes} / {probMetrics.totalAudits}
                </span>
                <span className="text-xs text-slate-500">Successful SLA compliant deliveries</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">P(Quality Success)</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">
                  {probMetrics.probability} ({probMetrics.percentage}%)
                </span>
                <span className="text-xs text-slate-500 font-mono text-[11px]">{probMetrics.formula}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Evaluation Subject</span>
                <span className="text-sm font-bold text-slate-900">{selectedSupplier.name}</span>
                <span className="text-[11px] text-slate-500">Benchmark for Quality probability validation</span>
              </div>
            </div>
          </div>

          {/* Bayes' Theorem Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">2. Bayes' Theorem Belief Updating</h3>
                <p className="text-xs text-slate-500">
                  Scenario: "What is the probability that a supplier is reliable given that it has high-quality performance?"
                </p>
              </div>
              <Badge variant="brand">P(Reliable | High Quality)</Badge>
            </div>

            {/* Visual Formula Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Bayesian Inverse Probability Formula:</span>
                <span className="text-sm font-bold text-sky-300">
                  P(R | HQ) = [ P(HQ | R) × P(R) ] ÷ P(HQ)
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Posterior Probability</span>
                <span className="text-2xl font-black text-emerald-400">{bayesResult.posteriorPercentage}%</span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Prior P(R)</span>
                <span className="text-base font-extrabold text-slate-800">{bayesResult.prior}</span>
                <span className="text-[10px] text-slate-400 block">Base industry reliability</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Likelihood P(HQ | R)</span>
                <span className="text-base font-extrabold text-slate-800">{bayesResult.likelihood}</span>
                <span className="text-[10px] text-slate-400 block">Quality given reliable</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Evidence P(HQ)</span>
                <span className="text-base font-extrabold text-slate-800">{bayesResult.evidence}</span>
                <span className="text-[10px] text-slate-400 block">Marginal probability</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Posterior P(R | HQ)</span>
                <span className="text-base font-extrabold text-emerald-800">{bayesResult.posterior}</span>
                <span className="text-[10px] text-emerald-600 block">Updated confidence</span>
              </div>
            </div>

            {/* Interactive Sliders to tweak parameters */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-700 block">Interactive Parameter Tuning:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Prior P(Reliable):</span>
                    <span className="font-bold text-slate-800">{priorReliable}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.95"
                    step="0.05"
                    value={priorReliable}
                    onChange={(e) => setPriorReliable(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Likelihood P(HQ | R):</span>
                    <span className="font-bold text-slate-800">{likelihoodHQGivenR}</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.99"
                    step="0.02"
                    value={likelihoodHQGivenR}
                    onChange={(e) => setLikelihoodHQGivenR(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">False Positive P(HQ | ¬R):</span>
                    <span className="font-bold text-slate-800">{likelihoodHQGivenNotR}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.50"
                    step="0.05"
                    value={likelihoodHQGivenNotR}
                    onChange={(e) => setLikelihoodHQGivenNotR(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-100 p-3 rounded-lg leading-relaxed">
              <strong className="text-slate-800">Explanation:</strong> {bayesResult.explanation}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CERTAINTY FACTORS */}
      {activeTab === "cf" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Shortliffe (MYCIN) Certainty Factors Model</h3>
              <p className="text-xs text-slate-500">Heuristic inexact reasoning for rule-based decision support</p>
            </div>
            <Badge variant="purple">CF Range [-1.0, +1.0]</Badge>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
            <span className="text-brand-300 font-bold block">Production Rules with Attributed Certainties:</span>
            <div className="text-slate-300">Rule 1: IF quality is high THEN suitable (CF_rule1 = 0.90)</div>
            <div className="text-slate-300">Rule 2: IF reliability is high THEN suitable (CF_rule2 = 0.85)</div>
            <div className="text-emerald-400 font-bold pt-1">
              Combination Rule: {cfResult.formula}
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Quality Evidence Certainty (CF₁):</span>
                <span className="text-brand-600">{qualityCF}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={qualityCF}
                onChange={(e) => setQualityCF(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Evidence weight: {qualityCF * 0.9} after rule attenuation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Reliability Evidence Certainty (CF₂):</span>
                <span className="text-sky-600">{reliabilityCF}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={reliabilityCF}
                onChange={(e) => setReliabilityCF(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Evidence weight: {reliabilityCF * 0.85} after rule attenuation
              </span>
            </div>
          </div>

          {/* Combined Output Result */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">
                Aggregated Inexact Confidence
              </span>
              <h4 className="text-xl font-extrabold tracking-tight mt-0.5">
                Confidence in Recommendation: {cfResult.confidencePercentage}%
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">{cfResult.interpretation}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-mono">Combined CF Value</span>
              <span className="text-3xl font-black text-emerald-400">+{cfResult.combinedCF}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BAYESIAN NETWORK */}
      {activeTab === "bayes-net" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Bayesian Belief Network (DAG)</h3>
              <p className="text-xs text-slate-500">Directed Acyclic Graph with Conditional Probability Tables (CPT)</p>
            </div>
            <Badge variant="brand">Interactive DAG</Badge>
          </div>

          {/* Network Visual Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto select-none">
              <defs>
                <marker id="net-arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Edges */}
              <line x1="100" y1="50" x2="350" y2="120" stroke="#0284c7" strokeWidth="2" markerEnd="url(#net-arrow)" />
              <line x1="100" y1="120" x2="350" y2="120" stroke="#0284c7" strokeWidth="2" markerEnd="url(#net-arrow)" />
              <line x1="100" y1="190" x2="350" y2="120" stroke="#0284c7" strokeWidth="2" markerEnd="url(#net-arrow)" />

              {/* Quality Node */}
              <g 
                transform="translate(100, 50)" 
                className="cursor-pointer"
                onClick={() => setSelectedBayesNode("Quality")}
              >
                <circle r="36" fill={selectedBayesNode === "Quality" ? "#0284c7" : "#1e293b"} stroke="#38bdf8" strokeWidth="2" />
                <text y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Quality (Q)</text>
                <text y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">[Parent Node]</text>
              </g>

              {/* Reliability Node */}
              <g 
                transform="translate(100, 120)" 
                className="cursor-pointer"
                onClick={() => setSelectedBayesNode("Reliability")}
              >
                <circle r="36" fill={selectedBayesNode === "Reliability" ? "#0284c7" : "#1e293b"} stroke="#38bdf8" strokeWidth="2" />
                <text y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Reliability (R)</text>
                <text y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">[Parent Node]</text>
              </g>

              {/* Delivery Node */}
              <g 
                transform="translate(100, 190)" 
                className="cursor-pointer"
                onClick={() => setSelectedBayesNode("Delivery")}
              >
                <circle r="36" fill={selectedBayesNode === "Delivery" ? "#0284c7" : "#1e293b"} stroke="#38bdf8" strokeWidth="2" />
                <text y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Delivery (D)</text>
                <text y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">[Parent Node]</text>
              </g>

              {/* Target Suitability Node */}
              <g 
                transform="translate(370, 120)" 
                className="cursor-pointer"
                onClick={() => setSelectedBayesNode("Suitability")}
              >
                <circle r="46" fill={selectedBayesNode === "Suitability" ? "#059669" : "#1e293b"} stroke="#34d399" strokeWidth="2.5" />
                <text y="-6" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Suitability (S)</text>
                <text y="8" fill="#a7f3d0" fontSize="8" textAnchor="middle">[Target Child]</text>
              </g>
            </svg>

            {/* Selected Node Details Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white text-xs w-full md:w-72">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-sky-400">Node: {selectedBayesNode}</span>
                <span className="text-[10px] text-slate-400">Click node to inspect</span>
              </div>

              {selectedBayesNode === "Suitability" ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-300">
                    Target node conditionally dependent on Quality, Reliability, and Lead Delivery.
                  </p>
                  <div className="p-2 bg-slate-950 rounded-lg font-mono text-[10px] space-y-1">
                    <div className="text-emerald-400">P(S=High | Q=H, R=Dep, D=Fast) = 0.95</div>
                    <div className="text-sky-400">P(S=High | Q=H, R=Dep, D=Slow) = 0.80</div>
                    <div className="text-amber-400">P(S=High | Q=Std, R=Fluc, D=Slow) = 0.10</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-300">
                    {BAYESIAN_NETWORK_NODES[selectedBayesNode]?.description}
                  </p>
                  <div className="divide-y divide-slate-800 font-mono text-[11px]">
                    {BAYESIAN_NETWORK_NODES[selectedBayesNode]?.cpt?.map((row, i) => (
                      <div key={i} className="py-1 flex justify-between">
                        <span>P({row.state})</span>
                        <span className="font-bold text-brand-400">{row.prob}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEMPSTER-SHAFER */}
      {activeTab === "dempster" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Dempster-Shafer Theory of Evidence Combination</h3>
              <p className="text-xs text-slate-500">
                Frame of Discernment Θ = &#123; Suitable, Unsuitable &#125; combining independent sensory evidence
              </p>
            </div>
            <Badge variant="brand">Epistemic Uncertainty</Badge>
          </div>

          {/* Evidence Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Source 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block">Evidence Source 1: Quality Inspection Lab</span>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Mass for Suitable m₁(S):</span>
                  <span className="font-bold text-emerald-700">{dsSource1Suit}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={dsSource1Suit}
                  onChange={(e) => setDsSource1Suit(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Mass for Unsuitable m₁(¬S):</span>
                  <span className="font-bold text-rose-700">{dsSource1NotSuit}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={dsSource1NotSuit}
                  onChange={(e) => setDsSource1NotSuit(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>

            {/* Source 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block">Evidence Source 2: Financial & Audit Bureau</span>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Mass for Suitable m₂(S):</span>
                  <span className="font-bold text-emerald-700">{dsSource2Suit}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={dsSource2Suit}
                  onChange={(e) => setDsSource2Suit(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Mass for Unsuitable m₂(¬S):</span>
                  <span className="font-bold text-rose-700">{dsSource2NotSuit}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={dsSource2NotSuit}
                  onChange={(e) => setDsSource2NotSuit(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Combined Belief & Plausibility Dashboard */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="font-mono text-emerald-400 font-bold">
                Conflict Metric K = {dsResult.conflictK} | Combined Mass m(Suitable) = {dsResult.combined_m_S}
              </span>
              <span className="text-slate-400 text-[11px]">Dempster's Rule Orthogonal Sum</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Belief Bel(Suitable)</span>
                <span className="text-2xl font-black text-emerald-400">{(dsResult.belief_S * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Strict confirmed support</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Plausibility Pl(Suitable)</span>
                <span className="text-2xl font-black text-sky-400">{(dsResult.plausibility_S * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Maximum plausible extent</span>
              </div>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
              {dsResult.explanation}
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: FUZZY LOGIC */}
      {activeTab === "fuzzy" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Fuzzy Logic Membership & Mamdani Inference</h3>
              <p className="text-xs text-slate-500">
                Transforms crisp continuous variables into fuzzy linguistic sets (Low, Medium, High)
              </p>
            </div>
            <Badge variant="brand">Mamdani Min-Max</Badge>
          </div>

          {/* Quality Membership Curve Chart */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-700">Quality Fuzzy Membership Functions μ(Quality)</h4>
              <span className="text-[11px] text-slate-500">Low [0–50%], Medium [45–85%], High [75–100%]</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fuzzyCurves.qualityPoints} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Low" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Medium" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="High" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supplier Live Fuzzy Output */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">
                Fuzzy Assessment for: <strong className="text-white">{selectedSupplier.name}</strong>
              </span>
              <span className="text-sm font-black text-emerald-400">
                Final: {fuzzyEvaluation.linguisticVerdict} ({fuzzyEvaluation.defuzzifiedScore}%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-sans">Quality ({selectedSupplier.quality}%)</span>
                <span className="text-emerald-400 font-bold block">{fuzzyEvaluation.dominantLabels.quality}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  μ_H={fuzzyEvaluation.qualityMembership.high}, μ_M={fuzzyEvaluation.qualityMembership.medium}
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-sans">Reliability ({selectedSupplier.reliability}%)</span>
                <span className="text-sky-400 font-bold block">{fuzzyEvaluation.dominantLabels.reliability}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  μ_H={fuzzyEvaluation.reliabilityMembership.high}, μ_M={fuzzyEvaluation.reliabilityMembership.medium}
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-sans">Delivery ({selectedSupplier.deliveryTime}d)</span>
                <span className="text-violet-400 font-bold block">{fuzzyEvaluation.dominantLabels.delivery}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  μ_F={fuzzyEvaluation.deliveryMembership.fast}, μ_M={fuzzyEvaluation.deliveryMembership.moderate}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

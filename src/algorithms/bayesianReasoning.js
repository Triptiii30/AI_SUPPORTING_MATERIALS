/**
 * Statistical Reasoning and Soft Computing Unified Facade
 * Integrates:
 * - Bayes' Theorem Calculator
 * - Certainty Factors (MYCIN Model)
 * - Bayesian Belief Networks (Exact Inference)
 * - Dempster-Shafer Theory of Evidence
 */

export * from './bayesTheorem';
export * from './certaintyFactors';
export * from './bayesianNetwork';
export * from './dempsterShafer';

// Backwards-compatible aliases
import { computeBayesTheorem, evaluateSupplierBayesRisk } from './bayesTheorem';
import { combineTwoCFs, evaluateSupplierCertaintyFactors } from './certaintyFactors';
import { BBN_STRUCTURE, BBN_CPTS, inferBayesianNetwork } from './bayesianNetwork';
import { combineTwoEvidenceSources } from './dempsterShafer';

export function calculateProbabilityMetrics(supplier) {
  const totalAudits = supplier.historicalAudits || 50;
  const successes = supplier.successfulDeliveries || Math.round(totalAudits * (supplier.quality / 100));
  const probability = Number((successes / totalAudits).toFixed(3));

  return {
    totalAudits,
    successes,
    probability,
    percentage: Number((probability * 100).toFixed(1)),
    formula: "P(Quality Success) = successful cases / total audit cases",
    label: "Historical Operational Audit Data"
  };
}

export function calculateBayesTheorem(args = {}) {
  const prior = typeof args.priorReliable !== 'undefined' ? args.priorReliable : (args.priorA ?? 0.70);
  const likelihoodHQ = typeof args.likelihoodHQGivenR !== 'undefined' ? args.likelihoodHQGivenR : (args.likelihoodBGivenA ?? 0.88);
  const likelihoodNotHQ = typeof args.likelihoodHQGivenNotR !== 'undefined' ? args.likelihoodHQGivenNotR : (args.likelihoodBGivenNotA ?? 0.20);

  const res = computeBayesTheorem({
    priorA: prior,
    likelihoodBGivenA: likelihoodHQ,
    likelihoodBGivenNotA: likelihoodNotHQ
  });

  return {
    prior: res.priorA,
    likelihood: res.likelihoodBGivenA,
    evidence: res.marginalEvidenceB,
    posterior: res.posteriorAGivenB,
    posteriorPercentage: res.posteriorPercentage,
    explanation: res.interpretation,
    steps: res.steps
  };
}

export function calculateCertaintyFactor(qCF = 0.85, rCF = 0.80) {
  const cf1 = qCF * 0.90;
  const cf2 = rCF * 0.85;
  const comb = combineTwoCFs(cf1, cf2);

  return {
    cf1: Number(cf1.toFixed(3)),
    cf2: Number(cf2.toFixed(3)),
    combinedCF: comb.combined,
    confidencePercentage: Number((comb.combined * 100).toFixed(1)),
    formula: "CF_comb = CF₁ + CF₂ - (CF₁ × CF₂)",
    interpretation: `Combining evidence yields an overall certainty factor of ${comb.combined} (${(comb.combined * 100).toFixed(1)}% certainty).`
  };
}

export const BAYESIAN_NETWORK_NODES = {
  Quality: {
    id: "Quality",
    title: "Product Quality (Q)",
    type: "Intermediate",
    states: ["HighQuality", "Defective"],
    cpt: [
      { state: "HighQuality", prob: 0.78 },
      { state: "Defective", prob: 0.22 }
    ]
  },
  Reliability: {
    id: "Reliability",
    title: "Supplier Reliability (R)",
    type: "Parent",
    states: ["Dependable", "Fluctuating"],
    cpt: [
      { state: "Dependable", prob: 0.70 },
      { state: "Fluctuating", prob: 0.30 }
    ]
  },
  Delivery: {
    id: "Delivery",
    title: "Lead Time Compliance (D)",
    type: "Intermediate",
    states: ["OnTime", "Delayed"],
    cpt: [
      { state: "OnTime", prob: 0.75 },
      { state: "Delayed", prob: 0.25 }
    ]
  },
  Suitability: {
    id: "Suitability",
    title: "Supplier Operational Risk (Risk)",
    type: "Target",
    states: ["LowRisk", "MedRisk", "HighRisk"],
    cptMatrix: [
      { D: "OnTime", Q: "HighQuality", F: "Strong", P_Low: 0.92, P_Med: 0.07, P_High: 0.01 },
      { D: "Delayed", Q: "Defective", F: "Vulnerable", P_Low: 0.01, P_Med: 0.19, P_High: 0.80 }
    ]
  }
};

export function calculateDempsterShafer({
  m1_S = 0.70,
  m1_notS = 0.10,
  m2_S = 0.65,
  m2_notS = 0.15
} = {}) {
  const res = combineTwoEvidenceSources(
    { m_S: m1_S, m_U: m1_notS, m_Theta: Math.max(0, 1 - m1_S - m1_notS) },
    { m_S: m2_S, m_U: m2_notS, m_Theta: Math.max(0, 1 - m2_S - m2_notS) }
  );

  return {
    source1: { name: "Quality Inspection Sensor", m_S: m1_S, m_notS: m1_notS, m_Theta: Number(res.s1.m_Theta) },
    source2: { name: "Financial Audit Bureau", m_S: m2_S, m_notS: m2_notS, m_Theta: Number(res.s2.m_Theta) },
    conflictK: res.conflictK,
    combined_m_S: res.combinedMass.m_S,
    combined_m_notS: res.combinedMass.m_U,
    combined_m_Theta: res.combinedMass.m_Theta,
    belief_S: res.belief_S,
    plausibility_S: res.plausibility_S,
    explanation: `Belief Bel(Suitable) = ${(res.belief_S * 100).toFixed(1)}%, Plausibility Pl(Suitable) = ${(res.plausibility_S * 100).toFixed(1)}%. Uncertainty interval: [${(res.belief_S * 100).toFixed(1)}%, ${(res.plausibility_S * 100).toFixed(1)}%].`
  };
}

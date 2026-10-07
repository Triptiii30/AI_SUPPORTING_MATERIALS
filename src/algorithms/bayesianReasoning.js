/**
 * Statistical Reasoning Engine:
 * Classical Probability, Bayes' Theorem, Certainty Factors (MYCIN),
 * Bayesian Network CPTs, and Dempster-Shafer Evidence Combination.
 */

/**
 * 1. Classical Probability Demonstration
 */
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
    label: "Demo Historical Sample Data"
  };
}

/**
 * 2. Bayes' Theorem Calculator
 * Scenario: P(Reliable | High Quality)
 * Formula: P(R | HQ) = [ P(HQ | R) * P(R) ] / P(HQ)
 */
export function calculateBayesTheorem({
  priorReliable = 0.70,        // P(R): 70% of suppliers in industry are fundamentally reliable
  likelihoodHQGivenR = 0.88,   // P(HQ | R): 88% chance a reliable vendor demonstrates high quality
  likelihoodHQGivenNotR = 0.20 // P(HQ | ¬R): 20% chance an unreliable vendor achieves high quality by luck
}) {
  // P(¬R)
  const priorNotReliable = 1 - priorReliable;

  // Marginal Evidence P(HQ) = P(HQ | R)*P(R) + P(HQ | ¬R)*P(¬R)
  const evidenceHQ = (likelihoodHQGivenR * priorReliable) + (likelihoodHQGivenNotR * priorNotReliable);

  // Posterior P(R | HQ)
  const posterior = (likelihoodHQGivenR * priorReliable) / evidenceHQ;

  return {
    prior: Number(priorReliable.toFixed(3)),
    likelihood: Number(likelihoodHQGivenR.toFixed(3)),
    evidence: Number(evidenceHQ.toFixed(3)),
    posterior: Number(posterior.toFixed(3)),
    posteriorPercentage: Number((posterior * 100).toFixed(1)),
    explanation: `Given that the supplier shows high quality, the updated probability that the supplier is genuinely reliable rises from a prior of ${(priorReliable * 100).toFixed(0)}% to ${(posterior * 100).toFixed(1)}%.`
  };
}

/**
 * 3. Certainty Factors (Shortliffe / MYCIN Model)
 * CF(h, e1 ∧ e2) = min(CF(e1), CF(e2)) * CF(rule)
 * Combined rules: CF_comb(CF1, CF2) = CF1 + CF2 - (CF1 * CF2) [for CF > 0]
 */
export function calculateCertaintyFactor(qualityCF = 0.85, reliabilityCF = 0.80) {
  // Rule 1: IF quality is high THEN suitable (CF_rule1 = 0.90)
  const cf1 = qualityCF * 0.90;

  // Rule 2: IF reliability is high THEN suitable (CF_rule2 = 0.85)
  const cf2 = reliabilityCF * 0.85;

  // Combine independent positive certainty factors:
  const combinedCF = cf1 + cf2 - (cf1 * cf2);

  return {
    cf1: Number(cf1.toFixed(3)),
    cf2: Number(cf2.toFixed(3)),
    combinedCF: Number(combinedCF.toFixed(3)),
    confidencePercentage: Number((combinedCF * 100).toFixed(1)),
    formula: "CF_comb = CF₁ + CF₂ - (CF₁ × CF₂)",
    interpretation: `Combining evidence yields an overall certainty of ${(combinedCF * 100).toFixed(1)}% in vendor suitability.`
  };
}

/**
 * 4. Bayesian Network Definition & Inference
 */
export const BAYESIAN_NETWORK_NODES = {
  Quality: {
    id: "Quality",
    title: "Product Quality (Q)",
    type: "Parent",
    states: ["High (>85%)", "Standard (<=85%)"],
    cpt: [
      { state: "High", prob: 0.65 },
      { state: "Standard", prob: 0.35 }
    ],
    description: "Inherent manufacturing quality and adherence to material tolerances."
  },
  Reliability: {
    id: "Reliability",
    title: "Supplier Reliability (R)",
    type: "Parent",
    states: ["Dependable (>85%)", "Fluctuating (<=85%)"],
    cpt: [
      { state: "Dependable", prob: 0.70 },
      { state: "Fluctuating", prob: 0.30 }
    ],
    description: "Operational stability and contractual SLA compliance rate."
  },
  Delivery: {
    id: "Delivery",
    title: "Lead Time Compliance (D)",
    type: "Parent",
    states: ["On-Time (<=5d)", "Delayed (>5d)"],
    cpt: [
      { state: "On-Time", prob: 0.75 },
      { state: "Delayed", prob: 0.25 }
    ],
    description: "Logistics corridor efficiency and dispatch speed."
  },
  Suitability: {
    id: "Suitability",
    title: "Supplier Suitability (S)",
    type: "Target / Child",
    parents: ["Quality", "Reliability", "Delivery"],
    states: ["Highly Suitable", "Moderate", "Unfavorable"],
    cptMatrix: [
      { Q: "High", R: "Dependable", D: "On-Time", P_High: 0.95, P_Mod: 0.04, P_Unf: 0.01 },
      { Q: "High", R: "Dependable", D: "Delayed", P_High: 0.80, P_Mod: 0.17, P_Unf: 0.03 },
      { Q: "High", R: "Fluctuating", D: "On-Time", P_High: 0.65, P_Mod: 0.28, P_Unf: 0.07 },
      { Q: "Standard", R: "Dependable", D: "On-Time", P_High: 0.60, P_Mod: 0.32, P_Unf: 0.08 },
      { Q: "Standard", R: "Fluctuating", D: "Delayed", P_High: 0.10, P_Mod: 0.35, P_Unf: 0.55 }
    ],
    description: "Global synthetic suitability derived from parent conditional probabilities."
  }
};

/**
 * 5. Dempster-Shafer Theory of Evidence
 * Frame of Discernment Θ = { S (Suitable), ¬S (Unsuitable) }
 * Combines independent mass functions m1 (Quality Inspector) and m2 (Audit Bureau)
 */
export function calculateDempsterShafer({
  m1_S = 0.70,   // Quality evidence belief in Suitability
  m1_notS = 0.10, // Quality evidence belief in Unsuitability
  // m1_Theta = 0.20 (Remaining uncertainty)
  m2_S = 0.65,   // Audit Bureau belief in Suitability
  m2_notS = 0.15  // Audit Bureau belief in Unsuitability
  // m2_Theta = 0.20
}) {
  const m1_Theta = Math.max(0, 1 - m1_S - m1_notS);
  const m2_Theta = Math.max(0, 1 - m2_S - m2_notS);

  // Conflict measure K = sum of conflicting intersections
  // K = m1(S)*m2(¬S) + m1(¬S)*m2(S)
  const conflictK = (m1_S * m2_notS) + (m1_notS * m2_S);
  const denominator = 1 - conflictK;

  // Combined mass for S: m(S) = [m1(S)*m2(S) + m1(S)*m2(Θ) + m1(Θ)*m2(S)] / (1 - K)
  const numS = (m1_S * m2_S) + (m1_S * m2_Theta) + (m1_Theta * m2_S);
  const combined_m_S = denominator > 0 ? numS / denominator : 0;

  // Combined mass for ¬S
  const numNotS = (m1_notS * m2_notS) + (m1_notS * m2_Theta) + (m1_Theta * m2_notS);
  const combined_m_notS = denominator > 0 ? numNotS / denominator : 0;

  // Combined mass for Θ (Uncertainty)
  const combined_m_Theta = denominator > 0 ? (m1_Theta * m2_Theta) / denominator : 0;

  // Belief Bel(S) = m(S)
  const belief_S = combined_m_S;
  // Plausibility Pl(S) = 1 - Bel(¬S) = m(S) + m(Θ)
  const plausibility_S = combined_m_S + combined_m_Theta;

  return {
    source1: { name: "Quality Inspection Sensor", m_S: m1_S, m_notS: m1_notS, m_Theta: Number(m1_Theta.toFixed(2)) },
    source2: { name: "Financial Audit Bureau", m_S: m2_S, m_notS: m2_notS, m_Theta: Number(m2_Theta.toFixed(2)) },
    conflictK: Number(conflictK.toFixed(3)),
    combined_m_S: Number(combined_m_S.toFixed(3)),
    combined_m_notS: Number(combined_m_notS.toFixed(3)),
    combined_m_Theta: Number(combined_m_Theta.toFixed(3)),
    belief_S: Number(belief_S.toFixed(3)),
    plausibility_S: Number(plausibility_S.toFixed(3)),
    explanation: `Belief Bel(Suitable) = ${(belief_S * 100).toFixed(1)}%, Plausibility Pl(Suitable) = ${(plausibility_S * 100).toFixed(1)}%. The interval [${(belief_S * 100).toFixed(1)}%, ${(plausibility_S * 100).toFixed(1)}%] represents the epistemic uncertainty range.`
  };
}

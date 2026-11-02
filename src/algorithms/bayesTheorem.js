/**
 * Bayes' Theorem Calculator and Risk Engine
 * Formula: P(A | B) = [ P(B | A) * P(A) ] / P(B)
 * Marginal Evidence: P(B) = P(B | A) * P(A) + P(B | ¬A) * P(¬A)
 * Applies directly to Supplier Reliability and Operational Risk analysis.
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
    label: "Historical Operational Audit Data"
  };
}

/**
 * Core mathematical calculation of Bayes' Theorem with full validation and step-by-step derivation
 */
export function computeBayesTheorem({
  priorA = 0.20,             // P(A): Prior probability of hypothesis (e.g. Supplier Default / Delay)
  likelihoodBGivenA = 0.85,   // P(B | A): Likelihood of observing evidence B given hypothesis A is true
  likelihoodBGivenNotA = 0.15 // P(B | ¬A): False positive likelihood
}) {
  const errors = [];

  // Validation
  if (priorA < 0 || priorA > 1) errors.push("Prior P(A) must be within [0.0, 1.0].");
  if (likelihoodBGivenA < 0 || likelihoodBGivenA > 1) errors.push("Likelihood P(B | A) must be within [0.0, 1.0].");
  if (likelihoodBGivenNotA < 0 || likelihoodBGivenNotA > 1) errors.push("Likelihood P(B | ¬A) must be within [0.0, 1.0].");

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      posterior: 0,
      steps: []
    };
  }

  const priorNotA = 1 - priorA;

  // Law of Total Probability for marginal evidence P(B)
  const evidenceTerm1 = likelihoodBGivenA * priorA;
  const evidenceTerm2 = likelihoodBGivenNotA * priorNotA;
  const marginalEvidenceB = evidenceTerm1 + evidenceTerm2;

  if (marginalEvidenceB === 0) {
    return {
      isValid: false,
      errors: ["Marginal evidence probability P(B) evaluates to 0. Cannot divide by zero."],
      posterior: 0,
      steps: []
    };
  }

  // Posterior Probability P(A | B)
  const posteriorAGivenB = evidenceTerm1 / marginalEvidenceB;

  const steps = [
    {
      step: 1,
      title: "Identify Hypotheses & Prior Probabilities",
      description: `Hypothesis A (Risk Event): P(A) = ${priorA.toFixed(4)}. Complement ¬A: P(¬A) = 1 - P(A) = ${priorNotA.toFixed(4)}.`
    },
    {
      step: 2,
      title: "Assess Evidence Likelihoods",
      description: `Likelihood of observed evidence given A: P(B | A) = ${likelihoodBGivenA.toFixed(4)}. False alarm rate: P(B | ¬A) = ${likelihoodBGivenNotA.toFixed(4)}.`
    },
    {
      step: 3,
      title: "Calculate Marginal Evidence P(B) via Law of Total Probability",
      formula: "P(B) = P(B | A)·P(A) + P(B | ¬A)·P(¬A)",
      description: `P(B) = (${likelihoodBGivenA.toFixed(4)} × ${priorA.toFixed(4)}) + (${likelihoodBGivenNotA.toFixed(4)} × ${priorNotA.toFixed(4)}) = ${evidenceTerm1.toFixed(4)} + ${evidenceTerm2.toFixed(4)} = ${marginalEvidenceB.toFixed(4)}.`
    },
    {
      step: 4,
      title: "Compute Posterior Probability P(A | B)",
      formula: "P(A | B) = [ P(B | A) × P(A) ] / P(B)",
      description: `P(A | B) = ${evidenceTerm1.toFixed(4)} / ${marginalEvidenceB.toFixed(4)} = ${posteriorAGivenB.toFixed(4)} (${(posteriorAGivenB * 100).toFixed(2)}%).`
    }
  ];

  return {
    isValid: true,
    priorA: Number(priorA.toFixed(4)),
    priorNotA: Number(priorNotA.toFixed(4)),
    likelihoodBGivenA: Number(likelihoodBGivenA.toFixed(4)),
    likelihoodBGivenNotA: Number(likelihoodBGivenNotA.toFixed(4)),
    marginalEvidenceB: Number(marginalEvidenceB.toFixed(4)),
    posteriorAGivenB: Number(posteriorAGivenB.toFixed(4)),
    posteriorPercentage: Number((posteriorAGivenB * 100).toFixed(2)),
    steps,
    interpretation: buildBayesInterpretation(priorA, posteriorAGivenB)
  };
}

function buildBayesInterpretation(prior, posterior) {
  const diff = posterior - prior;
  const direction = diff >= 0 ? "increased" : "decreased";
  const absDiffPercent = Math.abs(diff * 100).toFixed(1);

  return `Upon observing the specified evidence, the updated belief in the hypothesis ${direction} from a baseline prior of ${(prior * 100).toFixed(1)}% to ${(posterior * 100).toFixed(1)}% (a shift of ${absDiffPercent}%).`;
}

/**
 * Apply Bayes' Theorem directly to evaluate a specific supplier's risk of delivery delay / defect
 */
export function evaluateSupplierBayesRisk(supplier) {
  // Derive prior from historical audit performance
  const audits = supplier.historicalAudits || 40;
  const successes = supplier.successfulDeliveries || Math.round(audits * (supplier.reliability / 100));
  const historicalLapses = Math.max(1, audits - successes);

  // Prior probability that this vendor defaults on SLA
  const priorUnreliable = Number((historicalLapses / audits).toFixed(3));

  // Likelihood of observing delivery delay given vendor is unreliable: 85%
  const likelihoodDelayGivenUnreliable = 0.85;

  // Likelihood of observing delivery delay given vendor is reliable (random transit bottleneck): 15%
  const likelihoodDelayGivenReliable = 0.15;

  const result = computeBayesTheorem({
    priorA: priorUnreliable,
    likelihoodBGivenA: likelihoodDelayGivenUnreliable,
    likelihoodBGivenNotA: likelihoodDelayGivenReliable
  });

  return {
    ...result,
    supplierName: supplier.name,
    contextSummary: `Supplier ${supplier.name} has a historical SLA lapse rate of ${(priorUnreliable * 100).toFixed(1)}% based on ${audits} audits. If a delivery delay signal is detected, the posterior probability of genuine unreliability is ${(result.posteriorAGivenB * 100).toFixed(1)}%.`
  };
}


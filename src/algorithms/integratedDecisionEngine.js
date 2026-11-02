/**
 * Integrated Supplier Decision Support Engine
 * Implements the unified procurement evaluation pipeline:
 * Supplier Data
 *   ↓
 * Knowledge Base (Triples & Frames)
 *   ↓
 * Propositional Logic Eligibility
 *   ↓
 * Expert System Rule Evaluation (with Certainty Factors)
 *   ↓
 * Fuzzy Supplier Suitability Evaluation (Mamdani FIS)
 *   ↓
 * Bayesian Risk Estimation (Bayes' Theorem)
 *   ↓
 * Final Decision Support Synthesis
 */

import { evaluateSupplierPropositions, DEFAULT_PROP_RULES, evaluatePropositionalRule } from './propositionalLogic';
import { createSupplierFrame } from './frameSystem';
import { runForwardChainingInference, extractWorkingMemory } from './expertSystem';
import { evaluateSupplierBayesRisk } from './bayesTheorem';
import { evaluateFuzzySupplier } from './fuzzyLogic';

export function runFullIntegratedSupplierAnalysis(supplier, context = {}) {
  if (!supplier) return null;

  const requirements = context.requirements || {
    product: supplier.product,
    maxBudget: 60000,
    minQuality: 85,
    maxDelivery: 7,
    minReliability: 85,
    requiredCapacity: 800
  };

  // Step 1: Knowledge Base Frame Representation
  const frame = createSupplierFrame(supplier);

  // Step 2: Propositional Logic Eligibility Evaluation
  const propEval = evaluateSupplierPropositions(supplier);
  const propRuleResults = DEFAULT_PROP_RULES.map(r => evaluatePropositionalRule(r, propEval.values));
  const isEligibleByPropositionalLogic = propEval.values.P && propEval.values.Q && propEval.values.R;

  // Step 3: Expert System Rule Evaluation (with Certainty Factors)
  const memory = extractWorkingMemory(supplier, requirements);
  const expertResult = runForwardChainingInference(memory);

  // Step 4: Fuzzy Supplier Suitability Evaluation (Mamdani FIS)
  const fuzzyResult = evaluateFuzzySupplier(supplier);

  // Step 5: Bayesian Risk Estimation (Bayes' Theorem)
  const bayesResult = evaluateSupplierBayesRisk(supplier);

  // Step 6: Multi-Paradigm Comparison Matrix
  const paradigmComparisons = [
    {
      paradigm: "Propositional Logic (Eligibility Gate)",
      theoreticalBasis: "Boolean Truth Valuation (P ∧ Q ∧ R)",
      outputForm: "Boolean Feasibility Status",
      result: isEligibleByPropositionalLogic ? "ELIGIBLE (All Benchmarks Satisfied)" : "INELIGIBLE (Violated Conditions)",
      confidence: `${Object.values(propEval.values).filter(Boolean).length} / 5 Propositions True`,
      interpretation: isEligibleByPropositionalLogic
        ? "Supplier satisfies quality, lead-time, and reliability propositional thresholds."
        : "Supplier fails one or more hard propositional eligibility benchmarks."
    },
    {
      paradigm: "Rule-Based Expert System + Certainty Factors",
      theoreticalBasis: "Production Rules, Forward Chaining & MYCIN Calculus",
      outputForm: "Categorical Certification with Confidence Factor",
      result: `${expertResult.recommendation} [CF: ${expertResult.confidenceCF >= 0 ? `+${expertResult.confidenceCF.toFixed(2)}` : expertResult.confidenceCF.toFixed(2)}]`,
      confidence: `${expertResult.firedCount} Rules Fired (${expertResult.confidencePercentage}% Confidence)`,
      interpretation: expertResult.explanation.whyExplanation
    },
    {
      paradigm: "Mamdani Fuzzy Logic (Soft Computing)",
      theoreticalBasis: "Triangular/Trapezoidal Membership & Centroid Defuzzification",
      outputForm: "Continuous Crisp Score (0 - 100)",
      result: `${fuzzyResult.suitabilityScore} / 100 (${fuzzyResult.recommendationCategory})`,
      confidence: `Active Classes: ${Object.entries(fuzzyResult.classMaxStrengths).filter(([_, v]) => v > 0).map(([k, v]) => `${k}=${v}`).join(', ')}`,
      interpretation: fuzzyResult.explanation
    },
    {
      paradigm: "Subjective Probability (Bayes' Theorem Risk)",
      theoreticalBasis: "P(A|B) Updating via Total Probability Law",
      outputForm: "Posterior Probability of Default / Delay",
      result: `${(bayesResult.posteriorAGivenB * 100).toFixed(1)}% Default Risk`,
      confidence: `Prior: ${(bayesResult.priorA * 100).toFixed(1)}% • P(Delay): ${bayesResult.marginalEvidenceB.toFixed(3)}`,
      interpretation: bayesResult.interpretation
    }
  ];

  return {
    supplier,
    frame,
    isEligible: isEligibleByPropositionalLogic,
    propositional: { propEval, propRuleResults },
    expertSystem: expertResult,
    fuzzyLogic: fuzzyResult,
    bayesTheorem: bayesResult,
    paradigmComparisons
  };
}

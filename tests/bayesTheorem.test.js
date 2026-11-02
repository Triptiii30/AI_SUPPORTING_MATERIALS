import { describe, it, expect } from 'vitest';
import {
  computeBayesTheorem,
  evaluateSupplierBayesRisk
} from '../src/algorithms/bayesTheorem';

describe("Bayes' Theorem Risk Engine", () => {
  it('correctly calculates posterior probability P(A|B) using Law of Total Probability', () => {
    // Prior P(A) = 0.20, P(B|A) = 0.80, P(B|¬A) = 0.10
    // Marginal evidence P(B) = (0.80 * 0.20) + (0.10 * 0.80) = 0.16 + 0.08 = 0.24
    // Posterior P(A|B) = 0.16 / 0.24 = 2/3 = 0.6667
    const result = computeBayesTheorem({
      priorA: 0.20,
      likelihoodBGivenA: 0.80,
      likelihoodBGivenNotA: 0.10
    });

    expect(result.isValid).toBe(true);
    expect(result.marginalEvidenceB).toBeCloseTo(0.24, 3);
    expect(result.posteriorAGivenB).toBeCloseTo(0.6667, 3);
    expect(result.steps.length).toBe(4);
  });

  it('handles boundary and edge probabilities correctly', () => {
    // Zero prior -> zero posterior
    const zeroPrior = computeBayesTheorem({
      priorA: 0,
      likelihoodBGivenA: 0.85,
      likelihoodBGivenNotA: 0.20
    });
    expect(zeroPrior.isValid).toBe(true);
    expect(zeroPrior.posteriorAGivenB).toBe(0);

    // Certain prior -> posterior remains 1.0
    const certainPrior = computeBayesTheorem({
      priorA: 1.0,
      likelihoodBGivenA: 0.85,
      likelihoodBGivenNotA: 0.20
    });
    expect(certainPrior.isValid).toBe(true);
    expect(certainPrior.posteriorAGivenB).toBe(1.0);
  });

  it('rejects invalid probability inputs outside [0, 1] or divide by zero', () => {
    const invalidInput = computeBayesTheorem({
      priorA: 1.5,
      likelihoodBGivenA: -0.2,
      likelihoodBGivenNotA: 0.5
    });
    expect(invalidInput.isValid).toBe(false);
    expect(invalidInput.errors.length).toBeGreaterThan(0);

    const zeroEvidence = computeBayesTheorem({
      priorA: 0.5,
      likelihoodBGivenA: 0,
      likelihoodBGivenNotA: 0
    });
    expect(zeroEvidence.isValid).toBe(false);
    expect(zeroEvidence.errors[0]).toContain("divide by zero");
  });

  it('applies Bayes theorem directly to real supplier historical records', () => {
    const supplier = {
      name: "ABC Suppliers",
      historicalAudits: 50,
      successfulDeliveries: 45,
      reliability: 90
    };
    const riskEval = evaluateSupplierBayesRisk(supplier);
    expect(riskEval.isValid).toBe(true);
    expect(riskEval.priorA).toBeCloseTo(0.10, 2);
    expect(riskEval.posteriorAGivenB).toBeGreaterThan(riskEval.priorA);
  });
});


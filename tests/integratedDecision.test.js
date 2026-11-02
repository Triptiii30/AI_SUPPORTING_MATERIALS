import { describe, it, expect } from 'vitest';
import { runFullIntegratedSupplierAnalysis } from '../src/algorithms/integratedDecisionEngine';

describe('Integrated Supplier Decision Support Engine', () => {
  const sampleSupplier = {
    id: "sup-int-1",
    name: "ABC Suppliers",
    product: "Industrial Steel",
    cost: 50000,
    quality: 91,
    deliveryTime: 5,
    reliability: 92,
    capacity: 1000,
    historicalAudits: 45,
    successfulDeliveries: 42
  };

  it('orchestrates the project-relevant supplier reasoning workflow cleanly', () => {
    const analysis = runFullIntegratedSupplierAnalysis(sampleSupplier);

    expect(analysis).toBeDefined();
    // 1. Frame
    expect(analysis.frame.slots.name.value).toBe("ABC Suppliers");
    // 2. Propositional Logic
    expect(analysis.isEligible).toBe(true);
    expect(analysis.propositional.propEval.values.P).toBe(true);
    // 3. Expert System (+ CF)
    expect(analysis.expertSystem.recommendation).toBeDefined();
    expect(analysis.expertSystem.confidenceCF).toBeGreaterThan(0);
    // 4. Fuzzy Logic
    expect(analysis.fuzzyLogic.suitabilityScore).toBeGreaterThan(0);
    // 5. Bayes' Theorem
    expect(analysis.bayesTheorem.isValid).toBe(true);
    expect(analysis.bayesTheorem.posteriorAGivenB).toBeGreaterThan(0);
    // Comparison Matrix
    expect(analysis.paradigmComparisons.length).toBe(4);
  });

  it('keeps each reasoning paradigm distinct without artificial score merging', () => {
    const analysis = runFullIntegratedSupplierAnalysis(sampleSupplier);

    // Expert system is categorical/rule-based
    expect(typeof analysis.expertSystem.recommendation).toBe("string");
    // Bayes is a posterior probability
    expect(analysis.bayesTheorem.posteriorAGivenB).toBeGreaterThanOrEqual(0);
    expect(analysis.bayesTheorem.posteriorAGivenB).toBeLessThanOrEqual(1);
    // Fuzzy logic is a centroid score in [0, 100]
    expect(analysis.fuzzyLogic.suitabilityScore).toBeGreaterThanOrEqual(0);
    expect(analysis.fuzzyLogic.suitabilityScore).toBeLessThanOrEqual(100);
  });
});

import { describe, it, expect } from 'vitest';
import {
  combineTwoCFs,
  combineMultipleCFs,
  evaluateSupplierCertaintyFactors,
  CF_SUPPLIER_RULES
} from '../src/algorithms/certaintyFactors';

describe('Certainty Factor (MYCIN Model) Engine', () => {
  it('correctly combines two positive certainty factors', () => {
    // CF1 = 0.8, CF2 = 0.6
    // CF_comb = 0.8 + 0.6 - (0.8 * 0.6) = 1.4 - 0.48 = 0.92
    const res = combineTwoCFs(0.8, 0.6);
    expect(res.combined).toBe(0.92);
    expect(res.formulaUsed).toContain("CF₁ + CF₂ - (CF₁ × CF₂)");
  });

  it('correctly combines two negative certainty factors', () => {
    // CF1 = -0.7, CF2 = -0.5
    // CF_comb = -0.7 + -0.5 + (-0.7 * -0.5) = -1.2 + 0.35 = -0.85
    const res = combineTwoCFs(-0.7, -0.5);
    expect(res.combined).toBe(-0.85);
    expect(res.formulaUsed).toContain("CF₁ + CF₂ + (CF₁ × CF₂)");
  });

  it('correctly combines positive and negative certainty factors with opposite signs', () => {
    // CF1 = 0.8, CF2 = -0.4
    // Denominator = 1 - min(|0.8|, |-0.4|) = 1 - 0.4 = 0.6
    // Combined = (0.8 + -0.4) / 0.6 = 0.4 / 0.6 = 0.6667
    const res = combineTwoCFs(0.8, -0.4);
    expect(res.combined).toBeCloseTo(0.6667, 3);
  });

  it('handles boundary extremes (CF = +1 and CF = -1)', () => {
    const maxRes = combineTwoCFs(1.0, 0.5);
    expect(maxRes.combined).toBe(1.0);

    const minRes = combineTwoCFs(-1.0, -0.5);
    expect(minRes.combined).toBe(-1.0);
  });

  it('chains multiple pieces of evidence sequentially', () => {
    const list = [0.8, 0.6, 0.5];
    // First: 0.8 + 0.6 - 0.48 = 0.92
    // Second: 0.92 + 0.5 - (0.92 * 0.5) = 1.42 - 0.46 = 0.96
    const chained = combineMultipleCFs(list);
    expect(chained.finalCF).toBe(0.96);
    expect(chained.steps.length).toBe(2);
  });

  it('evaluates supplier suitability across all domain rules', () => {
    const goodSupplier = {
      name: "Prime Vendor",
      quality: 95,
      deliveryTime: 3,
      reliability: 96,
      cost: 50000
    };

    const evaluation = evaluateSupplierCertaintyFactors(goodSupplier);
    expect(evaluation.finalCF).toBeGreaterThan(0.70);
    expect(evaluation.qualitativeRating).toContain("Suitable");
    expect(evaluation.ruleEvaluations.length).toBe(CF_SUPPLIER_RULES.length);
  });
});


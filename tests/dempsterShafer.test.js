import { describe, it, expect } from 'vitest';
import {
  normalizeMassAssignment,
  combineTwoEvidenceSources,
  combineThreeEvidenceSources,
  extractSupplierDSEvidence
} from '../src/algorithms/dempsterShafer';

describe('Dempster-Shafer Theory of Evidence Engine', () => {
  it('normalizes basic probability mass assignments to unity', () => {
    const raw = { m_S: 0.6, m_U: 0.2, m_Theta: 0.2 };
    const norm = normalizeMassAssignment(raw);
    expect(norm.m_S + norm.m_U + norm.m_Theta).toBeCloseTo(1.0, 4);
  });

  it('correctly executes Dempster rule of combination and computes conflict K', () => {
    // S1: m(S) = 0.70, m(U) = 0.10, m(Theta) = 0.20
    // S2: m(S) = 0.60, m(U) = 0.20, m(Theta) = 0.20
    // Conflict K = (0.70 * 0.20) + (0.10 * 0.60) = 0.14 + 0.06 = 0.20
    // 1 - K = 0.80
    const s1 = { m_S: 0.70, m_U: 0.10, m_Theta: 0.20 };
    const s2 = { m_S: 0.60, m_U: 0.20, m_Theta: 0.20 };

    const result = combineTwoEvidenceSources(s1, s2);
    expect(result.conflictK).toBeCloseTo(0.20, 2);
    expect(result.isTotalConflict).toBe(false);

    // Belief Bel(S) must be <= Plausibility Pl(S)
    expect(result.belief_S).toBeLessThanOrEqual(result.plausibility_S);
    expect(result.plausibility_S).toBeCloseTo(result.belief_S + result.epistemicUncertainty, 3);
  });

  it('detects total irreconcilable conflict when K = 1.0', () => {
    // S1 asserts S with 100% certainty, S2 asserts U with 100% certainty
    const s1 = { m_S: 1.0, m_U: 0.0, m_Theta: 0.0 };
    const s2 = { m_S: 0.0, m_U: 1.0, m_Theta: 0.0 };

    const result = combineTwoEvidenceSources(s1, s2);
    expect(result.isTotalConflict).toBe(true);
    expect(result.conflictK).toBe(1.0);
  });

  it('combines 3 independent evidence sources sequentially', () => {
    const s1 = { m_S: 0.75, m_U: 0.10, m_Theta: 0.15 };
    const s2 = { m_S: 0.70, m_U: 0.10, m_Theta: 0.20 };
    const s3 = { m_S: 0.65, m_U: 0.15, m_Theta: 0.20 };

    const result = combineThreeEvidenceSources(s1, s2, s3);
    expect(result.finalBelief_S).toBeGreaterThan(0.80); // Corroborating evidence increases belief
    expect(result.finalPlausibility_S).toBeGreaterThanOrEqual(result.finalBelief_S);
    expect(result.explanation).toBeDefined();
  });

  it('extracts realistic evidence masses from active supplier attributes', () => {
    const supplier = {
      name: "ABC Suppliers",
      quality: 92,
      reliability: 91,
      deliveryTime: 5
    };
    const evidence = extractSupplierDSEvidence(supplier);
    expect(evidence.s1.m_S).toBeGreaterThan(evidence.s1.m_U);
    expect(evidence.s2.m_S).toBeGreaterThan(evidence.s2.m_U);
  });
});


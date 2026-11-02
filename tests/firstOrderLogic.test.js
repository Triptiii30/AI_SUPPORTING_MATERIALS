import { describe, it, expect } from 'vitest';
import {
  FOL_PREDICATES,
  FOL_FORMULAS,
  evaluateAllFOLFormulas
} from '../src/algorithms/firstOrderLogic';

describe('First Order Logic (FOL) Predicate Engine', () => {
  const sampleSuppliers = [
    { id: "s1", name: "Alpha Steel", product: "Industrial Steel", quality: 95, reliability: 94, cost: 52000, deliveryTime: 4, capacity: 1500 },
    { id: "s2", name: "Beta Bearings", product: "Precision Bearings", quality: 80, reliability: 78, cost: 45000, deliveryTime: 7, capacity: 800 }
  ];
  const sampleProducts = ["Industrial Steel", "Precision Bearings", "Microchips"];
  const sampleReqs = { product: "Industrial Steel", maxBudget: 60000, maxDelivery: 5 };

  it('evaluates primitive predicate relations accurately', () => {
    // Provides(s1, "Industrial Steel") should be true
    expect(FOL_PREDICATES.Provides.evaluate(sampleSuppliers[0], "Industrial Steel")).toBe(true);
    expect(FOL_PREDICATES.Provides.evaluate(sampleSuppliers[1], "Industrial Steel")).toBe(false);

    // HighQuality(s1) should be true (95 >= 90), s2 should be false (80 < 90)
    expect(FOL_PREDICATES.HighQuality.evaluate(sampleSuppliers[0], 90)).toBe(true);
    expect(FOL_PREDICATES.HighQuality.evaluate(sampleSuppliers[1], 90)).toBe(false);

    // CertifiedVendor(x) = HighQuality ∧ Reliable
    expect(FOL_PREDICATES.CertifiedVendor.evaluate(sampleSuppliers[0])).toBe(true);
    expect(FOL_PREDICATES.CertifiedVendor.evaluate(sampleSuppliers[1])).toBe(false);
  });

  it('proves Universal Quantification (∀x) over supplier domain', () => {
    const formula1 = FOL_FORMULAS.find(f => f.id === "FOL-RULE-1");
    const proof = formula1.evaluate({
      suppliers: sampleSuppliers,
      products: sampleProducts
    });

    expect(proof.satisfied).toBe(true);
    expect(proof.instances.length).toBe(2);
    expect(proof.instances[0].witness).toBe("Industrial Steel");
    expect(proof.instances[1].witness).toBe("Precision Bearings");
  });

  it('proves Existential Quantification (∃x) with witness derivation', () => {
    const formula3 = FOL_FORMULAS.find(f => f.id === "FOL-RULE-3");
    const proof = formula3.evaluate({
      suppliers: sampleSuppliers,
      products: sampleProducts,
      requirements: sampleReqs
    });

    expect(proof.satisfied).toBe(true);
    expect(proof.witnesses).toContain("Alpha Steel");
  });

  it('handles empty or non-matching existential queries gracefully', () => {
    const formula3 = FOL_FORMULAS.find(f => f.id === "FOL-RULE-3");
    const proof = formula3.evaluate({
      suppliers: sampleSuppliers,
      products: sampleProducts,
      requirements: { product: "NonExistentProduct", maxBudget: 10000, maxDelivery: 1 }
    });

    expect(proof.satisfied).toBe(false);
    expect(proof.witnesses.length).toBe(0);
  });

  it('runs batch FOL evaluation across all axioms', () => {
    const allResults = evaluateAllFOLFormulas(sampleSuppliers, sampleProducts, sampleReqs);
    expect(allResults.length).toBe(4);
    expect(allResults[0].evaluation.proofType).toBeDefined();
  });
});


import { describe, it, expect } from 'vitest';
import {
  CONNECTIVES,
  DEFAULT_PROPOSITIONS,
  DEFAULT_PROP_RULES,
  evaluateSupplierPropositions,
  evaluatePropositionalRule,
  generateTruthTable,
  evaluateCustomExpression
} from '../src/algorithms/propositionalLogic';

describe('Propositional Logic Evaluation Engine', () => {
  it('correctly evaluates primitive connectives: AND, OR, NOT, IMPLIES, IFF', () => {
    // AND
    expect(CONNECTIVES.AND.fn(true, true)).toBe(true);
    expect(CONNECTIVES.AND.fn(true, false)).toBe(false);
    expect(CONNECTIVES.AND.fn(false, false)).toBe(false);

    // OR
    expect(CONNECTIVES.OR.fn(true, false)).toBe(true);
    expect(CONNECTIVES.OR.fn(false, false)).toBe(false);

    // NOT
    expect(CONNECTIVES.NOT.fn(true)).toBe(false);
    expect(CONNECTIVES.NOT.fn(false)).toBe(true);

    // IMPLIES (P -> Q is true except when P=true and Q=false)
    expect(CONNECTIVES.IMPLIES.fn(true, true)).toBe(true);
    expect(CONNECTIVES.IMPLIES.fn(true, false)).toBe(false);
    expect(CONNECTIVES.IMPLIES.fn(false, true)).toBe(true);
    expect(CONNECTIVES.IMPLIES.fn(false, false)).toBe(true);

    // IFF (Equivalence)
    expect(CONNECTIVES.IFF.fn(true, true)).toBe(true);
    expect(CONNECTIVES.IFF.fn(false, false)).toBe(true);
    expect(CONNECTIVES.IFF.fn(true, false)).toBe(false);
  });

  it('evaluates supplier proposition bindings accurately', () => {
    const mockSupplier = {
      name: "ABC Test",
      quality: 92, // >= 88 -> P: true
      deliveryTime: 4, // <= 5 -> Q: true
      reliability: 90, // >= 85 -> R: true
      cost: 50000, // <= 55000 -> S: true
      capacity: 1200 // >= 1000 -> T: true
    };

    const evalResult = evaluateSupplierPropositions(mockSupplier);
    expect(evalResult.values.P).toBe(true);
    expect(evalResult.values.Q).toBe(true);
    expect(evalResult.values.R).toBe(true);
    expect(evalResult.values.S).toBe(true);
    expect(evalResult.values.T).toBe(true);

    const nonConformingSupplier = {
      name: "Substandard Co.",
      quality: 75,
      deliveryTime: 8,
      reliability: 70,
      cost: 75000,
      capacity: 500
    };

    const badResult = evaluateSupplierPropositions(nonConformingSupplier);
    expect(badResult.values.P).toBe(false);
    expect(badResult.values.Q).toBe(false);
    expect(badResult.values.R).toBe(false);
    expect(badResult.values.S).toBe(false);
    expect(badResult.values.T).toBe(false);
  });

  it('evaluates compound propositional rules and provides explanations', () => {
    const rule1 = DEFAULT_PROP_RULES[0]; // (P ∧ Q) → R
    // When P=T, Q=T, R=T => T
    const res1 = evaluatePropositionalRule(rule1, { P: true, Q: true, R: true });
    expect(res1.result).toBe(true);

    // When P=T, Q=T, R=F => F
    const res2 = evaluatePropositionalRule(rule1, { P: true, Q: true, R: false });
    expect(res2.result).toBe(false);
  });

  it('generates a full 4-row truth table for 2-variable expressions', () => {
    const table = generateTruthTable(["P", "Q"], (v) => v.P && v.Q);
    expect(table.rows.length).toBe(4);
    // Row 0: T, T -> T
    expect(table.rows[0].P).toBe(true);
    expect(table.rows[0].Q).toBe(true);
    expect(table.rows[0].result).toBe(true);
    // Row 1: T, F -> F
    expect(table.rows[1].result).toBe(false);
  });

  it('safely parses and evaluates custom propositional expressions', () => {
    const res = evaluateCustomExpression("(P && Q) || R", { P: true, Q: false, R: true });
    expect(res.success).toBe(true);
    expect(res.result).toBe(true);

    const resImplies = evaluateCustomExpression("P -> Q", { P: true, Q: false });
    expect(resImplies.success).toBe(true);
    expect(resImplies.result).toBe(false);
  });
});


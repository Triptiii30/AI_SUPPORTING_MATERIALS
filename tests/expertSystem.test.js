import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRODUCTION_RULES,
  extractWorkingMemory,
  runForwardChainingInference,
  evaluateExpertRules
} from '../src/algorithms/expertSystem';

describe('Rule-Based Expert System (Forward Chaining)', () => {
  const eliteSupplier = {
    name: "Prime Supply Co.",
    product: "Industrial Steel",
    quality: 95,
    reliability: 96,
    deliveryTime: 4,
    cost: 55000,
    capacity: 1400
  };

  const riskySupplier = {
    name: "Defective Corp",
    product: "Industrial Steel",
    quality: 75,
    reliability: 78,
    deliveryTime: 9,
    cost: 70000,
    capacity: 600
  };

  const reqs = {
    maxBudget: 60000,
    requiredCapacity: 900,
    maxDelivery: 7,
    product: "Industrial Steel"
  };

  it('correctly qualifies an elite supplier as Gold Tier', () => {
    const memory = extractWorkingMemory(eliteSupplier, reqs);
    const result = runForwardChainingInference(memory, DEFAULT_PRODUCTION_RULES);

    expect(result.recommendation).toContain("Highly Recommended");
    expect(result.firedRules.some(r => r.id === "RULE-04")).toBe(true);
    expect(result.explanation.whyExplanation).toBeDefined();
    expect(result.explanation.howExplanation).toBeDefined();
    expect(result.executionTrace.length).toBeGreaterThan(0);
  });

  it('correctly rejects a risky supplier with High Operational Risk', () => {
    const memory = extractWorkingMemory(riskySupplier, reqs);
    const result = runForwardChainingInference(memory, DEFAULT_PRODUCTION_RULES);

    expect(result.recommendation).toContain("Rejected: High Operational Risk");
    expect(result.firedRules.some(r => r.id === "RULE-05")).toBe(true);
    expect(result.explanation.rejectionReasons.length).toBeGreaterThan(0);
  });

  it('respects priority ordering during forward chaining conflict resolution', () => {
    const memory = extractWorkingMemory(eliteSupplier, reqs);
    const result = runForwardChainingInference(memory, DEFAULT_PRODUCTION_RULES);

    // Higher priority rules should appear earlier in executionTrace
    const priorities = result.executionTrace.map(t => t.priority);
    for (let i = 0; i < priorities.length - 1; i++) {
      expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i + 1]);
    }
  });

  it('provides backwards compatibility via evaluateExpertRules', () => {
    const compatResult = evaluateExpertRules(eliteSupplier, reqs);
    expect(compatResult.recommendation).toBeDefined();
    expect(compatResult.firedCount).toBeGreaterThan(0);
  });
});


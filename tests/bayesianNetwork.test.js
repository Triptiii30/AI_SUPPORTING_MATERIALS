import { describe, it, expect } from 'vitest';
import {
  BBN_STRUCTURE,
  BBN_CPTS,
  getJointProbability,
  inferBayesianNetwork
} from '../src/algorithms/bayesianNetwork';

describe('Bayesian Belief Network (BBN) Engine', () => {
  it('has consistent and normalized Conditional Probability Tables (CPTs)', () => {
    // Check prior R
    const sumR = BBN_CPTS.R.Dependable + BBN_CPTS.R.Fluctuating;
    expect(sumR).toBeCloseTo(1.0, 5);

    // Check prior F
    const sumF = BBN_CPTS.F.Strong + BBN_CPTS.F.Vulnerable;
    expect(sumF).toBeCloseTo(1.0, 5);

    // Check D | R
    const sumD_Dep = BBN_CPTS.D.Dependable.OnTime + BBN_CPTS.D.Dependable.Delayed;
    expect(sumD_Dep).toBeCloseTo(1.0, 5);

    // Check Risk CPT entries
    Object.keys(BBN_CPTS.Risk).forEach(key => {
      const row = BBN_CPTS.Risk[key];
      const sumRisk = row.LowRisk + row.MedRisk + row.HighRisk;
      expect(sumRisk).toBeCloseTo(1.0, 5);
    });
  });

  it('computes positive joint probabilities matching DAG chain rule', () => {
    const joint = getJointProbability("Dependable", "Strong", "OnTime", "HighQuality", "LowRisk");
    // P(R=Dep) * P(F=Str) * P(D=OnTime|Dep) * P(Q=HQ|Dep) * P(Risk=Low|OnTime,HQ,Str)
    // 0.70 * 0.80 * 0.88 * 0.92 * 0.92
    const expected = 0.70 * 0.80 * 0.88 * 0.92 * 0.92;
    expect(joint).toBeCloseTo(expected, 5);
    expect(joint).toBeGreaterThan(0);
  });

  it('infers unconditioned prior marginal distribution of target risk node', () => {
    const unconditioned = inferBayesianNetwork("Risk", {});
    const dist = unconditioned.posteriorDistribution;
    const sum = dist.LowRisk + dist.MedRisk + dist.HighRisk;

    expect(sum).toBeCloseTo(1.0, 3);
    // In normal operations, LowRisk should dominate
    expect(dist.LowRisk).toBeGreaterThan(dist.HighRisk);
  });

  it('correctly updates posterior distribution when conditioned on negative evidence', () => {
    // Evidence: Delivery is Delayed and Supplier is Fluctuating
    const conditioned = inferBayesianNetwork("Risk", {
      D: "Delayed",
      R: "Fluctuating"
    });
    const dist = conditioned.posteriorDistribution;

    // HighRisk probability must increase dramatically compared to unconditioned
    const unconditioned = inferBayesianNetwork("Risk", {});
    expect(dist.HighRisk).toBeGreaterThan(unconditioned.posteriorDistribution.HighRisk);
    expect(dist.LowRisk + dist.MedRisk + dist.HighRisk).toBeCloseTo(1.0, 3);
  });
});


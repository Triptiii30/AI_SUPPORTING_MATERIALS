import { describe, it, expect } from 'vitest';
import {
  trimf,
  trapmf,
  getCostMembership,
  getQualityMembership,
  getDeliveryMembership,
  getReliabilityMembership,
  defuzzifyCentroid,
  evaluateFuzzySupplier,
  generateMembershipCurves
} from '../src/algorithms/fuzzyLogic';

describe('Mamdani Fuzzy Inference System (FIS)', () => {
  it('correctly evaluates triangular membership function (trimf)', () => {
    // Peak at b=50, zero at <=40 and >=60
    expect(trimf(50, 40, 50, 60)).toBe(1);
    expect(trimf(45, 40, 50, 60)).toBeCloseTo(0.5, 3);
    expect(trimf(35, 40, 50, 60)).toBe(0);
    expect(trimf(65, 40, 50, 60)).toBe(0);
  });

  it('correctly evaluates trapezoidal membership function (trapmf)', () => {
    // Flat top between b=40 and c=60
    expect(trapmf(50, 30, 40, 60, 70)).toBe(1);
    expect(trapmf(40, 30, 40, 60, 70)).toBe(1);
    expect(trapmf(60, 30, 40, 60, 70)).toBe(1);
    expect(trapmf(35, 30, 40, 60, 70)).toBeCloseTo(0.5, 3);
    expect(trapmf(25, 30, 40, 60, 70)).toBe(0);
  });

  it('computes correct degrees of membership across all 4 input variables', () => {
    const costMem = getCostMembership(45000); // Low/Med
    expect(costMem.low).toBeGreaterThan(0);

    const qualMem = getQualityMembership(95); // Excellent
    expect(qualMem.excellent).toBeGreaterThan(0.8);
    expect(qualMem.poor).toBe(0);

    const delMem = getDeliveryMembership(3); // Fast
    expect(delMem.fast).toBeGreaterThan(0.8);
    expect(delMem.slow).toBe(0);

    const relMem = getReliabilityMembership(92); // High
    expect(relMem.high).toBeGreaterThan(0.8);
  });

  it('performs Centroid (COG) defuzzification accurately', () => {
    // If only Excellent output is active with strength 1.0, centroid should be high (~95)
    const excellentCentroid = defuzzifyCentroid({
      Poor: 0,
      Average: 0,
      Good: 0,
      Excellent: 1.0
    });
    expect(excellentCentroid).toBeGreaterThan(85);

    // If only Poor output is active with strength 1.0, centroid should be low (~20)
    const poorCentroid = defuzzifyCentroid({
      Poor: 1.0,
      Average: 0,
      Good: 0,
      Excellent: 0
    });
    expect(poorCentroid).toBeLessThan(35);
  });

  it('evaluates real supplier profile through Mamdani inference pipeline', () => {
    const eliteSupplier = {
      name: "Prime Supply Co.",
      cost: 45000,
      quality: 95,
      deliveryTime: 3,
      reliability: 96
    };

    const result = evaluateFuzzySupplier(eliteSupplier);
    expect(result.suitabilityScore).toBeGreaterThanOrEqual(80);
    expect(result.recommendationCategory).toBe("Excellent Supplier");
    expect(result.defuzzificationMethod).toContain("Centroid");
  });

  it('generates smooth plotting curves for UI Recharts rendering', () => {
    const curves = generateMembershipCurves();
    expect(curves.qualityCurves.length).toBeGreaterThan(20);
    expect(curves.deliveryCurves.length).toBeGreaterThan(15);
    expect(curves.costCurves.length).toBeGreaterThan(10);
    expect(curves.reliabilityCurves.length).toBeGreaterThan(15);
  });
});


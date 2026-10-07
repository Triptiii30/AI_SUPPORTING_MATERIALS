/**
 * Fuzzy Logic Evaluation Engine for Supplier Assessment
 * Implements Triangular/Trapezoidal Membership Functions, Mamdani Rule Base, and Defuzzification.
 */

// Helper: Triangular membership function
export function trimf(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

// Helper: Trapezoidal membership function
export function trapmf(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

/**
 * Calculate Fuzzy Memberships for Quality (0 - 100%)
 */
export function getQualityMembership(q) {
  return {
    low: Number(trapmf(q, -10, 0, 40, 60).toFixed(2)),
    medium: Number(trimf(q, 45, 70, 85).toFixed(2)),
    high: Number(trapmf(q, 75, 88, 100, 110).toFixed(2))
  };
}

/**
 * Calculate Fuzzy Memberships for Reliability (0 - 100%)
 */
export function getReliabilityMembership(r) {
  return {
    low: Number(trapmf(r, -10, 0, 45, 65).toFixed(2)),
    medium: Number(trimf(r, 50, 75, 88).toFixed(2)),
    high: Number(trapmf(r, 78, 89, 100, 110).toFixed(2))
  };
}

/**
 * Calculate Fuzzy Memberships for Delivery Lead Time (Days)
 */
export function getDeliveryMembership(d) {
  return {
    fast: Number(trapmf(d, 0, 1, 3, 4.5).toFixed(2)),
    moderate: Number(trimf(d, 3, 5, 7).toFixed(2)),
    slow: Number(trapmf(d, 5.5, 7, 20, 25).toFixed(2))
  };
}

/**
 * Generates curve points for plotting membership functions in Recharts
 */
export function generateMembershipCurves() {
  const qualityPoints = [];
  for (let q = 0; q <= 100; q += 2) {
    const mem = getQualityMembership(q);
    qualityPoints.push({ x: q, Low: mem.low, Medium: mem.medium, High: mem.high });
  }

  const deliveryPoints = [];
  for (let d = 1; d <= 10; d += 0.25) {
    const roundedD = Number(d.toFixed(2));
    const mem = getDeliveryMembership(roundedD);
    deliveryPoints.push({ x: roundedD, Fast: mem.fast, Moderate: mem.moderate, Slow: mem.slow });
  }

  return { qualityPoints, deliveryPoints };
}

/**
 * Evaluates Supplier using Fuzzy Rules and Mamdani Min-Max Inference
 */
export function evaluateFuzzySupplier(supplier) {
  const qMem = getQualityMembership(supplier.quality);
  const rMem = getReliabilityMembership(supplier.reliability);
  const dMem = getDeliveryMembership(supplier.deliveryTime);

  // Dominant linguistic terms
  const dominantQuality = Object.keys(qMem).reduce((a, b) => qMem[a] >= qMem[b] ? a : b);
  const dominantReliability = Object.keys(rMem).reduce((a, b) => rMem[a] >= rMem[b] ? a : b);
  const dominantDelivery = Object.keys(dMem).reduce((a, b) => dMem[a] >= dMem[b] ? a : b);

  // Mamdani Fuzzy Rules:
  // R1: High Q & High R & Fast D -> Exceptional (Centroid = 95)
  const r1Strength = Math.min(qMem.high, rMem.high, dMem.fast);
  // R2: High Q & High R & Moderate D -> Highly Suitable (Centroid = 88)
  const r2Strength = Math.min(qMem.high, rMem.high, dMem.moderate);
  // R3: High Q & Medium R -> Suitable (Centroid = 75)
  const r3Strength = Math.min(qMem.high, rMem.medium);
  // R4: Medium Q & High R -> Suitable (Centroid = 75)
  const r4Strength = Math.min(qMem.medium, rMem.high);
  // R5: Medium Q & Medium R -> Acceptable (Centroid = 60)
  const r5Strength = Math.min(qMem.medium, rMem.medium);
  // R6: Low Q or Low R or Slow D -> Unfavorable (Centroid = 30)
  const r6Strength = Math.max(qMem.low, rMem.low, dMem.slow);

  // Defuzzification using Weighted Average / Center of Gravity Approximation
  const numerator = (r1Strength * 95) + (r2Strength * 88) + (r3Strength * 75) + 
                    (r4Strength * 75) + (r5Strength * 60) + (r6Strength * 30);
  const denominator = (r1Strength + r2Strength + r3Strength + r4Strength + r5Strength + r6Strength) || 1;

  const defuzzifiedScore = Number((numerator / denominator).toFixed(1));

  let linguisticVerdict = "Moderately Suitable";
  let verdictColor = "blue";

  if (defuzzifiedScore >= 85) {
    linguisticVerdict = "Highly Suitable";
    verdictColor = "emerald";
  } else if (defuzzifiedScore >= 70) {
    linguisticVerdict = "Suitable";
    verdictColor = "cyan";
  } else if (defuzzifiedScore >= 50) {
    linguisticVerdict = "Marginally Acceptable";
    verdictColor = "amber";
  } else {
    linguisticVerdict = "Unfavorable / Substandard";
    verdictColor = "rose";
  }

  return {
    qualityMembership: qMem,
    reliabilityMembership: rMem,
    deliveryMembership: dMem,
    dominantLabels: {
      quality: dominantQuality.toUpperCase(),
      reliability: dominantReliability.toUpperCase(),
      delivery: dominantDelivery.toUpperCase()
    },
    ruleFirings: [
      { rule: "R1: High Q ∧ High R ∧ Fast Delivery → Exceptional", strength: r1Strength, target: "Exceptional (95)" },
      { rule: "R2: High Q ∧ High R ∧ Moderate Delivery → Highly Suitable", strength: r2Strength, target: "Highly Suitable (88)" },
      { rule: "R3: High Q ∧ Medium R → Suitable", strength: r3Strength, target: "Suitable (75)" },
      { rule: "R4: Medium Q ∧ High R → Suitable", strength: r4Strength, target: "Suitable (75)" },
      { rule: "R5: Medium Q ∧ Medium R → Acceptable", strength: r5Strength, target: "Acceptable (60)" },
      { rule: "R6: Low Q ∨ Low R ∨ Slow Delivery → Unfavorable", strength: r6Strength, target: "Unfavorable (30)" }
    ],
    defuzzifiedScore,
    linguisticVerdict,
    verdictColor
  };
}

/**
 * Mamdani Fuzzy Inference System (FIS) for Supplier Evaluation
 * Inputs:
 *   1. Cost (₹): Low, Medium, High
 *   2. Quality (%): Poor, Average, Good, Excellent
 *   3. Delivery Time (Days): Fast, Moderate, Slow
 *   4. Reliability (%): Low, Medium, High
 * Output:
 *   Supplier Suitability Score (0 - 100):
 *   Linguistic Classes: Poor (0-35), Average (30-65), Good (60-85), Excellent (80-100)
 *
 * Implements:
 * 1. Fuzzification via Triangular (trimf) and Trapezoidal (trapmf) membership functions
 * 2. Multi-rule Mamdani Min-Max Inference
 * 3. Exact Centroid / Center of Gravity (COG) Defuzzification:
 *    z* = (∑ z_i * μ(z_i)) / (∑ μ(z_i))
 */

// Triangular Membership Function
export function trimf(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

// Trapezoidal Membership Function
export function trapmf(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

// 1. Cost Membership Functions (₹ 30,000 to ₹ 80,000)
export function getCostMembership(cost) {
  return {
    low: Number(trapmf(cost, 20000, 25000, 45000, 52000).toFixed(3)),
    medium: Number(trimf(cost, 46000, 55000, 65000).toFixed(3)),
    high: Number(trapmf(cost, 58000, 68000, 100000, 120000).toFixed(3))
  };
}

// 2. Quality Membership Functions (0% - 100%)
export function getQualityMembership(q) {
  return {
    poor: Number(trapmf(q, -10, 0, 50, 70).toFixed(3)),
    average: Number(trimf(q, 60, 75, 86).toFixed(3)),
    good: Number(trimf(q, 80, 88, 94).toFixed(3)),
    excellent: Number(trapmf(q, 90, 95, 100, 110).toFixed(3))
  };
}

// 3. Delivery Lead Time Membership Functions (Days: 1 to 14)
export function getDeliveryMembership(d) {
  return {
    fast: Number(trapmf(d, 0, 1, 3.5, 5).toFixed(3)),
    moderate: Number(trimf(d, 4, 6, 8).toFixed(3)),
    slow: Number(trapmf(d, 7, 9, 20, 25).toFixed(3))
  };
}

// 4. Reliability Membership Functions (0% - 100%)
export function getReliabilityMembership(r) {
  return {
    low: Number(trapmf(r, -10, 0, 60, 75).toFixed(3)),
    medium: Number(trimf(r, 70, 82, 90).toFixed(3)),
    high: Number(trapmf(r, 86, 92, 100, 110).toFixed(3))
  };
}

// Output Suitability Membership Function Centers (for fuzzy output sets)
export const OUTPUT_CLASSES = {
  Poor: { center: 20, mf: (z) => trapmf(z, -10, 0, 20, 35) },
  Average: { center: 50, mf: (z) => trimf(z, 25, 50, 70) },
  Good: { center: 75, mf: (z) => trimf(z, 60, 75, 88) },
  Excellent: { center: 95, mf: (z) => trapmf(z, 82, 92, 100, 110) }
};

// Mamdani Fuzzy Production Rules
export const FUZZY_RULES = [
  {
    id: "FR-01",
    name: "Elite Gold Standard",
    antecedentText: "IF Quality is Excellent AND Reliability is High AND Delivery is Fast AND Cost is Low",
    consequentText: "THEN Suitability is Excellent",
    consequentClass: "Excellent",
    evaluateStrength: (f) => Math.min(f.quality.excellent, f.reliability.high, f.delivery.fast, f.cost.low)
  },
  {
    id: "FR-02",
    name: "Strong Quality & Reliability",
    antecedentText: "IF Quality is Excellent AND Reliability is High AND Cost is (Low OR Medium)",
    consequentText: "THEN Suitability is Excellent",
    consequentClass: "Excellent",
    evaluateStrength: (f) => Math.min(f.quality.excellent, f.reliability.high, Math.max(f.cost.low, f.cost.medium))
  },
  {
    id: "FR-03",
    name: "High Performance with Moderate Lead Time",
    antecedentText: "IF Quality is Good AND Reliability is High AND Delivery is Fast",
    consequentText: "THEN Suitability is Good",
    consequentClass: "Good",
    evaluateStrength: (f) => Math.min(f.quality.good, f.reliability.high, f.delivery.fast)
  },
  {
    id: "FR-04",
    name: "Good Balanced Supplier",
    antecedentText: "IF Quality is Good AND Delivery is Moderate AND Cost is Medium",
    consequentText: "THEN Suitability is Good",
    consequentClass: "Good",
    evaluateStrength: (f) => Math.min(f.quality.good, f.delivery.moderate, f.cost.medium)
  },
  {
    id: "FR-05",
    name: "Average Balanced Commercial Supplier",
    antecedentText: "IF Quality is Average AND Reliability is Medium",
    consequentText: "THEN Suitability is Average",
    consequentClass: "Average",
    evaluateStrength: (f) => Math.min(f.quality.average, f.reliability.medium)
  },
  {
    id: "FR-06",
    name: "Cost Effective but Moderate Quality",
    antecedentText: "IF Cost is Low AND Quality is Average AND Reliability is High",
    consequentText: "THEN Suitability is Good",
    consequentClass: "Good",
    evaluateStrength: (f) => Math.min(f.cost.low, f.quality.average, f.reliability.high)
  },
  {
    id: "FR-07",
    name: "High Cost Disincentive",
    antecedentText: "IF Cost is High AND (Quality is Poor OR Reliability is Low)",
    consequentText: "THEN Suitability is Poor",
    consequentClass: "Poor",
    evaluateStrength: (f) => Math.min(f.cost.high, Math.max(f.quality.poor, f.reliability.low))
  },
  {
    id: "FR-08",
    name: "Severe Lead Latency Bottleneck",
    antecedentText: "IF Delivery is Slow AND Reliability is Low",
    consequentText: "THEN Suitability is Poor",
    consequentClass: "Poor",
    evaluateStrength: (f) => Math.min(f.delivery.slow, f.reliability.low)
  },
  {
    id: "FR-09",
    name: "Quality Failure Disqualification",
    antecedentText: "IF Quality is Poor",
    consequentText: "THEN Suitability is Poor",
    consequentClass: "Poor",
    evaluateStrength: (f) => f.quality.poor
  },
  {
    id: "FR-10",
    name: "Fast Dispatch with Average Quality",
    antecedentText: "IF Delivery is Fast AND Quality is Average AND Cost is Low",
    consequentText: "THEN Suitability is Average",
    consequentClass: "Average",
    evaluateStrength: (f) => Math.min(f.delivery.fast, f.quality.average, f.cost.low)
  },
  {
    id: "FR-11",
    name: "Premium Vendor High Cost Justified",
    antecedentText: "IF Quality is Excellent AND Reliability is High AND Cost is High",
    consequentText: "THEN Suitability is Good",
    consequentClass: "Good",
    evaluateStrength: (f) => Math.min(f.quality.excellent, f.reliability.high, f.cost.high)
  },
  {
    id: "FR-12",
    name: "High Reliability Buffer",
    antecedentText: "IF Reliability is High AND Quality is Average AND Delivery is Moderate",
    consequentText: "THEN Suitability is Average",
    consequentClass: "Average",
    evaluateStrength: (f) => Math.min(f.reliability.high, f.quality.average, f.delivery.moderate)
  }
];

/**
 * Centroid (Center of Gravity) Defuzzification
 * Evaluates the aggregated fuzzy output membership function across z ∈ [0, 100] with step 1.
 */
export function defuzzifyCentroid(classMaxStrengths) {
  let numerator = 0;
  let denominator = 0;

  for (let z = 0; z <= 100; z += 1) {
    // Aggregated membership at point z = max across all classes of min(ruleStrength, classMF(z))
    let aggregatedMu = 0;

    Object.keys(classMaxStrengths).forEach(cls => {
      const alpha = classMaxStrengths[cls];
      if (alpha > 0) {
        const shapeVal = OUTPUT_CLASSES[cls].mf(z);
        const clipped = Math.min(alpha, shapeVal);
        if (clipped > aggregatedMu) {
          aggregatedMu = clipped;
        }
      }
    });

    numerator += z * aggregatedMu;
    denominator += aggregatedMu;
  }

  // Fallback to default 50 if no rules fired
  if (denominator === 0) return 50;
  return Number((numerator / denominator).toFixed(2));
}

/**
 * Full Mamdani Fuzzy Evaluation of a Supplier
 */
export function evaluateFuzzySupplier(supplier) {
  // Step 1: Fuzzification
  const costMem = getCostMembership(supplier.cost);
  const qualMem = getQualityMembership(supplier.quality);
  const delMem = getDeliveryMembership(supplier.deliveryTime);
  const relMem = getReliabilityMembership(supplier.reliability);

  const fuzzifiedInputs = {
    cost: costMem,
    quality: qualMem,
    delivery: delMem,
    reliability: relMem
  };

  // Step 2 & 3: Rule Evaluation and Aggregation
  const ruleActivations = [];
  const classMaxStrengths = {
    Poor: 0,
    Average: 0,
    Good: 0,
    Excellent: 0
  };

  FUZZY_RULES.forEach(rule => {
    const strength = Number(rule.evaluateStrength(fuzzifiedInputs).toFixed(3));
    ruleActivations.push({
      ...rule,
      strength,
      isFired: strength > 0
    });

    if (strength > classMaxStrengths[rule.consequentClass]) {
      classMaxStrengths[rule.consequentClass] = strength;
    }
  });

  // Step 4: Defuzzification (Centroid COG)
  const suitabilityScore = defuzzifyCentroid(classMaxStrengths);

  // Linguistic Label
  let recommendationCategory = "Average Supplier";
  if (suitabilityScore >= 80) recommendationCategory = "Excellent Supplier";
  else if (suitabilityScore >= 65) recommendationCategory = "Good Supplier";
  else if (suitabilityScore < 40) recommendationCategory = "Poor Supplier";

  return {
    supplierName: supplier.name,
    fuzzifiedInputs,
    ruleActivations,
    classMaxStrengths,
    suitabilityScore,
    recommendationCategory,
    defuzzificationMethod: "Centroid / Center of Gravity (COG)",
    explanation: `Mamdani inference evaluated ${FUZZY_RULES.length} fuzzy rules. Active output sets: Poor=${classMaxStrengths.Poor}, Average=${classMaxStrengths.Average}, Good=${classMaxStrengths.Good}, Excellent=${classMaxStrengths.Excellent}. Centroid defuzzification synthesized a Crisp Suitability Score of ${suitabilityScore} / 100 (${recommendationCategory}).`
  };
}

/**
 * Generate curve plotting points for Recharts visualizations
 */
export function generateMembershipCurves() {
  const qualityCurves = [];
  for (let q = 0; q <= 100; q += 2) {
    const mem = getQualityMembership(q);
    qualityCurves.push({ x: q, Poor: mem.poor, Average: mem.average, Good: mem.good, Excellent: mem.excellent });
  }

  const deliveryCurves = [];
  for (let d = 1; d <= 12; d += 0.5) {
    const mem = getDeliveryMembership(d);
    deliveryCurves.push({ x: d, Fast: mem.fast, Moderate: mem.moderate, Slow: mem.slow });
  }

  const costCurves = [];
  for (let c = 30000; c <= 85000; c += 2500) {
    const mem = getCostMembership(c);
    costCurves.push({ x: c / 1000, Low: mem.low, Medium: mem.medium, High: mem.high });
  }

  const reliabilityCurves = [];
  for (let r = 50; r <= 100; r += 2) {
    const mem = getReliabilityMembership(r);
    reliabilityCurves.push({ x: r, Low: mem.low, Medium: mem.medium, High: mem.high });
  }

  return { qualityCurves, deliveryCurves, costCurves, reliabilityCurves };
}

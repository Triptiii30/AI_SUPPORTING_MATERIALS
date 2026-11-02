/**
 * Certainty Factor (CF) Reasoning Engine
 * Implements the Shortliffe / Buchanan (MYCIN) Uncertainty Calculus:
 * - CF values in range [-1.0, +1.0]
 * - Conjunction: min(CF_e1, CF_e2)
 * - Disjunction: max(CF_e1, CF_e2)
 * - Rule Propagation: CF(H, E) = CF(E) * CF_rule
 * - Combination Function for Multiple Independent Evidence:
 *   * Both Positive: CF1 + CF2 - (CF1 * CF2)
 *   * Both Negative: CF1 + CF2 + (CF1 * CF2)
 *   * Opposite Signs: (CF1 + CF2) / (1 - min(|CF1|, |CF2|))
 */

/**
 * Combine two certainty factors according to the standard MYCIN formula
 */
export function combineTwoCFs(cf1, cf2) {
  // Clamp inputs to [-1, 1]
  const c1 = Math.max(-1, Math.min(1, cf1));
  const c2 = Math.max(-1, Math.min(1, cf2));

  let combined;
  let formulaUsed;

  if (c1 >= 0 && c2 >= 0) {
    combined = c1 + c2 - (c1 * c2);
    formulaUsed = "CF₁ + CF₂ - (CF₁ × CF₂)";
  } else if (c1 <= 0 && c2 <= 0) {
    combined = c1 + c2 + (c1 * c2);
    formulaUsed = "CF₁ + CF₂ + (CF₁ × CF₂)";
  } else {
    const denom = 1 - Math.min(Math.abs(c1), Math.abs(c2));
    combined = denom !== 0 ? (c1 + c2) / denom : 0;
    formulaUsed = "(CF₁ + CF₂) / (1 - min(|CF₁|, |CF₂|))";
  }

  return {
    combined: Number(combined.toFixed(4)),
    formulaUsed,
    c1: Number(c1.toFixed(4)),
    c2: Number(c2.toFixed(4))
  };
}

/**
 * Combine an arbitrary array of Certainty Factors incrementally
 */
export function combineMultipleCFs(cfArray) {
  if (!cfArray || cfArray.length === 0) return { finalCF: 0, steps: [] };
  if (cfArray.length === 1) return { finalCF: Number(cfArray[0].toFixed(4)), steps: [] };

  const steps = [];
  let runningCF = cfArray[0];

  for (let i = 1; i < cfArray.length; i++) {
    const nextCF = cfArray[i];
    const res = combineTwoCFs(runningCF, nextCF);
    steps.push({
      iteration: i,
      cfPrev: runningCF,
      cfNew: nextCF,
      formula: res.formulaUsed,
      result: res.combined
    });
    runningCF = res.combined;
  }

  return {
    finalCF: Number(runningCF.toFixed(4)),
    steps
  };
}

/**
 * Standard CF Rules for evaluating supplier suitability hypothesis H: "Supplier is Highly Suitable"
 */
export const CF_SUPPLIER_RULES = [
  {
    id: "CF-R1",
    name: "Quality Audit Evidence",
    hypothesis: "Supplier is Highly Suitable",
    ruleCF: 0.85,
    extractEvidenceCF: (s) => {
      // Map quality [50, 100] to [-1, 1]
      return Math.max(-1, Math.min(1, (s.quality - 75) / 20));
    },
    description: "IF supplier maintains high QA compliance THEN supplier is suitable (CF = 0.85)."
  },
  {
    id: "CF-R2",
    name: "Delivery SLA Adherence Evidence",
    hypothesis: "Supplier is Highly Suitable",
    ruleCF: 0.75,
    extractEvidenceCF: (s) => {
      // Delivery: <= 4 days is +1, >= 8 days is -1
      return Math.max(-1, Math.min(1, (6 - s.deliveryTime) / 2));
    },
    description: "IF delivery lead time is minimal THEN supplier is suitable (CF = 0.75)."
  },
  {
    id: "CF-R3",
    name: "Contractual Reliability Evidence",
    hypothesis: "Supplier is Highly Suitable",
    ruleCF: 0.90,
    extractEvidenceCF: (s) => {
      return Math.max(-1, Math.min(1, (s.reliability - 75) / 20));
    },
    description: "IF historical fulfillment reliability is dependable THEN supplier is suitable (CF = 0.90)."
  },
  {
    id: "CF-R4",
    name: "Cost Disqualification Pressure",
    hypothesis: "Supplier is Highly Suitable",
    ruleCF: -0.65, // Negative rule: high cost reduces suitability
    extractEvidenceCF: (s) => {
      // If cost > 60000, trigger negative evidence
      return s.cost > 60000 ? Math.min(1, (s.cost - 60000) / 15000) : 0;
    },
    description: "IF unit quote substantially exceeds standard threshold THEN confidence in suitability is degraded (CF = -0.65)."
  }
];

/**
 * Evaluate a supplier across all Certainty Factor rules and combine the resulting evidence
 */
export function evaluateSupplierCertaintyFactors(supplier, rules = CF_SUPPLIER_RULES) {
  const ruleEvaluations = [];
  const propagatedCFs = [];

  rules.forEach(rule => {
    const evidenceCF = Number(rule.extractEvidenceCF(supplier).toFixed(3));
    let propagatedCF = 0;

    if (evidenceCF > 0) {
      propagatedCF = Number((evidenceCF * rule.ruleCF).toFixed(4));
    } else if (evidenceCF < 0 && rule.ruleCF > 0) {
      // In MYCIN, negative evidence attenuates or flips belief
      propagatedCF = Number((evidenceCF * rule.ruleCF).toFixed(4));
    } else {
      propagatedCF = 0;
    }

    ruleEvaluations.push({
      ruleId: rule.id,
      name: rule.name,
      ruleCF: rule.ruleCF,
      evidenceCF,
      propagatedCF,
      description: rule.description
    });

    if (propagatedCF !== 0) {
      propagatedCFs.push(propagatedCF);
    }
  });

  const combination = combineMultipleCFs(propagatedCFs);

  let qualitativeRating = "Indifferent / Uncertain";
  if (combination.finalCF >= 0.75) qualitativeRating = "Strongly Confirmed Suitable";
  else if (combination.finalCF >= 0.40) qualitativeRating = "Mildly Supported Suitable";
  else if (combination.finalCF > -0.20 && combination.finalCF < 0.40) qualitativeRating = "Inconclusive Evidence";
  else if (combination.finalCF <= -0.50) qualitativeRating = "Strongly Disconfirmed / Unsuitable";
  else qualitativeRating = "Mildly Disfavored";

  return {
    supplierName: supplier.name,
    ruleEvaluations,
    propagatedCFs,
    combinationSteps: combination.steps,
    finalCF: combination.finalCF,
    confidencePercentage: Number((combination.finalCF * 100).toFixed(1)),
    qualitativeRating,
    interpretation: `Under the Shortliffe Certainty Factor model, synthesizing ${propagatedCFs.length} active pieces of evidence yields a composite Certainty Factor of ${combination.finalCF} (${(combination.finalCF * 100).toFixed(1)}% certainty), concluding "${qualitativeRating}".`
  };
}


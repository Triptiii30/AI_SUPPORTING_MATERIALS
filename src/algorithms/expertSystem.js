/**
 * Rule-Based Expert System for Supplier Evaluation with Certainty Factors
 * Architecture:
 * 1. Working Memory (Fact Base extracted from Supplier Profile & Procurement Requirements)
 * 2. Rule Base (Production Rules: IF-THEN with priorities, categories, CF values, and antecedent expressions)
 * 3. Inference Engine (Forward Chaining with conflict resolution, cycle detection, and CF propagation)
 * 4. Explanation Facility (Deep introspection: WHY, HOW, Fired rules, Facts used, Rejection factors, Confidence)
 * 5. Knowledge Acquisition Interface (Configurable rule additions and overrides)
 */

import { combineMultipleCFs } from './certaintyFactors';

export const DEFAULT_PRODUCTION_RULES = [
  {
    id: "RULE-01",
    name: "Baseline Quality & Reliability Benchmark",
    priority: 10,
    category: "Quality/Reliability",
    certaintyFactor: 0.85,
    conditionText: "IF quality >= 85 AND reliability >= 85",
    actionText: "THEN status_quality_reliability = 'Qualified'",
    consequenceKey: "status_quality_reliability",
    consequenceVal: "Qualified",
    evaluate: (facts) => facts.quality >= 85 && facts.reliability >= 85,
    rationale: "Assures minimum defect tolerance and baseline contractual commitment."
  },
  {
    id: "RULE-02",
    name: "Expedited Lead-Time Qualification",
    priority: 20,
    category: "Delivery Logistics",
    certaintyFactor: 0.80,
    conditionText: "IF deliveryTime <= 5 AND deliveryTime <= requiredDelivery",
    actionText: "THEN status_delivery = 'Fast-Dispatch Preferred'",
    consequenceKey: "status_delivery",
    consequenceVal: "Fast-Dispatch Preferred",
    evaluate: (facts) => facts.deliveryTime <= 5 && facts.deliveryTime <= facts.requiredDelivery,
    rationale: "Rapid order fulfillment pipeline prevents supply chain inventory stockouts."
  },
  {
    id: "RULE-03",
    name: "Commercial Budget & Volume Feasibility",
    priority: 30,
    category: "Commercial Feasibility",
    certaintyFactor: 0.85,
    conditionText: "IF cost <= maxBudget AND capacity >= requiredCapacity",
    actionText: "THEN status_budget_capacity = 'Commercially Feasible'",
    consequenceKey: "status_budget_capacity",
    consequenceVal: "Commercially Feasible",
    evaluate: (facts) => facts.cost <= facts.maxBudget && facts.capacity >= facts.requiredCapacity,
    rationale: "Vendor satisfies strict project budget caps and monthly fulfillment quotas."
  },
  {
    id: "RULE-04",
    name: "Gold Tier Prime Vendor Certification",
    priority: 50,
    category: "Final Recommendation",
    certaintyFactor: 0.95,
    conditionText: "IF quality >= 90 AND reliability >= 90 AND deliveryTime <= 5 AND cost <= maxBudget",
    actionText: "THEN final_recommendation = 'Highly Recommended (Gold Tier)'",
    consequenceKey: "final_recommendation",
    consequenceVal: "Highly Recommended (Gold Tier)",
    evaluate: (facts) => facts.quality >= 90 && facts.reliability >= 90 && facts.deliveryTime <= 5 && facts.cost <= facts.maxBudget,
    rationale: "Exemplary across all primary performance vectors. Recommended for critical primary contract."
  },
  {
    id: "RULE-05",
    name: "High Operational Risk Rejection Flag",
    priority: 60,
    category: "Risk Control",
    certaintyFactor: -0.90, // Discrediting evidence
    conditionText: "IF quality < 85 OR reliability < 82",
    actionText: "THEN risk_flag = 'High Operational Risk'",
    consequenceKey: "risk_flag",
    consequenceVal: "High Operational Risk",
    evaluate: (facts) => facts.quality < 85 || facts.reliability < 82,
    rationale: "Defects or SLA lapses pose severe operational bottlenecks; disqualifies from prime tier."
  },
  {
    id: "RULE-06",
    name: "Strategic Enterprise Scale Endorsement",
    priority: 25,
    category: "Enterprise Scalability",
    certaintyFactor: 0.80,
    conditionText: "IF capacity >= 1200 AND reliability >= 90",
    actionText: "THEN enterprise_scale = 'Strategic Enterprise Partner'",
    consequenceKey: "enterprise_scale",
    consequenceVal: "Strategic Enterprise Partner",
    evaluate: (facts) => facts.capacity >= 1200 && facts.reliability >= 90,
    rationale: "High buffer capacity capable of absorbing sudden manufacturing surge demands."
  },
  {
    id: "RULE-07",
    name: "Standard Approved Supplier Recommendation",
    priority: 40,
    category: "Final Recommendation",
    certaintyFactor: 0.85,
    conditionText: "IF quality >= 85 AND reliability >= 85 AND cost <= maxBudget AND deliveryTime <= requiredDelivery",
    actionText: "THEN final_recommendation = 'Approved Standard Supplier'",
    consequenceKey: "final_recommendation",
    consequenceVal: "Approved Standard Supplier",
    evaluate: (facts) => facts.quality >= 85 && facts.reliability >= 85 && facts.cost <= facts.maxBudget && facts.deliveryTime <= facts.requiredDelivery,
    rationale: "Meets all procurement criteria comfortably for general manufacturing supply."
  }
];

/**
 * Extract working memory facts for the Expert System from supplier and requirements
 */
export function extractWorkingMemory(supplier, requirements = {}) {
  return {
    supplierName: supplier.name,
    product: supplier.product,
    quality: Number(supplier.quality),
    reliability: Number(supplier.reliability),
    deliveryTime: Number(supplier.deliveryTime),
    cost: Number(supplier.cost),
    capacity: Number(supplier.capacity),
    maxBudget: Number(requirements.maxBudget || 60000),
    requiredCapacity: Number(requirements.requiredCapacity || 800),
    requiredDelivery: Number(requirements.maxDelivery || 7),
    targetProduct: requirements.product || supplier.product
  };
}

/**
 * Forward Chaining Inference Engine with Conflict Resolution and Explanation Facility
 */
export function runForwardChainingInference(workingMemory, ruleBase = DEFAULT_PRODUCTION_RULES) {
  const currentFacts = { ...workingMemory };
  const executionTrace = [];
  const firedRules = [];
  const dormantRules = [];
  const rejectedReasons = [];

  // Sort rules by priority descending (Conflict resolution: Highest Priority First)
  const sortedRules = [...ruleBase].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  let cycle = 1;
  const maxCycles = 5;
  let newFactDeduced = true;

  while (newFactDeduced && cycle <= maxCycles) {
    newFactDeduced = false;

    for (const rule of sortedRules) {
      // Check if rule already fired
      if (firedRules.some(r => r.id === rule.id)) continue;

      const conditionMet = rule.evaluate(currentFacts);

      if (conditionMet) {
        // Rule Fired!
        firedRules.push(rule);
        const existingPriority = currentFacts[`_priority_${rule.consequenceKey}`] || 0;
        if (!currentFacts[rule.consequenceKey] || rule.priority >= existingPriority) {
          currentFacts[rule.consequenceKey] = rule.consequenceVal;
          currentFacts[`_priority_${rule.consequenceKey}`] = rule.priority;
        }
        newFactDeduced = true;

        executionTrace.push({
          cycle,
          ruleId: rule.id,
          ruleName: rule.name,
          priority: rule.priority,
          certaintyFactor: rule.certaintyFactor ?? 0.85,
          condition: rule.conditionText,
          consequence: `${rule.consequenceKey} = "${rule.consequenceVal}"`,
          rationale: rule.rationale,
          status: "FIRED"
        });
      }
    }
    cycle++;
  }

  // Synthesize Certainty Factors of fired rules
  const positiveCFs = firedRules
    .filter(r => (r.certaintyFactor || 0) > 0)
    .map(r => r.certaintyFactor);
  const negativeCFs = firedRules
    .filter(r => (r.certaintyFactor || 0) < 0)
    .map(r => r.certaintyFactor);

  let compositeCF = 0.80;
  if (firedRules.some(r => r.id === "RULE-05")) {
    // If high risk rule fired, certainty is strongly negative/discredited
    compositeCF = -0.90;
  } else if (positiveCFs.length > 0) {
    const cfComb = combineMultipleCFs(positiveCFs);
    compositeCF = cfComb.finalCF;
  }

  // Identify dormant rules and why they did not fire
  sortedRules.forEach(rule => {
    if (!firedRules.some(r => r.id === rule.id)) {
      dormantRules.push(rule);

      // Detailed rejection diagnostics
      if (rule.id === "RULE-01" && (currentFacts.quality < 85 || currentFacts.reliability < 85)) {
        rejectedReasons.push(`Quality (${currentFacts.quality}%) or Reliability (${currentFacts.reliability}%) below baseline 85%.`);
      } else if (rule.id === "RULE-03" && currentFacts.cost > currentFacts.maxBudget) {
        rejectedReasons.push(`Unit quote ₹${currentFacts.cost.toLocaleString()} exceeds procurement budget ₹${currentFacts.maxBudget.toLocaleString()}.`);
      } else if (rule.id === "RULE-03" && currentFacts.capacity < currentFacts.requiredCapacity) {
        rejectedReasons.push(`Batch capacity ${currentFacts.capacity}u is below required ${currentFacts.requiredCapacity}u.`);
      } else if (rule.id === "RULE-02" && currentFacts.deliveryTime > currentFacts.requiredDelivery) {
        rejectedReasons.push(`Delivery lead time ${currentFacts.deliveryTime}d exceeds requirement ${currentFacts.requiredDelivery}d.`);
      }
    }
  });

  // Synthesize Final Recommendation Conclusion
  let recommendation = "Conditional / Further Audit Required";
  let badgeColor = "amber";

  if (currentFacts.risk_flag === "High Operational Risk") {
    recommendation = "Rejected: High Operational Risk";
    badgeColor = "rose";
  } else if (currentFacts.final_recommendation === "Highly Recommended (Gold Tier)") {
    recommendation = "Highly Recommended (Gold Tier Partner)";
    badgeColor = "emerald";
  } else if (currentFacts.final_recommendation === "Approved Standard Supplier") {
    recommendation = "Approved Standard Supplier";
    badgeColor = "emerald";
  } else if (currentFacts.status_quality_reliability === "Qualified" && currentFacts.status_budget_capacity === "Commercially Feasible") {
    recommendation = "Acceptable Qualified Supplier";
    badgeColor = "blue";
  }

  // Build Comprehensive Explanation
  const explanation = {
    evaluatedSupplier: workingMemory.supplierName,
    conclusion: recommendation,
    badgeColor,
    confidenceCF: compositeCF,
    confidencePercentage: Math.round(compositeCF * 100),
    workingMemoryFacts: workingMemory,
    firedRuleCount: firedRules.length,
    dormantRuleCount: dormantRules.length,
    firedRules: firedRules.map(r => ({
      id: r.id,
      name: r.name,
      cf: r.certaintyFactor,
      condition: r.conditionText,
      action: r.actionText
    })),
    executionTrace,
    rejectionReasons: rejectedReasons.length > 0 ? rejectedReasons : ["No operational disqualifications detected."],
    whyExplanation: buildWhyExplanation(recommendation, firedRules, rejectedReasons, compositeCF),
    howExplanation: buildHowExplanation(executionTrace)
  };

  return {
    recommendation,
    badgeColor,
    confidenceCF: compositeCF,
    confidencePercentage: Math.round(compositeCF * 100),
    facts: currentFacts,
    firedRules,
    dormantRules,
    executionTrace,
    explanation,
    firedCount: firedRules.length,
    totalRulesEvaluated: ruleBase.length
  };
}

function buildWhyExplanation(recommendation, firedRules, rejectionReasons, compositeCF) {
  if (recommendation.includes("Highly Recommended")) {
    return `Supplier was awarded Gold Tier certification with Certainty Factor CF = +${compositeCF.toFixed(2)} (${Math.round(compositeCF * 100)}% confidence). All prime conditions satisfied: Quality ≥ 90%, Reliability ≥ 90%, Lead Time ≤ 5 days, and Cost within budget.`;
  }
  if (recommendation.includes("Rejected")) {
    return `Supplier was disqualified with negative Certainty Factor CF = ${compositeCF.toFixed(2)} due to operational risks: ${rejectionReasons.join('; ')}`;
  }
  if (recommendation.includes("Approved Standard")) {
    return `Supplier satisfies standard procurement rules with Certainty Factor CF = +${compositeCF.toFixed(2)} (${Math.round(compositeCF * 100)}% confidence), meeting commercial budget and quality benchmarks.`;
  }
  return `Supplier meets partial criteria (CF = ${compositeCF.toFixed(2)}) and requires executive negotiation.`;
}

function buildHowExplanation(executionTrace) {
  if (executionTrace.length === 0) {
    return "No production rules matched the working memory facts.";
  }
  return executionTrace
    .map((step, idx) => `Step ${idx + 1}: Fired [${step.ruleId}] "${step.ruleName}" (CF: ${step.certaintyFactor}) under ${step.condition} → Deduced: ${step.consequence}`)
    .join("\n");
}

export function evaluateExpertRules(supplier, requirements) {
  const memory = extractWorkingMemory(supplier, requirements);
  return runForwardChainingInference(memory, DEFAULT_PRODUCTION_RULES);
}
export const EXPERT_RULES = DEFAULT_PRODUCTION_RULES;

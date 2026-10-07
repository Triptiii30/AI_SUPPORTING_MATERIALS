/**
 * Rule-Based Expert System for Supplier Evaluation
 * Implements forward chaining, fact matching, and rule activation logs.
 */

export const EXPERT_RULES = [
  {
    id: "RULE-01",
    name: "Reliability & Quality Baseline",
    conditionText: "IF quality >= 85 AND reliability >= 85",
    actionText: "THEN supplier_status = 'Reliable'",
    category: "Quality/Reliability",
    evaluate: (supplier, req) => supplier.quality >= 85 && supplier.reliability >= 85,
    consequence: "Supplier satisfies prime reliability and quality baseline benchmarks."
  },
  {
    id: "RULE-02",
    name: "Expedited Delivery Qualification",
    conditionText: "IF delivery <= 5 days AND quality >= 85",
    actionText: "THEN delivery_status = 'Preferred'",
    category: "Delivery Speed",
    evaluate: (supplier, req) => supplier.deliveryTime <= 5 && supplier.quality >= 85,
    consequence: "Qualifies as preferred fast-dispatch partner with minimal lead latency."
  },
  {
    id: "RULE-03",
    name: "Budget & Capacity Feasibility",
    conditionText: "IF cost <= budget AND capacity >= required_capacity",
    actionText: "THEN procurement_status = 'Suitable'",
    category: "Feasibility",
    evaluate: (supplier, req) => supplier.cost <= req.maxBudget && supplier.capacity >= req.requiredCapacity,
    consequence: "Meets total commercial expenditure limits and batch delivery volume constraints."
  },
  {
    id: "RULE-04",
    name: "Gold Tier Supplier Endorsement",
    conditionText: "IF quality >= 90 AND reliability >= 90 AND delivery <= 5",
    actionText: "THEN recommendation = 'Highly Recommended'",
    category: "Recommendation",
    evaluate: (supplier, req) => supplier.quality >= 90 && supplier.reliability >= 90 && supplier.deliveryTime <= 5,
    consequence: "Awarded top echelon classification for critical mission-tier supply contracts."
  },
  {
    id: "RULE-05",
    name: "High Operational Risk Flag",
    conditionText: "IF quality < 85 OR reliability < 82",
    actionText: "THEN risk_level = 'High Operational Risk'",
    category: "Risk",
    evaluate: (supplier, req) => supplier.quality < 85 || supplier.reliability < 82,
    consequence: "Alert: Potential defect variance or fulfillment slippage detected."
  },
  {
    id: "RULE-06",
    name: "Strategic Enterprise Scale",
    conditionText: "IF capacity >= 1200 AND reliability >= 90",
    actionText: "THEN strategic_scale = 'Enterprise Strategic Vendor'",
    category: "Capacity",
    evaluate: (supplier, req) => supplier.capacity >= 1200 && supplier.reliability >= 90,
    consequence: "Capable of handling enterprise-scale surging demands without bottleneck."
  }
];

/**
 * Evaluates all rules against a given supplier and procurement context.
 */
export function evaluateExpertRules(supplier, requirements) {
  const firedRules = [];
  const dormantRules = [];

  // Extract input facts
  const facts = {
    quality: supplier.quality,
    reliability: supplier.reliability,
    delivery: supplier.deliveryTime,
    cost: supplier.cost,
    capacity: supplier.capacity,
    budgetLimit: requirements.maxBudget,
    targetCapacity: requirements.requiredCapacity
  };

  EXPERT_RULES.forEach(rule => {
    const isFired = rule.evaluate(supplier, requirements);
    if (isFired) {
      firedRules.push({
        ...rule,
        status: "FIRED"
      });
    } else {
      dormantRules.push({
        ...rule,
        status: "NOT_FIRED"
      });
    }
  });

  // Synthesize inference
  const hasGoldRule = firedRules.some(r => r.id === "RULE-04");
  const hasReliableRule = firedRules.some(r => r.id === "RULE-01");
  const hasSuitable = firedRules.some(r => r.id === "RULE-03");
  const hasHighRisk = firedRules.some(r => r.id === "RULE-05");

  let status = "Conditional Match";
  let grade = "Standard";
  let badgeColor = "amber";

  if (hasGoldRule && hasSuitable) {
    status = "Highly Recommended";
    grade = "Gold Tier";
    badgeColor = "emerald";
  } else if (hasReliableRule && hasSuitable) {
    status = "Recommended";
    grade = "Silver Tier";
    badgeColor = "blue";
  } else if (hasHighRisk) {
    status = "Caution - Risk Identified";
    grade = "At Risk";
    badgeColor = "rose";
  }

  return {
    facts,
    firedRules,
    dormantRules,
    totalRulesEvaluated: EXPERT_RULES.length,
    firedCount: firedRules.length,
    status,
    grade,
    badgeColor,
    inferenceSummary: `Engine triggered ${firedRules.length} of ${EXPERT_RULES.length} knowledge rules resulting in ${grade} verdict.`
  };
}

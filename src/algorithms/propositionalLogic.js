/**
 * Propositional Logic Evaluation Engine
 * Supports propositional variables, logical connectives (AND, OR, NOT, IMPLIES, BICONDITIONAL),
 * expression evaluation, truth table generation, and supplier proposition satisfaction.
 */

export const CONNECTIVES = {
  AND: { symbol: "∧", name: "AND / Conjunction", fn: (p, q) => p && q },
  OR: { symbol: "∨", name: "OR / Disjunction", fn: (p, q) => p || q },
  NOT: { symbol: "¬", name: "NOT / Negation", fn: (p) => !p },
  IMPLIES: { symbol: "→", name: "Conditional / Implication", fn: (p, q) => (!p || q) },
  IFF: { symbol: "↔", name: "Biconditional / Equivalence", fn: (p, q) => (p === q) }
};

/**
 * Standard proposition definitions bound to supplier attributes
 */
export const DEFAULT_PROPOSITIONS = [
  {
    id: "P",
    name: "High Quality Standard",
    statement: "Supplier quality meets or exceeds acceptable threshold (≥ 88%)",
    predicate: (s) => s.quality >= 88
  },
  {
    id: "Q",
    name: "Delivery Within Lead SLA",
    statement: "Supplier delivery lead time is within acceptable limit (≤ 5 days)",
    predicate: (s) => s.deliveryTime <= 5
  },
  {
    id: "R",
    name: "Reliable Performance Track",
    statement: "Historical reliability rating is high (≥ 85%)",
    predicate: (s) => s.reliability >= 85
  },
  {
    id: "S",
    name: "Cost Within Budget",
    statement: "Unit cost is within standard baseline budget (≤ ₹55,000)",
    predicate: (s) => s.cost <= 55000
  },
  {
    id: "T",
    name: "Adequate Batch Capacity",
    statement: "Production capacity satisfies minimum batch volume (≥ 1,000 units)",
    predicate: (s) => s.capacity >= 1000
  }
];

/**
 * Standard propositional rules for supply chain evaluation
 */
export const DEFAULT_PROP_RULES = [
  {
    id: "PR-1",
    name: "Strategic Qualification Rule",
    formula: "(P ∧ Q) → R",
    antecedentVars: ["P", "Q"],
    consequentVar: "R",
    description: "If supplier has high quality (P) and fast delivery (Q), then supplier must be reliable (R).",
    evaluate: (vals) => (! (vals.P && vals.Q) ) || vals.R
  },
  {
    id: "PR-2",
    name: "Procurement Feasibility Rule",
    formula: "S ∧ T",
    antecedentVars: ["S", "T"],
    description: "Cost is within budget (S) AND production capacity is adequate (T).",
    evaluate: (vals) => vals.S && vals.T
  },
  {
    id: "PR-3",
    name: "Prime Vendor Criteria",
    formula: "(P ∧ R) ∧ (Q ∨ S)",
    antecedentVars: ["P", "R", "Q", "S"],
    description: "Quality AND reliability are high, and either delivery is fast OR cost is within budget.",
    evaluate: (vals) => (vals.P && vals.R) && (vals.Q || vals.S)
  },
  {
    id: "PR-4",
    name: "Non-Defect Risk Guarantee",
    formula: "¬P → ¬R",
    antecedentVars: ["P", "R"],
    description: "If supplier lacks high quality (¬P), supplier cannot be considered reliable (¬R).",
    evaluate: (vals) => (! (!vals.P)) || (!vals.R)
  }
];

/**
 * Evaluate truth value of all propositions for a given supplier
 */
export function evaluateSupplierPropositions(supplier, propositions = DEFAULT_PROPOSITIONS) {
  const values = {};
  const explanations = {};

  propositions.forEach(prop => {
    const isTrue = Boolean(prop.predicate(supplier));
    values[prop.id] = isTrue;
    explanations[prop.id] = {
      id: prop.id,
      name: prop.name,
      statement: prop.statement,
      value: isTrue,
      metricVal: getSupplierMetricForProp(supplier, prop.id)
    };
  });

  return { values, explanations };
}

function getSupplierMetricForProp(supplier, propId) {
  switch (propId) {
    case "P": return `Quality: ${supplier.quality}% (Threshold: ≥88%)`;
    case "Q": return `Delivery: ${supplier.deliveryTime}d (Threshold: ≤5d)`;
    case "R": return `Reliability: ${supplier.reliability}% (Threshold: ≥85%)`;
    case "S": return `Cost: ₹${Number(supplier.cost).toLocaleString()} (Threshold: ≤₹55,000)`;
    case "T": return `Capacity: ${supplier.capacity}u (Threshold: ≥1,000u)`;
    default: return "";
  }
}

/**
 * Evaluate a compound propositional rule for a given set of truth values
 */
export function evaluatePropositionalRule(rule, truthValues) {
  const result = Boolean(rule.evaluate(truthValues));
  const inputsUsed = {};
  (rule.antecedentVars || []).forEach(v => {
    inputsUsed[v] = truthValues[v];
  });
  if (rule.consequentVar) {
    inputsUsed[rule.consequentVar] = truthValues[rule.consequentVar];
  }

  return {
    ruleId: rule.id,
    formula: rule.formula,
    name: rule.name,
    result,
    inputsUsed,
    explanation: result 
      ? `Rule satisfied: Expression "${rule.formula}" evaluates to TRUE under current supplier facts.`
      : `Rule violated: Expression "${rule.formula}" evaluates to FALSE under current supplier facts.`
  };
}

/**
 * Generate a complete truth table for a given set of variables and evaluation function
 */
export function generateTruthTable(variables, evalFn) {
  const numRows = Math.pow(2, variables.length);
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    const rowValues = {};
    for (let j = 0; j < variables.length; j++) {
      // High order bit to low order bit
      const bit = (i >> (variables.length - 1 - j)) & 1;
      rowValues[variables[j]] = bit === 0; // standard convention: True first
    }
    const result = Boolean(evalFn(rowValues));
    rows.push({
      ...rowValues,
      result
    });
  }

  return {
    variables,
    rows
  };
}

/**
 * Parse and evaluate an arbitrary logical expression of propositions
 * Supported operators: &, |, !, ->, <->
 */
export function evaluateCustomExpression(expressionStr, values) {
  try {
    let expr = expressionStr
      .replace(/↔|<->/g, " === ")
      .replace(/→|->/g, " <= ")
      .replace(/∧|&&|\bAND\b|&/gi, " && ")
      .replace(/∨|\|\||\bOR\b|\|/gi, " || ")
      .replace(/¬|!\b|\bNOT\b|!/gi, " ! ");

    // Substitute variable values
    const substituted = expr.replace(/[A-Z]/g, (match) => {
      return typeof values[match] !== 'undefined' ? String(values[match]) : "false";
    });

    // Safely evaluate boolean logic
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return Boolean(${substituted});`);
    const result = fn();

    return {
      success: true,
      expression: expressionStr,
      result,
      substituted
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      result: false
    };
  }
}

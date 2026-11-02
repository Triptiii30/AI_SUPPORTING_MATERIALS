/**
 * First Order Logic (FOL) Predicate Engine
 * Implements project-specific predicates, variable unification, universal (∀) and existential (∃)
 * quantification, rule grounding over the supplier database, and structured proof explanations.
 */

/**
 * Predicate definitions evaluated over entities (suppliers, products, thresholds)
 */
export const FOL_PREDICATES = {
  Supplier: {
    symbol: "Supplier(x)",
    description: "x is a registered supplier in the system",
    evaluate: (x, context) => Boolean(context.suppliers.some(s => s.id === x.id || s.name === x.name))
  },
  Product: {
    symbol: "Product(y)",
    description: "y is an industrial product type",
    evaluate: (y, context) => Boolean(context.products.includes(y))
  },
  Provides: {
    symbol: "Provides(x, y)",
    description: "Supplier x provides product y",
    evaluate: (x, y) => x.product.toLowerCase() === String(y).toLowerCase()
  },
  HighQuality: {
    symbol: "HighQuality(x)",
    description: "Supplier x achieves quality rating ≥ 90%",
    evaluate: (x, threshold = 90) => x.quality >= threshold
  },
  Reliable: {
    symbol: "Reliable(x)",
    description: "Supplier x achieves reliability rating ≥ 90%",
    evaluate: (x, threshold = 90) => x.reliability >= threshold
  },
  WithinBudget: {
    symbol: "WithinBudget(x, b)",
    description: "Supplier unit cost is within budget b",
    evaluate: (x, budget = 60000) => x.cost <= budget
  },
  FastDelivery: {
    symbol: "FastDelivery(x, maxDays)",
    description: "Supplier lead time is within maxDays",
    evaluate: (x, maxDays = 5) => x.deliveryTime <= maxDays
  },
  HighCapacity: {
    symbol: "HighCapacity(x, minCap)",
    description: "Supplier capacity meets or exceeds minCap units",
    evaluate: (x, minCap = 1000) => x.capacity >= minCap
  },
  CertifiedVendor: {
    symbol: "CertifiedVendor(x)",
    description: "x qualifies as a prime certified vendor: HighQuality(x) ∧ Reliable(x)",
    evaluate: (x) => x.quality >= 90 && x.reliability >= 90
  }
};

/**
 * Predefined First-Order Logic Formulas with quantified rules
 */
export const FOL_FORMULAS = [
  {
    id: "FOL-RULE-1",
    name: "Product Catalog Coverage Axiom",
    formula: "∀x (Supplier(x) → ∃y (Product(y) ∧ Provides(x, y)))",
    quantifier: "UNIVERSAL",
    variable: "x",
    meaning: "Every registered supplier provides at least one catalogued industrial product.",
    evaluate: (context) => {
      const results = context.suppliers.map(s => {
        const matchesProduct = context.products.some(p => FOL_PREDICATES.Provides.evaluate(s, p));
        return {
          entity: s.name,
          satisfied: matchesProduct,
          witness: matchesProduct ? s.product : null,
          groundFormula: `Supplier(${s.name}) → Provides(${s.name}, ${s.product}) [${matchesProduct ? "VALID" : "FALSE"}]`
        };
      });
      const allSatisfied = results.every(r => r.satisfied);
      return {
        formulaId: "FOL-RULE-1",
        satisfied: allSatisfied,
        proofType: "Universal Quantification Proof (∀x)",
        instances: results,
        summary: allSatisfied
          ? "Satisfied: Every supplier in active registry provides a valid catalog product."
          : "Violated: One or more suppliers do not match any catalog product."
      };
    }
  },
  {
    id: "FOL-RULE-2",
    name: "Strategic Vendor Certification Axiom",
    formula: "∀x (Supplier(x) ∧ HighQuality(x) ∧ Reliable(x) → CertifiedVendor(x))",
    quantifier: "UNIVERSAL",
    variable: "x",
    meaning: "Any registered supplier with quality ≥90% and reliability ≥90% is certified as a prime strategic vendor.",
    evaluate: (context) => {
      const results = context.suppliers.map(s => {
        const hq = FOL_PREDICATES.HighQuality.evaluate(s, 90);
        const rel = FOL_PREDICATES.Reliable.evaluate(s, 90);
        const cert = FOL_PREDICATES.CertifiedVendor.evaluate(s);
        const premise = hq && rel;
        const implication = (!premise) || cert;

        return {
          entity: s.name,
          premise,
          conclusion: cert,
          satisfied: implication,
          metrics: `Q: ${s.quality}%, R: ${s.reliability}%`,
          groundFormula: `HighQuality(${s.name})[${hq}] ∧ Reliable(${s.name})[${rel}] → CertifiedVendor(${s.name})[${cert}]`
        };
      });

      const certifiedEntities = results.filter(r => r.conclusion).map(r => r.entity);
      return {
        formulaId: "FOL-RULE-2",
        satisfied: true, // Logical implication holds vacuously or directly
        proofType: "Deductive Rule Derivation",
        certifiedEntities,
        instances: results,
        summary: `Rule derived ${certifiedEntities.length} Certified Vendors: ${certifiedEntities.join(', ') || 'None'}.`
      };
    }
  },
  {
    id: "FOL-RULE-3",
    name: "Procurement Feasibility Existential Axiom",
    formula: "∃x (Supplier(x) ∧ Provides(x, TargetProduct) ∧ WithinBudget(x, Budget) ∧ FastDelivery(x, MaxDays))",
    quantifier: "EXISTENTIAL",
    variable: "x",
    meaning: "There exists at least one supplier who supplies the required product, within budget, and within max lead days.",
    evaluate: (context) => {
      const targetProduct = context.requirements?.product || "Industrial Steel";
      const budget = context.requirements?.maxBudget || 60000;
      const maxDays = context.requirements?.maxDelivery || 6;

      const results = context.suppliers.map(s => {
        const supplies = FOL_PREDICATES.Provides.evaluate(s, targetProduct);
        const budgetOk = FOL_PREDICATES.WithinBudget.evaluate(s, budget);
        const deliveryOk = FOL_PREDICATES.FastDelivery.evaluate(s, maxDays);
        const satisfied = supplies && budgetOk && deliveryOk;

        return {
          entity: s.name,
          product: s.product,
          cost: s.cost,
          deliveryTime: s.deliveryTime,
          satisfied,
          groundFormula: `Provides(${s.name}, ${targetProduct})[${supplies}] ∧ WithinBudget(${s.name}, ₹${budget})[${budgetOk}] ∧ FastDelivery(${s.name}, ${maxDays}d)[${deliveryOk}]`
        };
      });

      const witnesses = results.filter(r => r.satisfied);
      const exists = witnesses.length > 0;

      return {
        formulaId: "FOL-RULE-3",
        satisfied: exists,
        proofType: "Existential Quantification Proof (∃x)",
        witnesses: witnesses.map(w => w.entity),
        instances: results,
        summary: exists
          ? `Existential condition holds: Found ${witnesses.length} feasible supplier(s) (${witnesses.map(w => w.entity).join(', ')}).`
          : `Existential condition FALSE: No supplier meets product, budget (≤₹${budget}), and lead time (≤${maxDays}d) simultaneously.`
      };
    }
  },
  {
    id: "FOL-RULE-4",
    name: "High-Volume Capacity Constraint",
    formula: "∀x (Supplier(x) ∧ HighCapacity(x, ReqCap) → ∃y (Tier1(x)))",
    quantifier: "UNIVERSAL",
    variable: "x",
    meaning: "All suppliers possessing high volume capacity (≥1200 units) are designated Tier-1 bulk producers.",
    evaluate: (context) => {
      const minCap = 1200;
      const results = context.suppliers.map(s => {
        const hasCap = FOL_PREDICATES.HighCapacity.evaluate(s, minCap);
        return {
          entity: s.name,
          capacity: s.capacity,
          satisfied: hasCap,
          groundFormula: `HighCapacity(${s.name}, ${s.capacity}u ≥ ${minCap}u) → Tier1(${s.name}) [${hasCap ? "QUALIFIED" : "STANDARD"}]`
        };
      });

      const tier1Entities = results.filter(r => r.satisfied).map(r => r.entity);
      return {
        formulaId: "FOL-RULE-4",
        satisfied: true,
        proofType: "Universal Capacity Partitioning",
        tier1Entities,
        instances: results,
        summary: `Identified ${tier1Entities.length} Tier-1 bulk suppliers: ${tier1Entities.join(', ')}.`
      };
    }
  }
];

/**
 * Run comprehensive FOL query across active suppliers
 */
export function evaluateAllFOLFormulas(suppliers, products, requirements) {
  const context = { suppliers, products, requirements };
  return FOL_FORMULAS.map(formula => ({
    ...formula,
    evaluation: formula.evaluate(context)
  }));
}


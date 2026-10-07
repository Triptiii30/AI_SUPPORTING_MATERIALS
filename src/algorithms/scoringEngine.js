/**
 * Multi-Criteria Decision Making (MCDM) Scoring Engine
 * Normalizes metrics, applies user-defined weights, and provides explainable score breakdowns.
 */

export const DEFAULT_WEIGHTS = {
  quality: 25,
  reliability: 25,
  cost: 20,
  delivery: 15,
  capacity: 15
};

export const DEFAULT_REQUIREMENTS = {
  product: "Industrial Steel",
  maxBudget: 60000,
  minQuality: 85,
  maxDelivery: 7,
  minReliability: 85,
  requiredCapacity: 900
};

/**
 * Filter suppliers against hard procurement constraints.
 */
export function filterSuppliersByConstraints(suppliers, requirements) {
  return suppliers.map(supplier => {
    const checks = {
      productMatch: !requirements.product || supplier.product.toLowerCase() === requirements.product.toLowerCase(),
      costCheck: supplier.cost <= requirements.maxBudget,
      qualityCheck: supplier.quality >= requirements.minQuality,
      deliveryCheck: supplier.deliveryTime <= requirements.maxDelivery,
      reliabilityCheck: supplier.reliability >= requirements.minReliability,
      capacityCheck: supplier.capacity >= requirements.requiredCapacity
    };

    const isEligible = Object.values(checks).every(Boolean);
    const failedReasons = [];

    if (!checks.productMatch) failedReasons.push(`Product mismatch (${supplier.product} vs requested ${requirements.product})`);
    if (!checks.costCheck) failedReasons.push(`Cost (₹${supplier.cost.toLocaleString()}) exceeds budget of ₹${requirements.maxBudget.toLocaleString()}`);
    if (!checks.qualityCheck) failedReasons.push(`Quality (${supplier.quality}%) below min threshold (${requirements.minQuality}%)`);
    if (!checks.deliveryCheck) failedReasons.push(`Delivery lead time (${supplier.deliveryTime}d) exceeds max (${requirements.maxDelivery}d)`);
    if (!checks.reliabilityCheck) failedReasons.push(`Reliability (${supplier.reliability}%) below min requirement (${requirements.minReliability}%)`);
    if (!checks.capacityCheck) failedReasons.push(`Capacity (${supplier.capacity} units) below required (${requirements.requiredCapacity})`);

    return {
      supplier,
      isEligible,
      checks,
      failedReasons
    };
  });
}

/**
 * Normalizes and scores suppliers based on MCDM Weighted Linear Combination.
 */
export function scoreSuppliers(suppliers, weights = DEFAULT_WEIGHTS, requirements = DEFAULT_REQUIREMENTS) {
  if (!suppliers || suppliers.length === 0) return [];

  // Determine bounds for min-max normalization
  const costs = suppliers.map(s => s.cost);
  const qualities = suppliers.map(s => s.quality);
  const deliveries = suppliers.map(s => s.deliveryTime);
  const reliabilities = suppliers.map(s => s.reliability);
  const capacities = suppliers.map(s => s.capacity);

  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const minDelivery = Math.min(...deliveries);
  const maxDelivery = Math.max(...deliveries);
  const maxCapacity = Math.max(...capacities);

  // Normalize weight totals to 100%
  const totalWeight = (weights.quality + weights.reliability + weights.cost + weights.delivery + weights.capacity) || 100;
  const wQ = (weights.quality / totalWeight);
  const wR = (weights.reliability / totalWeight);
  const wC = (weights.cost / totalWeight);
  const wD = (weights.delivery / totalWeight);
  const wCap = (weights.capacity / totalWeight);

  const scored = suppliers.map(supplier => {
    // Quality (higher is better, 0-100 scale)
    const normQuality = supplier.quality / 100;

    // Reliability (higher is better, 0-100 scale)
    const normReliability = supplier.reliability / 100;

    // Cost (lower is better, inverse min-max scaling)
    const normCost = maxCost === minCost ? 1 : 1 - ((supplier.cost - minCost) / (maxCost - minCost));

    // Delivery (faster is better, inverse scaling)
    const normDelivery = maxDelivery === minDelivery ? 1 : 1 - ((supplier.deliveryTime - minDelivery) / (maxDelivery - minDelivery));

    // Capacity (higher is better, relative to max available and required threshold)
    const normCapacity = Math.min(1, supplier.capacity / (requirements.requiredCapacity || maxCapacity));

    // Weighted contributions (in points out of 100)
    const qualityContrib = Number((normQuality * wQ * 100).toFixed(1));
    const reliabilityContrib = Number((normReliability * wR * 100).toFixed(1));
    const costContrib = Number((normCost * wC * 100).toFixed(1));
    const deliveryContrib = Number((normDelivery * wD * 100).toFixed(1));
    const capacityContrib = Number((normCapacity * wCap * 100).toFixed(1));

    const finalScore = Number((qualityContrib + reliabilityContrib + costContrib + deliveryContrib + capacityContrib).toFixed(1));

    return {
      supplier,
      norm: {
        quality: normQuality,
        reliability: normReliability,
        cost: normCost,
        delivery: normDelivery,
        capacity: normCapacity
      },
      contributions: {
        quality: qualityContrib,
        reliability: reliabilityContrib,
        cost: costContrib,
        delivery: deliveryContrib,
        capacity: capacityContrib
      },
      finalScore
    };
  });

  // Sort descending by finalScore
  return scored.sort((a, b) => b.finalScore - a.finalScore);
}

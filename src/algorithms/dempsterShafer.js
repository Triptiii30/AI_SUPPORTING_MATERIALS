/**
 * Dempster-Shafer Theory of Evidence Engine
 * Frame of Discernment: Θ = { S, U } where S = "Suitable", U = "Unsuitable"
 * Power set 2^Θ = { ∅, {S}, {U}, Θ }
 *
 * Implements:
 * 1. Basic Probability Assignment (BPA / Mass function m)
 * 2. Orthogonal sum combination matrix (Dempster's Rule)
 * 3. Conflict Metric K = ∑_{B ∩ C = ∅} m1(B)·m2(C)
 * 4. Normalization Factor (1 - K)
 * 5. Belief Function: Bel(A) = ∑_{B ⊆ A} m(B)
 * 6. Plausibility Function: Pl(A) = ∑_{B ∩ A ≠ ∅} m(B) = 1 - Bel(¬A)
 * 7. Epistemic Uncertainty Interval: [Bel(A), Pl(A)]
 * 8. Multi-Source Evidence Chaining (Source 1: Quality, Source 2: Financial, Source 3: Logistics)
 */

/**
 * Validate and normalize mass assignment: m(S) + m(U) + m(Θ) = 1.0
 */
export function normalizeMassAssignment({ m_S = 0.70, m_U = 0.10, m_Theta = 0.20 }) {
  const sum = m_S + m_U + m_Theta;
  if (sum === 0) return { m_S: 0, m_U: 0, m_Theta: 1 };
  return {
    m_S: Number((m_S / sum).toFixed(4)),
    m_U: Number((m_U / sum).toFixed(4)),
    m_Theta: Number((m_Theta / sum).toFixed(4))
  };
}

/**
 * Combine two independent evidence sources via Dempster's Rule of Combination
 */
export function combineTwoEvidenceSources(source1, source2) {
  const s1 = normalizeMassAssignment(source1);
  const s2 = normalizeMassAssignment(source2);

  // Orthogonal sum matrix cells:
  // Row entries: {S}, {U}, Θ from s1
  // Col entries: {S}, {U}, Θ from s2
  // Intersections:
  // {S} ∩ {S} = {S}
  // {S} ∩ {U} = ∅ (Conflict)
  // {S} ∩ Θ   = {S}
  // {U} ∩ {S} = ∅ (Conflict)
  // {U} ∩ {U} = {U}
  // {U} ∩ Θ   = {U}
  // Θ ∩ {S}   = {S}
  // Θ ∩ {U}   = {U}
  // Θ ∩ Θ     = Θ

  const tableau = [
    { s1Set: "{S}", s2Set: "{S}", intersection: "{S}", mass: s1.m_S * s2.m_S },
    { s1Set: "{S}", s2Set: "{U}", intersection: "∅", mass: s1.m_S * s2.m_U, isConflict: true },
    { s1Set: "{S}", s2Set: "Θ",   intersection: "{S}", mass: s1.m_S * s2.m_Theta },

    { s1Set: "{U}", s2Set: "{S}", intersection: "∅", mass: s1.m_U * s2.m_S, isConflict: true },
    { s1Set: "{U}", s2Set: "{U}", intersection: "{U}", mass: s1.m_U * s2.m_U },
    { s1Set: "{U}", s2Set: "Θ",   intersection: "{U}", mass: s1.m_U * s2.m_Theta },

    { s1Set: "Θ",   s2Set: "{S}", intersection: "{S}", mass: s1.m_Theta * s2.m_S },
    { s1Set: "Θ",   s2Set: "{U}", intersection: "{U}", mass: s1.m_Theta * s2.m_U },
    { s1Set: "Θ",   s2Set: "Θ",   intersection: "Θ",   mass: s1.m_Theta * s2.m_Theta }
  ];

  // Conflict Metric K = sum of conflicting masses (intersection = ∅)
  const conflictK = (s1.m_S * s2.m_U) + (s1.m_U * s2.m_S);
  const denominator = 1 - conflictK;

  if (denominator <= 0) {
    return {
      isTotalConflict: true,
      conflictK: 1.0,
      tableau,
      error: "Complete conflict (K = 1.0). Evidence sources are mutually irreconcilable."
    };
  }

  // Combined masses before normalization
  const numS = (s1.m_S * s2.m_S) + (s1.m_S * s2.m_Theta) + (s1.m_Theta * s2.m_S);
  const numU = (s1.m_U * s2.m_U) + (s1.m_U * s2.m_Theta) + (s1.m_Theta * s2.m_U);
  const numTheta = s1.m_Theta * s2.m_Theta;

  // Normalized masses
  const m_comb_S = numS / denominator;
  const m_comb_U = numU / denominator;
  const m_comb_Theta = numTheta / denominator;

  // Belief Bel(A) = m(A)
  const bel_S = m_comb_S;
  const bel_U = m_comb_U;

  // Plausibility Pl(A) = m(A) + m(Θ)
  const pl_S = m_comb_S + m_comb_Theta;
  const pl_U = m_comb_U + m_comb_Theta;

  return {
    isTotalConflict: false,
    s1,
    s2,
    conflictK: Number(conflictK.toFixed(4)),
    normalizationFactor: Number((1 / denominator).toFixed(4)),
    tableau: tableau.map(t => ({ ...t, mass: Number(t.mass.toFixed(4)) })),
    combinedMass: {
      m_S: Number(m_comb_S.toFixed(4)),
      m_U: Number(m_comb_U.toFixed(4)),
      m_Theta: Number(m_comb_Theta.toFixed(4))
    },
    belief_S: Number(bel_S.toFixed(4)),
    plausibility_S: Number(pl_S.toFixed(4)),
    belief_U: Number(bel_U.toFixed(4)),
    plausibility_U: Number(pl_U.toFixed(4)),
    uncertaintyInterval_S: [Number(bel_S.toFixed(4)), Number(pl_S.toFixed(4))],
    epistemicUncertainty: Number(m_comb_Theta.toFixed(4))
  };
}

/**
 * Combine three evidence sources:
 * Source 1: Quality Inspection Audit
 * Source 2: Financial Stability Bureau
 * Source 3: Logistics & Lead-time Tracker
 */
export function combineThreeEvidenceSources(source1, source2, source3) {
  // Step 1: Combine S1 and S2
  const step1 = combineTwoEvidenceSources(source1, source2);
  if (step1.isTotalConflict) {
    return { step1, step2: null, final: step1 };
  }

  // Step 2: Combine result of (S1 ⊕ S2) with Source 3
  const intermediateSource = {
    m_S: step1.combinedMass.m_S,
    m_U: step1.combinedMass.m_U,
    m_Theta: step1.combinedMass.m_Theta
  };
  const step2 = combineTwoEvidenceSources(intermediateSource, source3);

  return {
    source1,
    source2,
    source3,
    step1Result: step1,
    step2Result: step2,
    finalBelief_S: step2.belief_S,
    finalPlausibility_S: step2.plausibility_S,
    totalConflictK: step2.conflictK,
    explanation: `Evidence fusion across 3 sources establishes Belief Bel(Suitable) = ${(step2.belief_S * 100).toFixed(1)}% and Plausibility Pl(Suitable) = ${(step2.plausibility_S * 100).toFixed(1)}%, with remaining epistemic ignorance m(Θ) = ${(step2.epistemicUncertainty * 100).toFixed(1)}%.`
  };
}

/**
 * Derive evidence mass assignments dynamically from actual supplier metrics
 */
export function extractSupplierDSEvidence(supplier) {
  // Source 1: QA Compliance
  const qNorm = supplier.quality / 100;
  const s1 = {
    name: "QA Inspection Bureau",
    m_S: Number((Math.max(0.05, qNorm * 0.85)).toFixed(2)),
    m_U: Number((Math.max(0.05, (1 - qNorm) * 0.85)).toFixed(2)),
    m_Theta: 0.15
  };

  // Source 2: Reliability / Historical Audits
  const rNorm = supplier.reliability / 100;
  const s2 = {
    name: "Contractual Fulfillment Tracker",
    m_S: Number((Math.max(0.05, rNorm * 0.80)).toFixed(2)),
    m_U: Number((Math.max(0.05, (1 - rNorm) * 0.80)).toFixed(2)),
    m_Theta: 0.20
  };

  // Source 3: Logistics Lead Time
  // <= 4 days is positive, >= 7 days is unsuitability
  const dScore = Math.max(0, Math.min(1, (8 - supplier.deliveryTime) / 5));
  const s3 = {
    name: "Logistics Corridor Audits",
    m_S: Number((Math.max(0.05, dScore * 0.75)).toFixed(2)),
    m_U: Number((Math.max(0.05, (1 - dScore) * 0.75)).toFixed(2)),
    m_Theta: 0.25
  };

  return { s1, s2, s3 };
}


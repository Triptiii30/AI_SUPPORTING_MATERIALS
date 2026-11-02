/**
 * Bayesian Belief Network (BBN) for Supply Chain Operational Risk
 * Structure: Directed Acyclic Graph (DAG) with 5 Nodes:
 *   1. Reliability (R): Parent Node [Dependable, Fluctuating]
 *   2. FinancialStability (F): Parent Node [Strong, Vulnerable]
 *   3. DeliveryCompliance (D): Child of Reliability [OnTime, Delayed]
 *   4. ProductQuality (Q): Child of Reliability [HighQuality, Defective]
 *   5. OperationalRisk (Risk): Child of DeliveryCompliance, ProductQuality, FinancialStability [LowRisk, MedRisk, HighRisk]
 *
 * Full Joint Distribution:
 *   P(R, F, D, Q, Risk) = P(R) * P(F) * P(D | R) * P(Q | R) * P(Risk | D, Q, F)
 *
 * Implements exact Bayesian inference via joint distribution summation and Bayes conditioning.
 */

export const BBN_STRUCTURE = {
  nodes: [
    { id: "R", name: "Supplier Reliability", type: "parent", states: ["Dependable", "Fluctuating"] },
    { id: "F", name: "Financial Stability", type: "parent", states: ["Strong", "Vulnerable"] },
    { id: "D", name: "Delivery Compliance", type: "intermediate", states: ["OnTime", "Delayed"], parents: ["R"] },
    { id: "Q", name: "Product Quality", type: "intermediate", states: ["HighQuality", "Defective"], parents: ["R"] },
    { id: "Risk", name: "Operational Risk", type: "target", states: ["LowRisk", "MedRisk", "HighRisk"], parents: ["D", "Q", "F"] }
  ],
  edges: [
    { from: "R", to: "D", label: "influences delivery speed" },
    { from: "R", to: "Q", label: "influences defect rate" },
    { from: "D", to: "Risk", label: "transit bottleneck impact" },
    { from: "Q", to: "Risk", label: "rejection & scrap impact" },
    { from: "F", to: "Risk", label: "solvency & continuity impact" }
  ]
};

// Conditional Probability Tables (CPTs)
export const BBN_CPTS = {
  // P(R)
  R: {
    Dependable: 0.70,
    Fluctuating: 0.30
  },

  // P(F)
  F: {
    Strong: 0.80,
    Vulnerable: 0.20
  },

  // P(D | R)
  D: {
    Dependable: { OnTime: 0.88, Delayed: 0.12 },
    Fluctuating: { OnTime: 0.35, Delayed: 0.65 }
  },

  // P(Q | R)
  Q: {
    Dependable: { HighQuality: 0.92, Defective: 0.08 },
    Fluctuating: { HighQuality: 0.45, Defective: 0.55 }
  },

  // P(Risk | D, Q, F)
  Risk: {
    // D, Q, F combinations -> [LowRisk, MedRisk, HighRisk]
    "OnTime_HighQuality_Strong": { LowRisk: 0.92, MedRisk: 0.07, HighRisk: 0.01 },
    "OnTime_HighQuality_Vulnerable": { LowRisk: 0.60, MedRisk: 0.30, HighRisk: 0.10 },
    "OnTime_Defective_Strong": { LowRisk: 0.25, MedRisk: 0.55, HighRisk: 0.20 },
    "OnTime_Defective_Vulnerable": { LowRisk: 0.10, MedRisk: 0.40, HighRisk: 0.50 },
    "Delayed_HighQuality_Strong": { LowRisk: 0.35, MedRisk: 0.50, HighRisk: 0.15 },
    "Delayed_HighQuality_Vulnerable": { LowRisk: 0.15, MedRisk: 0.45, HighRisk: 0.40 },
    "Delayed_Defective_Strong": { LowRisk: 0.05, MedRisk: 0.35, HighRisk: 0.60 },
    "Delayed_Defective_Vulnerable": { LowRisk: 0.01, MedRisk: 0.19, HighRisk: 0.80 }
  }
};

/**
 * Compute the full joint probability of a specific state configuration:
 * P(r, f, d, q, risk)
 */
export function getJointProbability(r, f, d, q, risk) {
  const pR = BBN_CPTS.R[r];
  const pF = BBN_CPTS.F[f];
  const pD = BBN_CPTS.D[r][d];
  const pQ = BBN_CPTS.Q[r][q];
  const keyRisk = `${d}_${q}_${f}`;
  const pRisk = BBN_CPTS.Risk[keyRisk][risk];

  return pR * pF * pD * pQ * pRisk;
}

/**
 * Exact inference: Query marginal distribution of any target node given observed evidence
 * evidence: e.g. { D: "Delayed", F: "Vulnerable" }
 */
export function inferBayesianNetwork(targetNodeId = "Risk", evidence = {}) {
  const statesR = ["Dependable", "Fluctuating"];
  const statesF = ["Strong", "Vulnerable"];
  const statesD = ["OnTime", "Delayed"];
  const statesQ = ["HighQuality", "Defective"];
  const statesRisk = ["LowRisk", "MedRisk", "HighRisk"];

  const targetNode = BBN_STRUCTURE.nodes.find(n => n.id === targetNodeId);
  if (!targetNode) throw new Error(`Unknown node ${targetNodeId}`);

  // Calculate unnormalized joint sum for each state of targetNode matching evidence
  const posteriorSums = {};
  targetNode.states.forEach(state => {
    posteriorSums[state] = 0;
  });

  let totalEvidenceProbability = 0;

  for (const r of statesR) {
    if (evidence.R && evidence.R !== r) continue;
    for (const f of statesF) {
      if (evidence.F && evidence.F !== f) continue;
      for (const d of statesD) {
        if (evidence.D && evidence.D !== d) continue;
        for (const q of statesQ) {
          if (evidence.Q && evidence.Q !== q) continue;
          for (const risk of statesRisk) {
            if (evidence.Risk && evidence.Risk !== risk) continue;

            const jointProb = getJointProbability(r, f, d, q, risk);
            totalEvidenceProbability += jointProb;

            // Attribute to target state
            let currentTargetState;
            if (targetNodeId === "R") currentTargetState = r;
            else if (targetNodeId === "F") currentTargetState = f;
            else if (targetNodeId === "D") currentTargetState = d;
            else if (targetNodeId === "Q") currentTargetState = q;
            else if (targetNodeId === "Risk") currentTargetState = risk;

            posteriorSums[currentTargetState] += jointProb;
          }
        }
      }
    }
  }

  // Normalize posteriors
  const normalizedPosterior = {};
  Object.keys(posteriorSums).forEach(state => {
    normalizedPosterior[state] = totalEvidenceProbability > 0 
      ? Number((posteriorSums[state] / totalEvidenceProbability).toFixed(4))
      : 0;
  });

  return {
    targetNodeId,
    targetNodeName: targetNode.name,
    evidenceApplied: evidence,
    evidenceProbability: Number(totalEvidenceProbability.toFixed(5)),
    posteriorDistribution: normalizedPosterior,
    explanation: buildBBNExplanation(targetNode.name, normalizedPosterior, evidence)
  };
}

function buildBBNExplanation(nodeName, posterior, evidence) {
  const evidenceKeys = Object.keys(evidence);
  const evidenceText = evidenceKeys.length > 0 
    ? `conditioned on observed evidence [${evidenceKeys.map(k => `${k}=${evidence[k]}`).join(', ')}]`
    : `with no prior evidence observed (prior marginal distribution)`;

  const dominantState = Object.keys(posterior).reduce((a, b) => posterior[a] >= posterior[b] ? a : b);
  const dominantPercent = (posterior[dominantState] * 100).toFixed(1);

  return `For node "${nodeName}" ${evidenceText}, the inferred belief distribution indicates that the most probable state is "${dominantState}" with ${dominantPercent}% posterior probability.`;
}


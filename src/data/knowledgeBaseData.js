/**
 * Knowledge Base definitions for Knowledge Representation:
 * Triples (Ontology), Propositional Logic, First-Order Logic (FOL),
 * Semantic Network graphs, and Frame Representation schemas.
 */

export const INITIAL_TRIPLES = [
  { subject: "ABC Suppliers", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "ABC Suppliers", predicate: "hasQuality", object: "91% (High)", category: "Quality" },
  { subject: "ABC Suppliers", predicate: "hasReliability", object: "92% (High)", category: "Reliability" },
  { subject: "ABC Suppliers", predicate: "hasDeliveryTime", object: "5 Days", category: "Delivery" },
  { subject: "ABC Suppliers", predicate: "hasUnitCost", object: "₹50,000", category: "Cost" },
  { subject: "ABC Suppliers", predicate: "hasCapacity", object: "1000 Units", category: "Capacity" },
  { subject: "Prime Supply Co.", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "Prime Supply Co.", predicate: "hasQuality", object: "95% (Superior)", category: "Quality" },
  { subject: "Prime Supply Co.", predicate: "hasReliability", object: "96% (Superior)", category: "Reliability" },
  { subject: "XYZ Industries", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "Apex Precision Metals", predicate: "supplies", object: "Precision Bearings", category: "Product" },
  { subject: "Vertex Micro-Tech", predicate: "supplies", object: "Microchips", category: "Product" }
];

export const FOL_RULES = [
  {
    id: "FOL-01",
    formula: "∀x (Supplier(x) → ∃y (Product(y) ∧ Provides(x, y)))",
    meaning: "Every registered supplier provides at least one catalogued industrial product.",
    groundInstances: [
      "Supplier(ABC_Suppliers) → Provides(ABC_Suppliers, Industrial_Steel)",
      "Supplier(Apex_Metals) → Provides(Apex_Metals, Precision_Bearings)"
    ]
  },
  {
    id: "FOL-02",
    formula: "∀x (Supplier(x) ∧ HighQuality(x) ∧ HighReliability(x) → CertifiedVendor(x))",
    meaning: "Any supplier with both high quality and high reliability is certified as a prime strategic vendor.",
    groundInstances: [
      "Supplier(Prime_Co) ∧ HighQuality(Prime_Co) ∧ HighReliability(Prime_Co) → CertifiedVendor(Prime_Co) [VALID]"
    ]
  },
  {
    id: "FOL-03",
    formula: "∀x (Supplier(x) ∧ Cost(x) ≤ Budget ∧ LeadTime(x) ≤ MaxDelivery → Feasible(x))",
    meaning: "A supplier is commercially feasible if quote is within budget and lead time respects timeline.",
    groundInstances: [
      "Supplier(ABC) ∧ Cost(ABC) ≤ 60k ∧ LeadTime(ABC) ≤ 7 → Feasible(ABC) [TRUE]"
    ]
  }
];

export const PROPOSITIONAL_RULES = [
  {
    symbolP: "P: Supplier achieves High Quality (≥85%)",
    symbolQ: "Q: Supplier achieves High Reliability (≥85%)",
    implication: "P ∧ Q → R (Reliable Strategic Partner)",
    symbolR: "R: Classified as Reliable Strategic Supplier"
  },
  {
    symbolP: "P: Lead Time ≤ 5 Days",
    symbolQ: "Q: Stock Capacity ≥ Required Threshold",
    implication: "P ∧ Q → F (Fulfillment Guaranteed)",
    symbolR: "F: Immediate Dispatch Fulfillment Guaranteed"
  }
];

/**
 * Builds dynamic Semantic Network Nodes & Edges for an arbitrary supplier
 */
export function buildSupplierSemanticGraph(supplier) {
  if (!supplier) return { nodes: [], edges: [] };

  const centerNode = { id: "root", label: supplier.name, type: "supplier", x: 260, y: 150 };

  const childNodes = [
    { id: "prod", label: supplier.product, type: "product", relation: "supplies", x: 420, y: 70 },
    { id: "qual", label: `${supplier.quality}% Quality`, type: "metric", relation: "hasQuality", x: 440, y: 160 },
    { id: "rel", label: `${supplier.reliability}% Reliability`, type: "metric", relation: "hasReliability", x: 410, y: 240 },
    { id: "cost", label: `₹${supplier.cost.toLocaleString()}`, type: "commercial", relation: "hasCost", x: 100, y: 80 },
    { id: "del", label: `${supplier.deliveryTime} Days Lead`, type: "logistics", relation: "hasDeliveryTime", x: 90, y: 170 },
    { id: "cap", label: `${supplier.capacity} Units`, type: "capacity", relation: "hasCapacity", x: 120, y: 250 }
  ];

  const edges = childNodes.map(child => ({
    from: "root",
    to: child.id,
    label: child.relation
  }));

  return {
    nodes: [centerNode, ...childNodes],
    edges
  };
}

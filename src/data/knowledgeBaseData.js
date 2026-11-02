/**
 * Knowledge Base definitions for Knowledge Representation:
 * Triples (Ontology), Propositional Logic, First-Order Logic (FOL),
 * Semantic Network graphs, and Frame Representation schemas.
 */

export * from '../algorithms/propositionalLogic';
export * from '../algorithms/firstOrderLogic';
export * from '../algorithms/frameSystem';

export const INITIAL_TRIPLES = [
  { subject: "ABC Suppliers", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "ABC Suppliers", predicate: "hasQuality", object: "91% (High)", category: "Quality" },
  { subject: "ABC Suppliers", predicate: "hasReliability", object: "92% (High)", category: "Reliability" },
  { subject: "ABC Suppliers", predicate: "hasDeliveryTime", object: "5 Days", category: "Delivery" },
  { subject: "ABC Suppliers", predicate: "hasUnitCost", object: "₹50,000", category: "Cost" },
  { subject: "ABC Suppliers", predicate: "hasCapacity", object: "1000 Units", category: "Capacity" },
  { subject: "ABC Suppliers", predicate: "locatedIn", object: "Eastern Industrial Corridor (Jamshedpur)", category: "Location" },
  
  { subject: "Prime Supply Co.", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "Prime Supply Co.", predicate: "hasQuality", object: "95% (Superior)", category: "Quality" },
  { subject: "Prime Supply Co.", predicate: "hasReliability", object: "96% (Superior)", category: "Reliability" },
  { subject: "Prime Supply Co.", predicate: "locatedIn", object: "Rourkela Steel Belt", category: "Location" },
  { subject: "Prime Supply Co.", predicate: "hasCertification", object: "ISO 9001:2015", category: "Standard" },

  { subject: "XYZ Industries", predicate: "supplies", object: "Industrial Steel", category: "Product" },
  { subject: "XYZ Industries", predicate: "hasQuality", object: "84% (Standard)", category: "Quality" },
  { subject: "XYZ Industries", predicate: "locatedIn", object: "Western Manufacturing Zone (Pune)", category: "Location" },

  { subject: "Apex Precision Metals", predicate: "supplies", object: "Precision Bearings", category: "Product" },
  { subject: "Apex Precision Metals", predicate: "hasQuality", object: "96% (High)", category: "Quality" },
  { subject: "Apex Precision Metals", predicate: "locatedIn", object: "Southern Technology Hub (Bengaluru)", category: "Location" },

  { subject: "Vertex Micro-Tech", predicate: "supplies", object: "Microchips", category: "Product" },
  { subject: "Industrial Steel", predicate: "isSubClassOf", object: "Raw Materials", category: "Taxonomy" },
  { subject: "Precision Bearings", predicate: "isSubClassOf", object: "Mechanical Components", category: "Taxonomy" },
  { subject: "Microchips", predicate: "isSubClassOf", object: "Electronics", category: "Taxonomy" }
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
    formula: "∀x (Supplier(x) ∧ HighQuality(x) ∧ Reliable(x) → CertifiedVendor(x))",
    meaning: "Any supplier with both high quality and high reliability is certified as a prime strategic vendor.",
    groundInstances: [
      "Supplier(Prime_Co) ∧ HighQuality(Prime_Co) ∧ Reliable(Prime_Co) → CertifiedVendor(Prime_Co) [VALID]"
    ]
  },
  {
    id: "FOL-03",
    formula: "∀x (Supplier(x) ∧ WithinBudget(x, Budget) ∧ FastDelivery(x, MaxDelivery) → Feasible(x))",
    meaning: "A supplier is commercially feasible if quote is within budget and lead time respects timeline.",
    groundInstances: [
      "Supplier(ABC) ∧ WithinBudget(ABC, ₹60k) ∧ FastDelivery(ABC, 7d) → Feasible(ABC) [TRUE]"
    ]
  }
];

export const PROPOSITIONAL_RULES = [
  {
    symbolP: "P: Supplier achieves High Quality (≥88%)",
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

  const centerNode = { id: "root", label: supplier.name, type: "supplier", x: 280, y: 160 };

  const childNodes = [
    { id: "prod", label: supplier.product, type: "product", relation: "supplies", x: 460, y: 80 },
    { id: "cat", label: "Raw Materials", type: "taxonomy", relation: "isSubClassOf", x: 600, y: 80 },
    { id: "qual", label: `${supplier.quality}% Quality`, type: "metric", relation: "hasQuality", x: 480, y: 160 },
    { id: "rel", label: `${supplier.reliability}% Reliability`, type: "metric", relation: "hasReliability", x: 450, y: 250 },
    { id: "cost", label: `₹${Number(supplier.cost).toLocaleString()}`, type: "commercial", relation: "hasCost", x: 100, y: 70 },
    { id: "del", label: `${supplier.deliveryTime} Days Lead`, type: "logistics", relation: "hasDeliveryTime", x: 80, y: 160 },
    { id: "cap", label: `${supplier.capacity} Units`, type: "capacity", relation: "hasCapacity", x: 100, y: 250 },
    { id: "loc", label: supplier.location || "Domestic Hub", type: "location", relation: "locatedIn", x: 280, y: 310 }
  ];

  const edges = [
    { from: "root", to: "prod", label: "supplies" },
    { from: "prod", to: "cat", label: "subClassOf" },
    { from: "root", to: "qual", label: "hasQuality" },
    { from: "root", to: "rel", label: "hasReliability" },
    { from: "root", to: "cost", label: "hasUnitCost" },
    { from: "root", to: "del", label: "hasDeliveryTime" },
    { from: "root", to: "cap", label: "hasCapacity" },
    { from: "root", to: "loc", label: "locatedIn" }
  ];

  return {
    nodes: [centerNode, ...childNodes],
    edges
  };
}

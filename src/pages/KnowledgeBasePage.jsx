import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  GitBranch, 
  FileCode, 
  Layers, 
  CheckCircle, 
  Network, 
  Info,
  ChevronRight,
  Boxes
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { FOL_RULES, PROPOSITIONAL_RULES, buildSupplierSemanticGraph } from '../data/knowledgeBaseData';

export default function KnowledgeBasePage() {
  const { triples, addTriple, suppliers } = useApp();

  const [activeTab, setActiveTab] = useState("ontology");
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  // Propositional Logic Interactive Simulator State
  const [propP, setPropP] = useState(true);
  const [propQ, setPropQ] = useState(true);
  const propConclusion = propP && propQ;

  // Add Assertion Form state
  const [newSubject, setNewSubject] = useState(suppliers[0]?.name || '');
  const [newPredicate, setNewPredicate] = useState('supplies');
  const [newObject, setNewObject] = useState('');
  const [newCategory, setNewCategory] = useState('Product');

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const semanticGraph = buildSupplierSemanticGraph(selectedSupplier);

  const handleAddAssertion = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newObject.trim()) return;

    addTriple({
      subject: newSubject.trim(),
      predicate: newPredicate.trim(),
      object: newObject.trim(),
      category: newCategory
    });

    setNewObject('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Formal Knowledge Representation</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Knowledge Base & Ontologies</h2>
          <p className="text-xs text-slate-500">
            Ontological Triples, Semantic Networks, Frame Systems, Propositional Logic, and First-Order Predicate Calculus
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("ontology")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "ontology" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Triples & Ontology
          </button>
          <button
            onClick={() => setActiveTab("semantic-net")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "semantic-net" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semantic Network
          </button>
          <button
            onClick={() => setActiveTab("frames")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "frames" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Frame Models
          </button>
          <button
            onClick={() => setActiveTab("logic")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "logic" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Logic (FOL & Prop)
          </button>
        </div>
      </div>

      {/* TAB 1: TRIPLES & ONTOLOGY */}
      {activeTab === "ontology" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Assertion Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Add Knowledge Triple</h3>
            <p className="text-xs text-slate-500 mb-4">Assert new factual relationship into Knowledge Base</p>

            <form onSubmit={handleAddAssertion} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject (Entity)</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. ABC Suppliers"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Predicate (Relation)</label>
                <select
                  value={newPredicate}
                  onChange={(e) => {
                    setNewPredicate(e.target.value);
                    if (e.target.value === 'supplies') setNewCategory('Product');
                    if (e.target.value === 'hasQuality') setNewCategory('Quality');
                    if (e.target.value === 'hasReliability') setNewCategory('Reliability');
                    if (e.target.value === 'hasCapacity') setNewCategory('Capacity');
                    if (e.target.value === 'hasUnitCost') setNewCategory('Cost');
                    if (e.target.value === 'hasDeliveryTime') setNewCategory('Delivery');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="supplies">supplies (Product)</option>
                  <option value="hasQuality">hasQuality (Quality)</option>
                  <option value="hasReliability">hasReliability (Reliability)</option>
                  <option value="hasDeliveryTime">hasDeliveryTime (Delivery)</option>
                  <option value="hasUnitCost">hasUnitCost (Cost)</option>
                  <option value="hasCapacity">hasCapacity (Capacity)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Object (Value / Concept)</label>
                <input
                  type="text"
                  value={newObject}
                  onChange={(e) => setNewObject(e.target.value)}
                  placeholder="e.g. 94% or High-Grade Steel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="Product">Product</option>
                  <option value="Quality">Quality</option>
                  <option value="Reliability">Reliability</option>
                  <option value="Cost">Cost</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Capacity">Capacity</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Assert Triple</span>
              </button>
            </form>
          </div>

          {/* Triples List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Ontological Triple Assertions</h3>
              <span className="text-xs text-slate-500">{triples.length} Active RDF Assertions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Predicate (Relation)</th>
                    <th className="py-2.5 px-3">Object</th>
                    <th className="py-2.5 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {triples.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{t.subject}</td>
                      <td className="py-2.5 px-3 text-brand-600 font-medium">
                        → {t.predicate} →
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.object}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="brand" className="font-sans text-[10px]">{t.category}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEMANTIC NETWORK */}
      {activeTab === "semantic-net" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Dynamic Semantic Network Visualizer</h3>
              <p className="text-xs text-slate-500">
                Nodes and labeled relational edges showing propositional knowledge clustering
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Select Supplier:</span>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Semantic Network Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 relative flex items-center justify-center overflow-x-auto min-h-[380px]">
            <svg viewBox="0 0 540 320" className="w-full max-w-2xl h-auto select-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
                <linearGradient id="grad-root" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* Connecting Edges with Labels */}
              {semanticGraph.edges.map((edge, idx) => {
                const targetNode = semanticGraph.nodes.find(n => n.id === edge.to);
                if (!targetNode) return null;
                const rootX = 260;
                const rootY = 150;

                const midX = (rootX + targetNode.x) / 2;
                const midY = (rootY + targetNode.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={rootX}
                      y1={rootY}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd="url(#arrow)"
                    />
                    <rect
                      x={midX - 35}
                      y={midY - 9}
                      width="70"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      stroke="#1e293b"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Center Root Supplier Node */}
              <g transform="translate(260, 150)">
                <circle r="46" fill="url(#grad-root)" stroke="#38bdf8" strokeWidth="2.5" />
                <text y="-5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {selectedSupplier.name.split(' ')[0]}
                </text>
                <text y="10" fill="#bae6fd" fontSize="9" textAnchor="middle">
                  [Supplier]
                </text>
              </g>

              {/* Child Nodes */}
              {semanticGraph.nodes.filter(n => n.id !== 'root').map((node) => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <rect
                    x="-55"
                    y="-18"
                    width="110"
                    height="36"
                    rx="8"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <text y="3" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-xs text-slate-500 italic text-center">
            Semantic Graph: Directed relational topology linking Supplier instance to properties & product classes.
          </p>
        </div>
      )}

      {/* TAB 3: FRAME REPRESENTATION */}
      {activeTab === "frames" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.slice(0, 2).map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 font-sans">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Frame Structure</span>
                  <h4 className="text-base font-extrabold text-slate-900">SUPPLIER_FRAME: {s.name}</h4>
                </div>
                <Badge variant="purple">Frame Model</Badge>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Frame_ID</span>
                  <span className="text-slate-900">{s.id}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Class_Inheritance</span>
                  <span className="text-brand-600">Supply_Chain_Entity</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Name</span>
                  <span className="text-slate-900 font-bold">{s.name}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Product</span>
                  <span className="text-slate-900">{s.product}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Cost</span>
                  <span className="text-slate-900">₹{s.cost.toLocaleString()}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Quality</span>
                  <span className="text-emerald-600 font-bold">{s.quality}%</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Delivery_Time</span>
                  <span className="text-violet-600">{s.deliveryTime} Days</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Reliability</span>
                  <span className="text-sky-600 font-bold">{s.reliability}%</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Capacity</span>
                  <span className="text-amber-600">{s.capacity} Units</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 font-semibold">Slot: Location</span>
                  <span className="text-slate-900">{s.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LOGIC (FOL & PROPOSITIONAL) */}
      {activeTab === "logic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Propositional Logic Interactive Card (Section 12 Requirement) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Propositional Logic Demonstration</h3>
              <Badge variant="brand">Truth Table Engine</Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates logical implication where combined antecedent truth values deduce procurement suitability:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
              <div className="text-brand-300 font-semibold">Rule: P ∧ Q → Reliable_Supplier</div>
              <div className="text-slate-400">P = "Supplier achieves high quality (≥85%)"</div>
              <div className="text-slate-400">Q = "Supplier achieves high reliability (≥85%)"</div>
            </div>

            {/* Interactive Toggle Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Proposition P (High Quality)</span>
                <button
                  onClick={() => setPropP(!propP)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    propP ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {propP ? 'TRUE' : 'FALSE'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Proposition Q (High Reliability)</span>
                <button
                  onClick={() => setPropQ(!propQ)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    propQ ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {propQ ? 'TRUE' : 'FALSE'}
                </button>
              </div>
            </div>

            {/* Deduction Result Box */}
            <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
              propConclusion 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              <span>Logical Conclusion: Reliable_Supplier =</span>
              <span className="text-sm font-extrabold uppercase">
                {propConclusion ? 'TRUE (VALID DEDUCTION)' : 'FALSE (UNSATISFIED)'}
              </span>
            </div>
          </div>

          {/* First Order Logic (FOL) Card (Section 13 Requirement) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">First-Order Predicate Logic (FOL)</h3>
              <Badge variant="purple">Quantified Axioms</Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Formal predicate representation modeling universal quantifiers (<span className="font-mono">∀</span>) and existential quantifiers (<span className="font-mono">∃</span>) over domain entities:
            </p>

            <div className="space-y-3">
              {FOL_RULES.map((rule) => (
                <div key={rule.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-brand-700 font-bold">{rule.id}</span>
                    <Badge variant="default">Predicate Axiom</Badge>
                  </div>
                  <div className="font-mono text-slate-900 font-bold bg-white p-2 rounded-lg border border-slate-200">
                    {rule.formula}
                  </div>
                  <p className="text-slate-600 text-[11px]">{rule.meaning}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Ground Instance: {rule.groundInstances[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

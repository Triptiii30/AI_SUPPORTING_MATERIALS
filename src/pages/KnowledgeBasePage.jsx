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
  Boxes,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { 
  DEFAULT_PROPOSITIONS, 
  DEFAULT_PROP_RULES, 
  evaluateSupplierPropositions, 
  evaluatePropositionalRule, 
  generateTruthTable, 
  evaluateCustomExpression 
} from '../algorithms/propositionalLogic';
import { 
  FOL_PREDICATES, 
  FOL_FORMULAS, 
  evaluateAllFOLFormulas 
} from '../algorithms/firstOrderLogic';
import { 
  BASE_SUPPLIER_FRAME_SCHEMA, 
  createSupplierFrame, 
  updateFrameSlot 
} from '../algorithms/frameSystem';
import { buildSupplierSemanticGraph } from '../data/knowledgeBaseData';

export default function KnowledgeBasePage() {
  const { triples, addTriple, suppliers, requirements, availableProducts } = useApp();

  const [activeTab, setActiveTab] = useState("triples");
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");

  // Selected supplier object
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // ==========================================
  // TAB 1: Triples & Ontology State
  // ==========================================
  const [newSubject, setNewSubject] = useState(selectedSupplier?.name || '');
  const [newPredicate, setNewPredicate] = useState('supplies');
  const [newObject, setNewObject] = useState('');
  const [newCategory, setNewCategory] = useState('Product');
  const [tripleCategoryFilter, setTripleCategoryFilter] = useState('ALL');

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

  const filteredTriples = tripleCategoryFilter === 'ALL' 
    ? triples 
    : triples.filter(t => t.category === tripleCategoryFilter);

  // ==========================================
  // TAB 2: Propositional Logic State
  // ==========================================
  const [customExprInput, setCustomExprInput] = useState("(P && Q) -> R");
  const [customExprResult, setCustomExprResult] = useState(null);
  const [truthTableRuleId, setTruthTableRuleId] = useState("PR-1");

  // Live proposition evaluation for selected supplier
  const supplierPropEval = evaluateSupplierPropositions(selectedSupplier);

  const handleRunCustomExpr = () => {
    const res = evaluateCustomExpression(customExprInput, supplierPropEval.values);
    setCustomExprResult(res);
  };

  const activeTTRule = DEFAULT_PROP_RULES.find(r => r.id === truthTableRuleId) || DEFAULT_PROP_RULES[0];
  const truthTable = generateTruthTable(activeTTRule.antecedentVars, activeTTRule.evaluate);

  // ==========================================
  // TAB 3: First Order Logic State
  // ==========================================
  const folEvaluationResults = evaluateAllFOLFormulas(suppliers, availableProducts, requirements);

  // ==========================================
  // TAB 4: Semantic Network State
  // ==========================================
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const semanticGraph = buildSupplierSemanticGraph(selectedSupplier);

  // ==========================================
  // TAB 5: Frames State
  // ==========================================
  const [activeFrame, setActiveFrame] = useState(() => createSupplierFrame(selectedSupplier));
  const [editingSlot, setEditingSlot] = useState(null);
  const [editSlotValue, setEditSlotValue] = useState("");

  // Keep frame synced if supplier changes
  React.useEffect(() => {
    setActiveFrame(createSupplierFrame(selectedSupplier));
  }, [selectedSupplierId]);

  const handleSaveSlotEdit = () => {
    if (!editingSlot) return;
    try {
      const updated = updateFrameSlot(activeFrame, editingSlot, editSlotValue);
      setActiveFrame(updated);
      setEditingSlot(null);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>Module 3: Knowledge Representation & Reasoning</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supplier Knowledge Base & Logic Engine</h2>
          <p className="text-xs text-slate-500">
            Ontological Triples, Propositional Logic, First-Order Predicate Calculus, Semantic Network, and Minsky Frames
          </p>
        </div>

        {/* Global Supplier Selector for Contextual Evaluation */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Active Supplier:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => {
              setSelectedSupplierId(e.target.value);
              const found = suppliers.find(s => s.id === e.target.value);
              if (found) setNewSubject(found.name);
            }}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.product})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center p-1 bg-slate-200/70 rounded-xl space-x-1 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("triples")}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeTab === "triples" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          1. Triples & Ontology
        </button>
        <button
          onClick={() => setActiveTab("propositional")}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeTab === "propositional" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          2. Propositional Logic
        </button>
        <button
          onClick={() => setActiveTab("fol")}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeTab === "fol" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          3. First Order Logic (FOL)
        </button>
        <button
          onClick={() => setActiveTab("semantic-net")}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeTab === "semantic-net" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          4. Semantic Network
        </button>
        <button
          onClick={() => setActiveTab("frames")}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeTab === "frames" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          5. Frame Representation
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. TRIPLES & ONTOLOGY TAB */}
      {/* ======================================================== */}
      {activeTab === "triples" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Assertion Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Assert Knowledge Triple</h3>
            <p className="text-xs text-slate-500 mb-4">Record structured fact: Subject (Entity) → Predicate (Property) → Object</p>

            <form onSubmit={handleAddAssertion} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject (Entity)</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. ABC Suppliers"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Predicate (Relationship)</label>
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
                    if (e.target.value === 'locatedIn') setNewCategory('Location');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="supplies">supplies (Product)</option>
                  <option value="hasQuality">hasQuality (Quality)</option>
                  <option value="hasReliability">hasReliability (Reliability)</option>
                  <option value="hasDeliveryTime">hasDeliveryTime (Delivery)</option>
                  <option value="hasUnitCost">hasUnitCost (Cost)</option>
                  <option value="hasCapacity">hasCapacity (Capacity)</option>
                  <option value="locatedIn">locatedIn (Location)</option>
                  <option value="isSubClassOf">isSubClassOf (Taxonomy)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Object (Value / Concept)</label>
                <input
                  type="text"
                  value={newObject}
                  onChange={(e) => setNewObject(e.target.value)}
                  placeholder="e.g. 94% or Industrial Steel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="Product">Product</option>
                  <option value="Quality">Quality</option>
                  <option value="Reliability">Reliability</option>
                  <option value="Cost">Cost</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Capacity">Capacity</option>
                  <option value="Location">Location</option>
                  <option value="Taxonomy">Taxonomy</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Triple Assertion</span>
              </button>
            </form>
          </div>

          {/* Triples List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Knowledge Base Triples (RDF-Style)</h3>
                <span className="text-xs text-slate-500">{filteredTriples.length} Active RDF Assertions</span>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-500 font-semibold">Filter:</span>
                <select
                  value={tripleCategoryFilter}
                  onChange={(e) => setTripleCategoryFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium text-slate-800 text-xs"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Product">Product</option>
                  <option value="Quality">Quality</option>
                  <option value="Reliability">Reliability</option>
                  <option value="Cost">Cost</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Location">Location</option>
                  <option value="Taxonomy">Taxonomy</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Subject (Entity)</th>
                    <th className="py-2 px-3">Predicate (Relation)</th>
                    <th className="py-2 px-3">Object (Value)</th>
                    <th className="py-2 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredTriples.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.subject}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        —[{t.predicate}]→
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.object}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {t.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PROPOSITIONAL LOGIC TAB */}
      {/* ======================================================== */}
      {activeTab === "propositional" && (
        <div className="space-y-6">
          {/* Supplier Proposition Truth Values */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Proposition Bindings for Supplier: <span className="font-mono text-slate-700">{selectedSupplier.name}</span>
                </h3>
                <p className="text-xs text-slate-500">Atomic propositions evaluated deterministically against verified supplier attributes</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded-md border border-slate-300">
                Ground Truth Evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {DEFAULT_PROPOSITIONS.map(prop => {
                const info = supplierPropEval.explanations[prop.id];
                return (
                  <div key={prop.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                          {prop.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                          info.value ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {info.value ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">{prop.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-snug">{prop.statement}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-600">
                      {info.metricVal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Propositional Rules & Compound Evaluations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rules Applied to Current Supplier (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Compound Propositional Rules Evaluation</h3>
              <p className="text-xs text-slate-500">Logical implications and conjunctions evaluated on current supplier truth assignments</p>

              <div className="space-y-3">
                {DEFAULT_PROP_RULES.map(rule => {
                  const evalRes = evaluatePropositionalRule(rule, supplierPropEval.values);
                  return (
                    <div key={rule.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{rule.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">{rule.id}</span>
                        </div>
                        <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded ${
                          evalRes.result ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {evalRes.result ? "SATISFIED (TRUE)" : "VIOLATED (FALSE)"}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between">
                        <span>Formula: {rule.formula}</span>
                        <span className="text-slate-400 text-[10px]">
                          Inputs: {Object.entries(evalRes.inputsUsed).map(([k, v]) => `${k}=${v}`).join(", ")}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{rule.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono">{evalRes.explanation}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Truth Table Generator & Custom Evaluator (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Truth Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Truth Table Generator</h3>
                  <select
                    value={truthTableRuleId}
                    onChange={(e) => setTruthTableRuleId(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white font-medium"
                  >
                    {DEFAULT_PROP_RULES.map(r => (
                      <option key={r.id} value={r.id}>{r.id}: {r.formula}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500">Exhaustive truth assignment table for formula: <span className="font-mono font-bold text-slate-800">{activeTTRule.formula}</span></p>

                <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                  <table className="w-full text-center text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        {truthTable.variables.map(v => (
                          <th key={v} className="py-2 px-2">{v}</th>
                        ))}
                        <th className="py-2 px-2 bg-slate-200">Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {truthTable.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {truthTable.variables.map(v => (
                            <td key={v} className={`py-1.5 px-2 font-bold ${row[v] ? "text-slate-800" : "text-slate-400"}`}>
                              {row[v] ? "T" : "F"}
                            </td>
                          ))}
                          <td className={`py-1.5 px-2 font-bold bg-slate-50 ${row.result ? "text-emerald-700" : "text-rose-600"}`}>
                            {row.result ? "TRUE" : "FALSE"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom Expression Evaluator */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Interactive Proposition Parser</h3>
                <p className="text-xs text-slate-500">Enter custom expression using P, Q, R, S, T and operators (&amp;&amp;, ||, !, -&gt;, &lt;-&gt;):</p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customExprInput}
                    onChange={(e) => setCustomExprInput(e.target.value)}
                    placeholder="e.g. (P && Q) -> R"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={handleRunCustomExpr}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    Eval
                  </button>
                </div>

                {customExprResult && (
                  <div className={`p-3 rounded-lg border text-xs font-mono ${
                    customExprResult.success 
                      ? customExprResult.result 
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
                        : "bg-rose-50 border-rose-300 text-rose-900"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}>
                    {customExprResult.success ? (
                      <div>
                        <div className="font-bold">Result: {customExprResult.result ? "TRUE (Satisfied)" : "FALSE (Violated)"}</div>
                        <div className="text-[10px] text-slate-600 mt-1">Substitution: {customExprResult.substituted}</div>
                      </div>
                    ) : (
                      <div>Error: {customExprResult.error}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FIRST ORDER LOGIC (FOL) TAB */}
      {/* ======================================================== */}
      {activeTab === "fol" && (
        <div className="space-y-6">
          {/* Predicate Definition Reference Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Defined First-Order Predicates</h3>
            <p className="text-xs text-slate-500 mb-4">Domain relations and properties defined over suppliers x, products y, and requirements b</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(FOL_PREDICATES).map(([key, p]) => (
                <div key={key} className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs">
                  <div className="font-bold text-slate-900 mb-1">{p.symbol}</div>
                  <div className="text-slate-600 text-[11px] font-sans">{p.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantified Axioms & Proof Results */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quantified Axioms Evaluated Across Active Suppliers</h3>

            {folEvaluationResults.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                      {item.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                    item.evaluation.satisfied ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {item.evaluation.satisfied ? "PROVED (TRUE)" : "REFUTED (FALSE)"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <span>Formula: {item.formula}</span>
                  <span className="text-slate-400 text-[11px]">{item.evaluation.proofType}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.meaning}</p>
                <div className="text-xs font-bold text-slate-800">{item.evaluation.summary}</div>

                {/* Ground Instances Expansion */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ground Substitution Instances ({item.evaluation.instances.length} Entities):
                  </div>
                  <div className="overflow-x-auto max-h-[160px] overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 text-slate-600 text-[10px]">
                        <tr>
                          <th className="py-1.5 px-3">Supplier Entity (x)</th>
                          <th className="py-1.5 px-3">Grounded Predicate Formula</th>
                          <th className="py-1.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {item.evaluation.instances.map((inst, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-bold text-slate-900">{inst.entity}</td>
                            <td className="py-1.5 px-3 text-slate-700">{inst.groundFormula}</td>
                            <td className="py-1.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                inst.satisfied ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                              }`}>
                                {inst.satisfied ? "TRUE" : "FALSE"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SEMANTIC NETWORK TAB */}
      {/* ======================================================== */}
      {activeTab === "semantic-net" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interactive Semantic Network Graph</h3>
              <p className="text-xs text-slate-500">
                Visualizing associative nodes, directional property edges, and categorical inheritance for <span className="font-bold text-slate-800">{selectedSupplier.name}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">Switch Supplier:</span>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Semantic Network Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 relative flex items-center justify-center overflow-x-auto min-h-[380px]">
            <svg viewBox="0 0 680 360" className="w-full max-w-3xl h-auto select-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>

              {/* Connecting Edges with Labels */}
              {semanticGraph.edges.map((edge, idx) => {
                const targetNode = semanticGraph.nodes.find(n => n.id === edge.to);
                const sourceNode = semanticGraph.nodes.find(n => n.id === edge.from);
                if (!targetNode || !sourceNode) return null;

                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd="url(#arrow)"
                    />
                    <rect
                      x={midX - 38}
                      y={midY - 9}
                      width="76"
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      stroke="#334155"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      fill="#cbd5e1"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Center Root Supplier Node */}
              <g 
                transform="translate(280, 160)" 
                className="cursor-pointer"
                onClick={() => setSelectedGraphNode(semanticGraph.nodes[0])}
              >
                <circle r="46" fill="#0f172a" stroke="#f8fafc" strokeWidth="2.5" />
                <text y="-5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {selectedSupplier.name.split(' ')[0]}
                </text>
                <text y="10" fill="#94a3b8" fontSize="9" textAnchor="middle">
                  [Supplier]
                </text>
              </g>

              {/* Child Nodes */}
              {semanticGraph.nodes.filter(n => n.id !== 'root').map((node) => (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedGraphNode(node)}
                >
                  <rect
                    x="-55"
                    y="-18"
                    width="110"
                    height="36"
                    rx="8"
                    fill="#1e293b"
                    stroke={selectedGraphNode?.id === node.id ? "#ffffff" : "#475569"}
                    strokeWidth={selectedGraphNode?.id === node.id ? "2.5" : "1.5"}
                  />
                  <text y="3" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Node Inspector Bar */}
          {selectedGraphNode && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">Selected Node: {selectedGraphNode.label}</span>
                <span className="text-slate-500 ml-2">Type: {selectedGraphNode.type}</span>
              </div>
              <button 
                onClick={() => setSelectedGraphNode(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FRAMES REPRESENTATION TAB */}
      {/* ======================================================== */}
      {activeTab === "frames" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">{activeFrame.frameName}</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
                    isa: {activeFrame.isA}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Minsky Frame Architecture with Slot Facets, Constraint Ranges, and Procedural Demons</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  activeFrame.isValid ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {activeFrame.isValid ? "Frame Validated" : `${activeFrame.validationErrors.length} Constraint Violations`}
                </span>
              </div>
            </div>

            {/* Validation Errors Notice if Any */}
            {activeFrame.validationErrors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Constraint Range Violations:
                </div>
                <ul className="list-disc pl-5 text-[11px]">
                  {activeFrame.validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Slots and Facets Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Slot Name</th>
                    <th className="py-2.5 px-3">Current Value</th>
                    <th className="py-2.5 px-3">Facet Data Type</th>
                    <th className="py-2.5 px-3">Constraint / Range</th>
                    <th className="py-2.5 px-3">Procedural Demons</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {Object.entries(activeFrame.slots).map(([slotKey, slot]) => (
                    <tr key={slotKey} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{slot.name}</td>
                      <td className="py-2.5 px-3">
                        {editingSlot === slotKey ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={editSlotValue}
                              onChange={(e) => setEditSlotValue(e.target.value)}
                              className="px-2 py-0.5 border border-slate-300 rounded font-mono text-xs w-28 bg-white"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveSlotEdit}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingSlot(null)}
                              className="p-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-extrabold text-slate-900">
                            {typeof slot.value === "number" && slotKey === "cost"
                              ? `₹${slot.value.toLocaleString()}`
                              : String(slot.value)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{slot.facetType}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {slot.range ? `[${slot.range[0]}, ${slot.range[1]}]` : "Standard"}
                      </td>
                      <td className="py-2.5 px-3">
                        {slot.demonAttached ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-white font-bold" title={slot.demonDescription}>
                            ⚡ If-Needed Demon
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {!slot.demonAttached && (
                          <button
                            onClick={() => {
                              setEditingSlot(slotKey);
                              setEditSlotValue(String(slot.value));
                            }}
                            className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                          >
                            Edit Value
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
              Note: Slots with <span className="font-mono font-bold text-slate-800">⚡ If-Needed Demons</span> (such as Risk Level and Cost Efficiency) automatically recalculate procedurally when preceding slots (Quality, Reliability, Cost, Capacity) are edited.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

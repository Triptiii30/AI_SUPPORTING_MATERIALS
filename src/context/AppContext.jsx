import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SUPPLIERS, AVAILABLE_PRODUCTS } from '../data/defaultSuppliers';
import { DEFAULT_WEIGHTS, DEFAULT_REQUIREMENTS } from '../algorithms/scoringEngine';
import { INITIAL_TRIPLES } from '../data/knowledgeBaseData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  SUPPLIERS: "sc_dss_suppliers_v1",
  REQUIREMENTS: "sc_dss_requirements_v1",
  WEIGHTS: "sc_dss_weights_v1",
  TRIPLES: "sc_dss_triples_v1"
};

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);

  // Suppliers state with localStorage persistence
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load stored suppliers", e);
    }
    return DEFAULT_SUPPLIERS;
  });

  // Requirements state
  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load stored requirements", e);
    }
    return DEFAULT_REQUIREMENTS;
  });

  // MCDM Weights state
  const [weights, setWeights] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load stored weights", e);
    }
    return DEFAULT_WEIGHTS;
  });

  // Knowledge Base Triples
  const [triples, setTriples] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRIPLES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load stored triples", e);
    }
    return INITIAL_TRIPLES;
  });

  // Compare selection (default: first 3 suppliers)
  const [compareIds, setCompareIds] = useState(["sup-1", "sup-2", "sup-3"]);

  // Selected supplier for detail modal
  const [inspectSupplier, setInspectSupplier] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIPLES, JSON.stringify(triples));
  }, [triples]);

  const notify = (message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const addSupplier = (newSup) => {
    const id = `sup-${Date.now()}`;
    const created = { ...newSup, id };
    setSuppliers(prev => [created, ...prev]);

    // Add corresponding triples to Knowledge Base automatically!
    const newTriples = [
      { subject: created.name, predicate: "supplies", object: created.product, category: "Product" },
      { subject: created.name, predicate: "hasQuality", object: `${created.quality}%`, category: "Quality" },
      { subject: created.name, predicate: "hasReliability", object: `${created.reliability}%`, category: "Reliability" },
      { subject: created.name, predicate: "hasDeliveryTime", object: `${created.deliveryTime} Days`, category: "Delivery" },
      { subject: created.name, predicate: "hasUnitCost", object: `₹${Number(created.cost).toLocaleString()}`, category: "Cost" },
      { subject: created.name, predicate: "hasCapacity", object: `${created.capacity} Units`, category: "Capacity" }
    ];
    setTriples(prev => [...newTriples, ...prev]);

    notify(`Supplier "${created.name}" added successfully and synced to Knowledge Base.`);
    return true;
  };

  const updateSupplier = (updated) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
    notify(`Supplier "${updated.name}" updated successfully.`);
  };

  const deleteSupplier = (id) => {
    const target = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    setCompareIds(prev => prev.filter(cId => cId !== id));
    notify(`Supplier "${target ? target.name : id}" removed.`, "info");
  };

  const addTriple = (triple) => {
    setTriples(prev => [triple, ...prev]);
    notify(`Knowledge assertion [${triple.subject} - ${triple.predicate} - ${triple.object}] recorded.`);
  };

  const resetToDemoData = () => {
    setSuppliers(DEFAULT_SUPPLIERS);
    setRequirements(DEFAULT_REQUIREMENTS);
    setWeights(DEFAULT_WEIGHTS);
    setTriples(INITIAL_TRIPLES);
    setCompareIds(["sup-1", "sup-2", "sup-3"]);
    notify("Demo data reloaded successfully with standard AI benchmark set.");
  };

  const runDemoRecommendation = () => {
    // Ensure product matches demo dataset
    setRequirements({
      product: "Industrial Steel",
      maxBudget: 60000,
      minQuality: 85,
      maxDelivery: 7,
      minReliability: 85,
      requiredCapacity: 900
    });
    setActiveTab("ai-decision");
    notify("Demo scenario loaded: Evaluating Industrial Steel procurement via Multi-AI Engine!");
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        suppliers,
        requirements,
        setRequirements,
        weights,
        setWeights,
        triples,
        addTriple,
        compareIds,
        setCompareIds,
        inspectSupplier,
        setInspectSupplier,
        notification,
        notify,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        resetToDemoData,
        runDemoRecommendation,
        availableProducts: AVAILABLE_PRODUCTS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

# PROJECT AI SCOPE

## Supply Chain Decision Support Platform
**Course:** Artificial Intelligence (CCSAI0301)  
**Institution:** NIET Greater Noida  
**Milestone:** Month 3 / Report 3 Refactoring & Scope Realignment  

---

## 1. Project-Relevance Architecture Principle

The goal of this project is to develop a functional, demonstrable **AI-based Supplier Decision Support System (AI-DSS)** that helps procurement managers evaluate vendors, compare alternatives, assess supply risks, and justify sourcing awards.

Rather than implementing every topic in the syllabus as disconnected demonstrations, this refactored prototype retains and implements **ONLY** those AI concepts that:
1. Directly solve an actual supplier evaluation or procurement decision problem.
2. Provide concrete functional utility to the user.
3. Align directly with the prescribed Module 3 (Knowledge Representation) and Module 4 (Statistical Reasoning) syllabus.
4. Integrate into a single, cohesive procurement decision pipeline.

---

## 2. AI Concept Relevance & Implementation Status

| AI Concept | Project Relevance | Implementation Status | Reason for Inclusion |
| :--- | :--- | :--- | :--- |
| **Knowledge Base (RDF Triples & Ontology)** | **Core Foundation** | Fully Implemented (`src/data/knowledgeBaseData.js`, `src/pages/KnowledgeBasePage.jsx`) | Serves as the single shared data source for all reasoning engines. Represents supplier profiles, product classes, locations, and historical audit metrics. |
| **Propositional Logic** | **High** | Fully Implemented (`src/algorithms/propositionalLogic.js`, `src/pages/KnowledgeBasePage.jsx`) | Formulates hard boolean eligibility constraints ($P \wedge Q \wedge R \rightarrow \text{Eligible}$). Evaluates whether a supplier meets mandatory baseline thresholds with full truth-table verification. |
| **First-Order Logic (FOL)** | **High** | Fully Implemented (`src/algorithms/firstOrderLogic.js`, `src/pages/KnowledgeBasePage.jsx`) | Formally defines domain relations (`Supplier(x)`, `Provides(x, y)`, `HighQuality(x)`). Proves universal catalog coverage ($\forall x$) and existential feasibility ($\exists x$) with variable grounding. |
| **Frame Representation** | **High** | Fully Implemented (`src/algorithms/frameSystem.js`, `src/pages/KnowledgeBasePage.jsx`) | Structures complex supplier entities into Minsky frames with slot facets (data type, range constraints, default inheritance) and procedural *If-Needed Demons* for automatic metric derivation. |
| **Semantic Networks** | **Medium (Retained)** | Fully Implemented (`src/pages/KnowledgeBasePage.jsx`) | Provides an intuitive visual topology of supplier-product-location relationships and taxonomic classifications (`isSubClassOf`). |
| **Rule-Based Expert System** | **Primary Reasoning Engine** | Fully Implemented (`src/algorithms/expertSystem.js`, `src/pages/ExpertSystemPage.jsx`) | Core forward-chaining production system. Applies multi-criteria procurement rules with priority conflict resolution, deep introspection (WHY / HOW explanations), and configurable knowledge acquisition. |
| **Certainty Factors (MYCIN)** | **High (Integrated)** | Fully Implemented (`src/algorithms/certaintyFactors.js`, integrated into `src/algorithms/expertSystem.js`) | Directly embedded into Expert System production rules to quantify confidence ($CF \in [-1, +1]$) under incomplete or uncertain empirical supplier evidence. Avoids creating a redundant standalone silo. |
| **Probability & Bayes' Theorem** | **High** | Fully Implemented (`src/algorithms/bayesTheorem.js`, `src/pages/SupplierRiskPage.jsx`) | Estimates supplier default and operational delay risk $P(\text{Lapse} \mid \text{Delay})$ given empirical audit histories using the Law of Total Probability. |
| **Mamdani Fuzzy Logic (FIS)** | **Core Decision Engine** | Fully Implemented (`src/algorithms/fuzzyLogic.js`, `src/pages/FuzzyEvaluationPage.jsx`) | Supplier attributes (Quality, Cost, Delivery, Reliability) are naturally qualitative and imprecise. Fuzzification, 12 production rules, and Centroid Defuzzification produce a continuous suitability score ($0 - 100$). |
| **Integrated Multi-Paradigm Workflow** | **System Core** | Fully Implemented (`src/algorithms/integratedDecisionEngine.js`, `src/pages/AIDecisionSupportPage.jsx`) | Connects all components into a transparent pipeline without artificial score merging, comparing deductive rules, fuzzy continuous scores, and Bayesian risk side-by-side. |

---

## 3. End-to-End Decision Pipeline Architecture

```
Supplier Catalog & Working Memory
              ↓
Knowledge Base (Triples & Frames with Demons)
              ↓
Propositional Logic Gate (Hard Eligibility: P ∧ Q ∧ R)
              ↓
Expert System Production Rules (Forward Chaining + Certainty Factors)
              ↓
Mamdani Fuzzy Inference System (Continuous Suitability Score & Centroid Defuzzification)
              ↓
Bayesian Risk Estimation (Posterior Probability of SLA Default P(A|B))
              ↓
Consolidated Procurement Recommendation & Transparent Explanation
```


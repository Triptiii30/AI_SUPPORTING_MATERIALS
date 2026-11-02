# REMOVED FEATURES & REFACTORING LOG

## Supply Chain Decision Support Platform
**Course:** Artificial Intelligence (CCSAI0301)  
**Institution:** NIET Greater Noida  
**Milestone:** Month 3 Refactoring & Simplification  

---

## 1. Overview of Cleanup & Refactoring

In accordance with the **Strict Project-Relevance Principle**, the repository was audited to remove unnecessary AI topics, disconnected algorithm demonstrations, redundant modules, and dead code. The objective was to eliminate academic bloat that did not directly serve the core problem of supplier evaluation and procurement decision-making.

---

## 2. Removed and Refactored Modules

| Module / File Removed or Refactored | Type of Code | Reason for Removal / Simplification | Replacement / Current Location |
| :--- | :--- | :--- | :--- |
| **`src/pages/AIProblemSolverPage.jsx`** | Unrelated Toy AI Demos | Contained Unit 2 state-space puzzle solvers (Water Jug Problem, 8-Puzzle, N-Queens Problem, Traveling Salesperson Problem, Missionaries & Cannibals). These puzzles had zero functional connection to supply chain procurement or supplier decision-making. | **Completely Removed.** Frees up application navigation and eliminates 30KB of dead code. |
| **`src/algorithms/problemSolvers.js`** | Unrelated Algorithms | Underlying solver routines for the aforementioned toy puzzle demos (BFS, DFS, A* heuristics for 8-puzzle and water jugs). | **Completely Removed.** |
| **`src/pages/StatisticalReasoningPage.jsx`** | Monolithic Conglomerate Page | A cluttered 5-tab conglomerate page mixing unrelated concepts into a single view with decorative multi-tab switching. | **Refactored & Replaced** by two focused, purpose-built pages: <br>1. `src/pages/SupplierRiskPage.jsx` (Bayesian Risk)<br>2. `src/pages/FuzzyEvaluationPage.jsx` (Mamdani FIS). |
| **Standalone Dempster-Shafer Platform** | Disconnected Uncertainty Tool | A complex multi-source evidence fusion calculator with $3 \times 3$ orthogonal sum matrices and conflict metrics ($K$). In real-world supplier evaluation, Dempster-Shafer added artificial complexity without improving decision quality. | **Removed from Active Workflow.** Uncertainty is cleanly represented through Certainty Factors in the Expert System and Bayesian posterior probabilities in Risk Analysis. |
| **Standalone Bayesian Network DAG Demo** | Disconnected Graphical Model | A 5-node generic causal graph with static CPT matrices that operated independently from the main procurement workflow, acting merely as a syllabus checklist item. | **Removed from Primary Navigation.** Bayesian probability is directly and meaningfully applied to supplier default/delay risk estimation via Bayes' Theorem (`src/pages/SupplierRiskPage.jsx`). |
| **Standalone Certainty Factor Platform** | Redundant Silo | An isolated Certainty Factor calculator that duplicated rule evaluation outside the Expert System. | **Natively Integrated into the Expert System.** Certainty Factors ($CF \in [-1, +1]$) are now embedded directly into production rules in `src/algorithms/expertSystem.js`, showing confidence propagation during forward chaining. |

---

## 3. Benefits of Refactoring

1. **Clean Navigation:** Reduced from a confusing list of disconnected syllabus topics to a clean 8-item workflow:
   - Dashboard
   - Supplier Directory
   - Compare Alternatives
   - Integrated Decision Support
   - Knowledge Base & Logic
   - Expert System (+ CF)
   - Supplier Risk (Bayes)
   - Fuzzy Evaluation
   - Reports & Rankings
2. **True Integration:** All AI models now operate on the **same supplier data** rather than maintaining separate mockup inputs.
3. **Better Demonstration Quality:** During faculty evaluation, the student can trace a single supplier across:
   $$\text{Supplier Record} \rightarrow \text{Knowledge Base Frame} \rightarrow \text{Propositional Gate} \rightarrow \text{Expert Rules (CF)} \rightarrow \text{Fuzzy Suitability} \rightarrow \text{Bayesian Risk}$$
   without switching between unrelated academic toy demos.
4. **Zero Build & Runtime Overhead:** All 45 automated unit tests pass in under 1 second, and the Vite production build produces zero compilation errors.


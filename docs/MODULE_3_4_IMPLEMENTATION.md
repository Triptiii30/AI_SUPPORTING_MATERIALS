# Supply Chain Decision Support Platform
## Module 3 & Module 4 Implementation & Syllabus Mapping Document

**Course:** Artificial Intelligence (Course Code: CCSAI0301)  
**Institution:** NIET Greater Noida  
**Project:** Supply Chain Decision Support Platform (AI PBL Prototype Extension)  
**Semester / Year:** B.Tech CSE – AI Specialization (Month 3 / Report 3 Milestone)  

---

## 1. Executive Summary

This platform extends the existing **Supply Chain Decision Support Platform** from a baseline multi-criteria evaluator into an end-to-end, multi-paradigm Artificial Intelligence Decision Support System (AI-DSS). The prototype runs locally as a responsive web platform and provides dedicated mathematical engines for:
1. **Module 3: Knowledge Representation and Reasoning**
   - Formal Ontological Triples (RDF-Style Subject-Predicate-Object)
   - Propositional Logic Engine with Truth Table Generators and Expression Parsers
   - First-Order Logic (FOL) with Universal ($\forall$) and Existential ($\exists$) Quantifier Provers
   - Interactive Semantic Network Graph Topology Visualizer
   - Minsky Frame Representation System with Slot Facets, Constraints, and Procedural Demons
   - Rule-Based Expert System with Forward Chaining, Conflict Resolution, Explanation Facility (WHY / HOW), and Knowledge Acquisition
2. **Module 4: Statistical Reasoning & Uncertainty Management**
   - Classical Probability and Bayes' Theorem Posterior Calculator with Total Probability Derivations
   - Certainty Factors (MYCIN Model) for Inexact Heuristic Evidence Combination ($CF \in [-1, +1]$)
   - Bayesian Belief Networks (BBN) with 5-Node Directed Acyclic Graph (DAG) and Exact Joint Marginal Inference
   - Dempster-Shafer Theory of Evidence with Orthogonal Sum Tableaux, Conflict Metric $K$, and Belief-Plausibility Intervals $[Bel, Pl]$
   - Mamdani Fuzzy Inference System (FIS) with 4-Input Fuzzification, 12 Linguistic Rules, and Center-of-Gravity (Centroid) Defuzzification

All 10 automated test suites (45 tests) execute and pass in Vitest, and the production Vite bundle compiles with zero errors.

---

## 2. Strict Syllabus Mapping Matrix

| Syllabus Topic | Implemented Feature | File / Module | Demonstration Method |
| :--- | :--- | :--- | :--- |
| **Module 3: Knowledge Base Building** | Dynamic Ontological Triples (RDF Knowledge Graph) with real-time insertion and category filtering | `src/data/knowledgeBaseData.js`<br>`src/pages/KnowledgeBasePage.jsx` | Navigate to **Knowledge Base & Logic → Triples & Ontology**. View active facts or assert new triples (`Subject —[Predicate]→ Object`). |
| **Module 3: Propositional Logic** | Propositional evaluation engine, truth table generator ($2^n$ rows), and interactive Boolean parser | `src/algorithms/propositionalLogic.js`<br>`tests/propositionalLogic.test.js` | Navigate to **Knowledge Base & Logic → Propositional Logic**. Inspect live truth bindings ($P, Q, R, S, T$) for any supplier, generate truth tables, or test custom formulas (`(P && Q) -> R`). |
| **Module 3: First-Order Logic (FOL)** | First-order predicate calculus engine with universal ($\forall x$) and existential ($\exists x$) quantification and variable grounding | `src/algorithms/firstOrderLogic.js`<br>`tests/firstOrderLogic.test.js` | Navigate to **Knowledge Base & Logic → First Order Logic**. Inspect predicate definitions (`HighQuality(x)`, `Provides(x, y)`) and witness proofs across all suppliers. |
| **Module 3: Semantic Networks** | Directed semantic network graph visualizer linking supplier nodes to product classes, quality, lead time, and geography | `src/data/knowledgeBaseData.js`<br>`src/pages/KnowledgeBasePage.jsx` | Navigate to **Knowledge Base & Logic → Semantic Network**. Switch suppliers and click any node to inspect associative relations and taxonomy hierarchy. |
| **Module 3: Frame Representation** | Minsky frame schemas with slots, facets (types, ranges, defaults), constraint checks, and procedural *If-Needed Demons* | `src/algorithms/frameSystem.js`<br>`tests/frameSystem.test.js` | Navigate to **Knowledge Base & Logic → Frame Representation**. Edit slots (e.g., Quality) to observe automatic demon re-calculation of `RiskLevel` and `CostEfficiencyIndex`. |
| **Module 3: Expert System Architecture** | 6-component production rule expert system: UI, Working Memory, Rule Base, Forward Chaining Inference, Explanation Facility, Knowledge Acquisition | `src/algorithms/expertSystem.js`<br>`src/pages/ExpertSystemPage.jsx`<br>`tests/expertSystem.test.js` | Navigate to **Expert System**. Inspect the 4-stage pipeline, examine execution traces by cycle, inspect WHY/HOW explanations, and add custom production rules via Knowledge Acquisition. |
| **Module 4: Probability & Bayes' Theorem** | Classical audit probability and interactive Bayes' Theorem calculator with full step-by-step mathematical proof | `src/algorithms/bayesTheorem.js`<br>`src/pages/StatisticalReasoningPage.jsx`<br>`tests/bayesTheorem.test.js` | Navigate to **Statistical Reasoning → Bayes & Probability**. Adjust Prior $P(A)$, Likelihood $P(B\|A)$, and False Alarm $P(B\|\neg A)$ to observe Law of Total Probability steps. |
| **Module 4: Certainty Factors (MYCIN)** | Inexact reasoning engine combining positive, negative, and mixed heuristic evidence within $[-1.0, +1.0]$ | `src/algorithms/certaintyFactors.js`<br>`src/pages/StatisticalReasoningPage.jsx`<br>`tests/certaintyFactors.test.js` | Navigate to **Statistical Reasoning → Certainty Factors**. Adjust $CF_1$ and $CF_2$ sliders to inspect Shortliffe combination formulas and view multi-rule supplier confidence. |
| **Module 4: Bayesian Belief Networks** | 5-Node DAG for Supply Chain Operational Risk with CPTs and exact joint marginalization inference | `src/algorithms/bayesianNetwork.js`<br>`src/pages/StatisticalReasoningPage.jsx`<br>`tests/bayesianNetwork.test.js` | Navigate to **Statistical Reasoning → Bayesian Belief Network**. Click on states to clamp observations (e.g., $D=\text{Delayed}$) and view real-time posterior probability updates. |
| **Module 4: Dempster-Shafer Theory** | Epistemic evidence fusion with Basic Probability Assignments ($m$), orthogonal sum tableau, conflict metric $K$, and $[Bel, Pl]$ intervals | `src/algorithms/dempsterShafer.js`<br>`src/pages/StatisticalReasoningPage.jsx`<br>`tests/dempsterShafer.test.js` | Navigate to **Statistical Reasoning → Dempster-Shafer**. Adjust evidence mass sliders, examine the $3 \times 3$ orthogonal sum matrix, and review 3-source evidence fusion. |
| **Module 4: Fuzzy Logic (Mamdani FIS)** | 4-input Mamdani Fuzzy Inference System with triangular/trapezoidal membership functions and Center-of-Gravity (Centroid) defuzzification | `src/algorithms/fuzzyLogic.js`<br>`src/pages/StatisticalReasoningPage.jsx`<br>`tests/fuzzyLogic.test.js` | Navigate to **Statistical Reasoning → Fuzzy Logic**. Inspect plotted membership curves (Recharts), view active fuzzy rule firing strengths ($\alpha$), and observe crisp defuzzified scores. |
| **Integrated Decision Support** | Multi-paradigm comparative synthesis dashboard providing side-by-side results without arbitrary score conflation | `src/algorithms/integratedDecisionEngine.js`<br>`src/pages/AIDecisionSupportPage.jsx`<br>`tests/integratedDecision.test.js` | Navigate to **AI Decision Support**. Execute **Run Multi-AI Evaluation** to review constraint filtering, MCDM scores, and the 6-paradigm comparison matrix. |

---

## 3. Mathematical Formulations & Implementation Evidence

### 3.1 Propositional Logic Implication & Truth Tables
- **Material Implication:** $P \rightarrow Q \equiv \neg P \vee Q$
- **Biconditional:** $P \leftrightarrow Q \equiv (P \wedge Q) \vee (\neg P \wedge \neg Q)$
- **Evaluation Mechanism:** Implemented in `src/algorithms/propositionalLogic.js` with regex-based AST normalization and exact boolean evaluation.

### 3.2 First-Order Logic (FOL) Quantification Proofs
- **Universal Axiom Proof:**
  $$\forall x \, (\text{Supplier}(x) \rightarrow \exists y \, (\text{Product}(y) \wedge \text{Provides}(x, y)))$$
  Proved by exhaustive substitution of all catalogued suppliers $x \in \mathcal{S}$ and checking for witness $y \in \mathcal{P}$.
- **Existential Feasibility Proof:**
  $$\exists x \, (\text{Supplier}(x) \wedge \text{Provides}(x, \text{Target}) \wedge \text{Cost}(x) \le \text{Budget} \wedge \text{LeadTime}(x) \le \text{MaxDays})$$
  Returns set of valid witnesses satisfying all conjunction terms.

### 3.3 Rule-Based Expert System Forward Chaining
- **Conflict Resolution Strategy:** Priority-descending scheduling ($\text{Priority} \in [10, 60]$), with higher-priority consequences taking precedence.
- **Cycle Prevention:** Working memory state diffing with a maximum cycle cap ($N = 5$).
- **Explanation Facility:** Generates explicit **WHY** (antecedent facts leading to recommendation) and **HOW** (ordered firing trace of cycle executions).

### 3.4 Bayes' Theorem with Total Probability Law
$$\begin{aligned}
P(B) &= P(B \mid A) \cdot P(A) + P(B \mid \neg A) \cdot P(\neg A) \\
P(A \mid B) &= \frac{P(B \mid A) \cdot P(A)}{P(B)}
\end{aligned}$$
- Validated for edge cases: $P(A) = 0$, $P(A) = 1$, and marginal evidence denominator checks ($P(B) > 0$).

### 3.5 MYCIN Certainty Factor Calculus
Given two independent pieces of evidence supporting or refuting hypothesis $H$:
$$CF_{\text{comb}}(CF_1, CF_2) = \begin{cases}
CF_1 + CF_2 - (CF_1 \cdot CF_2) & \text{if } CF_1 \ge 0, CF_2 \ge 0 \\
CF_1 + CF_2 + (CF_1 \cdot CF_2) & \text{if } CF_1 \le 0, CF_2 \le 0 \\
\frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)} & \text{if } CF_1 \cdot CF_2 < 0
\end{cases}$$
Propagated through rule antecedents via: $CF(H, E) = CF(E) \cdot CF_{\text{rule}}$ (for $CF(E) > 0$).

### 3.6 Bayesian Belief Network Exact Joint Marginalization
Joint probability factorization over DAG $\mathcal{G} = (V, E)$:
$$P(R, F, D, Q, \text{Risk}) = P(R) \cdot P(F) \cdot P(D \mid R) \cdot P(Q \mid R) \cdot P(\text{Risk} \mid D, Q, F)$$
Inference given observed evidence $\mathbf{e}$:
$$P(\text{Target} = t \mid \mathbf{e}) = \frac{\sum_{\mathbf{x} \setminus \{\text{Target}, \mathbf{e}\}} P(\text{Target} = t, \mathbf{e}, \mathbf{x})}{\sum_{t'} \sum_{\mathbf{x} \setminus \{\text{Target}, \mathbf{e}\}} P(\text{Target} = t', \mathbf{e}, \mathbf{x})}$$

### 3.7 Dempster-Shafer Theory of Evidence
- **Frame of Discernment:** $\Theta = \{S, U\}$ where $S = \text{Suitable}, U = \text{Unsuitable}$.
- **Power Set:** $2^\Theta = \{\emptyset, \{S\}, \{U\}, \Theta\}$.
- **Dempster's Rule of Combination:**
  $$m_{1,2}(A) = \frac{\sum_{B \cap C = A} m_1(B) \cdot m_2(C)}{1 - K} \quad \forall A \neq \emptyset$$
  $$\text{where conflict } K = \sum_{B \cap C = \emptyset} m_1(B) \cdot m_2(C)$$
- **Belief & Plausibility:**
  $$Bel(A) = \sum_{B \subseteq A} m(B), \quad Pl(A) = \sum_{B \cap A \neq \emptyset} m(B) = 1 - Bel(\neg A)$$
  Interval $[Bel(A), Pl(A)]$ quantifies epistemic ignorance: $Pl(A) - Bel(A) = m(\Theta)$.

### 3.8 Mamdani Fuzzy Inference System (FIS)
- **Fuzzification:** Triangular $\text{trimf}(x; a, b, c)$ and Trapezoidal $\text{trapmf}(x; a, b, c, d)$ membership functions across 4 input domains (Cost, Quality, Lead Time, Reliability).
- **Rule Antecedent Evaluation:** Mamdani minimum operator $\alpha_i = \min_{j} \mu_{A_{ij}}(x_j)$.
- **Aggregation:** Maximum operator $\mu_{\text{agg}}(z) = \max_i \min(\alpha_i, \mu_{C_i}(z))$.
- **Centroid Defuzzification (Center of Gravity):**
  $$z^* = \frac{\int_0^{100} z \cdot \mu_{\text{agg}}(z) \, dz}{\int_0^{100} \mu_{\text{agg}}(z) \, dz} \approx \frac{\sum_{i=0}^{100} z_i \cdot \mu_{\text{agg}}(z_i)}{\sum_{i=0}^{100} \mu_{\text{agg}}(z_i)}$$

---

## 4. Automated Test Verification Results

All tests execute via `npm test` (`vitest run`) in the isolated project workspace:

```
 RUN  v5.1.0 C:/Users/yoges/Documents/AI PBL

 ✓ tests/bayesianNetwork.test.js (4 tests)
 ✓ tests/fuzzyLogic.test.js (6 tests)
 ✓ tests/firstOrderLogic.test.js (5 tests)
 ✓ tests/dempsterShafer.test.js (5 tests)
 ✓ tests/propositionalLogic.test.js (5 tests)
 ✓ tests/frameSystem.test.js (4 tests)
 ✓ tests/certaintyFactors.test.js (6 tests)
 ✓ tests/bayesTheorem.test.js (4 tests)
 ✓ tests/expertSystem.test.js (4 tests)
 ✓ tests/integratedDecision.test.js (2 tests)

 Test Files  10 passed (10)
      Tests  45 passed (45)
   Duration  1.25s
```

---

## 5. Instructions to Run the Website Locally

1. **Prerequisites:** Node.js (v18+ recommended)
2. **Install Dependencies:**
   ```powershell
   npm install
   ```
3. **Run Automated Test Suite:**
   ```powershell
   npm test
   ```
4. **Launch Local Development Web Server:**
   ```powershell
   npm run dev
   ```
   Open `http://localhost:5173` in any standard web browser.
5. **Build for Production Deployment:**
   ```powershell
   npm run build
   ```

---

## 6. Summary of Modified and Created Files

- **Newly Created / Enhanced Algorithm Engines:**
  - `src/algorithms/propositionalLogic.js`
  - `src/algorithms/firstOrderLogic.js`
  - `src/algorithms/frameSystem.js`
  - `src/algorithms/expertSystem.js`
  - `src/algorithms/bayesTheorem.js`
  - `src/algorithms/certaintyFactors.js`
  - `src/algorithms/bayesianNetwork.js`
  - `src/algorithms/dempsterShafer.js`
  - `src/algorithms/fuzzyLogic.js`
  - `src/algorithms/integratedDecisionEngine.js`
  - `src/algorithms/bayesianReasoning.js` (Unified facade)
- **Web Pages Enhanced:**
  - `src/pages/KnowledgeBasePage.jsx` (5 complete tabs for KR)
  - `src/pages/ExpertSystemPage.jsx` (Interactive architecture, tracer, and rule manager)
  - `src/pages/StatisticalReasoningPage.jsx` (5 complete tabs for uncertainty reasoning)
  - `src/pages/AIDecisionSupportPage.jsx` (Central multi-paradigm decision dashboard)
  - `src/components/layout/Sidebar.jsx` (Academic monochromatic navigation)
  - `src/App.jsx` (Cleaned of dead/unrelated code)
- **Automated Test Suites Created (`tests/`):**
  - `tests/propositionalLogic.test.js`
  - `tests/firstOrderLogic.test.js`
  - `tests/frameSystem.test.js`
  - `tests/expertSystem.test.js`
  - `tests/bayesTheorem.test.js`
  - `tests/certaintyFactors.test.js`
  - `tests/bayesianNetwork.test.js`
  - `tests/dempsterShafer.test.js`
  - `tests/fuzzyLogic.test.js`
  - `tests/integratedDecision.test.js`
- **Dead Code Removed:**
  - `src/pages/AIProblemSolverPage.jsx` (Unrelated Unit 2 toy puzzles)
  - `src/algorithms/problemSolvers.js`


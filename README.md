# Supply Chain Decision Support Platform
### AI-Powered Multi-Model Decision Support System for Supplier Evaluation
**B.Tech CSE Artificial Intelligence — Project-Based Learning (PBL)**

---

## 📌 Executive Summary & Purpose

The **Supply Chain Decision Support Platform** is an enterprise-grade artificial intelligence decision support prototype designed to evaluate, rank, and select industrial suppliers under multi-dimensional constraints. 

In real-world supply chain management, procurement decisions must balance commercial expense against operational risk, lead-time variance, defect margins, and contractual uncertainty. This platform replaces subjective vendor selection with formal AI methods spanning **Knowledge Representation**, **Expert Systems**, **Soft Computing (Fuzzy Logic)**, **Probabilistic Reasoning (Bayes' Theorem & Bayesian Networks)**, **Inexact Reasoning (Certainty Factors & Dempster-Shafer Theory)**, and **Multi-Criteria Decision Making (MCDM)**.

---

## 🔬 AI Concepts & Mathematical Foundations Implemented

### 1. Multi-Criteria Decision Making (MCDM) & Transparent Normalization
* **Normalization**: Linear Min-Max scaling of qualitative and quantitative parameters:
  $$\text{Norm}_{\text{benefit}}(x) = \frac{x}{\text{scale}}, \quad \text{Norm}_{\text{cost}}(x) = 1 - \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$
* **Weighted Linear Combination (WLC)**:
  $$\text{Score}(S_i) = \sum_{j=1}^{m} w_j \cdot x_{ij}^*$$
* Configurable priority sliders: Quality (25%), Reliability (25%), Cost (20%), Delivery (15%), Capacity (15%).

### 2. Rule-Based Expert System (Forward Chaining)
* Dedicated production rule engine evaluating working memory facts against predefined domain rules:
  * **RULE-01**: `IF quality >= 85 AND reliability >= 85 THEN supplier_status = 'Reliable'`
  * **RULE-02**: `IF delivery <= 5 AND quality >= 85 THEN delivery_status = 'Preferred'`
  * **RULE-03**: `IF cost <= budget AND capacity >= req_capacity THEN procurement_status = 'Suitable'`
  * **RULE-04**: `IF quality >= 90 AND reliability >= 90 AND delivery <= 5 THEN recommendation = 'Highly Recommended'`
* Full inference pipeline: **Input Facts $\to$ Pattern Matching $\to$ Conflict Resolution $\to$ Recommendation**.

### 3. Fuzzy Logic & Mamdani Inference
* Handles ambiguous linguistic descriptors like *"High Quality"*, *"Fast Dispatch"*, *"Marginally Suitable"*.
* **Membership Functions**:
  * Quality: Low $[0, 50\%]$, Medium $[45, 85\%]$, High $[75, 100\%]$
  * Delivery: Fast $[1, 3.5\text{d}]$, Moderate $[3, 7\text{d}]$, Slow $[\ge 6\text{d}]$
* **Mamdani Min-Max Composition**:
  $$\mu_{\text{rule}} = \min(\mu_A(x), \mu_B(y))$$
* **Defuzzification**: Center of Gravity / Weighted Mean centroid scoring.

### 4. Bayesian Probability & Bayes' Theorem
* **Scenario**: Probability that a vendor is genuinely reliable given high audited quality:
  $$P(\text{Reliable} \mid \text{High Quality}) = \frac{P(\text{High Quality} \mid \text{Reliable}) \cdot P(\text{Reliable})}{P(\text{High Quality})}$$
* Displays Prior Probability, Likelihood, Marginal Evidence, and Updated Posterior.

### 5. Shortliffe (MYCIN) Certainty Factors
* Combines independent sources of uncertain knowledge:
  $$\text{CF}_{\text{comb}}(\text{CF}_1, \text{CF}_2) = \text{CF}_1 + \text{CF}_2 - (\text{CF}_1 \times \text{CF}_2) \quad (\text{for } \text{CF} > 0)$$

### 6. Bayesian Belief Networks (DAG)
* Directed Acyclic Graph connecting **Quality**, **Reliability**, and **Lead Time** as parents into **Supplier Suitability**.
* Interactive Conditional Probability Tables (CPTs) for inspecting prior and joint distributions.

### 7. Dempster-Shafer Theory of Evidence
* Frame of Discernment $\Theta = \{\text{Suitable}, \neg\text{Suitable}\}$.
* Orthogonal sum combining independent inspection sensors and audit reports to derive **Belief $\text{Bel}(A)$** and **Plausibility $\text{Pl}(A)$** uncertainty intervals.

### 8. Knowledge Representation Ontologies
* **RDF-Style Triples**: Subject $\to$ Predicate $\to$ Object assertions (`Supplier → supplies → Product`).
* **Semantic Network**: Interactive SVG graph displaying semantic associations and property inheritance.
* **Frame Systems**: Structured slot-filler models with default attributes and class hierarchy.
* **Propositional Logic**: Interactive truth table deduction ($P \wedge Q \to \text{Reliable}$).
* **First-Order Predicate Logic (FOL)**: Quantified axioms ($\forall x (\text{Supplier}(x) \to \dots)$).

### 9. Classical AI Problem Solver Modules
Five dedicated curriculum demonstration solvers:
1. **Water Jug Problem**: State-space Breadth-First Search (BFS) finding optimal transition sequence.
2. **N-Queens Problem**: Backtracking constraint satisfaction algorithm with interactive chessboard.
3. **Travelling Salesperson Problem (TSP)**: Minimum-cost Hamiltonian circuit across Indian industrial logistics hubs.
4. **Missionaries & Cannibals**: River-crossing BFS state graph visualizer ensuring safety constraints.
5. **8-Tile Puzzle**: $A^*$ heuristic search minimizing Manhattan distance $f(n) = g(n) + h(n)$.

### 10. Explainable AI (XAI) Selection Rationale
* Full human-interpretable natural language explanation detailing why the recommended supplier won, why competitors failed hard gates, and exact point-by-point attribute contributions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 with Vite |
| **Styling** | Tailwind CSS (Enterprise/Academic design palette) |
| **Icons** | Lucide React |
| **Data Visuals** | Recharts (Bar Charts, Scatter Trade-offs, Radar Profiles, Line Curves) |
| **State Persistence** | React Context API with LocalStorage synchronization |
| **Demo Engine** | Pure client-side JavaScript AI algorithms (100% offline runnable) |

---

## 🚀 How to Run the Project Locally

### Prerequisites
* Node.js v18+ installed on your machine.

### Installation & Launch Steps

1. **Navigate to the Project Directory**:
   ```bash
   cd "AI_PBL_PROJECT"
   ```

2. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```
   *(On Windows PowerShell with restricted script execution, run: `cmd.exe /c "npm install"`)*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *(Or on Windows: `cmd.exe /c "npm run dev"`)*

4. **Open in Browser**:
   Visit **`http://localhost:3000`** in your browser.

---

## 🎯 Step-by-Step Presentation Guide for Faculty / Judges

When demonstrating this project during your evaluation viva:

1. **Start on the Dashboard (`Dashboard`)**:
   - Point out the key metrics (Total Suppliers, QA Pass Rate, SLA Compliance).
   - Explain the Quality vs. Cost trade-off scatter plot.
   - Click **"Run Demo Recommendation"** in the top header.

2. **Demonstrate AI Decision Support (`AI Decision Support`)**:
   - Highlight the **Hard Constraint Filtering** table: show how vendors that fail budget, lead-time, or quality gates are filtered out with explicit reasons.
   - Adjust the **Weight Sliders** (e.g. increase Quality Priority to 40%) and show how scores update dynamically.
   - Show the **Decision Score Breakdown** card: explain how each attribute contributes normalized points.
   - Read the **Explainable AI (XAI)** narrative explaining why the top supplier was selected over alternatives.

3. **Walk through the Expert System (`Expert System`)**:
   - Show the 4-stage pipeline: *Working Memory Facts $\to$ Pattern Matching $\to$ Inference $\to$ Recommendation*.
   - Change the simulated supplier to show rules firing in real-time.

4. **Demonstrate Formal Knowledge Representation (`Knowledge Base`)**:
   - **Triples Tab**: Show the RDF assertions. Add a sample triple live.
   - **Semantic Network Tab**: Show the visual directed graph for any chosen supplier.
   - **Logic Tab**: Toggle Proposition $P$ and $Q$ to show live deduction ($P \wedge Q \to R$).
   - Show the First-Order Logic (FOL) quantified axioms.

5. **Demonstrate Statistical & Fuzzy Reasoning (`Statistical Reasoning`)**:
   - **Bayes Tab**: Explain how prior industry reliability updates to posterior probability given audited high quality.
   - **Fuzzy Logic Tab**: Show the membership curves and linguistic defuzzification.
   - **Bayes Net Tab**: Click network nodes to inspect conditional probability tables (CPTs).

6. **Demonstrate AI Problem Solvers (`AI Problem Solver`)**:
   - Open **Water Jug**: Enter 4L, 3L, Target 2L, and click Solve to show the BFS step sequence.
   - Open **N-Queens**: Switch between $N=4$ and $N=8$ to show safe chessboard placements.
   - Open **8-Puzzle**: Step through $A^*$ search using Manhattan distance.

7. **Review Analytical Dossier (`Reports`)**:
   - Show the final supplier ranking hierarchy and click **"Print / Export Audit"**.

---

## 🌍 UN Sustainable Development Goal (SDG) Alignment
* **SDG 9: Industry, Innovation and Infrastructure**
  * **Target 9.4**: Upgrades industrial infrastructure and supply networks through transparent, data-driven supplier evaluations, reducing defect wastage and mitigating logistics failure risks.
  * **Target 9.c & 9.2**: Promotes digital platform adoption by replacing heuristic/subjective procurement decisions with automated Knowledge Representation, Fuzzy Inference, and Bayesian risk estimation.

---

## 📚 Academic Literature Baseline & Research Papers
The design and methodology of this platform are grounded in the following peer-reviewed supply chain decision support research:
1. **B. Kam, K. Ahsan, H. Deng, and S. Duan**, *"Digital platforms in supply chain and logistics management: A systematic literature review,"* *Transportation Research Part E: Logistics and Transportation Review*, vol. 209, Art. no. 104737, 2026.
2. **D. H. Alahmadi and A. A. Jamjoom**, *"Decision support system for handling control decisions and decision-maker related to supply chain,"* *Journal of Big Data*, vol. 9, Art. no. 114, 2022.
3. **W. A. Teniwut and C. L. Hasyim**, *"Decision support system in supply chain: A systematic literature review,"* *Uncertain Supply Chain Management*, vol. 8, no. 1, pp. 131–148, 2020.

---

## 👥 Academic Project Details
* **Course**: B.Tech Computer Science & Engineering (Artificial Intelligence)
* **Course Code**: CCSAI0301
* **Subject**: AI Project-Based Learning (PBL) Progress Review – II
* **Project Title**: Supply Chain Decision Support Platform
* **SDG Alignment**: SDG 9 (Industry, Innovation and Infrastructure)

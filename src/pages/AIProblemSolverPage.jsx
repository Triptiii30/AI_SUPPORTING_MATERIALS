import React, { useState } from 'react';
import { 
  Boxes, 
  Droplet, 
  Crown, 
  MapPin, 
  Users, 
  Grid, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { 
  solveWaterJug, 
  solveNQueens, 
  solveTSP, 
  TSP_SAMPLE_CITIES, 
  solveMissionariesCannibals, 
  solve8Puzzle 
} from '../algorithms/problemSolvers';

function StateSpaceModel({ initial, goal, operators, constraints, cost, strategy }) {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
        <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-400 font-mono">
          State-Space Representation Model (Unit 2 Curriculum)
        </span>
        {strategy && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold font-sans">
            Strategy: {strategy}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 font-mono text-[11px]">
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-sans font-semibold">Initial State (S₀)</span>
          <span className="text-emerald-300 font-bold">{initial}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-sans font-semibold">Goal State (G)</span>
          <span className="text-sky-300 font-bold">{goal}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-sans font-semibold">Operators / Transitions</span>
          <span className="text-slate-200">{operators}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-sans font-semibold">Constraints (C)</span>
          <span className="text-amber-300">{constraints}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-sans font-semibold">Path Cost g(n)</span>
          <span className="text-violet-300">{cost}</span>
        </div>
      </div>
    </div>
  );
}

export default function AIProblemSolverPage() {
  const [activeSolver, setActiveSolver] = useState("jug");

  // 1. Water Jug State
  const [jugA, setJugA] = useState(4);
  const [jugB, setJugB] = useState(3);
  const [jugTarget, setJugTarget] = useState(2);
  const [jugSolution, setJugSolution] = useState(() => solveWaterJug(4, 3, 2));

  // 2. N-Queens State
  const [queenN, setQueenN] = useState(4);
  const [queenResult, setQueenResult] = useState(() => solveNQueens(4));

  // 3. TSP State
  const [selectedCities, setSelectedCities] = useState([0, 1, 2, 3, 4]);
  const [tspResult, setTspResult] = useState(() => solveTSP([0, 1, 2, 3, 4]));

  // 4. Missionaries & Cannibals State
  const [mcResult, setMcResult] = useState(() => solveMissionariesCannibals());
  const [mcStepIdx, setMcStepIdx] = useState(0);

  // 5. 8-Puzzle State
  const [puzzleInitial, setPuzzleInitial] = useState([1, 2, 3, 4, 0, 6, 7, 5, 8]);
  const [puzzleResult, setPuzzleResult] = useState(() => solve8Puzzle([1, 2, 3, 4, 0, 6, 7, 5, 8]));
  const [puzzleStepIdx, setPuzzleStepIdx] = useState(0);

  // Handlers
  const handleSolveWaterJug = () => {
    setJugSolution(solveWaterJug(Number(jugA), Number(jugB), Number(jugTarget)));
  };

  const handleSolveQueens = (n) => {
    setQueenN(n);
    setQueenResult(solveNQueens(n));
  };

  const handleToggleCity = (idx) => {
    if (selectedCities.includes(idx)) {
      if (selectedCities.length <= 3) {
        alert("Keep at least 3 cities for TSP tour.");
        return;
      }
      const updated = selectedCities.filter(c => c !== idx);
      setSelectedCities(updated);
      setTspResult(solveTSP(updated));
    } else {
      const updated = [...selectedCities, idx];
      setSelectedCities(updated);
      setTspResult(solveTSP(updated));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
            <Boxes className="w-3.5 h-3.5" />
            <span>Classical Search & Heuristic Algorithms</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">AI Problem Solver Suite</h2>
          <p className="text-xs text-slate-500">
            Interactive demonstrations of core AI curriculum state-space search and constraint satisfaction problems
          </p>
        </div>

        {/* Solver Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSolver("jug")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSolver === "jug" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Water Jug
          </button>
          <button
            onClick={() => setActiveSolver("queens")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSolver === "queens" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            N-Queens
          </button>
          <button
            onClick={() => setActiveSolver("tsp")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSolver === "tsp" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Travelling Salesperson
          </button>
          <button
            onClick={() => setActiveSolver("mc")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSolver === "mc" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Missionaries & Cannibals
          </button>
          <button
            onClick={() => setActiveSolver("puzzle")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSolver === "puzzle" ? "bg-white text-slate-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            8-Tile Puzzle
          </button>
        </div>
      </div>

      {/* 1. WATER JUG PROBLEM */}
      {activeSolver === "jug" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Water Jug Problem (Breadth-First Search)</h3>
              <p className="text-xs text-slate-500">Measure exactly the target volume using two uncalibrated jugs</p>
            </div>
            <Badge variant="brand">State-Space BFS</Badge>
          </div>

          {/* Formal State-Space Model (PBL Unit 2 Curriculum) */}
          <StateSpaceModel
            strategy="Breadth-First Search (BFS)"
            initial="(0, 0) [Both Jugs Empty]"
            goal={`(x, y) where x=${jugTarget}L or y=${jugTarget}L`}
            operators="Fill A/B, Empty A/B, Pour A→B, Pour B→A"
            constraints={`0 ≤ x ≤ ${jugA}, 0 ≤ y ≤ ${jugB}, Target is multiple of GCD(${jugA}, ${jugB})`}
            cost="Uniform step cost = 1 per state transition"
          />

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jug A Capacity (L)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={jugA}
                onChange={(e) => setJugA(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jug B Capacity (L)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={jugB}
                onChange={(e) => setJugB(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Volume (L)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={jugTarget}
                onChange={(e) => setJugTarget(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSolveWaterJug}
                className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Compute Solution</span>
              </button>
            </div>
          </div>

          {/* Steps Output */}
          {jugSolution.solvable ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Optimal Transition Path ({jugSolution.steps.length - 1} Steps):</span>
                <span className="text-emerald-600 font-semibold">{jugSolution.goalReached}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Step</th>
                      <th className="py-2.5 px-3">Jug A ({jugA}L)</th>
                      <th className="py-2.5 px-3">Jug B ({jugB}L)</th>
                      <th className="py-2.5 px-3">Action Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jugSolution.steps.map((st, i) => (
                      <tr key={i} className={i === jugSolution.steps.length - 1 ? "bg-emerald-50/50 font-bold text-emerald-900" : ""}>
                        <td className="py-2 px-3 text-slate-400 font-sans">Step {i}</td>
                        <td className="py-2 px-3 text-brand-600 font-bold">{st.a} L</td>
                        <td className="py-2 px-3 text-sky-600 font-bold">{st.b} L</td>
                        <td className="py-2 px-3 text-slate-700 font-sans">{st.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {jugSolution.message}
            </div>
          )}
        </div>
      )}

      {/* 2. N-QUEENS PROBLEM */}
      {activeSolver === "queens" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">N-Queens Problem (Backtracking Algorithm)</h3>
              <p className="text-xs text-slate-500">
                Place N non-attacking queens on an N×N chessboard such that no two share row, column, or diagonal
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-600">Select N:</span>
              {[4, 5, 6, 8].map(n => (
                <button
                  key={n}
                  onClick={() => handleSolveQueens(n)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    queenN === n ? "bg-brand-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  N={n}
                </button>
              ))}
            </div>
          </div>

          {/* Formal State-Space Model (PBL Unit 2 Curriculum) */}
          <StateSpaceModel
            strategy="Recursive Backtracking (CSP)"
            initial="[ ] (Empty Board, 0 Queens placed)"
            goal={`[q₀, ..., q_${queenN-1}] (${queenN} non-attacking queens)`}
            operators="Place queen at (row r, col c)"
            constraints="|col₁ - col₂| ≠ |row₁ - row₂| ∧ col₁ ≠ col₂"
            cost="Uniform step cost = 0 (Constraint Satisfaction Goal)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Chessboard Rendering */}
            <div className="flex justify-center">
              <div 
                className="grid border-2 border-slate-800 rounded-lg overflow-hidden shadow-md"
                style={{ gridTemplateColumns: `repeat(${queenN}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: queenN }).map((_, r) => (
                  <React.Fragment key={r}>
                    {Array.from({ length: queenN }).map((_, c) => {
                      const isDark = (r + c) % 2 === 1;
                      const hasQueen = queenResult.firstSolution[r] === c;

                      return (
                        <div
                          key={c}
                          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${
                            isDark ? 'bg-slate-700' : 'bg-slate-200'
                          }`}
                        >
                          {hasQueen && (
                            <span className="text-2xl drop-shadow animate-pulse" title={`Queen at Row ${r+1}, Col ${c+1}`}>
                              👑
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Solution Metadata */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Constraint Satisfaction Result</span>
              <h4 className="text-base font-extrabold text-slate-900">
                Found {queenResult.totalSolutions} valid configurations for N={queenN}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Backtracking recursively placed each queen column-by-column while validating row conflict and diagonal delta <span className="font-mono">|col₁ - col₂| ≠ |row₁ - row₂|</span>.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px]">
                Vector Representation: [{queenResult.firstSolution.join(", ")}]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRAVELLING SALESPERSON (TSP) */}
      {activeSolver === "tsp" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Travelling Salesperson Problem (Supply Chain Tour)</h3>
              <p className="text-xs text-slate-500">
                Find optimal minimum-distance Hamiltonian circuit connecting Indian logistics hubs
              </p>
            </div>
            <Badge variant="brand">Route Optimization</Badge>
          </div>

          {/* Formal State-Space Model (PBL Unit 2 Curriculum) */}
          <StateSpaceModel
            strategy="Exact Permutation / Optimal Circuit Search"
            initial="Start logistics depot (e.g. New Delhi)"
            goal="Complete circuit visiting all hubs and returning to Start"
            operators="Traverse road/rail corridor (u, v) to unvisited hub"
            constraints="Hamiltonian Cycle: each regional hub visited exactly once"
            cost="Total Euclidean haulage distance ∑ d(u, v) in km"
          />

          {/* City Selection Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Include Nodes:</span>
            {TSP_SAMPLE_CITIES.map((city) => {
              const active = selectedCities.includes(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => handleToggleCity(city.id)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                    active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Tour Route Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Leg</th>
                    <th className="py-2.5 px-3">Origin Hub</th>
                    <th className="py-2.5 px-3">Destination Hub</th>
                    <th className="py-2.5 px-3">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tspResult.stepBreakdown.map((step, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 text-slate-400">Leg {idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{step.from}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{step.to}</td>
                      <td className="py-2 px-3 text-brand-600 font-bold">{step.distance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Metric Card */}
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Circuit Route</span>
              <div className="text-2xl font-black text-white">
                {tspResult.totalDistance.toLocaleString()} <span className="text-sm font-normal text-slate-400">km</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                Tour: {tspResult.routeNames.join(" → ")}
              </p>
              <span className="text-[10px] text-slate-400 block pt-1">
                Optimized tour minimises logistics haulage costs across multi-tier warehouse nodes.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. MISSIONARIES AND CANNIBALS */}
      {activeSolver === "mc" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Missionaries and Cannibals (River Crossing BFS)</h3>
              <p className="text-xs text-slate-500">
                Safely transport 3 Missionaries and 3 Cannibals across river without Missionaries being outnumbered
              </p>
            </div>
            <Badge variant="brand">Safety Constraint BFS</Badge>
          </div>

          {/* Formal State-Space Model (PBL Unit 2 Curriculum) */}
          <StateSpaceModel
            strategy="Breadth-First Search (BFS)"
            initial="(3M, 3C, 1B) on Left Bank"
            goal="(0M, 0C, 0B) [All 3M, 3C transitioned safely to Right Bank]"
            operators="Boat moves 1M, 2M, 1C, 2C, or 1M+1C across river"
            constraints="M ≥ C on either bank (if M > 0); Boat capacity ≤ 2 persons"
            cost="Uniform step cost = 1 per river crossing transition"
          />

          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Optimal Sequence ({mcResult.steps.length - 1} Boat Crossings):
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={mcStepIdx === 0}
                onClick={() => setMcStepIdx(prev => Math.max(0, prev - 1))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-40"
              >
                Previous Step
              </button>
              <span className="font-mono text-slate-600">
                Step {mcStepIdx} of {mcResult.steps.length - 1}
              </span>
              <button
                disabled={mcStepIdx === mcResult.steps.length - 1}
                onClick={() => setMcStepIdx(prev => Math.min(mcResult.steps.length - 1, prev + 1))}
                className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 rounded text-white disabled:opacity-40"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Interactive Step Visualizer */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Bank */}
            <div className="w-full md:w-44 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Left River Bank</span>
              <div className="text-2xl font-black text-emerald-400">
                {mcResult.steps[mcStepIdx].state[0]}M | {mcResult.steps[mcStepIdx].state[1]}C
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {mcResult.steps[mcStepIdx].state[2] === 1 ? "⛵ Boat Here" : "Shore empty"}
              </span>
            </div>

            {/* River Middle & Action */}
            <div className="text-center px-4">
              <span className="text-[10px] uppercase font-bold text-sky-400 block mb-1">Crossing Action</span>
              <div className="font-bold text-sm text-white">{mcResult.steps[mcStepIdx].action}</div>
              <span className="text-xs text-slate-400 mt-1 block">Constraint: M ≥ C on each bank (if M &gt; 0)</span>
            </div>

            {/* Right Bank */}
            <div className="w-full md:w-44 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Right River Bank</span>
              <div className="text-2xl font-black text-sky-400">
                {3 - mcResult.steps[mcStepIdx].state[0]}M | {3 - mcResult.steps[mcStepIdx].state[1]}C
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {mcResult.steps[mcStepIdx].state[2] === 0 ? "⛵ Boat Here" : "Shore empty"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. 8-TILE PUZZLE */}
      {activeSolver === "puzzle" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">8-Puzzle Tile Problem (A* with Manhattan Heuristic)</h3>
              <p className="text-xs text-slate-500">
                A* search finding the minimal step sequence to align tiles 1 through 8
              </p>
            </div>
            <Badge variant="brand">A* Search Heuristic</Badge>
          </div>

          {/* Formal State-Space Model (PBL Unit 2 Curriculum) */}
          <StateSpaceModel
            strategy="A* Search with Manhattan Distance Heuristic"
            initial="Configured 3×3 Permutation with Blank Tile 0"
            goal="Goal State [1, 2, 3, 4, 5, 6, 7, 8, 0]"
            operators="Slide blank tile 0 {Up, Down, Left, Right}"
            constraints="Boundary checks: 0 ≤ row < 3 and 0 ≤ col < 3"
            cost="f(n) = g(n) + h(n) [Path Depth + Manhattan Displacement]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Tile Board */}
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-lg">
                {(puzzleResult.steps[puzzleStepIdx]?.board || puzzleInitial).map((tile, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-black text-xl select-none ${
                      tile === 0
                        ? "bg-slate-800/40 border border-dashed border-slate-700 text-transparent"
                        : "bg-brand-600 text-white shadow-md border-b-4 border-brand-800"
                    }`}
                  >
                    {tile !== 0 && tile}
                  </div>
                ))}
              </div>

              {/* Step Controls */}
              <div className="flex items-center space-x-3 mt-4 text-xs">
                <button
                  disabled={puzzleStepIdx === 0}
                  onClick={() => setPuzzleStepIdx(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold disabled:opacity-40"
                >
                  Step Backward
                </button>
                <span className="font-mono font-bold text-slate-800">
                  Step {puzzleStepIdx} / {puzzleResult.steps.length - 1}
                </span>
                <button
                  disabled={puzzleStepIdx === puzzleResult.steps.length - 1}
                  onClick={() => setPuzzleStepIdx(prev => Math.min(puzzleResult.steps.length - 1, prev + 1))}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 rounded-lg text-white font-bold disabled:opacity-40"
                >
                  Step Forward
                </button>
              </div>
            </div>

            {/* A* Step Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">A* Heuristic State Metrics</span>
              <h4 className="text-base font-extrabold text-slate-900">
                Action: {puzzleResult.steps[puzzleStepIdx]?.move || "Initial State"}
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-sans">Depth g(n)</span>
                  <span className="font-bold text-brand-600">{puzzleResult.steps[puzzleStepIdx]?.g || 0}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-sans">Manhattan h(n)</span>
                  <span className="font-bold text-amber-600">{puzzleResult.steps[puzzleStepIdx]?.h || 0}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-sans">f(n) = g + h</span>
                  <span className="font-bold text-emerald-600">
                    {(puzzleResult.steps[puzzleStepIdx]?.g || 0) + (puzzleResult.steps[puzzleStepIdx]?.h || 0)}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                The Manhattan Distance sums the horizontal and vertical displacements of each tile from its target coordinates in the goal state.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

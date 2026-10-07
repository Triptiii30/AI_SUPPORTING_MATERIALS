/**
 * AI Problem Solver Modules for Classical B.Tech CSE AI Syllabus
 * 1. Water Jug Problem (BFS)
 * 2. N-Queens Problem (Backtracking)
 * 3. Travelling Salesperson Problem (Heuristic/Exact TSP)
 * 4. Missionaries and Cannibals (State Space Search)
 * 5. 8-Puzzle Tile Problem (A* with Manhattan Heuristic)
 */

// ----------------------------------------------------------------------
// 1. WATER JUG PROBLEM
// ----------------------------------------------------------------------
export function solveWaterJug(capA = 4, capB = 3, target = 2) {
  if (target > Math.max(capA, capB)) {
    return { solvable: false, steps: [], message: `Target ${target} exceeds jug capacities.` };
  }

  // Helper gcd
  const gcd = (a, b) => (!b ? a : gcd(b, a % b));
  if (target % gcd(capA, capB) !== 0) {
    return { solvable: false, steps: [], message: `Target ${target} is not measurable by GCD(${capA}, ${capB}).` };
  }

  const queue = [{ a: 0, b: 0, action: "Initial State (Both jugs empty)", path: [] }];
  const visited = new Set();
  visited.add("0,0");

  while (queue.length > 0) {
    const current = queue.shift();
    const newPath = [...current.path, { a: current.a, b: current.b, action: current.action }];

    if (current.a === target || current.b === target) {
      return {
        solvable: true,
        steps: newPath,
        goalReached: `Target ${target}L successfully achieved in ${newPath.length - 1} transitions.`
      };
    }

    const { a, b } = current;
    const nextStates = [
      { a: capA, b: b, action: `Fill Jug A (${capA}L)` },
      { a: a, b: capB, action: `Fill Jug B (${capB}L)` },
      { a: 0, b: b, action: `Empty Jug A` },
      { a: a, b: 0, action: `Empty Jug B` },
      // Pour A -> B
      {
        a: a - Math.min(a, capB - b),
        b: b + Math.min(a, capB - b),
        action: `Pour Jug A → Jug B (${Math.min(a, capB - b)}L transferred)`
      },
      // Pour B -> A
      {
        a: a + Math.min(b, capA - a),
        b: b - Math.min(b, capA - a),
        action: `Pour Jug B → Jug A (${Math.min(b, capA - a)}L transferred)`
      }
    ];

    for (const state of nextStates) {
      const key = `${state.a},${state.b}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ ...state, path: newPath });
      }
    }
  }

  return { solvable: false, steps: [], message: "No solution found." };
}

// ----------------------------------------------------------------------
// 2. N-QUEENS PROBLEM
// ----------------------------------------------------------------------
export function solveNQueens(n = 4) {
  const solutions = [];
  const board = Array(n).fill(-1); // board[row] = col

  function isSafe(row, col) {
    for (let prevRow = 0; prevRow < row; prevRow++) {
      const prevCol = board[prevRow];
      if (prevCol === col || Math.abs(prevCol - col) === Math.abs(prevRow - row)) {
        return false;
      }
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      solutions.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        backtrack(row + 1);
        board[row] = -1;
      }
    }
  }

  backtrack(0);

  return {
    n,
    totalSolutions: solutions.length,
    firstSolution: solutions[0] || [],
    allSolutions: solutions
  };
}

// ----------------------------------------------------------------------
// 3. TRAVELLING SALESPERSON PROBLEM (TSP)
// ----------------------------------------------------------------------
export const TSP_SAMPLE_CITIES = [
  { id: 0, name: "New Delhi", tag: "Logistics Hub North", x: 140, y: 50 },
  { id: 1, name: "Mumbai", tag: "Port Terminal West", x: 60, y: 150 },
  { id: 2, name: "Bengaluru", tag: "Tech & Precision Hub", x: 100, y: 220 },
  { id: 3, name: "Chennai", tag: "Auto Corridor South", x: 150, y: 210 },
  { id: 4, name: "Kolkata", tag: "Steel & Mining East", x: 230, y: 110 }
];

// Distance matrix (in km)
export const TSP_DISTANCES = [
  [0, 1420, 2150, 2180, 1530], // New Delhi
  [1420, 0, 980, 1340, 1960],  // Mumbai
  [2150, 980, 0, 350, 1870],   // Bengaluru
  [2180, 1340, 350, 0, 1660],  // Chennai
  [1530, 1960, 1870, 1660, 0]  // Kolkata
];

export function solveTSP(selectedCityIndices = [0, 1, 2, 3, 4]) {
  const n = selectedCityIndices.length;
  if (n <= 1) return { route: selectedCityIndices, totalDistance: 0 };

  // Generate all permutations for small N
  const permute = arr => {
    if (arr.length <= 1) return [arr];
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = permute(rest);
      perms.forEach(p => res.push([arr[i], ...p]));
    }
    return res;
  };

  const startCity = selectedCityIndices[0];
  const otherCities = selectedCityIndices.slice(1);
  const permutations = permute(otherCities);

  let bestRoute = null;
  let minDistance = Infinity;

  permutations.forEach(p => {
    const route = [startCity, ...p, startCity];
    let dist = 0;
    for (let i = 0; i < route.length - 1; i++) {
      dist += TSP_DISTANCES[route[i]][route[i + 1]];
    }
    if (dist < minDistance) {
      minDistance = dist;
      bestRoute = route;
    }
  });

  return {
    route: bestRoute,
    routeNames: bestRoute.map(idx => TSP_SAMPLE_CITIES[idx].name),
    totalDistance: minDistance,
    stepBreakdown: bestRoute.slice(0, -1).map((idx, i) => ({
      from: TSP_SAMPLE_CITIES[idx].name,
      to: TSP_SAMPLE_CITIES[bestRoute[i + 1]].name,
      distance: TSP_DISTANCES[idx][bestRoute[i + 1]]
    }))
  };
}

// ----------------------------------------------------------------------
// 4. MISSIONARIES AND CANNIBALS PROBLEM
// ----------------------------------------------------------------------
export function solveMissionariesCannibals() {
  // State: [M_left, C_left, Boat_left (1 or 0)]
  const start = [3, 3, 1];
  const goal = [0, 0, 0];

  function isValid(m, c) {
    if (m < 0 || m > 3 || c < 0 || c > 3) return false;
    // Left bank safety
    if (m > 0 && m < c) return false;
    // Right bank safety
    const mRight = 3 - m;
    const cRight = 3 - c;
    if (mRight > 0 && mRight < cRight) return false;
    return true;
  }

  // Possible boat loads: (M, C)
  const boatMoves = [
    [1, 0], [2, 0], [0, 1], [0, 2], [1, 1]
  ];

  const queue = [{ state: start, path: [], action: "Initial State: All 3M, 3C on Left Bank" }];
  const visited = new Set();
  visited.add(start.join(","));

  while (queue.length > 0) {
    const current = queue.shift();
    const [m, c, boat] = current.state;
    const newPath = [...current.path, { state: current.state, action: current.action }];

    if (m === goal[0] && c === goal[1] && boat === goal[2]) {
      return {
        solved: true,
        steps: newPath
      };
    }

    boatMoves.forEach(([dm, dc]) => {
      let nextM, nextC, nextBoat, moveDesc;
      if (boat === 1) {
        // Boat travels Left -> Right
        nextM = m - dm;
        nextC = c - dc;
        nextBoat = 0;
        moveDesc = `Send ${dm > 0 ? dm + 'M ' : ''}${dc > 0 ? dc + 'C ' : ''}to Right Bank`;
      } else {
        // Boat travels Right -> Left
        nextM = m + dm;
        nextC = c + dc;
        nextBoat = 1;
        moveDesc = `Return ${dm > 0 ? dm + 'M ' : ''}${dc > 0 ? dc + 'C ' : ''}to Left Bank`;
      }

      if (isValid(nextM, nextC)) {
        const key = `${nextM},${nextC},${nextBoat}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            state: [nextM, nextC, nextBoat],
            path: newPath,
            action: moveDesc
          });
        }
      }
    });
  }

  return { solved: false, steps: [] };
}

// ----------------------------------------------------------------------
// 5. 8-PUZZLE TILE PROBLEM (A* with Manhattan Heuristic)
// ----------------------------------------------------------------------
export const GOAL_8_PUZZLE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function getManhattanDistance(board) {
  let dist = 0;
  for (let i = 0; i < 9; i++) {
    const val = board[i];
    if (val !== 0) {
      const targetPos = val - 1;
      const targetRow = Math.floor(targetPos / 3);
      const targetCol = targetPos % 3;
      const currRow = Math.floor(i / 3);
      const currCol = i % 3;
      dist += Math.abs(currRow - targetRow) + Math.abs(currCol - targetCol);
    }
  }
  return dist;
}

export function solve8Puzzle(initialBoard = [1, 2, 3, 4, 0, 6, 7, 5, 8], maxDepth = 400) {
  const goalStr = GOAL_8_PUZZLE.join(",");
  const startStr = initialBoard.join(",");

  if (startStr === goalStr) {
    return {
      solved: true,
      steps: [{ board: initialBoard, move: "Already at Goal State", g: 0, h: 0 }]
    };
  }

  const moves = [
    { rowDiff: -1, colDiff: 0, name: "Up" },
    { rowDiff: 1, colDiff: 0, name: "Down" },
    { rowDiff: 0, colDiff: -1, name: "Left" },
    { rowDiff: 0, colDiff: 1, name: "Right" }
  ];

  // Priority queue simulated
  const openSet = [{
    board: initialBoard,
    g: 0,
    h: getManhattanDistance(initialBoard),
    f: getManhattanDistance(initialBoard),
    move: "Start State",
    path: []
  }];

  const visited = new Map();
  visited.set(startStr, 0);

  let iterations = 0;

  while (openSet.length > 0 && iterations < maxDepth) {
    iterations++;
    // Pop lowest f
    openSet.sort((a, b) => a.f - b.f);
    const curr = openSet.shift();
    const currStr = curr.board.join(",");

    const currentPath = [...curr.path, { board: curr.board, move: curr.move, g: curr.g, h: curr.h }];

    if (currStr === goalStr) {
      return {
        solved: true,
        steps: currentPath,
        iterations
      };
    }

    const zeroIndex = curr.board.indexOf(0);
    const zRow = Math.floor(zeroIndex / 3);
    const zCol = zeroIndex % 3;

    moves.forEach(({ rowDiff, colDiff, name }) => {
      const nRow = zRow + rowDiff;
      const nCol = zCol + colDiff;

      if (nRow >= 0 && nRow < 3 && nCol >= 0 && nCol < 3) {
        const targetIndex = nRow * 3 + nCol;
        const newBoard = [...curr.board];
        newBoard[zeroIndex] = newBoard[targetIndex];
        newBoard[targetIndex] = 0;

        const nextStr = newBoard.join(",");
        const g = curr.g + 1;
        const h = getManhattanDistance(newBoard);
        const f = g + h;

        if (!visited.has(nextStr) || visited.get(nextStr) > g) {
          visited.set(nextStr, g);
          openSet.push({
            board: newBoard,
            g,
            h,
            f,
            move: `Move tile ${newBoard[zeroIndex]} ${name}`,
            path: currentPath
          });
        }
      }
    });
  }

  return {
    solved: false,
    message: "Reached search depth boundary. Preset configured with optimal solvable demonstration.",
    steps: []
  };
}

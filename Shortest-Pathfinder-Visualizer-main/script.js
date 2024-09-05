// Define the grid size
const gridSize = 10;

// Create the grid
const gridContainer = document.getElementById("grid-container");
const grid = [];

let selectingStart = true;
let start = { row: 0, col: 0 };
let end = { row: gridSize - 1, col: gridSize - 1 };

for (let i = 0; i < gridSize; i++) {
  const row = [];
  for (let j = 0; j < gridSize; j++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.dataset.row = i;
    cell.dataset.col = j;
    cell.addEventListener("click", () => {
      if (cell.classList.contains("start") || cell.classList.contains("end"))
        return;

      if (selectingStart) {
        if (grid[start.row][start.col].classList.contains("start")) {
          grid[start.row][start.col].classList.remove("start");
        }
        cell.classList.add("start");
        start = { row: i, col: j };
        selectingStart = false;
      } else if (cell.classList.contains("wall")) {
        // Do nothing if the cell is a wall
        return;
      } else {
        if (grid[end.row][end.col].classList.contains("end")) {
          grid[end.row][end.col].classList.remove("end");
        }
        cell.classList.add("end");
        end = { row: i, col: j };
        selectingStart = true;
      }
    });

    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (
        !cell.classList.contains("start") &&
        !cell.classList.contains("end")
      ) {
        cell.classList.toggle("wall");
      }
    });

    row.push(cell);
    gridContainer.appendChild(cell);
  }
  grid.push(row);
}

// Initialize start and end points
grid[start.row][start.col].classList.add("start");
grid[end.row][end.col].classList.add("end");

// Implement Dijkstra's Algorithm
function dijkstra(start, end) {
  const distances = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(Infinity)
  );
  const visited = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );
  const previous = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
  );

  distances[start.row][start.col] = 0;

  const queue = [{ row: start.row, col: start.col, distance: 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();

    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;

    if (current.row === end.row && current.col === end.col) break;

    const neighbors = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.row >= 0 &&
        neighbor.row < gridSize &&
        neighbor.col >= 0 &&
        neighbor.col < gridSize &&
        !visited[neighbor.row][neighbor.col] &&
        !grid[neighbor.row][neighbor.col].classList.contains("wall")
      ) {
        const newDistance = current.distance + 1;
        if (newDistance < distances[neighbor.row][neighbor.col]) {
          distances[neighbor.row][neighbor.col] = newDistance;
          previous[neighbor.row][neighbor.col] = current;
          queue.push({
            row: neighbor.row,
            col: neighbor.col,
            distance: newDistance,
          });
        }
      }
    }
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current.row][current.col];
  }

  return path;
}

document.getElementById("start-button").addEventListener("click", () => {
  // Clear previous path
  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.classList.remove("path", "visited");
    })
  );

  const path = dijkstra(start, end);
  for (const cell of path) {
    if (
      !grid[cell.row][cell.col].classList.contains("start") &&
      !grid[cell.row][cell.col].classList.contains("end")
    ) {
      grid[cell.row][cell.col].classList.add("path");
    }
  }
});

document.getElementById("refresh-button").addEventListener("click", () => {
  // Clear all classes except for walls
  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.className = "grid-cell";
    })
  );
  selectingStart = true;
  start = { row: 0, col: 0 };
  end = { row: gridSize - 1, col: gridSize - 1 };
  grid[start.row][start.col].classList.add("start");
  grid[end.row][end.col].classList.add("end");
});

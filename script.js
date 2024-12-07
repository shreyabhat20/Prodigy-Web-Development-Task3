const board = Array(9).fill(null); // 3x3 grid as a flat array
let currentPlayer = 'X'; // Tracks the current player
let isGameActive = false; // Tracks if the game is ongoing
let isAI = false; // Tracks game mode

const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const twoPlayerBtn = document.getElementById('two-player-btn');
const aiPlayerBtn = document.getElementById('ai-player-btn');

// Winning Combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize the game
function startGame() {
  gameBoard.innerHTML = ''; // Clear the board
  board.fill(null); // Reset the board array
  currentPlayer = 'X'; // Reset to Player X
  isGameActive = true;
  statusDisplay.textContent = `${currentPlayer}'s Turn`; // Show status

  // Create 3x3 grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }

  restartBtn.classList.remove('hidden'); // Show restart button
}

// Handle cell clicks
function handleCellClick(event) {
  const index = event.target.dataset.index;

  // Ignore clicks on taken cells or if the game is over
  if (board[index] !== null || !isGameActive) return;

  // Mark the cell and update the board
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add('taken');

  // Check for a win or draw
  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer} Wins!`;
    isGameActive = false;
  } else if (board.every(cell => cell !== null)) {
    statusDisplay.textContent = 'Draw!';
    isGameActive = false;
  } else {
    // Switch players or let AI make a move
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer}'s Turn`;
    if (isAI && currentPlayer === 'O') {
      setTimeout(aiMove, 500); // Add delay for AI move
    }
  }
}

// AI logic for a simple move
function aiMove() {
  const emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // Simulate AI's turn
  board[randomIndex] = currentPlayer;
  const aiCell = gameBoard.children[randomIndex];
  aiCell.textContent = currentPlayer;
  aiCell.classList.add('taken');

  // Check for win or draw after AI move
  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer} Wins!`;
    isGameActive = false;
  } else if (board.every(cell => cell !== null)) {
    statusDisplay.textContent = 'Draw!';
    isGameActive = false;
  } else {
    currentPlayer = 'X';
    statusDisplay.textContent = `${currentPlayer}'s Turn`;
  }
}

// Check for winning condition
function checkWin() {
  return winningCombinations.some(combination =>
    combination.every(index => board[index] === currentPlayer)
  );
}

// Restart the game
restartBtn.addEventListener('click', startGame);

// Game mode selection
twoPlayerBtn.addEventListener('click', () => {
  isAI = false;
  startGame();
});

aiPlayerBtn.addEventListener('click', () => {
  isAI = true;
  startGame();
});

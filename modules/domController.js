/* Handles visual displays and feedback + user inputs and clicks */
import {
	state,
	startNewGame,
	getPlayerGameboard,
	startMatch,
} from "./gameController.js";
import { Ship } from "./ship.js";

function createStartButton() {
	const startBtn = document.createElement("button");
	startBtn.classList.add("start-btn");
	startBtn.textContent = "Start Game";
	document.body.appendChild(startBtn);
}

function createBoard() {
	const startBtn = document.querySelector(".start-btn");
	if (startBtn) startBtn.remove();

	const mainContainer = document.createElement("div");
	mainContainer.classList.add("main-container");

	const message = document.createElement("h1");
	message.classList.add("message");
	message.textContent = "Place your ships";
	mainContainer.appendChild(message);

	const boardsContainer = document.createElement("div");
	boardsContainer.classList.add("boards-container");
	mainContainer.appendChild(boardsContainer);

	const playerContainer = document.createElement("div");
	playerContainer.classList.add("player-container");

	const playerTitle = document.createElement("h2");
	playerTitle.classList.add("player-title");
	playerTitle.textContent = "Player";

	const playerBoard = document.createElement("div");
	playerBoard.classList.add("player-board");

	const axisBtn = document.createElement("button");
	axisBtn.classList.add("axis-btn");
	axisBtn.textContent = "Axis: X";
	axisBtn.addEventListener("click", () => {
		if (state.orientation === "horizontal") {
			axisBtn.textContent = "Axis: Y";
			state.orientation = "vertical";
		} else if (state.orientation === "vertical") {
			axisBtn.textContent = "Axis: X";
			state.orientation = "horizontal";
		}
	});

	const resetBtn = document.createElement("button");
	resetBtn.classList.add("reset-btn");
	resetBtn.textContent = "Reset";
	resetBtn.addEventListener("click", () => {
		startNewGame();
	});

	const beginBtn = document.createElement("button");
	beginBtn.classList.add("begin-btn");
	beginBtn.classList.add("invalid");
	beginBtn.textContent = "Begin";
	beginBtn.addEventListener("click", () => {
		if (state.validStart === true) {
			if (beginBtn) beginBtn.remove();
			if (resetBtn) resetBtn.remove();
			if (axisBtn) axisBtn.remove();
			const board = getPlayerGameboard();
			renderBoard(board, playerBoard);
			startMatch();
		}
	});

	playerContainer.appendChild(playerTitle);
	playerContainer.appendChild(playerBoard);
	playerContainer.appendChild(axisBtn);
	playerContainer.appendChild(resetBtn);
	playerContainer.appendChild(beginBtn);

	const botContainer = document.createElement("div");
	botContainer.classList.add("bot-container");

	const botTitle = document.createElement("h2");
	botTitle.classList.add("bot-title");
	botTitle.textContent = "AI";

	const botBoard = document.createElement("div");
	botBoard.classList.add("bot-board");

	botContainer.appendChild(botTitle);
	botContainer.appendChild(botBoard);

	boardsContainer.appendChild(playerContainer);
	boardsContainer.appendChild(botContainer);

	document.body.appendChild(mainContainer);
}

function createBoardGrid(board, type) {
	for (let r = 0; r < 10; r++) {
		for (let c = 0; c < 10; c++) {
			const cell = document.createElement("div");

			if (type === "player") {
				cell.classList.add("p-cell");
			} else if (type === "bot") {
				cell.classList.add("b-cell");
			}

			cell.dataset.coords = `${r},${c}`;
			board.appendChild(cell);
		}
	}
}

function highlightShip(coordinates, ship, isValid) {
	const [r, c] = coordinates;
	const length = ship.length;

	clearHighlights();

	for (let i = 0; i < length; i++) {
		let row = r;
		let col = c;

		if (state.orientation === "horizontal") {
			col = c + i;
		} else if (state.orientation === "vertical") {
			row = r + i;
		}

		if (row < 0 || row > 9 || col < 0 || col > 9) {
			continue;
		}

		const cell = document.querySelector(`.p-cell[data-coords="${row},${col}"]`);
		if (cell) {
			cell.classList.add("highlight");
			cell.style.cursor = isValid ? "pointer" : "not-allowed";
		}
	}
}

function clearHighlights() {
	document.querySelectorAll(".p-cell.highlight").forEach((cell) => {
		cell.classList.remove("highlight");
		cell.style.cursor = "";
	});
}

function renderBoard(gameboard, boardElement) {
	for (let r = 0; r < 10; r++) {
		for (let c = 0; c < 10; c++) {
			const cellValue = gameboard.board[r][c];
			const cell = boardElement.querySelector(
				`.p-cell[data-coords="${r},${c}"]`
			);
			if (!cell) continue;
			cell.classList.remove("miss", "hit", "sunk", "ship", "ship-cell");
			if (cellValue === "miss") {
				cell.classList.add("miss");
			} else if (cellValue === "sunk") {
				cell.classList.add("sunk");
			} else if (
				cellValue !== null &&
				typeof cellValue === "object" &&
				cellValue.ship instanceof Ship
			) {
				if (cellValue.hit) {
					cell.classList.add("hit");
				} else {
					cell.classList.add("ship");
				}
			}
		}
	}
}

function renderBotBoard(gameboard, boardElement) {
	for (let r = 0; r < 10; r++) {
		for (let c = 0; c < 10; c++) {
			const cellValue = gameboard.board[r][c];
			const cell = boardElement.querySelector(
				`.b-cell[data-coords="${r},${c}"]`
			);
			if (!cell) continue;
			cell.classList.remove("miss", "hit", "sunk", "ship", "ship-cell");
			if (cellValue === "miss") {
				cell.classList.add("miss");
			} else if (cellValue === "sunk") {
				cell.classList.add("sunk");
			} else if (
				cellValue !== null &&
				typeof cellValue === "object" &&
				cellValue.ship instanceof Ship
			) {
				if (cellValue.hit) {
					cell.classList.add("hit");
				}
			}
		}
	}
}

export {
	createStartButton,
	createBoard,
	createBoardGrid,
	highlightShip,
	clearHighlights,
	renderBoard,
	renderBotBoard,
};

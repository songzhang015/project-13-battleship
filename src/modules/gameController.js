/* Handles game state management, win/lose conditions, AI logic, and game flow */
import {
	createBoard,
	createBoardGrid,
	highlightShip,
	clearHighlights,
	renderBoard,
	renderBotBoard,
} from "./domController.js";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameBoard.js";

const playerShips = [];
const botShips = [];
let playerGameboard;
let botGameboard;

let gameOver = false;

const state = {
	orientation: "horizontal",
	validStart: false,
};

function startNewGame() {
	document.body.innerHTML = "";
	state.orientation = "horizontal";
	createBoard();
	playerGameboard = new Gameboard();
	botGameboard = new Gameboard();

	playerShips.length = 0;
	botShips.length = 0;

	const playerBoardElement = document.querySelector(".player-board");
	const botBoardElement = document.querySelector(".bot-board");
	createBoardGrid(playerBoardElement, "player");
	createBoardGrid(botBoardElement, "bot");
	createShips();
	placeShips();
}

function createShips() {
	playerShips.push(new Ship("Carrier", 5));
	playerShips.push(new Ship("Battleship", 4));
	playerShips.push(new Ship("Destroyer", 3));
	playerShips.push(new Ship("Submarine", 3));
	playerShips.push(new Ship("Patrol Boat", 2));

	botShips.push(new Ship("Carrier", 5));
	botShips.push(new Ship("Battleship", 4));
	botShips.push(new Ship("Destroyer", 3));
	botShips.push(new Ship("Submarine", 3));
	botShips.push(new Ship("Patrol Boat", 2));
}

async function placeShips() {
	for (const ship of playerShips) {
		await placeShip(ship);
	}
	document.querySelector(".begin-btn").classList.remove("invalid");
	document.querySelector(".message").textContent =
		"Hit begin when you are ready!";
	state.validStart = true;
}

function placeShip(ship) {
	return new Promise((resolve) => {
		addPlacementListeners(ship, resolve);
	});
}

function addPlacementListeners(ship, resolve) {
	const cells = document.querySelectorAll(".p-cell");

	function onMouseEnter() {
		const coordinates = this.dataset.coords.split(",").map(Number);
		const isValid = canPlaceShip(coordinates, ship);
		highlightShip(coordinates, ship, isValid);
	}

	function onMouseLeave() {
		clearHighlights();
	}

	function onClick() {
		const coordinates = this.dataset.coords.split(",").map(Number);
		if (canPlaceShip(coordinates, ship)) {
			playerGameboard.placeShip(coordinates, state.orientation, ship);

			const [r, c] = coordinates;
			for (let i = 0; i < ship.length; i++) {
				let row = r;
				let col = c;
				if (state.orientation === "horizontal") {
					col = c + i;
				} else if (state.orientation === "vertical") {
					row = r + i;
				}
				const cell = document.querySelector(
					`.p-cell[data-coords="${row},${col}"]`
				);
				if (cell) cell.classList.add("ship-cell");
			}

			cells.forEach((cell) => {
				cell.removeEventListener("mouseenter", onMouseEnter);
				cell.removeEventListener("mouseleave", onMouseLeave);
				cell.removeEventListener("click", onClick);
			});

			clearHighlights();
			resolve();
		}
	}

	cells.forEach((cell) => {
		cell.addEventListener("mouseenter", onMouseEnter);
		cell.addEventListener("mouseleave", onMouseLeave);
		cell.addEventListener("click", onClick);
	});
}

function canPlaceShip(coordinates, ship) {
	const [r, c] = coordinates;
	const length = ship.length;

	for (let i = 0; i < length; i++) {
		let row = r;
		let col = c;

		if (state.orientation === "horizontal") {
			col = c + i;
		} else if (state.orientation === "vertical") {
			row = r + i;
		}

		if (
			row < 0 ||
			row > 9 ||
			col < 0 ||
			col > 9 ||
			playerGameboard.board[row][col] !== null
		) {
			return false;
		}
	}

	return true;
}

function placeBotShips() {
	for (const ship of botShips) {
		let placed = false;

		while (!placed) {
			const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
			let maxRow;
			let maxCol;
			if (orientation === "vertical") {
				maxRow = 10 - ship.length;
				maxCol = 9;
			} else if (orientation === "horizontal") {
				maxRow = 9;
				maxCol = 10 - ship.length;
			}
			const row = Math.floor(Math.random() * (maxRow + 1));
			const col = Math.floor(Math.random() * (maxCol + 1));

			if (canPlaceBotShip([row, col], orientation, ship)) {
				botGameboard.placeShip([row, col], orientation, ship);
				placed = true;
			}
		}
	}
}

function canPlaceBotShip(coordinates, orientation, ship) {
	const [r, c] = coordinates;
	for (let i = 0; i < ship.length; i++) {
		let row = r;
		let col = c;
		if (orientation === "horizontal") {
			col = c + i;
		} else if (orientation === "vertical") {
			row = r + i;
		}
		if (
			row < 0 ||
			row > 9 ||
			col < 0 ||
			col > 9 ||
			botGameboard.board[row][col] !== null
		) {
			return false;
		}
	}
	return true;
}

function getPlayerGameboard() {
	return playerGameboard;
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startMatch() {
	renderBoard(playerGameboard, document.querySelector(".player-board"));
	placeBotShips();
	renderBotBoard(botGameboard, document.querySelector(".bot-board"));
	while (gameOver === false) {
		await playerTurn();
		if (botGameboard.allSunk()) {
			gameOver = true;
			document.querySelector(".message").textContent = "You won!";
			break;
		}
		await botTurn();
		if (playerGameboard.allSunk()) {
			gameOver = true;
			document.querySelector(".message").textContent = "You lost!";
			break;
		}
	}
}

async function playerTurn() {
	document.querySelector(".message").textContent = "Your Turn!";
	return new Promise((resolve) => {
		enableAttackSelection(
			botGameboard,
			document.querySelector(".bot-board"),
			() => {
				renderBotBoard(botGameboard, document.querySelector(".bot-board"));
				resolve();
			}
		);
	});
}

async function botTurn() {
	document.querySelector(".message").textContent = "Bot's Turn!";
	await wait(750);
	hitRandomSpot(playerGameboard);
	renderBoard(playerGameboard, document.querySelector(".player-board"));
	await wait(250);
}

function hitRandomSpot(gameboard) {
	while (true) {
		const row = Math.floor(Math.random() * 10);
		const col = Math.floor(Math.random() * 10);
		const cell = gameboard.board[row][col];
		const isUnhitShip =
			cell !== null &&
			typeof cell === "object" &&
			cell.ship instanceof Ship &&
			!cell.hit;
		if (cell === null || isUnhitShip) {
			return gameboard.receiveAttack([row, col]);
		}
	}
}

function enableAttackSelection(gameboard, boardElement, resolve) {
	const cells = boardElement.querySelectorAll(".b-cell");

	function onMouseEnter() {
		const [row, col] = this.dataset.coords.split(",").map(Number);
		const cell = gameboard.board[row][col];

		if (cell === null || (typeof cell === "object" && cell.ship && !cell.hit)) {
			this.classList.add("highlight");
		} else {
			this.classList.add("invalid");
		}
	}

	function onMouseLeave() {
		this.classList.remove("highlight", "invalid");
	}

	function onClick() {
		const [row, col] = this.dataset.coords.split(",").map(Number);
		const cell = gameboard.board[row][col];

		if (cell !== null && (!cell.ship || cell.hit)) return;

		gameboard.receiveAttack([row, col]);
		cells.forEach((cell) => {
			cell.removeEventListener("mouseenter", onMouseEnter);
			cell.removeEventListener("mouseleave", onMouseLeave);
			cell.removeEventListener("click", onClick);
		});
		resolve();
	}
	cells.forEach((cell) => {
		cell.addEventListener("mouseenter", onMouseEnter);
		cell.addEventListener("mouseleave", onMouseLeave);
		cell.addEventListener("click", onClick);
	});
}

export { startNewGame, state, getPlayerGameboard, startMatch };

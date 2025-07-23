/* Handles game state management, win/lose conditions, AI logic, and game flow */
import {
	createBoard,
	createBoardGrid,
	highlightShip,
	clearHighlights,
} from "./domController.js";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameBoard.js";

const playerShips = [];
const botShips = [];
let playerGameboard;
let botGameboard;

function startNewGame() {
	createBoard();
	playerGameboard = new Gameboard();
	botGameboard = new Gameboard();

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
}

function placeShip(ship) {
	return new Promise((resolve) => {
		const orientation = "horizontal";
		addPlacementListeners(ship, orientation, resolve);
	});
}

function addPlacementListeners(ship, orientation, resolve) {
	const cells = document.querySelectorAll(".p-cell");

	function onMouseEnter() {
		const coordinates = this.dataset.coords.split(",").map(Number);
		const isValid = canPlaceShip(coordinates, orientation, ship);
		highlightShip(coordinates, orientation, ship, isValid);
	}

	function onMouseLeave() {
		clearHighlights();
	}

	function onClick() {
		const coordinates = this.dataset.coords.split(",").map(Number);
		if (canPlaceShip(coordinates, orientation, ship)) {
			playerGameboard.placeShip(coordinates, orientation, ship);

			const [r, c] = coordinates;
			for (let i = 0; i < ship.length; i++) {
				let row = r;
				let col = c;
				if (orientation === "horizontal") {
					col = c + i;
				} else if (orientation === "vertical") {
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
		} else {
			alert("Invalid placement, try again.");
		}
	}

	cells.forEach((cell) => {
		cell.addEventListener("mouseenter", onMouseEnter);
		cell.addEventListener("mouseleave", onMouseLeave);
		cell.addEventListener("click", onClick);
	});
}

function canPlaceShip(coordinates, orientation, ship) {
	const [r, c] = coordinates;
	const length = ship.length;

	for (let i = 0; i < length; i++) {
		let row = r;
		let col = c;

		if (orientation === "horizontal") {
			col = c + i;
		} else if (orientation === "vertical") {
			row = r + i;
		}

		if (row < 0 || row > 9 || col < 0 || col > 9) {
			return false;
		}

		if (playerGameboard.board[row][col] instanceof Ship) {
			return false;
		}
	}

	return true;
}

export { startNewGame };

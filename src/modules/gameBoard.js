/* Game board class, a coordinate grid */
import { Ship } from "../modules/ship.js";

class Gameboard {
	constructor() {
		// Initialize an array of 10 nulls, then map each null to an array of 10 nulls
		// Access each location via board[i][j]
		// null (nothing), Ship (part of ship), "miss" (attacked & missed), "hit" (attacked & hit)
		this.board = Array(10)
			.fill(null)
			.map(() => Array(10).fill(null));
	}

	placeShip(coordinates, orientation, ship) {
		// Coordinates in [row, col] format, ex. [0, 0]
		// Orientation either "horizontal" or "vertical"
		const [r, c] = coordinates;
		const length = ship.length;
		if (orientation === "horizontal") {
			for (let i = 0; i < length; i++) {
				this.board[r][c + i] = ship;
			}
		} else if (orientation === "vertical") {
			for (let i = 0; i < length; i++) {
				this.board[r + i][c] = ship;
			}
		}
	}

	receiveAttack(coordinates) {
		// Coordinates in [row, col] format, ex. [0, 0]
		// Reports "miss", "hit", "sunk"
		const [r, c] = coordinates;
		if (this.board[r][c] instanceof Ship) {
			const ship = this.board[r][c];
			ship.hit();
			ship.sunk = ship.isSunk();
			ship.sunk ? (this.board[r][c] = "sunk") : (this.board[r][c] = "hit");
			return ship.sunk ? "sunk" : "hit";
		}
		this.board[r][c] = "miss";
		return "miss";
	}

	allSunk() {
		return !this.board.some((row) => row.some((item) => item instanceof Ship));
	}
}

export { Gameboard };

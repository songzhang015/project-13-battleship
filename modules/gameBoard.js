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
				this.board[r][c + i] = { ship, hit: false };
			}
		} else if (orientation === "vertical") {
			for (let i = 0; i < length; i++) {
				this.board[r + i][c] = { ship, hit: false };
			}
		}
	}

	receiveAttack(coordinates) {
		// Coordinates in [row, col] format, ex. [0, 0]
		// Reports "miss", "hit", "sunk"
		const [r, c] = coordinates;
		const cell = this.board[r][c];

		if (
			cell !== null &&
			typeof cell === "object" &&
			cell.ship instanceof Ship
		) {
			cell.hit = true;
			const ship = cell.ship;
			ship.hit();

			if (ship.isSunk()) {
				for (let i = 0; i < 10; i++) {
					for (let j = 0; j < 10; j++) {
						const part = this.board[i][j];
						if (
							part !== null &&
							typeof part === "object" &&
							part.ship === ship
						) {
							this.board[i][j] = "sunk";
						}
					}
				}
				return "sunk";
			} else {
				return "hit";
			}
		}
		this.board[r][c] = "miss";
		return "miss";
	}

	allSunk() {
		return !this.board.some((row) =>
			row.some(
				(item) =>
					item !== null &&
					typeof item === "object" &&
					item.ship instanceof Ship &&
					!item.hit
			)
		);
	}
}

export { Gameboard };

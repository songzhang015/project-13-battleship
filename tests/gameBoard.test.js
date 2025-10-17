import { Gameboard } from "../modules/gameBoard.js";
import { Ship } from "../modules/ship.js";

test("Placing horizontal submarine down and sinking it", () => {
	const testBoard = new Gameboard();
	const testShip = new Ship("Submarine", 3);
	testBoard.placeShip([1, 1], "horizontal", testShip);
	expect(testBoard.allSunk()).toBe(false);
	expect(testBoard.receiveAttack([0, 0])).toBe("miss");
	expect(testBoard.receiveAttack([1, 0])).toBe("miss");
	expect(testBoard.receiveAttack([1, 1])).toBe("hit");
	expect(testBoard.receiveAttack([1, 2])).toBe("hit");
	expect(testBoard.allSunk()).toBe(false);
	expect(testBoard.receiveAttack([1, 3])).toBe("sunk");
	expect(testBoard.allSunk()).toBe(true);
});

test("Placing vertical battleship down and sinking it", () => {
	const testBoard = new Gameboard();
	const testShip = new Ship("Battleship", 4);
	testBoard.placeShip([5, 9], "vertical", testShip);
	expect(testBoard.allSunk()).toBe(false);
	expect(testBoard.receiveAttack([5, 8])).toBe("miss");
	expect(testBoard.receiveAttack([9, 9])).toBe("miss");
	expect(testBoard.receiveAttack([5, 9])).toBe("hit");
	expect(testBoard.receiveAttack([6, 9])).toBe("hit");
	expect(testBoard.receiveAttack([7, 9])).toBe("hit");
	expect(testBoard.allSunk()).toBe(false);
	expect(testBoard.receiveAttack([8, 9])).toBe("sunk");
	expect(testBoard.allSunk()).toBe(true);
});

test("Gameboard [r][c] testing", () => {
	const testBoard = new Gameboard();
	const testShip = new Ship("Patrol Boat", 2);
	testBoard.placeShip([0, 0], "horizontal", testShip);
	expect(testBoard.receiveAttack([0, 1])).toBe("hit");
	expect(testBoard.board[0][0]).toBeInstanceOf(Ship);
	expect(testBoard.board[0][1]).toBe("hit");
	expect(testBoard.board[0][2]).toBeNull();
});

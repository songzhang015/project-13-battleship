import { Ship } from "../modules/ship.js";

test("Initialize Carrier with name and length", () => {
	const testShip = new Ship("Carrier", 4);
	expect(testShip.name).toBe("Carrier");
	expect(testShip.length).toBe(4);
	expect(testShip.hitAmount).toBe(0);
	expect(testShip.sunk).toBe(false);
});

test("Hitting Battleship 4x", () => {
	const testShip = new Ship("Battleship", 4);
	testShip.hit();
	expect(testShip.hitAmount).toBe(1);
	testShip.hit();
	expect(testShip.hitAmount).toBe(2);
	testShip.hit();
	expect(testShip.isSunk()).toBe(false);
	testShip.hit();
	expect(testShip.hitAmount).toBe(4);
	expect(testShip.isSunk()).toBe(true);
});

/* Ship class for ship objects with varying sizes and functions */
class Ship {
	constructor(name, length, hitAmount = 0, sunk = false) {
		this.name = name;
		this.length = length;
		this.hitAmount = hitAmount;
		this.sunk = sunk;
	}

	hit() {
		this.hitAmount++;
	}

	isSunk() {
		return this.hitAmount >= this.length;
	}
}

export { Ship };

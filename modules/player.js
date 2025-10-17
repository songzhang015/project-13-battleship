/* Player class containing real and AI players */
import { Gameboard } from "../modules/gameBoard.js";

class Player {
	constructor() {
		this.board = new Gameboard();
	}
}

export { Player };

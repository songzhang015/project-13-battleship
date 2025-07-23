/* Index.js */
import { createStartButton } from "./modules/domController.js";
import { startNewGame } from "./modules/gameController.js";

createStartButton();

document.querySelector(".start-btn").addEventListener("click", () => {
	startNewGame();
});

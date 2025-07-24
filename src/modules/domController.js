/* Handles visual displays and feedback + user inputs and clicks */

function createStartButton() {
	const startBtn = document.createElement("button");
	startBtn.classList.add("start-btn");
	startBtn.textContent = "Start Game";
	document.body.appendChild(startBtn);
}

function createBoard() {
	document.querySelector(".start-btn").remove();

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

	playerContainer.appendChild(playerTitle);
	playerContainer.appendChild(playerBoard);

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

function highlightShip(coordinates, orientation, ship, isValid) {
	const [r, c] = coordinates;
	const length = ship.length;

	clearHighlights();

	for (let i = 0; i < length; i++) {
		let row = r;
		let col = c;

		if (orientation === "horizontal") {
			col = c + i;
		} else if (orientation === "vertical") {
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

export {
	createStartButton,
	createBoard,
	createBoardGrid,
	highlightShip,
	clearHighlights,
};

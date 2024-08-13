export class DrawTitle {
    constructor(gameArea, startGameCallBack) {
        this.gameArea = gameArea;
        this.startGameCallBack = startGameCallBack;
        this.titleText = "STEROIDS";
        this.colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
        this.titleElement = document.createElement("div");
        this.titleElement.id = "title";
        this.titleElement.style.display = "flex";
        this.titleElement.style.justifyContent = "center";
        this.titleElement.style.alignItems = "center";
        this.titleElement.style.fontSize = "60px";
        this.titleElement.style.fontFamily = "'VT323', monospace";
        this.titleElement.style.marginTop = "20px";
        this.titleElement.style.color = "white";
        this.gameArea.appendChild(this.titleElement);
    }

    drawTitle() {
        this.gameArea.innerHTML = ""; // Clear the game area
        this.titleElement.innerHTML = ""; // Clear existing content
        
        for (let i = 0; i < this.titleText.length; i++) {
            const span = document.createElement("span");
            span.textContent = this.titleText[i];
            span.style.color = this.colors[i % this.colors.length];
            this.titleElement.appendChild(span);
        }
        const startText = document.createElement("div");
        startText.id = "start-text";
        startText.textContent = "PRESS ANY KEY TO START";
        startText.style.fontSize = "24px";
        startText.style.marginTop = "20px";
        startText.style.textAlign = "center";
        startText.style.fontFamily = "'VT323', monospace";
        startText.style.color = "white";
        this.gameArea.appendChild(startText);

        // Adding event listener for starting the game or showing instructions
        document.addEventListener('keydown', () => this.showInstructions());
    }

    showInstructions() {
        // Clean up the title and start text
        this.gameArea.innerHTML = "";

        // Show the instruction screen
        const instructions = document.createElement("div");
        instructions.id = "instructions";
        instructions.style.textAlign = "center";
        const instructionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        instructionSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        instructionSvg.setAttribute("viewBox", "0 0 100 100");
        instructionSvg.innerHTML = `
            <!-- Your SVG content goes here -->
        `;
        instructions.appendChild(instructionSvg);

        const startGameText = document.createElement("div");
        startGameText.id = "start-text";
        startGameText.textContent = "PRESS ANY KEY TO START THE GAME";
        startGameText.style.fontSize = "24px";
        startGameText.style.marginTop = "20px";
        startGameText.style.textAlign = "center";
        startGameText.style.fontFamily = "'VT323', monospace";
        startGameText.style.color = "white";
        instructions.appendChild(startGameText);

        this.gameArea.appendChild(instructions);

        // Change state to game start on next key press
        document.addEventListener('keydown', () => this.startGame(), { once: true });
    }

    startGame() {
        this.gameArea.innerHTML = ""; // Clear instructions
        this.startGameCallback();
        // Initialize and start the game here
        startGame();
    }
}

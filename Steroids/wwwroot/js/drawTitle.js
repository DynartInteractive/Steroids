export class DrawTitle {
    constructor(gameArea, startGameCallback) {
        this.gameArea = gameArea;
        this.startGameCallback = startGameCallback;
        this.titleScreen = document.getElementById('titleScreen');
        this.titleText = "STEROIDS";
    }

    drawTitle() {
        const titleElement = document.getElementById('titleText');
        if (!titleElement) {
            console.error('TitleText element not found in the DOM.');
            return;
        }

        titleElement.innerHTML = '';

        // Create the title text with different colors for each letter
        for (let i = 0; i < this.titleText.length; i++) {
            const letter = document.createElement('span');
            letter.textContent = this.titleText[i];
            letter.style.animationDelay = `${i * 0.2}s`; // Stagger each letter's color cycle
            titleElement.appendChild(letter);
        }

        // Show the title screen
        this.titleScreen.style.display = 'flex';

        // Adding event listener for starting the game
        document.addEventListener('keydown', () => this.startGame(), { once: true });
    }

    startGame() {
        // Hide the title screen
        this.titleScreen.style.display = 'none';
        this.startGameCallback();
    }
}


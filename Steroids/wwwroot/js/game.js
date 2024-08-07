import { Player } from './player.js';
import { Steroid } from './steroid.js';
import { SvgResourceHandler, AudioResourceHandler, InitResources } from "./resourcehandeler.js";

async function startGame() {
    const svgHandler = new SvgResourceHandler();
    const audioHandler = new AudioResourceHandler();
    const initResources = new InitResources();

    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'block';

    // Initialize resources
    await initResources.initializeResources(svgHandler, audioHandler);

    // Hide loading screen
    loadingScreen.style.display = 'none';

    // Start the game
    new Game(document.getElementById('svgElement'), svgHandler, audioHandler);
}
class Game {
    constructor(svgElement, svgHandler, audioHandler) {
        this.svgElement = svgElement;
        this.svgHandler = svgHandler;
        this.audioHandler = audioHandler;
        this.width = svgElement.viewBox.baseVal.width;
        this.height = svgElement.viewBox.baseVal.height;
        this.needle = new Player(svgElement);
        this.steroids = [];
        this.level = 1;
        this.score = 0;

        this.initLevel(this.level).then(() => this.update());
    }
    async initLevel(level) {
        this.cleanUpSteroids();
        this.steroids = [];
        await this.initSteroid(level);
    }
    async initSteroid(level) {
        const numEnemies = Math.min(level, 6); // Ensure we have at most 6 enemies
        for (let i = 0; i < numEnemies; i++) {
            const existingSteroid = this.steroids.find(steroid => steroid.id === `enemy_${i}`);
            if (!existingSteroid) {
                const steroid = new Steroid(this.svgElement, `enemy_${i}`, this.needle, this.svgHandler);
                steroid.initialize(); 
                this.steroids.push(steroid);
            }
        }
    }
    
    nextLevel() {
        this.level += 1;

        // Display "Level Up" message
        const levelUpMessage = document.createElement('div');
        levelUpMessage.textContent = `Level ${this.level}`;
        levelUpMessage.style.position = 'absolute';
        levelUpMessage.style.top = '50%';
        levelUpMessage.style.left = '50%';
        levelUpMessage.style.transform = 'translate(-50%, -50%)';
        levelUpMessage.style.fontSize = '48px';
        levelUpMessage.style.color = 'white';
        levelUpMessage.style.zIndex = '10';
        document.body.appendChild(levelUpMessage);

        // Play level up sound
        const levelUpSound = this.audioHandler.getResource('levelUp');
        if (levelUpSound) {
            levelUpSound.play();
        }

        // Remove message and start next level after a brief delay
        setTimeout(() => {
            levelUpMessage.remove();
            this.initLevel(this.level);
        }, 2000); // 2 seconds delay
    }

    update() {            
        this.steroids.forEach(steroid => {
            steroid.updateSteroidPosition();
        })
        
        this.checkCollisions();

        requestAnimationFrame(() => this.update());
    }
    checkCollisions() {
        this.needle.projectiles.forEach((projectile, pIndex) => {
            this.steroids.forEach((steroid, sIndex) => {
                if (this.isCollision(projectile, steroid)) {
                    // Handle collision (e.g., remove steroid, update score, etc.)
                    this.needle.projectiles.splice(pIndex, 1);
                    steroid.steroid.remove();
                    this.steroids.splice(sIndex, 1);
                    this.score += 10;
                    
                    // Play explosion sound
                    const explosionSound = this.audioHandler.getResource('popping');
                    explosionSound.play();
                }

           
                // Check if all steroids are destroyed to advance to the next level
                if (this.steroids.length === 0) {
                    this.nextLevel();
                }
            });
        });
    }

    isCollision(projectile, steroid) {
        const dx = projectile.position.x - steroid.steroidPosition.x;
        const dy = projectile.position.y - steroid.steroidPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (projectile.radius + steroid.steroid.getBBox().width / 2); // Adjust as needed
    }
    
    cleanUpSteroids() {
        this.steroids.forEach(steroid => steroid.remove())
    }
}

document.addEventListener('DOMContentLoaded', startGame);
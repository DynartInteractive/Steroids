import { Player } from './player.js';
import { Steroid } from './steroid.js';
import { HUD } from './hud.js';
import { GameArea } from './gameArea.js';
import { SvgResourceHandler, AudioResourceHandler, InitResources } from "./resourceHandler.js";
import { BonusItem } from "./bonusItem.js";

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
        this.gameArea = new GameArea();
        
        this.hud = new HUD(svgElement, svgHandler, this.gameArea);
        this.player = new Player(svgElement, svgHandler, 'player',this.hud, this);

        this.steroids = [];
        this.bonusItem = null;
        this.level = 1;
        this.score = 0;
        this.lastCollisionTime = 0;

        this.initLevel(this.level).then(() => this.update());
        this.spawnBonusItem()
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
                const steroid = new Steroid(this.svgElement, `enemy_${i}`, this.player, this.svgHandler);
                steroid.initialize();
                this.steroids.push(steroid);
            }
        }
    }
    spawnBonusItem() {
        const bonusTypes = ['health_up', 'health_dg', 'player_up', 'player_dg', 'projectile_up', 'projectile_dg', 'blast_charge'];
        const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        this.bonusItem = new BonusItem(randomType, this.svgElement, this.svgHandler, this.gameArea);
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
            steroid.updatePosition();
        });

        this.checkCollisions();
        this.checkPlayerEnemyCollisions();
        this.checkPlayerBonusCollision();

        requestAnimationFrame(() => this.update());
    }
    checkCollisions() {
        this.player.projectiles.forEach((projectile, pIndex) => {
            this.steroids.forEach((steroid, sIndex) => {
                if (this.isCollision(projectile, steroid)) {
                    // Handle collision (e.g., remove steroid, update score, etc.)
                    this.player.projectiles.splice(pIndex, 1);
                    steroid.remove();
                    projectile.remove()
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
    checkPlayerEnemyCollisions() {
        const currentTime = performance.now();
        this.steroids.forEach(steroid => {
            if (this.isCollision(this.player, steroid)) {
                if (currentTime - this.lastCollisionTime >= 1000) { // Apply damage every second
                    this.player.decreaseHealth(1);
                    this.lastCollisionTime = currentTime;
                    console.log(`megbasz`);
                }
            }
            
        });
    }
    
    checkPlayerBonusCollision() {
        if (this.bonusItem && this.isCollision(this.player, this.bonusItem)) {
            this.bonusItem.collect(this.player);
            this.bonusItem = null;
            setTimeout(() => this.spawnBonusItem(), 1000); // Spawn a new bonus item after 5 seconds
        }
    }

    isCollision(entity1, entity2) {
        const dx = entity1.position.x - entity2.position.x;
        const dy = entity1.position.y - entity2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const entity1Radius = entity1.radius || entity1.getDimensions().width / 2;
        const entity2Radius = entity2.radius || entity2.getDimensions().width / 2;

        //console.log(`Distance: ${distance}, Entity1 Radius: ${entity1Radius}, Entity2 Radius: ${entity2Radius}`);

        return distance < (entity1Radius + entity2Radius); // Adjust as needed
    }
    
    cleanUpSteroids() {
        this.steroids.forEach(steroid => steroid.remove())
    }
    gameOver() {
        console.log('Game Over!');
        // Display game over message
        const gameOverMessage = document.createElement('div');
        gameOverMessage.textContent = 'Game Over';
        gameOverMessage.style.position = 'absolute';
        gameOverMessage.style.top = '50%';
        gameOverMessage.style.left = '50%';
        gameOverMessage.style.transform = 'translate(-50%, -50%)';
        gameOverMessage.style.fontSize = '48px';
        gameOverMessage.style.color = 'red';
        gameOverMessage.style.zIndex = '10';
        document.body.appendChild(gameOverMessage);

        // Stop the game loop
        cancelAnimationFrame(this.animationFrame);
    }
}

document.addEventListener('DOMContentLoaded', startGame);
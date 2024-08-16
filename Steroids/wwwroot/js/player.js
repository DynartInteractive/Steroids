import { Thrust } from './thrust.js';
import { Projectile } from './projectile.js';
import { GameArea } from './gameArea.js';
import { HUD } from './hud.js';
import { getDimensions } from "./getDimensions.js";
import { BlastWave } from "./blastwave.js";


export class Player {
    constructor(svgElement, svgHandler, id, hud, game) {
        this.svgElement = svgElement;
        this.svgHandler = svgHandler;
        this.id = id;
        this.health = 10; // Initial health
        this.maxHealth = 10; 
        this.playerLevel = 0; 
        this.maxPlayerLevel = 3;
        this.projectileSizeLevel = 0;
        this.maxProjectileSizeLevel = 3;
        this.bonusIndicator = 0;
        this.maxBonusIndicator = 10; 
        this.hud = hud;
        this.game = game;
        this.position = { x: 50, y: 50 }; // Centered in the 1000x1000 viewBox
        this.angle = 0; // Initial angle in degrees
        this.rotationSpeed = 2; // degrees per frame
        this.thrust = new Thrust();
        this.thrusting = false;
        this.turningLeft = false;
        this.turningRight = false;
        this.projectiles = [];
        this.gameArea = new GameArea();
        this.damageFlag = false;
                
        this.loadPlayerSvg();
    }
    async loadPlayerSvg() {
        try {
            const svgElement = this.svgHandler.getResource('player');
            if (svgElement) {
                this.player = svgElement.cloneNode(true);

                // Wrap the loaded SVG in a group
                this.playerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                this.playerGroup.setAttribute('id', 'player-group');
                this.playerGroup.appendChild(this.player);
                
                this.svgElement.appendChild(this.playerGroup);

                // Calculate the initial bounding box and center
                const bbox = this.player.getBBox();
                this.initialCx = bbox.x + bbox.width / 2;
                this.initialCy = bbox.y + bbox.height / 2;

                this.playerGroup.setAttribute('transform',
                    `translate(${this.position.x}, ${this.position.y}) 
                 rotate(0, ${this.initialCx}, ${this.initialCy}) 
                 scale(1)`); // Initial scale is 1 (no scaling yet)

                // Add a debug rectangle around the bounding box
                // this.debugRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                // this.debugRect.setAttribute("x", bbox.x);
                // this.debugRect.setAttribute("y", bbox.y);
                // this.debugRect.setAttribute("width", bbox.width);
                // this.debugRect.setAttribute("height", bbox.height);
                // this.debugRect.setAttribute("fill", "none");
                // this.debugRect.setAttribute("stroke", "blue");
                // this.playerGroup.appendChild(this.debugRect);
                //
                this.init();
                this.updatePosition();
            } else {
                console.error('Player SVG not found in resources.');
            }
        } catch (error) {
            console.error('Error loading player SVG:', error);
        }
    }
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        requestAnimationFrame(() => this.updatePlayer());
    }

    castBlastWave() {
        const blastWave = new BlastWave(this, this.svgElement, this.svgHandler, this.gameArea);
        this.game.addBlastWave(blastWave);  // Assuming you have a method to track active waves
    }
    // Upgrade and downgrade player, projectile size and health
    upgradePlayer() {
        if (this.playerLevel < this.maxPlayerLevel) {
            this.playerLevel += 1;
            this.hud.updateDistanceIndicator(this.playerLevel);
        }
    }

    downgradePlayer() {
        if (this.playerLevel > 0) {
            this.playerLevel -= 1;
            this.hud.updateDistanceIndicator(this.playerLevel);
        }
    }
    upgradeProjectileSize() {
        if (this.projectileSizeLevel < this.maxProjectileSizeLevel) {
            this.projectileSizeLevel += 1;
            this.hud.updateSizeIndicator(this.projectileSizeLevel);
        }
    }
    downgradeProjectileSize() {
        if (this.projectileSizeLevel > 0) {
            this.projectileSizeLevel -= 1;
            this.hud.updateSizeIndicator(this.projectileSizeLevel);
        }
    }
    chargeBlastWave() {
        this.hud.updateBonusIndicator(this.maxBonusIndicator); 
        console.log('BlastWave fully charged!');
    }

    decreaseHealth(amount) {
        this.health = Math.max(0, this.health - amount);
        this.hud.updateHealthIndicator(this.health);
        this.damageFlag = true;
        this.hud.updateBonusIndicator(0);
        console.log(`Health decreased by ${amount}. Current health: ${this.health}`);
        if (this.health === 0) {
            console.log('Player is dead.');
            this.game.gameOver(); // Notify the game of the game over
        }
    }
    updateBonusIndicator(bonusLevel) {
        this.hud.updateBonusIndicator(bonusLevel);
    }
        
    resetDamageFlag() {
        this.damageFlag = false;
    }
    increaseHealth(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.hud.updateHealthIndicator(this.health);
        console.log(`Health increased by ${amount}. Current health: ${this.health}`);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.thrusting = true;
                break;
            case 'ArrowLeft':
                this.turningLeft = true;
                break;
            case 'ArrowRight':
                this.turningRight = true;
                break;
            case ' ':
                this.shoot();
                break;
            case 'Alt':
                if (this.bonusIndicator === this.maxBonusIndicator){
                    this.castBlastWave();
                    this.bonusIndicator = 0;
                    this.hud.updateBonusIndicator(0);
                }
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.thrusting = false;
                break;
            case 'ArrowLeft':
                this.turningLeft = false;
                break;
            case 'ArrowRight':
                this.turningRight = false;
                break;
        }
    }

    rotate() {
        if (this.turningLeft) {
            this.angle -= this.rotationSpeed;
        }
        if (this.turningRight) {
            this.angle += this.rotationSpeed;
        }
        this.angle = (this.angle + 360) % 360; // Normalize angle to 0-359 degrees
        //console.log(`Position: ( Angle: ${this.angle}`); //uncomment on debug purpose
        this.updatePosition();
        
    }

    getDimensions() {
        return getDimensions(this.player);  
    }
    updatePosition() {
        if (!this.player) return;

        // Calculate the bounding box of the player SVG element to determine the pivot point
        const bbox = this.player.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        // Calculate the translation values to center the player
        const translateX = this.position.x - cx;
        const translateY = this.position.y - cy;

        // Update the player group transform to include translation, rotation around the center, and optional scaling
        this.playerGroup.setAttribute('transform',
            `translate(${translateX}, ${translateY}) 
         rotate(${this.angle}, ${cx}, ${cy}) 
         scale(1)`); // No scaling applied yet

        // Update debug collision shape position and size if it exists
        if (this.debugRect) {
            this.debugRect.setAttribute("x", bbox.x);
            this.debugRect.setAttribute("y", bbox.y);
            this.debugRect.setAttribute("width", bbox.width);
            this.debugRect.setAttribute("height", bbox.height);
        }
    }
    shoot() {
        const projectileX = this.position.x;
        const projectileY = this.position.y;

        const projectile = new Projectile(projectileX, projectileY, this.angle, this.svgElement, {
            speed: 3 + this.playerLevel, // Set the projectile speed
            size: 0.5 + this.projectileSizeLevel, // Set the projectile size
            maxDistance: 50 + (this.playerLevel * 10) // Set the maximum travel distance
        });
        this.projectiles.push(projectile);
    }
    castBlastWave() {
        const blastWave = new BlastWave(this, this.svgElement, this.svgHandler, this.game.gameArea);
        this.game.addBlastWave(blastWave);
        console.log('BlastWave casted by player!');
    }
    updatePlayer() {
        if (this.thrusting) {
            this.thrust.applyThrust(this.angle);
        } else {
            this.thrust.applyFriction();
        }

        this.rotate(); // Ensure rotation happens regardless of thrusting state
        this.position = this.thrust.updatePosition(this.position);
        this.gameArea.checkPlayerBoundaries(this); // Check and update boundaries

        this.updatePosition();

        this.projectiles.forEach((projectile, index) => {
            projectile.updateProjectilePosition();
            this.gameArea.checkProjectileBoundaries(projectile); // Wrap-around logic for projectiles

            // Remove the projectile if it has reached its maximum distance
            if (projectile.distanceTraveled >= projectile.maxDistance) {
                projectile.remove();
                this.projectiles.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.updatePlayer());
    }
    reset() {
        this.health = 10;
        this.playerLevel = 0;
        this.projectileSizeLevel = 0;
        this.bonusIndicator = 0;
        this.hud.updateHealthIndicator(this.health);
        this.hud.updateDistanceIndicator(this.playerLevel);
        this.hud.updateSizeIndicator(this.projectileSizeLevel);
        this.hud.updateBonusIndicator(0);
        this.position = { x: 50, y: 50 };
        this.angle = 0;
        this.projectiles.forEach((projectile) => projectile.remove());
        this.projectiles = [];
        this.damageFlag = false;
    }
}



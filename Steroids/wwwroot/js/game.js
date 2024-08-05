import { Needle } from './needle.js';
import { Steroid } from './steroid.js';

class Game {
    constructor(svgElement) {
        this.svgElement = svgElement;
        this.width = svgElement.viewBox.baseVal.width;
        this.height = svgElement.viewBox.baseVal.height;
        this.needle = new Needle(svgElement);
        this.steroids = [];
        this.level = 1;
        this.score = 0;
        
        this.initLevel(this.level);
        this.update();
    }
    initLevel(level) {
        this.steroids = [];
        this.initSteroid(level);
    }
    async initSteroid(level) {
        const numEnemies = Math.min(level, 6); // Ensure we have at most 6 enemies
        for (let i = 0; i < numEnemies; i++) {
            const steroid = new Steroid(this.svgElement, `enemy_${i}`, this.needle);
            await steroid.loadSvg(`/source/SVG/enemy/enemy_${i}.svg`);
            this.steroids.push(steroid);
        }
    }
    
    nextLevel() {
        this.level += 1;
        this.initLevel(this.level);
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
}

document.addEventListener('DOMContentLoaded', () => {
    const svgElement = document.getElementById('svgElement');
    new Game(svgElement);
});
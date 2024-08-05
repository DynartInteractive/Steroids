import { Needle } from './needle.js';
import { Steroid } from './steroid.js';

class Game {
    constructor(svgElement) {
        this.svgElement = svgElement;
        this.width = svgElement.viewBox.baseVal.width;
        this.height = svgElement.viewBox.baseVal.height;
        this.needle = new Needle(svgElement);
        this.steroids = [];
        this.score = 0;
        
        this.initSteroid();
        this.update();
    }
    initSteroid() {
        for (let i = 0; i < 6; i++) {
            this.steroids.push(new Steroid(this.svgElement, `Enemy_${i}`));  
        }
    }

    update() {
        //this.needle.updateNeedle();
        
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
import { Player } from './player.js';
import { Projectile } from './projectile.js';
export class BlastWave {
    constructor(owner, svgElement, gameArea) {
        this.owner = owner;
        this.svgElement = svgElement;
        this.gameArea = gameArea;

        const maxRadius = owner instanceof Player
            ? Math.sqrt(Math.pow(gameArea.width, 2) + Math.pow(gameArea.height, 2)) / 2
            : 100;

        this.projectile = new Projectile(owner.position.x, owner.position.y, 0, svgElement, {
            speed: 0,
            radius: 10,
            maxDistance: maxRadius,
            maxRadius: maxRadius,
        });
        this.projectile.type = 'blastWave';
        this.isComplete = false; // Flag to indicate when the blast wave is done
    }

    updateWave() {
        if (this.projectile && !this.isComplete) {
            this.projectile.radius += 5;
            this.projectile.element.setAttribute('r', this.projectile.radius);

            if (this.projectile.radius >= this.projectile.maxDistance) {
                this.isComplete = true;
                this.removeWave();
            }
        }
    }

    removeWave() {
        if (this.projectile && this.projectile.element) {
            this.projectile.remove();
        }
        this.projectile = null;
    }

    isDone() {
        return this.isComplete;
    }
}


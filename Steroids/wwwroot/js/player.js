import { Thrust } from './thrust.js';
import { Projectile } from './projectile.js'

export class Player {
    constructor(svgElement) {
        this.svgElement = svgElement;
        this.player = svgElement.querySelector('#needle');
        this.position = { x: 50, y: 50 };
        this.angle = 0; // Initial angle in degrees
        this.rotationSpeed = 2; // degrees per frame
        this.thrust = new Thrust();
        this.thrusting = false;
        this.turningLeft = false;
        this.turningRight = false;
        this.projectiles = [];

        // Dimensions of the game area
        this.gameWidth = svgElement.viewBox.baseVal.width;
        this.gameHeight = svgElement.viewBox.baseVal.height;

        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        //this.updateNeedlePosition();
        requestAnimationFrame(() => this.updateNeedle());
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
        this.updateNeedlePosition();
    }

    getNeedleDimensions() {
        const bbox = this.player.getBBox();
        return {
            width: bbox.width,
            height: bbox.height
        };
    }

    checkBoundaries() {
        const { width, height } = this.getNeedleDimensions();
        const halfNeedleWidth = width / 2;
        const halfNeedleHeight = height / 2;

        if (this.position.x < -halfNeedleWidth * 3) {
            this.position.x = this.gameWidth + halfNeedleWidth * 3;
        } else if (this.position.x > this.gameWidth + halfNeedleWidth * 3) {
            this.position.x = -halfNeedleWidth * 3;
        }

        if (this.position.y < -halfNeedleHeight) {
            this.position.y = this.gameHeight + halfNeedleHeight;
        } else if (this.position.y > this.gameHeight + halfNeedleHeight) {
            this.position.y = -halfNeedleHeight;
        }
    }

    updateNeedlePosition() {
        const bbox = this.player.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const translateX = this.position.x - cx;
        const translateY = this.position.y - cy;
        //console.log(`Position: (${this.needlePosition.x}, ${this.needlePosition.y}), Angle: ${this.needleAngle}`); //uncomment on debug purpose

        // Perform a single DOM write operation
        this.player.setAttribute('transform', `translate(${translateX}, ${translateY}) rotate(${this.angle} ${cx} ${cy})`);
    }

    shoot() {
        //const radians = this.needleAngle * (Math.PI / 180);
        const projectileX = this.position.x;
        const projectileY = this.position.y ;

        const projectile = new Projectile(projectileX, projectileY, this.angle, this.svgElement);
        this.projectiles.push(projectile);
    }
    updateNeedle() {
        if (this.thrusting) {
            this.thrust.applyThrust(this.angle);
        } else {
            this.thrust.applyFriction();
        }

        this.rotate(); // Ensure rotation happens regardless of thrusting state
        this.position = this.thrust.updatePosition(this.position);
        this.checkBoundaries(); // Check and update boundaries

        this.updateNeedlePosition();

        this.projectiles.forEach((projectile, index) => {
            projectile.updateProjectilePosition();
            if (projectile.isOutOfBounds(this.gameWidth, this.gameHeight)) {
                projectile.remove();
                this.projectiles.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.updateNeedle());
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     const svgElement = document.getElementById('svgElement');
//     new Needle(svgElement);
// });


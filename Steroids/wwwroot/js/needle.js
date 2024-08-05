import { Thrust } from './thrust.js';
import { Projectile } from './projectile.js'

export class Needle {
    constructor(svgElement) {
        this.svgElement = svgElement;
        this.needle = svgElement.querySelector('#needle');
        this.needlePosition = { x: 50, y: 50 };
        this.needleAngle = 0; // Initial angle in degrees
        this.needleRotationSpeed = 2; // degrees per frame
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
        this.updateNeedlePosition();
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
            this.needleAngle -= this.needleRotationSpeed;
        }
        if (this.turningRight) {
            this.needleAngle += this.needleRotationSpeed;
        }
        this.needleAngle = (this.needleAngle + 360) % 360; // Normalize angle to 0-359 degrees
        this.updateNeedlePosition();
    }

    getNeedleDimensions() {
        const bbox = this.needle.getBBox();
        return {
            width: bbox.width,
            height: bbox.height
        };
    }

    checkBoundaries() {
        const { width, height } = this.getNeedleDimensions();
        const halfNeedleWidth = width / 2;
        const halfNeedleHeight = height / 2;

        if (this.needlePosition.x < -halfNeedleWidth * 3) {
            this.needlePosition.x = this.gameWidth + halfNeedleWidth * 3;
        } else if (this.needlePosition.x > this.gameWidth + halfNeedleWidth * 3) {
            this.needlePosition.x = -halfNeedleWidth * 3;
        }

        if (this.needlePosition.y < -halfNeedleHeight) {
            this.needlePosition.y = this.gameHeight + halfNeedleHeight;
        } else if (this.needlePosition.y > this.gameHeight + halfNeedleHeight) {
            this.needlePosition.y = -halfNeedleHeight;
        }
    }

    updateNeedlePosition() {
        const bbox = this.needle.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const translateX = this.needlePosition.x - cx;
        const translateY = this.needlePosition.y - cy;
        //console.log(`Position: (${this.needlePosition.x}, ${this.needlePosition.y}), Angle: ${this.needleAngle}`);

        // Perform a single DOM write operation
        this.needle.setAttribute('transform', `translate(${translateX}, ${translateY}) rotate(${this.needleAngle} ${cx} ${cy})`);
    }

    shoot() {
        //const radians = this.needleAngle * (Math.PI / 180);
        const projectileX = this.needlePosition.x;
        const projectileY = this.needlePosition.y ;

        const projectile = new Projectile(projectileX, projectileY, this.needleAngle, this.svgElement);
        this.projectiles.push(projectile);
    }
    updateNeedle() {
        if (this.thrusting) {
            this.thrust.applyThrust(this.needleAngle);
        } else {
            this.thrust.applyFriction();
        }

        this.rotate(); // Ensure rotation happens regardless of thrusting state
        this.needlePosition = this.thrust.updatePosition(this.needlePosition);
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

document.addEventListener('DOMContentLoaded', () => {
    const svgElement = document.getElementById('svgElement');
    new Needle(svgElement);
});


export class Thrust {
    constructor() {
        this.velocity = { x: 0, y: 0 };
        this.thrustAmount = 1;
        this.friction = 0.5;
        this.FPS = 30;
    }

    applyThrust(angle) {
        const radians = angle * (Math.PI / 180);
        this.velocity.y -= this.thrustAmount * Math.cos(radians) / this.FPS;
        this.velocity.x += this.thrustAmount * Math.sin(radians) / this.FPS;
    }

    applyFriction() {
        this.velocity.x -= this.friction * this.velocity.x / this.FPS;
        this.velocity.y -= this.friction * this.velocity.y / this.FPS;
    }

    updatePosition(position) {
        return {
            x: position.x + this.velocity.x,
            y: position.y + this.velocity.y
        };
    }
}

export class Thrust {
    constructor(thrustAmount = 1, friction= 0.5, FPS=30) {
        this.velocity = { x: 0, y: 0 };
        this.thrustAmount = thrustAmount;
        this.friction = friction;
        this.FPS = FPS;
        this.distanceTravelled = 0
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
        const newPosition = {
            x: position.x + this.velocity.x,
            y: position.y + this.velocity.y
        };
        const dx = newPosition.x - position.x;
        const dy = newPosition.y - position.y;
        this.distanceTravelled += Math.sqrt(dx * dx + dy * dy);
        return newPosition;
    }
    resetDistance() {
        this.distanceTravelled = 0;
    }
}

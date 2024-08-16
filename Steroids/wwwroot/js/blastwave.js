import { getDimensions } from './getDimensions.js';

export class BlastWave {
    constructor(owner, svgElement, svgHandler, gameArea) {
        this.owner = owner;  // Could be either 'player' or 'steroid'
        console.log('BlastWave owner:', this.owner);
        this.svgElement = svgElement;
        this.svgHandler = svgHandler;
        this.gameArea = gameArea;

        this.position = { x: owner.position.x, y: owner.position.y };
        this.radius = 10;  // Initial radius of the blast wave
        this.maxRadius = 100;  // Maximum radius the blast wave can grow to
        this.growthRate = 2;  // The rate at which the blast wave grows per update

        this.createWave();
    }

    createWave() {
        // Create the SVG circle for the blast wave
        this.waveElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.waveElement.setAttribute("cx", this.position.x);
        this.waveElement.setAttribute("cy", this.position.y);
        this.waveElement.setAttribute("r", this.radius);
        this.waveElement.setAttribute("class", "blastwave");  // Add a class for styling

        // Append the wave to the main SVG element
        this.svgElement.appendChild(this.waveElement);
    }

    updateWave() {
        // Increase the radius
        this.radius += this.growthRate;

        // Update the wave's size
        this.waveElement.setAttribute("r", this.radius);

        // Check for collisions
        this.checkCollisions();

        // Remove the wave if it exceeds the maximum radius or leaves the game area
        if (this.radius >= this.maxRadius || this.isOutOfBounds()) {
            this.removeWave();
        }
    }

    checkCollisions() {
        const entities = this.owner instanceof Player ? this.gameArea.steroids : [this.gameArea.player];

        entities.forEach(entity => {
            const distance = this.getDistanceTo(entity);

            if (distance < this.radius + (entity.getDimensions().width / 2)) {
                if (this.owner instanceof Player) {
                    entity.takeDamage();  // Assuming Steroids have a takeDamage method
                } else if (this.owner instanceof Steroid) {
                    this.gameArea.player.decreaseHealth(1);
                }
            }
        });
    }

    getDistanceTo(entity) {
        const dx = entity.position.x - this.position.x;
        const dy = entity.position.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    isOutOfBounds() {
        const { width, height } = this.gameArea.getDimensions();
        return (
            this.position.x + this.radius < 0 ||
            this.position.x - this.radius > width ||
            this.position.y + this.radius < 0 ||
            this.position.y - this.radius > height
        );
    }

    removeWave() {
        this.waveElement.remove();
    }
}

export class Projectile {
    constructor(x, y, angle, svgElement, options ={}) {
        this.position = { x: x, y: y };
        this.startPosition = { x: x, y: y };
        this.angle = angle;
        this.speed = options.speed || 3;
        this.radius = options.radius || 0.5;
        this.maxDistance = options.maxDistance || 500;
        
        this.distanceTraveled = 0;

        this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.element.setAttribute("r", this.radius);
        this.element.setAttribute("class", "cls-3");
        this.element.setAttribute("cx", this.position.x);
        this.element.setAttribute("cy", this.position.y);
        
        const projectilesGroup = svgElement.querySelector('#projectiles');
        projectilesGroup.appendChild(this.element);
    }

    updateProjectilePosition() {
        const radians = (this.angle - 90) * (Math.PI / 180);
        const dx = this.speed * Math.cos(radians);
        const dy = this.speed * Math.sin(radians);

        this.position.x += dx;
        this.position.y += dy;
        this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);

        this.element.setAttribute("cx", this.position.x);
        this.element.setAttribute("cy", this.position.y);

        // Check if the projectile has traveled the maximum distance
        if (this.distanceTraveled >= this.maxDistance) {
            this.remove();
        }
    }

    isOutOfBounds(width, height) {
        return (
            this.position.x < 0 || this.position.x > width ||
            this.position.y < 0 || this.position.y > height
        );
    }

    remove() {
        this.element.remove();
    }
}


export class Projectile {
    constructor(x, y, angle, svgElement) {
        this.position = { x: x, y: y };
        this.angle = angle;
        this.speed = 3;
        this.radius = 0.5; // Radius of the projectile

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
        this.position.x += this.speed * Math.cos(radians);
        this.position.y += this.speed * Math.sin(radians);

        this.element.setAttribute("cx", this.position.x);
        this.element.setAttribute("cy", this.position.y);
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


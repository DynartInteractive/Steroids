import { getDimensions } from './getDimensions.js';
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

        // Add a debug rectangle around the bounding box
        // const bbox = this.element.getBBox();
        // this.debugRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        // this.debugRect.setAttribute("x", bbox.x);
        // this.debugRect.setAttribute("y", bbox.y);
        // this.debugRect.setAttribute("width", bbox.width);
        // this.debugRect.setAttribute("height", bbox.height);
        // this.debugRect.setAttribute("fill", "none");
        // this.debugRect.setAttribute("stroke", "green");
        // projectilesGroup.appendChild(this.debugRect);
    }
    getDimensions() {
        return getDimensions(this.element);
    }

    updateProjectilePosition() {
        const radians = (this.angle - 90) * (Math.PI / 180);
        const dx = this.speed * Math.cos(radians);
        const dy = this.speed * Math.sin(radians);

        this.position.x += dx;
        this.position.y += dy;
        this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);

        // Update the projectile's position
        this.element.setAttribute("cx", this.position.x);
        this.element.setAttribute("cy", this.position.y);

        // Update debug collision shape position and size if it exists
        // if (this.debugRect) {
        //     const bbox = this.element.getBBox();
        //     this.debugRect.setAttribute("x", bbox.x);
        //     this.debugRect.setAttribute("y", bbox.y);
        //     this.debugRect.setAttribute("width", bbox.width);
        //     this.debugRect.setAttribute("height", bbox.height);
        // }

        // Check if the projectile has traveled the maximum distance
        if (this.distanceTraveled >= this.maxDistance) {
            this.remove();
        }
    }


    remove() {
        this.element.remove();
    }
}


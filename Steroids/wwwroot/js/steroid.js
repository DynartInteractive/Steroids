import { Thrust } from './thrust.js';
import { GameArea } from './gameArea.js';
import { getDimensions } from './getDimensions.js';
export class Steroid {
    constructor(svgElement, id, player, svgHandler) {
        this.svgElement = svgElement;
        this.id = id;
        this.player = player;
        this.svgHandler = svgHandler;
        this.position = {
            x: Math.random() * svgElement.viewBox.baseVal.width,
            y: Math.random() * svgElement.viewBox.baseVal.height
        };
        this.thrust = new Thrust(1, 0.3);
        this.fluctuationSize = 1; // Initial fluctuation size
        this.fluctuationSpeed = 0.005; // Slower fluctuation speed
        this.fluctuationDirection = 1; // Direction of size fluctuation
        this.fluctuationCounter = 0; // Counter for fluctuation time
        this.fluctuationDelay = 300; // Delay in frames before next attack
        this.state = 'fluctuating'; // Initial state

        this.angle = 0; // Initial angle
        this.gameArea = new GameArea();
    }
    initialize() {
        // Load the SVG from the resource handler
        const svgElement = this.svgHandler.getResource(this.id);
        if (svgElement) {
            this.steroid = svgElement.cloneNode(true);

            // Wrap the loaded SVG in a group
            this.steroidGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.steroidGroup.setAttribute('id', `${this.id}-group`);
            this.steroidGroup.appendChild(this.steroid);

            // Append the group to the main SVG element
            this.svgElement.appendChild(this.steroidGroup);

            // Calculate the initial bounding box and center
            const bbox = this.steroid.getBBox();
            this.initialCx = bbox.x + bbox.width / 2;
            this.initialCy = bbox.y + bbox.height / 2;

            // Apply the initial transform to center the steroid correctly
            this.steroidGroup.setAttribute('transform',
                `translate(${this.position.x}, ${this.position.y}) 
             rotate(0, ${this.initialCx}, ${this.initialCy}) 
             scale(1)`); // Initial scale is 1 (no scaling yet)

            // Add a debug rectangle around the bounding box
            this.debugRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            this.debugRect.setAttribute("x", bbox.x);
            this.debugRect.setAttribute("y", bbox.y);
            this.debugRect.setAttribute("width", bbox.width);
            this.debugRect.setAttribute("height", bbox.height);
            this.debugRect.setAttribute("fill", "none");
            this.debugRect.setAttribute("stroke", "red");
            this.steroidGroup.appendChild(this.debugRect);

            // Initialize the position
            this.updatePosition();
        } else {
            console.error(`SVG resource with ID ${this.id} could not be found.`);
        }
    }


    fluctuateSize() {
        this.fluctuationSize += this.fluctuationSpeed * this.fluctuationDirection;
        if (this.fluctuationSize > 1.1 || this.fluctuationSize < 0.9) {
            this.fluctuationDirection *= -1; // Reverse direction when reaching bounds
        }
    }

    targetPlayer() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        this.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Calculate angle in degrees
        //console.log(`Targeting player at: (${this.player.position.x}, ${this.player.position.y}), Steroid Angle: ${this.angle}`);
    }
    getDimensions() {
        return getDimensions(this.steroid);
    }
    updatePosition() {
        if (!this.steroid) return; // Wait until the SVG is loaded

        if (this.state === 'fluctuating') {
            this.fluctuateSize();
            this.targetPlayer();

            if (this.fluctuationCounter < this.fluctuationDelay) {
                this.fluctuationCounter++;
            } else {
                this.state = 'moving';
                this.fluctuationCounter = 0;
            }
        } else if (this.state === 'moving') {
            // Instead of thrusting, just move towards the target position calculated by the thrust
            this.thrust.applyThrust(this.angle);
            this.position = this.thrust.updatePosition(this.position);

            // After moving for a short distance, switch back to fluctuating state
            if (this.thrust.distanceTravelled >= 10) { // Adjust the distance as needed
                this.state = 'fluctuating';
                this.thrust.resetDistance(); // Reset the distance travelled for the next move
            }
        }

        // Calculate the bounding box of the steroid SVG element to determine the pivot point
        const bbox = this.steroid.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        // Update the SVG element with the new position, rotation, and scale, using the center as the pivot
        this.steroidGroup.setAttribute('transform',
            `translate(${this.position.x}, ${this.position.y}) 
         rotate(${this.angle}, ${cx}, ${cy}) 
         scale(${this.fluctuationSize})`);

        // Check and update boundaries to ensure the steroid wraps around the game area properly
        this.gameArea.checkSteroidBoundaries(this);
    }

    remove() {
        if (this.steroidGroup) {
            this.steroidGroup.remove();
        }
    }
}
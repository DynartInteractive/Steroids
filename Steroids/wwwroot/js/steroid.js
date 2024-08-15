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

        // // Uncomment on debug //Create a circle for debugging the position
        // this.debugCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        // this.debugCircle.setAttribute("r", 5);
        // this.debugCircle.setAttribute("fill", "red");
        //this.svgElement.appendChild(this.debugCircle);

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

            this.svgElement.appendChild(this.steroidGroup);
        }

        this.updatePosition();
    }

    fluctuateSize() {
        this.fluctuationSize += this.fluctuationSpeed * this.fluctuationDirection;
        if (this.fluctuationSize > 1.2 || this.fluctuationSize < 0.8) {
            this.fluctuationDirection *= -1; // Reverse direction when reaching bounds
        }
    }

    targetPlayer() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        this.angle = Math.atan2(dy, dx) * (180 / Math.PI); // Calculate angle in degrees
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

        // Update SVG element with new position and rotation
        this.steroidGroup.setAttribute('transform', `translate(${this.position.x}, ${this.position.y}) rotate(${this.angle}) scale(${this.fluctuationSize})`);

        this.gameArea.checkSteroidBoundaries(this); // Check and update boundaries
        
        // // Uncomment on debug // Update debug circle position
        // this.debugCircle.setAttribute('cx', this.steroidPosition.x);
        // this.debugCircle.setAttribute('cy', this.steroidPosition.y);
    }
    remove() {
        if (this.steroidGroup) {
            this.steroidGroup.remove();
        }
        if (this.debugCircle) {
            this.debugCircle.remove();
        }
    }
}
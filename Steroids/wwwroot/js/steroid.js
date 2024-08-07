import { Thrust } from './thrust.js';
export class Steroid {
    constructor(svgElement, id, needle, svgHandler) {
        this.svgElement = svgElement;
        this.id = id;
        this.needle = needle;
        this.svgHandler = svgHandler;
        this.steroidPosition = {
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

        this.steroidAngle = 0; // Initial angle

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

        this.updateSteroidPosition();
    }

    fluctuateSize() {
        this.fluctuationSize += this.fluctuationSpeed * this.fluctuationDirection;
        if (this.fluctuationSize > 1.2 || this.fluctuationSize < 0.8) {
            this.fluctuationDirection *= -1; // Reverse direction when reaching bounds
        }
    }

    targetNeedle() {
        const dx = this.needle.needlePosition.x - this.steroidPosition.x;
        const dy = this.needle.needlePosition.y - this.steroidPosition.y;
        this.steroidAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Calculate angle in degrees
        //console.log(`Targeting Needle at: (${this.needle.needlePosition.x}, ${this.needle.needlePosition.y}), Steroid Angle: ${this.steroidAngle}`);
    }
    updateSteroidPosition() {
        if (!this.steroid) return; // Wait until the SVG is loaded

        if (this.state === 'fluctuating') {
            this.fluctuateSize();
            this.targetNeedle();

            if (this.fluctuationCounter < this.fluctuationDelay) {
                this.fluctuationCounter++;
            } else {
                this.state = 'moving';
                this.fluctuationCounter = 0;
            }
        } else if (this.state === 'moving') {
            // Instead of thrusting, just move towards the target position calculated by the thrust
            this.thrust.applyThrust(this.steroidAngle);
            this.steroidPosition = this.thrust.updatePosition(this.steroidPosition);

            // After moving for a short distance, switch back to fluctuating state
            if (this.thrust.distanceTravelled >= 10) { // Adjust the distance as needed
                this.state = 'fluctuating';
                this.thrust.resetDistance(); // Reset the distance travelled for the next move
            }
        }

        // Update SVG element with new position and rotation
        this.steroidGroup.setAttribute('transform', `translate(${this.steroidPosition.x}, ${this.steroidPosition.y}) rotate(${this.steroidAngle}) scale(${this.fluctuationSize})`);
        
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
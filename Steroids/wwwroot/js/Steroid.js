export class Steroid {
    constructor(svgElement, id) {
        this.svgElement = svgElement;
        this.id = id;
        this.steroid = svgElement.querySelector(`#${id}`);
        this.steroidPosition = {
            x: Math.random() * svgElement.viewBox.baseVal.width,
            y: Math.random() * svgElement.viewBox.baseVal.height
        };
        this.steroidSpeed = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        this.steroidAngle = 0; // Initial angle
        this.steroidRotationSpeed = (Math.random() - 0.5) * 0.1; // Random rotation speed

        this.updateSteroidPosition();
    }

    updateSteroidPosition() {
        this.steroidPosition.x += this.steroidSpeed.x;
        this.steroidPosition.y += this.steroidSpeed.y;
        this.steroidAngle += this.steroidRotationSpeed;

        // Wrap around the screen
        if (this.steroidPosition.x < 0) this.steroidPosition.x = this.svgElement.viewBox.baseVal.width;
        if (this.steroidPosition.x > this.svgElement.viewBox.baseVal.width) this.steroidPosition.x = 0;
        if (this.steroidPosition.y < 0) this.steroidPosition.y = this.svgElement.viewBox.baseVal.height;
        if (this.steroidPosition.y > this.svgElement.viewBox.baseVal.height) this.steroidPosition.y = 0;

        this.steroid.setAttribute('transform', `translate(${this.steroidPosition.x}, ${this.steroidPosition.y}) rotate(${this.steroidAngle})`);
    }
}

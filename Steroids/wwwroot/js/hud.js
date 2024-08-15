export class HUD {
    constructor(svgElement, svgHandler, gameArea) {
        this.svgElement = svgElement;
        this.svgHandler = svgHandler;
        this.gameArea = gameArea;
        this.loadHudSvg();
    }

    async loadHudSvg() {
        try {
            const svgElement = this.svgHandler.getResource('hud');
            if (svgElement) {
                this.hud = svgElement.cloneNode(true);
                this.hud.setAttribute('id', 'hud');
                this.svgElement.appendChild(this.hud);

                this.addPadding();
                this.initIndicators();
            } else {
                console.error('HUD SVG not found in resources.');
            }
        } catch (error) {
            console.error('Error loading HUD SVG:', error);
        }
    }

    addPadding() {
        const paddingPercent = 3; // 5% padding
        const { width, height } = this.gameArea.getDimensions();

        const paddingX = (paddingPercent / 100) * width;
        const paddingY = (paddingPercent / 100) * height;

        const newWidth = width - 2 * paddingX;
        const newHeight = height - 2 * paddingY;

        this.hud.setAttribute('x', paddingX);
        this.hud.setAttribute('y', paddingY);
        this.hud.setAttribute('width', newWidth);
        this.hud.setAttribute('height', newHeight);
    }

    initIndicators() {
        this.distanceIndicators = [
            this.hud.querySelector('#distanceIndicator_0'),
            this.hud.querySelector('#distanceIndicator_1'),
            this.hud.querySelector('#distanceIndicator_2')
        ].filter((indicator, index) => {
            if (!indicator) console.error(`Distance indicator ${index} not found`);
            return indicator !== null;
        });

        this.sizeIndicators = [
            this.hud.querySelector('#sizeIndicator_0'),
            this.hud.querySelector('#sizeIndicator_1'),
            this.hud.querySelector('#sizeIndicator_2')
        ].filter((indicator, index) => {
            if (!indicator) console.error(`Size indicator ${index} not found`);
            return indicator !== null;
        });

        this.bonusIndicators = [
            this.hud.querySelector('#BonusIndicator_0'),
            this.hud.querySelector('#BonusIndicator_1'),
            this.hud.querySelector('#BonusIndicator_2'),
            this.hud.querySelector('#BonusIndicator_3'),
            this.hud.querySelector('#BonusIndicator_4'),
            this.hud.querySelector('#BonusIndicator_5'),
            this.hud.querySelector('#BonusIndicator_6'),
            this.hud.querySelector('#BonusIndicator_7'),
            this.hud.querySelector('#BonusIndicator_8'),
            this.hud.querySelector('#BonusIndicator_9')
        ].filter((indicator, index) => {
            if (!indicator) console.error(`Bonus indicator ${index} not found`);
            return indicator !== null;
        });

        this.healthIndicators = [
            this.hud.querySelector('#healthIndicator_0'),
            this.hud.querySelector('#healthIndicator_1'),
            this.hud.querySelector('#healthIndicator_2'),
            this.hud.querySelector('#healthIndicator_3'),
            this.hud.querySelector('#healthIndicator_4')
        ].filter((indicator, index) => {
            if (!indicator) console.error(`Health indicator ${index} not found`);
            return indicator !== null;
        });

        this.resetBonusIndicators();
        this.resetSizeIndicators();
        this.resetDistanceIndicators();
        this.resetHealthIndicators();
    }

    resetBonusIndicators() {
        this.bonusIndicators.forEach(indicator => indicator.style.display = 'none');
    }
    resetDistanceIndicators() {
        this.distanceIndicators.forEach(indicator => indicator.style.display = 'none');
    }
    resetSizeIndicators() {
        this.sizeIndicators.forEach(indicator => indicator.style.display = 'none');
    }
    resetHealthIndicators() {
        this.healthIndicators.forEach(indicator => indicator.style.display = 'block');
    }
    updateDistanceIndicator(playerLevel) {
        this.resetDistanceIndicators();
        for (let i = 0; i < playerLevel; i++) {
            this.distanceIndicators[i].style.display = 'block';
        }
    }

    updateSizeIndicator(projectileSizeLevel) {
        this.resetSizeIndicators();
        for (let i = 0; i < projectileSizeLevel; i++) {
            this.sizeIndicators[i].style.display = 'block';
        }
    }

    updateBonusIndicator(bonusLevel) {
        this.resetBonusIndicators();
        for (let i = 0; i < bonusLevel; i++) {
            this.bonusIndicators[i].style.display = 'block';
        }
    }
    updateHealthIndicator(health) {
        const maxHealth = 10;  // Assuming max health is 10
        const indicatorsCount = this.healthIndicators.length;  // Total number of visual indicators

        this.healthIndicators.forEach((indicator, index) => {
            // Calculate which indicators should be fully filled or half-filled
            const threshold = (index + 1) * 2;

            console.log(`Updating indicator ${index}: Health = ${health}, Threshold = ${threshold}`);

            if (health >= threshold) {
                indicator.setAttribute('opacity', '1');  // Fully filled indicator
            } else if (health === threshold - 1) {
                indicator.setAttribute('opacity', '0.5');  // Half-filled indicator
            } else {
                indicator.setAttribute('opacity', '0.1');  // Mostly transparent for "empty" state
            }
        });
    }
}



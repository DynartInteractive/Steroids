export class BonusItem {
    constructor(type, svgElement, svgHandler, gameArea) {
        this.type = type;
        this.svgElement = svgElement;
        this.svgHandler = svgHandler;
        this.gameArea = gameArea;
        this.position = {
            x: Math.random() * this.gameArea.width,
            y: Math.random() * this.gameArea.height
        };
        this.loadBonusSvg();
        this.scheduleRemoval();
    }
    async loadBonusSvg() {
        try {
            const svgElement = this.svgHandler.getResource(this.type);
            if (svgElement) {
                this.bonus = svgElement.cloneNode(true);
                
                //wrap the loaded SVG in a group
                this.bonusGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                this.bonusGroup.setAttribute('id', `${this.type}-group`);
                this.bonusGroup.appendChild(this.bonus);
                this.bonusGroup.setAttribute('transform', `translate(${this.position.x}, ${this.position.y})`);
                this.svgElement.appendChild(this.bonusGroup);
            } else {
                console.error('Bonus SVG not found in resources.');
            }
        }
        catch (error) {
            console.error('Error loading bonus SVG:', error);
        }
    }
    getDimensions() {
        if (!this.bonus) return { width: 0, height: 0 };
        const bbox = this.bonus.getBBox();
        return {
            width: bbox.width,
            height: bbox.height
        };
    }
    scheduleRemoval() {
        const removeTime = Math.random() * (15000 - 3000) + 3000; // Random time between 3-15 seconds
        setTimeout(() => {
            this.remove();
        }, removeTime);
    }

    collect(player) {
        switch (this.type) {
            case 'health_up':
                if (player.health < player.maxHealth) {
                    player.increaseHealth(1);
                } else {
                    player.addScore(100);
                }
                break;
            case 'health_dg':
                if (player.health === 1) {
                    player.addScore(-100);
                } else {
                    player.decreaseHealth(1);
                }
                break;
            case 'player_up':
                if (player.playerLevel < player.maxPlayerLevel) {
                    player.upgradePlayer();
                } else {
                    player.addScore(100);
                }
                break;
            case 'player_dg':
                if (player.playerLevel === 0) {
                    player.addScore(-100);
                } else {
                    player.downgradePlayer();
                }
                break;
            case 'projectile_up':
                if (player.projectileSizeLevel < player.maxProjectileSizeLevel) {
                    player.upgradeProjectileSize();
                } else {
                    player.addScore(100);
                }
                break;
            case 'projectile_dg':
                if (player.projectileSizeLevel === 0) {
                    player.addScore(-100);
                } else {
                    player.addScore(100);
                }
                break;
            case 'blast_charge':
                if (player.bonusIndicators < 10) {
                    player.chargeBlastWave();
                } else {
                    player.addScore(100);
                }
                break;
        }
        this.remove();
    }

    remove() {
        if (this.bonusGroup) {
            this.bonusGroup.remove();
            console.log(`${this.type} bonus item removed.`);
            if (this.onRemoveCallback) {
                this.onRemoveCallback(); // Trigger the callback to spawn a new item
            }
        }
    }
}

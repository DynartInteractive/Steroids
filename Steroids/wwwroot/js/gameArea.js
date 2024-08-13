import { gameDimensions } from './gameDimensions.js';

export class GameArea {
    constructor() {
        this.width = gameDimensions.width;
        this.height = gameDimensions.height;
    }
    getDimensions() {
        return { width: this.width, height: this.height };
    }
    checkPlayerBoundaries(player) {
        const { width, height } = player.getDimensions();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (player.position.x < -halfWidth * 3) {
            player.position.x = this.width + halfWidth * 3;
        } else if (player.position.x > this.width + halfWidth * 3) {
            player.position.x = -halfWidth * 3;
        }

        if (player.position.y < -halfHeight) {
            player.position.y = this.height + halfHeight;
        } else if (player.position.y > this.height + halfHeight) {
            player.position.y = -halfHeight;
        }
    }

    checkProjectileBoundaries(projectile) {
        if (projectile.position.x < 0) {
            projectile.position.x = this.width;
        } else if (projectile.position.x > this.width) {
            projectile.position.x = 0;
        }

        if (projectile.position.y < 0) {
            projectile.position.y = this.height;
        } else if (projectile.position.y > this.height) {
            projectile.position.y = 0;
        }
    }

    checkSteroidBoundaries(steroid) {
        const { width, height } = steroid.getDimensions();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (steroid.position.x < -halfWidth * 3) {
            steroid.position.x = this.width + halfWidth * 3 ;
        } else if (steroid.position.x > this.width + halfWidth * 3) {
            steroid.position.x = -halfWidth * 3;
        }

        if (steroid.position.y < -halfHeight) {
            steroid.position.y = this.height + halfHeight;
        } else if (steroid.position.y > this.height + halfHeight) {
            steroid.position.y = -halfHeight;
        }
    }
}
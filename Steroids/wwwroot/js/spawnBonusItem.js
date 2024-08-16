import {BonusItem} from "./bonusItem";

spawnBonusItem() {
    const bonusTypes = ['health_up', 'health_dg', 'player_up', 'player_dg', 'projectile_up', 'projectile_dg', 'blast_charge'];
    const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];

    let x, y, distance;
    const playerX = this.player.position.x;
    const playerY = this.player.position.y;
    const minDistance = 10;  // Increase the minimum distance from the player
    const maxDistance = Math.min(this.gameArea.width, this.gameArea.height) * 0.9 / 2;

    // Ensure that we find a valid position within a reasonable number of attempts
    const maxAttempts = 100;
    let attempts = 0;
    let validPosition = false;

    do {
        x = Math.random() * this.gameArea.width * 0.9;
        y = Math.random() * this.gameArea.height * 0.9;
        distance = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
        attempts++;
        if (distance >= minDistance) {
            validPosition = true;
        }
    } while (!validPosition && attempts < maxAttempts);

    // Fallback to player position if no valid position found within max attempts
    if (!validPosition) {
        console.warn('Could not find a valid spawn position for the bonus item within the allowed attempts. Using player position as fallback.');
        x = playerX + minDistance;
        y = playerY + minDistance;
    }

    // Ensure the bonus item is within the game area
    x = Math.min(Math.max(x, 0), this.gameArea.width * 0.9);
    y = Math.min(Math.max(y, 0), this.gameArea.height * 0.9);

    this.bonusItem = new BonusItem(randomType, this.svgElement, this.svgHandler, this.gameArea, () => this.scheduleNextBonusItem());
    this.bonusItem.position = { x, y };
    console.log(`Spawned bonus item: ${randomType} at (${x}, ${y})`);

    // Check for an immediate collision right after spawning
    if (this.isCollision(this.player, this.bonusItem)) {
        console.log('Player immediately collected the bonus item upon spawn.');
        this.bonusItem.collect(this.player);
        this.bonusItem = null;
        this.scheduleNextBonusItem();
    }
}
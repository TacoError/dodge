const Enemy = require("../enemy.js");

class WallFollowerEnemy extends Enemy {

    constructor(level, x, y, radius, speed, direction) {
        super(level, x, y, radius, "blue", speed); // You can set the color to whatever you prefer
        this.direction = direction; // 1: Move along the outer wall clockwise, -1: Move along the outer wall counterclockwise
    }

    doAutomaticMove() {
        this.tickAll();
        if (this.immobileFor > 0) {
            return;
        }

        // Calculate the desired position on the outer wall
        let targetX = this.x;
        let targetY = this.y;
        const w = this.parent.width;
        const h = this.parent.height;

        if (this.direction === 1) { // Moving clockwise along the outer wall
            if (this.x === 150 && this.y < h - 150 - this.radius) {
                targetY += this.speedMultiplier.current;
            } else if (this.y === h - 150 - this.radius && this.x < w - 150 - this.radius) {
                targetX += this.speedMultiplier.current;
            } else if (this.x === w - 150 - this.radius && this.y > 150 + this.radius) {
                targetY -= this.speedMultiplier.current;
            } else {
                targetX -= this.speedMultiplier.current;
            }
        } else { // Moving counterclockwise along the outer wall
            if (this.x === 150 && this.y > 150 + this.radius) {
                targetY -= this.speedMultiplier.current;
            } else if (this.y === 150 + this.radius && this.x < w - 150 - this.radius) {
                targetX += this.speedMultiplier.current;
            } else if (this.x === w - 150 - this.radius && this.y < h - 150 - this.radius) {
                targetY += this.speedMultiplier.current;
            } else {
                targetX -= this.speedMultiplier.current;
            }
        }

        // Move towards the target position
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = dx / distance;
            this.vy = dy / distance;
        } else {
            this.vx = 0;
            this.vy = 0;
        }

        this.x += this.vx * this.speedMultiplier.current;
        this.y += this.vy * this.speedMultiplier.current;

        // Update direction if necessary
        if (this.x === 150 && this.y === 150 + this.radius) {
            this.direction = 1;
        } else if (this.x === w - 150 - this.radius && this.y === h - 150 - this.radius) {
            this.direction = -1;
        }
    }

    repel(from) {
        // Implement the repel logic if needed
    }
}

module.exports = WallFollowerEnemy;

const Enemy = require("../enemy.js");

class SquigglerEnemy extends Enemy {

    constructor(parent, x, y, radius, speed) {
        super(parent, x, y, radius, "purple", speed);
        this.angle = Math.random() * 6.28318531;
        this.vx = Math.cos(this.angle);
        this.vy = Math.sin(this.angle);
        this.squiggleDirection = Math.random() > 0.5 ? 1 : -1;
    }

    doAutomaticMove() {
        this.tickAll();
        if (this.immobileFor > 0) {
            return;
        }
        this.x += this.vx * this.speedMultiplier.current;
        this.y += this.vy * this.speedMultiplier.current;

        if (this.x < (150 + this.radius)) {
            this.x = 150 + this.radius;
            this.vx = Math.abs(this.vx); 
        }
        if (this.x > (this.parent.width - (150 + this.radius))) {
            this.x = this.parent.width - (150 + this.radius);
            this.vx = -Math.abs(this.vx); 
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy); 
        }
        if (this.y > (this.parent.height - this.radius)) {
            this.y = this.parent.height - this.radius;
            this.vy = -Math.abs(this.vy); 
        }

        if (Math.random() < 0.01) {
            this.squiggleDirection *= -1;
        }

        this.vx += this.squiggleDirection * (Math.random() - 0.5);
        this.vy += this.squiggleDirection * (Math.random() - 0.5);

        const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.vx /= velocityMagnitude;
        this.vy /= velocityMagnitude;
    }

    repel(from) {
        // Implement the repel logic if needed
    }
}

module.exports = SquigglerEnemy;

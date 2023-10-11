const Enemy = require("../enemy.js");

class RegularEnemy extends Enemy {

    constructor(parent, x, y, radius, speed) {
        super(parent, x, y, radius, "gray", speed);
        this.angle = Math.random() * 6.28318531;
		this.vx = Math.cos(this.angle);
		this.vy = Math.sin(this.angle);
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
            this.vx = -this.vx;
        }
        if (this.x > (this.parent.width - (150 + this.radius))) {
            this.x = this.parent.width - (150 + this.radius);
            this.vx = -this.vx;
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy = -this.vy;
        }
        if (this.y > (this.parent.height - this.radius)) {
            this.y = this.parent.height - this.radius;
            this.vy = -this.vy;
        }
    }

    repel(from) {
        const dx = this.x - from.x;
        const dy = this.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / distance;
        const ny = dy / distance;
        const dotProduct = this.vx * nx + this.vy * ny;
        this.vx -= 2 * dotProduct * nx;
        this.vy -= 2 * dotProduct * ny;
    }
    

};

module.exports = RegularEnemy;
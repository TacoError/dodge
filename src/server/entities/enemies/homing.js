const Enemy = require("../enemy.js");

class HomingEnemy extends Enemy {

    constructor(parent, x, y, radius, speed, homingRange) {
        super(parent, x, y, radius, "orange", speed); 
        this.homingRange = homingRange;
        this.angle = Math.random() * 6.28318531;
		this.vx = Math.cos(this.angle);
		this.vy = Math.sin(this.angle);
    }

    doAutomaticMove() {
        this.tickAll();
        if (this.immobileFor > 0) {
            return;
        }

        const players = this.parent.entities.filter(entity => entity.text !== "" && entity !== this && !(entity.deadFor > 0));

        if (players.length > 0) {
            let closestPlayer = null;
            let closestDistance = Number.MAX_VALUE;

            for (const player of players) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance && distance <= this.homingRange && distance > 0) {
                    closestDistance = distance;
                    closestPlayer = player;
                }
            }

            if (closestPlayer) {

                const dx = closestPlayer.x - this.x;
                const dy = closestPlayer.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const vx = dx / distance;
                const vy = dy / distance;

                this.vx = vx;
                this.vy = vy;
                this.movingRandomly = false;
            }
        } else {
            if (!this.movingRandomly) {
                this.vx = Math.random() * 2 - 1;
                this.vy = Math.random() * 2 - 1;
                this.movingRandomly = true;
            }
        }

        this.x += this.vx * this.speedMultiplier.current;
        this.y += this.vy * this.speedMultiplier.current;

        // Keep the enemy within the map boundaries
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
    }

    repel(from) {
   
    }
}

module.exports = HomingEnemy;
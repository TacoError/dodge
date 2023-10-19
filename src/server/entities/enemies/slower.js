const Enemy = require("../enemy");
//const SAT = require("sat");

class SlowerEnemy extends Enemy {

    constructor(parent, x, y, radius, speed, slowerRadius) {
        super(parent, x, y, radius, "red", speed);
        this.slower = new SlowerAttachment(parent, slowerRadius);
        parent.entities.push(this.slower);
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
        this.slower.x = this.x;
        this.slower.y = this.y;
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

// for some reason the radius modifier screwed up on this, so the json is manually set.
// nvm im an idiot
class SlowerAttachment extends Enemy {

    constructor(parent, pradius) {
        super(parent, 0, 0, pradius, "rgba(255,0,0,0.5)", 0);
        //console.log(`set with radius ${pradius}`)
        this.radiusModifier.initial = pradius;
        this.isModifierEnemy = true;
    }

    doAutomaticMove() {
        this.tickAll();
        if (this.immobileFor > 0) {
            return;
        }
    }

    repel(from) {}

    whenCollide(entity) {
        if (entity.text == "") {
            return;
        }
        entity.speedMultiplier.addModifier(0.9, 2);
    }

};

module.exports = SlowerEnemy;
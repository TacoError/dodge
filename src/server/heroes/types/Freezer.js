const Hero = require("../hero");

class Freezer extends Hero {

    constructor(ent) {
        super("Freezer", "blue", ent, 10, 2)
    }
    
    whenUsePowerOne() {
        if (!this.isCoolDownUpFor("0")) {
            return;
        }
        const ent = this.entity;
        for (const e of ent.parent.getEntitiesWithin(ent.x, ent.y, 500)) {
            e.immobileFor = 40 * 3;
            e.colorModifier.setModifier("blue", 40 * 3);
        }
        this.setCooldown("0");
    }

    whenUsePowerTwo() {
        if (!this.isCoolDownUpFor("1")) {
            return;
        }
        this.entity.x += this.entity.lastDirection.x * 120;
        this.entity.y += this.entity.lastDirection.y * 120;
        const p = this.entity.parent;
        const e = this.entity;
        if (e.x > p.width) {
            e.x = p.width - e.radius;
        }
        if (e.x < e.radius) {
            e.x = e.radius;
        }
        if (e.y > p.height) {
            e.y = p.height - e.radius;
        }
        if (e.y < e.radius) {
            e.y = e.radius;
        }
        this.setCooldown("1");
    }

};

module.exports = Freezer;
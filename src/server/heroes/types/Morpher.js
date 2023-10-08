const Hero = require("../hero");

class Morpher extends Hero {

    constructor(ent) {
        super("Morpher", "green", ent, 5, 5);
    }

    whenUsePowerOne() {
        if (!this.isCoolDownUpFor("0")) {
            return;
        }
        const ent = this.entity;
        for (const e of ent.parent.getEntitiesWithin(ent.x, ent.y, 350)) {
            e.repel();
            e.colorModifier.setModifier("green", 40);
        }
        this.setCooldown("0");
    }

    whenUsePowerTwo() {
        if (!this.isCoolDownUpFor("1")) {
            return;
        }
        const ent = this.entity;
        for (const e of ent.parent.getEntitiesWithin(ent.x, ent.y, 350)) {
            e.radiusModifier.addModifier(-5, 40 * 3);
            e.colorModifier.setModifier("lightgreen", 40);
        }
        this.setCooldown("1");
    }

};

module.exports = Morpher;
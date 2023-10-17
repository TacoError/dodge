const Hero = require("../hero");

class MagMax extends Hero {

    constructor(ent) {
        super("MagMax", "red", ent, 5, 5);
    }

    whenUsePowerOne() {
        if (!this.isCoolDownUpFor("0")) {
            return;
        }
        this.entity.speedMultiplier.addModifier(1.5, 100);
        this.setCooldown("0");
        this.entity.colorModifier.setModifier("orange", 100);
    }

    whenUsePowerTwo() {
        if (!this.isCoolDownUpFor("1")) {
            return;
        }
        if (this.entity.immobile) {
            this.entity.immobile = false;
            this.entity.canTakeDamage = true;
            this.entity.colorModifier.initialColor = this.entity.colorModifier.initialColorHold;
            this.setCooldown("1");
            return;
        }
        this.entity.immobile = true;
        this.entity.canTakeDamage = false;
        this.entity.colorModifier.initialColor = "gray";
    }

};

module.exports = MagMax;
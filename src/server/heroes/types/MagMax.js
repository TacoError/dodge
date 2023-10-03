const Hero = require("../hero");

class MagMax extends Hero {

    constructor(ent) {
        super("MagMax", "red", ent, 5, 5);
    }

    whenUsePowerOne() {
        if (!this.isCoolDownUpFor("0")) {
            return;
        }
        this.entity.speedMultiplier.addModifier(1, 100);
        this.setCooldown("0");
        this.entity.colorModifier.setModifier("orange", 100);
    }

    whenUsePowerTwo() {
        
    }

};

module.exports = MagMax;
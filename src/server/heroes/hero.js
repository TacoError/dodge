class Hero {

    constructor(name, color, entity, power1CD, power2CD) {
        this.name = name;
        this.color = color;
        this.entity = entity;
        this.power1CD = power1CD;
        this.power2CD = power2CD;
        this.currentPower1CD = 0;
        this.currentPower2CD = 0;
    }

    toJSON() {
        return {
            n: this.name,
            r1: this.power1CD - this.getTimeElapsed("0"),
            r2: this.power2CD - this.getTimeElapsed("1")
        };
    }

    whenUsePowerOne() {}

    whenUsePowerTwo() {}

    setCooldown(which) {
        if (which == "0") {
            this.currentPower1CD = new Date().getTime();
            return;
        }
        this.currentPower2CD = new Date().getTime();
    }

    getTimeElapsed(which) {
        if (which == "0") {
            return Math.abs(this.currentPower1CD - (new Date()).getTime()) / 1000;
        }
        return Math.abs(this.currentPower2CD - (new Date()).getTime()) / 1000;
    }

    isCoolDownUpFor(which) {
        return this.getTimeElapsed(which) > (which == "0" ? this.power1CD : this.power2CD);
    }

    tick() {}

};

module.exports = Hero;
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

    }

    tick() {}

};

module.exports = Hero;
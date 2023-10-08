class RadiusModifier {

    constructor(initial) {
        this.initial = initial;
        this.modifications = [];
        this.currentRadius = 0;
    }

    addModifier(amount, time) {
        this.modifications.push({
            amt: amount,
            t: time
        });
    }

    tick() {
        this.currentRadius = this.initial;
        const newModifiers = [];
        for (const m of this.modifications) {
            m.t--;
            if (m.t < 1) {
                continue;
            }
            newModifiers.push(m);
            this.currentRadius += m.amt;
        }
        this.modifications = newModifiers;
    }



};

module.exports = RadiusModifier;
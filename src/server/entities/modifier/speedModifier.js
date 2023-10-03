class SpeedModifier {

    constructor() {
        this.current = 1.0;
        this.running = [];
    }

    getCurrentModifier() {
        return this.current;
    }

    addModifier(amt, ttl) {
        this.running.push({
            ticksToLive: ttl,
            modifier: amt
        });
    }

    tick() {
        const newRunningArray = [];
        let newCurrent = 1.0;
        for (const o of this.running) {
            o.ticksToLive--;
            if (o.ticksToLive < 1) {
                continue;
            }
            newRunningArray.push(o);
            newCurrent += o.modifier;
        }
        this.running = newRunningArray;
        this.current = newCurrent;
    }

};

module.exports = SpeedModifier;
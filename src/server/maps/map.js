class Map {

    constructor(color, name, levels, mgr) {
        this.color = color;
        this.name = name;
        this.levels = levels;
        this.mgr = mgr;
    }

    toJSON() {
        return {
            c: this.color,
            n: this.name
        }
    }

    getLevel(c) {
        return this.levels[c];
    }

    addLevel(l) {
        this.levels.push(l);
    }

    getNextLevel(current) {
        return this.levels[current + 1];
    }

    getLevelBefore(current) {
        return this.levels[current - 1];
    }

};

module.exports = Map;
class Map {

    constructor(color, name, levels) {
        this.color = color;
        this.name = name;
        this.levels = levels;
    }

    toJSON() {
        return {
            c: this.color,
            n: this.name
        }
    }

    addLevel(l) {
        this.levels.push(l);
    }

    getNextMap(current) {
        return this.levels[current + 1];
    }

    getMapBefore(current) {
        return this.levels[current - 1];
    }

};

module.exports = Map;
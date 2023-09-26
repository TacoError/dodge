const Maps = require("../../../info/maps.json");
const Map = require("./map.js");
const Level = require("./level.js");
const Regular = require("../entities/enemies/regular.js");

class MapsManager {

    constructor() {
        this.maps = [];

        for (const mapName in Maps) {
            const mapInfo = Maps[mapName];
            const map = new Map(mapInfo["color"], mapName, []);
            for (const levelInfo of mapInfo["levels"]) {
                const level = new Level(map, levelInfo["width"], levelInfo["height"], []);
                for (const enemy of levelInfo["enemies"]) {
                    if (enemy["type"] == "regular") {
                        for (let i = 0; i <= enemy["amount"]; i++) {
                            level.entities.push(new Regular(level, 100, 100, enemy["radius"], enemy["speed"]));
                        }
                        continue;
                    }
                }
                level.tick();
                map.addLevel(level);
            }
            console.log(`Map loaded: ${mapName}.`);
        }
    }

    addMap(map) {
        this.maps.push(map);
    }

    getMapAfter(name) {
        let next = false;
        for (const m of maps) {
            if (next) {
                return m;
            }
            if (m.name == name) {
                next = true;
                continue;
            }
        }
        return this.maps[0];
    }

    getMapBefore(name) {
        let last = null;
        for (const m of maps) {
            if (m == name) {
                if (last == null) {
                    return this.maps[0];
                }
                return last;
            }
            last = m;
        }
        return last;
    }
    
};

module.exports = MapsManager;
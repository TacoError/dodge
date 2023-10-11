const Maps = require("../../../info/maps.json");
const Map = require("./map.js");
const Level = require("./level.js");
const Regular = require("../entities/enemies/regular.js");
const mathUtils = require("../utils/mathUtils.js");

class MapsManager {

    constructor() {
        this.maps = [];

        for (const mapName in Maps) {
            const mapInfo = Maps[mapName];
        
            const map = new Map(mapInfo["color"], mapName, [], this);
            let leveln = 0;
            for (const levelInfo of mapInfo["levels"]) {
                const w = levelInfo["width"];
                const h = levelInfo["height"];
                const level = new Level(map, w, h, leveln, [], levelInfo["isVictory"]);
                for (const enemy of levelInfo["enemies"]) {
                    if (enemy["type"] == "regular") {
                        for (let i = 0; i <= enemy["amount"]; i++) {
                            level.entities.push(new Regular(level, mathUtils.randomIntFromInterval(150, w - 150), mathUtils.randomIntFromInterval(0, h), enemy["radius"], enemy["speed"]));
                        }
                        continue;
                    }
                }
                leveln++;
                this.maps.push(map);
                level.tick();
                map.addLevel(level);
            }
            console.log(`Map loaded: ${mapName}.`);
        }
    }

    tick() {
        for (const map of this.maps) {
            for (const l in map.levels) {
                const level = map.levels[l];
                //if (level.players < 1) {
                //    continue;
                //}
                level.tick();
            }
        }
    }

    getMap(name) {
        for (const map of this.maps) {
            if (map.name == name) {
                return map;
            }
        }
    }

    addMap(map) {
        this.maps.push(map);
    }

    getMapAfter(name) {
        let next = false;
        for (const m of this.maps) {
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
        for (const m of this.maps) {
            if (m.name === name) {
                if (last === null) {
                    return this.maps[this.maps.length - 1];
                }
                return last;
            }
            last = m;
        }
        return this.maps[0];
    }
    
};

module.exports = MapsManager;
const Maps = require("../../../info/maps.json");
const Map = require("./map.js");
const Level = require("./level.js");
const Regular = require("../entities/enemies/regular.js");
const mathUtils = require("../utils/mathUtils.js");
const SlowerEnemy = require("../entities/enemies/slower");
const SquigglerEnemy = require("../entities/enemies/squiggler");
const HomingEnemy = require("../entities/enemies/homing");
const WallFollowerEnemy = require("../entities/enemies/wallFollower");

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
                    if (enemy["type"] == "slower") {
                        for (let i = 0; i <= enemy["amount"]; i++) {
                            level.entities.push(new SlowerEnemy(level, mathUtils.randomIntFromInterval(150, w - 150), mathUtils.randomIntFromInterval(0, h), enemy["radius"], enemy["speed"], enemy["slowerRadius"]))
                        }
                        continue;
                    }
                    if (enemy["type"] == "squiggler") {
                        for (let i = 0; i <= enemy["amount"]; i++) {
                            level.entities.push(new SquigglerEnemy(level, mathUtils.randomIntFromInterval(150, w - 150), mathUtils.randomIntFromInterval(0, h), enemy["radius"], enemy["speed"]));
                        }
                        continue;
                    }
                    if (enemy["type"] == "homing") {
                        for (let i = 0; i <= enemy["amount"]; i++) {
                            level.entities.push(new HomingEnemy(level, mathUtils.randomIntFromInterval(150, w - 150), mathUtils.randomIntFromInterval(0, h), enemy["radius"], enemy["speed"], enemy["homingRange"]));
                        }
                        continue;
                    }
                    if (enemy["type"] == "wallFollower") {
                        const numWallFollowers = enemy["amount"];
                        const radius = enemy["radius"];
                        const speed = enemy["speed"];
                    
                        // Calculate the step size for placing wall followers evenly along the boundaries
                        const totalPathLength = (w + h - 600); // 150 pixels on each side
                        const stepSize = totalPathLength / numWallFollowers;
                    
                        if (stepSize <= 0) {
                            // Handle the case where numWallFollowers is too large
                            continue;
                        }
                    
                        // Calculate the direction based on the number of steps along the path
                        const direction = totalPathLength / numWallFollowers > w - 300 ? -1 : 1;
                    
                        for (let i = 0; i < numWallFollowers; i++) {
                            let x, y;
                    
                            if (i < (w - 300) / stepSize) {
                                // Along the top boundary
                                x = 150 + i * stepSize;
                                y = 150;
                            } else if (i < (w - 150 + h - 300) / stepSize) {
                                // Along the right boundary
                                x = w - 150;
                                y = 150 + (i - (w - 300) / stepSize) * stepSize;
                            } else if (i < (2 * (w - 150) + h - 300) / stepSize) {
                                // Along the bottom boundary
                                x = w - 150 - (i - (w - 150 + h - 300) / stepSize) * stepSize;
                                y = h - 150;
                            } else {
                                // Along the left boundary
                                x = 150;
                                y = h - 150 - (i - (2 * (w - 150) + h - 300) / stepSize) * stepSize;
                            }
                    
                            level.entities.push(new WallFollowerEnemy(level, x, y, radius, speed, direction));
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
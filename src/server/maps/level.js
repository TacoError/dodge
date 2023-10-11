const Enemy = require("../entities/enemy.js");
const SAT = require("sat");

class Level {

    constructor(parent, width, height, num, entities = [], isVictoryLevel = false) {
        this.parent = parent;
        this.num = num;
        this.width = width;
        this.height = height;
        this.entities = entities;
        this.currentInfo = {};
        this.players = 0;
        this.borders = [
            new SAT.Box(new SAT.Vector(-50, -50), width + 100, 50).toPolygon(),
            new SAT.Box(new SAT.Vector(-50, 0), 50, height + 100).toPolygon(),
            new SAT.Box(new SAT.Vector(width, -50), 50, height + 100).toPolygon(),
            new SAT.Box(new SAT.Vector(-50, height), width + 100, 50).toPolygon()
        ];
        this.isVictoryLevel = isVictoryLevel;
    }

    removeEntity(entity) {
        const newEntityList = [];
        for (const e of this.entities) {
            if (e.id == entity.id) {
                continue;
            }
            newEntityList.push(e);
        }
        this.entities = newEntityList;
    }

    getEntitiesWithin(x, y, pixelDistance) {
        const within = [];
        for (const e of this.entities) {
            if (this.getDistance({x: x, y: y}, e) < pixelDistance) {
                if (e.text !== "") {
                    continue;
                }
                within.push(e);
            }
        }
        return within;
    }

    tick() {
        const newEntityList = [];
        const entityDataList = [];
        let players = 0;
        for (const e of this.entities) {
            if (e.isFlaggedForDespawn) {
                continue;
            }
            if (e instanceof Enemy) {
                e.doAutomaticMove();
            }
            if (e.isPlayer) {
                players++;
            }  

            for (const e2 of this.entities) {
                if (e.id !== e2.id && e2.collidesWith(e)) {
                    e.whenCollide(e2);
                    e2.whenCollide(e);
                }
            }
        
            newEntityList.push(e);
            entityDataList.push(e.toJSON());
        }
        this.entities = newEntityList;
        this.players = players;

        this.currentInfo = {
            w: this.width,
            h: this.height,
            e: entityDataList,
            n: this.num,
            iv: this.isVictoryLevel
        };
    }

    getInfo() {
        return this.currentInfo;
    }

    getDistance(vector1, vector2) {
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
      }

};

module.exports = Level;
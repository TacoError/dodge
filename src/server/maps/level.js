const Enemy = require("../entities/enemy.js");
const SAT = require("sat");

class Level {

    constructor(parent, width, height, num, entities = []) {
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
            n: this.num
        };
    }

    getInfo() {
        return this.currentInfo;
    }

};

module.exports = Level;
const Enemy = require("../entities/enemy.js");

class Level {

    constructor(parent, width, height, entities = []) {
        this.parent = parent;
        this.width = width;
        this.height = height;
        this.entities = entities;
        this.currentInfo = {};
    }

    tick() {
        const entityDataList = [];
        for (const e of this.entities) {
            if (e instanceof Enemy) {
                e.doAutomaticMove();
            }

            for (const e2 of this.entities) {
                if (e.id !== e2.id && e2.collidesWith(e)) {
                    e.whenCollide(e2);
                    e2.whenCollide(e);
                }
            }
            entityDataList.push(e.toJSON());
        }

        this.currentInfo = {
            w: this.width,
            h: this.height,
            e: entityDataList
        };
    }

    getInfo() {
        return this.currentInfo;
    }

};

module.exports = Level;
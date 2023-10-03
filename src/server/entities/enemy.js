const Entity = require("./entity.js");

class Enemy extends Entity {

    constructor(parent, x, y, radius, color, speed = 3) {
        super(parent, x, y, radius, color, speed, "");
    }

    whenCollide(entity) {
        if (entity instanceof Enemy) {
            return;
        }
        
    }

    doAutomaticMove() {}

};

module.exports = Enemy;
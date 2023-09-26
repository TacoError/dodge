const Enemy = require("../enemy.js");

class RegularEnemy extends Enemy {

    constructor(parent, x, y, radius, speed) {
        super(parent, x, y, radius, "gray", speed);
    }  

    doAutomaticMove() {
        
    }

};

module.exports = RegularEnemy;
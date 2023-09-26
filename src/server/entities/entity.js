const SAT = require("sat");
const IdGen = require("../utils/idGen.js");

class Entity {

    constructor(parent, x, y, radius, color, speed = 3, text = "") {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
        this.radius = radius;
        this.speed = speed;
        this.id = IdGen.getNextID();
    }

    toJSON() {
        // one letter keys because we want it to be smol
        return {
            x: this.x,
            y: this.y,
            c: this.color,
            t: this.text,
            r: this.radius
        };
    }

    getCollider() {
        return new SAT.Circle(new SAT.Vector(this.x, this.y), this.radius);
    }

    collidesWithEntity(e) {
        return SAT.testCircleCircle(this.getCollider(), e.getCollider());
    }

    whenCollide(entity) {}

    processKeyMovement(keys) {
        if (keys.includes("w")) this.y -= this.speed;
        if (keys.includes("a")) this.x -= this.speed;
        if (keys.includes("s")) this.y += this.speed;
        if (keys.includes("d")) this.x += this.speed;
    }

};

module.exports = Entity;
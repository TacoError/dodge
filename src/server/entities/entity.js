const SAT = require("sat");
const IdGen = require("../utils/idGen.js");
const notepack = require("notepack");
const SpeedModifier = require("./modifier/speedModifier.js");
const ColorModifier = require("./modifier/colorModifier.js");
const Enemy = require("./enemy.js");

class Entity {

    constructor(parent, x, y, radius, color, speed = 3, text = "", isPlayer = false, socket = null, io = null, hero = null) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
        this.radius = radius;
        this.speed = speed;
        this.id = IdGen.getNextID();
        this.currentInputs = [];
        this.isFlaggedForDespawn = false;
        this.isPlayer = isPlayer;
        this.inputs = [];
        this.io = io;
        this.socket = socket;
        this.hero = hero;
        this.speedMultiplier = new SpeedModifier();
        this.deadFor = 0;
        this.colorModifier = new ColorModifier(color);
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            c: this.colorModifier.getColor(),
            t: this.text,
            r: this.radius,
            //i: this.id,
            d: this.deadFor
        };
    }

    getCollider() {
        return new SAT.Circle(new SAT.Vector(this.x, this.y), this.radius);
    }

    collidesWith(e) {
        return SAT.testCircleCircle(this.getCollider(), e.getCollider());
    }

    whenCollide(entity) {
        if (this.text == "") {
            if (this.deadFor > 0) {
                this.deadFor = 0;
            }
            return;
        }
        if (this.deadFor > 0) {
            return;
        }
        this.deadFor = 40 * 60;
    }

    scktsnd(w, d) {
        this.io.to(this.socket.id).emit(w, notepack.encode(d));
    }
    
    processKeyMovement() {
        if (this.deadFor > 0) {
            this.deadFor--;
            if (this.deadFor < 1) {
                this.socket.disconnect();
            }
            return;
        }
        if (this.inputs.includes("shift")) {
            this.speedMultiplier.addModifier(-0.5, 2);
        }
        this.speedMultiplier.tick();
        this.colorModifier.tick();

        const keys = this.inputs;
        if (keys.includes("w")) this.y -= this.speed * this.speedMultiplier.getCurrentModifier();
        if (keys.includes("a")) this.x -= this.speed * this.speedMultiplier.getCurrentModifier();
        if (keys.includes("s")) this.y += this.speed * this.speedMultiplier.getCurrentModifier();
        if (keys.includes("d")) this.x += this.speed * this.speedMultiplier.getCurrentModifier();

        if (keys.includes("j")) {
            this.hero.whenUsePowerOne();
        }
        if (keys.includes("k")) {
            this.herp.whenUsePowerTwo();
        }

        const collider = this.getCollider();
        for (const border of this.parent.borders) {
            const response = new SAT.Response();
            if (SAT.testCirclePolygon(collider, border, response)) {
                this.x -= response.overlapV.x;
                this.y -= response.overlapV.y;
            }
        }

        if (this.x < (50 + this.radius) && this.parent.num !== 0) {
            const lastLevel = this.parent.parent.getLevel(this.parent.num - 1);
            this.parent.removeEntity(this);
            lastLevel.entities.push(this);
            this.parent = lastLevel;
            this.x = lastLevel.width - (50 + this.radius);
            this.scktsnd("mapInfo", this.parent.parent.toJSON());
        }

        if (this.x > (this.parent.width - (50 + this.radius))) {
            const nextLevel = this.parent.parent.getLevel(this.parent.num + 1);
            if (nextLevel === null) {
                return;
            }
            this.parent.removeEntity(this);
            nextLevel.entities.push(this);
            this.parent = nextLevel;
            this.x = 50 + this.radius;
            this.scktsnd("mapInfo", this.parent.parent.toJSON());
        }

        if (this.parent.num == 0) {
            if (this.x < (150 + this.radius)) {
                if (this.y < (50 + this.radius)) {
                    this.parent.removeEntity(this);
                    const b4 = this.parent.parent.mgr.getMapBefore(this.parent.parent.name).getLevel(0);
                    b4.entities.push(this);
                    this.parent = b4;
                    this.y = b4.height - (50 + this.radius);
                    this.scktsnd("mapInfo", this.parent.parent.toJSON());
                }
                if (this.y > (this.parent.height - (50 + this.radius))) {
                    this.parent.removeEntity(this);
                    const after = this.parent.parent.mgr.getMapAfter(this.parent.parent.name).getLevel(0);
                    after.entities.push(this);
                    this.parent = after;
                    this.y = 50 + this.radius;
                    this.scktsnd("mapInfo", this.parent.parent.toJSON());
                }
            } 
        }
    }

};

module.exports = Entity;
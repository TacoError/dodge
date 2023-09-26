const JsonDB = require("simple-json-db");
const db = new JsonDB("./storage/data.json");
const crypto = require("crypto");

function generateHash(salt, password) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

module.exports = {
    register: (username, password) => {
        const salt = crypto.randomBytes(16).toString("hex");
        db.set(username, {
            "heroes": ["MagMax"],
            "winPoints": 0,
            "cosmetics": [],
            "login": {
                salt: salt,
                hash: generateHash(salt, password)
            }
        });
    },
    checkPassword: (username, password) => {
        const info = db.get(username);
        return info.login.hash === generateHash(info.login.salt, password);
    },
    accountExists: (username) => {
        return db.has(username);
    },
    hasHero: (username, hero) => {
        return db.get(username).heroes.includes(hero);
    }
};
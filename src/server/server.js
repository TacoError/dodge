const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const notepack = require("notepack");
const accountUtils = require("./utils/accountUtils.js");
const heroes = require("../../info/heroes.json");

const port = process.env.PORT || 8000;

app.use(express.static("./src/client"));
server.listen(port);

const MapManager = new (require("./maps/mapsManager.js"));
const Entity = require("./entities/entity.js");
const preLoginInformation = {};
const socketIDToEntity = new Map();
const MagMax = require("./heroes/types/MagMax.js");
const Freezer = require("./heroes/types/Freezer.js");
const Morpher = require("./heroes/types/Morpher.js");
const namesToClass = {
    "MagMax": MagMax,
    "Freezer": Freezer,
    "Morpher": Morpher
};

io.on("connection", (socket) => {
    console.log(`Connection made ${socket.id}`);
    preLoginInformation[socket.id] = {
        loggedIn: false,
        username: ""
    };
    const sendraw= (...bruh) => io.to(socket.id).emit(...bruh);
    const send = (what, info) => io.to(socket.id).emit(what, notepack.encode(info));
    send("heroes", heroes);

    socket.on("register", (e) => {
        const info = notepack.decode(e);
        const username = info.username;
        const password = info.password;
        if (username.length < 3 || username.length > 12) {
            send("err", {color: "red", info: "Username must be > 3 & < 12 in length."});
            return;
        }
        if (password.length < 6 || password.length > 128) {
            send("err", {color: "red", info: "Password must be > 6 & < 128 in length."});
            return;
        }
        if (accountUtils.accountExists(username)) {
            send("err", {color: "red", info: "There is already an account with this name."});
            return;
        }
        accountUtils.register(username, password);
        send("err", {color: "green", info: "Successfully created account."});
    });

    socket.on("login", (e) => {
        const info = notepack.decode(e);
        const username = info.username;
        const password = info.password;
        if (!accountUtils.accountExists(username)) {
            send("err", {color: "red", info: "There is no account with this name."});
            return;
        }
        if (!accountUtils.checkPassword(username, password)) {
            send("err", {color: "red", info: "Incorrect password."});
            return;
        }
        preLoginInformation[socket.id].loggedIn = true;
        preLoginInformation[socket.id].username = username;
        send("loggedIn");
    });

    socket.on("selectHero", (e) => {
        if (!preLoginInformation[socket.id].loggedIn) {
            return;
        }
        const hero = notepack.decode(e);
        if (!accountUtils.hasHero(preLoginInformation[socket.id].username, hero)) {
            send("err", {color: "red", info: "You do not have that hero."});
            return;
        }

        const map = MapManager.getMap("Hub");
        send("mapInfo", notepack.encode(map.toJSON()));
        const entity = new Entity(map.getLevel(0), 10, 10, 15, 
            "red", 
            5, 
            preLoginInformation[socket.id].username, 
            true, 
            socket, 
            io
        );
        entity.hero = new (namesToClass[hero])(entity);
        entity.color = entity.hero.color;
        entity.colorModifier.initialColor = entity.hero.color;
        map.getLevel(0).entities.push(entity);
        socketIDToEntity.set(socket.id, entity);
        send("startGame", notepack.encode(toString(`${entity.id}`)));
        sendraw("chat", `[server] Welcome, ${preLoginInformation[socket.id].username}.`)
    });

    socket.on("inputs", (i) => {
        const d = notepack.decode(i);
        if (!socketIDToEntity.has(socket.id)) {
            return;
        }
        socketIDToEntity.get(socket.id).inputs = d;
    });

    socket.on("chatrec", (msg) => {
        if (!socketIDToEntity.has(socket.id)) {
            return;
        }
        if (msg.length < 1 || msg.length > 200) {
            sendraw("chat", `[server] Message too short / too long.`)
            return;
        }
        msg = msg.replace("<", "");
        msg = msg.replace(">", "");
        const name = socketIDToEntity.get(socket.id).text;
        io.emit("chat", `${name}: ${msg}`);
    });

    socket.on("disconnect", () => {
        if (!socketIDToEntity.has(socket.id)) {
            return;
        }
        const e = socketIDToEntity.get(socket.id);
        e.parent.removeEntity(e);
        socketIDToEntity.delete(socket.id);
    });

});

console.log(`Server listening at http://localhost:${port}`);

setInterval(() => {
    MapManager.tick();

    for (let [sid, entity] of socketIDToEntity) {
        entity.processKeyMovement();
        io.to(sid).emit("yourPos", notepack.encode({x: entity.x, y: entity.y}));
        //console.log(entity.parent.getInfo())
        io.to(sid).emit("levelInfo", notepack.encode(entity.parent.getInfo()));
        io.to(sid).emit("heroInfo", notepack.encode(entity.hero.toJSON()))
    }
    
}, 25);

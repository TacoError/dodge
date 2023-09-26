const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const notepack = require("notepack");
const accountUtils = require("./utils/accountUtils.js");
const heroes = require("../../info/heroes.json");

const port = process.env.PORT || 4000;

app.use(express.static("./src/client"));
server.listen(port);

const MapManager = require("./maps/mapsManager.js");
const preLoginInformation = {};
const socketIDToEntity = new Map();

io.on("connection", (socket) => {
    console.log(`Connection made ${socket.id}`);
    preLoginInformation[socket.id] = {
        loggedIn: false,
        username: ""
    };
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
        send("startGame");
    });
});

console.log(`Server listening at :${port}`);

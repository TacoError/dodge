let canvas, ctx;
let myEntityInfo = {};
let myPos = {x: 0, y: 0};
socket.on("yourPos", (e) => {
     myPos = notepack.decode(e);
 })
let mapInfo = {};
socket.on("mapInfo", (e) => {
    mapInfo = notepack.decode(e);
});
let levelInfo = {};
socket.on("levelInfo", (e) => {
    levelInfo = notepack.decode(e);
});
let down = {};
window.addEventListener("keydown", (e) => {
    down[e.key.toLowerCase()] = true;
    socket.emit("inputs", notepack.encode(Object.keys(down)));
})
window.addEventListener("keyup", (e) => {
    delete down[e.key.toLowerCase()];
    socket.emit("inputs", notepack.encode(Object.keys(down)));
});
let heroInfo = {};
socket.on("heroInfo", (e) => {
    heroInfo = notepack.decode(e);
    if (heroInfo.r1 < 1) {
        heroInfo.r1 = 0;
    }
    if (heroInfo.r2 < 1) {
        heroInfo.r2 = 0;
    }
    heroInfo.r1 = heroInfo.r1.toFixed(2);
    heroInfo.r2 = heroInfo.r2.toFixed(2);
})

function animationLoop() {
    requestAnimationFrame(animationLoop);
    clear(ctx, canvas)

    rectangle(ctx, 0, 0, canvas.width, canvas.height, mapInfo.c);

    ctx.save();


    const myxLock = canvas.width / 2 - myPos.x;
    const myyLock = canvas.height / 2 - myPos.y;

    ctx.translate(myxLock, myyLock);

    rectangle(ctx, 0, 0, levelInfo.w, levelInfo.h, "black", true, "black");
    rectangle(ctx, 0, 0, levelInfo.w, levelInfo.h, "white");
    rectangle(ctx, 0, 0, 150, levelInfo.h, "gray");
    rectangle(ctx, levelInfo.w - 150, 0, 150, levelInfo.h, "gray");
    rectangle(ctx, levelInfo.w - 50, 0, 50, levelInfo.h, "green");

    if (levelInfo.n == 0) {
        rectangle(ctx, 0, 0, 150, 50, "green");
        rectangle(ctx, 0, levelInfo.h - 50, 150, 50, "green");
    } else {
        rectangle(ctx, 0, 0, 50, levelInfo.h, "green");
    }

    if (Symbol.iterator in Object(levelInfo.e)) {
        for (const e of levelInfo.e) {
            if (e.t == lastUsedName) {
                myEntityInfo = e;
                continue;
            }
            circle(ctx, e.x, e.y, e.r, e.c, e.t == "" ? true : false);
            text(ctx, e.x, e.y, e.t, e.r);
        }  
    }
    
    ctx.restore();

    if ("x" in myEntityInfo) {
        circle(ctx, canvas.width / 2, canvas.height / 2,  myEntityInfo.r, myEntityInfo.c, myEntityInfo.t == "" ? true : false);
        text(ctx, canvas.width / 2, canvas.height / 2, myEntityInfo.t, myEntityInfo.r);
    }

    text(ctx, canvas.width / 2, 80, `Map: ${mapInfo.n} (${levelInfo.n + 1})`, 30, "30px");
   
    if ("n" in heroInfo) {
        dry_text(ctx, canvas.width - 250, canvas.height - 75,"15px sans serif", `Hero Name: ${heroInfo.n}`);
        dry_text(ctx, canvas.width - 250, canvas.height - 50, "15px sans serif", `(J) Power One CD: ${heroInfo.r1 < 1 ? 0 : heroInfo.r1}`);
        dry_text(ctx, canvas.width - 250, canvas.height - 25, "15px sans serif", `(K) Power Two CD: ${heroInfo.r2 < 1 ? 0 : heroInfo.r2}`);
    }
}

function startGame() {
    document.getElementById("pre-game").remove();
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    animationLoop();
}

socket.on("startGame", () => {
    startGame();
});
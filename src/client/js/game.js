console.log("This frontend is almost as bad as the backend, why are you even looking.")
let canvas, ctx;
let myEntityInfo = {};
let myPos = {x: 0, y: 0};
socket.on("chat", (msg) => {
    let inc = document.getElementById("chats").innerHTML;
    inc += `<br/>${msg}`;
    document.getElementById("chats").innerHTML = inc;
});
socket.on("yourPos", (e) => {
     myPos = notepack.decode(e);
 })
socket.on("disconnect", () => {
    window.location.reload();
});
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
    if (e.key == "Enter" && document.activeElement === document.body) {
        document.getElementById("chatInput").focus();
        return; 
    }
    if (document.activeElement !== document.body) {
        return;
    }
    down[e.key.toLowerCase()] = true;
    socket.emit("inputs", notepack.encode(Object.keys(down)));
})
window.addEventListener("keyup", (e) => {
    delete down[e.key.toLowerCase()];
    socket.emit("inputs", notepack.encode(Object.keys(down)));
});
let heroInfo = {};
function blurAll(){
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
   }
document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        socket.emit("chatrec", document.getElementById("chatInput").value);
        document.getElementById("chatInput").value = "";
        //blurAll();
    }
})
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
            if (e.d > 0) {
                circle(ctx, e.x, e.y, e.r, "gray", true);
                text(ctx, e.x, e.y, `${e.t} (DEAD ${Math.round(e.d / 40)})`, e.r);
                continue;
            }
            circle(ctx, e.x, e.y, e.r, e.c, e.o);
            text(ctx, e.x, e.y, e.t, e.r);
        }  
    }
    
    ctx.restore();

    if ("x" in myEntityInfo) {
        if (myEntityInfo.d > 0) {
            
            circle(ctx, canvas.width / 2, canvas.height / 2,  myEntityInfo.r, "gray", myEntityInfo.t == "" ? true : false);
            text(ctx, canvas.width / 2, canvas.height / 2, `${myEntityInfo.t} (DEAD ${Math.round(myEntityInfo.d / 40)})`, myEntityInfo.r);
        } else {
            circle(ctx, canvas.width / 2, canvas.height / 2,  myEntityInfo.r, myEntityInfo.c, myEntityInfo.t == "" ? true : false);
            text(ctx, canvas.width / 2, canvas.height / 2, myEntityInfo.t, myEntityInfo.r);
        }
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
    document.getElementById("in-game").style.display = "block";
    animationLoop();
}

socket.on("startGame", () => {
    startGame();
});
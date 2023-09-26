let canvas, ctx;

function animationLoop() {
    requestAnimationFrame(animationLoop);
    
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

socket.on("startGame", startGame);
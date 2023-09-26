function circle(ctx, x, y, radius, color, outline = false, outlineColor = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    if (outline) {
        ctx.strokeStyle = outlineColor;
        ctx.stroke();
    }
}

function rectangle(ctx, x, y, width, height, color, outline = false, outlineColor = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill();
    if (outline) {
        ctx.strokeColor = outlineColor;
        ctx.stroke();
    }
}

function clear(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
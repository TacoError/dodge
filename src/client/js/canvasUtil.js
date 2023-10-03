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

function dry_text(ctx, x, y, font, text) {
    ctx.strokeColor = "black";
    ctx.fillStyle = "black";
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function text(ctx, centerX, centerY, text, radius, fontSize = "12px") {
    ctx.strokeColor = "black";
    ctx.fillStyle = "black";
    ctx.font = `${fontSize} sans serif`;
    const width = ctx.measureText(text).width;
    ctx.fillText(text, centerX - (width / 2), centerY - (radius + 3));
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
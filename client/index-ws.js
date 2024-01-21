let canvas = document.getElementById("canvas")

canvas.width = 600
canvas.height = 700

let ctx = canvas.getContext("2d")

let y;
let x;
let mouseDown = false

function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    const coords = getCanvasCoordinates(e);
    x = coords.x;
    y = coords.y;
    ctx.moveTo(x, y);
    mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;

    const coords = getCanvasCoordinates(e);
    x = coords.x;
    y = coords.y;

    ctx.lineTo(x, y);
    ctx.stroke();
});
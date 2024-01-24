let canvas = document.getElementById("canvas")

canvas.width = 600
canvas.height = 700

var io = io.connect('http://localhost:3000');

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
    io.emit('down', {x,y})
    mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

io.on('ondraw', ({ x, y }) => {
    ctx.lineTo(x, y);
    ctx.stroke();
})

io.on('ondown', ({x,y}) => {
    ctx.moveTo(x,y)
})

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;

    if (mouseDown) {
        io.emit('draw', { x, y })
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    const coords = getCanvasCoordinates(e);
    x = coords.x;
    y = coords.y;

});
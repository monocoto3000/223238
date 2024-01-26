let canvas = document.getElementById("canvas")
let roomcode = document.getElementById("roomcode")

canvas.width = 1000
canvas.height = 500

var io = io.connect('http://localhost:3000');

let ctx = canvas.getContext("2d")

let roomId;
function unirseSala() {
    roomId = document.getElementById("salaid").value;
    io.emit("joinRoom", roomId);
}
function crearSala() {
    roomId = Math.random().toString(36).substring(7);
    console.log(roomId) // Genera un ID de sala aleatorio
    roomcode.textContent= `El código de su sala es: ${roomId}`
    io.emit("joinRoom", roomId);
}

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
    io.emit('down', { x, y, roomId })
    mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

io.on('ondraw', ({ x, y }) => {
    ctx.lineTo(x, y);
    ctx.stroke();
})

io.on('ondown', ({ x, y }) => {
    ctx.moveTo(x, y)
})

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;

    if (mouseDown) {
        io.emit('draw', { x, y, roomId })
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    const coords = getCanvasCoordinates(e);
    x = coords.x;
    y = coords.y;

});
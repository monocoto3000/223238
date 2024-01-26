const express = require('express');
const cors = require('cors');
const app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
})

app.use(cors());
app.use(express.json())

const mensajes = [
  { id: 1, user: "monocoto", asunto: "Hola amigos :D", fecha: new Date().toLocaleString('es-MX', {hour12: true})},
  { id: 2, user: "chesor3000", asunto: "Feliz navidad a todos", fecha: new Date().toLocaleString('es-MX', {hour12: true}) },
];


app.post('/mensajes', (req, res) => {
  const idMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
  const mensaje = {
    id: idMensaje,
    user: req.body.user,
    asunto: req.body.asunto,
    fecha: new Date().toLocaleString('es-MX', {hour12: true})
  }
  mensajes.push(mensaje);
  return res.status(200).json({
    success: true
  })

})

app.get('/mensajes', (req, res) => {
  return res.status(200).json({
    success: true,
    mensajes
  })
});

app.get('/mensajes/update', (req, res) => {
  const ultimoMnensaje = parseInt(req.query.idMensaje, 10);
  const nuevosMensajes = mensajes.filter(mensaje => mensaje.id > ultimoMnensaje);
  return res.status(200).json({
    success: true,
    mensajes: nuevosMensajes
  });
});

// Pizarra colaborativa

httpServer.listen(3000, () => console.log("Servidor inicializado en el puerto 3000"))

let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  let roomId;
  console.log(`${socket.id} se ha conectado`);
  socket.on("draw", (data) => {
    connections.forEach(con => {
      if (con.id !== socket.id && con.rooms.has(data.roomId)) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach(con => {
      if (con.id !== socket.id && con.rooms.has(data.roomId)) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("joinRoom", (newRoomId) => {
    if (roomId) {
        socket.leave(roomId); 
        connections.forEach(con => {
            if (con.id !== socket.id) {
                con.emit("conexiones", { usuarios: connections.length });
            }
        });
    }
    roomId = newRoomId;
    socket.join(roomId);
    socket.rooms.add(roomId);
});

  socket.on("disconnect", () => {
    console.log(`${socket.id} se ha desconectado`);
    connections = connections.filter((con) => {
      con.rooms.delete(roomId);
      return con.id !== socket.id;
    });
  });
});

// Contador de conexiones

app.get('/conexiones', (req, res) => {
  const usuarios = connections.length
  return res.status(200).json({
    success: true,
    usuarios
  })
});



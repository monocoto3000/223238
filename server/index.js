// const express = require('express');
// const cors = require('cors');
// const app = express();
// const jwt = require('jsonwebtoken');
// const path = require('path');

// let usuariosPermitidos = [{ "username": "Monica", "password": "1234" }, { "username": "Pepe", "password": "9876" }];

// let httpServer = require("http").createServer(app);
// let io = require("socket.io")(httpServer, {
//   connectionStateRecovery: {
//     maxDisconnectionDuration: 2 * 60 * 1000,
//     skipMiddlewares: true,
//   },
// })

// app.use(express.json())
// app.use(express.static(path.join(__dirname, "../client")))


// const mensajes = [
//   { id: 1, user: "monocoto", asunto: "Hola amigos :D", fecha: new Date().toLocaleString('es-MX', { hour12: true }) },
//   { id: 2, user: "chesor3000", asunto: "Feliz navidad a todos", fecha: new Date().toLocaleString('es-MX', { hour12: true }) },
// ];

// // Validacion

// app.post('/login', (req, res) => {
//   const validUser = {
//     username: req.body.username,
//     password: req.body.password
//   }
//   const user = usuariosPermitidos.find(u => u.username === validUser.username && u.password === validUser.password);
//   if (user) {
//     const token = jwt.sign({ user }, 'secreto-seguro', { expiresIn: '1h' });
//     console.log(token)
//     return res.status(200).json({
//       success: true,
//       token
//     });
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: 'Credenciales inválidas'
//     });
//   }
// });

// app.post('/mensajes', (req, res) => {
//   const idMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
//   const mensaje = {
//     id: idMensaje,
//     user: req.body.user,
//     asunto: req.body.asunto,
//     fecha: new Date().toLocaleString('es-MX', { hour12: true })
//   }
//   mensajes.push(mensaje);
//   return res.status(200).json({
//     success: true
//   })

// })

// app.get('/mensajes', (req, res) => {
//   return res.status(200).json({
//     success: true,
//     mensajes
//   })
// });

// app.get('/mensajes/update', (req, res) => {
//   const ultimoMnensaje = parseInt(req.query.idMensaje, 10);
//   const nuevosMensajes = mensajes.filter(mensaje => mensaje.id > ultimoMnensaje);
//   return res.status(200).json({
//     success: true,
//     mensajes: nuevosMensajes
//   });
// });

// // Pizarra colaborativa

// httpServer.listen(3000, () => console.log("Servidor inicializado en el puerto 3000"))

// let connections = [];

// io.on("connect", (socket) => {


//   let roomId;
//   console.log(`${socket.id} se ha conectado`);
//   socket.on("draw", (data) => {
//     connections.forEach(con => {
//       if (con.id !== socket.id && con.rooms.has(data.roomId)) {
//         con.emit("ondraw", { x: data.x, y: data.y });
//       }
//     });
//   });

//   socket.on("down", (data) => {
//     connections.forEach(con => {
//       if (con.id !== socket.id && con.rooms.has(data.roomId)) {
//         con.emit("ondown", { x: data.x, y: data.y });
//       }
//     });
//   });

//   socket.on("joinRoom", (newRoomId) => {
//     if (roomId) {
//       socket.leave(roomId);
//       if (connections.length) {

//         connections.forEach(con => {
//           console.log("a")
//           con.emit("joinRoom", roomId);
//           if (con.id !== socket.id) {
//             connections.push(socket);
//           }
//         });
//       } else {
//         connections.push(socket);
//       }
//       getConnections(connections.length);
//       return
//     } else {
//       roomId = newRoomId;
//       socket.join(roomId);
//       socket.rooms.add(roomId);
//       connections.push(socket);
//       getConnections(connections.length);
//       console.log("paso por 1ra vez")
//     }

//   });

//   socket.on("disconnect", () => {
//     console.log(`${socket.id} se ha desconectado`);
//     connections = connections.filter((con) => {
//       con.rooms.delete(roomId);
//       return con.id !== socket.id;
//     });
//   });
// });

// // Contador de conexiones

// let waitingClients = [];

// app.get('/conexiones', (req, res) => {
//   try {
//     waitingClients.push(res);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Errror al usar long polling: " });
//   }
// });

// async function getConnections(number) {
//   try {
//     console.log(number);
//     for (const res of waitingClients) {
//       res.status(200).json(number)
//     }

//     waitingClients = []
//   } catch (err) {
//     throw new Error(err.message)
//   }
// }

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


// Mensaje long polling 

const mensajes = [
  { id: 1, user: "monocoto", asunto: "Hola amigos :D", fecha: new Date().toLocaleString('es-MX', { hour12: true }) },
  { id: 2, user: "chesor3000", asunto: "Feliz navidad a todos", fecha: new Date().toLocaleString('es-MX', { hour12: true }) },
];

let resClientes = [];


app.post('/mensajes', (req, res) => {
  let idMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
  const mensaje = {
    id: idMensaje,
    user: req.body.user,
    asunto: req.body.asunto,
    fecha: new Date().toLocaleString('es-MX', { hour12: true })
  }
  mensajes.push(mensaje);
  responderClientes(mensaje);
  res.status(200).json({
    success: true
  })

})

app.get('/mensajes', (req, res) => {
  res.status(200).json({
    success: true,
    mensajes
  })
});

function responderClientes(mensaje) {
  for (res of resClientes) {
    res.status(200).json({
      success: true,
      mensaje
    });
  }
  resClientes = [];
}


app.get('/nuevo-mensaje', (req, res) => {
  resClientes.push(res);
  req.on('close', () => {
    const index = resClientes.length - 1; 
    resClientes = resClientes.slice(index, 1);
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


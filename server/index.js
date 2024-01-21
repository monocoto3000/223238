const express = require('express');
const cors = require('cors');
const app = express();

let httpServer = require("http").createServer(app);

app.use(cors());
app.use(express.json())

const mensajes = [
    { id: 1, user: "monocoto", asunto: "Hola amigos :D", fecha: new Date() },
    { id: 2, user: "chesor3000", asunto: "Feliz navidad a todos", fecha: new Date() },
];


app.post('/mensajes', (req, res) => {
  const idMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
  const mensaje = {
    id: idMensaje,
    user: req.body.user,
    asunto: req.body.asunto,
    fecha: new Date()
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


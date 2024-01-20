const mensajesUL = document.getElementById("mensajes");
let ultimoMensaje = 0;
function imprimirMensajes(mensajes) {
    console.log('Mensajes recibidos:', mensajes);

    for (mensaje of mensajes) {
        const li = document.createElement("li");
        li.innerText = `${mensaje.id} -  ${mensaje.user}  ${mensaje.asunto} `;
        mensajesUL.appendChild(li);
    }
}

function getMensajes() {
    fetch('http://localhost:3000/mensajes')
        .then(res => res.json())
        .then(data => {
            console.log('Respuesta del servidor (getMensajes):', data);

            const mensajes = data.mensajes;
            imprimirMensajes(mensajes);
            ultimoMensaje = mensajes.length > 0 ? mensajes[mensajes.length - 1].id : 0;
            getNewMensajes(3000);
        })
        .catch(console.log);
}

function getNewMensajes(interval) {
    fetch('http://localhost:3000/mensajes/update?idMensaje=' + ultimoMensaje)
        .then(resp => resp.json())
        .then(data => {
            console.log('Respuesta del servidor (getNewMensajes):', data);

            const mensajes = data.mensajes;
            imprimirMensajes(mensajes);
            if (mensajes.length > 0) {
                ultimoMensaje = mensajes[mensajes.length - 1].id;
            }
            setTimeout(() => getNewMensajes(interval), interval);
        })
        .catch(console.log);
}

function postearMensajes() {
    const usuario = document.getElementById("usuario").value
    const mensaje = document.getElementById("mensaje").value
    const postData = {
        user: usuario,
        asunto: mensaje
    };
    fetch('http://localhost:3000/mensajes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => console.error('Error:', error));
}
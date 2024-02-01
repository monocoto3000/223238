const mensajesUL = document.getElementById("mensajes");
let ultimoMensaje = 0;
const jwtSecret = "PalabraSecreta"


function randomColorGenerator() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function imprimirMensajes(mensajes) {
    mensajesUL.innerHTML = '';
    console.log('Mensajes recibidos:', mensajes);
    for (const mensaje of mensajes) {
        const li = document.createElement("li");
        const userColor = randomColorGenerator(); 
        li.innerHTML = `<span style="color: ${userColor}; font-weight: bold;">${mensaje.user}:</span> <span style="font-weight: bold;">${mensaje.asunto}</span></span> <span style="text-align: right; color: gray">${mensaje.fecha}</span>`;
        mensajesUL.appendChild(li);
    }
}


async function getMensajes() {
    const res = await fetch('http://localhost:3000/mensajes');
    const data = await res.json();
    console.log(data)
    if (data.mensajes.length > 0) {
        imprimirMensajes(data.mensajes);
    }
}

async function getNewMensaje() {
    try {
        const res = await fetch('http://localhost:3000/nuevo-mensaje');
        const data = await res.json();
        console.log(data);
        imprimirMensajes(data.mensaje);
    } catch (error) {
        console.log(error);
    } finally {
        getNewMensaje()
    }
}

(async () => {
    await getMensajes();
    getNewMensaje();
})();

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
            getMensajes()
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => console.error('Error:', error));
}


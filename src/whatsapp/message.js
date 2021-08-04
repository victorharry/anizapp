import personaStorage from '../personaStorage.js'

let client = {};

const sendPersona = (remittee, persona, message) => {
    // Caso nao tenha image, validar e enviar somente uma mensagem
    if (persona.sprites[0]) {
        client
            .sendImage(
                remittee,
                persona.sprites[0],
                persona.name,
                message
            )
            .then(() => {
                personaStorage.timerToMarry(persona)
            }).catch(err => {
                console.error(err)
            })
    } else {
        sendMessage(remittee, message)
    }
}

const sendMessage = (remittee, message, resolve = null) => {
    client
        .sendText(
            remittee,
            message
        ).then(() => {
            if(resolve) resvolve()
        })
        .catch(err => console.error(err))
}

const sendSticker = (remittee, image) => {
    client
        .sendImageAsSticker(remittee, image)
        .then((result) => { })
        .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
        });
}

const setClient = (clientT) => {
    client = clientT;
}


export { sendPersona, sendMessage, sendSticker, setClient }
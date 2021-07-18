const venom = require('venom-bot')
const axios = require('axios')
const schedule = require('node-schedule')
let roulettePersonas = []


venom
    .create(
        // options
        {
            folderNameToken: 'tokens', //folder name when saving tokens
            disableWelcome: false, // Will disable the welcoming message which appears in the beginning
        },
    )
    .then((client) => start(client))
    .catch((erro) => {
        console.error(erro);
    });

// Reset rolls timer
const rolls_timer = schedule.scheduleJob('*/30 * * * *', async () => {
    try {
        await axios.get('http://localhost:3000/user/reset/rolls')
    } catch (err) {
        console.error(err)
    }
});

// Reset marry timer
const marry_timer = schedule.scheduleJob('0 * * * *', async () => {
    try {
        await axios.get('http://localhost:3000/user/reset/marry')
    } catch (err) {
        console.error(err)
    }
});

const keepAlive = () => {
    // function to detect conflits and change status
    // Force it to keep the current session
    // Possible state values:
    // CONFLICT
    // CONNECTED
    // DEPRECATED_VERSION
    // OPENING
    // PAIRING
    // PROXYBLOCK
    // SMB_TOS_BLOCK
    // TIMEOUT
    // TOS_BLOCK
    // UNLAUNCHED
    // UNPAIRED
    // UNPAIRED_IDLE
    client.onStateChange((state) => {
        console.log('State changed: ', state);
        // force whatsapp take over
        if ('CONFLICT'.includes(state)) client.useHere();
        // detect disconnect on whatsapp
        if ('UNPAIRED'.includes(state)) console.log('logout');
    });

    // DISCONNECTED
    // SYNCING
    // RESUMING
    // CONNECTED
    let time = 0;
    client.onStreamChange((state) => {
        console.log('State Connection Stream: ' + state);
        clearTimeout(time);
        if (state === 'DISCONNECTED' || state === 'SYNCING') {
            time = setTimeout(() => {
                client.close();
            }, 80000);
        }
    });

    // function to detect incoming call
    client.onIncomingCall(async (call) => {
        console.log(call);
        client.sendText(call.peerJid, "Sorry, I still can't answer calls");
    });

}

async function start(client) {
    keepAlive()
    // client.onStreamChange((state) => {
    //     console.log('State Connection Stream: ' + state);
    // });

    client.onAnyMessage(async (message) => {
        try {
            if (message.chat.isGroup && message.chat.groupMetadata.owner === "553184374282@c.us") {
                const user = await verifyUser(message)
                let command = ''
                if (message.type == 'image') {
                    command = message.caption.match(/^\$\w*/g) ? message.caption.match(/^\$\w*/g)[0] : null
                } else {
                    command = message.body.match(/^\$\w*/g) ? message.body.match(/^\$\w*/g)[0] : null
                }
                switch (command) {
                    case '$rni':
                        sendPersona(client, message)
                        break
                    case '$r':
                        sendPersonaWithImage(client, message)
                        break
                    case '$s':
                        sendChosenPersona(client, message)
                        break
                    case '$marry':
                        marry(client, user, message)
                        break
                    case '$sticker':
                        transformToSticker(client, message)
                        break
                }
            }
        } catch (err) {
            console.error(err)
        }
    });
}

async function transformToSticker(client, message) {
    // Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
    // image path imageBase64 A valid gif and webp image is required. You can also send via http/https (http://www.website.com/img.gif)
    await client
        .sendImageAsSticker(message.chat.groupMetadata.id, message.body)
        .then((result) => { })
        .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
        });
}

async function verifyUser(message) {
    try {
        const user = await axios.post('http://localhost:3000/user/verify', message.sender)
        return user.data
    } catch (err) {
        console.error(err)
        return null
    }
}

async function sendPersonaWithImage(client, messageObject) {
    try {
        const userStatus = await axios.get(`http://localhost:3000/user/status/${messageObject.sender.id}`)
        if (userStatus.data.rolls > 0) {
            await axios.get(`http://localhost:3000/user/status/roll/${messageObject.sender.id}`)
            const persona = await axios.get(`http://localhost:3000/persona/roulette`)
            const verifyPersonaStatus = await axios.get(`http://localhost:3000/persona/status/${persona.data._id}`)
            const message = !verifyPersonaStatus.data ?
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n_$marry ${persona.data.name}_\n\n` + '```Roulette by:\n```' + `*${messageObject.sender.pushname}*`
                :
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n💍 Married with ${verifyPersonaStatus.data.name} 💍\n\n` + '```Roulette by:\n```' + `*${messageObject.sender.pushname}*`

            if (persona.data.sprites[0]) {
                client
                    .sendImage(
                        messageObject.chat.groupMetadata.id,
                        persona.data.sprites[0],
                        persona.name,
                        message
                    )
                    .then((result) => {
                        timerToMarry(persona.data)
                    }).catch(err => {
                        console.error(err)
                    })
            } else {
                sendPersona(client, messageObject) // GAMBS PARA FIX DE ERRO TEMPORARIO DE IMG NULA, ARRUMAR
            }
        } else {
            const message = `Você não possui rolls no momento ⌚ ${getMinutesUntilNextThirty()}m restantes`
            client
                .sendText(
                    messageObject.chat.groupMetadata.id,
                    message
                ).catch(err => console.error(err))
        }
    } catch (err) {
        console.error(err)
    }
}

async function sendPersona(client, messageObject) {
    try {
        const userStatus = await axios.get(`http://localhost:3000/user/status/${messageObject.sender.id}`)
        if (userStatus.data.rolls > 0) {
            await axios.get(`http://localhost:3000/user/status/roll/${messageObject.sender.id}`)
            const persona = await axios.get(`http://localhost:3000/persona/roulette`)
            const verifyPersonaStatus = await axios.get(`http://localhost:3000/persona/status/${persona.data._id}`)

            const message = !verifyPersonaStatus.data ?
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n_$marry ${persona.data.name}_\n\n` + '```Roulette by:\n```' + `*${messageObject.sender.pushname}*`
                :
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n💍 Married with ${verifyPersonaStatus.data.name} 💍\n\n` + '```Roulette by:\n```' + `*${messageObject.sender.pushname}*`

            client
                .sendText(
                    messageObject.chat.groupMetadata.id,
                    message
                )
                .then((result) => {
                    timerToMarry(persona.data)
                }).catch(err => console.error(err))
        } else {
            const message = `Você não possui rolls no momento ⌚ ${getMinutesUntilNextThirty()}m restantes`
            client
                .sendText(
                    messageObject.chat.groupMetadata.id,
                    message
                ).catch(err => console.error(err))
        }
    } catch (err) {
        console.error(err)
    }
}

async function sendChosenPersona(client, messageObject) {
    try {
        const personaName = messageObject.body.replace('$s', '').trim()
        const queryPersona = { name: personaName }
        const persona = await axios.post(`http://localhost:3000/persona/search`, queryPersona)
        const verifyPersonaStatus = await axios.get(`http://localhost:3000/persona/status/${persona.data._id}`)
        const message = !verifyPersonaStatus.data ?
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n` + '```Requested by:\n```' + `*${messageObject.sender.pushname}*`
            :
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n💍 Married with *${verifyPersonaStatus.data.name}* 💍\n\n` + '```Requested by:\n```' + `*${messageObject.sender.pushname}*`
        if (persona.data) {
            client
                .sendImage(
                    messageObject.chat.groupMetadata.id,
                    persona.data.sprites[0],
                    persona.name,
                    message
                )
        } else {
            client.sendText(messageObject.chat.groupMetadata.id, `❌ *${queryPersona.name} não encontrado* ❌`)
        }
    } catch (err) {
        console.error(err)
    }
}

async function marry(client, user, messageObject) {
    const userStatus = await axios.get(`http://localhost:3000/user/status/${messageObject.sender.id}`)
    if (userStatus.data.marry) {
        try {
            const requestedPersona = messageObject.body.replace('$marry', '').trim()
            const persona = roulettePersonas.find(persona => persona.name === requestedPersona)
            if (persona) {
                await axios.post('http://localhost:3000/persona/marry', { user_id: user._id, persona_id: persona.id })
                const index = roulettePersonas.findIndex(persona => persona.id == 'persona._id')
                roulettePersonas.splice(index, 1)
                feedBack(client, messageObject.chat.groupMetadata.id, `💍 *${user.name}* married *${persona.name}* 💍`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        const message = `Você não pode se casar no momento ⌚ ${getMinutesUntilNextHour()}m restantes`
        client
            .sendText(
                messageObject.chat.groupMetadata.id,
                message
            ).catch(err => console.error(err))
    }
}

function timerToMarry(persona) {
    roulettePersonas.push({ id: persona._id, name: persona.name })
    setTimeout(() => {
        const index = roulettePersonas.findIndex(persona => persona.id == 'persona._id')
        roulettePersonas.splice(index, 1)
    }, 25000);
}

function feedBack(client, where, message) {
    client
        .sendText(
            where,
            message
        )
}

function getMinutesUntilNextHour() { return 60 - new Date().getMinutes() }

function getMinutesUntilNextThirty() {
    if (0 >= (30 - new Date().getMinutes())) return 60 - new Date().getMinutes();
    return 30 - new Date().getMinutes()
}
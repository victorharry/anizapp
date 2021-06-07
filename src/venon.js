const venom = require('venom-bot');
const axios = require('axios')
let roulettePersonas = []

venom
    .create(
        // options
        {
            folderNameToken: 'tokens', //folder name when saving tokens
            mkdirFolderToken: '../tokens', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
            disableWelcome: true, // Will disable the welcoming message which appears in the beginning
            createPathFileToken: true, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
        },
    )
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

async function start(client) {
    client.onMessage(async (message) => {
        if (verifyUser(message) && message.chat.groupMetadata.owner === "553184374282@c.us") {
            const command = message.body.match(/^\$\w*/g) ? message.body.match(/^\$\w*/g)[0] : null
            switch (command) {
                case '$mni':
                    sendPersona(client, message)
                    break
                case '$m':
                    sendPersonaWithImage(client, message)
                    break
                case '$im':
                    sendChosenPersona(client, message)
                    break
            }
        }
    });
}

async function verifyUser(message) {
    try {
        await axios.post('http://localhost:3000/user/verify', message.sender)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

async function sendPersonaWithImage(client, message) {
    const persona = await axios.get(`http://localhost:3000/persona/roulette`);
    client
        .sendImage(
            message.chat.groupMetadata.id,
            persona.data.sprites[0],
            persona.name,
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n_$marry ${persona.data.name}_\n\n` + '```Roulette by:\n```' + `*${message.sender.pushname}*`
        )
        .then((result) => {
            timerToMarry(persona.data)
        })
        .catch((erro) => {
            // console.error('Error when sending: ', erro);
        });
}

async function sendPersona(client, message) {
    const persona = await axios.get(`http://localhost:3000/persona/roulette`);

    client
        .sendText(
            message.chat.groupMetadata.id,
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n_$marry ${persona.data.name}_\n\n` + '```Roulette by:\n```' + `*${message.sender.pushname}*`
        )
        .then((result) => {
            timerToMarry(persona.data)
        })
        .catch((erro) => {
            //console.error('Error when sending: ', erro); //return object error
        });
}

async function sendChosenPersona(client, message) {
    const queryPersona = { name: message.body.replace('$im', '').trim() }
    const persona = await axios.post(`http://localhost:3000/persona/search`, queryPersona)

    if (persona.data) {
        client
            .sendImage(
                message.chat.groupMetadata.id,
                persona.data.sprites[0],
                persona.name,
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n` + '```Requested by:\n```' + `*${message.sender.pushname}*`
            )
            .then((result) => {
                // console.log('Result: ', result);
            })
            .catch((erro) => {
                // console.error('Error when sending: ', erro);
            });
    } else {
        client
            .sendText(message.from, `❌ *${queryPersona.name} não encontrado* ❌`)
            .then((result) => {
                //console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                //console.error('Error when sending: ', erro); //return object error
            });
    }
}

function timerToMarry(persona) {
    roulettePersonas.push(persona._id)
    setTimeout(() => {
        const index = roulettePersonas.findIndex(element => element == 'persona._id')
        roulettePersonas.splice( index, 1)
    }, 10000);
}
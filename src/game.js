import { sendPersona, sendMessage, sendSticker } from './whatsapp/message.js'
import personaStorage from './personaStorage.js'
import createTradeOffersStorage from './tradeOffersStorage.js'
import axios from 'axios';

function getMinutesUntilNextThirty() {
    if (0 >= (30 - new Date().getMinutes())) return 60 - new Date().getMinutes();
    return 30 - new Date().getMinutes()
}

function getMinutesUntilNextHour() {
    return 60 - new Date().getMinutes()
}

async function sendChosenPersona(sender, group_id, personaName) {
    try {
        const queryPersona = { name: personaName }
        const persona = await axios.post(`${process.env.BASE_URI}/persona/search`, queryPersona)
        const married = await axios.get(`${process.env.BASE_URI}/persona/status/${persona.data._id}`)
        const user = married.data ? await verifyUser({ id: married.data.user_id }) : null
        const message = !married.data ?
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n` + '```Requested by:\n```' + `*${sender.pushname}*`
            :
            `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n💍 Married with *${user.name}* 💍\n\n` + '```Requested by:\n```' + `*${sender.pushname}*`
        if (persona.data) {
            sendPersona(group_id, persona.data, message)
        } else {
            sendMessage(group_id, `❌ *${queryPersona.name} não encontrado* ❌`)
        }
    } catch (err) {
        console.error(err)
    }
}

async function sendGameRules(sender, group_id) {
    const message = "*Regras do Jogo 📖*\n\nOs jogadores devem roletar personagens para tomar posse dos seus favoritos ou de seus inimigos para oferecer uma futura troca ⚔️\n\n_*Comandos:*_\n\n*$r* _roleta um personagem mandando junto sua imagem_\n*$rni* _roleta um personagem sem mandar sua imagem_\n*$s [PERSONAGEM]* _procura pelo personagem solicitado_\n*$marry [PERSONAGEM]* _após roletar um personagem você tem 25 segundos para se casar com aquele personagem_\n*$help* _você receberá esta mensagem de ajuda_"
    sendMessage(sender.id, message)
    sendMessage(group_id, `Regras enviadas no privado *${sender.pushname}*`)
}

async function marry(sender, group_id, requestedPersona) {
    const userStatus = await axios.get(`${process.env.BASE_URI}/user/status/${sender.id}`)
    if (userStatus.data.marry) {
        try {
            const persona = personaStorage.roulettePersonas.find(persona => persona.name === requestedPersona)
            if (persona) {
                await axios.post(`${process.env.BASE_URI}/persona/marry`, { user_id: sender.id, persona_id: persona.id })
                const index = personaStorage.roulettePersonas.findIndex(persona => persona.id == 'persona._id')
                personaStorage.removePersona(index)
                sendMessage(group_id, `💍 *${sender.pushname}* casou com *${persona.name}* 💍`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        sendMessage(group_id, `Você não pode se casar no momento ⌚ ${getMinutesUntilNextHour()}m restantes`)
    }
}

async function getPersonaWithImage(sender, group_id) {
    try {
        const userStatus = await axios.get(`${process.env.BASE_URI}/user/status/${sender.id}`)
        if (userStatus.data.rolls > 0) {
            await axios.get(`${process.env.BASE_URI}/user/status/roll/${sender.id}`)
            const persona = await axios.get(`${process.env.BASE_URI}/persona/roulette`)
            const married = await axios.get(`${process.env.BASE_URI}/persona/status/${persona.data._id}`)
            const message = married ?
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n` + '```Roulette by:\n```' + `*${sender.pushname}*`
                :
                `❤️ *${persona.name}* ❤️\n\n${persona.data.title}\n\n💍 Married with ${married.name} 💍\n\n` + '```Roulette by:\n```' + `*${sender.pushname}*`
            sendPersona(group_id, persona.data, message)
        } else {
            sendMessage(group_id, `Você não possui rolls no momento ⌚ ${getMinutesUntilNextThirty()}m restantes`)
        }
    } catch (err) {
        console.error(err)
    }
}

async function getPersonaWithoutImage(sender, group_id) {
    try {
        const userStatus = await axios.get(`${process.env.BASE_URI}/user/status/${sender.id}`)
        if (userStatus.data.rolls > 0) {
            await axios.get(`${process.env.BASE_URI}/user/status/roll/${sender.id}`)
            const persona = await axios.get(`${process.env.BASE_URI}/persona/roulette`)
            const married = await axios.get(`${process.env.BASE_URI}/persona/status/${persona.data._id}`)
            const message = married ?
                `❤️ *${persona.data.name}* ❤️\n\n${persona.data.title}\n\n` + '```Roulette by:\n```' + `*${sender.pushname}*`
                :
                `❤️ *${persona.name}* ❤️\n\n${persona.title}\n\n💍 Married with ${married.name} 💍\n\n` + '```Roulette by:\n```' + `*${sender.pushname}*`
            sendMessage(group_id, message, personaStorage.timerToMarry(persona.data))
        } else {
            sendMessage(group_id, `Você não possui rolls no momento ⌚ ${getMinutesUntilNextThirty()}m restantes`)
        }
    } catch (err) {
        console.error(err)
    }
}

const verifyUser = async (sender) => {
    try {
        const user = await axios.post(`${process.env.BASE_URI}/user/verify`, sender)
        return user.data
    } catch (error) {
        console.error(error)
    }
}

async function tradePersona(sender, group_id, personaName, remittee) {
    try {
        const queryPersona = { name: personaName }
        const persona = await axios.post(`${process.env.BASE_URI}/persona/search`, queryPersona)
        const married = await axios.get(`${process.env.BASE_URI}/persona/status/${persona.data._id}`)
        if (married.data && sender.id == married.data.user_id) {
            const offer = createTradeOffersStorage.tradeOffers.find(offer => offer.remittee_id === sender.id)
            let remitteeInfo = ''
            if (offer) {
                remitteeInfo = await verifyUser({ id: offer.sender_id })
                const message = `*${remitteeInfo.name}*, *${sender.pushname}* ofereceu *${persona.data.name}*. Digite *$sim* para confirmar a troca👥`
                sendMessage(group_id, message, createTradeOffersStorage.timerToTrade(sender.id, persona.data._id, `${remittee}@c.us`, offer.persona_id))
            } else {
                remitteeInfo = await verifyUser({ id: `${remittee}@c.us` })
                const message = `*${remitteeInfo.name}*, *${sender.pushname}* gostaria de trocar *${persona.data.name}* com você. 👥`
                sendMessage(group_id, message, createTradeOffersStorage.timerToTrade(sender.id, persona.data._id, `${remittee}@c.us`))
            }
        }
    } catch (err) {
        console.error(err)
    }
}

const confirmTrade = async (sender, group_id) => {
    try {
        const offer = createTradeOffersStorage.tradeOffers.find(offer => offer.remittee_id === sender.id && offer.remittee_persona)
        const tradeInfo = { sender: { id: offer.sender_id, persona_id: offer.persona_id }, remittee: { id: offer.remittee_id, persona_id: offer.remittee_persona } }
        await axios.put(`${process.env.BASE_URI}/persona/trade`, tradeInfo)
        const message = 'Troca feita com sucesso 🤝'
        sendMessage(group_id, message)
    } catch (error) {
        console.error(error)
    }
}

const createGame = () => {
    // Refatorar esse switch horroroso
    async function inputCommand(messageObject) {
        await verifyUser(messageObject.sender)
        let formatted_command = ''
        if (messageObject.type == 'image') {
            formatted_command = messageObject.caption.match(/^\$\w*/g) ? messageObject.caption.match(/^\$\w*/g)[0] : null
        } else {
            formatted_command = messageObject.body.match(/^\$\w*/g) ? messageObject.body.match(/^\$\w*/g)[0] : null;
        }
        switch (formatted_command) {
            case '$rni':
                getPersonaWithoutImage(messageObject.sender, messageObject.chat.groupMetadata.id)
                break
            case '$r':
                getPersonaWithImage(messageObject.sender, messageObject.chat.groupMetadata.id);
                break
            case '$s':
                const personaName = messageObject.body.replace('$s', '').trim()
                sendChosenPersona(messageObject.sender, messageObject.chat.groupMetadata.id, personaName)
                break
            case '$marry':
                const requestedPersona = messageObject.quotedMsgObj.caption ? messageObject.quotedMsgObj.caption.match(/(?<=\❤️ \*)(.*?)(?=\* ❤️)/g)[0] : messageObject.quotedMsg.body.match(/(?<=\❤️ \*)(.*?)(?=\* ❤️)/g)[0];
                marry(messageObject.sender, messageObject.chat.groupMetadata.id, requestedPersona)
                break
            case '$trade':
                const trade = messageObject.body.split(' ')
                tradePersona(messageObject.sender, messageObject.chat.groupMetadata.id, trade[1], trade[2].replace('@', ''))
                break
            case '$help':
                sendGameRules(messageObject.sender, messageObject.chat.groupMetadata.id)
                break
            case '$sim':
                confirmTrade(messageObject.sender, messageObject.chat.groupMetadata.id)
                break
            // case '$sticker': // Revisar problemas
            //     sendSticker(messageObject.chat.groupMetadata.id, messageObject.body);
            //     break
        }
    }

    return {
        inputCommand
    }
}

const game = createGame()

export default game
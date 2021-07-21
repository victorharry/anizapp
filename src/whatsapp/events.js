import game from '../game.js'

const events = (client) => {
    // Prevents Venom from losing current session after time
    // [START]
    client.onStateChange((state) => {
        console.log(state)
        // force whatsapp take over
        if ('CONFLICT'.includes(state)) client.useHere();
        // detect disconnect on whatsapp
        if ('UNPAIRED'.includes(state)) console.log('logout');
    });
    
    let time = 0;
    client.onStreamChange((state) => {
        console.log(state)
        clearTimeout(time);
        if (state === 'DISCONNECTED' || state === 'SYNCING') {
            time = setTimeout(() => {
                client.close();
            }, 80000);
        }
    });
    // [END]

    // Detect incoming messages from Whatsapp
    client.onAnyMessage(async (message) => {
        if (message.chat.isGroup && message.chat.groupMetadata.owner === "553184374282@c.us") {
            game.inputCommand(message)
        }
    })
}

export default events
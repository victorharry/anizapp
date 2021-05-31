const venom = require('venom-bot');
const { dockStart } = require('@nlpjs/basic');

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    client.onMessage((message) => {
        if (message.body.length > 1 && message.isGroupMsg === false && !message.chat.contact.isBusiness && message.sender.name != "Amor") {
            (async () => {
                const dock = await dockStart();
                const nlp = dock.get('nlp');
                const response = await nlp.process('pt', message.body);
                console.log(response);
                if (response.answer) {
                    client
                        .sendText(message.from, response.answer)
                        .then((result) => {
                            //console.log('Result: ', result); //return object success
                        })
                        .catch((erro) => {
                            //console.error('Error when sending: ', erro); //return object error
                        });
                }
            })();
        }
    });
}
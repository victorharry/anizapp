const venom = require('venom-bot');
const axios = require('axios')

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

function start(client) {
    client.onMessage(async (message) => {
        console.log(message)
        if (message.body == "$m") {
            const persona = await axios.get(`http://localhost:3000/roulette`);
            (async () => {
                await client
                    .sendImage(
                        // message.chat.groupMetadata.id,
                        message.from,
                        persona.data.sprites[0],
                        persona.data.name,
                        `❤️ ${persona.data.name} ❤️\n\n *_$marry ${persona.data.name}_* \n\n` + '```Roulette by:\n```' + `*${message.sender.pushname}*` 
                    )
                    .then((result) => {
                        console.log('Result: ', result);
                    })
                    .catch((erro) => {
                        console.error('Error when sending: ', erro);
                    });
            })();
        }
    });
}
// (async () => {
//     const dock = await dockStart();
//     const nlp = dock.get('nlp');
//     const response = await nlp.process('pt', message.body);
//     console.log(response);
//     if (response.answer) {
//         client
//             .sendText(message.from, response.answer)
//             .then((result) => {
//                 //console.log('Result: ', result); //return object success
//             })
//             .catch((erro) => {
//                 //console.error('Error when sending: ', erro); //return object error
//             });
//     }
// })();
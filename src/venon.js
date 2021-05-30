const venom = require('venom-bot');
const { dockStart } = require('@nlpjs/basic');

venom
    .create(
        {
            folderNameToken: 'tokens', //folder name when saving tokens
            headless: true, // Headless chrome
            devtools: false, // Open devtools by default
            useChrome: true, // If false will use Chromium instance
            debug: false, // Opens a debug session
            logQR: true, // Logs QR automatically in terminal
            browserWS: '', // If u want to use browserWSEndpoint
            browserArgs: [''], //Original parameters  ---Parameters to be added into the chrome browser instance
            puppeteerOptions: {
                executablePath: '/usr/bin/chromium-browser',
            },
            disableSpins: false, // Will disable Spinnies animation, useful for containers (docker) for a better log
            disableWelcome: false, // Will disable the welcoming message which appears in the beginning
            updatesLog: true, // Logs info updates automatically in terminal
            createPathFileToken: true, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
          },
    )
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    client.onMessage( (message) => {
        if (message.body.length > 1 && message.isGroupMsg === false) {
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
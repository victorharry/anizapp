const express = require('express')
const app = express()

app.use(express.json())

require('./venon');
require('./controllers/personaController')(app);
require('./controllers/userController')(app);

app.use(function(req, res, next) {
    res.status(404).send("Rota invalida")
});

app.listen(3000);
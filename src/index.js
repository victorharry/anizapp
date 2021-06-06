const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

require('./venon');
require('./controllers/mhwController')(app);


app.use(function(req, res, next) {
    res.status(404).send("Rota invalida")
});

app.listen(3000);
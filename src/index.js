var express = require('express')
var venon = require('./venon')
var app = express()

app.use(function(req, res, next) {
    res.status(404).send("Rota invalida")
});

app.listen(3000, function () {
    console.log('Listening on port 3000.')
});

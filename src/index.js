var express = require('express')
var app = express()

require('./venon');
require('./controllers/mhwController')(app);

app.use(function(req, res, next) {
    res.status(404).send("Rota invalida")
});

app.listen(3000, function () {
    console.log('Listening on port 3000.')
});
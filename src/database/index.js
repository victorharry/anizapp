const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mhw', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`All Husbandos and Waifus ready! 👰‍♀️🤵\n`)
});

module.exports = mongoose;


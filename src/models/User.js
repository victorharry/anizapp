const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    phone: {
        type: String,
        require: true
    },
})

const User = mongoose.model('Users', UserSchema);

module.exports = User;
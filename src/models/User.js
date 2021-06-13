const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },

    name: {
        type: String,
        require: true
    },
})

const User = mongoose.model('Users', UserSchema);

module.exports = User;
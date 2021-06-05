const mongoose = require('../database');

const PersonaSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    title: {
        type: String,
        require: true
    },

    gender: {
        type: String,
        require: true
    },

    sprites: {
        type: [String],
        require: true
    },

    roulettes: {
        type: [String],
    }
})

const Persona = mongoose.model('Personas', PersonaSchema);

module.exports = Persona;
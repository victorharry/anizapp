const mongoose = require('../database') , Schema = mongoose.Schema;
const User = require('./User');
const Persona = require('./Persona');

const UserPersonaSchema = new Schema({
    user_id: {
        type: String, 
        ref: 'User' 
    },

    persona_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Persona' 
    },
})

const UserPersona = mongoose.model('users_personas', UserPersonaSchema);

module.exports = UserPersona;
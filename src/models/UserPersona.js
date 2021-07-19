import mongoose from '../database/mongoose.js';

const Schema = mongoose.Schema;

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

export default UserPersona;
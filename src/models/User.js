import mongoose from '../database/mongoose.js';

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

export default User;
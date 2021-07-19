import mongoose from '../database/mongoose.js';

const Schema = mongoose.Schema;

const UserStatusSchema = new Schema({
    user_id: { 
        type: String, 
        ref: 'User'
    },

    rolls: {
        type: Number,
        require: true,
        default: 10
    },

    marry: {
        type: Boolean,
        require: true,
        default: true
    },
})

const UserStatus = mongoose.model('users_statuses', UserStatusSchema);

export default UserStatus;
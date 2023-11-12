import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String
    },
    
    // posts: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Post',
    //     default: []
    // }],

}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

export {
    User
}
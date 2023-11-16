import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        default: []
    }],
    reposted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        default: []
    }],
    viewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        default: []
    }],
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
export {
    User
}


const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    views: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    image: {
        type: String
    }

}, {
    timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

export {
    Post
}
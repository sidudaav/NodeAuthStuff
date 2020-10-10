const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
    },
    password: {
        type: String,
        required: [true, "can't be blank"],
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastActiveAt: {
        type: Date
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User
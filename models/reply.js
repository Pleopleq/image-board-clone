const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        minlength: 4,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply
const mongoose = require('mongoose')

const replySchema = mongoose.Schema({
    author: String,
    message: {
        type: String,
        minlength: 4
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

replySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Reply', replySchema)
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    author: String,
    replies: Array
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Post', postSchema)
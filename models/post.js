const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        require: true,
    },
    content: {
        type: String, 
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    },
    postImage: String,
    replies:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
})


const Post = mongoose.model('Post', postSchema)

module.exports = Post
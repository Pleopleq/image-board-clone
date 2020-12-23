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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

postSchema.virtual("replies", {
    ref: "Reply",
    localField: "_id",
    foreignField: "insideOf"
})


const Post = mongoose.model('Post', postSchema)

module.exports = Post
const repliesRouter = require('express').Router()
const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')


repliesRouter.get('/api/replies/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const returnedPost = await Post.findById(postId).populate('replies', { author: 1, message: 1, likes: 1})
        res.status(400).json(returnedPost.replies).end()
    } catch (error) {
        console.log(error)
    }
})

repliesRouter.post('/api/replies/:id', async (req, res) => {
    try {
        const body = req.body
        const token = getTokenFrom(req)
        const postId = req.params.id

        const repliedPost = await Post.findById(postId)

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' }).end()
        }

        const user = await User.findById(decodedToken.id)

        const reply = new Reply({
            author: user.username,
            message: body.message,
            likes: 0,
            user: user._id
        })

        const savedReply = await reply.save()
        repliedPost.replies = repliedPost.replies.concat(savedReply)
        await repliedPost.save()
        res.status(201).json(savedReply).end()
    } catch (error) {
        console.log(error)
    }
})



module.exports = repliesRouter
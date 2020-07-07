const repliesRouter = require('express').Router()
const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')


repliesRouter.get('/api/replies/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const returnedPost = await Post.findById(postId).populate('replies', { author: 1, message: 1 })
        res.status(400).json(returnedPost.replies).end()
    } catch (error) {
        console.log(error)
    }
})

repliesRouter.post('/api/replies/:id', async (req, res) => {
    try {
        const message = req.body.message.trim()
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
            message: message,
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

repliesRouter.put('/api/replies/:id', async (req, res) => {
    try {
        const id = req.params.id
        const message = req.body.message.trim()
        await Reply.findByIdAndUpdate(id, { message: message })
        res.status(201).json().end()
    } catch (error) {
        console.log(error)
    }
})

repliesRouter.delete('/api/replies/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Reply.findByIdAndRemove(id)
        res.status(204).end()
    } catch (error) {
        console.log(error)
    }
})


module.exports = repliesRouter
const repliesRouter = require('express').Router()
const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/middlewares')
const getTokenFrom = require('../utils/getTokenFrom')


repliesRouter.get('/api/replies/:id', async (req, res) => {
    try {
        const postId = req.params.id
        if(postId){
            const returnedPost = await Post.findById(postId).populate('replies', { author: 1, message: 1 })
            return res.status(200).json(returnedPost.replies).end()
        } else {
            return 
        }
        
    } catch (error) {
        console.log(error)
        return res.status(404).send({error: 'something went wrong'}).end()
    }
})

repliesRouter.post('/api/replies/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const token = getTokenFrom(req)
        const message = req.body.message.trim()

        const repliedPost = await Post.findById(postId)

        const decodedToken = jwt.verify(token, process.env.SECRET)

        const user = await User.findById(decodedToken.id)

        const reply = new Reply({
            author: user.username,
            message: message,
            user: user._id
        })

        const savedReply = await reply.save()
        repliedPost.replies = repliedPost.replies.concat(savedReply)
        await repliedPost.save()
        return res.status(201).json(savedReply).end()
    } catch (error) {
        console.log(error)
        return res.status(404).send({error: 'something went wrong'}).end()
    }
})

repliesRouter.put('/api/replies/:id', async (req, res) => {
    try {
        const id = req.params.id
        const message = req.body.message.trim()
        await Reply.findByIdAndUpdate(id, { message: message })
        return res.status(201).send({sucess: 'Comment has been edited.'}).json().end()
    } catch (error) {
        console.log(error)
        return res.status(404).send({error: 'something went wrong'}).end()
    }
})

repliesRouter.delete('/api/replies/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Reply.findByIdAndRemove(id)
        return res.status(204).send({sucess: 'Comment has been deleted.'}).end()
    } catch (error) {
        console.log(error)
        return res.status(404).send({error: 'something went wrong'}).end()
    }
})


module.exports = repliesRouter
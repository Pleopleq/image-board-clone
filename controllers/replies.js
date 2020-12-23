const repliesRouter = require('express').Router()
const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const { auth } = require('../middleware/middlewares')
const { post } = require('./posts')


repliesRouter.get('/api/replies/:id', async (req, res) => {
    const postId = req.params.id
    try {
        const returnedPost = await Reply.find({ insideOf: postId })
        if(!returnedPost){
            res.status(404).end()
        }
        res.send(returnedPost)

    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'something went wrong' })
    }
})

repliesRouter.post('/api/replies/:id', auth, async (req, res) => {
    const postId = req.params.id
    try {
        const repliedPost = await Post.findOne({ _id:postId })

        if(!repliedPost) {
            return res.status(404).end()
        }

        const newReply = new Reply({
        author: req.user.username,
        message: req.body.message,
        owner: req.user._id,
        insideOf: postId
        })

        await newReply.save()
        res.status(201).send(newReply) 
    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'something went wrong' })
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
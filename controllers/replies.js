const repliesRouter = require('express').Router()
const Reply = require('../models/reply')
const Post = require('../models/post')
const allowedUpdates = require('../utils/allowedUpdates')
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

repliesRouter.patch('/api/replies/:id', auth ,async (req, res) => {
    const replyId = req.params.id
    const updates = ["message"]
    const isAllowed = allowedUpdates(req.body, updates)
    
    if(!isAllowed){
        return res.status(400).send({ error: "Invalid Updates" })
    }
    try {
        const updatedReply = await Reply.findOne({ _id: replyId, owner: req.user._id })
        
        if(!updatedReply){
            return res.status(404).send().end()
        }

        updates.forEach(update => updatedReply[update] = req.body[update])
        await updatedReply.save()
        
        return res.send(updatedReply)
    } catch (error) {
        console.log(error)
        return res.status(404).send({ error: 'something went wrong' })
    }
})

repliesRouter.delete('/api/replies/:id', auth, async (req, res) => {
    try {
        const replyId = req.params.id
        const deletedReply = await Reply.findByIdAndDelete({ _id: replyId, owner: req.user._id })

        if(!deletedReply) {
            return res.status(404).send()
        }

        res.send(deletedReply)
    } catch (error) {
        console.log(error)
        return res.status(404).send({ error: 'something went wrong' })
    }
})


module.exports = repliesRouter
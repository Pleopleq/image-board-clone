const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')



const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.SECRET)
        const authUser = await User.findOne({ _id: decoded._id, "tokens.token": token })
        if(!authUser) {
            throw new Error()
        }
        req.token = token
        req.user = authUser
        next()
    } catch (error) {
        res.status(401).send({ error: "Please authenticate."})
    }
}

const checkPostOwnership = async (req, res, next) => {
try {
    const postId = req.params.id
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const postToCheck = await Post.findById(postId)

    if(JSON.stringify(user._id) === JSON.stringify(postToCheck.user)){
        next()
    } else {
        res.status(404).json({ error: 'You dont have permission to do this' }).end()
    }
} catch (error) {
        console.log(error)
    }
}

const checkCommentOwnership = async (req, res, next) => {
    try {
        const replyId = req.params.id
        const token = getTokenFrom(req)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const replyToCheck = await Reply.findById(replyId)
        const user = await User.findById(decodedToken.id)

        if(JSON.stringify(user._id) === JSON.stringify(replyToCheck.user)){
             next()
        } else {
             res.status(404).json({ error: 'You dont have permission to do this' }).end()
        }
    } catch (error) {
        console.log(error)
    }
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {auth}
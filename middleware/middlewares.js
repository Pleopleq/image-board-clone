const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')
const middlewareObj = {}


middlewareObj.isLoggedIn = (req, res, next) => {
    const token = getTokenFrom(req)
    if (!token) {
       res.status(404).json({ error: 'You have to be logged in to do this' }).end()
    }
    next()
}

middlewareObj.checkPostOwnership = async (req, res, next) => {
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

middlewareObj.checkCommentOwnership = async (req, res, next) => {
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

middlewareObj.unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
middlewareObj.errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }
    next(error)
}

module.exports = middlewareObj
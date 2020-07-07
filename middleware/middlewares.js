const Post = require('../models/post')
const Reply = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')
const middlewareObj = {}

middlewareObj.checkPostOwnership = async (req, res, next) => {
try {
    const postId = req.params.id
    const token = getTokenFrom(req)
    if (!token) {
        return res.status(401).json({ error: 'You have to be logged in to do this' })
    } 
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const foundPost = user.posts.find(elem => elem == postId)
    if(foundPost == postId){
        next()
    } else {
        return res.status(404).json({ error: 'You dont have permission to do this' })
    }
} catch (error) {
        console.log(error)
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    const token = getTokenFrom(req)
    if (!token) {
        res.status(401).json({ error: 'You have to be logged in to do this' })
    } else {
        return next()
    }
}

module.exports = middlewareObj
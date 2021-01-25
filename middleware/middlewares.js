const Reply = require('../models/reply')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

module.exports = {auth}
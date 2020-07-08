const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/api/login', async (req, res) => {
    try {
    const body = req.body

    const user = await User.findOne( { username: body.username } )
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordCorrect)){
        return res.status(401).json({
            error: 'invalid username or password'
        }).end()
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    return res.status(200).send({ token, username: user.username }).end()
    } catch (error) {
        console.log(error)
    }
})

module.exports = loginRouter
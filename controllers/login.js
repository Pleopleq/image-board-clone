const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/api/login', async (req, res) => {
    try {
    const userData = req.body

    const loggedUser = await User.findByCredentials(userData.username, userData.password)
    console.log(loggedUser)
    const token = await loggedUser.generateAuthToken()
    
    res.send({ loggedUser, token})
    } catch (error) {
    res.status(404).send({ error: 'Unable to log in.' })
    }
})

module.exports = loginRouter
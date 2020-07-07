const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (req, res) => {
    try {
        const username = req.body.username.trim()
        const password = req.body.password.trim()
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
    
        const user = new User({
            username: username,
            passwordHash
        })
    
        const savedUser = await user.save()

        res.status(200).json(savedUser).end()
    } catch (error) {
        console.log(error)
    }
})

usersRouter.get('/api/users', async (req, res) => {
    try {
    const users = await User.find({}).populate('posts', { title: 1, content: 1, likes: 1})
    res.status(200).json(users.map(elem => elem.toJSON())).end()
    } catch (error) {
        console.log(error)
    }
})


module.exports = usersRouter
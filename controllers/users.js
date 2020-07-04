const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (req, res) => {
    try {
        const body = req.body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
        const user = new User({
            username: body.username,
            passwordHash
        })
    
        const savedUser = await user.save()

        res.json(savedUser)
    } catch (error) {
        console.log(error)
    }
})

usersRouter.get('/api/users', async (req, res) => {
    const users = await User.find({}).populate('posts', { title: 1, content: 1, likes: 1})
    res.json(users.map(elem => elem.toJSON()))
})


module.exports = usersRouter
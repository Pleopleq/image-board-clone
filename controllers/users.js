const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (req, res) => {
    try {
        const username = req.body.username.trim()
        const password = req.body.password.trim()
        
        const newUser = new User({
            username,
            password
        })

        await newUser.save()

        res.status(201).send(newUser)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

usersRouter.get('/api/users', async (req, res) => {
    try {
    const users = await User.find({}).populate('posts', { title: 1, content: 1, likes: 1})
    return res.status(200).json(users.map(elem => elem.toJSON())).end()
    } catch (error) {
        console.log(error)
        return res.status(404).send({error: 'something went wrong'}).end()
    }
})


module.exports = usersRouter
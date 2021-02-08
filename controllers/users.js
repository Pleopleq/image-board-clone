const usersRouter = require('express').Router()
const { auth } = require('../middleware/middlewares')
const sharp = require("sharp")
const upload = require('../utils/multerConfig')
const User = require('../models/user')

usersRouter.post('/api/users', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        
        const newUser = new User({
            username,
            password, 
            avatar: "",
            description: ""
        })

        await newUser.save()
        const token = await newUser.generateAuthToken()

        res.status(201).send({ newUser, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

usersRouter.get('/api/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user){
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)
        
    } catch (error) {
        res.status(404).send().end()
    }
})

usersRouter.post('/api/users/profile/avatar', auth, upload.single("avatar"), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width:350 , height:350 }).png().toBuffer()
        req.user.avatar = buffer

        await req.user.save()
        res.status(200).end()
    } catch (error) {
        console.error(error)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

usersRouter.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}).populate('posts', { title: 1, content: 1, likes: 1})
        res.status(200).send(users.map(elem => elem.toJSON()))
    } catch (error) {
        res.status(404).send({ error: 'something went wrong' })
    }
})


module.exports = usersRouter
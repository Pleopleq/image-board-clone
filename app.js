const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const repliesRouter = require('./controllers/replies')
const mongoose = require('mongoose')
app.use('/uploads', express.static('uploads'))
app.use(express.static('build'))
app.use(express.json())
app.use( postsRouter )
app.use( repliesRouter )
app.use( loginRouter )
app.use( usersRouter )
app.use(cors())

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB: ', error.message)
    })

module.exports = app
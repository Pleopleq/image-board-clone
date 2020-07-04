const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const mongoose = require('mongoose')
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.static('build'))
app.use(express.json())
app.use( postsRouter )
app.use( loginRouter )
app.use( usersRouter )

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB: ', error.message)
    })

module.exports = app
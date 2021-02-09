const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const repliesRouter = require('./controllers/replies')
app.use(cors())
app.use(express.static('public'))
app.use(express.static('build'))
app.use(express.json())
app.use( postsRouter )
app.use( repliesRouter )
app.use( loginRouter )
app.use( usersRouter )


console.log('connecting to', config.MONGODB_LOCAL)

mongoose.connect(config.MONGODB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB: ', error.message)
    })

module.exports = app
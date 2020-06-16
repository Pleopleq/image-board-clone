const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const testRouter = require('./controllers/test')
const mongoose = require('mongoose')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use( testRouter )


console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB: ', error.message)
    })

module.exports = app
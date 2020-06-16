const testRouter = require('express').Router()

testRouter.get('/', (req, res) => {
    res.send('hey')
})

module.exports = testRouter
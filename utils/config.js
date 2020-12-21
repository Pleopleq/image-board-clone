require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let MONGODB_LOCAL = process.env.MONGODB_LOCAL

module.exports = { 
    PORT, MONGODB_URI , MONGODB_LOCAL
}
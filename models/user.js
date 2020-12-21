const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        minlength: 4
    },
    password: {
        type: String,
        minlength: 4
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password

    return userObject
}

userSchema.pre("save", async function (next) {
    const user = this
    
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
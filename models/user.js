const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        minlength: 4,
        trim: true
    },
    password: {
        type: String,
        minlength: 4,
        trim: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    tokens: [{
        token: {
            type: String,
            required: true
            }  
    }]
})

userSchema.plugin(uniqueValidator)

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.SECRET)
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token 
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
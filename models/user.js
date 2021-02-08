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
    avatar: {
        type: Buffer
    },
    description: {
        type: String,
        maxlength: 240,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
            }  
    }]
})

userSchema.plugin(uniqueValidator)

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.SECRET)
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token 
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    
    if(!user){
        throw new Error("Unable to log in!")
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
        throw new Error("Unable to log in!")
    }

    return user
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
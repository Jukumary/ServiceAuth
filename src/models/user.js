const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String
    },
    role: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)
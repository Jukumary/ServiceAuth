const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//register user
router.post('/register', userController.userRegister)
router.post('/login', userController.userLogin)

module.exports = router
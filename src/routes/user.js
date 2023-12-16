const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//register user
router.post('/register', userController.userRegister)
router.post('/login', userController.userLogin)
router.post('/logout', userController.userLogOut)
router.post('/forgotPassword', userController.forgotPssword)
router.get('/verifyResetToken', userController.verifyResetToken)
router.post('/resetPassword', userController.resetPassword)

module.exports = router
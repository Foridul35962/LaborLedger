import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import protect from '../middleware/protect.js'

const authRouter = express.Router()

authRouter.get('/user', protect, authController.getUser)
authRouter.post('/login', authController.login)
authRouter.get('/logout', authController.logout)
authRouter.post('/forgetPass', authController.forgetPass)
authRouter.post('/verifyPass', authController.verifyForgetPass)
authRouter.patch('/resetPass', authController.resetPass)
authRouter.post('/resendOtp', authController.resendOtp)

export default authRouter
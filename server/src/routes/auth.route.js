import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/login', authController.login)
authRouter.post('/forgetPass', authController.forgetPass)
authRouter.post('/verifyPass', authController.verifyForgetPass)
authRouter.post('/resetPass', authController.resetPass)
authRouter.post('/resendOtp', authController.resendOtp)

export default authRouter
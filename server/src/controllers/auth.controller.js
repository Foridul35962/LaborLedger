import { generatePasswordResetMail, sendBrevoMail } from "../config/mail.js";
import redis from "../config/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Users from "../models/Users.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'

export const getUser = AsyncHandler(async (req, res) => {
    const { token } = req.cookies
    if (!token) {
        throw new ApiErrors(401, 'unAuthentication access')
    }

    const decoded = await jwt.verify(token,
        process.env.TOKEN_SECRET
    )

    if (!decoded) {
        throw new ApiErrors(401, 'Token failed')
    }

    const userId = decoded.userId
    const user = await Users.findById(userId).select('-password')

    if (!user) {
        throw new ApiErrors(401, 'unAuthentication access')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, 'user fetch successful')
        )
})

export const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ApiErrors(400, 'all field are required')
    }

    //limitation add
    const limitKey = `auth:${email}`
    const count = await redis.incr(limitKey)

    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 5) {
        throw new ApiErrors(429, 'too many request')
    }

    const user = await Users.findOne({ email })
    if (!user) {
        throw new ApiErrors(404, 'user is not registered')
    }

    const isPassMatched = await bcrypt.compare(password, user.password)
    if (!isPassMatched) {
        throw new ApiErrors(400, 'password not matched')
    }

    await redis.del(limitKey)

    user.password = undefined
    user.photo.publicId = undefined

    const tokenOption = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 10 * 24 * 60 * 60 * 1000
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRY }
    )

    return res
        .status(200)
        .cookie('token', token, tokenOption)
        .json(
            new ApiResponse(200, user, "user loggedIn successfully")
        )
})

export const forgetPass = AsyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email are required')
    }

    //limitation add
    const limitKey = `auth:${email}`
    const count = await redis.incr(limitKey)

    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 5) {
        throw new ApiErrors(429, 'too many request')
    }

    const user = await Users.findOne({ email })
    if (!user) {
        throw new ApiErrors(404, 'user is not registered')
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redis.set(`otp:${email}`,
        JSON.stringify({
            otp,
            verified: false
        }),
        "EX", 300
    )

    const { subject, html } = generatePasswordResetMail(otp)

    await sendBrevoMail(email, subject, html)

    //cool down limitation
    const coolDownKey = `coolDown:${email}`
    await redis.set(coolDownKey,
        "1",
        "EX", 60
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp sended')
        )
})

export const verifyForgetPass = AsyncHandler(async (req, res) => {
    const { email, otp } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    if (!otp || String(otp).length !== 6) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    const tampOtp = await redis.get(`otp:${email}`)
    if (!tampOtp) {
        throw new ApiErrors(400, 'time expired')
    }

    const otpData = JSON.parse(tampOtp)
    if (otpData.otp !== otp) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    otpData.verified = true

    await redis.set(`otp:${email}`,
        JSON.stringify(otpData),
        'EX', 300
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp verified')
        )
})

export const resetPass = [
    check('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    AsyncHandler(async (req, res) => {
        const { email, password } = req.body
        if (!email) {
            throw new ApiErrors(400, 'email is required')
        }

        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'entered wrong value', error.array())
        }

        const checkVerified = await redis.get(`otp:${email}`)
        if (!checkVerified) {
            throw new ApiErrors(400, 'time expired')
        }

        const checkVerifiedData = JSON.parse(checkVerified)
        if (!checkVerifiedData.verified) {
            throw new ApiErrors(400, 'email is not verified')
        }

        const hashedPass = await bcrypt.hash(password, 12)
        const updatedUser = await Users.findOneAndUpdate({ email },
            { password: hashedPass }
        )

        if (!updatedUser) {
            throw new ApiErrors(404, 'user is not registered')
        }

        await redis.del(`otp:${email}`)

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, 'password reset successfully')
            )
    })
]

export const resendOtp = AsyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    const coolDownKey = `coolDown:${email}`
    const ttl = await redis.ttl(coolDownKey)

    if (ttl > 0) {
        throw new ApiErrors(429, `please wait ${ttl}s before resending OTP`)
    }

    //rate limit
    const keyLimit = `resendOtp:${email}`
    const count = await redis.incr(keyLimit)
    if (count === 1) {
        await redis.expire(keyLimit, 600)
    }

    if (count > 5) {
        throw new ApiErrors(429, 'too many request')
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redis.set(`otp:${email}`,
        JSON.stringify({
            otp,
            verified: false
        }),
        "EX", 300
    )

    const { subject, html } = generatePasswordResetMail(otp)

    await sendBrevoMail(email, subject, html)

    //cool down limitation
    await redis.set(coolDownKey,
        "1",
        "EX", 60
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp sended')
        )

})
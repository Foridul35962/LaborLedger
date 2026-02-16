import { check, validationResult } from "express-validator";
import AsyncHandler from "../helpers/AsyncHandler.js";
import ApiErrors from "../helpers/ApiErrors.js";
import Users from "../models/Users.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../helpers/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";

export const addSupervisor = [
    check("fullName")
        .trim()
        .notEmpty()
        .withMessage('fullName is required'),
    check('email')
        .trim()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('unvalid email'),
    check('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    AsyncHandler(async (req, res) => {
        const { fullName, email, password } = req.body
        console.log(email)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ApiErrors(400, 'Enter unvalid value', errors.array())
        }

        const image = req.files?.[0]
        if (!image) {
            throw new ApiErrors(400, 'user image is required')
        }

        const exestingUser = await Users.findOne({ email })
        if (exestingUser) {
            throw new ApiErrors(400, 'user is already registered')
        }

        let photo
        try {
            const uploaded = await uploadToCloudinary(image.buffer, 'laborLedger')
            photo = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id
            }
        } catch (error) {
            throw new ApiErrors(500, 'image uploaded failed')
        }

        const hashedPass = await bcrypt.hash(password, 12)

        const user = await Users.create({
            fullName,
            email,
            password: hashedPass,
            photo,
            role: 'supervisor'
        })

        if (!user) {
            throw new ApiErrors(500, 'user registration failed')
        }

        user.password = undefined
        user.photo.publicId = undefined

        return res
            .status(201)
            .json(
                new ApiResponse(201, user, 'user added successfully')
            )
    })
]

export const getAllSupervisor = AsyncHandler(async (req, res) => {
    const supervisors = await Users.find({ role: 'supervisor' })
        .select('fullName email photo.url')

    return res
        .status(200)
        .json(
            new ApiResponse(200, supervisors, 'supervisors fetched successfully')
        )
})

export const editSupervisor = AsyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email must be required')
    }

    const user = await Users.findOne({ email }).select('-password')

    const image = req.files?.[0]
    let photo = null
    if (image) {
        try {
            const uploaded = await uploadToCloudinary(image.buffer, 'laborLedger')
            photo = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id
            }
            await cloudinary.uploader.destroy(user.photo.publicId)
        } catch (error) {
            throw new ApiErrors(500, 'image change failed')
        }
    }

    user.fullName = fullName ?? user.fullName
    if (photo) {
        user.photo = photo
    }

    await user.save()
    user.password = undefined
    user.photo.publicId = undefined

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, 'user updated successfully')
        )
})

export const deleteSupervisor = AsyncHandler(async(req, res)=>{
    const {supervisorId} = req.params
    if (!supervisorId) {
        throw new ApiErrors(400, 'supervisorId is required')
    }

    const user = await Users.findById(supervisorId)
    if (!user) {
        throw new ApiErrors(404, 'supervisor is not found')
    }

    try {
        await cloudinary.uploader.destroy(user.photo.publicId)
    } catch (error) {
        throw new ApiErrors(500, 'image delete failed')
    }

    await user.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(200, supervisorId, 'supervisor delete successfully')
        )
})
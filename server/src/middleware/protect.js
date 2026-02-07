import ApiErrors from "../helpers/ApiErrors.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import jwt from 'jsonwebtoken'
import Users from "../models/Users.model.js";

const protect = AsyncHandler(async(req, res, next)=>{
    const {token} = req.cookies
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

    if (user.role !== 'supervisor') {
        throw new ApiErrors(401, 'unAuthorization access')
    }

    req.user = user
    next()
})

export default protect
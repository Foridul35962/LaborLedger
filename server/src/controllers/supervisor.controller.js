import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Workers from "../models/Workers.model.js";

export const addWorker = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { fullName, phoneNumber, baseRate } = req.body

    if (!fullName || !phoneNumber || !baseRate) {
        throw new ApiErrors(400, 'all field are required')
    }

    const exestingUser = await Workers.findOne({ phoneNumber })

    if (exestingUser) {
        throw new ApiErrors(400, 'worker is already added')
    }

    const user = await Workers.create({
        fullName,
        phoneNumber,
        baseRate,
        supervisor: userId
    })

    if (!user) {
        throw new ApiErrors(500, 'worker added failed')
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, user, 'worker added successfully')
        )
})

export const editWorker = AsyncHandler(async(req, res)=>{
    const userId = req.user._id
    const {workerId} = req.params
    const { fullName, phoneNumber, baseRate } = req.body

    if (!workerId) {
        throw new ApiErrors(400, 'workerId is required')
    }

    if (!fullName && !phoneNumber && !baseRate) {
        throw new ApiErrors(400, 'all field are empty')
    }

    const worker = await Workers.findById(workerId)
    if (!worker) {
        throw new ApiErrors(404, 'worker not found')
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, 'supervisor is not authorized')
    }

    if (phoneNumber) {
        const exestingNumber = await Workers.findOne({phoneNumber})
        if (exestingNumber) {
            throw new ApiErrors(400, 'phone number is already added')
        }
    }

    worker.phoneNumber = phoneNumber ?? worker.phoneNumber
    worker.fullName = fullName ?? worker.fullName
    worker.baseRate = baseRate ?? worker.baseRate

    const updatedWorker = await worker.save()
    if (!updatedWorker) {
        throw new ApiErrors(500, 'worker update failed')
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedWorker, 'worker details update successfully')
        )
})
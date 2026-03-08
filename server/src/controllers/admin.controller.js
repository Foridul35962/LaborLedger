import { check, validationResult } from "express-validator";
import AsyncHandler from "../helpers/AsyncHandler.js";
import ApiErrors from "../helpers/ApiErrors.js";
import Users from "../models/Users.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../helpers/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";
import redis from "../config/redis.js";
import Workers from "../models/Workers.model.js";

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
    const { fullName, supervisorId } = req.body
    if (!supervisorId) {
        throw new ApiErrors(400, 'supervisorId must be required')
    }

    const user = await Users.findById(supervisorId).select('-password')

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

export const deleteSupervisor = AsyncHandler(async (req, res) => {
    const { supervisorId } = req.params
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

export const getSupervisor = AsyncHandler(async (req, res) => {
    const { supervisorId } = req.params;

    if (!supervisorId) {
        throw new ApiErrors(400, "Supervisor ID is required");
    }

    const cachedData = await redis.get(`supervisor:${supervisorId}`);

    if (cachedData) {
        return res.status(200).json(
            new ApiResponse(
                200,
                JSON.parse(cachedData),
                "supervisor details fetch successfully"
            )
        );
    }

    const supervisor = await Users.findById(supervisorId)
        .select("-password -photo.publicId")
        .lean();

    if (!supervisor) {
        throw new ApiErrors(404, "Supervisor not found");
    }

    const workerStats = await Workers.aggregate([
        {
            $match: {
                supervisor: supervisor._id
            }
        },
        {
            $group: {
                _id: "$supervisor",
                totalWorkers: { $sum: 1 },
                totalBaseRate: { $sum: "$baseRate" }
            }
        }
    ]);

    const stats = workerStats[0] || {
        totalWorkers: 0,
        totalBaseRate: 0
    };

    const workers = await Workers.find({ supervisor: supervisorId })
        .select("fullName phoneNumber baseRate createdAt")
        .sort({ createdAt: -1 })
        .lean();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weeklyWorkers = await Workers.find({
        supervisor: supervisorId,
        "work.date": { $gte: startOfWeek, $lt: endOfWeek }
    }).lean();

    let totalWorkHours = 0;
    let totalOvertimeHours = 0;
    let totalWorkDays = 0;

    weeklyWorkers.forEach(worker => {

        worker.work.forEach(work => {

            if (!work.checkIn || !work.checkOut) return;

            if (new Date(work.date) < startOfWeek || new Date(work.date) > endOfWeek) return;

            let workDuration =
                new Date(work.checkOut) - new Date(work.checkIn);

            if (work.leaveTimeStart && work.leaveTimeEnd) {

                const leaveDuration =
                    new Date(work.leaveTimeEnd) -
                    new Date(work.leaveTimeStart);

                workDuration -= leaveDuration;
            }

            const hours = workDuration / (1000 * 60 * 60);

            totalWorkHours += hours;

            totalWorkDays += 1;

            if (hours > 8) {
                totalOvertimeHours += hours - 8;
            }
        });
    });

    const weeklySummary = {
        totalWorkDays,
        totalWorkHours: Number(totalWorkHours.toFixed(2)),
        totalOvertimeHours: Number(totalOvertimeHours.toFixed(2)),
        estimatedExpense: Number(
            (stats.totalBaseRate * totalWorkDays).toFixed(2)
        )
    };

    const responseData = {
        supervisor,
        stats,
        weeklySummary,
        workers
    };

    await redis.set(
        `supervisor:${supervisorId}`,
        JSON.stringify(responseData),
        "EX",
        600
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            responseData,
            "supervisor details fetch successfully"
        )
    );
})

export const getAdminDashboard = AsyncHandler(async (req, res) => {

    const cachedData = await redis.get("admin:dashboard");

    if (cachedData) {
        return res.status(200).json(
            new ApiResponse(
                200,
                JSON.parse(cachedData),
                "dashboard data fetched successfully"
            )
        );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Basic counts
    const totalSupervisors = await Users.countDocuments({
        role: "supervisor"
    });

    const totalWorkers = await Workers.countDocuments();

    // Workers present today

    const workersToday = await Workers.find({
        "work.date": { $gte: todayStart, $lte: todayEnd }
    }).lean();

    let presentToday = 0;
    let totalWorkHoursToday = 0;

    workersToday.forEach(worker => {

        worker.work.forEach(work => {

            const workDate = new Date(work.date);

            if (workDate >= todayStart && workDate <= todayEnd) {

                if (work.checkIn && work.checkOut) {

                    presentToday += 1;

                    let duration =
                        new Date(work.checkOut) - new Date(work.checkIn);

                    if (work.leaveTimeStart && work.leaveTimeEnd) {

                        const leaveDuration =
                            new Date(work.leaveTimeEnd) -
                            new Date(work.leaveTimeStart);

                        duration -= leaveDuration;
                    }

                    const hours = duration / (1000 * 60 * 60);

                    totalWorkHoursToday += hours;
                }
            }
        });
    });

    const absentToday = totalWorkers - presentToday;

    // Weekly stats

    const weeklyWorkers = await Workers.find({
        "work.date": { $gte: startOfWeek, $lt: endOfWeek }
    }).lean();

    let weeklyWorkHours = 0;

    weeklyWorkers.forEach(worker => {

        worker.work.forEach(work => {

            const workDate = new Date(work.date);

            if (workDate >= startOfWeek && workDate <= endOfWeek) {

                if (!work.checkIn || !work.checkOut) return;

                let duration =
                    new Date(work.checkOut) - new Date(work.checkIn);

                if (work.leaveTimeStart && work.leaveTimeEnd) {

                    const leaveDuration =
                        new Date(work.leaveTimeEnd) -
                        new Date(work.leaveTimeStart);

                    duration -= leaveDuration;
                }

                const hours = duration / (1000 * 60 * 60);

                weeklyWorkHours += hours;
            }
        });
    });

    // Weekly expense estimate

    const totalBaseRates = await Workers.aggregate([
        {
            $group: {
                _id: null,
                totalBaseRate: { $sum: "$baseRate" }
            }
        }
    ]);

    const weeklyExpense = (totalBaseRates[0]?.totalBaseRate || 0) * 6;

    // Final response

    const dashboardData = {

        stats: {
            totalSupervisors,
            totalWorkers,
            presentToday,
            absentToday
        },

        todaySummary: {
            totalWorkHoursToday: Number(totalWorkHoursToday.toFixed(2))
        },

        weeklySummary: {
            weeklyWorkHours: Number(weeklyWorkHours.toFixed(2)),
            estimatedWeeklyExpense: weeklyExpense
        }
    };

    await redis.set(
        "admin:dashboard",
        JSON.stringify(dashboardData),
        "EX",
        300
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            dashboardData,
            "dashboard data fetched successfully"
        )
    );
});
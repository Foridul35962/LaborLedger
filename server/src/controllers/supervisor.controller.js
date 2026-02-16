import mongoose from "mongoose";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Workers from "../models/Workers.model.js";
import Payments from "../models/Payments.model.js";
import redis from "../config/redis.js";

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

export const editWorker = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { workerId } = req.params
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
        const existingNumber = await Workers.findOne({
            phoneNumber,
            _id: { $ne: workerId }
        })
        if (existingNumber) {
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

export const deleteWorker = AsyncHandler(async (req, res) => {
    const { workerId } = req.body;

    if (!workerId) {
        throw new ApiErrors(400, "worker id is required");

    }
    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiErrors(400, "invalid worker id")
    }

    const info = await Workers.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(workerId) } },
        {
            $project: {
                _id: 1,
                fullName: 1,
                lastWorkDate: { $max: "$work.date" },
                workCount: { $size: "$work" }
            }
        }
    ]);

    if (!info.length) {
        throw new ApiErrors(404, "worker not found");
    }

    const { fullName, lastWorkDate, workCount } = info[0]

    if (workCount === 0 || !lastWorkDate) {
        const deleted = await Workers.findByIdAndDelete(workerId)

        if (!deleted) {
            throw new ApiErrors(500, "worker delete failed")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, workerId, "worker deleted (no work history)"));
    }

    const lastPayment = await Payments.findOne({
        worker: workerId,
        status: "paid",
    })
        .sort({ periodEnd: -1 })
        .select("periodEnd");

    if (!lastPayment) {
        throw new ApiErrors(
            409,
            `Cannot delete. ${fullName} has work history until ${new Date(lastWorkDate).toDateString()} but no payment record found.`
        );
    }

    const lastPaidEnd = lastPayment.periodEnd

    if (new Date(lastPaidEnd) < new Date(lastWorkDate)) {
        throw new ApiErrors(
            409,
            `Cannot delete. Payment is not completed up to last working day. Last work: ${new Date(lastWorkDate).toDateString()}, Last paid end: ${new Date(lastPaidEnd).toDateString()}.`
        )
    }

    const deleted = await Workers.findByIdAndDelete(workerId)
    if (!deleted) {
        throw new ApiErrors(500, "worker delete failed")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, workerId, "worker deleted successfully")
        )
})

export const viewWorker = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const workers = await Workers.aggregate([
        { $match: { supervisor: new mongoose.Types.ObjectId(userId) } },

        {
            $project: {
                fullName: 1,
                phoneNumber: 1,

                todayWork: {
                    $first: {
                        $filter: {
                            input: "$work",
                            as: "w",
                            cond: {
                                $and: [
                                    { $gte: ["$$w.date", start] },
                                    { $lte: ["$$w.date", end] },
                                ],
                            },
                        },
                    },
                },
            },
        },

        {
            $addFields: {
                todayCheckIn: { $ifNull: ["$todayWork.checkIn", null] },
                isCheckedInToday: {
                    $cond: [{ $ifNull: ["$todayWork.checkIn", false] }, true, false],
                },
                isCheckedOutToday: {
                    $cond: [{ $ifNull: ["$todayWork.checkOut", false] }, true, false],
                }
            },
        },

        { $project: { todayWork: 0 } },

        { $sort: { fullName: 1 } },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, workers, "workers fetched successfully")
        );
})

export const checkInWorker = AsyncHandler(async (req, res) => {
    const { workerId } = req.body;
    const userId = req.user._id

    if (!workerId) {
        throw new ApiErrors(400, "worker id is required")
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiErrors(400, "invalid worker id");
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const worker = await Workers.findById(workerId)
    if (!worker) {
        throw new ApiErrors(404, "worker not found")
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, 'unauthorize access')
    }

    const todayWork = worker.work.find(
        (w) => w.date >= start && w.date <= end
    );

    if (todayWork?.checkIn) {
        throw new ApiErrors(409, `Already checked in today for ${worker.fullName}`);
    }

    const now = new Date();

    if (todayWork) {
        todayWork.checkIn = now;
    } else {
        worker.work.push({
            date: now,
            checkIn: now,
        });
    }

    await worker.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                workerId,
                fullName: worker.fullName,
                todayCheckIn: now,
                isCheckedInToday: true
            },
            "check-in successful"
        )
    );
});

export const checkOutWorker = AsyncHandler(async (req, res) => {
    const { workerId } = req.body;
    const userId = req.user._id;

    if (!workerId) {
        throw new ApiErrors(400, "worker id is required")
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiErrors(400, "invalid worker id");
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const worker = await Workers.findById(workerId).select("supervisor fullName work")

    if (!worker) {
        throw new ApiErrors(404, "worker not found")
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, "unauthorized access");
    }

    const todayWork = worker.work.find(
        (w) => w.checkIn && w.checkIn >= start && w.checkIn <= end
    );

    if (!todayWork) {
        throw new ApiErrors(400, "worker is not checked in today");
    }

    if (todayWork.checkOut) {
        throw new ApiErrors(409, "worker already checked out today");
    }

    const now = new Date();
    todayWork.checkOut = now;

    await worker.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { workerId, fullName: worker.fullName, checkOut: now },
            "worker checkout successfully"
        )
    );
})

export const leaveStart = AsyncHandler(async (req, res) => {
    const { workerId } = req.body;
    const userId = req.user._id;

    if (!workerId) {
        throw new ApiErrors(400, "workerId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiErrors(400, "invalid worker id");
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const worker = await Workers.findById(workerId)
    if (!worker) {
        throw new ApiErrors(404, "worker not found")
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, 'unauthorize access')
    }

    const todayWork = worker.work.find(
        (w) => w.date >= startDate && w.date <= endDate
    );

    if (!todayWork) {
        throw new ApiErrors(404, "today work not found")
    }

    if (!todayWork.checkIn) {
        throw new ApiErrors(400, "worker not checked in today")
    }

    if (todayWork.checkOut) {
        throw new ApiErrors(400, "worker already checked out")
    }

    if (todayWork.leaveTimeStart && !todayWork.leaveTimeEnd) {
        throw new ApiErrors(409, "leave already started");
    }

    const now = new Date();
    todayWork.leaveTimeStart = now
    todayWork.leaveTimeEnd = null

    await worker.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { workerId, leaveTimeStart: now },
            "leave time started successfully"
        )
    );
})

export const leaveEnd = AsyncHandler(async (req, res) => {
    const { workerId } = req.body
    const userId = req.user._id
    if (!workerId) {
        throw new ApiErrors(400, 'worker id is required')
    }

    const worker = await Workers.findById(workerId)
    if (!worker) {
        throw new ApiErrors(404, 'worker not found')
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, 'unauthorize access')
    }

    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const todayWork = worker.work.find(
        (w) => w.date >= start && w.date <= end
    )

    if (!todayWork) {
        throw new ApiErrors(404, "today work not found")
    }

    if (!todayWork.checkIn) {
        throw new ApiErrors(400, "worker not checked in today")
    }

    if (todayWork.checkOut) {
        throw new ApiErrors(400, "worker already checked out")
    }

    if (!todayWork.leaveTimeStart) {
        throw new ApiErrors(409, "leave not started");
    }

    if (todayWork.leaveTimeEnd) {
        throw new ApiErrors(400, 'already leave end')
    }

    todayWork.leaveTimeEnd = Date.now()
    const updatedWork = await worker.save()
    if (!updatedWork) {
        throw new ApiErrors(500, 'leave end failed')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, workerId, 'leave time end successfully')
        )
})

export const workerDetails = AsyncHandler(async (req, res) => {
    const { workerId, paymentToDate } = req.body
    const userId = req.user._id
    if (!workerId || !paymentToDate) {
        throw new ApiErrors(400, 'all field are required')
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        throw new ApiErrors(400, 'invalid worker id')
    }

    const toDate = new Date(paymentToDate)
    if (isNaN(toDate.getTime())) {
        throw new ApiErrors(400, 'invalid paymentToDate')
    }

    toDate.setHours(23, 59, 59, 999)

    const keyDate = toDate.toISOString().slice(0, 10)
    const paymentMoneyToDateKey = `paymentMoneyToDate:${workerId}:${keyDate}`
    const paymentMoneyToDate = await redis.get(paymentMoneyToDateKey)

    if (paymentMoneyToDate) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, JSON.parse(paymentMoneyToDate), 'payment money fetched successfully')
            )
    }

    const workerKey = `worker:${workerId}`
    const redisWorker = await redis.get(workerKey)

    let worker

    if (redisWorker) {
        worker = JSON.parse(redisWorker)
    } else {
        worker = await Workers.findById(workerId)

        if (!worker) {
            throw new ApiErrors(404, 'worker not found')
        }

        await redis.set(workerKey,
            JSON.stringify(worker),
            "EX", 600);
    }

    if (!worker) {
        throw new ApiErrors(404, 'worker not found')
    }

    if (worker.supervisor.toString() !== userId.toString()) {
        throw new ApiErrors(401, 'supervisor is unauthorized')
    }

    const lastPaymentKey = `workerLastPayment:${workerId}`
    const lastPaymentRedis = await redis.get(lastPaymentKey)

    let lastPaymentDay

    if (lastPaymentRedis) {
        lastPaymentDay = JSON.parse(lastPaymentRedis)
    } else {
        const result = await Payments.aggregate([
            { $match: { worker: new mongoose.Types.ObjectId(workerId) } },
            { $group: { _id: "$worker", lastPayment: { $max: "$periodEnd" } } }
        ])

        lastPaymentDay = result?.[0]?.lastPayment
        await redis.set(lastPaymentKey,
            JSON.stringify(lastPaymentDay),
            "EX", 600
        )
    }
    lastPaymentDay = lastPaymentDay ? new Date(lastPaymentDay) : new Date(0)

    const workingDays = (worker.work || []).filter((work) => {
        const workDay = new Date(work.date)
        return workDay > lastPaymentDay && workDay <= toDate
    })

    if (workingDays.length === 0) {
        await redis.set(paymentMoneyToDateKey,
            JSON.stringify({ workedDays: [], workingDays: 0, money: 0, workingHours: 0, overTimes: 0 }),
            "EX", 1800
        )

        return res
            .status(200)
            .json(
                new ApiResponse(200, { workedDays: [], workingDays: 0, money: 0, workingHours: 0, overTimes: 0 }, 'payment money fetched successfully')
            )
    }

    let money = 0
    let workingHours = 0
    let overTimes = 0

    const details = []
    for (const day of workingDays) {
        if (!day.checkIn || !day.checkOut) {
            continue
        }

        const checkIn = new Date(day.checkIn)
        const checkOut = new Date(day.checkOut)

        let leaveTime = 0
        if (day.leaveTimeStart && day.leaveTimeEnd) {
            leaveTime = new Date(day.leaveTimeEnd) - new Date(day.leaveTimeStart)
            if (leaveTime < 0) {
                leaveTime = 0
            }
        }

        let workMs = (checkOut - checkIn) - leaveTime
        if (workMs < 0) {
            workMs = 0
        }

        const tempHour = workMs / (1000 * 60 * 60)
        workingHours += tempHour

        let tempMoney = tempHour * worker.baseRate

        const tempOverTime = Math.max(0, tempHour - 8)
        if (tempOverTime > 0) {
            overTimes += tempOverTime
            tempMoney += tempOverTime * worker.baseRate * 0.5
        }
        money += tempMoney

        details.push({
            date: day.date,
            checkIn: day.checkIn,
            checkOut: day.checkOut,
            leaveTimeStart: day.leaveTimeStart || null,
            leaveTimeEnd: day.leaveTimeEnd || null,
            hours: Number(tempHour.toFixed(2)),
            overtimeHours: Number(tempOverTime.toFixed(2)),
            dayMoney: Number(tempMoney.toFixed(2))
        })
    }

    const payload = {
        workedDays: details,
        workingDays: details.length,
        money: Number(money.toFixed(2)),
        workingHours: Number(workingHours.toFixed(2)),
        overTimes: Number(overTimes.toFixed(2))
    }

    await redis.set(paymentMoneyToDateKey,
        JSON.stringify(payload),
        "EX", 1800
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, payload, 'payment money fetched successfully')
        )

})
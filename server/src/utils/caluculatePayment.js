export const calculateWorkerPayment = (worker, lastPaymentDay, toDate) => {

    const workingDays = (worker.work || []).filter((work) => {
        const workDay = new Date(work.date)
        return workDay > lastPaymentDay && workDay <= toDate
    })

    if (workingDays.length === 0) {
        return {
            workedDays: [],
            workingDays: 0,
            money: 0,
            workingHours: 0,
            overTimes: 0
        }
    }

    let money = 0
    let workingHours = 0
    let overTimes = 0

    const details = []

    for (const day of workingDays) {

        if (!day.checkIn || !day.checkOut) continue

        const checkIn = new Date(day.checkIn)
        const checkOut = new Date(day.checkOut)

        let leaveTime = 0

        if (day.leaveTimeStart && day.leaveTimeEnd) {
            leaveTime = new Date(day.leaveTimeEnd) - new Date(day.leaveTimeStart)
            if (leaveTime < 0) leaveTime = 0
        }

        let workMs = (checkOut - checkIn) - leaveTime
        if (workMs < 0) workMs = 0

        const hours = workMs / (1000 * 60 * 60)
        workingHours += hours

        let tempMoney = hours * worker.baseRate

        const overtime = Math.max(0, hours - 8)

        if (overtime > 0) {
            overTimes += overtime
            tempMoney += overtime * worker.baseRate * 0.5
        }

        money += tempMoney

        details.push({
            date: day.date,
            checkIn: day.checkIn,
            checkOut: day.checkOut,
            leaveTimeStart: day.leaveTimeStart || null,
            leaveTimeEnd: day.leaveTimeEnd || null,
            hours: Number(hours.toFixed(2)),
            overtimeHours: Number(overtime.toFixed(2)),
            dayMoney: Number(tempMoney.toFixed(2))
        })
    }

    return {
        workedDays: details,
        workingDays: details.length,
        money: Number(money.toFixed(2)),
        workingHours: Number(workingHours.toFixed(2)),
        overTimes: Number(overTimes.toFixed(2))
    }
}
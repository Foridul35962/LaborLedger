import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    leaveTimeStart: {
        type: Date
    },
    leaveTimeEnd:{
        type: Date
    }
}, {timestamps: true})

const workerSchema = new mongoose.Schema({
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    baseRate: {
        type: Number,
        required: true
    },
    work: [workSchema]
}, { timestamps: true })

const Workers = mongoose.model('Workers', workerSchema)

export default Workers
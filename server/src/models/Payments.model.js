import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workers",
        required: true,
        index: true
    },
    periodStart: {
        type: Date,
        required: true,
        index: true
    },
    periodEnd: {
        type: Date,
        required: true,
        index: true
    },
    baseRate: {
        type: Number,
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["paid"],
        default: "paid"
    }
}, { timestamps: true })

paymentSchema.index({
    worker: 1,
    periodStart: 1,
    periodEnd: 1
}, { unique: true })

const Payments = mongoose.model('Payments', paymentSchema)

export default Payments
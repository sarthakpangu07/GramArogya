const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        visitRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VisitRequest",
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        referredFacility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "completed",
                "cancelled"
            ],
            default: "pending"
        },

        doctorNotes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Referral", referralSchema);
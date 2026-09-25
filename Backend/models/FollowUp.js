const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
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

        consultation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
            required: true
        },

        followUpDate: {
            type: Date,
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "upcoming",
                "completed",
                "cancelled"
            ],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FollowUp",
    followUpSchema
);
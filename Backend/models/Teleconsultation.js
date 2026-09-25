const mongoose = require("mongoose");

const teleconsultationSchema = new mongoose.Schema(
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

        meetingLink: {
            type: String,
            required: true
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "ongoing",
                "completed",
                "cancelled"
            ],
            default: "scheduled"
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

module.exports = mongoose.model(
    "Teleconsultation",
    teleconsultationSchema
);
const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
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

        assessment: {
            type: String,
            required: true
        },

        decision: {
            type: String,
            enum: ["treatment", "referral"],
            required: true
        },

        prescription: {
            type: String,
            default: ""
        },

        referralReason: {
            type: String,
            default: ""
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
    "Consultation",
    consultationSchema
);
const mongoose = require("mongoose");

const visitRequestSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true
        },

        triageRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TriageRecord",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "completed", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("VisitRequest", visitRequestSchema); 
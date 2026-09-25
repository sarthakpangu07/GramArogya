const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        triageRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TriageRecord",
            default: null
        },

        emergencyReason: {
            type: String,
            required: true
        },

        location: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        },

        requestedFacility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            default: null
        },

        ambulanceRequested: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: [
                "requested",
                "facility_notified",
                "ambulance_requested",
                "in_progress",
                "completed",
                "cancelled"
            ],
            default: "requested"
        },

        emergencyGuidance: {
            type: String,
            default:
                "Seek immediate emergency medical assistance. Do not delay emergency care."
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "EmergencyRequest",
    emergencyRequestSchema
);
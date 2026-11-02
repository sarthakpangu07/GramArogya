
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "patient",
                "phc_staff",
                "doctor",
                "specialist",
                "admin"
            ],
            default: "patient"
        },

        assignedFacility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            default: null
        },

        // Password reset fields
        resetOtpHash: {
            type: String,
            default: null
        },

        resetOtpExpiresAt: {
            type: Date,
            default: null
        },

        resetOtpRequestedAt: {
            type: Date,
            default: null
        },

        resetOtpAttempts: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);

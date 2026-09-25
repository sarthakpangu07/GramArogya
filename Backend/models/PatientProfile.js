const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        age: {
            type: Number,
            required: true
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        village: {
            type: String,
            required: true,
            trim: true
        },

        emergencyContact: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "PatientProfile",
    patientProfileSchema
);
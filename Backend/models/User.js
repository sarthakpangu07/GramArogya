
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
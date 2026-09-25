const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        facilityType: {
            type: String,
            enum: ["PHC", "CHC", "Government Hospital"],
            required: true
        },

        address: {
            type: String,
            required: true
        },

        village: {
            type: String,
            required: true
        },

        district: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        services: {
            type: [String],
            default: []
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Facility", facilitySchema);
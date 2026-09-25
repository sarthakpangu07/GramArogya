const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            required: true
        },

        benefits: {
            type: [String],
            default: []
        },

        eligibility: {
            type: [String],
            default: []
        },

        applicationProcess: {
            type: [String],
            default: []
        },

        targetGroups: {
            type: [String],
            default: []
        },

        state: {
            type: String,
            default: "All India"
        },

        officialWebsite: {
            type: String,
            default: ""
        },

        // Rules used only to identify potentially relevant schemes
        matchingRules: {
            gender: {
                type: [String],
                default: []
            },

            pregnancyRequired: {
                type: Boolean,
                default: false
            },

            ageMin: {
                type: Number,
                default: null
            },

            ageMax: {
                type: Number,
                default: null
            },

            states: {
                type: [String],
                default: []
            }
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

module.exports = mongoose.model(
    "GovernmentScheme",
    governmentSchemeSchema
);
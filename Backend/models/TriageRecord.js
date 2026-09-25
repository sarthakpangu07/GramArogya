const mongoose = require("mongoose");

const triageRecordSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Original natural-language description provided by the patient
        symptomText: {
            type: String,
            default: ""
        },

        // Structured symptoms used by the safety engine
        symptoms: {
            type: [String],
            required: true
        },

        // Symptoms extracted/normalized from the patient's description
        extractedSymptoms: {
            type: [String],
            default: []
        },

        duration: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: ["mild", "moderate", "severe"],
            required: true
        },

        temperature: {
            type: Number
        },

        oxygenLevel: {
            type: Number
        },

        pulseRate: {
            type: Number
        },

        existingConditions: {
            type: [String],
            default: []
        },

        urgencyLevel: {
            type: String,
            enum: [
                "emergency",
                "urgent",
                "routine",
                "human_review"
            ],
            default: "human_review"
        },

        recommendedAction: {
            type: String,
            default: "Consult a healthcare professional"
        },

        requiresDoctorReview: {
            type: Boolean,
            default: true
        },

        decisionSource: {
            type: String,
            enum: [
                "safety_rules",
                "ai_model",
                "human_review"
            ],
            default: "safety_rules"
        },

        // Safety/audit information
        triggeredRules: {
            type: [String],
            default: []
        },

        healthWorkerVitals: {
            recordedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            recordedAt: {
                type: Date
            },

            temperature: {
                type: Number
            },

            oxygenLevel: {
                type: Number
            },

            pulseRate: {
                type: Number
            },

            bloodPressure: {
                type: String
            },

            notes: {
                type: String
            }
        },

        vitalsStatus: {
            type: String,
            enum: ["pending", "recorded"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "TriageRecord",
    triageRecordSchema
);
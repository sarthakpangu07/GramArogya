const TriageRecord = require("../models/TriageRecord");

// Create a new triage assessment
const createTriageRecord = async (req, res) => {
    try {
        const {
            symptoms,
            duration,
            severity,
            temperature,
            oxygenLevel,
            pulseRate,
            existingConditions
        } = req.body;

        // Validate symptoms
        if (
            !Array.isArray(symptoms) ||
            symptoms.length === 0
        ) {
            return res.status(400).json({
                message: "At least one symptom is required"
            });
        }

        // Validate symptom values
        if (
            symptoms.some(
                (symptom) =>
                    typeof symptom !== "string" ||
                    symptom.trim().length === 0
            )
        ) {
            return res.status(400).json({
                message: "Symptoms must contain valid text values"
            });
        }

        // Validate duration
        if (
            typeof duration !== "string" ||
            duration.trim().length === 0
        ) {
            return res.status(400).json({
                message: "Duration is required"
            });
        }

        // Validate severity
        if (
            !["mild", "moderate", "severe"].includes(severity)
        ) {
            return res.status(400).json({
                message:
                    "Severity must be mild, moderate, or severe"
            });
        }

        // Validate temperature
        if (
            temperature !== undefined &&
            (
                typeof temperature !== "number" ||
                temperature < 80 ||
                temperature > 115
            )
        ) {
            return res.status(400).json({
                message: "Please enter a valid temperature"
            });
        }

        // Validate oxygen level
        if (
            oxygenLevel !== undefined &&
            (
                typeof oxygenLevel !== "number" ||
                oxygenLevel < 0 ||
                oxygenLevel > 100
            )
        ) {
            return res.status(400).json({
                message:
                    "Oxygen level must be between 0 and 100"
            });
        }

        // Validate pulse rate
        if (
            pulseRate !== undefined &&
            (
                typeof pulseRate !== "number" ||
                pulseRate < 20 ||
                pulseRate > 250
            )
        ) {
            return res.status(400).json({
                message: "Please enter a valid pulse rate"
            });
        }

        // Validate existing conditions
        if (
            existingConditions !== undefined &&
            !Array.isArray(existingConditions)
        ) {
            return res.status(400).json({
                message:
                    "Existing conditions must be an array"
            });
        }

        // Default triage decision
        let urgencyLevel = "routine";

        let recommendedAction =
            "Visit your nearest PHC for medical evaluation";

        let requiresDoctorReview = true;

        let decisionSource = "safety_rules";

        // Normalize symptoms for comparison
        const normalizedSymptoms = symptoms.map((symptom) =>
            symptom.toLowerCase().trim()
        );

        // Emergency warning symptoms
        const emergencySymptoms = [
            "chest pain",
            "severe breathing difficulty",
            "unconsciousness",
            "severe bleeding",
            "blue lips",
            "seizure"
        ];

        const hasEmergencySymptom =
            normalizedSymptoms.some((symptom) =>
                emergencySymptoms.includes(symptom)
            );

        // Vague or unclear symptoms
        const unclearSymptoms = [
            "not feeling well",
            "feeling unwell",
            "weakness",
            "general weakness",
            "body discomfort",
            "something is wrong",
            "unknown",
            "other"
        ];

        const hasUnclearSymptom =
            normalizedSymptoms.some((symptom) =>
                unclearSymptoms.includes(symptom)
            );

        // Emergency safety checks
        if (
            hasEmergencySymptom ||
            (
                oxygenLevel !== undefined &&
                oxygenLevel < 90
            ) ||
            severity === "severe"
        ) {
            urgencyLevel = "emergency";

            recommendedAction =
                "Seek immediate emergency medical help";

            requiresDoctorReview = true;

            decisionSource = "safety_rules";
        }

        // Urgent safety checks
        else if (
            (
                oxygenLevel !== undefined &&
                oxygenLevel < 94
            ) ||
            (
                pulseRate !== undefined &&
                (
                    pulseRate < 50 ||
                    pulseRate > 120
                )
            ) ||
            severity === "moderate"
        ) {
            urgencyLevel = "urgent";

            recommendedAction =
                "Contact a doctor urgently or visit the nearest PHC";

            requiresDoctorReview = true;

            decisionSource = "safety_rules";
        }

        // Human review for unclear symptoms or missing vitals
        else if (
            hasUnclearSymptom ||
            temperature === undefined ||
            oxygenLevel === undefined ||
            pulseRate === undefined
        ) {
            urgencyLevel = "human_review";

            recommendedAction =
                "Your symptoms or vital information need review by a healthcare professional";

            requiresDoctorReview = true;

            decisionSource = "human_review";
        }

        // Routine case
        else {
            urgencyLevel = "routine";

            recommendedAction =
                "Visit your nearest PHC for medical evaluation";

            requiresDoctorReview = true;

            decisionSource = "safety_rules";
        }

        // Save triage record
        const triageRecord = await TriageRecord.create({
            patient: req.user.userId,
            symptoms,
            duration,
            severity,
            temperature,
            oxygenLevel,
            pulseRate,
            existingConditions,
            urgencyLevel,
            recommendedAction,
            requiresDoctorReview,
            decisionSource
        });

        res.status(201).json({
            message:
                "Triage assessment created successfully",
            triageRecord
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create triage record",
            error: error.message
        });
    }
};

// Get logged-in patient's triage records
const getMyTriageRecords = async (req, res) => {
    try {
        const records = await TriageRecord.find({
            patient: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Triage records fetched successfully",
            count: records.length,
            records
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch triage records",
            error: error.message
        });
    }
};
// Get triage records waiting for PHC staff vitals
const getPendingVitals = async (req, res) => {
    try {
        const records = await TriageRecord.find({
            $or: [
                { vitalsStatus: "pending" },
                { vitalsStatus: { $exists: false } }
            ]
        })
            .populate("patient", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Pending vitals records fetched successfully",
            count: records.length,
            records
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch pending vitals",
            error: error.message
        });
    }
};
// Record vitals by PHC staff
const recordVitals = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            temperature,
            oxygenLevel,
            pulseRate,
            bloodPressure,
            notes
        } = req.body;

        // Validate required vitals
        if (
            temperature === undefined ||
            oxygenLevel === undefined ||
            pulseRate === undefined
        ) {
            return res.status(400).json({
                message:
                    "Temperature, oxygen level and pulse rate are required"
            });
        }

        // Validate temperature
        if (
            typeof temperature !== "number" ||
            temperature < 80 ||
            temperature > 115
        ) {
            return res.status(400).json({
                message:
                    "Temperature must be between 80 and 115"
            });
        }

        // Validate oxygen level
        if (
            typeof oxygenLevel !== "number" ||
            oxygenLevel < 0 ||
            oxygenLevel > 100
        ) {
            return res.status(400).json({
                message:
                    "Oxygen level must be between 0 and 100"
            });
        }

        // Validate pulse rate
        if (
            typeof pulseRate !== "number" ||
            pulseRate < 20 ||
            pulseRate > 250
        ) {
            return res.status(400).json({
                message:
                    "Pulse rate must be between 20 and 250"
            });
        }

        // Find triage record
        const record = await TriageRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                message: "Triage record not found"
            });
        }

        // Save health-worker recorded vitals
        record.healthWorkerVitals = {
            recordedBy: req.user.userId,
            recordedAt: new Date(),
            temperature,
            oxygenLevel,
            pulseRate,
            bloodPressure,
            notes
        };

        // Update status
        record.vitalsStatus = "recorded";

        await record.save();

        res.status(200).json({
            message: "Vitals recorded successfully",
            record
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to record vitals",
            error: error.message
        });
    }
};

module.exports = {
    createTriageRecord,
    getMyTriageRecords,
    getPendingVitals,
    recordVitals
};
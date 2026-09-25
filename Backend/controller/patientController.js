const PatientProfile = require("../models/PatientProfile");

const createPatientProfile = async (req, res) => {
    try {
        const {
            age,
            gender,
            phone,
            village,
            emergencyContact
        } = req.body;

        if (
            !age ||
            !gender ||
            !phone ||
            !village ||
            !emergencyContact
        ) {
            return res.status(400).json({
                message: "All patient details are required"
            });
        }

        const existingProfile = await PatientProfile.findOne({
            user: req.user.userId
        });

        if (existingProfile) {
            return res.status(409).json({
                message: "Patient profile already exists"
            });
        }

        const profile = await PatientProfile.create({
            user: req.user.userId,
            age,
            gender,
            phone,
            village,
            emergencyContact
        });

        res.status(201).json({
            message: "Patient profile created successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create patient profile",
            error: error.message
        });
    }
};

const getPatientProfile = async (req, res) => {
    try {
        const profile = await PatientProfile.findOne({
            user: req.user.userId
        }).populate("user", "name email role");

        if (!profile) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        res.status(200).json({
            message: "Patient profile fetched successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient profile",
            error: error.message
        });
    }
};

module.exports = {
    createPatientProfile,
    getPatientProfile
};
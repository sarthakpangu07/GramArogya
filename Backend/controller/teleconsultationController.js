const Teleconsultation = require("../models/Teleconsultation");
const VisitRequest = require("../models/VisitRequest");

// Create teleconsultation
const createTeleconsultation = async (req, res) => {
    try {
        const {
            visitRequestId,
            scheduledAt
        } = req.body;

        if (!visitRequestId || !scheduledAt) {
            return res.status(400).json({
                message: "Visit request and scheduled time are required."
            });
        }

        const visit = await VisitRequest.findById(visitRequestId);

        if (!visit) {
            return res.status(404).json({
                message: "Visit request not found."
            });
        }

        if (visit.status !== "accepted") {
            return res.status(400).json({
                message: "Teleconsultation can only be created for an accepted visit."
            });
        }

        // Prevent duplicate teleconsultation
        const existing = await Teleconsultation.findOne({
            visitRequest: visitRequestId,
            status: {
                $in: ["scheduled", "ongoing"]
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Teleconsultation already exists for this visit.",
                teleconsultation: existing
            });
        }

        // Generate a simple unique meeting room
        const roomId =
            "gramarogya-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8);

        const meetingLink =
            `https://meet.gramarogya.com/${roomId}`;

        const teleconsultation =
            await Teleconsultation.create({
                patient: visit.patient,
                doctor: req.user.userId,
                visitRequest: visit._id,
                meetingLink,
                scheduledAt
            });

        res.status(201).json({
            message: "Teleconsultation created successfully.",
            teleconsultation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create teleconsultation.",
            error: error.message
        });
    }
};


// Get patient's teleconsultations
const getMyTeleconsultations = async (req, res) => {
    try {
        const teleconsultations =
            await Teleconsultation.find({
                patient: req.user.userId
            })
                .populate("doctor", "name email")
                .populate(
                    "visitRequest",
                    "status"
                )
                .sort({ scheduledAt: -1 });

        res.status(200).json({
            message: "Teleconsultations fetched successfully.",
            teleconsultations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch teleconsultations.",
            error: error.message
        });
    }
};


// Get doctor's teleconsultations
const getDoctorTeleconsultations = async (req, res) => {
    try {
        const teleconsultations =
            await Teleconsultation.find({
                doctor: req.user.userId
            })
                .populate("patient", "name email")
                .populate(
                    "visitRequest",
                    "status"
                )
                .sort({ scheduledAt: 1 });

        res.status(200).json({
            message: "Teleconsultations fetched successfully.",
            teleconsultations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch teleconsultations.",
            error: error.message
        });
    }
};


// Update teleconsultation status
const updateTeleconsultationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "scheduled",
            "ongoing",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid teleconsultation status."
            });
        }

        const teleconsultation =
            await Teleconsultation.findById(id);

        if (!teleconsultation) {
            return res.status(404).json({
                message: "Teleconsultation not found."
            });
        }

        teleconsultation.status = status;

        await teleconsultation.save();

        res.status(200).json({
            message: "Teleconsultation status updated successfully.",
            teleconsultation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update teleconsultation status.",
            error: error.message
        });
    }
};


module.exports = {
    createTeleconsultation,
    getMyTeleconsultations,
    getDoctorTeleconsultations,
    updateTeleconsultationStatus
};
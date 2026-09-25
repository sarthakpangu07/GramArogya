const FollowUp = require("../models/FollowUp");
const VisitRequest = require("../models/VisitRequest");
const Consultation = require("../models/Consultation");

// Create follow-up
const createFollowUp = async (req, res) => {
    try {
        const {
            visitRequestId,
            followUpDate,
            reason,
            notes
        } = req.body;

        if (
            !visitRequestId ||
            !followUpDate ||
            !reason
        ) {
            return res.status(400).json({
                message: "Visit request, follow-up date and reason are required."
            });
        }

        // Check visit
        const visit = await VisitRequest.findById(visitRequestId);

        if (!visit) {
            return res.status(404).json({
                message: "Visit request not found."
            });
        }

        if (visit.status !== "accepted") {
            return res.status(400).json({
                message: "Follow-up can only be created for an accepted visit."
            });
        }

        // Find consultation for this visit and logged-in doctor
        const consultation = await Consultation.findOne({
            visitRequest: visitRequestId,
            doctor: req.user.userId
        });

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation not found for this visit."
            });
        }

        // Follow-up date must be in the future
        const date = new Date(followUpDate);

        if (isNaN(date.getTime())) {
            return res.status(400).json({
                message: "Invalid follow-up date."
            });
        }

        if (date <= new Date()) {
            return res.status(400).json({
                message: "Follow-up date must be in the future."
            });
        }

        // Prevent duplicate upcoming follow-up
        const existingFollowUp = await FollowUp.findOne({
            consultation: consultation._id,
            status: "upcoming"
        });

        if (existingFollowUp) {
            return res.status(400).json({
                message: "An upcoming follow-up already exists for this consultation.",
                followUp: existingFollowUp
            });
        }

        // Create follow-up
        const followUp = await FollowUp.create({
            patient: consultation.patient,
            doctor: req.user.userId,
            visitRequest: visit._id,
            consultation: consultation._id,
            followUpDate: date,
            reason,
            notes: notes || ""
        });

        res.status(201).json({
            message: "Follow-up created successfully.",
            followUp
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create follow-up.",
            error: error.message
        });
    }
};


// Get patient's follow-ups
const getMyFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find({
            patient: req.user.userId
        })
            .populate("doctor", "name email")
            .populate("visitRequest", "status")
            .populate("consultation", "decision")
            .sort({ followUpDate: 1 });

        res.status(200).json({
            message: "Follow-ups fetched successfully.",
            followUps
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch follow-ups.",
            error: error.message
        });
    }
};


// Get doctor's follow-ups
const getDoctorFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find({
            doctor: req.user.userId
        })
            .populate("patient", "name email")
            .populate("visitRequest", "status")
            .populate("consultation", "decision")
            .sort({ followUpDate: 1 });

        res.status(200).json({
            message: "Doctor follow-ups fetched successfully.",
            followUps
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor follow-ups.",
            error: error.message
        });
    }
};


// Update follow-up status
const updateFollowUpStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "upcoming",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid follow-up status."
            });
        }

        const followUp = await FollowUp.findById(id);

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found."
            });
        }

        // Only the assigned doctor can update it
        if (
            followUp.doctor.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to update this follow-up."
            });
        }

        followUp.status = status;

        await followUp.save();

        res.status(200).json({
            message: "Follow-up status updated successfully.",
            followUp
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update follow-up status.",
            error: error.message
        });
    }
};


module.exports = {
    createFollowUp,
    getMyFollowUps,
    getDoctorFollowUps,
    updateFollowUpStatus
};
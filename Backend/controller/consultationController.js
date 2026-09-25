const Consultation = require("../models/Consultation");
const VisitRequest = require("../models/VisitRequest");

const createConsultation = async (req, res) => {
    try {
        const {
            visitRequestId,
            assessment,
            decision,
            prescription,
            referralReason,
            doctorNotes
        } = req.body;

        if (!visitRequestId || !assessment || !decision) {
            return res.status(400).json({
                message:
                    "Visit request, assessment, and decision are required"
            });
        }

        if (!["treatment", "referral"].includes(decision)) {
            return res.status(400).json({
                message: "Invalid consultation decision"
            });
        }

        const visitRequest = await VisitRequest.findById(
            visitRequestId
        );

        if (!visitRequest) {
            return res.status(404).json({
                message: "Visit request not found"
            });
        }

        if (visitRequest.status !== "accepted") {
            return res.status(400).json({
                message:
                    "Only accepted visit requests can be consulted"
            });
        }

        const existingConsultation =
            await Consultation.findOne({
                visitRequest: visitRequestId
            });

        if (existingConsultation) {
            return res.status(400).json({
                message:
                    "Consultation already exists for this visit"
            });
        }

        if (
            decision === "treatment" &&
            !prescription
        ) {
            return res.status(400).json({
                message:
                    "Prescription is required for treatment"
            });
        }

        if (
            decision === "referral" &&
            !referralReason
        ) {
            return res.status(400).json({
                message:
                    "Referral reason is required"
            });
        }

        const consultation =
            await Consultation.create({
                patient: visitRequest.patient,
                doctor: req.user.userId,
                visitRequest: visitRequestId,
                assessment,
                decision,
                prescription:
                    decision === "treatment"
                        ? prescription
                        : "",
                referralReason:
                    decision === "referral"
                        ? referralReason
                        : "",
                doctorNotes: doctorNotes || ""
            });

        res.status(201).json({
            message:
                "Consultation saved successfully",
            consultation
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to save consultation",
            error: error.message
        });
    }
};


const getMyConsultations = async (req, res) => {
    try {
        const consultations =
            await Consultation.find({
                patient: req.user.userId
            })
                .populate(
                    "doctor",
                    "name email"
                )
                .populate(
                    "visitRequest",
                    "facility status"
                )
                .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Consultations fetched successfully",
            consultations
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch consultations",
            error: error.message
        });
    }
};


// Get doctor's consultations
const getDoctorConsultations = async (req, res) => {
    try {
        const consultations =
            await Consultation.find({
                doctor: req.user.userId
            })
                .populate(
                    "patient",
                    "name email"
                )
                .populate(
                    "visitRequest",
                    "facility status"
                )
                .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Doctor consultations fetched successfully",
            consultations
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch doctor consultations",
            error: error.message
        });
    }
};


module.exports = {
    createConsultation,
    getMyConsultations,
    getDoctorConsultations
};
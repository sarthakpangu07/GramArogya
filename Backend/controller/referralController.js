const Referral = require("../models/Referral");
const VisitRequest = require("../models/VisitRequest");
const Facility = require("../models/Facility");

const createReferral = async (req, res) => {
    try {
        const {
            visitRequestId,
            reason,
            referredFacilityId,
            doctorNotes
        } = req.body;

        if (!visitRequestId || !reason || !referredFacilityId) {
            return res.status(400).json({
                message:
                    "Visit request, referral reason, and referred facility are required"
            });
        }

        // Find visit request
        const visitRequest = await VisitRequest.findById(visitRequestId);

        if (!visitRequest) {
            return res.status(404).json({
                message: "Visit request not found"
            });
        }

        if (visitRequest.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted visits can be referred"
            });
        }

        // Check facility
        const facility = await Facility.findOne({
            _id: referredFacilityId,
            isActive: true
        });

        if (!facility) {
            return res.status(404).json({
                message: "Referred facility not found or inactive"
            });
        }

        // Prevent duplicate referral
        const existingReferral = await Referral.findOne({
            visitRequest: visitRequestId
        });

        if (existingReferral) {
            return res.status(400).json({
                message: "Referral already exists for this visit"
            });
        }

        const referral = await Referral.create({
            patient: visitRequest.patient,
            doctor: req.user.userId,
            visitRequest: visitRequestId,
            reason,
            referredFacility: referredFacilityId,
            doctorNotes: doctorNotes || ""
        });

        res.status(201).json({
            message: "Referral created successfully",
            referral
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create referral",
            error: error.message
        });
    }
};


const getMyReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({
            patient: req.user.userId
        })
            .populate("doctor", "name email")
            .populate(
                "referredFacility",
                "name facilityType address village district state phone"
            )
            .populate("visitRequest", "status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Referrals fetched successfully",
            referrals
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch referrals",
            error: error.message
        });
    }
};


module.exports = {
    createReferral,
    getMyReferrals
};
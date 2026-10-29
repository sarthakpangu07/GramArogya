
const mongoose = require("mongoose");
const Referral = require("../models/Referral");
const VisitRequest = require("../models/VisitRequest");
const Facility = require("../models/Facility");
const User = require("../models/User");

// Doctor/Specialist creates a referral
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

        if (
            !mongoose.isValidObjectId(visitRequestId) ||
            !mongoose.isValidObjectId(referredFacilityId)
        ) {
            return res.status(400).json({
                message: "Invalid visit request ID or facility ID"
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
                message: "Only accepted visits can be referred"
            });
        }

        const facility = await Facility.findOne({
            _id: referredFacilityId,
            isActive: true
        });

        if (!facility) {
            return res.status(404).json({
                message: "Referred facility not found or inactive"
            });
        }

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
            reason: reason.trim(),
            referredFacility: referredFacilityId,
            doctorNotes: doctorNotes || ""
        });

        await referral.populate([
            { path: "patient", select: "name email" },
            { path: "doctor", select: "name email" },
            {
                path: "referredFacility",
                select: "name facilityType address village district state phone"
            }
        ]);

        return res.status(201).json({
            message: "Referral created successfully",
            referral
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create referral",
            error: error.message
        });
    }
};

// Patient views their referrals
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

        return res.status(200).json({
            message: "Referrals fetched successfully",
            referrals
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch referrals",
            error: error.message
        });
    }
};

// Specialist views referrals for their assigned facility
const getSpecialistReferrals = async (req, res) => {
    try {
        const specialist = await User.findById(
            req.user.userId
        ).select("role assignedFacility");

        if (!specialist || specialist.role !== "specialist") {
            return res.status(403).json({
                message: "Specialist access required"
            });
        }

        if (!specialist.assignedFacility) {
            return res.status(400).json({
                message:
                    "No facility is assigned to your specialist account. Contact an admin."
            });
        }

        const referrals = await Referral.find({
            referredFacility: specialist.assignedFacility
        })
            .populate("patient", "name email")
            .populate("doctor", "name email")
            .populate(
                "referredFacility",
                "name facilityType address village district state phone"
            )
            .populate("visitRequest", "status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Specialist referrals fetched successfully",
            referrals
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch specialist referrals",
            error: error.message
        });
    }
};

// Specialist accepts or completes a referral
const updateReferralStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid referral ID"
            });
        }

        if (!["accepted", "completed"].includes(status)) {
            return res.status(400).json({
                message:
                    "Status must be either accepted or completed"
            });
        }

        const specialist = await User.findById(
            req.user.userId
        ).select("role assignedFacility");

        if (!specialist || specialist.role !== "specialist") {
            return res.status(403).json({
                message: "Specialist access required"
            });
        }

        if (!specialist.assignedFacility) {
            return res.status(400).json({
                message:
                    "No facility is assigned to your specialist account. Contact an admin."
            });
        }

        const referral = await Referral.findById(id);

        if (!referral) {
            return res.status(404).json({
                message: "Referral not found"
            });
        }

        // A specialist can only update referrals for their facility.
        if (
            String(referral.referredFacility) !==
            String(specialist.assignedFacility)
        ) {
            return res.status(403).json({
                message:
                    "You cannot update a referral assigned to another facility"
            });
        }

        // Only allow pending -> accepted -> completed.
        if (
            status === "accepted" &&
            referral.status !== "pending"
        ) {
            return res.status(400).json({
                message:
                    "Only pending referrals can be accepted"
            });
        }

        if (
            status === "completed" &&
            referral.status !== "accepted"
        ) {
            return res.status(400).json({
                message:
                    "Only accepted referrals can be completed"
            });
        }

        referral.status = status;
        await referral.save();

        await referral.populate([
            { path: "patient", select: "name email" },
            { path: "doctor", select: "name email" },
            {
                path: "referredFacility",
                select: "name facilityType address village district state phone"
            },
            { path: "visitRequest", select: "status" }
        ]);

        return res.status(200).json({
            message: `Referral marked as ${status} successfully`,
            referral
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update referral status",
            error: error.message
        });
    }
};

module.exports = {
    createReferral,
    getMyReferrals,
    getSpecialistReferrals,
    updateReferralStatus
};
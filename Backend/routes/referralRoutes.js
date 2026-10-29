const express = require("express");

const {
    createReferral,
    getMyReferrals,
    getSpecialistReferrals,
    updateReferralStatus
} = require("../controller/referralController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Doctor/Specialist creates a referral
router.post(
    "/",
    protect,
    authorize("doctor", "specialist"),
    createReferral
);

// Patient views their referrals
router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyReferrals
);

// Specialist views referrals assigned to their facility
router.get(
    "/specialist",
    protect,
    authorize("specialist"),
    getSpecialistReferrals
);

// Specialist accepts or completes a referral
router.patch(
    "/:id/status",
    protect,
    authorize("specialist"),
    updateReferralStatus
);

module.exports = router;


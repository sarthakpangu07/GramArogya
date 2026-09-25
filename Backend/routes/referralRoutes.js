const express = require("express");

const {
    createReferral,
    getMyReferrals
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

module.exports = router;
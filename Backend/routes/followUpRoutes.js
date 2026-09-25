const express = require("express");
const router = express.Router();

const {
    createFollowUp,
    getMyFollowUps,
    getDoctorFollowUps,
    updateFollowUpStatus
} = require("../controller/followUpController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Doctor creates follow-up
router.post(
    "/",
    protect,
    authorize("doctor", "specialist"),
    createFollowUp
);

// Patient views own follow-ups
router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyFollowUps
);

// Doctor views own follow-ups
router.get(
    "/doctor",
    protect,
    authorize("doctor", "specialist"),
    getDoctorFollowUps
);

// Doctor updates follow-up status
router.patch(
    "/:id/status",
    protect,
    authorize("doctor", "specialist"),
    updateFollowUpStatus
);

module.exports = router;
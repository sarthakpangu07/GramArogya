const express = require("express");

const router = express.Router();

const {
    createTeleconsultation,
    getMyTeleconsultations,
    getDoctorTeleconsultations,
    updateTeleconsultationStatus
} = require("../controller/teleconsultationController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Doctor/Specialist creates teleconsultation
router.post(
    "/",
    protect,
    authorize("doctor", "specialist"),
    createTeleconsultation
);

// Patient views own teleconsultations
router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyTeleconsultations
);

// Doctor/Specialist views their teleconsultations
router.get(
    "/doctor",
    protect,
    authorize("doctor", "specialist"),
    getDoctorTeleconsultations
);

// Doctor/Specialist updates consultation status
router.patch(
    "/:id/status",
    protect,
    authorize("doctor", "specialist"),
    updateTeleconsultationStatus
);

module.exports = router;
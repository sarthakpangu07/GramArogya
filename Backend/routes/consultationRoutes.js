const express = require("express");

const {
    createConsultation,
    getMyConsultations,
    getDoctorConsultations
} = require("../controller/consultationController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("doctor", "specialist"),
    createConsultation
);

router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyConsultations
);

router.get(
    "/doctor",
    protect,
    authorize("doctor", "specialist"),
    getDoctorConsultations
);

module.exports = router;
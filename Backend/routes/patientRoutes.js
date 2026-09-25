const express = require("express");

const {
    createPatientProfile,
    getPatientProfile
} = require("../controller/patientController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
    "/profile",
    protect,
    authorize("patient"),
    createPatientProfile
);

router.get(
    "/profile",
    protect,
    authorize("patient"),
    getPatientProfile
);


module.exports = router;
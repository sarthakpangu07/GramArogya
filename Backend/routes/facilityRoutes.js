
const express = require("express");

const {
    getNearbyFacilities,
    getPHCFacility,
    getActiveFacilities
} = require("../controller/facilityController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Patient: Find nearby facilities
router.get(
    "/nearby",
    protect,
    authorize("patient"),
    getNearbyFacilities
);

// PHC Staff: Get PHC facility
router.get(
    "/phc",
    protect,
    authorize("phc_staff"),
    getPHCFacility
);

// Admin, doctor and specialist: Get active facilities
router.get(
    "/active",
    protect,
    authorize("admin", "doctor", "specialist"),
    getActiveFacilities
);

module.exports = router;

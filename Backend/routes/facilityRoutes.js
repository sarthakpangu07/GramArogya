const express = require("express");

const {
    getNearbyFacilities,
    getPHCFacility,
    getActiveFacilities,
    getAllFacilities,
    createFacility,
    updateFacility,
    toggleFacilityStatus
} = require("../controller/facilityController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// ---------------- Patient ----------------

router.get(
    "/nearby",
    protect,
    authorize("patient"),
    getNearbyFacilities
);

// ---------------- PHC Staff ----------------

router.get(
    "/phc",
    protect,
    authorize("phc_staff"),
    getPHCFacility
);

// ---------------- Admin + Doctor + Specialist ----------------

router.get(
    "/active",
    protect,
    authorize("admin", "doctor", "specialist"),
    getActiveFacilities
);

// ---------------- Admin Only ----------------

// View every facility
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllFacilities
);

// Add facility
router.post(
    "/",
    protect,
    authorize("admin"),
    createFacility
);

// Edit facility
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateFacility
);

// Activate / Deactivate
router.patch(
    "/:id/toggle-status",
    protect,
    authorize("admin"),
    toggleFacilityStatus
);

module.exports = router;
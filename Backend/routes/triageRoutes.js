const express = require("express");

const {
    createTriageRecord,
    getMyTriageRecords,
    getPendingVitals,
    recordVitals
} = require("../controller/triageController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Patient creates a triage assessment
router.post(
    "/check",
    protect,
    authorize("patient"),
    createTriageRecord
);

// Patient views own triage records
router.get(
    "/my-records",
    protect,
    authorize("patient"),
    getMyTriageRecords
);

// PHC staff views records waiting for vitals
router.get(
    "/phc-pending",
    protect,
    authorize("phc_staff"),
    getPendingVitals
);

// PHC staff records patient vitals
router.patch(
    "/:id/vitals",
    protect,
    authorize("phc_staff"),
    recordVitals
);

module.exports = router;
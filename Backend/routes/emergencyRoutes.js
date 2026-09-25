const express = require("express");

const router = express.Router();

const {
    createEmergencyRequest,
    getMyEmergencyRequests,
    getPendingEmergencyRequests,
    updateEmergencyStatus
} = require("../controller/emergencyController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Patient creates emergency request
router.post(
    "/",
    protect,
    authorize("patient"),
    createEmergencyRequest
);

// Patient views own emergency requests
router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyEmergencyRequests
);

// PHC staff views pending emergency requests
router.get(
    "/phc-pending",
    protect,
    authorize("phc_staff"),
    getPendingEmergencyRequests
);

// PHC staff updates emergency status
router.patch(
    "/:id/status",
    protect,
    authorize("phc_staff"),
    updateEmergencyStatus
);

module.exports = router;
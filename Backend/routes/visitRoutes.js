const express = require("express");

const {
    createVisitRequest,
    getPendingVisitRequests,
    getAcceptedVisitRequests,
    getDoctorPatients,
    acceptVisitRequest
} = require("../controller/visitController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();


// Patient: Create visit request
router.post(
    "/",
    protect,
    authorize("patient"),
    createVisitRequest
);


// PHC Staff: Get pending visit requests
router.get(
    "/phc-pending",
    protect,
    authorize("phc_staff"),
    getPendingVisitRequests
);


// PHC Staff: Get accepted visit requests
router.get(
    "/phc-accepted",
    protect,
    authorize("phc_staff"),
    getAcceptedVisitRequests
);

router.get(
    "/doctor-patients",
    protect,
    authorize("doctor", "specialist"),
    getDoctorPatients
);


// PHC Staff: Accept visit request
router.patch(
    "/:id/accept",
    protect,
    authorize("phc_staff"),
    acceptVisitRequest
);


module.exports = router;
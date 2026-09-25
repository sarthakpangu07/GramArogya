const express = require("express");

const router = express.Router();

const {
    getGovernmentSchemes,
    matchGovernmentSchemes
} = require("../controller/governmentSchemeController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


// Get all active government schemes
router.get(
    "/",
    protect,
    authorize("patient"),
    getGovernmentSchemes
);


// Find potentially relevant government schemes
router.post(
    "/match",
    protect,
    authorize("patient"),
    matchGovernmentSchemes
);


module.exports = router;
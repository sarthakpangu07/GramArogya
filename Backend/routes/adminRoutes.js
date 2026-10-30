const express = require("express");

const {
    getAdminStats
} = require("../controller/adminController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Only authenticated administrators can access dashboard statistics
router.get(
    "/stats",
    protect,
    authorize("admin"),
    getAdminStats
);

module.exports = router;
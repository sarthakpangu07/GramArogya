const express = require("express");

const {
    getMyHealthRecords
} = require("../controller/healthRecordController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
    "/my",
    protect,
    authorize("patient"),
    getMyHealthRecords
);

module.exports = router;
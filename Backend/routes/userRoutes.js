const express = require("express");

const {
    createUser,
    loginUser
} = require("../controller/userController");

const User = require("../models/User");
const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", createUser);

router.post("/login", loginUser);

router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});

router.get(
    "/patient-dashboard",
    protect,
    authorize("patient"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the patient dashboard",
            user: req.user
        });
    }
);

module.exports = router;
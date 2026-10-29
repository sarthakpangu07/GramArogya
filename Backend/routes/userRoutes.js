
const express = require("express");

const {
    createUser,
    createStaffUser,
    loginUser,
    assignSpecialistFacility
} = require("../controller/userController");

const User = require("../models/User");
const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public registration: patient accounts only
router.post("/", createUser);

// Public login
router.post("/login", loginUser);

// Admin: create doctor, specialist, or PHC staff account
router.post(
    "/staff",
    protect,
    authorize("admin"),
    createStaffUser
);

// Admin: assign a facility to a specialist
router.patch(
    "/assign-specialist-facility",
    protect,
    authorize("admin"),
    assignSpecialistFacility
);

// Get logged-in user's profile
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});

// Patient dashboard
router.get(
    "/patient-dashboard",
    protect,
    authorize("patient"),
    (req, res) => {
        return res.status(200).json({
            message: "Welcome to the patient dashboard",
            user: req.user
        });
    }
);

module.exports = router;
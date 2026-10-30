const User = require("../models/User");
const Facility = require("../models/Facility");
const Referral = require("../models/Referral");
const EmergencyRequest = require("../models/EmergencyRequest");

// Get dashboard statistics
const getAdminStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalPatients,
            totalPhcStaff,
            totalDoctors,
            totalSpecialists,
            totalAdmins,
            totalFacilities,
            activeFacilities,
            inactiveFacilities,
            totalReferrals,
            totalEmergencyRequests
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "patient" }),
            User.countDocuments({ role: "phc_staff" }),
            User.countDocuments({ role: "doctor" }),
            User.countDocuments({ role: "specialist" }),
            User.countDocuments({ role: "admin" }),

            Facility.countDocuments(),
            Facility.countDocuments({ isActive: true }),
            Facility.countDocuments({ isActive: false }),

            Referral.countDocuments(),
            EmergencyRequest.countDocuments()
        ]);

        return res.status(200).json({
            message: "Admin dashboard statistics fetched successfully",

            stats: {
                totalUsers,
                totalPatients,
                totalPhcStaff,
                totalDoctors,
                totalSpecialists,
                totalAdmins,
                totalFacilities,
                activeFacilities,
                inactiveFacilities,
                totalReferrals,
                totalEmergencyRequests,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Admin dashboard statistics error:", error);

        return res.status(500).json({
            message: "Unable to fetch admin dashboard statistics."
        });
    }
};

module.exports = {
    getAdminStats
};
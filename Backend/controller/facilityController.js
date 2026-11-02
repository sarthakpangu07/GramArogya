const Facility = require("../models/Facility");

const getNearbyFacilities = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const userLatitude = Number(latitude);
        const userLongitude = Number(longitude);

        if (
            Number.isNaN(userLatitude) ||
            Number.isNaN(userLongitude) ||
            userLatitude < -90 ||
            userLatitude > 90 ||
            userLongitude < -180 ||
            userLongitude > 180
        ) {
            return res.status(400).json({
                message: "Invalid latitude or longitude"
            });
        }

        const facilities = await Facility.find({ isActive: true });

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const earthRadius = 6371;

            const latDifference = (lat2 - lat1) * Math.PI / 180;
            const lonDifference = (lon2 - lon1) * Math.PI / 180;

            const a =
                Math.sin(latDifference / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(lonDifference / 2) ** 2;

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return earthRadius * c;
        };

        const nearbyFacilities = facilities
            .map((facility) => ({
                ...facility.toObject(),
                distance: Number(
                    calculateDistance(
                        userLatitude,
                        userLongitude,
                        facility.latitude,
                        facility.longitude
                    ).toFixed(2)
                )
            }))
            .sort((a, b) => a.distance - b.distance);

        return res.status(200).json({
            message: "Nearby facilities fetched successfully",
            facilities: nearbyFacilities
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch nearby facilities",
            error: error.message
        });
    }
};

const getPHCFacility = async (req, res) => {
    try {
        const facility = await Facility.findOne({
            facilityType: "PHC",
            isActive: true
        });

        if (!facility) {
            return res.status(404).json({
                message: "PHC facility not found"
            });
        }

        return res.status(200).json({
            message: "PHC facility fetched successfully",
            facility
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch PHC facility",
            error: error.message
        });
    }
};

const getActiveFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({
            isActive: true
        }).sort({ name: 1 });

        return res.status(200).json({
            message: "Active facilities fetched successfully",
            facilities
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch facilities",
            error: error.message
        });
    }
};

// ================= ADMIN APIS =================

const getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Facilities fetched successfully",
            facilities
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch facilities",
            error: error.message
        });
    }
};

const createFacility = async (req, res) => {
    try {
        const facility = await Facility.create(req.body);

        return res.status(201).json({
            message: "Facility created successfully",
            facility
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create facility",
            error: error.message
        });
    }
};

const updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        return res.status(200).json({
            message: "Facility updated successfully",
            facility
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update facility",
            error: error.message
        });
    }
};

const toggleFacilityStatus = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        facility.isActive = !facility.isActive;
        await facility.save();

        return res.status(200).json({
            message: `Facility ${
                facility.isActive ? "activated" : "deactivated"
            } successfully`,
            facility
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update facility status",
            error: error.message
        });
    }
};

module.exports = {
    getNearbyFacilities,
    getPHCFacility,
    getActiveFacilities,
    getAllFacilities,
    createFacility,
    updateFacility,
    toggleFacilityStatus
};
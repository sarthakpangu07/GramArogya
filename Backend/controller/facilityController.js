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

        const facilities = await Facility.find({
            isActive: true
        });

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const earthRadius = 6371;

            const latDifference = (lat2 - lat1) * Math.PI / 180;
            const lonDifference = (lon2 - lon1) * Math.PI / 180;

            const a =
                Math.sin(latDifference / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(lonDifference / 2) ** 2;

            const c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

            return earthRadius * c;
        };

        const nearbyFacilities = facilities
            .map((facility) => {
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    facility.latitude,
                    facility.longitude
                );

                return {
                    ...facility.toObject(),
                    distance: Number(distance.toFixed(2))
                };
            })
            .sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            message: "Nearby facilities fetched successfully",
            facilities: nearbyFacilities
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch nearby facilities",
            error: error.message
        });
    }
};


// Get PHC facility for PHC staff
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

        res.status(200).json({
            message: "PHC facility fetched successfully",
            facility
        });

    } catch (error) {
        res.status(500).json({
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

        res.status(200).json({
            message: "Active facilities fetched successfully",
            facilities
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch facilities",
            error: error.message
        });
    }
};


module.exports = {
    getNearbyFacilities,
    getPHCFacility,
    getActiveFacilities
};
const EmergencyRequest = require("../models/EmergencyRequest");
const Facility = require("../models/Facility");
const TriageRecord = require("../models/TriageRecord");

// Create emergency request
const createEmergencyRequest = async (req, res) => {
    try {
        const {
            triageRecordId,
            emergencyReason,
            latitude,
            longitude,
            ambulanceRequested,
            notes
        } = req.body;

        if (!emergencyReason) {
            return res.status(400).json({
                message: "Emergency reason is required."
            });
        }

        // If a triage record is provided, verify it
        if (triageRecordId) {
            const triageRecord =
                await TriageRecord.findById(
                    triageRecordId
                );

            if (!triageRecord) {
                return res.status(404).json({
                    message: "Triage record not found."
                });
            }

            if (
                triageRecord.patient.toString() !==
                req.user.userId.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to use this triage record."
                });
            }
        }

        // Find active emergency-capable facilities
        const facilities = await Facility.find({
            isActive: true,
            facilityType: {
                $in: ["PHC", "CHC", "Government Hospital"]
            }
        });

        let nearestFacility = null;

        // If patient location is available,
        // calculate the nearest facility
        if (
            latitude !== undefined &&
            longitude !== undefined &&
            facilities.length > 0
        ) {
            let shortestDistance = Infinity;

            facilities.forEach((facility) => {
                if (
                    facility.latitude === undefined ||
                    facility.longitude === undefined ||
                    facility.latitude === null ||
                    facility.longitude === null
                ) {
                    return;
                }

                const distance = Math.sqrt(
                    Math.pow(
                        facility.latitude - Number(latitude),
                        2
                    ) +
                    Math.pow(
                        facility.longitude - Number(longitude),
                        2
                    )
                );

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestFacility = facility;
                }
            });
        }

        // Fallback if location is unavailable
        if (!nearestFacility && facilities.length > 0) {
            nearestFacility = facilities.find(
                (facility) =>
                    facility.facilityType ===
                    "Government Hospital"
            ) || facilities[0];
        }

        const emergencyRequest =
            await EmergencyRequest.create({
                patient: req.user.userId,

                triageRecord:
                    triageRecordId || null,

                emergencyReason,

                location: {
                    latitude:
                        latitude !== undefined
                            ? Number(latitude)
                            : null,

                    longitude:
                        longitude !== undefined
                            ? Number(longitude)
                            : null
                },

                requestedFacility:
                    nearestFacility
                        ? nearestFacility._id
                        : null,

                ambulanceRequested:
                    ambulanceRequested === true,

                status:
                    ambulanceRequested === true
                        ? "ambulance_requested"
                        : "facility_notified",

                emergencyGuidance:
                    "This may be an emergency. Seek immediate medical assistance and do not delay emergency care.",

                notes: notes || ""
            });

        const populatedRequest =
            await EmergencyRequest.findById(
                emergencyRequest._id
            ).populate(
                "requestedFacility",
                "name facilityType address village district state phone latitude longitude"
            );

        res.status(201).json({
            message:
                "Emergency request created successfully.",
            emergencyRequest: populatedRequest
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to create emergency request.",
            error: error.message
        });
    }
};


// Get patient's emergency requests
const getMyEmergencyRequests = async (req, res) => {
    try {
        const requests =
            await EmergencyRequest.find({
                patient: req.user.userId
            })
                .populate(
                    "requestedFacility",
                    "name facilityType address village district state phone latitude longitude"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Emergency requests fetched successfully.",
            emergencyRequests: requests
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch emergency requests.",
            error: error.message
        });
    }
};


// Get pending emergency requests for PHC staff
const getPendingEmergencyRequests = async (
    req,
    res
) => {
    try {
        const requests =
            await EmergencyRequest.find({
                status: {
                    $in: [
                        "requested",
                        "facility_notified",
                        "ambulance_requested",
                        "in_progress"
                    ]
                }
            })
                .populate(
                    "patient",
                    "name email"
                )
                .populate(
                    "requestedFacility",
                    "name facilityType address village district state phone"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Pending emergency requests fetched successfully.",
            emergencyRequests: requests
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch pending emergency requests.",
            error: error.message
        });
    }
};


// Update emergency request status
const updateEmergencyStatus = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "requested",
            "facility_notified",
            "ambulance_requested",
            "in_progress",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message:
                    "Invalid emergency request status."
            });
        }

        const emergencyRequest =
            await EmergencyRequest.findById(id);

        if (!emergencyRequest) {
            return res.status(404).json({
                message:
                    "Emergency request not found."
            });
        }

        emergencyRequest.status = status;

        await emergencyRequest.save();

        res.status(200).json({
            message:
                "Emergency request status updated successfully.",
            emergencyRequest
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to update emergency request status.",
            error: error.message
        });
    }
};


module.exports = {
    createEmergencyRequest,
    getMyEmergencyRequests,
    getPendingEmergencyRequests,
    updateEmergencyStatus
};
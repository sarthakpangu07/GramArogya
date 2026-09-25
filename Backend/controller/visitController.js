const VisitRequest = require("../models/VisitRequest");
const Facility = require("../models/Facility");
const TriageRecord = require("../models/TriageRecord");

const createVisitRequest = async (req, res) => {
    try {
        const { facilityId, triageId } = req.body;

        if (!facilityId || !triageId) {
            return res.status(400).json({
                message: "Facility ID and triage ID are required"
            });
        }

        const facility = await Facility.findById(facilityId);

        if (!facility || !facility.isActive) {
            return res.status(404).json({
                message: "Facility not found or inactive"
            });
        }

        const triageRecord = await TriageRecord.findOne({
            _id: triageId,
            patient: req.user.userId
        });

        if (!triageRecord) {
            return res.status(404).json({
                message: "Triage record not found"
            });
        }

        const visitRequest = await VisitRequest.create({
            patient: req.user.userId,
            facility: facilityId,
            triageRecord: triageId,
            status: "pending"
        });

        res.status(201).json({
            message: "Visit request sent successfully",
            visitRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create visit request",
            error: error.message
        });
    }
};
const getPendingVisitRequests = async (req, res) => {
    try {
        const { facilityId } = req.query;

        if (!facilityId) {
            return res.status(400).json({
                message: "Facility ID is required"
            });
        }

        const visitRequests = await VisitRequest.find({
            facility: facilityId,
            status: "pending"
        })
            .populate("patient", "name email")
            .populate("triageRecord")
            .populate("facility", "name facilityType address");

        res.status(200).json({
            message: "Pending visit requests fetched successfully",
            visitRequests
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch pending visit requests",
            error: error.message
        });
    }
};
const acceptVisitRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const visitRequest = await VisitRequest.findById(id);

        if (!visitRequest) {
            return res.status(404).json({
                message: "Visit request not found"
            });
        }

        if (visitRequest.status !== "pending") {
            return res.status(400).json({
                message: "Only pending requests can be accepted"
            });
        }

        visitRequest.status = "accepted";

        await visitRequest.save();

        res.status(200).json({
            message: "Visit request accepted successfully",
            visitRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept visit request",
            error: error.message
        });
    }
};
const getAcceptedVisitRequests = async (req, res) => {
    try {
        const { facilityId } = req.query;

        if (!facilityId) {
            return res.status(400).json({
                message: "Facility ID is required"
            });
        }

        const visitRequests = await VisitRequest.find({
            facility: facilityId,
            status: "accepted"
        })
            .populate("patient", "name email")
            .populate("triageRecord")
            .populate("facility", "name facilityType address");

        res.status(200).json({
            message: "Accepted visit requests fetched successfully",
            visitRequests
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch accepted visit requests",
            error: error.message
        });
    }
};
const getDoctorPatients = async (req, res) => {
    try {
        const visitRequests = await VisitRequest.find({
            status: "accepted"
        })
            .populate("patient", "name email")
            .populate("triageRecord")
            .populate("facility", "name facilityType address");

        const patientsWithVitals = visitRequests.filter(
            (request) =>
                request.triageRecord &&
                request.triageRecord.vitalsStatus === "recorded"
        );

        res.status(200).json({
            message: "Doctor patients fetched successfully",
            visitRequests: patientsWithVitals
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor patients",
            error: error.message
        });
    }
};

module.exports = {
    createVisitRequest,
    getPendingVisitRequests,
    getAcceptedVisitRequests,
    getDoctorPatients,
    acceptVisitRequest
};
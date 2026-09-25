const TriageRecord = require("../models/TriageRecord");
const VisitRequest = require("../models/VisitRequest");
const Consultation = require("../models/Consultation");

const getMyHealthRecords = async (req, res) => {
    try {
        const patientId = req.user.userId;

        const triageRecords = await TriageRecord.find({
            patient: patientId
        }).sort({ createdAt: -1 });

        const healthRecords = [];

        for (const triage of triageRecords) {
            const visit = await VisitRequest.findOne({
                patient: patientId,
                triageRecord: triage._id
            })
                .populate("facility", "name facilityType address village district state phone")
                .sort({ createdAt: -1 });

            let consultation = null;

            if (visit) {
                consultation = await Consultation.findOne({
                    visitRequest: visit._id
                })
                    .populate("doctor", "name email")
                    .sort({ createdAt: -1 });
            }

            healthRecords.push({
                triage,
                visit,
                consultation
            });
        }

        res.status(200).json({
            message: "Health records fetched successfully",
            healthRecords
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch health records",
            error: error.message
        });
    }
};

module.exports = {
    getMyHealthRecords
};
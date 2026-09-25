import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HealthRecords = () => {
    const { t } = useTranslation();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHealthRecords();
    }, []);

    const fetchHealthRecords = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/health-records/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    t("healthRecords.fetchFailed")
                );
            }

            setRecords(data.healthRecords || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Translate stored symptom values
    const translateSymptom = (symptom) => {
        const symptomMap = {
            fever: "symptoms.fever",
            cough: "symptoms.cough",
            cold: "symptoms.cold",
            headache: "symptoms.headache",
            bodyPain: "symptoms.bodyPain",
            weakness: "symptoms.weakness",
            breathingDifficulty:
                "symptoms.breathingDifficulty",
            chestPain: "symptoms.chestPain",
            vomiting: "symptoms.vomiting",
            diarrhea: "symptoms.diarrhea"
        };

        return symptomMap[symptom]
            ? t(symptomMap[symptom])
            : symptom;
    };

    // Translate severity values
    const translateSeverity = (severity) => {
        const severityMap = {
            mild: "severity.mild",
            moderate: "severity.moderate",
            severe: "severity.severe"
        };

        return severityMap[severity]
            ? t(severityMap[severity])
            : severity;
    };

    // Translate urgency values
    const translateUrgency = (urgency) => {
        const urgencyMap = {
            emergency:
                "healthRecords.values.emergency",
            urgent:
                "healthRecords.values.urgent",
            human_review:
                "healthRecords.values.humanReview",
            routine:
                "healthRecords.values.routine"
        };

        return urgencyMap[urgency]
            ? t(urgencyMap[urgency])
            : urgency;
    };

    // Translate recommended actions
    const translateRecommendedAction = (action) => {
        const actionMap = {
            emergency_help:
                "healthRecords.values.emergencyHelp",

            urgent_phc:
                "healthRecords.values.urgentPhc",

            phc_visit:
                "healthRecords.values.phcVisit",

            telemedicine:
                "healthRecords.values.telemedicine",

            doctor_consultation:
                "healthRecords.values.doctorConsultation",

            routine:
                "healthRecords.values.routineAction"
        };

        return actionMap[action]
            ? t(actionMap[action])
            : action;
    };

    // Translate visit status
    const translateVisitStatus = (status) => {
        const statusMap = {
            pending:
                "healthRecords.visitStatuses.pending",

            accepted:
                "healthRecords.visitStatuses.accepted",

            rejected:
                "healthRecords.visitStatuses.rejected",

            completed:
                "healthRecords.visitStatuses.completed",

            cancelled:
                "healthRecords.visitStatuses.cancelled"
        };

        return statusMap[status]
            ? t(statusMap[status])
            : status;
    };

    if (loading) {
        return (
            <h2>
                {t("healthRecords.loading")}
            </h2>
        );
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1000px",
                margin: "auto"
            }}
        >
            <h1>
                {t("healthRecords.title")}
            </h1>

            {records.length === 0 ? (
                <p>
                    {t("healthRecords.noRecords")}
                </p>
            ) : (
                records.map((record) => (
                    <div
                        key={record.triage._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "20px",
                            marginTop: "20px"
                        }}
                    >
                        <h2>
                            {t(
                                "healthRecords.healthRecord"
                            )}
                        </h2>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.date"
                                )}
                                :
                            </strong>{" "}
                            {new Date(
                                record.triage.createdAt
                            ).toLocaleDateString()}
                        </p>

                        <hr />

                        <h3>
                            {t(
                                "healthRecords.symptomsTriage"
                            )}
                        </h3>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.symptoms"
                                )}
                                :
                            </strong>{" "}
                            {record.triage.symptoms
                                ?.map(
                                    translateSymptom
                                )
                                .join(", ")}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.duration"
                                )}
                                :
                            </strong>{" "}
                            {record.triage.duration}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.severity"
                                )}
                                :
                            </strong>{" "}
                            {translateSeverity(
                                record.triage.severity
                            )}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.urgency"
                                )}
                                :
                            </strong>{" "}
                            {translateUrgency(
                                record.triage.urgencyLevel
                            )}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "healthRecords.recommendedAction"
                                )}
                                :
                            </strong>{" "}
                            {translateRecommendedAction(
                                record.triage
                                    .recommendedAction
                            )}
                        </p>

                        <hr />

                        {record.triage
                            .healthWorkerVitals ? (
                            <>
                                <h3>
                                    {t(
                                        "healthRecords.phcVitals"
                                    )}
                                </h3>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.temperature"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.triage
                                            .healthWorkerVitals
                                            .temperature
                                    }{" "}
                                    °F
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.oxygenLevel"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.triage
                                            .healthWorkerVitals
                                            .oxygenLevel
                                    }
                                    %
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.pulseRate"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.triage
                                            .healthWorkerVitals
                                            .pulseRate
                                    }{" "}
                                    bpm
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.bloodPressure"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.triage
                                            .healthWorkerVitals
                                            .bloodPressure
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.phcNotes"
                                        )}
                                        :
                                    </strong>{" "}
                                    {record.triage
                                        .healthWorkerVitals
                                        .notes ||
                                        t(
                                            "healthRecords.noNotes"
                                        )}
                                </p>
                            </>
                        ) : (
                            <p>
                                {t(
                                    "healthRecords.vitalsNotRecorded"
                                )}
                            </p>
                        )}

                        <hr />

                        {record.visit ? (
                            <>
                                <h3>
                                    {t(
                                        "healthRecords.healthcareFacility"
                                    )}
                                </h3>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.name"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.visit
                                            .facility?.name
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.type"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.visit
                                            .facility
                                            ?.facilityType
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.village"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.visit
                                            .facility?.village
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.district"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.visit
                                            .facility?.district
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.visitStatus"
                                        )}
                                        :
                                    </strong>{" "}
                                    {translateVisitStatus(
                                        record.visit.status
                                    )}
                                </p>
                            </>
                        ) : (
                            <p>
                                {t(
                                    "healthRecords.facilityNotSelected"
                                )}
                            </p>
                        )}

                        <hr />

                        {record.consultation ? (
                            <>
                                <h3>
                                    {t(
                                        "healthRecords.doctorConsultation"
                                    )}
                                </h3>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.doctor"
                                        )}
                                        :
                                    </strong>{" "}
                                    {record.consultation
                                        .doctor?.name ||
                                        record.consultation
                                            .doctor?.email}
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.assessment"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.consultation
                                            .assessment
                                    }
                                </p>

                                <p>
                                    <strong>
                                        {t(
                                            "healthRecords.decision"
                                        )}
                                        :
                                    </strong>{" "}
                                    {
                                        record.consultation
                                            .decision
                                    }
                                </p>

                                {record.consultation
                                    .prescription && (
                                    <p>
                                        <strong>
                                            {t(
                                                "healthRecords.prescription"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            record.consultation
                                                .prescription
                                        }
                                    </p>
                                )}

                                {record.consultation
                                    .referralReason && (
                                    <p>
                                        <strong>
                                            {t(
                                                "healthRecords.referralReason"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            record.consultation
                                                .referralReason
                                        }
                                    </p>
                                )}

                                {record.consultation
                                    .doctorNotes && (
                                    <p>
                                        <strong>
                                            {t(
                                                "healthRecords.doctorNotes"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            record.consultation
                                                .doctorNotes
                                        }
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>
                                {t(
                                    "healthRecords.consultationNotCompleted"
                                )}
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default HealthRecords;
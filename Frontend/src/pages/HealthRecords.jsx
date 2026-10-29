
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./HealthRecords.css";

const API_URL =
    "https://gramarogya-27q3.onrender.com/api/health-records/my";

const HealthRecords = () => {
    const { t, i18n } = useTranslation();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadCount, setReloadCount] = useState(0);

    const tr = useCallback(
        (key, fallback) =>
            t(key, { defaultValue: fallback }),
        [t]
    );

    useEffect(() => {
        let cancelled = false;

        const fetchHealthRecords = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        tr(
                            "healthRecords.loginRequired",
                            "Please log in to view your health records."
                        )
                    );
                }

                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        tr(
                            "healthRecords.fetchFailed",
                            "Unable to load your health records."
                        )
                    );
                }

                if (!cancelled) {
                    setRecords(
                        Array.isArray(data.healthRecords)
                            ? data.healthRecords
                            : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        tr(
                            "healthRecords.fetchFailed",
                            "Unable to load your health records."
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchHealthRecords();

        return () => {
            cancelled = true;
        };
    }, [reloadCount, tr]);

    const translateSymptom = (symptom) => {
        const symptomMap = {
            fever: "symptoms.fever",
            cough: "symptoms.cough",
            cold: "symptoms.cold",
            headache: "symptoms.headache",
            "body pain": "symptoms.bodyPain",
            bodypain: "symptoms.bodyPain",
            body_pain: "symptoms.bodyPain",
            weakness: "symptoms.weakness",
            "breathing difficulty": "symptoms.breathingDifficulty",
            breathingdifficulty: "symptoms.breathingDifficulty",
            breathing_difficulty: "symptoms.breathingDifficulty",
            "chest pain": "symptoms.chestPain",
            chestpain: "symptoms.chestPain",
            chest_pain: "symptoms.chestPain",
            vomiting: "symptoms.vomiting",
            diarrhea: "symptoms.diarrhea"
        };

        const normalized = String(symptom || "")
            .trim()
            .toLowerCase();

        const translationKey = symptomMap[normalized];

        return translationKey
            ? tr(translationKey, String(symptom))
            : symptom;
    };

    const translateSeverity = (severity) => {
        const value = String(severity || "").toLowerCase();

        const severityMap = {
            mild: "severity.mild",
            moderate: "severity.moderate",
            severe: "severity.severe"
        };

        return severityMap[value]
            ? tr(severityMap[value], value)
            : severity || tr("healthRecords.values.notRecorded", "Not recorded");
    };

    const translateUrgency = (urgency) => {
        const value = String(urgency || "").toLowerCase();

        const urgencyMap = {
            emergency: "healthRecords.values.emergency",
            urgent: "healthRecords.values.urgent",
            human_review: "healthRecords.values.humanReview",
            routine: "healthRecords.values.routine"
        };

        return urgencyMap[value]
            ? tr(urgencyMap[value], value.replace(/_/g, " "))
            : urgency || tr("healthRecords.values.notRecorded", "Not recorded");
    };

    const translateRecommendedAction = (action) => {
        const value = String(action || "").toLowerCase();

        const actionMap = {
            emergency_help: "healthRecords.values.emergencyHelp",
            urgent_phc: "healthRecords.values.urgentPhc",
            phc_visit: "healthRecords.values.phcVisit",
            telemedicine: "healthRecords.values.telemedicine",
            doctor_consultation: "healthRecords.values.doctorConsultation",
            routine: "healthRecords.values.routineAction"
        };

        return actionMap[value]
            ? tr(actionMap[value], value.replace(/_/g, " "))
            : action || tr("healthRecords.values.notRecorded", "Not recorded");
    };

    const translateVisitStatus = (status) => {
        const value = String(status || "").toLowerCase();

        const statusMap = {
            pending: "healthRecords.visitStatuses.pending",
            accepted: "healthRecords.visitStatuses.accepted",
            rejected: "healthRecords.visitStatuses.rejected",
            completed: "healthRecords.visitStatuses.completed",
            cancelled: "healthRecords.visitStatuses.cancelled"
        };

        return statusMap[value]
            ? tr(statusMap[value], value)
            : status || tr("healthRecords.values.notRecorded", "Not recorded");
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return tr("healthRecords.values.notRecorded", "Not recorded");
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return tr("healthRecords.values.notRecorded", "Not recorded");
        }

        try {
            const language = i18n.language || "en";

            return date.toLocaleDateString(language, {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return date.toLocaleDateString();
        }
    };

    const displayValue = (value, fallback) => {
        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {
            return fallback || tr(
                "healthRecords.values.notRecorded",
                "Not recorded"
            );
        }

        return value;
    };

    const getRecordKey = (record, index) =>
        record._id || record.triage?._id || `health-record-${index}`;

    if (loading) {
        return (
            <section className="health-records-page">
                <div className="health-records-layout">
                    <div className="health-records-state">
                        <span className="health-records-spinner" />

                        <h2>
                            {tr(
                                "healthRecords.loading",
                                "Loading health records..."
                            )}
                        </h2>

                        <p>
                            {tr(
                                "healthRecords.loadingDescription",
                                "Your health information is being retrieved securely."
                            )}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="health-records-page">
                <div className="health-records-layout">
                    <div className="health-records-state health-records-error-state">
                        <span className="health-records-state-icon">!</span>

                        <h2>
                            {tr(
                                "healthRecords.errorTitle",
                                "Unable to load health records"
                            )}
                        </h2>

                        <p role="alert">{error}</p>

                        <button
                            className="health-records-primary-button"
                            type="button"
                            onClick={() => setReloadCount((count) => count + 1)}
                        >
                            {tr("healthRecords.retry", "Try again")}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="health-records-page">
            <div className="health-records-layout">
                <header className="health-records-heading">
                    <div className="health-records-heading-icon" aria-hidden="true">
                        ▤
                    </div>

                    <div className="health-records-heading-copy">
                        <span className="health-records-eyebrow">
                            {tr("healthRecords.eyebrow", "PERSONAL HEALTH")}
                        </span>

                        <h2>
                            {tr("healthRecords.title", "My Health Records")}
                        </h2>

                        <p>
                            {tr(
                                "healthRecords.subtitle",
                                "Review your symptom checks, recorded vitals, facility visits and doctor consultations."
                            )}
                        </p>
                    </div>

                    <div className="health-records-count">
                        <strong>{records.length}</strong>
                        <span>
                            {records.length === 1
                                ? tr("healthRecords.recordSingular", "Record")
                                : tr("healthRecords.recordPlural", "Records")}
                        </span>
                    </div>
                </header>

                <div className="health-records-privacy-note" role="note">
                    <span aria-hidden="true">♧</span>

                    <p>
                        {tr(
                            "healthRecords.privacyNote",
                            "This page displays health information returned by your account. Keep your login credentials private."
                        )}
                    </p>
                </div>

                {records.length === 0 ? (
                    <div className="health-records-state health-records-empty-state">
                        <span className="health-records-state-icon" aria-hidden="true">
                            ▤
                        </span>

                        <h3>
                            {tr(
                                "healthRecords.noRecords",
                                "No health records available yet."
                            )}
                        </h3>

                        <p>
                            {tr(
                                "healthRecords.emptyDescription",
                                "Your records will appear here when health information is available for your account."
                            )}
                        </p>

                        <button
                            className="health-records-secondary-button"
                            type="button"
                            onClick={() => setReloadCount((count) => count + 1)}
                        >
                            {tr("healthRecords.refresh", "Refresh records")}
                        </button>
                    </div>
                ) : (
                    <div className="health-records-list">
                        {records.map((record, index) => {
                            const triage = record.triage || {};
                            const vitals = triage.healthWorkerVitals;
                            const visit = record.visit;
                            const facility = visit?.facility;
                            const consultation = record.consultation;

                            const symptoms = Array.isArray(triage.symptoms)
                                ? triage.symptoms
                                : [];

                            const urgencyClass = String(
                                triage.urgencyLevel || "unknown"
                            )
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-");

                            return (
                                <article
                                    className="health-record-card"
                                    key={getRecordKey(record, index)}
                                >
                                    <header className="health-record-card-header">
                                        <div className="health-record-card-title">
                                            <span
                                                className="health-record-card-icon"
                                                aria-hidden="true"
                                            >
                                                ▤
                                            </span>

                                            <div>
                                                <span className="health-records-eyebrow">
                                                    {tr(
                                                        "healthRecords.healthRecord",
                                                        "Health Record"
                                                    )}{" "}
                                                    {records.length - index}
                                                </span>

                                                <h3>
                                                    {tr(
                                                        "healthRecords.recordTitle",
                                                        "Health summary"
                                                    )}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="health-record-date">
                                            <span>
                                                {tr("healthRecords.date", "Date")}
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    triage.createdAt ||
                                                    record.createdAt
                                                )}
                                            </strong>
                                        </div>
                                    </header>

                                    <section className="health-record-section">
                                        <div className="health-record-section-title">
                                            <span className="health-record-section-icon">
                                                ♡
                                            </span>

                                            <div>
                                                <h4>
                                                    {tr(
                                                        "healthRecords.symptomsTriage",
                                                        "Symptom Assessment"
                                                    )}
                                                </h4>

                                                <p>
                                                    {tr(
                                                        "healthRecords.triageDescription",
                                                        "Symptoms and urgency guidance recorded for this assessment."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="health-record-info-grid">
                                            <div className="health-record-info">
                                                <span>
                                                    {tr(
                                                        "healthRecords.symptoms",
                                                        "Symptoms"
                                                    )}
                                                </span>

                                                {symptoms.length > 0 ? (
                                                    <div className="health-record-tags">
                                                        {symptoms.map((symptom, symptomIndex) => (
                                                            <span key={`${symptom}-${symptomIndex}`}>
                                                                {translateSymptom(symptom)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <strong>
                                                        {displayValue(null)}
                                                    </strong>
                                                )}
                                            </div>

                                            <div className="health-record-info">
                                                <span>
                                                    {tr(
                                                        "healthRecords.duration",
                                                        "Duration"
                                                    )}
                                                </span>

                                                <strong>
                                                    {displayValue(triage.duration)}
                                                </strong>
                                            </div>

                                            <div className="health-record-info">
                                                <span>
                                                    {tr(
                                                        "healthRecords.severity",
                                                        "Severity"
                                                    )}
                                                </span>

                                                <strong>
                                                    {translateSeverity(triage.severity)}
                                                </strong>
                                            </div>

                                            <div className="health-record-info">
                                                <span>
                                                    {tr(
                                                        "healthRecords.urgency",
                                                        "Urgency"
                                                    )}
                                                </span>

                                                <strong
                                                    className={`health-record-urgency-badge urgency-${urgencyClass}`}
                                                >
                                                    {translateUrgency(triage.urgencyLevel)}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="health-record-recommendation">
                                            <span>
                                                {tr(
                                                    "healthRecords.recommendedAction",
                                                    "Recommended action"
                                                )}
                                            </span>

                                            <p>
                                                {displayValue(
                                                    translateRecommendedAction(
                                                        triage.recommendedAction
                                                    ),
                                                    tr(
                                                        "healthRecords.values.notRecorded",
                                                        "Not recorded"
                                                    )
                                                )}
                                            </p>
                                        </div>
                                    </section>

                                    <section className="health-record-section">
                                        <div className="health-record-section-title">
                                            <span className="health-record-section-icon">
                                                ♥
                                            </span>

                                            <div>
                                                <h4>
                                                    {tr(
                                                        "healthRecords.phcVitals",
                                                        "PHC Vitals"
                                                    )}
                                                </h4>

                                                <p>
                                                    {tr(
                                                        "healthRecords.vitalsDescription",
                                                        "Measurements recorded by a health worker."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {vitals ? (
                                            <div className="health-record-vitals-grid">
                                                <div className="health-record-vital">
                                                    <span className="health-record-vital-icon">
                                                        ◉
                                                    </span>

                                                    <span>
                                                        {tr(
                                                            "healthRecords.temperature",
                                                            "Temperature"
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {displayValue(vitals.temperature)}
                                                        {vitals.temperature !== null &&
                                                        vitals.temperature !== undefined &&
                                                        vitals.temperature !== ""
                                                            ? " °F"
                                                            : ""}
                                                    </strong>
                                                </div>

                                                <div className="health-record-vital">
                                                    <span className="health-record-vital-icon">
                                                        ◎
                                                    </span>

                                                    <span>
                                                        {tr(
                                                            "healthRecords.oxygenLevel",
                                                            "Oxygen level"
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {displayValue(vitals.oxygenLevel)}
                                                        {vitals.oxygenLevel !== null &&
                                                        vitals.oxygenLevel !== undefined &&
                                                        vitals.oxygenLevel !== ""
                                                            ? "%"
                                                            : ""}
                                                    </strong>
                                                </div>

                                                <div className="health-record-vital">
                                                    <span className="health-record-vital-icon">
                                                        ♥
                                                    </span>

                                                    <span>
                                                        {tr(
                                                            "healthRecords.pulseRate",
                                                            "Pulse rate"
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {displayValue(vitals.pulseRate)}
                                                        {vitals.pulseRate !== null &&
                                                        vitals.pulseRate !== undefined &&
                                                        vitals.pulseRate !== ""
                                                            ? " bpm"
                                                            : ""}
                                                    </strong>
                                                </div>

                                                <div className="health-record-vital">
                                                    <span className="health-record-vital-icon">
                                                        ↕
                                                    </span>

                                                    <span>
                                                        {tr(
                                                            "healthRecords.bloodPressure",
                                                            "Blood pressure"
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {displayValue(vitals.bloodPressure)}
                                                    </strong>
                                                </div>

                                                <div className="health-record-vital health-record-vital-notes">
                                                    <span>
                                                        {tr(
                                                            "healthRecords.phcNotes",
                                                            "PHC notes"
                                                        )}
                                                    </span>

                                                    <p>
                                                        {displayValue(
                                                            vitals.notes,
                                                            tr(
                                                                "healthRecords.noNotes",
                                                                "No notes recorded"
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="health-record-not-available">
                                                <span aria-hidden="true">ⓘ</span>

                                                <p>
                                                    {tr(
                                                        "healthRecords.vitalsNotRecorded",
                                                        "Vitals have not been recorded for this visit."
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </section>

                                    <section className="health-record-section">
                                        <div className="health-record-section-title">
                                            <span className="health-record-section-icon">
                                                ⌖
                                            </span>

                                            <div>
                                                <h4>
                                                    {tr(
                                                        "healthRecords.healthcareFacility",
                                                        "Healthcare Facility"
                                                    )}
                                                </h4>

                                                <p>
                                                    {tr(
                                                        "healthRecords.facilityDescription",
                                                        "Facility details and visit status."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {visit ? (
                                            <>
                                                {facility ? (
                                                    <div className="health-record-facility">
                                                        <span className="health-record-facility-icon">
                                                            ✚
                                                        </span>

                                                        <div className="health-record-facility-details">
                                                            <strong>
                                                                {displayValue(facility.name)}
                                                            </strong>

                                                            <span>
                                                                {displayValue(
                                                                    facility.facilityType
                                                                )}
                                                            </span>

                                                            <p>
                                                                {[
                                                                    facility.village,
                                                                    facility.district,
                                                                    facility.state
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(", ") ||
                                                                    tr(
                                                                        "healthRecords.values.notRecorded",
                                                                        "Not recorded"
                                                                    )}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`health-record-visit-status status-${String(
                                                                visit.status || "unknown"
                                                            )
                                                                .toLowerCase()
                                                                .replace(
                                                                    /[^a-z0-9-]/g,
                                                                    "-"
                                                                )}`}
                                                        >
                                                            {translateVisitStatus(
                                                                visit.status
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="health-record-not-available">
                                                        <p>
                                                            {tr(
                                                                "healthRecords.facilityNotSelected",
                                                                "Facility details are not available."
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="health-record-not-available">
                                                <span aria-hidden="true">ⓘ</span>

                                                <p>
                                                    {tr(
                                                        "healthRecords.facilityNotSelected",
                                                        "No healthcare facility is linked to this record yet."
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </section>

                                    <section className="health-record-section health-record-consultation-section">
                                        <div className="health-record-section-title">
                                            <span className="health-record-section-icon">
                                                ☏
                                            </span>

                                            <div>
                                                <h4>
                                                    {tr(
                                                        "healthRecords.doctorConsultation",
                                                        "Doctor Consultation"
                                                    )}
                                                </h4>

                                                <p>
                                                    {tr(
                                                        "healthRecords.consultationDescription",
                                                        "Assessment and care details recorded by the doctor."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {consultation ? (
                                            <div className="health-record-consultation">
                                                <div className="health-record-consultation-doctor">
                                                    <span className="health-record-doctor-avatar">
                                                        +
                                                    </span>

                                                    <div>
                                                        <span>
                                                            {tr(
                                                                "healthRecords.doctor",
                                                                "Doctor"
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {consultation.doctor?.name ||
                                                            consultation.doctor?.email ||
                                                            tr(
                                                                "healthRecords.values.notRecorded",
                                                                "Not recorded"
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>

                                                <div className="health-record-consultation-field">
                                                    <span>
                                                        {tr(
                                                            "healthRecords.assessment",
                                                            "Assessment"
                                                        )}
                                                    </span>

                                                    <p>
                                                        {displayValue(
                                                            consultation.assessment
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="health-record-consultation-field">
                                                    <span>
                                                        {tr(
                                                            "healthRecords.decision",
                                                            "Decision"
                                                        )}
                                                    </span>

                                                    <p>
                                                        {displayValue(
                                                            consultation.decision
                                                        )}
                                                    </p>
                                                </div>

                                                {consultation.prescription && (
                                                    <div className="health-record-consultation-field">
                                                        <span>
                                                            {tr(
                                                                "healthRecords.prescription",
                                                                "Prescription"
                                                            )}
                                                        </span>

                                                        <p>
                                                            {consultation.prescription}
                                                        </p>
                                                    </div>
                                                )}

                                                {consultation.referralReason && (
                                                    <div className="health-record-consultation-field">
                                                        <span>
                                                            {tr(
                                                                "healthRecords.referralReason",
                                                                "Referral reason"
                                                            )}
                                                        </span>

                                                        <p>
                                                            {consultation.referralReason}
                                                        </p>
                                                    </div>
                                                )}

                                                {consultation.doctorNotes && (
                                                    <div className="health-record-consultation-field">
                                                        <span>
                                                            {tr(
                                                                "healthRecords.doctorNotes",
                                                                "Doctor notes"
                                                            )}
                                                        </span>

                                                        <p>
                                                            {consultation.doctorNotes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="health-record-not-available">
                                                <span aria-hidden="true">ⓘ</span>

                                                <p>
                                                    {tr(
                                                        "healthRecords.consultationNotCompleted",
                                                        "A doctor consultation has not been recorded for this visit."
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </section>

                                    <footer className="health-record-card-footer">
                                        <span>
                                            <span className="health-record-footer-dot" />
                                            {tr(
                                                "healthRecords.recordFooter",
                                                "Personal health record"
                                            )}
                                        </span>

                                        <span>{formatDate(record.createdAt || triage.createdAt)}</span>
                                    </footer>
                                </article>
                            );
                        })}
                    </div>
                )}

                <footer className="health-records-footer-note">
                    <span aria-hidden="true">ⓘ</span>

                    <p>
                        {tr(
                            "healthRecords.medicalDisclaimer",
                            "These records help you review the information stored in GramArogya. Consult a qualified healthcare professional for medical decisions."
                        )}
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default HealthRecords;


import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import "./DoctorDashboard.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api";

const DoctorDashboard = () => {
    const { t, i18n } = useTranslation();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [assessment, setAssessment] = useState("");
    const [decision, setDecision] = useState("treatment");
    const [prescription, setPrescription] = useState("");
    const [referralReason, setReferralReason] = useState("");
    const [doctorNotes, setDoctorNotes] = useState("");

    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState("");
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [saving, setSaving] = useState(false);

    const [teleconsultations, setTeleconsultations] = useState([]);
    const [loadingTeleconsultations, setLoadingTeleconsultations] =
        useState(false);

    const [followUps, setFollowUps] = useState([]);
    const [loadingFollowUps, setLoadingFollowUps] = useState(false);
    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpReason, setFollowUpReason] = useState("");
    const [followUpNotes, setFollowUpNotes] = useState("");
    const [creatingFollowUp, setCreatingFollowUp] = useState(false);
    const [updatingFollowUpId, setUpdatingFollowUpId] = useState("");

    const tr = useCallback(
        (key, fallback) => t(key, { defaultValue: fallback }),
        [t]
    );

    const token = () => localStorage.getItem("token");

    const readResponse = async (response) =>
        response.json().catch(() => ({}));

    const getErrorMessage = (data, fallback) =>
        data.message || fallback;

    const clearMessages = () => {
        setError("");
        setNotice("");
    };

    // Fetch patients awaiting doctor review
    const fetchPatients = async () => {
        clearMessages();
        setLoading(true);

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/visits/doctor-patients`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr("doctorDashboard.fetchPatientsFailed", "Failed to fetch patients.")
                    )
                );
            }

            setPatients(
                Array.isArray(data.visitRequests)
                    ? data.visitRequests
                    : []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch active healthcare facilities
    const fetchFacilities = async () => {
        setLoadingFacilities(true);

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            setLoadingFacilities(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/facilities/active`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr("doctorDashboard.fetchFacilitiesFailed", "Failed to fetch facilities.")
                    )
                );
            }

            setFacilities(
                Array.isArray(data.facilities) ? data.facilities : []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingFacilities(false);
        }
    };

    // Fetch doctor's teleconsultations
    const fetchTeleconsultations = async () => {
        clearMessages();
        setLoadingTeleconsultations(true);

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            setLoadingTeleconsultations(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/teleconsultations/doctor`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr(
                            "doctorDashboard.fetchTeleconsultationsFailed",
                            "Failed to fetch teleconsultations."
                        )
                    )
                );
            }

            setTeleconsultations(
                Array.isArray(data.teleconsultations)
                    ? data.teleconsultations
                    : []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingTeleconsultations(false);
        }
    };

    // Fetch doctor's follow-ups
    const fetchFollowUps = async () => {
        clearMessages();
        setLoadingFollowUps(true);

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            setLoadingFollowUps(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/follow-ups/doctor`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr("doctorDashboard.fetchFollowUpsFailed", "Failed to fetch follow-ups.")
                    )
                );
            }

            setFollowUps(
                Array.isArray(data.followUps) ? data.followUps : []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingFollowUps(false);
        }
    };

    // Open the selected patient consultation form
    const openConsultation = async (patient) => {
        setSelectedPatient(patient);
        setAssessment("");
        setDecision("treatment");
        setPrescription("");
        setReferralReason("");
        setSelectedFacility("");
        setDoctorNotes("");
        setFollowUpDate("");
        setFollowUpReason("");
        setFollowUpNotes("");
        clearMessages();

        await fetchFacilities();
    };

    // Close the consultation editor
    const closeConsultation = () => {
        setSelectedPatient(null);
        setAssessment("");
        setDecision("treatment");
        setPrescription("");
        setReferralReason("");
        setSelectedFacility("");
        setDoctorNotes("");
        setFollowUpDate("");
        setFollowUpReason("");
        setFollowUpNotes("");
        clearMessages();
    };

    // Create a follow-up for the currently selected patient
    const createFollowUp = async (event) => {
        event.preventDefault();
        clearMessages();

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            return;
        }

        if (!selectedPatient) {
            setError(tr("doctorDashboard.selectPatient", "Please select a patient first."));
            return;
        }

        if (!followUpDate) {
            setError(tr("doctorDashboard.followUpDateRequired", "Follow-up date is required."));
            return;
        }

        if (!followUpReason.trim()) {
            setError(tr("doctorDashboard.followUpReasonRequired", "Follow-up reason is required."));
            return;
        }

        const parsedDate = new Date(followUpDate);

        if (Number.isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
            setError(
                tr(
                    "doctorDashboard.followUpDateFuture",
                    "Please select a future follow-up date and time."
                )
            );
            return;
        }

        setCreatingFollowUp(true);

        try {
            const response = await fetch(`${API_URL}/follow-ups`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    visitRequestId: selectedPatient._id,
                    followUpDate: parsedDate.toISOString(),
                    reason: followUpReason.trim(),
                    notes: followUpNotes.trim()
                })
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr("doctorDashboard.createFollowUpFailed", "Failed to create follow-up.")
                    )
                );
            }

            if (data.followUp) {
                setFollowUps((current) => [data.followUp, ...current]);
            }

            setFollowUpDate("");
            setFollowUpReason("");
            setFollowUpNotes("");
            setNotice(
                tr(
                    "doctorDashboard.followUpCreated",
                    "Follow-up created successfully."
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setCreatingFollowUp(false);
        }
    };

    // Update a follow-up status
    const updateFollowUpStatus = async (followUpId, status) => {
        clearMessages();

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            return;
        }

        setUpdatingFollowUpId(followUpId);

        try {
            const response = await fetch(
                `${API_URL}/follow-ups/${followUpId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr("doctorDashboard.updateFollowUpFailed", "Failed to update follow-up.")
                    )
                );
            }

            setFollowUps((current) =>
                current.map((followUp) =>
                    followUp._id === followUpId
                        ? { ...followUp, status }
                        : followUp
                )
            );

            setNotice(
                tr(
                    "doctorDashboard.followUpStatusUpdated",
                    "Follow-up status updated."
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingFollowUpId("");
        }
    };

    // Update teleconsultation status
    const updateTeleconsultationStatus = async (consultationId, status) => {
        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            return false;
        }

        try {
            clearMessages();

            const response = await fetch(
                `${API_URL}/teleconsultations/${consultationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        tr(
                            "doctorDashboard.updateConsultationFailed",
                            "Failed to update consultation."
                        )
                    )
                );
            }

            setTeleconsultations((current) =>
                current.map((consultation) =>
                    consultation._id === consultationId
                        ? { ...consultation, status }
                        : consultation
                )
            );

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const openMeetingLink = (meetingLink) => {
        if (!meetingLink) {
            setError(
                tr(
                    "doctorDashboard.meetingLinkUnavailable",
                    "A meeting link is not available."
                )
            );
            return false;
        }

        try {
            const url = new URL(meetingLink);

            if (!["https:", "http:"].includes(url.protocol)) {
                throw new Error("Invalid meeting link");
            }

            window.open(url.href, "_blank", "noopener,noreferrer");
            return true;
        } catch {
            setError(
                tr(
                    "doctorDashboard.invalidMeetingLink",
                    "The meeting link is not valid."
                )
            );
            return false;
        }
    };

    const startTeleconsultation = async (consultation) => {
        if (!consultation.meetingLink) {
            setError(
                tr(
                    "doctorDashboard.meetingLinkUnavailable",
                    "A meeting link is not available."
                )
            );
            return;
        }

        const success = await updateTeleconsultationStatus(
            consultation._id,
            "ongoing"
        );

        if (success) {
            openMeetingLink(consultation.meetingLink);
        }
    };

    const joinTeleconsultation = (consultation) => {
        openMeetingLink(consultation.meetingLink);
    };

    const completeTeleconsultation = async (consultation) => {
        await updateTeleconsultationStatus(
            consultation._id,
            "completed"
        );
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return tr("doctorDashboard.notAvailable", "Not available");
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return tr("doctorDashboard.notAvailable", "Not available");
        }

        const localeMap = {
            en: "en-IN",
            mr: "mr-IN",
            hi: "hi-IN"
        };

        const language = i18n.language?.split("-")[0];

        return date.toLocaleString(
            localeMap[language] || "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

    const humanize = (value) =>
        String(value || "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const statusClass = (status) =>
        `doctor-status-${String(status || "unknown")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")}`;

    const handleSaveConsultation = async () => {
        clearMessages();

        const authToken = token();

        if (!authToken) {
            setError(tr("doctorDashboard.loginRequired", "Please log in to continue."));
            return;
        }

        if (!selectedPatient) {
            setError(tr("doctorDashboard.selectPatient", "Please select a patient."));
            return;
        }

        if (!assessment.trim()) {
            setError(tr("doctorDashboard.assessmentRequired", "Assessment is required."));
            return;
        }

        if (decision === "treatment" && !prescription.trim()) {
            setError(
                tr("doctorDashboard.prescriptionRequired", "Prescription is required for treatment.")
            );
            return;
        }

        if (decision === "referral") {
            if (!referralReason.trim()) {
                setError(
                    tr("doctorDashboard.referralReasonRequired", "Referral reason is required.")
                );
                return;
            }

            if (!selectedFacility) {
                setError(
                    tr("doctorDashboard.referralFacilityRequired", "Please select a referral facility.")
                );
                return;
            }
        }

        setSaving(true);

        try {
            const consultationResponse = await fetch(
                `${API_URL}/consultations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        visitRequestId: selectedPatient._id,
                        assessment: assessment.trim(),
                        decision,
                        prescription:
                            decision === "treatment"
                                ? prescription.trim()
                                : "",
                        referralReason:
                            decision === "referral"
                                ? referralReason.trim()
                                : "",
                        doctorNotes: doctorNotes.trim()
                    })
                }
            );

            const consultationData = await readResponse(
                consultationResponse
            );

            if (!consultationResponse.ok) {
                throw new Error(
                    getErrorMessage(
                        consultationData,
                        tr(
                            "doctorDashboard.saveConsultationFailed",
                            "Failed to save consultation."
                        )
                    )
                );
            }

            if (decision === "referral") {
                const referralResponse = await fetch(
                    `${API_URL}/referrals`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`
                        },
                        body: JSON.stringify({
                            visitRequestId: selectedPatient._id,
                            reason: referralReason.trim(),
                            referredFacilityId: selectedFacility,
                            doctorNotes: doctorNotes.trim()
                        })
                    }
                );

                const referralData = await readResponse(referralResponse);

                if (!referralResponse.ok) {
                    throw new Error(
                        getErrorMessage(
                            referralData,
                            tr(
                                "doctorDashboard.referralCreationFailed",
                                "Consultation saved, but referral creation failed. Refresh and check the existing records before retrying."
                            )
                        )
                    );
                }

                setNotice(
                    tr(
                        "doctorDashboard.consultationReferralSaved",
                        "Consultation and referral saved successfully."
                    )
                );
            } else {
                setNotice(
                    tr(
                        "doctorDashboard.consultationSaved",
                        "Consultation saved successfully."
                    )
                );
            }

            setPatients((current) =>
                current.filter(
                    (patient) => patient._id !== selectedPatient._id
                )
            );

            setSelectedPatient(null);
            setAssessment("");
            setDecision("treatment");
            setPrescription("");
            setReferralReason("");
            setSelectedFacility("");
            setDoctorNotes("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const patientCount = patients.length;
    const activeConsultations = teleconsultations.filter(
        (item) =>
            item.status === "scheduled" || item.status === "ongoing"
    ).length;
    const upcomingFollowUps = followUps.filter(
        (item) => item.status === "upcoming"
    ).length;

    return (
        <div className="doctor-dashboard">
            <header className="doctor-topbar">
                <div className="doctor-brand">
                    <span className="doctor-brand-mark">G</span>

                    <span>
                        <strong>GramArogya</strong>
                        <small>
                            {tr(
                                "doctorDashboard.brandSubtitle",
                                "Healthcare workspace"
                            )}
                        </small>
                    </span>
                </div>

                <div className="doctor-topbar-actions">
                    <span className="doctor-role-badge">
                        <span />
                        {tr("doctorDashboard.doctorRole", "Doctor workspace")}
                    </span>

                    <LanguageSelector />
                </div>
            </header>

            <main className="doctor-dashboard-main">
                <section className="doctor-welcome">
                    <div>
                        <span className="doctor-eyebrow">
                            {tr(
                                "doctorDashboard.welcomeEyebrow",
                                "CLINICAL WORKSPACE"
                            )}
                        </span>

                        <h1>{tr("doctorDashboard.title", "Doctor Dashboard")}</h1>

                        <p>
                            {tr(
                                "doctorDashboard.subtitle",
                                "Review patient information, manage consultations, and coordinate follow-up care."
                            )}
                        </p>
                    </div>

                    <div className="doctor-welcome-icon" aria-hidden="true">
                        <span>+</span>
                    </div>
                </section>

                <section className="doctor-stats-grid" aria-label="Dashboard summary">
                    <article className="doctor-stat-card">
                        <span className="doctor-stat-icon doctor-stat-green">♧</span>
                        <div>
                            <span>
                                {tr("doctorDashboard.patientQueue", "Patient queue")}
                            </span>
                            <strong>{patientCount}</strong>
                            <small>
                                {tr(
                                    "doctorDashboard.patientQueueCaption",
                                    "Loaded for review"
                                )}
                            </small>
                        </div>
                    </article>

                    <article className="doctor-stat-card">
                        <span className="doctor-stat-icon doctor-stat-blue">☏</span>
                        <div>
                            <span>
                                {tr(
                                    "doctorDashboard.activeTeleconsultations",
                                    "Active consultations"
                                )}
                            </span>
                            <strong>{activeConsultations}</strong>
                            <small>
                                {tr(
                                    "doctorDashboard.teleconsultationCaption",
                                    "Scheduled or ongoing"
                                )}
                            </small>
                        </div>
                    </article>

                    <article className="doctor-stat-card">
                        <span className="doctor-stat-icon doctor-stat-gold">◷</span>
                        <div>
                            <span>
                                {tr(
                                    "doctorDashboard.upcomingFollowUps",
                                    "Upcoming follow-ups"
                                )}
                            </span>
                            <strong>{upcomingFollowUps}</strong>
                            <small>
                                {tr(
                                    "doctorDashboard.followUpCaption",
                                    "In the loaded list"
                                )}
                            </small>
                        </div>
                    </article>
                </section>

                {(error || notice) && (
                    <div
                        className={`doctor-banner ${
                            error ? "doctor-banner-error" : "doctor-banner-success"
                        }`}
                        role={error ? "alert" : "status"}
                        aria-live="polite"
                    >
                        <span aria-hidden="true">{error ? "!" : "✓"}</span>
                        <p>{error || notice}</p>

                        <button
                            type="button"
                            onClick={() => {
                                setError("");
                                setNotice("");
                            }}
                            aria-label={tr("doctorDashboard.dismiss", "Dismiss message")}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Patient queue */}
                <section className="doctor-panel">
                    <header className="doctor-panel-header">
                        <div className="doctor-panel-title">
                            <span className="doctor-panel-icon">♧</span>

                            <div>
                                <span className="doctor-eyebrow">
                                    {tr("doctorDashboard.patientSectionEyebrow", "PATIENT CARE")}
                                </span>

                                <h2>
                                    {tr(
                                        "doctorDashboard.patientsForReview",
                                        "Patients for Review"
                                    )}
                                </h2>

                                <p>
                                    {tr(
                                        "doctorDashboard.patientQueueDescription",
                                        "Review the triage information and vitals recorded at the PHC."
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            className="doctor-button doctor-button-primary"
                            type="button"
                            onClick={fetchPatients}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="doctor-spinner" />
                                    {tr("doctorDashboard.loadingPatients", "Loading patients...")}
                                </>
                            ) : (
                                <>
                                    ↻
                                    {tr("doctorDashboard.viewPatients", "Load patients")}
                                </>
                            )}
                        </button>
                    </header>

                    {patients.length === 0 && !loading ? (
                        <div className="doctor-empty-state">
                            <span aria-hidden="true">✓</span>

                            <h3>
                                {tr(
                                    "doctorDashboard.noPatientsWaiting",
                                    "No patients currently loaded"
                                )}
                            </h3>

                            <p>
                                {tr(
                                    "doctorDashboard.noPatientsDescription",
                                    "Select Load patients to retrieve visit requests awaiting doctor review."
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="doctor-patient-grid">
                            {patients.map((request) => {
                                const triage = request.triageRecord || {};
                                const vitals = triage.healthWorkerVitals || {};
                                const symptoms = Array.isArray(triage.symptoms)
                                    ? triage.symptoms
                                    : [];

                                return (
                                    <article
                                        className="doctor-patient-card"
                                        key={request._id}
                                    >
                                        <header className="doctor-patient-card-header">
                                            <span className="doctor-patient-avatar">
                                                {(request.patient?.name || "P")
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>

                                            <div className="doctor-patient-name">
                                                <h3>
                                                    {request.patient?.name ||
                                                        tr("doctorDashboard.unknown", "Unknown patient")}
                                                </h3>

                                                <p>
                                                    {request.patient?.email ||
                                                        tr("doctorDashboard.notAvailable", "Not available")}
                                                </p>
                                            </div>

                                            <span className="doctor-status-badge doctor-status-pending">
                                                {humanize(request.status || "pending")}
                                            </span>
                                        </header>

                                        <div className="doctor-patient-facility">
                                            <span aria-hidden="true">⌖</span>
                                            <div>
                                                <span>
                                                    {tr(
                                                        "doctorDashboard.healthcareFacility",
                                                        "Healthcare facility"
                                                    )}
                                                </span>
                                                <strong>
                                                    {request.facility?.name ||
                                                        tr("doctorDashboard.notAvailable", "Not available")}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="doctor-card-subheading">
                                            {tr(
                                                "doctorDashboard.triageInformation",
                                                "Triage information"
                                            )}
                                        </div>

                                        <div className="doctor-mini-grid">
                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.symptoms", "Symptoms")}
                                                </span>
                                                <strong>
                                                    {symptoms.length
                                                        ? symptoms.join(", ")
                                                        : tr("doctorDashboard.notAvailable", "Not available")}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.duration", "Duration")}
                                                </span>
                                                <strong>
                                                    {triage.duration ||
                                                        tr("doctorDashboard.notAvailable", "Not available")}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.severity", "Severity")}
                                                </span>
                                                <strong>
                                                    {humanize(triage.severity) ||
                                                        tr("doctorDashboard.notAvailable", "Not available")}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.urgency", "Urgency")}
                                                </span>
                                                <strong
                                                    className={`doctor-urgency doctor-urgency-${String(
                                                        triage.urgencyLevel || "unknown"
                                                    )
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9-]/g, "-")}`}
                                                >
                                                    {humanize(triage.urgencyLevel) ||
                                                        tr("doctorDashboard.notAvailable", "Not available")}
                                                </strong>
                                            </div>
                                        </div>

                                        {triage.recommendedAction && (
                                            <div className="doctor-recommended-action">
                                                <span>
                                                    {tr(
                                                        "doctorDashboard.recommendedAction",
                                                        "Recommended action"
                                                    )}
                                                </span>

                                                <p>
                                                    {humanize(triage.recommendedAction)}
                                                </p>
                                            </div>
                                        )}

                                        <div className="doctor-card-subheading">
                                            {tr(
                                                "doctorDashboard.phcRecordedVitals",
                                                "PHC-recorded vitals"
                                            )}
                                        </div>

                                        <div className="doctor-vitals-grid">
                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.temperature", "Temperature")}
                                                </span>
                                                <strong>
                                                    {vitals.temperature !== undefined &&
                                                    vitals.temperature !== null &&
                                                    vitals.temperature !== ""
                                                        ? `${vitals.temperature} °F`
                                                        : "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.oxygenLevel", "Oxygen level")}
                                                </span>
                                                <strong>
                                                    {vitals.oxygenLevel !== undefined &&
                                                    vitals.oxygenLevel !== null &&
                                                    vitals.oxygenLevel !== ""
                                                        ? `${vitals.oxygenLevel}%`
                                                        : "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.pulseRate", "Pulse rate")}
                                                </span>
                                                <strong>
                                                    {vitals.pulseRate !== undefined &&
                                                    vitals.pulseRate !== null &&
                                                    vitals.pulseRate !== ""
                                                        ? `${vitals.pulseRate} bpm`
                                                        : "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {tr("doctorDashboard.bloodPressure", "Blood pressure")}
                                                </span>
                                                <strong>
                                                    {vitals.bloodPressure || "—"}
                                                </strong>
                                            </div>
                                        </div>

                                        {vitals.notes && (
                                            <p className="doctor-phc-notes">
                                                <strong>
                                                    {tr("doctorDashboard.phcNotes", "PHC notes")}:
                                                </strong>{" "}
                                                {vitals.notes}
                                            </p>
                                        )}

                                        <button
                                            className="doctor-button doctor-button-primary doctor-review-button"
                                            type="button"
                                            onClick={() => openConsultation(request)}
                                        >
                                            {tr("doctorDashboard.reviewPatient", "Review patient")}
                                            <span aria-hidden="true">→</span>
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Consultation editor */}
                {selectedPatient && (
                    <section className="doctor-panel doctor-consultation-panel">
                        <header className="doctor-panel-header">
                            <div className="doctor-panel-title">
                                <span className="doctor-panel-icon">✚</span>

                                <div>
                                    <span className="doctor-eyebrow">
                                        {tr("doctorDashboard.consultationEyebrow", "CLINICAL REVIEW")}
                                    </span>

                                    <h2>
                                        {tr(
                                            "doctorDashboard.doctorConsultation",
                                            "Doctor Consultation"
                                        )}
                                    </h2>

                                    <p>
                                        {tr("doctorDashboard.patientLabel", "Patient")}:{" "}
                                        <strong>
                                            {selectedPatient.patient?.name ||
                                                tr("doctorDashboard.unknown", "Unknown")}
                                        </strong>
                                    </p>
                                </div>
                            </div>

                            <button
                                className="doctor-button doctor-button-secondary"
                                type="button"
                                onClick={closeConsultation}
                                disabled={saving}
                            >
                                {tr("doctorDashboard.backToPatients", "Close review")}
                            </button>
                        </header>

                        <div className="doctor-selected-patient-summary">
                            <div>
                                <span>
                                    {tr("doctorDashboard.symptoms", "Symptoms")}
                                </span>
                                <strong>
                                    {selectedPatient.triageRecord?.symptoms?.join(", ") ||
                                        tr("doctorDashboard.notAvailable", "Not available")}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {tr("doctorDashboard.severity", "Severity")}
                                </span>
                                <strong>
                                    {humanize(selectedPatient.triageRecord?.severity) || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {tr("doctorDashboard.urgency", "Urgency")}
                                </span>
                                <strong>
                                    {humanize(
                                        selectedPatient.triageRecord?.urgencyLevel
                                    ) || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {tr("doctorDashboard.temperature", "Temperature")}
                                </span>
                                <strong>
                                    {selectedPatient.triageRecord?.healthWorkerVitals?.temperature ??
                                        "—"}
                                    {selectedPatient.triageRecord?.healthWorkerVitals?.temperature !==
                                        undefined &&
                                    selectedPatient.triageRecord?.healthWorkerVitals?.temperature !==
                                        null
                                        ? " °F"
                                        : ""}
                                </strong>
                            </div>
                        </div>

                        {loadingFacilities && (
                            <p className="doctor-inline-loading">
                                <span className="doctor-spinner" />
                                {tr(
                                    "doctorDashboard.loadingFacilities",
                                    "Loading facilities..."
                                )}
                            </p>
                        )}

                        <div className="doctor-form">
                            <div className="doctor-form-section">
                                <label htmlFor="doctor-assessment">
                                    {tr(
                                        "doctorDashboard.doctorAssessment",
                                        "Doctor assessment"
                                    )}
                                    <span>*</span>
                                </label>

                                <textarea
                                    id="doctor-assessment"
                                    value={assessment}
                                    onChange={(e) => setAssessment(e.target.value)}
                                    placeholder={tr(
                                        "doctorDashboard.assessmentPlaceholder",
                                        "Enter your clinical assessment..."
                                    )}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="doctor-form-section">
                                <label htmlFor="doctor-decision">
                                    {tr(
                                        "doctorDashboard.consultationDecision",
                                        "Consultation decision"
                                    )}
                                </label>

                                <select
                                    id="doctor-decision"
                                    value={decision}
                                    onChange={(e) => {
                                        const nextDecision = e.target.value;
                                        setDecision(nextDecision);
                                        clearMessages();

                                        if (nextDecision === "referral") {
                                            fetchFacilities();
                                        } else {
                                            setSelectedFacility("");
                                            setReferralReason("");
                                        }
                                    }}
                                >
                                    <option value="treatment">
                                        {tr("doctorDashboard.treatment", "Treatment")}
                                    </option>

                                    <option value="referral">
                                        {tr("doctorDashboard.referral", "Referral")}
                                    </option>
                                </select>
                            </div>

                            {decision === "treatment" && (
                                <div className="doctor-form-section">
                                    <label htmlFor="doctor-prescription">
                                        {tr(
                                            "doctorDashboard.prescription",
                                            "Prescription"
                                        )}
                                        <span>*</span>
                                    </label>

                                    <textarea
                                        id="doctor-prescription"
                                        value={prescription}
                                        onChange={(e) =>
                                            setPrescription(e.target.value)
                                        }
                                        placeholder={tr(
                                            "doctorDashboard.prescriptionPlaceholder",
                                            "Enter the treatment or prescription details..."
                                        )}
                                        rows={4}
                                        required
                                    />
                                </div>
                            )}

                            {decision === "referral" && (
                                <>
                                    <div className="doctor-form-section">
                                        <label htmlFor="doctor-referral-facility">
                                            {tr(
                                                "doctorDashboard.referralFacility",
                                                "Referral facility"
                                            )}
                                            <span>*</span>
                                        </label>

                                        <select
                                            id="doctor-referral-facility"
                                            value={selectedFacility}
                                            onChange={(e) =>
                                                setSelectedFacility(e.target.value)
                                            }
                                            required
                                            disabled={loadingFacilities}
                                        >
                                            <option value="">
                                                {tr(
                                                    "doctorDashboard.selectReferralFacility",
                                                    "Select a facility"
                                                )}
                                            </option>

                                            {facilities.map((facility) => (
                                                <option
                                                    key={facility._id}
                                                    value={facility._id}
                                                >
                                                    {facility.name} — {facility.facilityType}
                                                    {facility.district
                                                        ? ` — ${facility.district}`
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>

                                        {!loadingFacilities &&
                                            facilities.length === 0 && (
                                                <small>
                                                    {tr(
                                                        "doctorDashboard.noReferralFacilities",
                                                        "No active referral facilities are available."
                                                    )}
                                                </small>
                                            )}
                                    </div>

                                    <div className="doctor-form-section">
                                        <label htmlFor="doctor-referral-reason">
                                            {tr(
                                                "doctorDashboard.referralReason",
                                                "Referral reason"
                                            )}
                                            <span>*</span>
                                        </label>

                                        <textarea
                                            id="doctor-referral-reason"
                                            value={referralReason}
                                            onChange={(e) =>
                                                setReferralReason(e.target.value)
                                            }
                                            placeholder={tr(
                                                "doctorDashboard.referralReasonPlaceholder",
                                                "Explain why specialist care is needed..."
                                            )}
                                            rows={4}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="doctor-form-section">
                                <label htmlFor="doctor-notes">
                                    {tr("doctorDashboard.doctorNotes", "Doctor notes")}
                                </label>

                                <textarea
                                    id="doctor-notes"
                                    value={doctorNotes}
                                    onChange={(e) => setDoctorNotes(e.target.value)}
                                    placeholder={tr(
                                        "doctorDashboard.doctorNotesPlaceholder",
                                        "Add any additional notes (optional)..."
                                    )}
                                    rows={3}
                                />
                            </div>

                            <div className="doctor-form-actions">
                                <button
                                    className="doctor-button doctor-button-secondary"
                                    type="button"
                                    onClick={closeConsultation}
                                    disabled={saving}
                                >
                                    {tr("doctorDashboard.backToPatients", "Cancel")}
                                </button>

                                <button
                                    className="doctor-button doctor-button-primary"
                                    type="button"
                                    onClick={handleSaveConsultation}
                                    disabled={
                                        saving ||
                                        loadingFacilities ||
                                        (decision === "referral" &&
                                            facilities.length === 0)
                                    }
                                >
                                    {saving ? (
                                        <>
                                            <span className="doctor-spinner" />
                                            {tr(
                                                "doctorDashboard.savingConsultation",
                                                "Saving consultation..."
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {tr(
                                                "doctorDashboard.saveConsultation",
                                                "Save consultation"
                                            )}
                                            <span aria-hidden="true">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Teleconsultations */}
                <section className="doctor-panel">
                    <header className="doctor-panel-header">
                        <div className="doctor-panel-title">
                            <span className="doctor-panel-icon doctor-icon-blue">☏</span>

                            <div>
                                <span className="doctor-eyebrow">
                                    {tr("doctorDashboard.teleconsultationEyebrow", "REMOTE CARE")}
                                </span>

                                <h2>
                                    {tr(
                                        "doctorDashboard.myTeleconsultations",
                                        "My Teleconsultations"
                                    )}
                                </h2>

                                <p>
                                    {tr(
                                        "doctorDashboard.teleconsultationDescription",
                                        "Start, join, and complete remote consultations."
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            className="doctor-button doctor-button-primary"
                            type="button"
                            onClick={fetchTeleconsultations}
                            disabled={loadingTeleconsultations}
                        >
                            {loadingTeleconsultations ? (
                                <>
                                    <span className="doctor-spinner" />
                                    {tr(
                                        "doctorDashboard.loadingTeleconsultations",
                                        "Loading..."
                                    )}
                                </>
                            ) : (
                                <>
                                    ↻
                                    {tr(
                                        "doctorDashboard.viewTeleconsultations",
                                        "Load consultations"
                                    )}
                                </>
                            )}
                        </button>
                    </header>

                    {teleconsultations.length === 0 &&
                        !loadingTeleconsultations && (
                            <div className="doctor-empty-state">
                                <span aria-hidden="true">☏</span>
                                <h3>
                                    {tr(
                                        "doctorDashboard.noTeleconsultations",
                                        "No teleconsultations loaded"
                                    )}
                                </h3>
                                <p>
                                    {tr(
                                        "doctorDashboard.noTeleconsultationsDescription",
                                        "Load your teleconsultations to view their schedules and status."
                                    )}
                                </p>
                            </div>
                        )}

                    {teleconsultations.length > 0 && (
                        <div className="doctor-resource-list">
                            {teleconsultations.map((consultation) => (
                                <article
                                    key={consultation._id}
                                    className="doctor-resource-card"
                                >
                                    <div className="doctor-resource-main">
                                        <span className="doctor-patient-avatar doctor-avatar-blue">
                                            {(consultation.patient?.name || "P")
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>

                                        <div>
                                            <h3>
                                                {consultation.patient?.name ||
                                                    tr("doctorDashboard.unknown", "Unknown patient")}
                                            </h3>

                                            <p>
                                                {consultation.patient?.email ||
                                                    tr("doctorDashboard.unknown", "Unknown")}
                                            </p>

                                            <span className="doctor-resource-date">
                                                {formatDate(consultation.scheduledAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="doctor-resource-statuses">
                                        <span className={`doctor-status-badge ${statusClass(consultation.status)}`}>
                                            {humanize(consultation.status)}
                                        </span>

                                        {consultation.visitRequest?.status && (
                                            <span className={`doctor-status-badge ${statusClass(consultation.visitRequest.status)}`}>
                                                {humanize(consultation.visitRequest.status)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="doctor-resource-actions">
                                        {consultation.status === "scheduled" && (
                                            <button
                                                className="doctor-button doctor-button-primary"
                                                type="button"
                                                onClick={() =>
                                                    startTeleconsultation(consultation)
                                                }
                                                disabled={!consultation.meetingLink}
                                            >
                                                {tr(
                                                    "doctorDashboard.startConsultation",
                                                    "Start consultation"
                                                )}
                                                <span aria-hidden="true">↗</span>
                                            </button>
                                        )}

                                        {consultation.status === "ongoing" && (
                                            <>
                                                <button
                                                    className="doctor-button doctor-button-primary"
                                                    type="button"
                                                    onClick={() =>
                                                        joinTeleconsultation(consultation)
                                                    }
                                                    disabled={!consultation.meetingLink}
                                                >
                                                    {tr(
                                                        "doctorDashboard.joinConsultation",
                                                        "Join consultation"
                                                    )}
                                                    <span aria-hidden="true">↗</span>
                                                </button>

                                                <button
                                                    className="doctor-button doctor-button-secondary"
                                                    type="button"
                                                    onClick={() =>
                                                        completeTeleconsultation(consultation)
                                                    }
                                                >
                                                    {tr(
                                                        "doctorDashboard.completeConsultation",
                                                        "Complete"
                                                    )}
                                                </button>
                                            </>
                                        )}

                                        {consultation.status === "completed" && (
                                            <span className="doctor-completion-note">
                                                ✓{" "}
                                                {tr(
                                                    "doctorDashboard.consultationCompleted",
                                                    "Consultation completed"
                                                )}
                                            </span>
                                        )}

                                        {consultation.status === "cancelled" && (
                                            <span className="doctor-completion-note doctor-completion-cancelled">
                                                {tr(
                                                    "doctorDashboard.consultationCancelled",
                                                    "Consultation cancelled"
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Follow-ups */}
                <section className="doctor-panel">
                    <header className="doctor-panel-header">
                        <div className="doctor-panel-title">
                            <span className="doctor-panel-icon doctor-icon-gold">◷</span>

                            <div>
                                <span className="doctor-eyebrow">
                                    {tr("doctorDashboard.followUpEyebrow", "CONTINUITY OF CARE")}
                                </span>

                                <h2>
                                    {tr("doctorDashboard.myFollowUps", "My Follow-ups")}
                                </h2>

                                <p>
                                    {tr(
                                        "doctorDashboard.followUpDescription",
                                        "Schedule follow-up visits and track their status."
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            className="doctor-button doctor-button-primary"
                            type="button"
                            onClick={fetchFollowUps}
                            disabled={loadingFollowUps}
                        >
                            {loadingFollowUps ? (
                                <>
                                    <span className="doctor-spinner" />
                                    {tr("doctorDashboard.loadingFollowUps", "Loading...")}
                                </>
                            ) : (
                                <>
                                    ↻
                                    {tr("doctorDashboard.viewFollowUps", "Load follow-ups")}
                                </>
                            )}
                        </button>
                    </header>

                    {selectedPatient ? (
                        <form className="doctor-follow-up-form" onSubmit={createFollowUp}>
                            <div className="doctor-form-section">
                                <label>
                                    {tr("doctorDashboard.createFollowUp", "Create follow-up")}
                                </label>

                                <p className="doctor-form-description">
                                    {tr("doctorDashboard.patientLabel", "Patient")}:{" "}
                                    <strong>
                                        {selectedPatient.patient?.name ||
                                            tr("doctorDashboard.unknown", "Unknown")}
                                    </strong>
                                </p>
                            </div>

                            <div className="doctor-follow-up-fields">
                                <div className="doctor-form-section">
                                    <label htmlFor="follow-up-date">
                                        {tr(
                                            "doctorDashboard.followUpDateTime",
                                            "Follow-up date and time"
                                        )}
                                        <span>*</span>
                                    </label>

                                    <input
                                        id="follow-up-date"
                                        type="datetime-local"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                        min={new Date(Date.now() + 60000)
                                            .toISOString()
                                            .slice(0, 16)}
                                        required
                                    />
                                </div>

                                <div className="doctor-form-section">
                                    <label htmlFor="follow-up-reason">
                                        {tr(
                                            "doctorDashboard.followUpReason",
                                            "Follow-up reason"
                                        )}
                                        <span>*</span>
                                    </label>

                                    <textarea
                                        id="follow-up-reason"
                                        value={followUpReason}
                                        onChange={(e) => setFollowUpReason(e.target.value)}
                                        placeholder={tr(
                                            "doctorDashboard.followUpReasonPlaceholder",
                                            "Enter the reason for follow-up..."
                                        )}
                                        rows={2}
                                        required
                                    />
                                </div>

                                <div className="doctor-form-section doctor-follow-up-notes">
                                    <label htmlFor="follow-up-notes">
                                        {tr(
                                            "doctorDashboard.followUpNotes",
                                            "Follow-up notes"
                                        )}
                                    </label>

                                    <textarea
                                        id="follow-up-notes"
                                        value={followUpNotes}
                                        onChange={(e) => setFollowUpNotes(e.target.value)}
                                        placeholder={tr(
                                            "doctorDashboard.followUpNotesPlaceholder",
                                            "Optional notes for the next visit..."
                                        )}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <button
                                className="doctor-button doctor-button-primary"
                                type="submit"
                                disabled={creatingFollowUp}
                            >
                                {creatingFollowUp ? (
                                    <>
                                        <span className="doctor-spinner" />
                                        {tr(
                                            "doctorDashboard.creatingFollowUp",
                                            "Creating follow-up..."
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {tr(
                                            "doctorDashboard.createFollowUp",
                                            "Create follow-up"
                                        )}
                                        <span aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="doctor-inline-hint">
                            <span aria-hidden="true">ⓘ</span>
                            <p>
                                {tr(
                                    "doctorDashboard.openPatientForFollowUp",
                                    "Open a patient for review to create a follow-up for that visit."
                                )}
                            </p>
                        </div>
                    )}

                    {followUps.length === 0 && !loadingFollowUps && (
                        <div className="doctor-empty-state">
                            <span aria-hidden="true">◷</span>
                            <h3>
                                {tr(
                                    "doctorDashboard.noFollowUps",
                                    "No follow-ups loaded"
                                )}
                            </h3>
                            <p>
                                {tr(
                                    "doctorDashboard.noFollowUpsDescription",
                                    "Load your follow-ups to review scheduled and completed care."
                                )}
                            </p>
                        </div>
                    )}

                    {followUps.length > 0 && (
                        <div className="doctor-resource-list">
                            {followUps.map((followUp) => (
                                <article
                                    key={followUp._id}
                                    className="doctor-resource-card"
                                >
                                    <div className="doctor-resource-main">
                                        <span className="doctor-patient-avatar doctor-avatar-gold">
                                            {(followUp.patient?.name || "P")
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>

                                        <div>
                                            <h3>
                                                {followUp.patient?.name ||
                                                    tr("doctorDashboard.unknown", "Unknown patient")}
                                            </h3>

                                            <p>
                                                {followUp.patient?.email ||
                                                    tr("doctorDashboard.unknown", "Unknown")}
                                            </p>

                                            <span className="doctor-resource-date">
                                                {formatDate(followUp.followUpDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="doctor-follow-up-summary">
                                        <div>
                                            <span>
                                                {tr("doctorDashboard.reason", "Reason")}
                                            </span>
                                            <p>{followUp.reason}</p>
                                        </div>

                                        <div>
                                            <span>
                                                {tr("doctorDashboard.notes", "Notes")}
                                            </span>
                                            <p>
                                                {followUp.notes ||
                                                    tr("doctorDashboard.noNotes", "No notes")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="doctor-resource-actions">
                                        <span className={`doctor-status-badge ${statusClass(followUp.status)}`}>
                                            {humanize(followUp.status)}
                                        </span>

                                        {followUp.status === "upcoming" && (
                                            <>
                                                <button
                                                    className="doctor-button doctor-button-primary"
                                                    type="button"
                                                    onClick={() =>
                                                        updateFollowUpStatus(
                                                            followUp._id,
                                                            "completed"
                                                        )
                                                    }
                                                    disabled={updatingFollowUpId === followUp._id}
                                                >
                                                    {updatingFollowUpId === followUp._id ? (
                                                        <span className="doctor-spinner" />
                                                    ) : (
                                                        "✓"
                                                    )}
                                                    {tr(
                                                        "doctorDashboard.markCompleted",
                                                        "Mark completed"
                                                    )}
                                                </button>

                                                <button
                                                    className="doctor-button doctor-button-secondary"
                                                    type="button"
                                                    onClick={() =>
                                                        updateFollowUpStatus(
                                                            followUp._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    disabled={updatingFollowUpId === followUp._id}
                                                >
                                                    {tr(
                                                        "doctorDashboard.cancelFollowUp",
                                                        "Cancel follow-up"
                                                    )}
                                                </button>
                                            </>
                                        )}

                                        {followUp.status === "completed" && (
                                            <span className="doctor-completion-note">
                                                ✓{" "}
                                                {tr(
                                                    "doctorDashboard.followUpCompleted",
                                                    "Follow-up completed"
                                                )}
                                            </span>
                                        )}

                                        {followUp.status === "cancelled" && (
                                            <span className="doctor-completion-note doctor-completion-cancelled">
                                                {tr(
                                                    "doctorDashboard.followUpCancelled",
                                                    "Follow-up cancelled"
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="doctor-dashboard-footer">
                    <span>GramArogya · {tr("doctorDashboard.footer", "Connected care for every community")}</span>
                    <span>{tr("doctorDashboard.clinicalDisclaimer", "Use clinical judgment and established care protocols.")}</span>
                </footer>
            </main>
        </div>
    );
};

export default DoctorDashboard;

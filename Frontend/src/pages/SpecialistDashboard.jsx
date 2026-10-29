
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import "./SpecialistDashboard.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api";

const SpecialistDashboard = () => {
    const { t, i18n } = useTranslation();

    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const text = (key, fallback) =>
        t(`specialistDashboard.${key}`, { defaultValue: fallback });

    const fetchReferrals = useCallback(async () => {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError(text("loginRequired", "Please sign in to continue."));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/referrals/specialist`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    text("fetchFailed", "Unable to load referrals.")
                );
            }

            setReferrals(
                data.referrals ||
                data.referralRequests ||
                []
            );
        } catch (err) {
            setError(
                err.message ||
                text("fetchFailed", "Unable to load referrals.")
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchReferrals();
    }, [fetchReferrals]);

    const updateReferralStatus = async (referralId, status) => {
        setError("");
        setSuccess("");
        setUpdatingId(referralId);

        const token = localStorage.getItem("token");

        if (!token) {
            setError(text("loginRequired", "Please sign in to continue."));
            setUpdatingId("");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/referrals/${referralId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    text("updateFailed", "Unable to update referral status.")
                );
            }

            setReferrals((current) =>
                current.map((referral) =>
                    referral._id === referralId
                        ? { ...referral, status }
                        : referral
                )
            );

            setSuccess(
                status === "accepted"
                    ? text("acceptedSuccess", "Referral accepted successfully.")
                    : text("completedSuccess", "Referral marked as completed.")
            );
        } catch (err) {
            setError(
                err.message ||
                text("updateFailed", "Unable to update referral status.")
            );
        } finally {
            setUpdatingId("");
        }
    };

    const getPatient = (referral) =>
        referral.patient ||
        referral.visitRequest?.patient ||
        {};

    const getSourceFacility = (referral) =>
        referral.referringFacility ||
        referral.sourceFacility ||
        referral.facility ||
        referral.visitRequest?.facility ||
        {};

    const getTargetFacility = (referral) =>
        referral.referredFacility ||
        referral.destinationFacility ||
        referral.requestedFacility ||
        {};

    const getDoctor = (referral) =>
        referral.referringDoctor ||
        referral.doctor ||
        referral.createdBy ||
        {};

    const getTriage = (referral) =>
        referral.triageRecord ||
        referral.visitRequest?.triageRecord ||
        referral.triage ||
        {};

    const getReason = (referral) =>
        referral.referralReason ||
        referral.reason ||
        referral.notes ||
        referral.visitRequest?.referralReason ||
        "";

    const getStatusClass = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "pending":
                return "specialist-status-pending";
            case "accepted":
                return "specialist-status-accepted";
            case "completed":
                return "specialist-status-completed";
            case "cancelled":
            case "rejected":
                return "specialist-status-cancelled";
            default:
                return "specialist-status-neutral";
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "—";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "—";

        const locale =
            i18n.language?.startsWith("mr")
                ? "mr-IN"
                : i18n.language?.startsWith("hi")
                  ? "hi-IN"
                  : "en-IN";

        return new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    };

    const pendingCount = referrals.filter(
        (referral) => referral.status === "pending"
    ).length;

    const acceptedCount = referrals.filter(
        (referral) => referral.status === "accepted"
    ).length;

    const completedCount = referrals.filter(
        (referral) => referral.status === "completed"
    ).length;

    return (
        <main className="specialist-dashboard">
            <div className="specialist-shell">
                <header className="specialist-header">
                    <div className="specialist-brand-mark" aria-hidden="true">
                        +
                    </div>

                    <div className="specialist-header-copy">
                        <span className="specialist-eyebrow">
                            {text("portalLabel", "SPECIALIST PORTAL")}
                        </span>
                        <h1>{text("title", "Specialist Dashboard")}</h1>
                        <p>
                            {text(
                                "subtitle",
                                "Review referred patients and manage specialist care."
                            )}
                        </p>
                    </div>

                    <div className="specialist-header-actions">
                        <LanguageSelector />
                        <span className="specialist-secure-pill">
                            <span className="specialist-live-dot" />
                            {text("secureAccess", "Secure access")}
                        </span>
                    </div>
                </header>

                <section className="specialist-welcome">
                    <div>
                        <span className="specialist-welcome-label">
                            {text("welcomeLabel", "SPECIALIST WORKSPACE")}
                        </span>
                        <h2>
                            {text("welcomeTitle", "Referral care overview")}
                        </h2>
                        <p>
                            {text(
                                "welcomeDescription",
                                "Review referrals assigned to your facility and update their progress as you provide care."
                            )}
                        </p>
                    </div>

                    <div className="specialist-welcome-icon" aria-hidden="true">
                        🩺
                    </div>
                </section>

                <section
                    className="specialist-stats"
                    aria-label={text("summaryLabel", "Referral summary")}
                >
                    <article className="specialist-stat-card">
                        <div className="specialist-stat-icon pending-icon">
                            ◷
                        </div>
                        <div>
                            <span>{text("pending", "Pending")}</span>
                            <strong>{pendingCount}</strong>
                            <small>
                                {text("awaitingReview", "Awaiting review")}
                            </small>
                        </div>
                    </article>

                    <article className="specialist-stat-card">
                        <div className="specialist-stat-icon accepted-icon">
                            ✓
                        </div>
                        <div>
                            <span>{text("accepted", "Accepted")}</span>
                            <strong>{acceptedCount}</strong>
                            <small>
                                {text("inProgress", "In progress")}
                            </small>
                        </div>
                    </article>

                    <article className="specialist-stat-card">
                        <div className="specialist-stat-icon completed-icon">
                            ♧
                        </div>
                        <div>
                            <span>{text("completed", "Completed")}</span>
                            <strong>{completedCount}</strong>
                            <small>
                                {text("careCompleted", "Care marked completed")}
                            </small>
                        </div>
                    </article>
                </section>

                {error && (
                    <div className="specialist-message specialist-error" role="alert">
                        <span className="specialist-message-icon">!</span>
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div
                        className="specialist-message specialist-success"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="specialist-message-icon">✓</span>
                        <span>{success}</span>
                        <button
                            type="button"
                            onClick={() => setSuccess("")}
                            aria-label="Dismiss message"
                        >
                            ×
                        </button>
                    </div>
                )}

                <section className="specialist-referrals-section">
                    <div className="specialist-section-heading">
                        <div>
                            <span className="specialist-eyebrow">
                                {text("referralsLabel", "PATIENT REFERRALS")}
                            </span>
                            <h2>{text("referralsTitle", "Assigned referrals")}</h2>
                            <p>
                                {text(
                                    "referralsDescription",
                                    "Patient and referral details available from your referral records."
                                )}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="specialist-button specialist-button-light"
                            onClick={fetchReferrals}
                            disabled={loading}
                        >
                            {loading && <span className="specialist-spinner" />}
                            {loading
                                ? text("loading", "Loading...")
                                : text("refresh", "Refresh referrals")}
                        </button>
                    </div>

                    {loading ? (
                        <div className="specialist-empty-state">
                            <span className="specialist-large-spinner" />
                            <h3>{text("loadingTitle", "Loading referrals")}</h3>
                            <p>
                                {text(
                                    "loadingDescription",
                                    "Retrieving referrals assigned to your facility."
                                )}
                            </p>
                        </div>
                    ) : referrals.length === 0 ? (
                        <div className="specialist-empty-state">
                            <div className="specialist-empty-icon" aria-hidden="true">
                                ✓
                            </div>
                            <h3>
                                {text("emptyTitle", "No referrals found")}
                            </h3>
                            <p>
                                {text(
                                    "emptyDescription",
                                    "Assigned referrals will appear here when available."
                                )}
                            </p>
                            <button
                                type="button"
                                className="specialist-button specialist-button-primary"
                                onClick={fetchReferrals}
                            >
                                {text("tryAgain", "Check again")}
                            </button>
                        </div>
                    ) : (
                        <div className="specialist-referral-grid">
                            {referrals.map((referral) => {
                                const patient = getPatient(referral);
                                const sourceFacility = getSourceFacility(referral);
                                const targetFacility = getTargetFacility(referral);
                                const doctor = getDoctor(referral);
                                const triage = getTriage(referral);
                                const reason = getReason(referral);

                                const symptoms = Array.isArray(triage.symptoms)
                                    ? triage.symptoms
                                    : [];

                                const status = String(
                                    referral.status || "pending"
                                ).toLowerCase();

                                return (
                                    <article
                                        key={referral._id}
                                        className="specialist-referral-card"
                                    >
                                        <div className="specialist-card-topline">
                                            <span className="specialist-card-label">
                                                {text("referralRecord", "REFERRAL RECORD")}
                                            </span>

                                            <span
                                                className={`specialist-status ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {text(status, status)}
                                            </span>
                                        </div>

                                        <div className="specialist-patient-heading">
                                            <div className="specialist-patient-avatar">
                                                {(patient.name || "?")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="specialist-patient-identity">
                                                <h3>
                                                    {patient.name ||
                                                        text("unknownPatient", "Patient details unavailable")}
                                                </h3>
                                                <p>
                                                    {patient.email ||
                                                        text("emailUnavailable", "Email not available")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="specialist-detail-grid">
                                            <div className="specialist-detail">
                                                <span>
                                                    {text("referralDate", "Referral date")}
                                                </span>
                                                <strong>
                                                    {formatDate(
                                                        referral.createdAt ||
                                                        referral.updatedAt
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("referringDoctor", "Referring doctor")}
                                                </span>
                                                <strong>
                                                    {doctor.name || "—"}
                                                </strong>
                                            </div>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("sourceFacility", "Referring facility")}
                                                </span>
                                                <strong>
                                                    {sourceFacility.name || "—"}
                                                </strong>
                                            </div>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("targetFacility", "Referred facility")}
                                                </span>
                                                <strong>
                                                    {targetFacility.name || "—"}
                                                </strong>
                                            </div>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("severity", "Reported severity")}
                                                </span>
                                                <strong>
                                                    {triage.severity || "—"}
                                                </strong>
                                            </div>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("urgency", "Triage urgency")}
                                                </span>
                                                <strong>
                                                    {triage.urgencyLevel || "—"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="specialist-patient-details">
                                            <h4>
                                                {text("patientDetails", "Patient information")}
                                            </h4>

                                            <div className="specialist-detail">
                                                <span>
                                                    {text("symptoms", "Reported symptoms")}
                                                </span>
                                                <strong>
                                                    {symptoms.length
                                                        ? symptoms.join(", ")
                                                        : text(
                                                              "symptomsUnavailable",
                                                              "No symptom details available in this referral"
                                                          )}
                                                </strong>
                                            </div>

                                            {triage.duration && (
                                                <div className="specialist-detail">
                                                    <span>
                                                        {text("duration", "Symptom duration")}
                                                    </span>
                                                    <strong>{triage.duration}</strong>
                                                </div>
                                            )}
                                        </div>

                                        {reason && (
                                            <div className="specialist-referral-reason">
                                                <span>
                                                    {text("referralReason", "Reason for referral")}
                                                </span>
                                                <p>{reason}</p>
                                            </div>
                                        )}

                                        <div className="specialist-card-footer">
                                            <p>
                                                {status === "pending"
                                                    ? text(
                                                          "pendingHelp",
                                                          "Review the referral before accepting it."
                                                      )
                                                    : status === "accepted"
                                                      ? text(
                                                            "acceptedHelp",
                                                            "Update the status when specialist care is complete."
                                                        )
                                                      : text(
                                                            "completedHelp",
                                                            "This referral is marked as completed."
                                                        )}
                                            </p>

                                            {status === "pending" && (
                                                <button
                                                    type="button"
                                                    className="specialist-button specialist-button-primary"
                                                    onClick={() =>
                                                        updateReferralStatus(
                                                            referral._id,
                                                            "accepted"
                                                        )
                                                    }
                                                    disabled={updatingId === referral._id}
                                                >
                                                    {updatingId === referral._id && (
                                                        <span className="specialist-spinner" />
                                                    )}
                                                    {updatingId === referral._id
                                                        ? text("updating", "Updating...")
                                                        : text("acceptReferral", "Accept referral")}
                                                </button>
                                            )}

                                            {status === "accepted" && (
                                                <button
                                                    type="button"
                                                    className="specialist-button specialist-button-complete"
                                                    onClick={() =>
                                                        updateReferralStatus(
                                                            referral._id,
                                                            "completed"
                                                        )
                                                    }
                                                    disabled={updatingId === referral._id}
                                                >
                                                    {updatingId === referral._id && (
                                                        <span className="specialist-spinner" />
                                                    )}
                                                    {updatingId === referral._id
                                                        ? text("updating", "Updating...")
                                                        : text("markCompleted", "Mark completed")}
                                                </button>
                                            )}

                                            {status === "completed" && (
                                                <span className="specialist-completed-label">
                                                    ✓ {text("careCompleted", "Care completed")}
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <footer className="specialist-footer">
                    <span aria-hidden="true">+</span>
                    <p>
                        {text(
                            "footer",
                            "GramArogya · Connecting patients with specialist care."
                        )}
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default SpecialistDashboard;

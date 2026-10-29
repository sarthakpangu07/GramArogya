
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Teleconsultation.css";

const API_URL =
    "https://gramarogya-27q3.onrender.com/api/teleconsultations/my";

const Teleconsultation = () => {
    const { t, i18n } = useTranslation();

    const [teleconsultations, setTeleconsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadCount, setReloadCount] = useState(0);

    const tr = useCallback(
        (key, fallback) =>
            t(key, { defaultValue: fallback }),
        [t]
    );

    const fetchTeleconsultations = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    tr(
                        "teleconsultation.loginRequired",
                        "Please log in to view your consultations."
                    )
                );
            }

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    tr(
                        "teleconsultation.fetchFailed",
                        "Unable to load your consultations."
                    )
                );
            }

            setTeleconsultations(
                Array.isArray(data.teleconsultations)
                    ? data.teleconsultations
                    : []
            );
        } catch (err) {
            setError(
                err.message ||
                tr(
                    "teleconsultation.fetchFailed",
                    "Unable to load your consultations."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [tr]);

    useEffect(() => {
        fetchTeleconsultations();
    }, [fetchTeleconsultations, reloadCount]);

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return tr(
                "teleconsultation.dateNotAvailable",
                "Date not available"
            );
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return tr(
                "teleconsultation.dateNotAvailable",
                "Date not available"
            );
        }

        const localeMap = {
            en: "en-IN",
            mr: "mr-IN",
            hi: "hi-IN"
        };

        const language = i18n.language?.split("-")[0];
        const locale = localeMap[language] || "en-IN";

        try {
            return date.toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short"
            });
        } catch {
            return date.toLocaleString("en-IN");
        }
    };

    const translateStatus = (status) => {
        const value = String(status || "").toLowerCase();

        const statusMap = {
            scheduled: "teleconsultation.values.scheduled",
            ongoing: "teleconsultation.values.ongoing",
            completed: "teleconsultation.values.completed",
            cancelled: "teleconsultation.values.cancelled"
        };

        const fallbacks = {
            scheduled: "Scheduled",
            ongoing: "Ongoing",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return statusMap[value]
            ? tr(statusMap[value], fallbacks[value])
            : status || tr(
                "teleconsultation.statusUnknown",
                "Not available"
            );
    };

    const translateVisitStatus = (status) => {
        const value = String(status || "").toLowerCase();

        const statusMap = {
            pending: "teleconsultation.visitStatuses.pending",
            accepted: "teleconsultation.visitStatuses.accepted",
            rejected: "teleconsultation.visitStatuses.rejected",
            completed: "teleconsultation.visitStatuses.completed",
            cancelled: "teleconsultation.visitStatuses.cancelled"
        };

        const fallbacks = {
            pending: "Pending",
            accepted: "Accepted",
            rejected: "Rejected",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return statusMap[value]
            ? tr(statusMap[value], fallbacks[value])
            : status || tr(
                "teleconsultation.statusUnknown",
                "Not available"
            );
    };

    const getStatusClass = (status) => {
        const value = String(status || "unknown")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

        return `teleconsultation-status-${value}`;
    };

    const joinConsultation = (meetingLink) => {
        if (!meetingLink) return;

        try {
            const meetingUrl = new URL(meetingLink);

            if (!["https:", "http:"].includes(meetingUrl.protocol)) {
                setError(
                    tr(
                        "teleconsultation.invalidMeetingLink",
                        "This meeting link is not valid."
                    )
                );
                return;
            }

            window.open(meetingUrl.href, "_blank", "noopener,noreferrer");
        } catch {
            setError(
                tr(
                    "teleconsultation.invalidMeetingLink",
                    "This meeting link is not valid."
                )
            );
        }
    };

    if (loading) {
        return (
            <section className="teleconsultation-page">
                <div className="teleconsultation-layout">
                    <div className="teleconsultation-state">
                        <span className="teleconsultation-spinner" />

                        <h2>
                            {tr(
                                "teleconsultation.loading",
                                "Loading your consultations..."
                            )}
                        </h2>

                        <p>
                            {tr(
                                "teleconsultation.loadingDescription",
                                "Your appointment information is being retrieved."
                            )}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="teleconsultation-page">
                <div className="teleconsultation-layout">
                    <header className="teleconsultation-heading">
                        <div className="teleconsultation-heading-icon" aria-hidden="true">
                            ☏
                        </div>

                        <div>
                            <span className="teleconsultation-eyebrow">
                                {tr(
                                    "teleconsultation.eyebrow",
                                    "REMOTE HEALTHCARE"
                                )}
                            </span>

                            <h2>
                                {tr(
                                    "teleconsultation.myTitle",
                                    "My Consultations"
                                )}
                            </h2>
                        </div>
                    </header>

                    <div className="teleconsultation-state teleconsultation-error-state">
                        <span className="teleconsultation-state-icon" aria-hidden="true">
                            !
                        </span>

                        <h3>
                            {tr(
                                "teleconsultation.errorTitle",
                                "Unable to load consultations"
                            )}
                        </h3>

                        <p role="alert">{error}</p>

                        <button
                            className="teleconsultation-primary-button"
                            type="button"
                            onClick={() => setReloadCount((count) => count + 1)}
                        >
                            {tr("teleconsultation.retry", "Try again")}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="teleconsultation-page">
            <div className="teleconsultation-layout">
                <header className="teleconsultation-heading">
                    <div className="teleconsultation-heading-icon" aria-hidden="true">
                        ☏
                    </div>

                    <div className="teleconsultation-heading-copy">
                        <span className="teleconsultation-eyebrow">
                            {tr(
                                "teleconsultation.eyebrow",
                                "REMOTE HEALTHCARE"
                            )}
                        </span>

                        <h2>
                            {tr(
                                "teleconsultation.myTitle",
                                "My Consultations"
                            )}
                        </h2>

                        <p>
                            {tr(
                                "teleconsultation.subtitle",
                                "View your scheduled consultations and access available meeting links."
                            )}
                        </p>
                    </div>

                    <div className="teleconsultation-count">
                        <strong>{teleconsultations.length}</strong>

                        <span>
                            {teleconsultations.length === 1
                                ? tr(
                                    "teleconsultation.consultationSingular",
                                    "Consultation"
                                )
                                : tr(
                                    "teleconsultation.consultationPlural",
                                    "Consultations"
                                )}
                        </span>
                    </div>
                </header>

                <div className="teleconsultation-info-note" role="note">
                    <span aria-hidden="true">ⓘ</span>

                    <p>
                        {tr(
                            "teleconsultation.infoNote",
                            "Join through the meeting link when your consultation is scheduled or ongoing. Contact your healthcare provider if you need help."
                        )}
                    </p>
                </div>

                {teleconsultations.length === 0 ? (
                    <div className="teleconsultation-state teleconsultation-empty-state">
                        <span
                            className="teleconsultation-state-icon"
                            aria-hidden="true"
                        >
                            ☏
                        </span>

                        <h3>
                            {tr(
                                "teleconsultation.noConsultations",
                                "No consultations yet"
                            )}
                        </h3>

                        <p>
                            {tr(
                                "teleconsultation.noConsultationsMessage",
                                "Your consultations will appear here when they are scheduled."
                            )}
                        </p>

                        <button
                            className="teleconsultation-secondary-button"
                            type="button"
                            onClick={() => setReloadCount((count) => count + 1)}
                        >
                            {tr(
                                "teleconsultation.refresh",
                                "Refresh consultations"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="teleconsultation-list">
                        {teleconsultations.map((consultation) => {
                            const status = String(
                                consultation.status || ""
                            ).toLowerCase();

                            const visitStatus =
                                consultation.visitRequest?.status;

                            const canJoin =
                                status === "scheduled" ||
                                status === "ongoing";

                            const hasMeetingLink =
                                typeof consultation.meetingLink === "string" &&
                                consultation.meetingLink.trim() !== "";

                            return (
                                <article
                                    className="teleconsultation-card"
                                    key={consultation._id}
                                >
                                    <header className="teleconsultation-card-header">
                                        <div className="teleconsultation-doctor">
                                            <span
                                                className="teleconsultation-doctor-avatar"
                                                aria-hidden="true"
                                            >
                                                +
                                            </span>

                                            <div className="teleconsultation-doctor-copy">
                                                <span className="teleconsultation-field-label">
                                                    {tr(
                                                        "teleconsultation.doctor",
                                                        "Doctor"
                                                    )}
                                                </span>

                                                <h3>
                                                    {consultation.doctor?.name ||
                                                        consultation.doctor?.email ||
                                                        tr(
                                                            "teleconsultation.doctorFallback",
                                                            "Doctor details unavailable"
                                                        )}
                                                </h3>

                                                {consultation.doctor?.email &&
                                                    consultation.doctor?.name && (
                                                        <p>
                                                            {consultation.doctor.email}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <span
                                            className={`teleconsultation-status-badge ${getStatusClass(
                                                status
                                            )}`}
                                        >
                                            <span className="teleconsultation-status-dot" />
                                            {translateStatus(status)}
                                        </span>
                                    </header>

                                    <div className="teleconsultation-card-details">
                                        <div className="teleconsultation-detail">
                                            <span className="teleconsultation-detail-icon" aria-hidden="true">
                                                ◷
                                            </span>

                                            <div>
                                                <span className="teleconsultation-field-label">
                                                    {tr(
                                                        "teleconsultation.dateTime",
                                                        "Date and time"
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        consultation.scheduledAt
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="teleconsultation-detail">
                                            <span className="teleconsultation-detail-icon" aria-hidden="true">
                                                ▤
                                            </span>

                                            <div>
                                                <span className="teleconsultation-field-label">
                                                    {tr(
                                                        "teleconsultation.visitStatus",
                                                        "Visit request"
                                                    )}
                                                </span>

                                                <strong
                                                    className={`teleconsultation-visit-badge ${getStatusClass(
                                                        visitStatus
                                                    )}`}
                                                >
                                                    {translateVisitStatus(visitStatus)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {status === "completed" && (
                                        <div className="teleconsultation-message teleconsultation-completed-message">
                                            <span aria-hidden="true">✓</span>

                                            <p>
                                                {tr(
                                                    "teleconsultation.completedMessage",
                                                    "This consultation has been completed."
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {status === "cancelled" && (
                                        <div className="teleconsultation-message teleconsultation-cancelled-message">
                                            <span aria-hidden="true">ⓘ</span>

                                            <p>
                                                {tr(
                                                    "teleconsultation.cancelledMessage",
                                                    "This consultation has been cancelled."
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <footer className="teleconsultation-card-footer">
                                        {canJoin && hasMeetingLink ? (
                                            <button
                                                className="teleconsultation-join-button"
                                                type="button"
                                                onClick={() =>
                                                    joinConsultation(
                                                        consultation.meetingLink
                                                    )
                                                }
                                            >
                                                <span aria-hidden="true">↗</span>

                                                {tr(
                                                    "teleconsultation.join",
                                                    "Join consultation"
                                                )}
                                            </button>
                                        ) : canJoin ? (
                                            <p className="teleconsultation-link-unavailable">
                                                {tr(
                                                    "teleconsultation.meetingLinkUnavailable",
                                                    "Meeting link is not available yet. Please contact your healthcare provider."
                                                )}
                                            </p>
                                        ) : (
                                            <span className="teleconsultation-footer-label">
                                                {tr(
                                                    "teleconsultation.consultationDetails",
                                                    "Consultation details"
                                                )}
                                            </span>
                                        )}
                                    </footer>
                                </article>
                            );
                        })}
                    </div>
                )}

                <footer className="teleconsultation-footer-note">
                    <span aria-hidden="true">ⓘ</span>

                    <p>
                        {tr(
                            "teleconsultation.disclaimer",
                            "Teleconsultations complement healthcare services. Seek emergency help directly for life-threatening symptoms."
                        )}
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Teleconsultation;

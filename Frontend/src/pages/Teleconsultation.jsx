import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Teleconsultation = () => {
    const { t, i18n } = useTranslation();

    const [teleconsultations, setTeleconsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTeleconsultations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/teleconsultations/my",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    t("teleconsultation.fetchFailed")
                );
            }

            setTeleconsultations(
                data.teleconsultations || []
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeleconsultations();
    }, []);

    const formatDate = (date) => {
        const localeMap = {
            en: "en-IN",
            mr: "mr-IN",
            hi: "hi-IN"
        };

        const locale =
            localeMap[i18n.language] || "en-IN";

        return new Date(date).toLocaleString(locale, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const translateStatus = (status) => {
        const statusMap = {
            scheduled: "teleconsultation.values.scheduled",
            ongoing: "teleconsultation.values.ongoing",
            completed: "teleconsultation.values.completed",
            cancelled: "teleconsultation.values.cancelled"
        };

        return statusMap[status]
            ? t(statusMap[status])
            : status;
    };

    const translateVisitStatus = (status) => {
    const statusMap = {
        pending:
            "teleconsultation.visitStatuses.pending",
        accepted:
            "teleconsultation.visitStatuses.accepted",
        rejected:
            "teleconsultation.visitStatuses.rejected",
        completed:
            "teleconsultation.visitStatuses.completed",
        cancelled:
            "teleconsultation.visitStatuses.cancelled"
    };

    return statusMap[status]
        ? t(statusMap[status])
        : status;
};

    if (loading) {
        return (
            <div className="triage-page">
                <div className="triage-container">
                    <h1>
                        {t(
                            "teleconsultation.title"
                        )}
                    </h1>

                    <p>
                        {t(
                            "teleconsultation.loading"
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="triage-page">
            <div className="triage-container">

                <h1>
                    {t(
                        "teleconsultation.myTitle"
                    )}
                </h1>

                <p className="triage-subtitle">
                    {t(
                        "teleconsultation.subtitle"
                    )}
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {teleconsultations.length === 0 &&
                    !error && (
                        <div className="form-section">
                            <h2>
                                {t(
                                    "teleconsultation.noConsultations"
                                )}
                            </h2>

                            <p>
                                {t(
                                    "teleconsultation.noConsultationsMessage"
                                )}
                            </p>
                        </div>
                    )}

                {teleconsultations.map(
                    (consultation) => (
                        <div
                            key={consultation._id}
                            className="form-section"
                            style={{
                                marginBottom: "20px",
                                padding: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "10px"
                            }}
                        >
                            <h2>
                                {t(
                                    "teleconsultation.doctor"
                                )}
                                :{" "}
                                {consultation.doctor
                                    ?.name ||
                                    t(
                                        "teleconsultation.doctorFallback"
                                    )}
                            </h2>

                            <p>
                                <strong>
                                    {t(
                                        "teleconsultation.dateTime"
                                    )}
                                    :
                                </strong>{" "}
                                {formatDate(
                                    consultation.scheduledAt
                                )}
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "teleconsultation.status"
                                    )}
                                    :
                                </strong>{" "}
                                {translateStatus(
                                    consultation.status
                                )}
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "teleconsultation.visitStatus"
                                    )}
                                    :
                                </strong>{" "}
                                {translateVisitStatus(
                                    consultation
                                        .visitRequest
                                        ?.status
                                )}
                            </p>

                            {(consultation.status ===
                                "scheduled" ||
                                consultation.status ===
                                    "ongoing") && (
                                <button
                                    className="submit-button"
                                    onClick={() =>
                                        window.open(
                                            consultation.meetingLink,
                                            "_blank"
                                        )
                                    }
                                >
                                    {t(
                                        "teleconsultation.join"
                                    )}
                                </button>
                            )}

                            {consultation.status ===
                                "completed" && (
                                <p>
                                    {t(
                                        "teleconsultation.completedMessage"
                                    )}
                                </p>
                            )}

                            {consultation.status ===
                                "cancelled" && (
                                <p>
                                    {t(
                                        "teleconsultation.cancelledMessage"
                                    )}
                                </p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Teleconsultation;

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import "./PHCDashboard.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api";

const PHCDashboard = () => {
    const { t } = useTranslation();

    const [requests, setRequests] = useState([]);
    const [acceptedPatients, setAcceptedPatients] = useState([]);
    const [emergencyRequests, setEmergencyRequests] = useState([]);

    const [loading, setLoading] = useState(false);
    const [acceptedLoading, setAcceptedLoading] = useState(false);
    const [emergencyLoading, setEmergencyLoading] = useState(false);
    const [facilityLoading, setFacilityLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [facilityId, setFacilityId] = useState("");
    const [facilityName, setFacilityName] = useState("");

    const [pendingLoaded, setPendingLoaded] = useState(false);
    const [acceptedLoaded, setAcceptedLoaded] = useState(false);
    const [emergencyLoaded, setEmergencyLoaded] = useState(false);

    const [acceptingId, setAcceptingId] = useState("");
    const [savingVitalsId, setSavingVitalsId] = useState("");
    const [updatingEmergencyId, setUpdatingEmergencyId] = useState("");

    const [vitals, setVitals] = useState({});

    const unknown = t("phcDashboard.unknown", {
        defaultValue: "Not available"
    });

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const getToken = () => localStorage.getItem("token");

    const getHeaders = (token, additionalHeaders = {}) => ({
        Authorization: `Bearer ${token}`,
        ...additionalHeaders
    });

    const readResponse = async (response, fallbackMessage) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || fallbackMessage);
        }

        return data;
    };

    const fetchFacility = useCallback(async () => {
        setFacilityLoading(true);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setFacilityLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/facilities/phc`, {
                headers: getHeaders(token)
            });

            const data = await readResponse(
                response,
                t("phcDashboard.fetchFacilityFailed")
            );

            if (data.facility) {
                setFacilityId(data.facility._id);
                setFacilityName(data.facility.name || "");
                setError("");
            } else {
                setFacilityId("");
                setFacilityName("");
                setError(t("phcDashboard.noFacilityFound"));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setFacilityLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchFacility();
    }, [fetchFacility]);

    const fetchPendingRequests = async () => {
        clearMessages();
        setLoading(true);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setLoading(false);
            return;
        }

        if (!facilityId) {
            setError(t("phcDashboard.facilityNotFound"));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/visits/phc-pending?facilityId=${encodeURIComponent(
                    facilityId
                )}`,
                {
                    headers: getHeaders(token)
                }
            );

            const data = await readResponse(
                response,
                t("phcDashboard.fetchPendingFailed")
            );

            setRequests(data.visitRequests || []);
            setPendingLoaded(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcceptedPatients = async () => {
        clearMessages();
        setAcceptedLoading(true);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setAcceptedLoading(false);
            return;
        }

        if (!facilityId) {
            setError(t("phcDashboard.facilityNotFound"));
            setAcceptedLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/visits/phc-accepted?facilityId=${encodeURIComponent(
                    facilityId
                )}`,
                {
                    headers: getHeaders(token)
                }
            );

            const data = await readResponse(
                response,
                t("phcDashboard.fetchAcceptedFailed")
            );

            setAcceptedPatients(data.visitRequests || []);
            setAcceptedLoaded(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setAcceptedLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        clearMessages();
        setAcceptingId(requestId);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setAcceptingId("");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/visits/${requestId}/accept`,
                {
                    method: "PATCH",
                    headers: getHeaders(token)
                }
            );

            await readResponse(
                response,
                t("phcDashboard.acceptRequestFailed")
            );

            setRequests((current) =>
                current.filter((request) => request._id !== requestId)
            );

            setSuccess(t("phcDashboard.requestAccepted"));
        } catch (err) {
            setError(err.message);
        } finally {
            setAcceptingId("");
        }
    };

    const handleVitalsChange = (triageId, field, value) => {
        setVitals((current) => ({
            ...current,
            [triageId]: {
                ...current[triageId],
                [field]: value
            }
        }));
    };

    const recordVitals = async (request) => {
        clearMessages();
        setSavingVitalsId(request._id);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setSavingVitalsId("");
            return;
        }

        const triageId = request.triageRecord?._id;

        if (!triageId) {
            setError(t("phcDashboard.triageRecordNotFound"));
            setSavingVitalsId("");
            return;
        }

        const patientVitals = vitals[triageId] || {};

        if (
            patientVitals.temperature === undefined ||
            patientVitals.temperature === "" ||
            patientVitals.oxygenLevel === undefined ||
            patientVitals.oxygenLevel === "" ||
            patientVitals.pulseRate === undefined ||
            patientVitals.pulseRate === ""
        ) {
            setError(t("phcDashboard.vitalsRequired"));
            setSavingVitalsId("");
            return;
        }

        const vitalsPayload = {
            temperature: Number(patientVitals.temperature),
            oxygenLevel: Number(patientVitals.oxygenLevel),
            pulseRate: Number(patientVitals.pulseRate),
            bloodPressure: patientVitals.bloodPressure || "",
            notes: patientVitals.notes || ""
        };

        if (
            !Number.isFinite(vitalsPayload.temperature) ||
            !Number.isFinite(vitalsPayload.oxygenLevel) ||
            !Number.isFinite(vitalsPayload.pulseRate)
        ) {
            setError(
                t("phcDashboard.invalidVitals", {
                    defaultValue: "Please enter valid numeric vital readings."
                })
            );
            setSavingVitalsId("");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/triage/${triageId}/vitals`, {
                method: "PATCH",
                headers: getHeaders(token, {
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify(vitalsPayload)
            });

            await readResponse(
                response,
                t("phcDashboard.recordVitalsFailed")
            );

            setAcceptedPatients((current) =>
                current.map((currentRequest) => {
                    if (currentRequest._id !== request._id) {
                        return currentRequest;
                    }

                    return {
                        ...currentRequest,
                        triageRecord: {
                            ...currentRequest.triageRecord,
                            vitalsStatus: "recorded",
                            healthWorkerVitals: vitalsPayload
                        }
                    };
                })
            );

            setSuccess(t("phcDashboard.vitalsRecorded"));
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingVitalsId("");
        }
    };

    const fetchEmergencyRequests = async () => {
        clearMessages();
        setEmergencyLoading(true);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setEmergencyLoading(false);
            return;
        }

        if (!facilityId) {
            setError(t("phcDashboard.facilityNotFound"));
            setEmergencyLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/emergencies/phc-pending`,
                {
                    headers: getHeaders(token)
                }
            );

            const data = await readResponse(
                response,
                t("phcDashboard.fetchEmergencyFailed")
            );

            const facilityEmergencyRequests = (
                data.emergencyRequests || []
            ).filter((request) => {
                const requestedFacilityId =
                    request.requestedFacility?._id ||
                    request.requestedFacility;

                return String(requestedFacilityId || "") === String(facilityId);
            });

            setEmergencyRequests(facilityEmergencyRequests);
            setEmergencyLoaded(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setEmergencyLoading(false);
        }
    };

    const updateEmergencyStatus = async (emergencyId, status) => {
        clearMessages();
        setUpdatingEmergencyId(emergencyId);

        const token = getToken();

        if (!token) {
            setError(t("phcDashboard.loginRequired"));
            setUpdatingEmergencyId("");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/emergencies/${emergencyId}/status`,
                {
                    method: "PATCH",
                    headers: getHeaders(token, {
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify({ status })
                }
            );

            await readResponse(
                response,
                t("phcDashboard.updateEmergencyFailed")
            );

            if (status === "completed" || status === "cancelled") {
                setEmergencyRequests((current) =>
                    current.filter((request) => request._id !== emergencyId)
                );
            } else {
                setEmergencyRequests((current) =>
                    current.map((request) =>
                        request._id === emergencyId
                            ? { ...request, status }
                            : request
                    )
                );
            }

            setSuccess(
                t("phcDashboard.emergencyStatusUpdated", {
                    status,
                    defaultValue: `Emergency status updated to ${status}.`
                })
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingEmergencyId("");
        }
    };

    const InfoItem = ({ label, value }) => (
        <div className="phc-info-item">
            <span className="phc-info-label">{label}</span>
            <span className="phc-info-value">
                {value === undefined || value === null || value === ""
                    ? t("phcDashboard.notAvailable", {
                          defaultValue: "Not available"
                      })
                    : value}
            </span>
        </div>
    );

    const PatientIdentity = ({ request }) => (
        <div className="phc-patient-identity">
            <div className="phc-avatar" aria-hidden="true">
                {(request.patient?.name || "?").charAt(0).toUpperCase()}
            </div>

            <div className="phc-patient-name-wrap">
                <h3>
                    {request.patient?.name ||
                        t("phcDashboard.unknown", { defaultValue: "Unknown" })}
                </h3>
                <p>
                    {request.patient?.email ||
                        t("phcDashboard.unknown", { defaultValue: "Unknown" })}
                </p>
            </div>
        </div>
    );

    const UrgencyBadge = ({ value }) => {
        const normalized = String(value || "").toLowerCase();
        let urgencyClass = "phc-badge-neutral";

        if (
            normalized.includes("emergency") ||
            normalized.includes("critical") ||
            normalized.includes("high") ||
            normalized.includes("severe")
        ) {
            urgencyClass = "phc-badge-danger";
        } else if (
            normalized.includes("moderate") ||
            normalized.includes("urgent")
        ) {
            urgencyClass = "phc-badge-warning";
        } else if (
            normalized.includes("low") ||
            normalized.includes("routine") ||
            normalized.includes("mild")
        ) {
            urgencyClass = "phc-badge-success";
        }

        return (
            <span className={`phc-badge ${urgencyClass}`}>
                {value ||
                    t("phcDashboard.notAvailable", {
                        defaultValue: "Not available"
                    })}
            </span>
        );
    };

    const SectionHeading = ({ eyebrow, title, description, count, children }) => (
        <div className="phc-section-heading">
            <div className="phc-section-heading-text">
                {eyebrow && <span className="phc-eyebrow">{eyebrow}</span>}
                <div className="phc-section-title-row">
                    <h2>{title}</h2>
                    {count !== undefined && (
                        <span className="phc-count-badge">{count}</span>
                    )}
                </div>
                {description && <p>{description}</p>}
            </div>
            {children && <div className="phc-section-heading-action">{children}</div>}
        </div>
    );

    const EmptyState = ({ icon, title, description }) => (
        <div className="phc-empty-state">
            <div className="phc-empty-icon" aria-hidden="true">
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );

    return (
        <main className="phc-dashboard">
            <div className="phc-dashboard-shell">
                <header className="phc-dashboard-header">
                    <div className="phc-brand-mark" aria-hidden="true">
                        +
                    </div>

                    <div className="phc-header-copy">
                        <span className="phc-eyebrow">
                            {t("phcDashboard.facilityLabel", {
                                defaultValue: "PRIMARY HEALTHCARE"
                            })}
                        </span>
                        <h1>{t("phcDashboard.title")}</h1>
                        <p>
                            {t("phcDashboard.subtitle")}
                        </p>
                    </div>

                    <div className="phc-header-actions">
                        <LanguageSelector />
                        <div className="phc-facility-pill">
                            <span className="phc-live-dot" />
                            <span>
                                {facilityLoading
                                    ? t("phcDashboard.loadingFacility", {
                                          defaultValue: "Loading facility..."
                                      })
                                    : facilityName ||
                                      t("phcDashboard.assignedFacility", {
                                          defaultValue: "Assigned PHC"
                                      })}
                            </span>
                        </div>
                    </div>
                </header>

                <section className="phc-welcome-panel">
                    <div>
                        <span className="phc-welcome-label">
                            {t("phcDashboard.workspaceLabel", {
                                defaultValue: "HEALTHCARE WORKSPACE"
                            })}
                        </span>
                        <h2>
                            {t("phcDashboard.workspaceTitle", {
                                defaultValue: "Patient care overview"
                            })}
                        </h2>
                        <p>
                            {t("phcDashboard.workspaceDescription", {
                                defaultValue:
                                    "Manage incoming visits, record patient vitals, and respond to emergencies assigned to your facility."
                            })}
                        </p>
                    </div>
                    <div className="phc-welcome-icon" aria-hidden="true">
                        🏥
                    </div>
                </section>

                <section className="phc-stats-grid" aria-label="Dashboard counts">
                    <article className="phc-stat-card">
                        <div className="phc-stat-icon phc-stat-blue">👥</div>
                        <div>
                            <span>{t("phcDashboard.pendingPatientRequests")}</span>
                            <strong>{requests.length}</strong>
                            <small>
                                {t("phcDashboard.pendingStatCaption", {
                                    defaultValue: "Awaiting review"
                                })}
                            </small>
                        </div>
                    </article>

                    <article className="phc-stat-card">
                        <div className="phc-stat-icon phc-stat-green">🩺</div>
                        <div>
                            <span>{t("phcDashboard.acceptedPatients")}</span>
                            <strong>{acceptedPatients.length}</strong>
                            <small>
                                {t("phcDashboard.acceptedStatCaption", {
                                    defaultValue: "Patients in your queue"
                                })}
                            </small>
                        </div>
                    </article>

                    <article className="phc-stat-card phc-stat-emergency">
                        <div className="phc-stat-icon phc-stat-red">🚨</div>
                        <div>
                            <span>{t("phcDashboard.emergencyRequests")}</span>
                            <strong>{emergencyRequests.length}</strong>
                            <small>
                                {t("phcDashboard.emergencyStatCaption", {
                                    defaultValue: "Requests assigned to this PHC"
                                })}
                            </small>
                        </div>
                    </article>
                </section>

                {facilityLoading && (
                    <div className="phc-inline-notice phc-notice-neutral">
                        <span className="phc-spinner" />
                        {t("phcDashboard.loadingFacility", {
                            defaultValue: "Loading facility..."
                        })}
                    </div>
                )}

                {error && (
                    <div className="phc-inline-notice phc-notice-error" role="alert">
                        <span className="phc-notice-symbol">!</span>
                        <span>{error}</span>
                        <button
                            type="button"
                            className="phc-dismiss-button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div
                        className="phc-inline-notice phc-notice-success"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="phc-notice-symbol">✓</span>
                        <span>{success}</span>
                        <button
                            type="button"
                            className="phc-dismiss-button"
                            onClick={() => setSuccess("")}
                            aria-label="Dismiss message"
                        >
                            ×
                        </button>
                    </div>
                )}

                <section className="phc-quick-actions">
                    <div className="phc-quick-actions-copy">
                        <h2>
                            {t("phcDashboard.quickActionsTitle", {
                                defaultValue: "Manage your queues"
                            })}
                        </h2>
                        <p>
                            {t("phcDashboard.quickActionsDescription", {
                                defaultValue:
                                    "Choose a queue to retrieve the latest requests from the server."
                            })}
                        </p>
                    </div>

                    <div className="phc-action-buttons">
                        <button
                            type="button"
                            className="phc-button phc-button-primary"
                            onClick={fetchPendingRequests}
                            disabled={loading || facilityLoading}
                        >
                            {loading && <span className="phc-spinner" />}
                            {loading
                                ? t("phcDashboard.loadingRequests")
                                : t("phcDashboard.viewPendingRequests")}
                        </button>

                        <button
                            type="button"
                            className="phc-button phc-button-secondary"
                            onClick={fetchAcceptedPatients}
                            disabled={acceptedLoading || facilityLoading}
                        >
                            {acceptedLoading && <span className="phc-spinner" />}
                            {acceptedLoading
                                ? t("phcDashboard.loadingPatients")
                                : t("phcDashboard.viewAcceptedPatients")}
                        </button>

                        <button
                            type="button"
                            className="phc-button phc-button-emergency"
                            onClick={fetchEmergencyRequests}
                            disabled={emergencyLoading || facilityLoading}
                        >
                            {emergencyLoading && <span className="phc-spinner" />}
                            {!emergencyLoading && <span aria-hidden="true">🚨</span>}
                            {emergencyLoading
                                ? t("phcDashboard.loadingEmergencyRequests")
                                : t("phcDashboard.viewEmergencyRequests")}
                        </button>
                    </div>
                </section>

                {/* Pending patient visit requests */}
                {(requests.length > 0 || pendingLoaded) && (
                    <section className="phc-content-section">
                        <SectionHeading
                            eyebrow={t("phcDashboard.pendingEyebrow", {
                                defaultValue: "NEW ARRIVALS"
                            })}
                            title={t("phcDashboard.pendingPatientRequests")}
                            description={t("phcDashboard.pendingDescription", {
                                defaultValue:
                                    "Review the patient's triage information before accepting the visit."
                            })}
                            count={requests.length}
                            >
                            <button
                                type="button"
                                className="phc-button phc-button-light"
                                onClick={fetchPendingRequests}
                                disabled={loading}
                            >
                                {loading
                                    ? t("phcDashboard.loadingRequests")
                                    : t("phcDashboard.refresh", {
                                          defaultValue: "Refresh"
                                      })}
                            </button>
                        </SectionHeading>

                        {requests.length === 0 ? (
                            <EmptyState
                                icon="✓"
                                title={t("phcDashboard.noPendingTitle", {
                                    defaultValue: "No pending visit requests"
                                })}
                                description={t("phcDashboard.noPendingVisits", {
                                    defaultValue:
                                        "New patient requests will appear here when available."
                                })}
                            />
                        ) : (
                            <div className="phc-card-grid">
                                {requests.map((request) => (
                                    <article
                                        key={request._id}
                                        className="phc-patient-card"
                                    >
                                        <div className="phc-card-topline">
                                            <span className="phc-card-category">
                                                {t("phcDashboard.visitRequestLabel", {
                                                    defaultValue: "VISIT REQUEST"
                                                })}
                                            </span>
                                            <span className="phc-badge phc-badge-neutral">
                                                {request.status}
                                            </span>
                                        </div>

                                        <PatientIdentity request={request} />

                                        <div className="phc-detail-grid">
                                            <InfoItem
                                                label={t("phcDashboard.symptoms")}
                                                value={request.triageRecord?.symptoms?.join(", ")}
                                            />
                                            <InfoItem
                                                label={t("phcDashboard.duration")}
                                                value={request.triageRecord?.duration}
                                            />
                                            <InfoItem
                                                label={t("phcDashboard.severity")}
                                                value={request.triageRecord?.severity}
                                            />
                                            <div className="phc-info-item">
                                                <span className="phc-info-label">
                                                    {t("phcDashboard.urgency")}
                                                </span>
                                                <UrgencyBadge
                                                    value={request.triageRecord?.urgencyLevel}
                                                />
                                            </div>
                                        </div>

                                        <div className="phc-recommendation">
                                            <span>
                                                {t("phcDashboard.recommendedAction")}
                                            </span>
                                            <p>
                                                {request.triageRecord?.recommendedAction ||
                                                    unknown}
                                            </p>
                                        </div>

                                        <div className="phc-card-footer">
                                            <span className="phc-muted-caption">
                                                {t("phcDashboard.reviewBeforeAccepting", {
                                                    defaultValue:
                                                        "Review the available triage details before accepting."
                                                })}
                                            </span>
                                            <button
                                                type="button"
                                                className="phc-button phc-button-primary"
                                                onClick={() => acceptRequest(request._id)}
                                                disabled={acceptingId === request._id}
                                            >
                                                {acceptingId === request._id && (
                                                    <span className="phc-spinner" />
                                                )}
                                                {acceptingId === request._id
                                                    ? t("phcDashboard.accepting")
                                                    : t("phcDashboard.acceptPatient")}
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Accepted patients and vital recording */}
                {(acceptedPatients.length > 0 || acceptedLoaded) && (
                    <section className="phc-content-section">
                        <SectionHeading
                            eyebrow={t("phcDashboard.activeCareEyebrow", {
                                defaultValue: "ACTIVE CARE"
                            })}
                            title={t("phcDashboard.acceptedPatients")}
                            description={t("phcDashboard.acceptedDescription", {
                                defaultValue:
                                    "Review accepted patients and record the vitals measured at your facility."
                            })}
                            count={acceptedPatients.length}
                        >
                            <button
                                type="button"
                                className="phc-button phc-button-light"
                                onClick={fetchAcceptedPatients}
                                disabled={acceptedLoading}
                            >
                                {acceptedLoading
                                    ? t("phcDashboard.loadingPatients")
                                    : t("phcDashboard.refresh", {
                                          defaultValue: "Refresh"
                                      })}
                            </button>
                        </SectionHeading>

                        {acceptedPatients.length === 0 ? (
                            <EmptyState
                                icon="🩺"
                                title={t("phcDashboard.noAcceptedTitle", {
                                    defaultValue: "No accepted patients"
                                })}
                                description={t("phcDashboard.noAcceptedVisits", {
                                    defaultValue:
                                        "Accepted visits will appear here for vital recording."
                                })}
                            />
                        ) : (
                            <div className="phc-card-grid">
                                {acceptedPatients.map((request) => {
                                    const triageId = request.triageRecord?._id;
                                    const patientVitals = vitals[triageId] || {};
                                    const vitalsRecorded =
                                        request.triageRecord?.vitalsStatus === "recorded";
                                    const recordedVitals =
                                        request.triageRecord?.healthWorkerVitals || {};

                                    return (
                                        <article
                                            key={request._id}
                                            className="phc-patient-card phc-accepted-card"
                                        >
                                            <div className="phc-card-topline">
                                                <span className="phc-card-category">
                                                    {t("phcDashboard.patientCareLabel", {
                                                        defaultValue: "PATIENT CARE"
                                                    })}
                                                </span>
                                                <span
                                                    className={`phc-badge ${
                                                        vitalsRecorded
                                                            ? "phc-badge-success"
                                                            : "phc-badge-warning"
                                                    }`}
                                                >
                                                    {vitalsRecorded
                                                        ? t("phcDashboard.vitalsComplete", {
                                                              defaultValue: "Vitals recorded"
                                                          })
                                                        : t("phcDashboard.vitalsPending", {
                                                              defaultValue: "Vitals pending"
                                                          })}
                                                </span>
                                            </div>

                                            <PatientIdentity request={request} />

                                            <div className="phc-detail-grid">
                                                <InfoItem
                                                    label={t("phcDashboard.symptoms")}
                                                    value={request.triageRecord?.symptoms?.join(", ")}
                                                />
                                                <InfoItem
                                                    label={t("phcDashboard.severity")}
                                                    value={request.triageRecord?.severity}
                                                />
                                                <div className="phc-info-item">
                                                    <span className="phc-info-label">
                                                        {t("phcDashboard.urgency")}
                                                    </span>
                                                    <UrgencyBadge
                                                        value={request.triageRecord?.urgencyLevel}
                                                    />
                                                </div>
                                                <InfoItem
                                                    label={t("phcDashboard.status")}
                                                    value={request.status}
                                                />
                                            </div>

                                            {vitalsRecorded ? (
                                                <div className="phc-recorded-vitals">
                                                    <div className="phc-subsection-heading">
                                                        <div>
                                                            <span className="phc-eyebrow">
                                                                {t("phcDashboard.completedLabel", {
                                                                    defaultValue: "COMPLETED"
                                                                })}
                                                            </span>
                                                            <h4>
                                                                {t("phcDashboard.vitalsRecordedHeading")}
                                                            </h4>
                                                        </div>
                                                        <span className="phc-check-mark">✓</span>
                                                    </div>

                                                    <div className="phc-vitals-readings">
                                                        <div>
                                                            <span>
                                                                {t("phcDashboard.temperature")}
                                                            </span>
                                                            <strong>
                                                                {recordedVitals.temperature ?? unknown}
                                                                {recordedVitals.temperature !== undefined &&
                                                                    recordedVitals.temperature !== null
                                                                    ? " °C"
                                                                    : ""}
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {t("phcDashboard.oxygenLevel")}
                                                            </span>
                                                            <strong>
                                                                {recordedVitals.oxygenLevel ?? unknown}
                                                                {recordedVitals.oxygenLevel !== undefined &&
                                                                    recordedVitals.oxygenLevel !== null
                                                                    ? "%"
                                                                    : ""}
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {t("phcDashboard.pulseRate")}
                                                            </span>
                                                            <strong>
                                                                {recordedVitals.pulseRate ?? unknown}
                                                                {recordedVitals.pulseRate !== undefined &&
                                                                    recordedVitals.pulseRate !== null
                                                                    ? " bpm"
                                                                    : ""}
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {t("phcDashboard.bloodPressure")}
                                                            </span>
                                                            <strong>
                                                                {recordedVitals.bloodPressure || unknown}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    <div className="phc-recorded-notes">
                                                        <strong>
                                                            {t("phcDashboard.notes")}
                                                        </strong>
                                                        <p>
                                                            {recordedVitals.notes ||
                                                                t("phcDashboard.noNotes")}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="phc-vitals-form">
                                                    <div className="phc-subsection-heading">
                                                        <div>
                                                            <span className="phc-eyebrow">
                                                                {t("phcDashboard.vitalsFormEyebrow", {
                                                                    defaultValue: "CLINICAL OBSERVATIONS"
                                                                })}
                                                            </span>
                                                            <h4>
                                                                {t("phcDashboard.recordPatientVitals")}
                                                            </h4>
                                                        </div>
                                                        <span className="phc-vitals-form-icon">
                                                            ♥
                                                        </span>
                                                    </div>

                                                    {!triageId && (
                                                        <p className="phc-field-warning">
                                                            {t("phcDashboard.triageRecordNotFound")}
                                                        </p>
                                                    )}

                                                    <div className="phc-form-grid">
                                                        <div className="phc-form-field">
                                                            <label htmlFor={`temp-${request._id}`}>
                                                                {t("phcDashboard.temperature")} (°C)
                                                            </label>
                                                            <input
                                                                id={`temp-${request._id}`}
                                                                type="number"
                                                                step="0.1"
                                                                inputMode="decimal"
                                                                placeholder={t(
                                                                    "phcDashboard.temperaturePlaceholder"
                                                                )}
                                                                value={patientVitals.temperature ?? ""}
                                                                onChange={(e) =>
                                                                    handleVitalsChange(
                                                                        triageId,
                                                                        "temperature",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={!triageId}
                                                            />
                                                        </div>

                                                        <div className="phc-form-field">
                                                            <label htmlFor={`oxygen-${request._id}`}>
                                                                {t("phcDashboard.oxygenLevelWithUnit")}
                                                            </label>
                                                            <input
                                                                id={`oxygen-${request._id}`}
                                                                type="number"
                                                                step="1"
                                                                inputMode="numeric"
                                                                placeholder={t(
                                                                    "phcDashboard.oxygenPlaceholder"
                                                                )}
                                                                value={patientVitals.oxygenLevel ?? ""}
                                                                onChange={(e) =>
                                                                    handleVitalsChange(
                                                                        triageId,
                                                                        "oxygenLevel",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={!triageId}
                                                            />
                                                        </div>

                                                        <div className="phc-form-field">
                                                            <label htmlFor={`pulse-${request._id}`}>
                                                                {t("phcDashboard.pulseRate")} (bpm)
                                                            </label>
                                                            <input
                                                                id={`pulse-${request._id}`}
                                                                type="number"
                                                                step="1"
                                                                inputMode="numeric"
                                                                placeholder={t(
                                                                    "phcDashboard.pulsePlaceholder"
                                                                )}
                                                                value={patientVitals.pulseRate ?? ""}
                                                                onChange={(e) =>
                                                                    handleVitalsChange(
                                                                        triageId,
                                                                        "pulseRate",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={!triageId}
                                                            />
                                                        </div>

                                                        <div className="phc-form-field">
                                                            <label htmlFor={`bp-${request._id}`}>
                                                                {t("phcDashboard.bloodPressure")}
                                                            </label>
                                                            <input
                                                                id={`bp-${request._id}`}
                                                                type="text"
                                                                placeholder={t(
                                                                    "phcDashboard.bloodPressurePlaceholder"
                                                                )}
                                                                value={patientVitals.bloodPressure || ""}
                                                                onChange={(e) =>
                                                                    handleVitalsChange(
                                                                        triageId,
                                                                        "bloodPressure",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={!triageId}
                                                            />
                                                        </div>

                                                        <div className="phc-form-field phc-form-field-full">
                                                            <label htmlFor={`notes-${request._id}`}>
                                                                {t("phcDashboard.notes")}
                                                            </label>
                                                            <textarea
                                                                id={`notes-${request._id}`}
                                                                rows="3"
                                                                placeholder={t(
                                                                    "phcDashboard.notesPlaceholder"
                                                                )}
                                                                value={patientVitals.notes || ""}
                                                                onChange={(e) =>
                                                                    handleVitalsChange(
                                                                        triageId,
                                                                        "notes",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={!triageId}
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="phc-button phc-button-primary phc-save-vitals-button"
                                                        onClick={() => recordVitals(request)}
                                                        disabled={
                                                            savingVitalsId === request._id ||
                                                            !triageId
                                                        }
                                                    >
                                                        {savingVitalsId === request._id && (
                                                            <span className="phc-spinner" />
                                                        )}
                                                        {savingVitalsId === request._id
                                                            ? t("phcDashboard.savingVitals")
                                                            : t("phcDashboard.saveVitals")}
                                                    </button>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* Emergency requests */}
                {(emergencyRequests.length > 0 || emergencyLoaded) && (
                    <section className="phc-content-section phc-emergency-section">
                        <SectionHeading
                            eyebrow={t("phcDashboard.emergencyEyebrow", {
                                defaultValue: "PRIORITY RESPONSE"
                            })}
                            title={`🚨 ${t("phcDashboard.emergencyRequests")}`}
                            description={t("phcDashboard.emergencyDescription", {
                                defaultValue:
                                    "Review emergency requests assigned to this facility and update the response status."
                            })}
                            count={emergencyRequests.length}
                        >
                            <button
                                type="button"
                                className="phc-button phc-button-light"
                                onClick={fetchEmergencyRequests}
                                disabled={emergencyLoading}
                            >
                                {emergencyLoading
                                    ? t("phcDashboard.loadingEmergencyRequests")
                                    : t("phcDashboard.refresh", {
                                          defaultValue: "Refresh"
                                      })}
                            </button>
                        </SectionHeading>

                        {emergencyRequests.length === 0 ? (
                            <EmptyState
                                icon="✓"
                                title={t("phcDashboard.noEmergencyTitle", {
                                    defaultValue: "No pending emergency requests"
                                })}
                                description={t("phcDashboard.noPendingEmergency")}
                            />
                        ) : (
                            <div className="phc-card-grid">
                                {emergencyRequests.map((request) => (
                                    <article
                                        key={request._id}
                                        className="phc-patient-card phc-emergency-card"
                                    >
                                        <div className="phc-card-topline">
                                            <span className="phc-emergency-label">
                                                <span aria-hidden="true">🚨</span>
                                                {t("phcDashboard.emergencyPriorityLabel", {
                                                    defaultValue: "EMERGENCY REQUEST"
                                                })}
                                            </span>
                                            <span
                                                className={`phc-badge ${
                                                    request.status === "in_progress"
                                                        ? "phc-badge-warning"
                                                        : "phc-badge-danger"
                                                }`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>

                                        <PatientIdentity request={request} />

                                        <div className="phc-detail-grid">
                                            <InfoItem
                                                label={t("phcDashboard.emergencyReason")}
                                                value={request.emergencyReason}
                                            />
                                            <InfoItem
                                                label={t("phcDashboard.facility")}
                                                value={request.requestedFacility?.name ||
                                                    t("phcDashboard.notAssigned")}
                                            />
                                            <InfoItem
                                                label={t("phcDashboard.ambulance")}
                                                value={
                                                    request.ambulanceRequested
                                                        ? `🚑 ${t(
                                                              "phcDashboard.ambulanceRequested"
                                                          )}`
                                                        : t("phcDashboard.notRequested")
                                                }
                                            />
                                            <InfoItem
                                                label={t("phcDashboard.status")}
                                                value={request.status}
                                            />
                                        </div>

                                        {request.emergencyGuidance && (
                                            <div className="phc-emergency-guidance">
                                                <strong>
                                                    {t("phcDashboard.emergencyGuidance")}
                                                </strong>
                                                <p>{request.emergencyGuidance}</p>
                                            </div>
                                        )}

                                        {request.notes && (
                                            <div className="phc-recorded-notes">
                                                <strong>
                                                    {t("phcDashboard.notes")}
                                                </strong>
                                                <p>{request.notes}</p>
                                            </div>
                                        )}

                                        <div className="phc-card-footer">
                                            <span className="phc-muted-caption">
                                                {t("phcDashboard.emergencyUpdateCaption", {
                                                    defaultValue:
                                                        "Update the status when your team begins or completes its response."
                                                })}
                                            </span>

                                            {request.status !== "in_progress" &&
                                                request.status !== "completed" &&
                                                request.status !== "cancelled" && (
                                                    <button
                                                        type="button"
                                                        className="phc-button phc-button-emergency"
                                                        onClick={() =>
                                                            updateEmergencyStatus(
                                                                request._id,
                                                                "in_progress"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingEmergencyId === request._id
                                                        }
                                                    >
                                                        {updatingEmergencyId === request._id && (
                                                            <span className="phc-spinner" />
                                                        )}
                                                        {updatingEmergencyId === request._id
                                                            ? t("phcDashboard.updating")
                                                            : t(
                                                                  "phcDashboard.startEmergencyResponse"
                                                              )}
                                                    </button>
                                                )}

                                            {request.status === "in_progress" && (
                                                <button
                                                    type="button"
                                                    className="phc-button phc-button-primary"
                                                    onClick={() =>
                                                        updateEmergencyStatus(
                                                            request._id,
                                                            "completed"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingEmergencyId === request._id
                                                    }
                                                >
                                                    {updatingEmergencyId === request._id && (
                                                        <span className="phc-spinner" />
                                                    )}
                                                    {updatingEmergencyId === request._id
                                                        ? t("phcDashboard.updating")
                                                        : t("phcDashboard.markCompleted")}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <footer className="phc-dashboard-footer">
                    <span className="phc-footer-cross" aria-hidden="true">+</span>
                    <p>
                        {t("phcDashboard.footerNote", {
                            defaultValue:
                                "GramArogya · Supporting timely, accessible primary healthcare."
                        })}
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default PHCDashboard;

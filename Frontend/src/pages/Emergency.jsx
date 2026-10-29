
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Emergency.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api/emergencies";

function Emergency() {
    const { t } = useTranslation();

    const [emergencyReason, setEmergencyReason] = useState("");
    const [ambulanceRequested, setAmbulanceRequested] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const tr = (key, fallback) =>
        t(`emergency.${key}`, { defaultValue: fallback });

    const requestEmergencyHelp = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setError(tr("loginRequired", "Please log in to request emergency assistance."));
            return;
        }

        if (!emergencyReason.trim()) {
            setError(tr("reasonRequired", "Please describe the emergency."));
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(null);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    emergencyReason: emergencyReason.trim(),
                    ambulanceRequested,
                    notes: "Emergency request created from patient dashboard."
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    tr("requestFailed", "Failed to submit emergency request.")
                );
            }

            setSuccess(data.emergencyRequest);
            setEmergencyReason("");
            setAmbulanceRequested(false);
        } catch (err) {
            setError(
                err.message ||
                tr("requestFailed", "Failed to submit emergency request.")
            );
        } finally {
            setLoading(false);
        }
    };

    const statusLabel = (status) => {
        if (!status) return "Received";

        return String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <section className="emergency-page">
            <div className="emergency-layout">
                <header className="emergency-heading">
                    <div className="emergency-heading-icon" aria-hidden="true">
                        !
                    </div>

                    <div>
                        <span className="emergency-eyebrow">
                            {tr("urgentCare", "URGENT CARE")}
                        </span>

                        <h2>
                            {tr("title", "Emergency Assistance")}
                        </h2>

                        <p>
                            {tr(
                                "pageSubtitle",
                                "Tell us what is happening so your emergency request can be recorded."
                            )}
                        </p>
                    </div>
                </header>

                <div className="emergency-alert" role="note">
                    <span className="emergency-alert-icon" aria-hidden="true">
                        ⚠
                    </span>

                    <div>
                        <strong>
                            {tr("warningTitle", "Important safety notice")}
                        </strong>

                        <p>
                            {tr(
                                "warning",
                                "If this is a life-threatening emergency, contact local emergency services or seek immediate medical help. Do not wait for a response from this application."
                            )}
                        </p>
                    </div>
                </div>

                <form
                    className="emergency-form"
                    onSubmit={requestEmergencyHelp}
                >
                    <div className="emergency-section-heading">
                        <span className="emergency-step">01</span>

                        <div>
                            <h3>
                                {tr("detailsHeading", "Describe the emergency")}
                            </h3>

                            <p>
                                {tr(
                                    "detailsSubtitle",
                                    "Provide the most important details first."
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="emergency-field">
                        <label htmlFor="emergency-reason">
                            {tr("whatHappening", "What is happening?")}
                            <span className="required-mark"> *</span>
                        </label>

                        <textarea
                            id="emergency-reason"
                            value={emergencyReason}
                            onChange={(e) =>
                                setEmergencyReason(e.target.value)
                            }
                            placeholder={tr(
                                "reasonPlaceholder",
                                "Describe the symptoms, incident, or help needed..."
                            )}
                            rows={5}
                            maxLength={2000}
                            required
                            disabled={loading}
                            aria-describedby="emergency-character-count"
                        />

                        <div className="emergency-field-footer">
                            <span>
                                {tr(
                                    "privacyHint",
                                    "Share only the information needed to explain the emergency."
                                )}
                            </span>

                            <span id="emergency-character-count">
                                {emergencyReason.length}/2000
                            </span>
                        </div>
                    </div>

                    <label
                        className={`ambulance-option ${
                            ambulanceRequested ? "ambulance-option-selected" : ""
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={ambulanceRequested}
                            onChange={(e) =>
                                setAmbulanceRequested(e.target.checked)
                            }
                            disabled={loading}
                        />

                        <span className="ambulance-checkbox" aria-hidden="true">
                            {ambulanceRequested ? "✓" : ""}
                        </span>

                        <span className="ambulance-option-icon" aria-hidden="true">
                            +
                        </span>

                        <span className="ambulance-option-copy">
                            <strong>
                                {tr(
                                    "ambulanceAssistance",
                                    "Request ambulance assistance"
                                )}
                            </strong>

                            <small>
                                {tr(
                                    "ambulanceDescription",
                                    "Include an ambulance request with this emergency report."
                                )}
                            </small>
                        </span>
                    </label>

                    {error && (
                        <div
                            className="emergency-error"
                            role="alert"
                            aria-live="assertive"
                        >
                            <span aria-hidden="true">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        className="emergency-submit"
                        type="submit"
                        disabled={loading || !emergencyReason.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="emergency-spinner" />
                                {tr("requesting", "Submitting request...")}
                            </>
                        ) : (
                            <>
                                <span aria-hidden="true">+</span>
                                {tr(
                                    "requestButton",
                                    "Request Emergency Assistance"
                                )}
                                <span className="emergency-submit-arrow">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                    <p className="emergency-form-disclaimer">
                        {tr(
                            "formDisclaimer",
                            "Submitting this form records an emergency request. It does not guarantee that an ambulance has been dispatched."
                        )}
                    </p>
                </form>

                {success && (
                    <section
                        className="emergency-result"
                        aria-live="polite"
                        aria-labelledby="emergency-result-title"
                    >
                        <div className="emergency-result-header">
                            <span className="emergency-result-check">
                                ✓
                            </span>

                            <div>
                                <span className="emergency-eyebrow">
                                    {tr("requestCreated", "REQUEST RECORDED")}
                                </span>

                                <h3 id="emergency-result-title">
                                    {tr(
                                        "requestSuccessTitle",
                                        "Emergency request submitted"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "requestSuccessSubtitle",
                                        "Your request was saved. Review the details below."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="emergency-result-grid">
                            <div className="emergency-result-item">
                                <span>{tr("status", "Status")}</span>

                                <strong className="emergency-status-badge">
                                    {statusLabel(success.status)}
                                </strong>
                            </div>

                            <div className="emergency-result-item">
                                <span>{tr("ambulanceRequest", "Ambulance request")}</span>

                                <strong>
                                    {success.ambulanceRequested
                                        ? tr("requested", "Requested")
                                        : tr("notRequested", "Not requested")}
                                </strong>
                            </div>
                        </div>

                        <div className="emergency-result-item emergency-reason-result">
                            <span>{tr("reason", "Emergency details")}</span>
                            <p>{success.emergencyReason}</p>
                        </div>

                        {success.requestedFacility && (
                            <div className="emergency-facility">
                                <div className="emergency-facility-icon">
                                    +
                                </div>

                                <div className="emergency-facility-details">
                                    <span className="emergency-eyebrow">
                                        {tr("nearestFacility", "SUGGESTED FACILITY")}
                                    </span>

                                    <h4>{success.requestedFacility.name}</h4>

                                    {success.requestedFacility.address && (
                                        <p>{success.requestedFacility.address}</p>
                                    )}

                                    {(success.requestedFacility.district ||
                                        success.requestedFacility.state) && (
                                        <p>
                                            {[
                                                success.requestedFacility.district,
                                                success.requestedFacility.state
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    )}

                                    {success.requestedFacility.phone && (
                                        <p className="emergency-phone">
                                            <span>
                                                {tr("phone", "Phone")}:
                                            </span>{" "}
                                            <a
                                                href={`tel:${success.requestedFacility.phone}`}
                                            >
                                                {success.requestedFacility.phone}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {success.emergencyGuidance && (
                            <div className="emergency-guidance">
                                <strong>
                                    {tr("guidance", "Emergency guidance")}
                                </strong>

                                <p>{success.emergencyGuidance}</p>
                            </div>
                        )}

                        <p className="emergency-result-disclaimer">
                            {tr(
                                "resultDisclaimer",
                                "A recorded request is not confirmation of ambulance dispatch or medical assistance. Seek immediate help directly if the situation is life-threatening."
                            )}
                        </p>
                    </section>
                )}
            </div>
        </section>
    );
}

export default Emergency;

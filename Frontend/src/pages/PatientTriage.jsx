
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./PatientTriage.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api/triage/check";

const SYMPTOMS = [
    { value: "Fever", key: "symptoms.fever", fallback: "Fever", icon: "◉" },
    { value: "Cough", key: "symptoms.cough", fallback: "Cough", icon: "〰" },
    { value: "Cold", key: "symptoms.cold", fallback: "Cold", icon: "❄" },
    { value: "Headache", key: "symptoms.headache", fallback: "Headache", icon: "◉" },
    { value: "Body Pain", key: "symptoms.bodyPain", fallback: "Body pain", icon: "♡" },
    { value: "Weakness", key: "symptoms.weakness", fallback: "Weakness", icon: "↘" },
    {
        value: "Breathing Difficulty",
        key: "symptoms.breathingDifficulty",
        fallback: "Breathing difficulty",
        icon: "≋"
    },
    { value: "Chest Pain", key: "symptoms.chestPain", fallback: "Chest pain", icon: "♡" },
    { value: "Vomiting", key: "symptoms.vomiting", fallback: "Vomiting", icon: "↗" },
    { value: "Diarrhea", key: "symptoms.diarrhea", fallback: "Diarrhea", icon: "≋" }
];

const SEVERITY_LEVELS = [
    {
        value: "mild",
        icon: "○",
        fallback: "Mild",
        description: "Noticeable, but manageable"
    },
    {
        value: "moderate",
        icon: "◐",
        fallback: "Moderate",
        description: "Affecting daily activities"
    },
    {
        value: "severe",
        icon: "●",
        fallback: "Severe",
        description: "Intense or difficult to tolerate"
    }
];

const PatientTriage = () => {
    const { t } = useTranslation();

    const [symptoms, setSymptoms] = useState([]);
    const [duration, setDuration] = useState("");
    const [severity, setSeverity] = useState("");
    const [existingConditions, setExistingConditions] = useState("");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tr = (key, fallback) =>
        t(key, { defaultValue: fallback });

    const toggleSymptom = (symptom) => {
        setSymptoms((currentSymptoms) =>
            currentSymptoms.includes(symptom)
                ? currentSymptoms.filter((item) => item !== symptom)
                : [...currentSymptoms, symptom]
        );

        setError("");
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setResult(null);

        if (symptoms.length === 0) {
            setError(
                tr("messages.selectSymptom", "Please select at least one symptom.")
            );
            return;
        }

        if (!duration.trim()) {
            setError(
                tr("triage.durationRequired", "Please enter how long you have had these symptoms.")
            );
            return;
        }

        if (!severity) {
            setError(
                tr("messages.selectSeverity", "Please select the severity of your symptoms.")
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                tr("messages.loginRequired", "Please log in to continue.")
            );
            return;
        }

        const conditions = existingConditions
            .split(",")
            .map((condition) => condition.trim())
            .filter(Boolean);

        const requestData = {
            symptoms,
            duration: duration.trim(),
            severity,
            existingConditions: conditions
        };

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    responseData.message ||
                    tr("messages.requestFailed", "Unable to complete the symptom check. Please try again.")
                );
            }

            if (!responseData.triageRecord) {
                throw new Error(
                    tr("triage.resultUnavailable", "The symptom check did not return a result. Please try again.")
                );
            }

            setResult(responseData.triageRecord);
        } catch (err) {
            setError(
                err.message ||
                tr("messages.requestFailed", "Unable to complete the symptom check.")
            );
        } finally {
            setLoading(false);
        }
    };

    const urgencyClass = String(result?.urgencyLevel || "unknown")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");

    return (
        <section className="patient-triage-page">
            <div className="patient-triage-layout">
                <header className="patient-triage-heading">
                    <div className="patient-triage-heading-icon" aria-hidden="true">
                        ♡
                    </div>

                    <div>
                        <span className="patient-triage-eyebrow">
                            {tr("triage.pageEyebrow", "HEALTH CHECK")}
                        </span>

                        <h2>{tr("triage.title", "Symptom Check")}</h2>

                        <p>
                            {tr(
                                "triage.subtitle",
                                "Share how you are feeling to receive guidance on the next appropriate step."
                            )}
                        </p>
                    </div>
                </header>

                <div className="patient-triage-safety" role="note">
                    <span
                        className="patient-triage-safety-icon"
                        aria-hidden="true"
                    >
                        !
                    </span>

                    <div>
                        <strong>
                            {tr("triage.safetyTitle", "Important health and safety notice")}
                        </strong>

                        <p>
                            {tr(
                                "triage.safetyNote",
                                "This tool provides urgency guidance and does not diagnose conditions or prescribe treatment. If you have severe breathing difficulty, chest pain, or another life-threatening symptom, seek emergency medical help immediately."
                            )}
                        </p>
                    </div>
                </div>

                <form
                    className="patient-triage-form"
                    onSubmit={handleSubmit}
                >
                    <section className="patient-triage-section">
                        <div className="patient-triage-section-heading">
                            <span className="patient-triage-step">01</span>

                            <div>
                                <h3>
                                    {tr(
                                        "triage.symptomsQuestion",
                                        "What symptoms are you experiencing?"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "triage.symptomsHelp",
                                        "Select every symptom that applies."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div
                            className="patient-triage-symptom-grid"
                            aria-label={tr(
                                "triage.symptomsQuestion",
                                "Select your symptoms"
                            )}
                        >
                            {SYMPTOMS.map((symptom) => {
                                const selected = symptoms.includes(symptom.value);

                                return (
                                    <button
                                        type="button"
                                        key={symptom.value}
                                        className={`patient-triage-symptom ${
                                            selected ? "selected" : ""
                                        }`}
                                        onClick={() => toggleSymptom(symptom.value)}
                                        aria-pressed={selected}
                                    >
                                        <span
                                            className="patient-triage-symptom-icon"
                                            aria-hidden="true"
                                        >
                                            {symptom.icon}
                                        </span>

                                        <span>
                                            {tr(symptom.key, symptom.fallback)}
                                        </span>

                                        <span
                                            className="patient-triage-symptom-check"
                                            aria-hidden="true"
                                        >
                                            {selected ? "✓" : "+"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="patient-triage-selection-count" aria-live="polite">
                            {symptoms.length}{" "}
                            {tr("triage.symptomsSelected", "symptoms selected")}
                        </p>
                    </section>

                    <div className="patient-triage-divider" />

                    <section className="patient-triage-section">
                        <div className="patient-triage-section-heading">
                            <span className="patient-triage-step">02</span>

                            <div>
                                <h3>
                                    {tr(
                                        "triage.durationQuestion",
                                        "How long have you had these symptoms?"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "triage.durationHelp",
                                        "For example: since this morning, 2 days, or 1 week."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="patient-triage-field">
                            <label htmlFor="triage-duration">
                                {tr("triage.durationLabel", "Symptom duration")}
                                <span aria-hidden="true"> *</span>
                            </label>

                            <input
                                id="triage-duration"
                                type="text"
                                placeholder={tr(
                                    "triage.durationPlaceholder",
                                    "e.g. 2 days"
                                )}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                maxLength={100}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </section>

                    <div className="patient-triage-divider" />

                    <section className="patient-triage-section">
                        <div className="patient-triage-section-heading">
                            <span className="patient-triage-step">03</span>

                            <div>
                                <h3>
                                    {tr(
                                        "triage.severityQuestion",
                                        "How severe do the symptoms feel?"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "triage.severityHelp",
                                        "Choose the option that best describes how you feel."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="patient-triage-severity-grid">
                            {SEVERITY_LEVELS.map((level) => {
                                const selected = severity === level.value;

                                return (
                                    <button
                                        type="button"
                                        key={level.value}
                                        className={`patient-triage-severity ${
                                            selected
                                                ? `selected ${level.value}`
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setSeverity(level.value);
                                            setError("");
                                            setResult(null);
                                        }}
                                        aria-pressed={selected}
                                    >
                                        <span
                                            className="patient-triage-severity-icon"
                                            aria-hidden="true"
                                        >
                                            {level.icon}
                                        </span>

                                        <span className="patient-triage-severity-copy">
                                            <strong>
                                                {tr(
                                                    `severity.${level.value}`,
                                                    level.fallback
                                                )}
                                            </strong>

                                            <small>
                                                {tr(
                                                    `triage.severityDescription.${level.value}`,
                                                    level.description
                                                )}
                                            </small>
                                        </span>

                                        <span
                                            className="patient-triage-radio"
                                            aria-hidden="true"
                                        >
                                            {selected ? "✓" : ""}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <div className="patient-triage-divider" />

                    <section className="patient-triage-section">
                        <div className="patient-triage-section-heading">
                            <span className="patient-triage-step">04</span>

                            <div>
                                <h3>
                                    {tr(
                                        "triage.existingConditions",
                                        "Existing health conditions"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "triage.conditionsHelp",
                                        "Include any relevant conditions, separated by commas. This field is optional."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="patient-triage-field">
                            <label htmlFor="triage-conditions">
                                {tr(
                                    "triage.conditionsLabel",
                                    "Health conditions"
                                )}
                            </label>

                            <input
                                id="triage-conditions"
                                type="text"
                                placeholder={tr(
                                    "triage.conditionsPlaceholder",
                                    "e.g. diabetes, asthma"
                                )}
                                value={existingConditions}
                                onChange={(e) =>
                                    setExistingConditions(e.target.value)
                                }
                                maxLength={500}
                            />
                        </div>
                    </section>

                    {error && (
                        <div
                            className="patient-triage-error"
                            role="alert"
                            aria-live="assertive"
                        >
                            <span aria-hidden="true">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        className="patient-triage-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="patient-triage-spinner" />
                                {tr("triage.checking", "Checking urgency...")}
                            </>
                        ) : (
                            <>
                                <span aria-hidden="true">♡</span>
                                {tr(
                                    "triage.checkUrgency",
                                    "Check Symptom Urgency"
                                )}
                                <span className="patient-triage-submit-arrow">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                    <p className="patient-triage-privacy-note">
                        {tr(
                            "triage.privacyNote",
                            "Your responses are submitted securely to generate your symptom check record."
                        )}
                    </p>
                </form>

                {result && (
                    <section
                        className={`patient-triage-result urgency-${urgencyClass}`}
                        aria-live="polite"
                        aria-labelledby="patient-triage-result-title"
                    >
                        <div className="patient-triage-result-header">
                            <span className="patient-triage-result-icon" aria-hidden="true">
                                ✓
                            </span>

                            <div>
                                <span className="patient-triage-eyebrow">
                                    {tr("triage.resultEyebrow", "ASSESSMENT COMPLETE")}
                                </span>

                                <h3 id="patient-triage-result-title">
                                    {tr("triage.result", "Your symptom check result")}
                                </h3>
                            </div>
                        </div>

                        <div className="patient-triage-result-grid">
                            <div className="patient-triage-result-item">
                                <span>
                                    {tr("triage.urgency", "Urgency level")}
                                </span>

                                <strong className="patient-triage-urgency-badge">
                                    {String(result.urgencyLevel || "Not specified")
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (char) =>
                                            char.toUpperCase()
                                        )}
                                </strong>
                            </div>

                            <div className="patient-triage-result-item">
                                <span>
                                    {tr(
                                        "triage.doctorReview",
                                        "Doctor review"
                                    )}
                                </span>

                                <strong>
                                    {result.requiresDoctorReview
                                        ? tr("triage.required", "Recommended")
                                        : tr("triage.notRequired", "Not flagged")}
                                </strong>
                            </div>
                        </div>

                        <div className="patient-triage-recommendation">
                            <span>
                                {tr(
                                    "triage.recommendedAction",
                                    "Recommended next step"
                                )}
                            </span>

                            <p>{result.recommendedAction}</p>
                        </div>

                        <div className="patient-triage-result-note">
                            <span aria-hidden="true">ⓘ</span>
                            <p>
                                {tr(
                                    "triage.resultNote",
                                    "This result provides urgency guidance only. It is not a medical diagnosis or a treatment prescription. Seek professional medical help for assessment."
                                )}
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
};

export default PatientTriage;

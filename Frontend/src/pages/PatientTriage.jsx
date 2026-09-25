import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

const PatientTriage = () => {
    const { t } = useTranslation();

    const [symptoms, setSymptoms] = useState([]);
    const [duration, setDuration] = useState("");
    const [severity, setSeverity] = useState("");
    const [existingConditions, setExistingConditions] = useState("");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const availableSymptoms = [
        {
            value: "Fever",
            label: t("symptoms.fever")
        },
        {
            value: "Cough",
            label: t("symptoms.cough")
        },
        {
            value: "Cold",
            label: t("symptoms.cold")
        },
        {
            value: "Headache",
            label: t("symptoms.headache")
        },
        {
            value: "Body Pain",
            label: t("symptoms.bodyPain")
        },
        {
            value: "Weakness",
            label: t("symptoms.weakness")
        },
        {
            value: "Breathing Difficulty",
            label: t("symptoms.breathingDifficulty")
        },
        {
            value: "Chest Pain",
            label: t("symptoms.chestPain")
        },
        {
            value: "Vomiting",
            label: t("symptoms.vomiting")
        },
        {
            value: "Diarrhea",
            label: t("symptoms.diarrhea")
        }
    ];

    const toggleSymptom = (symptom) => {
        if (symptoms.includes(symptom)) {
            setSymptoms(
                symptoms.filter((item) => item !== symptom)
            );
        } else {
            setSymptoms([...symptoms, symptom]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setResult(null);

        if (symptoms.length === 0) {
            setError(t("messages.selectSymptom"));
            return;
        }

        if (!severity) {
            setError(t("messages.selectSeverity"));
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError(t("messages.loginRequired"));
            return;
        }

        const conditions = existingConditions
            .split(",")
            .map((condition) => condition.trim())
            .filter((condition) => condition !== "");

        const data = {
            symptoms,
            duration,
            severity,
            existingConditions: conditions
        };

        try {
            setLoading(true);

            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/triage/check",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message ||
                    t("messages.requestFailed")
                );
            }

            setResult(responseData.triageRecord);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="triage-page">
            <div className="triage-container">

                <LanguageSelector />

                <h1>{t("triage.title")}</h1>

                <p className="triage-subtitle">
                    {t("triage.subtitle")}
                </p>

                <div className="safety-note">
                    {t("triage.safetyNote")}
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Symptoms */}
                    <div className="form-section">
                        <h2>
                            {t("triage.symptomsQuestion")}
                        </h2>

                        <div className="symptom-grid">
                            {availableSymptoms.map((symptom) => (
                                <button
                                    type="button"
                                    key={symptom.value}
                                    className={
                                        symptoms.includes(
                                            symptom.value
                                        )
                                            ? "symptom-button selected"
                                            : "symptom-button"
                                    }
                                    onClick={() =>
                                        toggleSymptom(
                                            symptom.value
                                        )
                                    }
                                >
                                    {symptom.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="form-section">
                        <h2>
                            {t("triage.durationQuestion")}
                        </h2>

                        <input
                            type="text"
                            placeholder={t(
                                "triage.durationPlaceholder"
                            )}
                            value={duration}
                            onChange={(e) =>
                                setDuration(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Severity */}
                    <div className="form-section">
                        <h2>
                            {t("triage.severityQuestion")}
                        </h2>

                        <div className="severity-options">

                            {[
                                "mild",
                                "moderate",
                                "severe"
                            ].map((level) => (
                                <button
                                    type="button"
                                    key={level}
                                    className={
                                        severity === level
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSeverity(level)
                                    }
                                >
                                    {t(
                                        `severity.${level}`
                                    )}
                                </button>
                            ))}

                        </div>
                    </div>

                    {/* Existing Conditions */}
                    <div className="form-section">
                        <h2>
                            {t(
                                "triage.existingConditions"
                            )}
                        </h2>

                        <input
                            type="text"
                            placeholder={t(
                                "triage.conditionsPlaceholder"
                            )}
                            value={existingConditions}
                            onChange={(e) =>
                                setExistingConditions(
                                    e.target.value
                                )
                            }
                        />

                        <p className="optional-text">
                            {t(
                                "triage.conditionsHelp"
                            )}
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        className="submit-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? t("triage.checking")
                            : t("triage.checkUrgency")}
                    </button>

                </form>

                {/* Triage Result */}
                {result && (
                    <div className="triage-result">

                        <h2>
                            {t("triage.result")}
                        </h2>

                        <p>
                            <strong>
                                {t("triage.urgency")}:
                            </strong>{" "}
                            {result.urgencyLevel}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "triage.recommendedAction"
                                )}:
                            </strong>{" "}
                            {result.recommendedAction}
                        </p>

                        <p>
                            <strong>
                                {t(
                                    "triage.doctorReview"
                                )}:
                            </strong>{" "}
                            {result.requiresDoctorReview
                                ? t("triage.required")
                                : t("triage.notRequired")}
                        </p>

                        <p className="result-note">
                            {t("triage.resultNote")}
                        </p>

                    </div>
                )}

            </div>
        </div>
    );
};

export default PatientTriage;

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./GovernmentSchemes.css";

const API_URL =
    "https://gramarogya-27q3.onrender.com/api/government-schemes/match";

function GovernmentSchemes() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        isPregnant: false,
        state: "Maharashtra"
    });

    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const tr = (key, fallback) =>
        t(`governmentSchemes.${key}`, { defaultValue: fallback });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

        setError("");
    };

    const handlePregnancyChange = (event) => {
        setFormData((currentData) => ({
            ...currentData,
            isPregnant: event.target.value === "true"
        }));

        setError("");
    };

    const findSchemes = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                tr("loginRequired", "Please log in to find eligible schemes.")
            );
            return;
        }

        if (
            formData.age === "" ||
            !Number.isFinite(Number(formData.age)) ||
            Number(formData.age) < 0 ||
            Number(formData.age) > 120 ||
            !formData.gender
        ) {
            setError(
                tr(
                    "ageGenderRequired",
                    "Enter a valid age and select your gender."
                )
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSearched(false);
            setSchemes([]);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: Number(formData.age),
                    gender: formData.gender,
                    isPregnant: formData.isPregnant,
                    state: formData.state
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    tr(
                        "requestFailed",
                        "Unable to find matching schemes. Please try again."
                    )
                );
            }

            setSchemes(
                Array.isArray(data.schemes) ? data.schemes : []
            );
            setSearched(true);
        } catch (err) {
            setError(
                err.message ||
                tr("requestFailed", "Unable to find matching schemes.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="government-schemes-page">
            <div className="government-schemes-layout">
                <header className="government-schemes-heading">
                    <div
                        className="government-schemes-heading-icon"
                        aria-hidden="true"
                    >
                        ✚
                    </div>

                    <div className="government-schemes-heading-copy">
                        <span className="government-schemes-eyebrow">
                            {tr("eyebrow", "HEALTHCARE BENEFITS")}
                        </span>

                        <h2>
                            {tr("title", "Government Health Schemes")}
                        </h2>

                        <p>
                            {tr(
                                "subtitle",
                                "Explore healthcare benefits that may be relevant to you based on your profile."
                            )}
                        </p>
                    </div>
                </header>

                <div className="government-schemes-info-note" role="note">
                    <span aria-hidden="true">ⓘ</span>

                    <p>
                        {tr(
                            "infoNote",
                            "Matching results are suggestions based on the information you provide. Confirm the current eligibility criteria and application requirements with the official scheme authority."
                        )}
                    </p>
                </div>

                <form
                    className="government-schemes-form"
                    onSubmit={findSchemes}
                >
                    <div className="government-schemes-form-heading">
                        <span className="government-schemes-step">01</span>

                        <div>
                            <h3>
                                {tr(
                                    "profileHeading",
                                    "Tell us about yourself"
                                )}
                            </h3>

                            <p>
                                {tr(
                                    "profileDescription",
                                    "Complete these details to find potentially relevant schemes."
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="government-schemes-fields">
                        <div className="government-schemes-field">
                            <label htmlFor="scheme-age">
                                {tr("age", "Age")}
                                <span aria-hidden="true"> *</span>
                            </label>

                            <input
                                id="scheme-age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                max="120"
                                placeholder={tr(
                                    "agePlaceholder",
                                    "Enter your age"
                                )}
                                required
                            />
                        </div>

                        <div className="government-schemes-field">
                            <label htmlFor="scheme-gender">
                                {tr("gender", "Gender")}
                                <span aria-hidden="true"> *</span>
                            </label>

                            <select
                                id="scheme-gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    {tr("selectGender", "Select gender")}
                                </option>

                                <option value="male">
                                    {tr("male", "Male")}
                                </option>

                                <option value="female">
                                    {tr("female", "Female")}
                                </option>

                                <option value="other">
                                    {tr("other", "Other")}
                                </option>
                            </select>
                        </div>

                        <div className="government-schemes-field">
                            <label htmlFor="scheme-pregnancy">
                                {tr(
                                    "pregnancyQuestion",
                                    "Are you currently pregnant?"
                                )}
                            </label>

                            <select
                                id="scheme-pregnancy"
                                value={String(formData.isPregnant)}
                                onChange={handlePregnancyChange}
                            >
                                <option value="false">
                                    {tr("no", "No")}
                                </option>

                                <option value="true">
                                    {tr("yes", "Yes")}
                                </option>
                            </select>
                        </div>

                        <div className="government-schemes-field">
                            <label htmlFor="scheme-state">
                                {tr("state", "State")}
                            </label>

                            <select
                                id="scheme-state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="Maharashtra">
                                    {tr("maharashtra", "Maharashtra")}
                                </option>

                                <option value="Other">
                                    {tr("otherState", "Other state")}
                                </option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="government-schemes-error"
                            role="alert"
                            aria-live="polite"
                        >
                            <span aria-hidden="true">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        className="government-schemes-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="government-schemes-spinner" />
                                {tr("finding", "Finding matching schemes...")}
                            </>
                        ) : (
                            <>
                                <span aria-hidden="true">⌕</span>
                                {tr("findButton", "Find Eligible Schemes")}
                                <span className="government-schemes-arrow">
                                    →
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {searched && (
                    <section
                        className="government-schemes-results"
                        aria-live="polite"
                    >
                        <div className="government-schemes-results-heading">
                            <div>
                                <span className="government-schemes-eyebrow">
                                    {tr("resultsEyebrow", "MATCHED FOR YOU")}
                                </span>

                                <h3>
                                    {tr(
                                        "relevantSchemes",
                                        "Relevant Health Schemes"
                                    )}
                                </h3>

                                <p>
                                    {tr(
                                        "resultsDescription",
                                        "Review the benefits, eligibility details, and application information provided for each scheme."
                                    )}
                                </p>
                            </div>

                            <span className="government-schemes-count">
                                {schemes.length}
                            </span>
                        </div>

                        {schemes.length === 0 ? (
                            <div className="government-schemes-empty">
                                <span
                                    className="government-schemes-empty-icon"
                                    aria-hidden="true"
                                >
                                    ◇
                                </span>

                                <h4>
                                    {tr("noSchemes", "No matching schemes found")}
                                </h4>

                                <p>
                                    {tr(
                                        "noSchemesDescription",
                                        "No schemes matched these details. You can review your profile information or consult an official healthcare scheme office for assistance."
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="government-schemes-list">
                                {schemes.map((scheme, index) => {
                                    const benefits = Array.isArray(scheme.benefits)
                                        ? scheme.benefits
                                        : [];

                                    const eligibility = Array.isArray(
                                        scheme.eligibility
                                    )
                                        ? scheme.eligibility
                                        : [];

                                    const applicationProcess = Array.isArray(
                                        scheme.applicationProcess
                                    )
                                        ? scheme.applicationProcess
                                        : [];

                                    return (
                                        <article
                                            className="government-scheme-card"
                                            key={
                                                scheme.schemeId ||
                                                `${scheme.name}-${index}`
                                            }
                                        >
                                            <header className="government-scheme-card-header">
                                                <span
                                                    className="government-scheme-card-icon"
                                                    aria-hidden="true"
                                                >
                                                    ✚
                                                </span>

                                                <div className="government-scheme-card-title">
                                                    <span className="government-scheme-number">
                                                        {tr("schemeLabel", "SCHEME")}{" "}
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>

                                                    <h4>{scheme.name}</h4>
                                                </div>

                                                <span className="government-scheme-match">
                                                    {tr("matchedLabel", "Matched")}
                                                </span>
                                            </header>

                                            {scheme.description && (
                                                <p className="government-scheme-description">
                                                    {scheme.description}
                                                </p>
                                            )}

                                            {benefits.length > 0 && (
                                                <section className="government-scheme-section">
                                                    <h5>
                                                        <span aria-hidden="true">✓</span>
                                                        {tr("benefits", "Benefits")}
                                                    </h5>

                                                    <ul className="government-scheme-benefits">
                                                        {benefits.map((benefit, benefitIndex) => (
                                                            <li key={`${benefit}-${benefitIndex}`}>
                                                                {benefit}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            )}

                                            {eligibility.length > 0 && (
                                                <section className="government-scheme-section">
                                                    <h5>
                                                        <span aria-hidden="true">◎</span>
                                                        {tr("eligibility", "Eligibility")}
                                                    </h5>

                                                    <ul className="government-scheme-list-items">
                                                        {eligibility.map((item, itemIndex) => (
                                                            <li key={`${item}-${itemIndex}`}>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            )}

                                            {applicationProcess.length > 0 && (
                                                <section className="government-scheme-section">
                                                    <h5>
                                                        <span aria-hidden="true">↗</span>
                                                        {tr("howToApply", "How to Apply")}
                                                    </h5>

                                                    <ol className="government-scheme-steps">
                                                        {applicationProcess.map((step, stepIndex) => (
                                                            <li key={`${step}-${stepIndex}`}>
                                                                <span className="government-scheme-step-number">
                                                                    {stepIndex + 1}
                                                                </span>

                                                                <span>{step}</span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </section>
                                            )}

                                            {scheme.message && (
                                                <div className="government-scheme-message">
                                                    <span aria-hidden="true">ⓘ</span>
                                                    <p>{scheme.message}</p>
                                                </div>
                                            )}

                                            <footer className="government-scheme-card-footer">
                                                <span className="government-scheme-footer-note">
                                                    {tr(
                                                        "verifyDetails",
                                                        "Verify details with the scheme authority"
                                                    )}
                                                </span>

                                                {scheme.officialWebsite && (
                                                    <a
                                                        className="government-scheme-link"
                                                        href={scheme.officialWebsite}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {tr(
                                                            "officialWebsite",
                                                            "Official website"
                                                        )}
                                                        <span aria-hidden="true">↗</span>
                                                    </a>
                                                )}
                                            </footer>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </section>
    );
}

export default GovernmentSchemes;

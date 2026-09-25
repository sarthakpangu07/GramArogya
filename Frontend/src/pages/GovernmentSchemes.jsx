import { useState } from "react";

function GovernmentSchemes() {
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };

    const handlePregnancyChange = (event) => {
        setFormData((currentData) => ({
            ...currentData,
            isPregnant: event.target.value === "true"
        }));
    };

    const findSchemes = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        if (!formData.age || !formData.gender) {
            setError("Please enter age and select gender.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSearched(false);

            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/government-schemes/match",
                {
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
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to find government schemes."
                );
            }

            setSchemes(data.schemes || []);
            setSearched(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>Government Scheme Assistance</h1>

            <p>
                Enter your basic information to find government
                healthcare schemes that may be relevant to you.
            </p>

            <form
                onSubmit={findSchemes}
                style={{
                    marginTop: "25px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px"
                }}
            >
                <div style={{ marginBottom: "15px" }}>
                    <label>
                        <strong>Age</strong>
                    </label>

                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        placeholder="Enter your age"
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "6px",
                            padding: "10px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        <strong>Gender</strong>
                    </label>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "6px",
                            padding: "10px"
                        }}
                    >
                        <option value="">
                            Select gender
                        </option>

                        <option value="male">
                            Male
                        </option>

                        <option value="female">
                            Female
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        <strong>
                            Are you pregnant?
                        </strong>
                    </label>

                    <select
                        value={formData.isPregnant}
                        onChange={handlePregnancyChange}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "6px",
                            padding: "10px"
                        }}
                    >
                        <option value="false">
                            No
                        </option>

                        <option value="true">
                            Yes
                        </option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        <strong>State</strong>
                    </label>

                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "6px",
                            padding: "10px"
                        }}
                    >
                        <option value="Maharashtra">
                            Maharashtra
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>

                {error && (
                    <p
                        style={{
                            color: "red",
                            marginTop: "15px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading
                        ? "Finding Schemes..."
                        : "Find Relevant Schemes"}
                </button>
            </form>

            {searched && (
                <div style={{ marginTop: "30px" }}>
                    <h2>
                        Potentially Relevant Schemes
                    </h2>

                    {schemes.length === 0 ? (
                        <p>
                            No potentially relevant schemes
                            were found based on the information
                            provided.
                        </p>
                    ) : (
                        schemes.map((scheme) => (
                            <div
                                key={scheme.schemeId}
                                style={{
                                    marginTop: "20px",
                                    padding: "20px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px"
                                }}
                            >
                                <h3>
                                    {scheme.name}
                                </h3>

                                <p>
                                    {scheme.description}
                                </p>

                                <h4>
                                    Benefits
                                </h4>

                                <ul>
                                    {scheme.benefits.map(
                                        (benefit, index) => (
                                            <li
                                                key={index}
                                            >
                                                {benefit}
                                            </li>
                                        )
                                    )}
                                </ul>

                                <h4>
                                    Eligibility Information
                                </h4>

                                <ul>
                                    {scheme.eligibility.map(
                                        (item, index) => (
                                            <li
                                                key={index}
                                            >
                                                {item}
                                            </li>
                                        )
                                    )}
                                </ul>

                                <h4>
                                    How to Apply
                                </h4>

                                <ol>
                                    {scheme.applicationProcess.map(
                                        (step, index) => (
                                            <li
                                                key={index}
                                            >
                                                {step}
                                            </li>
                                        )
                                    )}
                                </ol>

                                <p
                                    style={{
                                        marginTop: "15px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {scheme.message}
                                </p>

                                {scheme.officialWebsite && (
                                    <a
                                        href={
                                            scheme.officialWebsite
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit Official Website
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default GovernmentSchemes;
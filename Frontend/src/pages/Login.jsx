import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import PHCDashboard from "./PHCDashboard";
import FacilityFinder from "./FacilityFinder";
import DoctorDashboard from "./DoctorDashboard";
import HealthRecords from "./HealthRecords";
import Teleconsultation from "./Teleconsultation";
import GovernmentSchemes from "./GovernmentSchemes";
import Emergency from "./Emergency";
import PatientTriage from "./PatientTriage";

import LanguageSelector from "../components/LanguageSelector";

const Login = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [patientPage, setPatientPage] = useState("facility");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            console.log("Login successful:", data);

            // Store user role
            setUserRole(data.user.role);

            setIsLoggedIn(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Show dashboard based on user role
    if (isLoggedIn) {

        // PHC Staff Dashboard
        if (userRole === "phc_staff") {
            return <PHCDashboard />;
        }

        // Patient Dashboard
        if (userRole === "patient") {
            return (
                <div>

                    {/* Patient Navigation */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            padding: "20px",
                            borderBottom: "1px solid #ddd",
                            flexWrap: "wrap",
                            alignItems: "center"
                        }}
                    >

                        <button
                            onClick={() =>
                                setPatientPage("facility")
                            }
                        >
                            {t("patient.facilityFinder")}
                        </button>

                        <button
                            onClick={() =>
                                setPatientPage("triage")
                            }
                        >
                            {t("patient.healthCheck")}
                        </button>

                        <button
                            onClick={() =>
                                setPatientPage("records")
                            }
                        >
                            {t("patient.healthRecords")}
                        </button>

                        <button
                            onClick={() =>
                                setPatientPage(
                                    "teleconsultation"
                                )
                            }
                        >
                            {t("patient.teleconsultations")}
                        </button>

                        <button
                            onClick={() =>
                                setPatientPage(
                                    "governmentSchemes"
                                )
                            }
                        >
                            {t("patient.schemes")}
                        </button>

                        <button
                            onClick={() =>
                                setPatientPage("emergency")
                            }
                        >
                            🚨 {t("patient.emergency")}
                        </button>

                        {/* Language Selector */}
                        <LanguageSelector />

                    </div>

                    {/* Patient Page */}

                    {patientPage === "facility" && (
                        <FacilityFinder />
                    )}

                    {patientPage === "triage" && (
                        <PatientTriage />
                    )}

                    {patientPage === "records" && (
                        <HealthRecords />
                    )}

                    {patientPage === "teleconsultation" && (
                        <Teleconsultation />
                    )}

                    {patientPage === "governmentSchemes" && (
                        <GovernmentSchemes />
                    )}

                    {patientPage === "emergency" && (
                        <Emergency />
                    )}

                </div>
            );
        }

        // Doctor Dashboard
        if (userRole === "doctor") {
            return <DoctorDashboard />;
        }

        // Other roles
        return (
            <div className="triage-page">
                <div className="triage-container">

                    <h1>Dashboard</h1>

                    <p>
                        Dashboard for role "{userRole}" is not
                        available yet.
                    </p>

                </div>
            </div>
        );
    }

    // Login Page
    return (
        <div className="triage-page">
            <div className="triage-container">

                {/* Language Selector */}
                <LanguageSelector />

                <h1>Login</h1>

                <p className="triage-subtitle">
                    Login to access your GramArogya account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-section">
                        <h2>Email</h2>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-section">
                        <h2>Password</h2>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
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
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default Login;
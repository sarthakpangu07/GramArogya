
import { useState } from "react";
import { useTranslation } from "react-i18next";

import PHCDashboard from "./PHCDashboard";
import FacilityFinder from "./FacilityFinder";
import DoctorDashboard from "./DoctorDashboard";
import HealthRecords from "./HealthRecords";
import Teleconsultation from "./Teleconsultation";
import GovernmentSchemes from "./GovernmentSchemes";
import Emergency from "./Emergency";
import PatientTriage from "./PatientTriage";
import SpecialistDashboard from "./SpecialistDashboard";

import LanguageSelector from "../components/LanguageSelector";

const API_URL = "https://gramarogya-27q3.onrender.com/api/users";

const patientPages = [
    {
        id: "facility",
        label: "patient.facilityFinder",
        fallback: "Find Healthcare",
        icon: "⌖"
    },
    {
        id: "triage",
        label: "patient.healthCheck",
        fallback: "Symptom Check",
        icon: "♡"
    },
    {
        id: "records",
        label: "patient.healthRecords",
        fallback: "Health Records",
        icon: "▤"
    },
    {
        id: "teleconsultation",
        label: "patient.teleconsultations",
        fallback: "Consultations",
        icon: "☏"
    },
    {
        id: "governmentSchemes",
        label: "patient.schemes",
        fallback: "Health Schemes",
        icon: "✚"
    },
    {
        id: "emergency",
        label: "patient.emergency",
        fallback: "Emergency",
        icon: "!"
    }
];

const Login = () => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [patientPage, setPatientPage] = useState("facility");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (isSignup && password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (isSignup && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const endpoint = isSignup
                ? API_URL
                : `${API_URL}/login`;

            const requestBody = isSignup
                ? {
                    name: name.trim(),
                    email: email.trim(),
                    password
                }
                : {
                    email: email.trim(),
                    password
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isSignup
                        ? "Registration failed."
                        : "Login failed.")
                );
            }

            // Registration creates a patient account.
            // Ask the patient to sign in after registration.
            if (isSignup) {
                setSuccess(
                    "Account created successfully! Please sign in."
                );

                setIsSignup(false);
                setName("");
                setPassword("");
                setConfirmPassword("");
                return;
            }

            // Save login credentials and user details.
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setUserRole(data.user.role);
            setIsLoggedIn(true);
        } catch (err) {
            setError(
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const switchAuthMode = () => {
        setIsSignup((current) => !current);

        setError("");
        setSuccess("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
        setUserRole("");
        setPatientPage("facility");
        setIsLoggedIn(false);
        setIsSignup(false);
    };

    // PHC staff dashboard
    if (isLoggedIn && userRole === "phc_staff") {
        return <PHCDashboard />;
    }

    // Doctor dashboard
    if (isLoggedIn && userRole === "doctor") {
        return <DoctorDashboard />;
    }

    // Specialist dashboard
    if (isLoggedIn && userRole === "specialist") {
        return <SpecialistDashboard />;
    }

    // Patient dashboard and navigation
    if (isLoggedIn && userRole === "patient") {
        const currentPage = patientPages.find(
            (page) => page.id === patientPage
        );

        return (
            <div className="patient-app-shell">
                <header className="app-topbar">
                    <a
                        className="brand-lockup"
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            setPatientPage("facility");
                        }}
                    >
                        <span className="brand-mark">G</span>

                        <span className="brand-copy">
                            <strong>GramArogya</strong>
                            <small>Your health, closer to home</small>
                        </span>
                    </a>

                    <div className="topbar-actions">
                        <div className="language-control">
                            <LanguageSelector />
                        </div>

                        <button
                            className="logout-button"
                            type="button"
                            onClick={handleLogout}
                        >
                            <span aria-hidden="true">↪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                <section className="patient-welcome">
                    <div>
                        <span className="eyebrow">
                            YOUR HEALTHCARE COMPANION
                        </span>

                        <h1>
                            {currentPage?.fallback || "Your healthcare"}
                        </h1>

                        <p>
                            Access healthcare services and manage your
                            health journey in one place.
                        </p>
                    </div>

                    <div className="welcome-symbol" aria-hidden="true">
                        <span>+</span>
                        <span className="welcome-dot" />
                    </div>
                </section>

                <nav
                    className="patient-navigation"
                    aria-label="Patient navigation"
                >
                    {patientPages.map((page) => (
                        <button
                            key={page.id}
                            type="button"
                            className={`patient-nav-item ${
                                patientPage === page.id ? "active" : ""
                            } ${
                                page.id === "emergency"
                                    ? "emergency-nav-item"
                                    : ""
                            }`}
                            onClick={() => setPatientPage(page.id)}
                            aria-current={
                                patientPage === page.id ? "page" : undefined
                            }
                        >
                            <span
                                className="nav-item-icon"
                                aria-hidden="true"
                            >
                                {page.icon}
                            </span>

                            <span>
                                {t(page.label, {
                                    defaultValue: page.fallback
                                })}
                            </span>
                        </button>
                    ))}
                </nav>

                <main className="patient-content">
                    {patientPage === "facility" && <FacilityFinder />}
                    {patientPage === "triage" && <PatientTriage />}
                    {patientPage === "records" && <HealthRecords />}

                    {patientPage === "teleconsultation" && (
                        <Teleconsultation />
                    )}

                    {patientPage === "governmentSchemes" && (
                        <GovernmentSchemes />
                    )}

                    {patientPage === "emergency" && <Emergency />}
                </main>

                <footer className="app-footer">
                    <span>
                        <span className="footer-heart">♥</span>
                        GramArogya · Healthcare for every community
                    </span>

                    <span>Take care of your health.</span>
                </footer>
            </div>
        );
    }

    // Fallback for roles without a connected dashboard here
    if (isLoggedIn) {
        return (
            <main className="unavailable-page">
                <div className="unavailable-card">
                    <span className="brand-mark">G</span>

                    <h1>Welcome to GramArogya</h1>

                    <p>
                        You are signed in as <strong>{userRole}</strong>,
                        but a dashboard for this role is not connected
                        here yet.
                    </p>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </main>
        );
    }

    // Login and signup pages
    return (
        <main className="login-page">
            <section className="login-layout">
                <aside className="login-brand-panel">
                    <div className="login-brand">
                        <span className="brand-mark brand-mark-light">
                            G
                        </span>

                        <span className="brand-copy">
                            <strong>GramArogya</strong>
                            <small>Healthcare for every community</small>
                        </span>
                    </div>

                    <div className="brand-message">
                        <span className="eyebrow light-eyebrow">
                            CARE THAT COMES CLOSER
                        </span>

                        <h1>
                            Better healthcare.
                            <br />
                            <span>Closer to home.</span>
                        </h1>

                        <p>
                            Connect with healthcare services, find nearby
                            government facilities, and keep your health
                            information together in one place.
                        </p>
                    </div>

                    <div className="care-highlights">
                        <div className="care-highlight">
                            <span className="highlight-icon">⌖</span>
                            <span>
                                <strong>Find nearby care</strong>
                                <small>
                                    Discover healthcare facilities
                                </small>
                            </span>
                        </div>

                        <div className="care-highlight">
                            <span className="highlight-icon">♡</span>
                            <span>
                                <strong>Stay informed</strong>
                                <small>
                                    Access your health information
                                </small>
                            </span>
                        </div>

                        <div className="care-highlight">
                            <span className="highlight-icon">✚</span>
                            <span>
                                <strong>Get connected</strong>
                                <small>Explore healthcare services</small>
                            </span>
                        </div>
                    </div>

                    <div className="brand-panel-footer">
                        Designed to bring essential healthcare services
                        closer to rural and underserved communities.
                    </div>
                </aside>

                <section className="login-form-panel">
                    <div className="login-form-top">
                        <span className="mobile-brand">
                            <span className="brand-mark">G</span>
                            <strong>GramArogya</strong>
                        </span>

                        <LanguageSelector />
                    </div>

                    <div className="login-form-content">
                        <span className="form-kicker">
                            {isSignup ? "GET STARTED" : "WELCOME BACK"}
                        </span>

                        <h2>
                            {isSignup
                                ? "Create your account"
                                : "Sign in to your account"}
                        </h2>

                        <p className="login-description">
                            {isSignup
                                ? "Create your patient account to access healthcare services."
                                : "Enter your details to access your healthcare dashboard."}
                        </p>

                        <form onSubmit={handleSubmit}>
                            {isSignup && (
                                <div className="login-field">
                                    <label htmlFor="signup-name">
                                        Full name
                                    </label>

                                    <input
                                        id="signup-name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                        minLength={2}
                                        maxLength={100}
                                    />
                                </div>
                            )}

                            <div className="login-field">
                                <label htmlFor="login-email">
                                    Email address
                                </label>

                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <div className="password-input-wrap">
                                    <input
                                        id="login-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete={
                                            isSignup
                                                ? "new-password"
                                                : "current-password"
                                        }
                                        placeholder={
                                            isSignup
                                                ? "Create a password"
                                                : "Enter your password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        minLength={isSignup ? 8 : undefined}
                                    />

                                    <button
                                        className="password-toggle"
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (visible) => !visible
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {isSignup && (
                                    <p className="optional-text">
                                        Use at least 8 characters.
                                    </p>
                                )}
                            </div>

                            {isSignup && (
                                <div className="login-field">
                                    <label htmlFor="confirm-password">
                                        Confirm password
                                    </label>

                                    <input
                                        id="confirm-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="Enter your password again"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            )}

                            {error && (
                                <div
                                    className="login-error"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <span aria-hidden="true">!</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    style={{
                                        marginBottom: "18px",
                                        padding: "12px",
                                        border: "1px solid #cfe8d5",
                                        borderRadius: "10px",
                                        background: "#f1faf3",
                                        color: "#21643f",
                                        fontSize: "12px",
                                        lineHeight: 1.6
                                    }}
                                >
                                    {success}
                                </div>
                            )}

                            <button
                                className="primary-button login-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner" />
                                        {isSignup
                                            ? "Creating account..."
                                            : "Signing in..."}
                                    </>
                                ) : (
                                    <>
                                        {isSignup
                                            ? "Create account"
                                            : "Sign in"}

                                        <span aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "6px",
                                marginTop: "23px",
                                color: "#71817c",
                                fontSize: "12px"
                            }}
                        >
                            <span>
                                {isSignup
                                    ? "Already have an account?"
                                    : "New to GramArogya?"}
                            </span>

                            <button
                                type="button"
                                onClick={switchAuthMode}
                                disabled={loading}
                                style={{
                                    padding: "4px",
                                    border: 0,
                                    background: "transparent",
                                    color: "#24765e",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    fontSize: "12px"
                                }}
                            >
                                {isSignup ? "Sign in" : "Sign up"}
                            </button>
                        </div>

                        <div className="login-security-note">
                            <span aria-hidden="true">♧</span>

                            <p>
                                Your health journey matters. Please keep
                                your account credentials private.
                            </p>
                        </div>
                    </div>

                    <footer className="login-footer">
                        © {new Date().getFullYear()} GramArogya
                        <span>Healthcare access, made simpler.</span>
                    </footer>
                </section>
            </section>
        </main>
    );
};

export default Login;

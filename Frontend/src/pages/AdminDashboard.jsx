import { useState, useEffect, useCallback } from "react";
import "./AdminDashboard.css";

const ADMIN_STATS_URL =
    "https://gramarogya-27q3.onrender.com/api/admin/stats";

const adminSections = [
    {
        id: "overview",
        label: "Overview",
        icon: "⌂",
        description: "Dashboard overview"
    },
    {
        id: "users",
        label: "User Management",
        icon: "♙",
        description: "Manage GramArogya users"
    },
    {
        id: "facilities",
        label: "Facility Management",
        icon: "✚",
        description: "Manage healthcare facilities"
    },
    {
        id: "specialists",
        label: "Specialist Assignments",
        icon: "⚕",
        description: "Manage specialist assignments"
    },
    {
        id: "activity",
        label: "System Activity",
        icon: "▤",
        description: "Monitor system activity"
    }
];

const formatCount = (value) => {
    return Number(value || 0).toLocaleString();
};

const AdminDashboard = ({ onLogout }) => {
    const [activeSection, setActiveSection] = useState("overview");

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState("");

    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    const adminName = storedUser.name || "Administrator";

    const activeItem = adminSections.find(
        (section) => section.id === activeSection
    );

    // Fetch live statistics from the backend
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            setStatsError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Admin session not found. Please log in again."
                );
            }

            const response = await fetch(ADMIN_STATS_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch dashboard statistics."
                );
            }

            if (!data.stats) {
                throw new Error(
                    "The server returned an invalid statistics response."
                );
            }

            setStats(data.stats);
        } catch (error) {
            setStatsError(
                error.message || "Something went wrong while loading statistics."
            );
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // Fetch statistics when the dashboard opens
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    // Statistics displayed on the overview
    const statCards = stats
        ? [
              {
                  id: "users",
                  label: "Registered Users",
                  value: stats.totalUsers,
                  icon: "♙"
              },
              {
                  id: "patients",
                  label: "Patients",
                  value: stats.totalPatients,
                  icon: "♡"
              },
              {
                  id: "phc",
                  label: "PHC Staff",
                  value: stats.totalPhcStaff,
                  icon: "✚"
              },
              {
                  id: "doctors",
                  label: "Doctors",
                  value: stats.totalDoctors,
                  icon: "⚕"
              },
              {
                  id: "specialists",
                  label: "Specialists",
                  value: stats.totalSpecialists,
                  icon: "✚"
              },
              {
                  id: "facilities",
                  label: "Healthcare Facilities",
                  value: stats.totalFacilities,
                  icon: "⌖"
              },
              {
                  id: "referrals",
                  label: "Total Referrals",
                  value: stats.totalReferrals,
                  icon: "▤"
              },
              {
                  id: "emergencies",
                  label: "Emergency Requests",
                  value: stats.totalEmergencyRequests,
                  icon: "!"
              }
          ]
        : [];

    const renderOverview = () => (
        <>
            <section className="admin-welcome-card">
                <div className="admin-welcome-copy">
                    <span className="admin-eyebrow">
                        GRAMAROGYA ADMINISTRATION
                    </span>

                    <h2>Welcome, {adminName}!</h2>

                    <p>
                        Manage users, healthcare facilities and platform
                        operations from one central dashboard.
                    </p>
                </div>

                <div className="admin-welcome-icon" aria-hidden="true">
                    <span>✚</span>
                </div>
            </section>

            <section className="admin-section-heading">
                <div>
                    <span className="admin-eyebrow">
                        LIVE DATABASE STATISTICS
                    </span>

                    <h2>Platform Overview</h2>

                    <p>
                        Statistics fetched directly from the GramArogya
                        database.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchStats}
                    disabled={statsLoading}
                    style={{
                        padding: "10px 15px",
                        border: "1px solid #d6e8dd",
                        borderRadius: "9px",
                        background: "#ffffff",
                        color: "#23674c",
                        fontSize: "11px",
                        fontWeight: 750,
                        cursor: statsLoading ? "not-allowed" : "pointer",
                        opacity: statsLoading ? 0.6 : 1
                    }}
                >
                    {statsLoading ? "Loading..." : "↻ Refresh"}
                </button>
            </section>

            {statsLoading && !stats && (
                <div className="admin-info-panel" role="status">
                    <div className="admin-info-icon">↻</div>

                    <div>
                        <strong>Loading dashboard statistics</strong>
                        <p>
                            Connecting to the GramArogya backend and
                            retrieving database counts.
                        </p>
                    </div>
                </div>
            )}

            {statsError && (
                <div
                    role="alert"
                    style={{
                        marginBottom: "18px",
                        padding: "16px",
                        border: "1px solid #efcccc",
                        borderRadius: "11px",
                        background: "#fff5f5",
                        color: "#a43c3c",
                        fontSize: "12px",
                        lineHeight: 1.7
                    }}
                >
                    <strong>Unable to load statistics</strong>

                    <p style={{ margin: "5px 0 12px" }}>
                        {statsError}
                    </p>

                    <button
                        type="button"
                        onClick={fetchStats}
                        disabled={statsLoading}
                        style={{
                            padding: "8px 13px",
                            border: "0",
                            borderRadius: "7px",
                            background: "#a43c3c",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer"
                        }}
                    >
                        Try again
                    </button>
                </div>
            )}

            {stats && (
                <>
                    <section className="admin-module-grid">
                        {statCards.map((card) => (
                            <article
                                className="admin-module-card"
                                key={card.id}
                                style={{ cursor: "default" }}
                            >
                                <span className="admin-module-icon">
                                    {card.icon}
                                </span>

                                <span className="admin-module-content">
                                    <strong
                                        style={{
                                            fontSize: "23px",
                                            lineHeight: 1.2,
                                            color: "#214437"
                                        }}
                                    >
                                        {formatCount(card.value)}
                                    </strong>

                                    <small>{card.label}</small>
                                </span>
                            </article>
                        ))}
                    </section>

                    <section className="admin-section-heading">
                        <div>
                            <span className="admin-eyebrow">
                                FACILITY STATUS
                            </span>

                            <h2>Healthcare Facilities</h2>

                            <p>
                                Active and inactive facilities registered
                                in the database.
                            </p>
                        </div>
                    </section>

                    <section className="admin-module-grid">
                        <article
                            className="admin-module-card"
                            style={{ cursor: "default" }}
                        >
                            <span className="admin-module-icon">✓</span>

                            <span className="admin-module-content">
                                <strong
                                    style={{
                                        fontSize: "23px",
                                        color: "#23734e"
                                    }}
                                >
                                    {formatCount(stats.activeFacilities)}
                                </strong>

                                <small>Active Facilities</small>
                            </span>
                        </article>

                        <article
                            className="admin-module-card"
                            style={{ cursor: "default" }}
                        >
                            <span className="admin-module-icon">○</span>

                            <span className="admin-module-content">
                                <strong
                                    style={{
                                        fontSize: "23px",
                                        color: "#9a6b35"
                                    }}
                                >
                                    {formatCount(stats.inactiveFacilities)}
                                </strong>

                                <small>Inactive Facilities</small>
                            </span>
                        </article>
                    </section>

                    <section className="admin-info-panel">
                        <div className="admin-info-icon">i</div>

                        <div>
                            <strong>Statistics updated</strong>

                            <p>
                                {stats.generatedAt
                                    ? new Date(
                                          stats.generatedAt
                                      ).toLocaleString()
                                    : "Update time unavailable"}
                            </p>
                        </div>
                    </section>
                </>
            )}
        </>
    );

    const renderPlaceholder = () => (
        <section className="admin-placeholder">
            <span className="admin-placeholder-icon">
                {activeItem?.icon}
            </span>

            <span className="admin-eyebrow">
                ADMINISTRATION MODULE
            </span>

            <h2>{activeItem?.label}</h2>

            <p>
                {activeItem?.description} will be implemented in the
                upcoming development module.
            </p>

            <div className="admin-placeholder-note">
                This section is not connected to live data yet.
            </div>

            <button
                className="admin-back-button"
                type="button"
                onClick={() => setActiveSection("overview")}
            >
                ← Back to overview
            </button>
        </section>
    );

    return (
        <div className="admin-app-shell">
            <aside className="admin-sidebar">
                <a
                    href="#admin-home"
                    className="admin-brand"
                    onClick={(event) => {
                        event.preventDefault();
                        setActiveSection("overview");
                    }}
                >
                    <span className="admin-brand-mark">G</span>

                    <span className="admin-brand-copy">
                        <strong>GramArogya</strong>
                        <small>Admin Console</small>
                    </span>
                </a>

                <div className="admin-sidebar-divider" />

                <span className="admin-sidebar-label">
                    MANAGEMENT
                </span>

                <nav
                    className="admin-sidebar-nav"
                    aria-label="Admin navigation"
                >
                    {adminSections.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === section.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setActiveSection(section.id)
                            }
                            aria-current={
                                activeSection === section.id
                                    ? "page"
                                    : undefined
                            }
                        >
                            <span
                                className="admin-nav-icon"
                                aria-hidden="true"
                            >
                                {section.icon}
                            </span>

                            <span>{section.label}</span>

                            {activeSection === section.id && (
                                <span className="admin-nav-indicator" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-bottom">
                    <div className="admin-sidebar-user">
                        <span className="admin-avatar">
                            {adminName.charAt(0).toUpperCase()}
                        </span>

                        <span className="admin-user-details">
                            <strong>{adminName}</strong>
                            <small>Administrator</small>
                        </span>
                    </div>

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        <span aria-hidden="true">↪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <span className="admin-topbar-kicker">
                            GRAMAROGYA / ADMIN
                        </span>

                        <h1>{activeItem?.label || "Overview"}</h1>
                    </div>

                    <div className="admin-topbar-right">
                        <span className="admin-role-badge">
                            <span className="admin-status-dot" />
                            System Administrator
                        </span>
                    </div>
                </header>

                <div className="admin-main-content">
                    {activeSection === "overview"
                        ? renderOverview()
                        : renderPlaceholder()}
                </div>

                <footer className="admin-footer">
                    <span>
                        © {new Date().getFullYear()} GramArogya
                    </span>

                    <span>
                        Healthcare for every community
                    </span>
                </footer>
            </main>
        </div>
    );
};

export default AdminDashboard;
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Emergency() {
    const { t } = useTranslation();

    const [emergencyReason, setEmergencyReason] = useState("");
    const [ambulanceRequested, setAmbulanceRequested] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const requestEmergencyHelp = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError(t("emergency.loginRequired"));
            return;
        }

        if (!emergencyReason.trim()) {
            setError(t("emergency.reasonRequired"));
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(null);

            const response = await fetch(
                "http://localhost:5000/api/emergencies",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        emergencyReason:
                            emergencyReason.trim(),

                        ambulanceRequested,

                        notes:
                            "Emergency request created from patient dashboard."
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t("emergency.requestFailed")
                );
            }

            setSuccess(data.emergencyRequest);

            setEmergencyReason("");
            setAmbulanceRequested(false);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <div
                style={{
                    border: "2px solid #d32f2f",
                    borderRadius: "12px",
                    padding: "25px"
                }}
            >
                <h1>
                    🚨 {t("emergency.title")}
                </h1>

                <p>
                    {t("emergency.warning")}
                </p>

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >
                    <label>
                        <strong>
                            {t("emergency.whatHappening")}
                        </strong>
                    </label>

                    <textarea
                        value={emergencyReason}
                        onChange={(e) =>
                            setEmergencyReason(
                                e.target.value
                            )
                        }
                        placeholder={t(
                            "emergency.reasonPlaceholder"
                        )}
                        rows="5"
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "8px",
                            padding: "10px",
                            boxSizing: "border-box",
                            resize: "vertical"
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <label>
                        <input
                            type="checkbox"
                            checked={ambulanceRequested}
                            onChange={(e) =>
                                setAmbulanceRequested(
                                    e.target.checked
                                )
                            }
                        />

                        {" "}
                        {t("emergency.ambulanceAssistance")}
                    </label>
                </div>

                {error && (
                    <p
                        style={{
                            color: "red",
                            marginTop: "20px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    onClick={requestEmergencyHelp}
                    disabled={loading}
                    style={{
                        marginTop: "25px",
                        width: "100%",
                        padding: "15px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: loading
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "18px",
                        fontWeight: "bold"
                    }}
                >
                    {loading
                        ? t("emergency.requesting")
                        : t("emergency.requestButton")}
                </button>
            </div>

            {success && (
                <div
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >
                    <h2>
                        {t("emergency.requestCreated")}
                    </h2>

                    <p>
                        <strong>
                            {t("emergency.status")}:
                        </strong>{" "}
                        {success.status}
                    </p>

                    <p>
                        <strong>
                            {t("emergency.reason")}:
                        </strong>{" "}
                        {success.emergencyReason}
                    </p>

                    {success.requestedFacility && (
                        <>
                            <h3>
                                {t(
                                    "emergency.nearestFacility"
                                )}
                            </h3>

                            <p>
                                <strong>
                                    {
                                        success
                                            .requestedFacility
                                            .name
                                    }
                                </strong>
                            </p>

                            <p>
                                {
                                    success
                                        .requestedFacility
                                        .address
                                }
                            </p>

                            <p>
                                {
                                    success
                                        .requestedFacility
                                        .district
                                }
                                ,{" "}
                                {
                                    success
                                        .requestedFacility
                                        .state
                                }
                            </p>

                            <p>
                                <strong>
                                    {t("emergency.phone")}:
                                </strong>{" "}
                                {
                                    success
                                        .requestedFacility
                                        .phone
                                }
                            </p>
                        </>
                    )}

                    {success.ambulanceRequested && (
                        <p>
                            <strong>
                                {t(
                                    "emergency.ambulanceRequest"
                                )}
                            </strong>{" "}
                            {t("emergency.requested")}
                        </p>
                    )}

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            borderRadius: "8px"
                        }}
                    >
                        <strong>
                            {t("emergency.guidance")}
                        </strong>

                        <p>
                            {success.emergencyGuidance}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Emergency;
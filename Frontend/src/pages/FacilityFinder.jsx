import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const FacilityFinder = () => {
    const { t } = useTranslation();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [triageId, setTriageId] = useState("");

    useEffect(() => {
        const fetchLatestTriage = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError(t("facility.loginRequired"));
                return;
            }

            try {
                const response = await fetch(
                    "https://gramarogya-27q3.onrender.com/api/triage/my-records",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        t("facility.triageFetchFailed")
                    );
                }

                if (
                    data.records &&
                    data.records.length > 0
                ) {
                    setTriageId(data.records[0]._id);
                } else {
                    setError(
                        t("facility.triageRequired")
                    );
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchLatestTriage();
    }, [t]);

    const selectFacility = async (facilityId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError(t("facility.loginRequired"));
            return;
        }

        if (!triageId) {
            setError(t("facility.triageRequired"));
            return;
        }

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/visits",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        facilityId: facilityId,
                        triageId: triageId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    t("facility.visitRequestFailed")
                );
            }

            setError("");

            alert(
                t("facility.visitRequestSuccess")
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const findFacilities = () => {
        setError("");
        setLoading(true);

        if (!navigator.geolocation) {
            setError(
                t("facility.locationNotSupported")
            );

            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const {
                    latitude,
                    longitude
                } = position.coords;

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setError(
                        t("facility.loginRequired")
                    );

                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(
                        `https://gramarogya-27q3.onrender.com/api/facilities/nearby?latitude=${latitude}&longitude=${longitude}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            t(
                                "facility.facilityFetchFailed"
                            )
                        );
                    }

                    setFacilities(
                        data.facilities
                    );
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError(
                    t(
                        "facility.locationAccessDenied"
                    )
                );

                setLoading(false);
            }
        );
    };

    return (
        <div className="triage-page">
            <div className="triage-container">

                <h1>
                    {t("facility.title")}
                </h1>

                <p className="triage-subtitle">
                    {t("facility.subtitle")}
                </p>

                <button
                    className="submit-button"
                    onClick={findFacilities}
                    disabled={loading}
                >
                    {loading
                        ? t("facility.finding")
                        : t("facility.findButton")}
                </button>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {facilities.length > 0 && (
                    <div className="facility-list">

                        {facilities.map(
                            (facility) => (
                                <div
                                    className="facility-card"
                                    key={
                                        facility._id
                                    }
                                >
                                    <h2>
                                        {
                                            facility.name
                                        }
                                    </h2>

                                    <p>
                                        <strong>
                                            {t(
                                                "facility.type"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            facility.facilityType
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "facility.address"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            facility.address
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "facility.distance"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            facility.distance
                                        }{" "}
                                        km
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "facility.services"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            facility.services.join(
                                                ", "
                                            )
                                        }
                                    </p>

                                    <button
                                        className="submit-button"
                                        onClick={() =>
                                            selectFacility(
                                                facility._id
                                            )
                                        }
                                    >
                                        {t(
                                            "facility.select"
                                        )}
                                    </button>
                                </div>
                            )
                        )}

                    </div>
                )}

            </div>
        </div>
    );
};

export default FacilityFinder;
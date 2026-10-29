
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FacilityFinder.css";

const API_URL = "https://gramarogya-27q3.onrender.com/api";

const FacilityFinder = () => {
    const { t } = useTranslation();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [triageId, setTriageId] = useState("");
    const [triageNotice, setTriageNotice] = useState("");
    const [requestingFacilityId, setRequestingFacilityId] = useState("");
    const [visitSuccess, setVisitSuccess] = useState("");
    const [lastLocation, setLastLocation] = useState(null);

    const tr = (key, fallback) =>
        t(`facility.${key}`, { defaultValue: fallback });

    useEffect(() => {
        let cancelled = false;

        const fetchLatestTriage = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                if (!cancelled) {
                    setError(tr("loginRequired", "Please log in to continue."));
                }
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/triage/my-records`,
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
                        tr("triageFetchFailed", "Unable to check your latest symptom assessment.")
                    );
                }

                if (cancelled) return;

                if (data.records?.length > 0) {
                    setTriageId(data.records[0]._id);
                    setTriageNotice("");
                } else {
                    setTriageId("");
                    setTriageNotice(
                        tr(
                            "triageRequired",
                            "Complete a symptom check before requesting a visit."
                        )
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            }
        };

        fetchLatestTriage();

        return () => {
            cancelled = true;
        };
    }, [t]);

    const selectFacility = async (facilityId) => {
        const token = localStorage.getItem("token");

        setError("");
        setVisitSuccess("");

        if (!token) {
            setError(tr("loginRequired", "Please log in to continue."));
            return;
        }

        if (!triageId) {
            setError(
                tr(
                    "triageRequired",
                    "Complete a symptom check before requesting a visit."
                )
            );
            return;
        }

        try {
            setRequestingFacilityId(facilityId);

            const response = await fetch(`${API_URL}/visits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    facilityId,
                    triageId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    tr("visitRequestFailed", "Unable to request this visit.")
                );
            }

            setVisitSuccess(
                tr(
                    "visitRequestSuccess",
                    "Your visit request was submitted successfully."
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setRequestingFacilityId("");
        }
    };

    const findFacilities = () => {
        setError("");
        setVisitSuccess("");
        setLoading(true);

        if (!navigator.geolocation) {
            setError(
                tr(
                    "locationNotSupported",
                    "Location services are not supported by this browser."
                )
            );
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem("token");

                if (!token) {
                    setError(tr("loginRequired", "Please log in to continue."));
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(
                        `${API_URL}/facilities/nearby?latitude=${latitude}&longitude=${longitude}`,
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
                            tr("facilityFetchFailed", "Unable to fetch nearby facilities.")
                        );
                    }

                    setFacilities(
                        Array.isArray(data.facilities)
                            ? data.facilities
                            : []
                    );

                    setLastLocation({ latitude, longitude });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            },
            (locationError) => {
                let message = tr(
                    "locationAccessDenied",
                    "We couldn't access your location. Please allow location access and try again."
                );

                if (locationError.code === 2) {
                    message = tr(
                        "locationUnavailable",
                        "Your location is currently unavailable. Please try again."
                    );
                }

                if (locationError.code === 3) {
                    message = tr(
                        "locationTimeout",
                        "Finding your location took too long. Please try again."
                    );
                }

                setError(message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };

    return (
        <section className="facility-page">
            <div className="facility-layout">
                <header className="facility-heading">
                    <div className="facility-heading-icon" aria-hidden="true">
                        ⌖
                    </div>

                    <div>
                        <span className="facility-eyebrow">
                            {tr("directoryLabel", "HEALTHCARE DIRECTORY")}
                        </span>

                        <h2>{tr("title", "Find Healthcare")}</h2>

                        <p>
                            {tr(
                                "subtitle",
                                "Discover nearby government healthcare facilities and choose where to request care."
                            )}
                        </p>
                    </div>
                </header>

                <section className="facility-search-panel">
                    <div className="facility-search-copy">
                        <span className="facility-search-icon" aria-hidden="true">
                            ◎
                        </span>

                        <div>
                            <h3>
                                {tr("locationHeading", "Find care near you")}
                            </h3>

                            <p>
                                {tr(
                                    "locationDescription",
                                    "Use your device location to sort active healthcare facilities by distance."
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        className="facility-find-button"
                        type="button"
                        onClick={findFacilities}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="facility-spinner" />
                                {tr("finding", "Finding facilities...")}
                            </>
                        ) : (
                            <>
                                <span aria-hidden="true">⌖</span>
                                {tr("findButton", "Find Nearby Facilities")}
                                <span aria-hidden="true">→</span>
                            </>
                        )}
                    </button>

                    {lastLocation && (
                        <p className="facility-location-status" role="status">
                            <span aria-hidden="true">✓</span>
                            {tr(
                                "locationFound",
                                "Location updated. Facilities are sorted by distance."
                            )}
                        </p>
                    )}
                </section>

                {triageNotice && (
                    <div className="facility-triage-notice" role="note">
                        <span aria-hidden="true">ⓘ</span>
                        <p>{triageNotice}</p>
                    </div>
                )}

                {error && (
                    <div className="facility-error" role="alert" aria-live="polite">
                        <span aria-hidden="true">!</span>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {visitSuccess && (
                    <div
                        className="facility-success"
                        role="status"
                        aria-live="polite"
                    >
                        <span aria-hidden="true">✓</span>
                        <p>{visitSuccess}</p>
                        <button
                            type="button"
                            onClick={() => setVisitSuccess("")}
                            aria-label="Dismiss confirmation"
                        >
                            ×
                        </button>
                    </div>
                )}

                {facilities.length > 0 && (
                    <section className="facility-results">
                        <div className="facility-results-heading">
                            <div>
                                <span className="facility-eyebrow">
                                    {tr("resultsLabel", "NEARBY OPTIONS")}
                                </span>

                                <h3>
                                    {tr("resultsTitle", "Healthcare facilities")}
                                </h3>
                            </div>

                            <span className="facility-count">
                                {facilities.length}{" "}
                                {facilities.length === 1
                                    ? tr("facilitySingular", "facility")
                                    : tr("facilityPlural", "facilities")}
                            </span>
                        </div>

                        <div className="facility-list">
                            {facilities.map((facility) => {
                                const services = Array.isArray(facility.services)
                                    ? facility.services
                                    : [];

                                return (
                                    <article
                                        className="facility-card"
                                        key={facility._id}
                                    >
                                        <div className="facility-card-top">
                                            <div className="facility-card-icon" aria-hidden="true">
                                                ✚
                                            </div>

                                            <div className="facility-card-title">
                                                <span className="facility-type">
                                                    {facility.facilityType}
                                                </span>

                                                <h4>{facility.name}</h4>

                                                {facility.district && (
                                                    <p className="facility-district">
                                                        {facility.district}
                                                        {facility.state
                                                            ? `, ${facility.state}`
                                                            : ""}
                                                    </p>
                                                )}
                                            </div>

                                            {Number.isFinite(Number(facility.distance)) && (
                                                <div className="facility-distance">
                                                    <strong>
                                                        {Number(facility.distance).toFixed(1)}
                                                    </strong>
                                                    <span>km</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="facility-card-details">
                                            <div className="facility-detail-row">
                                                <span className="facility-detail-icon" aria-hidden="true">
                                                    ⌖
                                                </span>

                                                <div>
                                                    <span>
                                                        {tr("address", "Address")}
                                                    </span>
                                                    <p>{facility.address}</p>
                                                </div>
                                            </div>

                                            {(facility.village || facility.district) && (
                                                <div className="facility-detail-row">
                                                    <span className="facility-detail-icon" aria-hidden="true">
                                                        ◉
                                                    </span>

                                                    <div>
                                                        <span>
                                                            {tr("location", "Location")}
                                                        </span>
                                                        <p>
                                                            {[
                                                                facility.village,
                                                                facility.district,
                                                                facility.state
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {facility.phone && (
                                                <div className="facility-detail-row">
                                                    <span className="facility-detail-icon" aria-hidden="true">
                                                        ☏
                                                    </span>

                                                    <div>
                                                        <span>
                                                            {tr("phone", "Phone")}
                                                        </span>
                                                        <p>
                                                            <a href={`tel:${facility.phone}`}>
                                                                {facility.phone}
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {services.length > 0 && (
                                            <div className="facility-services">
                                                <span>
                                                    {tr("services", "Services")}
                                                </span>

                                                <div className="facility-service-tags">
                                                    {services.map((service, index) => (
                                                        <span key={`${service}-${index}`}>
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="facility-card-footer">
                                            <span className="facility-active-status">
                                                <span />
                                                {tr("activeFacility", "Active facility")}
                                            </span>

                                            <button
                                                className="facility-select-button"
                                                type="button"
                                                disabled={requestingFacilityId !== ""}
                                                onClick={() => selectFacility(facility._id)}
                                            >
                                                {requestingFacilityId === facility._id ? (
                                                    <>
                                                        <span className="facility-spinner" />
                                                        {tr("requestingVisit", "Requesting...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        {tr("select", "Request a Visit")}
                                                        <span aria-hidden="true">→</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {!loading && facilities.length === 0 && !error && (
                    <div className="facility-empty-state">
                        <div className="facility-empty-icon" aria-hidden="true">
                            ⌖
                        </div>

                        <h3>
                            {tr("emptyTitle", "Find nearby healthcare")}
                        </h3>

                        <p>
                            {tr(
                                "emptyDescription",
                                "Select the button above to find active healthcare facilities near your current location."
                            )}
                        </p>
                    </div>
                )}

                {facilities.length > 0 && (
                    <p className="facility-footer-note">
                        {tr(
                            "distanceNote",
                            "Distances are approximate. Contact the facility to verify its services and availability before travelling."
                        )}
                    </p>
                )}
            </div>
        </section>
    );
};

export default FacilityFinder;

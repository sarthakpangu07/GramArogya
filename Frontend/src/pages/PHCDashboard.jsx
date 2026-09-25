import React, { useState, useEffect } from "react";

const PHCDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [acceptedPatients, setAcceptedPatients] = useState([]);

    const [loading, setLoading] = useState(false);
    const [acceptedLoading, setAcceptedLoading] = useState(false);

    const [error, setError] = useState("");
    const [facilityId, setFacilityId] = useState("");

    const [acceptingId, setAcceptingId] = useState("");
    const [savingVitalsId, setSavingVitalsId] = useState("");

    const [vitals, setVitals] = useState({});

    // Emergency states
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [emergencyLoading, setEmergencyLoading] = useState(false);
    const [updatingEmergencyId, setUpdatingEmergencyId] = useState("");

    useEffect(() => {
        const fetchFacility = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/facilities/phc",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch facility."
                    );
                }

                if (data.facility) {
                    setFacilityId(data.facility._id);
                } else {
                    setError("No healthcare facility found.");
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFacility();
    }, []);

    const fetchPendingRequests = async () => {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        if (!facilityId) {
            setError("Healthcare facility not found.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/visits/phc-pending?facilityId=${facilityId}`,
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
                        "Failed to fetch pending requests."
                );
            }

            setRequests(data.visitRequests || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcceptedPatients = async () => {
        setError("");
        setAcceptedLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setAcceptedLoading(false);
            return;
        }

        if (!facilityId) {
            setError("Healthcare facility not found.");
            setAcceptedLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/visits/phc-accepted?facilityId=${facilityId}`,
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
                        "Failed to fetch accepted patients."
                );
            }

            setAcceptedPatients(data.visitRequests || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setAcceptedLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        setError("");
        setAcceptingId(requestId);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setAcceptingId("");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/visits/${requestId}/accept`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to accept request."
                );
            }

            setRequests((currentRequests) =>
                currentRequests.filter(
                    (request) => request._id !== requestId
                )
            );

            alert("Patient request accepted successfully!");
        } catch (error) {
            setError(error.message);
        } finally {
            setAcceptingId("");
        }
    };

    const handleVitalsChange = (
        triageId,
        field,
        value
    ) => {
        setVitals((currentVitals) => ({
            ...currentVitals,
            [triageId]: {
                ...currentVitals[triageId],
                [field]: value
            }
        }));
    };

    const recordVitals = async (request) => {
        setError("");
        setSavingVitalsId(request._id);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setSavingVitalsId("");
            return;
        }

        const triageId = request.triageRecord?._id;

        if (!triageId) {
            setError("Triage record not found.");
            setSavingVitalsId("");
            return;
        }

        const patientVitals = vitals[triageId] || {};

        if (
            !patientVitals.temperature ||
            !patientVitals.oxygenLevel ||
            !patientVitals.pulseRate
        ) {
            setError(
                "Please enter temperature, oxygen level, and pulse rate."
            );
            setSavingVitalsId("");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/triage/${triageId}/vitals`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        temperature: Number(
                            patientVitals.temperature
                        ),
                        oxygenLevel: Number(
                            patientVitals.oxygenLevel
                        ),
                        pulseRate: Number(
                            patientVitals.pulseRate
                        ),
                        bloodPressure:
                            patientVitals.bloodPressure || "",
                        notes:
                            patientVitals.notes || ""
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to record vitals."
                );
            }

            alert(
                "Patient vitals recorded successfully!"
            );

            setAcceptedPatients(
                (currentPatients) =>
                    currentPatients.map(
                        (currentRequest) => {
                            if (
                                currentRequest._id !==
                                request._id
                            ) {
                                return currentRequest;
                            }

                            return {
                                ...currentRequest,
                                triageRecord: {
                                    ...currentRequest.triageRecord,
                                    vitalsStatus:
                                        "recorded",
                                    healthWorkerVitals: {
                                        temperature:
                                            Number(
                                                patientVitals.temperature
                                            ),
                                        oxygenLevel:
                                            Number(
                                                patientVitals.oxygenLevel
                                            ),
                                        pulseRate:
                                            Number(
                                                patientVitals.pulseRate
                                            ),
                                        bloodPressure:
                                            patientVitals.bloodPressure ||
                                            "",
                                        notes:
                                            patientVitals.notes ||
                                            ""
                                    }
                                }
                            };
                        }
                    )
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setSavingVitalsId("");
        }
    };

    // Fetch emergency requests
    const fetchEmergencyRequests = async () => {
        setError("");
        setEmergencyLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setEmergencyLoading(false);
            return;
        }

        if (!facilityId) {
            setError("Healthcare facility not found.");
            setEmergencyLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/emergencies/phc-pending",
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
                        "Failed to fetch emergency requests."
                );
            }

            const facilityEmergencyRequests =
                (data.emergencyRequests || []).filter(
                    (request) =>
                        request.requestedFacility?._id ===
                        facilityId
                );

            setEmergencyRequests(
                facilityEmergencyRequests
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setEmergencyLoading(false);
        }
    };

    // Update emergency status
    const updateEmergencyStatus = async (
        emergencyId,
        status
    ) => {
        setError("");
        setUpdatingEmergencyId(emergencyId);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setUpdatingEmergencyId("");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/emergencies/${emergencyId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update emergency status."
                );
            }

            if (
                status === "completed" ||
                status === "cancelled"
            ) {
                setEmergencyRequests(
                    (currentRequests) =>
                        currentRequests.filter(
                            (request) =>
                                request._id !== emergencyId
                        )
                );
            } else {
                setEmergencyRequests(
                    (currentRequests) =>
                        currentRequests.map(
                            (request) =>
                                request._id === emergencyId
                                    ? {
                                          ...request,
                                          status
                                      }
                                    : request
                        )
                );
            }

            alert(
                `Emergency status updated to ${status}.`
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdatingEmergencyId("");
        }
    };

    return (
        <div className="triage-page">
            <div className="triage-container">

                <h1>PHC Dashboard</h1>

                <p className="triage-subtitle">
                    Manage patient visit requests and
                    review triage information.
                </p>

                {/* Pending Requests */}

                <button
                    className="submit-button"
                    onClick={fetchPendingRequests}
                    disabled={loading}
                >
                    {loading
                        ? "Loading requests..."
                        : "View Pending Requests"}
                </button>

                {/* Accepted Patients */}

                <button
                    className="submit-button"
                    onClick={fetchAcceptedPatients}
                    disabled={acceptedLoading}
                    style={{ marginTop: "10px" }}
                >
                    {acceptedLoading
                        ? "Loading patients..."
                        : "View Accepted Patients"}
                </button>

                {/* Emergency Requests */}

                <button
                    className="submit-button"
                    onClick={fetchEmergencyRequests}
                    disabled={emergencyLoading}
                    style={{
                        marginTop: "10px"
                    }}
                >
                    {emergencyLoading
                        ? "Loading emergency requests..."
                        : "🚨 View Emergency Requests"}
                </button>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Pending Patient Requests */}

                {requests.length > 0 && (
                    <div style={{ marginTop: "30px" }}>

                        <h2>
                            Pending Patient Requests
                        </h2>

                        {requests.map((request) => (
                            <div
                                key={request._id}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    marginTop: "15px"
                                }}
                            >
                                <h3>
                                    Patient:{" "}
                                    {request.patient?.name ||
                                        "Unknown"}
                                </h3>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {request.patient?.email ||
                                        "Unknown"}
                                </p>

                                <p>
                                    <strong>
                                        Symptoms:
                                    </strong>{" "}
                                    {request.triageRecord?.symptoms?.join(
                                        ", "
                                    ) ||
                                        "Not available"}
                                </p>

                                <p>
                                    <strong>
                                        Duration:
                                    </strong>{" "}
                                    {request.triageRecord
                                        ?.duration ||
                                        "Not available"}
                                </p>

                                <p>
                                    <strong>
                                        Severity:
                                    </strong>{" "}
                                    {request.triageRecord
                                        ?.severity ||
                                        "Not available"}
                                </p>

                                <p>
                                    <strong>
                                        Urgency:
                                    </strong>{" "}
                                    {request.triageRecord
                                        ?.urgencyLevel ||
                                        "Not available"}
                                </p>

                                <p>
                                    <strong>
                                        Recommended Action:
                                    </strong>{" "}
                                    {request.triageRecord
                                        ?.recommendedAction ||
                                        "Not available"}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {request.status}
                                </p>

                                <button
                                    className="submit-button"
                                    onClick={() =>
                                        acceptRequest(
                                            request._id
                                        )
                                    }
                                    disabled={
                                        acceptingId ===
                                        request._id
                                    }
                                >
                                    {acceptingId ===
                                    request._id
                                        ? "Accepting..."
                                        : "Accept Patient"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Accepted Patients */}

                {acceptedPatients.length > 0 && (
                    <div style={{ marginTop: "30px" }}>

                        <h2>
                            Accepted Patients
                        </h2>

                        {acceptedPatients.map(
                            (request) => {
                                const triageId =
                                    request
                                        .triageRecord?._id;

                                const patientVitals =
                                    vitals[triageId] || {};

                                const vitalsRecorded =
                                    request
                                        .triageRecord
                                        ?.vitalsStatus ===
                                    "recorded";

                                return (
                                    <div
                                        key={request._id}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            marginTop: "15px"
                                        }}
                                    >

                                        <h3>
                                            Patient:{" "}
                                            {request.patient
                                                ?.name ||
                                                "Unknown"}
                                        </h3>

                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {request.patient
                                                ?.email ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Symptoms:
                                            </strong>{" "}
                                            {request
                                                .triageRecord
                                                ?.symptoms?.join(
                                                    ", "
                                                ) ||
                                                "Not available"}
                                        </p>

                                        <p>
                                            <strong>
                                                Severity:
                                            </strong>{" "}
                                            {request
                                                .triageRecord
                                                ?.severity ||
                                                "Not available"}
                                        </p>

                                        <p>
                                            <strong>
                                                Urgency:
                                            </strong>{" "}
                                            {request
                                                .triageRecord
                                                ?.urgencyLevel ||
                                                "Not available"}
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {request.status}
                                        </p>

                                        {vitalsRecorded ? (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "20px",
                                                    padding:
                                                        "15px",
                                                    borderRadius:
                                                        "8px",
                                                    background:
                                                        "#f5f5f5"
                                                }}
                                            >
                                                <h3>
                                                    Vitals
                                                    Recorded
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Temperature:
                                                    </strong>{" "}
                                                    {
                                                        request
                                                            .triageRecord
                                                            ?.healthWorkerVitals
                                                            ?.temperature
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Oxygen Level:
                                                    </strong>{" "}
                                                    {
                                                        request
                                                            .triageRecord
                                                            ?.healthWorkerVitals
                                                            ?.oxygenLevel
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Pulse Rate:
                                                    </strong>{" "}
                                                    {
                                                        request
                                                            .triageRecord
                                                            ?.healthWorkerVitals
                                                            ?.pulseRate
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Blood Pressure:
                                                    </strong>{" "}
                                                    {
                                                        request
                                                            .triageRecord
                                                            ?.healthWorkerVitals
                                                            ?.bloodPressure ||
                                                        "Not provided"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Notes:
                                                    </strong>{" "}
                                                    {
                                                        request
                                                            .triageRecord
                                                            ?.healthWorkerVitals
                                                            ?.notes ||
                                                        "No notes"
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "20px"
                                                }}
                                            >
                                                <h3>
                                                    Record
                                                    Patient
                                                    Vitals
                                                </h3>

                                                <div className="form-section">
                                                    <h2>
                                                        Temperature
                                                    </h2>

                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="e.g. 98.6"
                                                        value={
                                                            patientVitals.temperature ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVitalsChange(
                                                                triageId,
                                                                "temperature",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="form-section">
                                                    <h2>
                                                        Oxygen
                                                        Level
                                                        (SpO₂)
                                                    </h2>

                                                    <input
                                                        type="number"
                                                        step="1"
                                                        placeholder="e.g. 97"
                                                        value={
                                                            patientVitals.oxygenLevel ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVitalsChange(
                                                                triageId,
                                                                "oxygenLevel",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="form-section">
                                                    <h2>
                                                        Pulse
                                                        Rate
                                                    </h2>

                                                    <input
                                                        type="number"
                                                        step="1"
                                                        placeholder="e.g. 80"
                                                        value={
                                                            patientVitals.pulseRate ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVitalsChange(
                                                                triageId,
                                                                "pulseRate",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="form-section">
                                                    <h2>
                                                        Blood
                                                        Pressure
                                                    </h2>

                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 120/80"
                                                        value={
                                                            patientVitals.bloodPressure ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVitalsChange(
                                                                triageId,
                                                                "bloodPressure",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="form-section">
                                                    <h2>
                                                        Notes
                                                    </h2>

                                                    <textarea
                                                        placeholder="Enter additional observations"
                                                        value={
                                                            patientVitals.notes ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleVitalsChange(
                                                                triageId,
                                                                "notes",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    className="submit-button"
                                                    onClick={() =>
                                                        recordVitals(
                                                            request
                                                        )
                                                    }
                                                    disabled={
                                                        savingVitalsId ===
                                                        request._id
                                                    }
                                                >
                                                    {savingVitalsId ===
                                                    request._id
                                                        ? "Saving Vitals..."
                                                        : "Save Vitals"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {/* Emergency Requests */}

                <div
                    style={{
                        marginTop: "40px"
                    }}
                >
                    {emergencyRequests.length > 0 && (
                        <div>
                            <h2>
                                🚨 Emergency Requests
                            </h2>

                            {emergencyRequests.map(
                                (request) => (
                                    <div
                                        key={request._id}
                                        style={{
                                            border: "2px solid #d32f2f",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            marginTop: "15px"
                                        }}
                                    >
                                        <h3>
                                            Patient:{" "}
                                            {request.patient
                                                ?.name ||
                                                "Unknown"}
                                        </h3>

                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {request.patient
                                                ?.email ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Emergency
                                                Reason:
                                            </strong>{" "}
                                            {
                                                request.emergencyReason
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Facility:
                                            </strong>{" "}
                                            {request
                                                .requestedFacility
                                                ?.name ||
                                                "Not assigned"}
                                        </p>

                                        <p>
                                            <strong>
                                                Ambulance:
                                            </strong>{" "}
                                            {request.ambulanceRequested
                                                ? "🚑 Requested"
                                                : "Not requested"}
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {request.status}
                                        </p>

                                        {request.emergencyGuidance && (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px",
                                                    padding:
                                                        "15px",
                                                    borderRadius:
                                                        "8px",
                                                    background:
                                                        "#fff3f3"
                                                }}
                                            >
                                                <strong>
                                                    Emergency
                                                    Guidance
                                                </strong>

                                                <p>
                                                    {
                                                        request.emergencyGuidance
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                marginTop:
                                                    "20px"
                                            }}
                                        >
                                            {request.status !==
                                                "in_progress" &&
                                                request.status !==
                                                    "completed" &&
                                                request.status !==
                                                    "cancelled" && (
                                                    <button
                                                        className="submit-button"
                                                        onClick={() =>
                                                            updateEmergencyStatus(
                                                                request._id,
                                                                "in_progress"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingEmergencyId ===
                                                            request._id
                                                        }
                                                    >
                                                        {updatingEmergencyId ===
                                                        request._id
                                                            ? "Updating..."
                                                            : "Start Emergency Response"}
                                                    </button>
                                                )}

                                            {request.status ===
                                                "in_progress" && (
                                                <button
                                                    className="submit-button"
                                                    onClick={() =>
                                                        updateEmergencyStatus(
                                                            request._id,
                                                            "completed"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingEmergencyId ===
                                                        request._id
                                                    }
                                                    style={{
                                                        marginLeft:
                                                            "10px"
                                                    }}
                                                >
                                                    {updatingEmergencyId ===
                                                    request._id
                                                        ? "Updating..."
                                                        : "Mark Completed"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {emergencyRequests.length === 0 &&
                        !emergencyLoading && (
                            <p
                                style={{
                                    marginTop: "15px"
                                }}
                            >
                                No pending emergency
                                requests.
                            </p>
                        )}
                </div>

            </div>
        </div>
    );
};

export default PHCDashboard;
import React, { useState } from "react";

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);

    const [assessment, setAssessment] = useState("");
    const [decision, setDecision] = useState("treatment");
    const [prescription, setPrescription] = useState("");
    const [referralReason, setReferralReason] = useState("");
    const [doctorNotes, setDoctorNotes] = useState("");

    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState("");
    const [loadingFacilities, setLoadingFacilities] = useState(false);

    const [saving, setSaving] = useState(false);

    // --------------------------------
    // TELECONSULTATION STATES
    // --------------------------------

    const [teleconsultations, setTeleconsultations] = useState([]);
    const [loadingTeleconsultations, setLoadingTeleconsultations] =
        useState(false);

    // --------------------------------
    // FOLLOW-UP STATES
    // --------------------------------

    const [followUps, setFollowUps] = useState([]);
    const [loadingFollowUps, setLoadingFollowUps] = useState(false);

    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpReason, setFollowUpReason] = useState("");
    const [followUpNotes, setFollowUpNotes] = useState("");

    const [creatingFollowUp, setCreatingFollowUp] = useState(false);

    // --------------------------------
    // FETCH PATIENTS
    // --------------------------------

    const fetchPatients = async () => {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/visits/doctor-patients",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch patients."
                );
            }

            setPatients(data.visitRequests || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // FETCH ACTIVE FACILITIES
    // --------------------------------

    const fetchFacilities = async () => {
        setError("");
        setLoadingFacilities(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoadingFacilities(false);
            return;
        }

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/facilities/active",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch facilities."
                );
            }

            setFacilities(data.facilities || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingFacilities(false);
        }
    };

    // --------------------------------
    // FETCH TELECONSULTATIONS
    // --------------------------------

    const fetchTeleconsultations = async () => {
        setError("");
        setLoadingTeleconsultations(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoadingTeleconsultations(false);
            return;
        }

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/teleconsultations/doctor",
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
                        "Failed to fetch teleconsultations."
                );
            }

            setTeleconsultations(
                data.teleconsultations || []
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingTeleconsultations(false);
        }
    };

    // --------------------------------
    // CREATE FOLLOW-UP
    // --------------------------------

    const createFollowUp = async () => {
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        if (!selectedPatient) {
            setError("Please select a patient.");
            return;
        }

        if (!followUpDate) {
            setError("Please select a follow-up date and time.");
            return;
        }

        if (!followUpReason.trim()) {
            setError("Please enter the follow-up reason.");
            return;
        }

        setCreatingFollowUp(true);

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/follow-ups",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        visitRequestId: selectedPatient._id,
                        followUpDate: new Date(
                            followUpDate
                        ).toISOString(),
                        reason: followUpReason.trim(),
                        notes: followUpNotes.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create follow-up."
                );
            }

            setFollowUps((currentFollowUps) => [
                data.followUp,
                ...currentFollowUps
            ]);

            setFollowUpDate("");
            setFollowUpReason("");
            setFollowUpNotes("");

            alert("Follow-up created successfully!");

        } catch (error) {
            setError(error.message);
        } finally {
            setCreatingFollowUp(false);
        }
    };

    // --------------------------------
    // UPDATE FOLLOW-UP STATUS
    // --------------------------------

    const updateFollowUpStatus = async (
        followUpId,
        status
    ) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `https://gramarogya-27q3.onrender.com/api/follow-ups/${followUpId}/status`,
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
                        "Failed to update follow-up status."
                );
            }

            setFollowUps((currentFollowUps) =>
                currentFollowUps.map((followUp) =>
                    followUp._id === followUpId
                        ? {
                              ...followUp,
                              status
                          }
                        : followUp
                )
            );

        } catch (error) {
            setError(error.message);
        }
    };

    // --------------------------------
    // FETCH DOCTOR FOLLOW-UPS
    // --------------------------------

    const fetchFollowUps = async () => {
        setError("");
        setLoadingFollowUps(true);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoadingFollowUps(false);
            return;
        }

        try {
            const response = await fetch(
                "https://gramarogya-27q3.onrender.com/api/follow-ups/doctor",
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
                        "Failed to fetch follow-ups."
                );
            }

            setFollowUps(data.followUps || []);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingFollowUps(false);
        }
    };

    // --------------------------------
    // UPDATE TELECONSULTATION STATUS
    // --------------------------------

    const updateTeleconsultationStatus = async (
        consultationId,
        status
    ) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return false;
        }

        try {
            setError("");

            const response = await fetch(
                `https://gramarogya-27q3.onrender.com/api/teleconsultations/${consultationId}/status`,
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
                        "Failed to update consultation status."
                );
            }

            setTeleconsultations((current) =>
                current.map((consultation) =>
                    consultation._id === consultationId
                        ? {
                              ...consultation,
                              status
                          }
                        : consultation
                )
            );

            return true;

        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    // --------------------------------
    // START TELECONSULTATION
    // --------------------------------

    const startTeleconsultation = async (
        consultation
    ) => {
        const success =
            await updateTeleconsultationStatus(
                consultation._id,
                "ongoing"
            );

        if (success) {
            window.open(
                consultation.meetingLink,
                "_blank"
            );
        }
    };

    // --------------------------------
    // JOIN ONGOING TELECONSULTATION
    // --------------------------------

    const joinTeleconsultation = (
        consultation
    ) => {
        window.open(
            consultation.meetingLink,
            "_blank"
        );
    };

    // --------------------------------
    // COMPLETE TELECONSULTATION
    // --------------------------------

    const completeTeleconsultation = async (
        consultation
    ) => {
        await updateTeleconsultationStatus(
            consultation._id,
            "completed"
        );
    };

    // --------------------------------
    // FORMAT DATE
    // --------------------------------

    const formatDate = (date) => {
        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

    // --------------------------------
    // OPEN CONSULTATION
    // --------------------------------

    const openConsultation = async (patient) => {
        setSelectedPatient(patient);

        setAssessment("");
        setDecision("treatment");
        setPrescription("");
        setReferralReason("");
        setSelectedFacility("");
        setDoctorNotes("");

        setError("");

        await fetchFacilities();
    };

    // --------------------------------
    // CLOSE CONSULTATION
    // --------------------------------

    const closeConsultation = () => {
        setSelectedPatient(null);

        setAssessment("");
        setDecision("treatment");
        setPrescription("");
        setReferralReason("");
        setSelectedFacility("");
        setDoctorNotes("");

        setError("");
    };

    // --------------------------------
    // SAVE CONSULTATION
    // --------------------------------

    const saveConsultation = async () => {
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        if (!selectedPatient) {
            setError("Please select a patient.");
            return;
        }

        if (!assessment.trim()) {
            setError(
                "Please enter the doctor's assessment."
            );
            return;
        }

        if (
            decision === "treatment" &&
            !prescription.trim()
        ) {
            setError(
                "Please enter the prescription."
            );
            return;
        }

        if (
            decision === "referral" &&
            !referralReason.trim()
        ) {
            setError(
                "Please enter the referral reason."
            );
            return;
        }

        if (
            decision === "referral" &&
            !selectedFacility
        ) {
            setError(
                "Please select a referral facility."
            );
            return;
        }

        setSaving(true);

        try {
            // --------------------------------
            // STEP 1: SAVE CONSULTATION
            // --------------------------------

            const consultationResponse =
                await fetch(
                    "https://gramarogya-27q3.onrender.com/api/consultations",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            visitRequestId:
                                selectedPatient._id,
                            assessment:
                                assessment.trim(),
                            decision,
                            prescription:
                                decision ===
                                "treatment"
                                    ? prescription.trim()
                                    : "",
                            referralReason:
                                decision ===
                                "referral"
                                    ? referralReason.trim()
                                    : "",
                            doctorNotes:
                                doctorNotes.trim()
                        })
                    }
                );

            const consultationData =
                await consultationResponse.json();

            if (!consultationResponse.ok) {
                throw new Error(
                    consultationData.message ||
                        "Failed to save consultation."
                );
            }

            // --------------------------------
            // STEP 2: CREATE REFERRAL
            // --------------------------------

            if (decision === "referral") {
                const referralResponse =
                    await fetch(
                        "https://gramarogya-27q3.onrender.com/api/referrals",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                visitRequestId:
                                    selectedPatient._id,
                                reason:
                                    referralReason.trim(),
                                referredFacilityId:
                                    selectedFacility,
                                doctorNotes:
                                    doctorNotes.trim()
                            })
                        }
                    );

                const referralData =
                    await referralResponse.json();

                if (!referralResponse.ok) {
                    throw new Error(
                        referralData.message ||
                            "Consultation saved, but referral creation failed."
                    );
                }

                alert(
                    "Consultation and referral saved successfully!"
                );

            } else {
                alert(
                    "Consultation saved successfully!"
                );
            }

            // Remove completed patient from list
            setPatients((currentPatients) =>
                currentPatients.filter(
                    (patient) =>
                        patient._id !==
                        selectedPatient._id
                )
            );

            closeConsultation();

        } catch (error) {
            setError(error.message);

        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="triage-page">
            <div className="triage-container">

                <h1>Doctor Dashboard</h1>

                <p className="triage-subtitle">
                    Review patients referred from the PHC
                    and manage doctor consultations.
                </p>

                {/* ======================================
                    TELECONSULTATIONS
                ====================================== */}

                <div
                    style={{
                        marginTop: "30px",
                        marginBottom: "30px",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px"
                    }}
                >
                    <h2>
                        My Teleconsultations
                    </h2>

                    <p>
                        View and manage scheduled
                        online doctor consultations.
                    </p>

                    <button
                        className="submit-button"
                        onClick={
                            fetchTeleconsultations
                        }
                        disabled={
                            loadingTeleconsultations
                        }
                    >
                        {loadingTeleconsultations
                            ? "Loading Teleconsultations..."
                            : "View Teleconsultations"}
                    </button>

                    {teleconsultations.length === 0 &&
                        !loadingTeleconsultations && (
                            <p
                                style={{
                                    marginTop: "20px"
                                }}
                            >
                                No teleconsultations
                                available.
                            </p>
                        )}

                    {teleconsultations.length > 0 && (
                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            {teleconsultations.map(
                                (consultation) => (
                                    <div
                                        key={
                                            consultation._id
                                        }
                                        style={{
                                            border:
                                                "1px solid #ddd",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "20px",
                                            marginTop:
                                                "15px"
                                        }}
                                    >
                                        <h3>
                                            Patient:{" "}
                                            {consultation
                                                .patient
                                                ?.name ||
                                                "Unknown"}
                                        </h3>

                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {consultation
                                                .patient
                                                ?.email ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Date & Time:
                                            </strong>{" "}
                                            {formatDate(
                                                consultation.scheduledAt
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Visit Status:
                                            </strong>{" "}
                                            {consultation
                                                .visitRequest
                                                ?.status ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Consultation Status:
                                            </strong>{" "}
                                            {
                                                consultation.status
                                            }
                                        </p>

                                        {consultation.status ===
                                            "scheduled" && (
                                            <button
                                                className="submit-button"
                                                onClick={() =>
                                                    startTeleconsultation(
                                                        consultation
                                                    )
                                                }
                                            >
                                                Start Consultation
                                            </button>
                                        )}

                                        {consultation.status ===
                                            "ongoing" && (
                                            <>
                                                <button
                                                    className="submit-button"
                                                    onClick={() =>
                                                        joinTeleconsultation(
                                                            consultation
                                                        )
                                                    }
                                                >
                                                    Join Consultation
                                                </button>

                                                <button
                                                    className="submit-button"
                                                    style={{
                                                        marginLeft:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        completeTeleconsultation(
                                                            consultation
                                                        )
                                                    }
                                                >
                                                    Complete Consultation
                                                </button>
                                            </>
                                        )}

                                        {consultation.status ===
                                            "completed" && (
                                            <p
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >
                                                This consultation
                                                has been completed.
                                            </p>
                                        )}

                                        {consultation.status ===
                                            "cancelled" && (
                                            <p
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >
                                                This consultation
                                                has been cancelled.
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* ======================================
                    FOLLOW-UPS
                ====================================== */}

                <div
                    style={{
                        marginTop: "30px",
                        marginBottom: "30px",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px"
                    }}
                >
                    <h2>My Follow-ups</h2>

                    <p>
                        View and manage patient follow-up appointments.
                    </p>

                    <button
                        className="submit-button"
                        onClick={fetchFollowUps}
                        disabled={loadingFollowUps}
                    >
                        {loadingFollowUps
                            ? "Loading Follow-ups..."
                            : "View Follow-ups"}
                    </button>

                    {/* CREATE FOLLOW-UP */}

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>Create Follow-up</h3>

                        {!selectedPatient ? (
                            <p>
                                Open a patient consultation below to
                                create a follow-up for that patient.
                            </p>
                        ) : (
                            <>
                                <p>
                                    <strong>Patient:</strong>{" "}
                                    {selectedPatient.patient?.name ||
                                        "Unknown"}
                                </p>

                                <div className="form-section">
                                    <h3>Follow-up Date & Time</h3>

                                    <input
                                        type="datetime-local"
                                        value={followUpDate}
                                        onChange={(e) =>
                                            setFollowUpDate(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="form-section">
                                    <h3>Follow-up Reason</h3>

                                    <textarea
                                        placeholder="Enter the reason for follow-up..."
                                        value={followUpReason}
                                        onChange={(e) =>
                                            setFollowUpReason(
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                    />
                                </div>

                                <div className="form-section">
                                    <h3>Follow-up Notes</h3>

                                    <textarea
                                        placeholder="Enter additional follow-up instructions..."
                                        value={followUpNotes}
                                        onChange={(e) =>
                                            setFollowUpNotes(
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                    />
                                </div>

                                <button
                                    className="submit-button"
                                    onClick={createFollowUp}
                                    disabled={creatingFollowUp}
                                >
                                    {creatingFollowUp
                                        ? "Creating Follow-up..."
                                        : "Create Follow-up"}
                                </button>
                            </>
                        )}
                    </div>

                    {followUps.length === 0 &&
                        !loadingFollowUps && (
                            <p
                                style={{
                                    marginTop: "20px"
                                }}
                            >
                                No follow-ups available.
                            </p>
                        )}

                    {followUps.length > 0 && (
                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            {followUps.map((followUp) => (
                                <div
                                    key={followUp._id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        marginTop: "15px"
                                    }}
                                >
                                    <h3>
                                        Patient:{" "}
                                        {followUp.patient?.name ||
                                            "Unknown"}
                                    </h3>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {followUp.patient?.email ||
                                            "Unknown"}
                                    </p>

                                    <p>
                                        <strong>
                                            Follow-up Date:
                                        </strong>{" "}
                                        {formatDate(
                                            followUp.followUpDate
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            Reason:
                                        </strong>{" "}
                                        {followUp.reason}
                                    </p>

                                    <p>
                                        <strong>
                                            Notes:
                                        </strong>{" "}
                                        {followUp.notes ||
                                            "No notes"}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {followUp.status}
                                    </p>

                                    {/* UPCOMING */}

                                    {followUp.status ===
                                        "upcoming" && (
                                        <>
                                            <p
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >
                                                This follow-up is
                                                upcoming.
                                            </p>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >
                                                <button
                                                    className="submit-button"
                                                    onClick={() =>
                                                        updateFollowUpStatus(
                                                            followUp._id,
                                                            "completed"
                                                        )
                                                    }
                                                >
                                                    Mark Completed
                                                </button>

                                                <button
                                                    className="submit-button"
                                                    style={{
                                                        marginLeft:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        updateFollowUpStatus(
                                                            followUp._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                >
                                                    Cancel Follow-up
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* COMPLETED */}

                                    {followUp.status ===
                                        "completed" && (
                                        <p
                                            style={{
                                                marginTop:
                                                    "15px"
                                            }}
                                        >
                                            This follow-up has been
                                            completed.
                                        </p>
                                    )}

                                    {/* CANCELLED */}

                                    {followUp.status ===
                                        "cancelled" && (
                                        <p
                                            style={{
                                                marginTop:
                                                    "15px"
                                            }}
                                        >
                                            This follow-up has been
                                            cancelled.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ======================================
                    PATIENT LIST
                ====================================== */}

                {!selectedPatient && (
                    <>
                        <button
                            className="submit-button"
                            onClick={fetchPatients}
                            disabled={loading}
                        >
                            {loading
                                ? "Loading Patients..."
                                : "View Patients"}
                        </button>

                        {patients.length === 0 &&
                            !loading &&
                            !error && (
                                <p
                                    style={{
                                        marginTop:
                                            "25px"
                                    }}
                                >
                                    No patients are
                                    currently waiting
                                    for doctor review.
                                </p>
                            )}

                        {patients.length > 0 && (
                            <div
                                style={{
                                    marginTop: "30px"
                                }}
                            >
                                <h2>
                                    Patients for Review
                                </h2>

                                {patients.map(
                                    (request) => {
                                        const triage =
                                            request.triageRecord;

                                        const vitals =
                                            triage?.healthWorkerVitals;

                                        return (
                                            <div
                                                key={
                                                    request._id
                                                }
                                                style={{
                                                    border:
                                                        "1px solid #ccc",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "20px",
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >
                                                <h3>
                                                    Patient:{" "}
                                                    {request
                                                        .patient
                                                        ?.name ||
                                                        "Unknown"}
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Email:
                                                    </strong>{" "}
                                                    {request
                                                        .patient
                                                        ?.email ||
                                                        "Unknown"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Healthcare Facility:
                                                    </strong>{" "}
                                                    {request
                                                        .facility
                                                        ?.name ||
                                                        "Unknown"}
                                                </p>

                                                <hr />

                                                <h3>
                                                    Triage
                                                    Information
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Symptoms:
                                                    </strong>{" "}
                                                    {triage?.symptoms?.join(
                                                        ", "
                                                    ) ||
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Duration:
                                                    </strong>{" "}
                                                    {triage?.duration ||
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Severity:
                                                    </strong>{" "}
                                                    {triage?.severity ||
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Urgency:
                                                    </strong>{" "}
                                                    {triage?.urgencyLevel ||
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Recommended Action:
                                                    </strong>{" "}
                                                    {triage?.recommendedAction ||
                                                        "Not available"}
                                                </p>

                                                <hr />

                                                <h3>
                                                    PHC Recorded
                                                    Vitals
                                                </h3>

                                                <p>
                                                    <strong>
                                                        Temperature:
                                                    </strong>{" "}
                                                    {vitals?.temperature ??
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Oxygen Level:
                                                    </strong>{" "}
                                                    {vitals?.oxygenLevel ??
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Pulse Rate:
                                                    </strong>{" "}
                                                    {vitals?.pulseRate ??
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Blood Pressure:
                                                    </strong>{" "}
                                                    {vitals?.bloodPressure ||
                                                        "Not available"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        PHC Notes:
                                                    </strong>{" "}
                                                    {vitals?.notes ||
                                                        "No notes"}
                                                </p>

                                                <button
                                                    className="submit-button"
                                                    style={{
                                                        marginTop:
                                                            "15px"
                                                    }}
                                                    onClick={() =>
                                                        openConsultation(
                                                            request
                                                        )
                                                    }
                                                >
                                                    Review Patient
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ======================================
                    CONSULTATION FORM
                ====================================== */}

                {selectedPatient && (
                    <div
                        style={{
                            marginTop: "30px"
                        }}
                    >
                        <button
                            className="submit-button"
                            onClick={closeConsultation}
                            style={{
                                marginBottom:
                                    "20px"
                            }}
                        >
                            ← Back to Patients
                        </button>

                        <h2>
                            Doctor Consultation
                        </h2>

                        <p className="triage-subtitle">
                            Patient:{" "}
                            {selectedPatient.patient
                                ?.name || "Unknown"}
                        </p>

                        {/* PATIENT INFORMATION */}

                        <div
                            style={{
                                border:
                                    "1px solid #ccc",
                                borderRadius:
                                    "10px",
                                padding: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <h3>
                                Patient Information
                            </h3>

                            <p>
                                <strong>
                                    Symptoms:
                                </strong>{" "}
                                {selectedPatient
                                    .triageRecord
                                    ?.symptoms?.join(
                                        ", "
                                    )}
                            </p>

                            <p>
                                <strong>
                                    Severity:
                                </strong>{" "}
                                {
                                    selectedPatient
                                        .triageRecord
                                        ?.severity
                                }
                            </p>

                            <p>
                                <strong>
                                    Urgency:
                                </strong>{" "}
                                {
                                    selectedPatient
                                        .triageRecord
                                        ?.urgencyLevel
                                }
                            </p>

                            <h3
                                style={{
                                    marginTop:
                                        "25px"
                                }}
                            >
                                PHC Vitals
                            </h3>

                            <p>
                                <strong>
                                    Temperature:
                                </strong>{" "}
                                {
                                    selectedPatient
                                        .triageRecord
                                        ?.healthWorkerVitals
                                        ?.temperature
                                }
                            </p>

                            <p>
                                <strong>
                                    Oxygen:
                                </strong>{" "}
                                {
                                    selectedPatient
                                        .triageRecord
                                        ?.healthWorkerVitals
                                        ?.oxygenLevel
                                }
                            </p>

                            <p>
                                <strong>
                                    Pulse:
                                </strong>{" "}
                                {
                                    selectedPatient
                                        .triageRecord
                                        ?.healthWorkerVitals
                                        ?.pulseRate
                                }
                            </p>
                        </div>

                        {/* DOCTOR ASSESSMENT */}

                        <div className="form-section">
                            <h2>
                                Doctor Assessment
                            </h2>

                            <textarea
                                placeholder="Enter your clinical assessment..."
                                value={assessment}
                                onChange={(e) =>
                                    setAssessment(
                                        e.target.value
                                    )
                                }
                                rows="5"
                            />
                        </div>

                        {/* CONSULTATION DECISION */}

                        <div className="form-section">
                            <h2>
                                Consultation Decision
                            </h2>

                            <select
                                value={decision}
                                onChange={(e) => {
                                    setDecision(
                                        e.target.value
                                    );

                                    if (
                                        e.target.value ===
                                        "referral"
                                    ) {
                                        fetchFacilities();
                                    }
                                }}
                            >
                                <option value="treatment">
                                    Treatment
                                </option>

                                <option value="referral">
                                    Referral
                                </option>
                            </select>
                        </div>

                        {/* PRESCRIPTION */}

                        {decision === "treatment" && (
                            <div className="form-section">
                                <h2>
                                    Prescription
                                </h2>

                                <textarea
                                    placeholder="Enter prescription details..."
                                    value={
                                        prescription
                                    }
                                    onChange={(e) =>
                                        setPrescription(
                                            e.target.value
                                        )
                                    }
                                    rows="5"
                                />
                            </div>
                        )}

                        {/* REFERRAL */}

                        {decision === "referral" && (
                            <>
                                <div className="form-section">
                                    <h2>
                                        Referral Facility
                                    </h2>

                                    {loadingFacilities ? (
                                        <p>
                                            Loading
                                            facilities...
                                        </p>
                                    ) : facilities.length ===
                                      0 ? (
                                        <p>
                                            No active
                                            referral
                                            facilities
                                            available.
                                        </p>
                                    ) : (
                                        <select
                                            value={
                                                selectedFacility
                                            }
                                            onChange={(e) =>
                                                setSelectedFacility(
                                                    e.target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select referral
                                                facility
                                            </option>

                                            {facilities.map(
                                                (
                                                    facility
                                                ) => (
                                                    <option
                                                        key={
                                                            facility._id
                                                        }
                                                        value={
                                                            facility._id
                                                        }
                                                    >
                                                        {
                                                            facility.name
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            facility.facilityType
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            facility.district
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    )}
                                </div>

                                <div className="form-section">
                                    <h2>
                                        Referral Reason
                                    </h2>

                                    <textarea
                                        placeholder="Explain why the patient needs referral..."
                                        value={
                                            referralReason
                                        }
                                        onChange={(e) =>
                                            setReferralReason(
                                                e.target
                                                    .value
                                            )
                                        }
                                        rows="5"
                                    />
                                </div>
                            </>
                        )}

                        {/* DOCTOR NOTES */}

                        <div className="form-section">
                            <h2>
                                Doctor Notes
                            </h2>

                            <textarea
                                placeholder="Enter additional notes..."
                                value={
                                    doctorNotes
                                }
                                onChange={(e) =>
                                    setDoctorNotes(
                                        e.target.value
                                    )
                                }
                                rows="4"
                            />
                        </div>

                        {/* SAVE BUTTON */}

                        <button
                            className="submit-button"
                            onClick={
                                saveConsultation
                            }
                            disabled={
                                saving ||
                                (decision ===
                                    "referral" &&
                                    loadingFacilities)
                            }
                        >
                            {saving
                                ? "Saving Consultation..."
                                : "Save Consultation"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
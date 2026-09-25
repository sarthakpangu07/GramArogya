const en = {
    app: {
        name: "GramArogya"
    },

    common: {
        home: "Home",
        login: "Login",
        logout: "Logout",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
        loading: "Loading..."
    },

    language: {
        select: "Select Language",
        english: "English",
        marathi: "Marathi",
        hindi: "Hindi"
    },

    patient: {
        dashboard: "Patient Dashboard",
        healthCheck: "Health Check",
        facilityFinder: "Find Healthcare Facility",
        healthRecords: "My Health Records",
        teleconsultations: "Teleconsultations",
        appointments: "Appointments",
        referrals: "Referrals",
        followUps: "Follow-ups",
        schemes: "Government Schemes",
        emergency: "Emergency Help"
    },

    triage: {
        title: "Health Check",
        subtitle:
            "Tell us about your symptoms to understand how urgently you may need healthcare.",
        safetyNote:
            "This is not a medical diagnosis. If you are experiencing a serious emergency, seek immediate medical help.",

        symptomsQuestion:
            "What symptoms are you experiencing?",

        durationQuestion:
            "How long have you had these symptoms?",

        durationPlaceholder:
            "Example: 2 days",

        severityQuestion:
            "How severe do you feel your symptoms are?",

        existingConditions:
            "Existing medical conditions",

        conditionsPlaceholder:
            "Example: Diabetes, Asthma (optional)",

        conditionsHelp:
            "Separate multiple conditions with commas.",

        checkUrgency:
            "Check My Urgency",

        checking:
            "Checking...",

        result:
            "Triage Result",

        urgency:
            "Urgency",

        recommendedAction:
            "Recommended Action",

        doctorReview:
            "Doctor Review",

        required:
            "Required",

        notRequired:
            "Not required",

        resultNote:
            "This result is an urgency recommendation, not a medical diagnosis."
    },

    severity: {
        mild: "Mild",
        moderate: "Moderate",
        severe: "Severe"
    },

    symptoms: {
        fever: "Fever",
        cough: "Cough",
        cold: "Cold",
        headache: "Headache",
        bodyPain: "Body Pain",
        weakness: "Weakness",
        breathingDifficulty: "Breathing Difficulty",
        chestPain: "Chest Pain",
        vomiting: "Vomiting",
        diarrhea: "Diarrhea"
    },

    facility: {
        title: "Find Nearby Healthcare Facilities",

        subtitle:
            "Find nearby government healthcare facilities based on your current location.",

        findButton: "Find Nearby Facilities",
        finding: "Finding facilities...",

        type: "Type",
        address: "Address",
        distance: "Distance",
        services: "Services",

        select: "Select This Facility",

        loginRequired:
            "Please login first.",

        triageRequired:
            "Please complete a triage check first.",

        locationNotSupported:
            "Location is not supported by your browser.",

        locationAccessDenied:
            "Unable to access your location. Please allow location access.",

        triageFetchFailed:
            "Failed to fetch triage record.",

        facilityFetchFailed:
            "Failed to find facilities.",

        visitRequestFailed:
            "Failed to send visit request.",

        visitRequestSuccess:
            "Visit request sent successfully!"
    },

    healthRecords: {
        title: "My Health Records",

        loading:
            "Loading health records...",

        noRecords:
            "No health records found.",

        healthRecord:
            "Health Record",

        date:
            "Date",

        symptomsTriage:
            "Symptoms & Triage",

        symptoms:
            "Symptoms",

        duration:
            "Duration",

        severity:
            "Severity",

        urgency:
            "Urgency",

        recommendedAction:
            "Recommended Action",

        phcVitals:
            "PHC Vitals",

        temperature:
            "Temperature",

        oxygenLevel:
            "Oxygen Level",

        pulseRate:
            "Pulse Rate",

        bloodPressure:
            "Blood Pressure",

        phcNotes:
            "PHC Notes",

        noNotes:
            "No notes",

        vitalsNotRecorded:
            "PHC vitals not recorded yet.",

        healthcareFacility:
            "Healthcare Facility",

        name:
            "Name",

        type:
            "Type",

        village:
            "Village",

        district:
            "District",

        visitStatus:
            "Visit Status",

        facilityNotSelected:
            "Healthcare facility has not been selected yet.",

        doctorConsultation:
            "Doctor Consultation",

        doctor:
            "Doctor",

        assessment:
            "Assessment",

        decision:
            "Decision",

        prescription:
            "Prescription",

        referralReason:
            "Referral Reason",

        doctorNotes:
            "Doctor Notes",

        consultationNotCompleted:
            "Doctor consultation not completed yet.",

        fetchFailed:
            "Failed to fetch health records.",

        values: {
            emergency: "Emergency",
            urgent: "Urgent",
            humanReview: "Human Review",
            routine: "Routine",

            emergencyHelp:
                "Seek Emergency Help",

            urgentPhc:
                "Visit PHC Urgently",

            phcVisit:
                "Visit PHC",

            telemedicine:
                "Telemedicine Consultation",

            doctorConsultation:
                "Doctor Consultation",

            routineAction:
                "Routine Healthcare"
        }
    },

    teleconsultation: {
        title:
            "Teleconsultations",

        myTitle:
            "My Teleconsultations",

        loading:
            "Loading your consultations...",

        subtitle:
            "View your scheduled online doctor consultations.",

        noConsultations:
            "No Teleconsultations",

        noConsultationsMessage:
            "You currently have no scheduled teleconsultations.",

        doctor:
            "Doctor",

        doctorFallback:
            "Doctor",

        dateTime:
            "Date & Time",

        status:
            "Status",

        visitStatus:
            "Visit Status",

        join:
            "Join Consultation",

        completedMessage:
            "This consultation has been completed.",

        cancelledMessage:
            "This consultation has been cancelled.",

        fetchFailed:
            "Failed to fetch teleconsultations.",

        values: {
            scheduled:
                "Scheduled",

            ongoing:
                "Ongoing",

            completed:
                "Completed",

            cancelled:
                "Cancelled"
        },

        visitStatuses: {
            pending:
                "Pending",

            accepted:
                "Accepted",

            rejected:
                "Rejected",

            completed:
                "Completed",

            cancelled:
                "Cancelled"
        }
    },

    messages: {
        selectSymptom:
            "Please select at least one symptom.",

        selectSeverity:
            "Please select the severity of your symptoms.",

        loginRequired:
            "Please login first to use the health check.",

        requestFailed:
            "Triage request failed."
    },

    emergency: {
        title:
            "Emergency Help",

        warning:
            "If you are experiencing a serious medical emergency, seek immediate medical assistance. Do not delay emergency care.",

        whatHappening:
            "What is happening?",

        reasonPlaceholder:
            "Describe the emergency briefly...",

        ambulanceAssistance:
            "Request emergency ambulance assistance",

        loginRequired:
            "Please login first.",

        reasonRequired:
            "Please describe the emergency before requesting help.",

        requestFailed:
            "Failed to create emergency request.",

        requesting:
            "Requesting Emergency Help...",

        requestButton:
            "REQUEST EMERGENCY HELP",

        requestCreated:
            "Emergency Request Created",

        status:
            "Status",

        reason:
            "Reason",

        nearestFacility:
            "Nearest Healthcare Facility",

        phone:
            "Phone",

        ambulanceRequest:
            "Ambulance request:",

        requested:
            "Requested",

        guidance:
            "Emergency Guidance"
    }
};

export default en;
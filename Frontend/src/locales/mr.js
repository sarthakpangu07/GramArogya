const mr = {
    app: {
        name: "ग्रामआरोग्य"
    },

    common: {
        home: "मुख्यपृष्ठ",
        login: "लॉगिन",
        logout: "लॉगआउट",
        submit: "सबमिट करा",
        cancel: "रद्द करा",
        save: "जतन करा",
        loading: "लोड होत आहे..."
    },

    language: {
        select: "भाषा निवडा",
        english: "इंग्रजी",
        marathi: "मराठी",
        hindi: "हिंदी"
    },

    patient: {
        dashboard: "रुग्ण डॅशबोर्ड",
        healthCheck: "आरोग्य तपासणी",
        facilityFinder: "आरोग्य सुविधा शोधा",
        healthRecords: "माझ्या आरोग्य नोंदी",
        teleconsultations: "टेलिकन्सल्टेशन",
        appointments: "भेटी",
        referrals: "रेफरल",
        followUps: "फॉलो-अप",
        schemes: "सरकारी योजना",
        emergency: "आपत्कालीन मदत"
    },

    triage: {
        title: "आरोग्य तपासणी",
        subtitle: "आपल्याला किती तातडीने आरोग्यसेवेची आवश्यकता आहे हे समजण्यासाठी आपल्या लक्षणांबद्दल सांगा.",
        safetyNote: "ही वैद्यकीय निदान सेवा नाही. आपण गंभीर आपत्कालीन परिस्थितीत असल्यास त्वरित वैद्यकीय मदत घ्या.",
        symptomsQuestion: "आपल्याला कोणती लक्षणे जाणवत आहेत?",
        durationQuestion: "आपल्याला ही लक्षणे किती काळापासून आहेत?",
        durationPlaceholder: "उदाहरण: 2 दिवस",
        severityQuestion: "आपली लक्षणे किती गंभीर आहेत?",
        existingConditions: "आधीपासून असलेले आजार",
        conditionsPlaceholder: "उदाहरण: मधुमेह, दमा (ऐच्छिक)",
        conditionsHelp: "एकापेक्षा जास्त आजार असल्यास स्वल्पविरामाने वेगळे करा.",
        checkUrgency: "तातडीची पातळी तपासा",
        checking: "तपासणी सुरू आहे...",
        result: "तपासणीचा निकाल",
        urgency: "तातडीची पातळी",
        recommendedAction: "शिफारस केलेली कृती",
        doctorReview: "डॉक्टरांचा आढावा",
        required: "आवश्यक",
        notRequired: "आवश्यक नाही",
        resultNote: "हा निकाल केवळ तातडीची शिफारस आहे, वैद्यकीय निदान नाही."
    },

    severity: {
        mild: "सौम्य",
        moderate: "मध्यम",
        severe: "गंभीर"
    },

    symptoms: {
        fever: "ताप",
        cough: "खोकला",
        cold: "सर्दी",
        headache: "डोकेदुखी",
        bodyPain: "अंगदुखी",
        weakness: "अशक्तपणा",
        breathingDifficulty: "श्वास घेण्यास त्रास",
        chestPain: "छातीत दुखणे",
        vomiting: "उलट्या",
        diarrhea: "जुलाब"
    },

    facility: {
        title: "जवळच्या आरोग्य सुविधा शोधा",
        subtitle: "आपल्या सध्याच्या स्थानावर आधारित जवळच्या सरकारी आरोग्य सुविधा शोधा.",
        findButton: "जवळच्या सुविधा शोधा",
        finding: "सुविधा शोधत आहे...",
        type: "प्रकार",
        address: "पत्ता",
        distance: "अंतर",
        services: "सेवा",
        select: "ही सुविधा निवडा",
        loginRequired: "कृपया प्रथम लॉगिन करा.",
        triageRequired: "कृपया प्रथम आरोग्य तपासणी पूर्ण करा.",
        locationNotSupported: "आपल्या ब्राउझरमध्ये स्थान सुविधा उपलब्ध नाही.",
        locationAccessDenied: "आपले स्थान मिळवता आले नाही. कृपया स्थानाची परवानगी द्या.",
        triageFetchFailed: "आरोग्य तपासणीची नोंद मिळवता आली नाही.",
        facilityFetchFailed: "आरोग्य सुविधा शोधता आल्या नाहीत.",
        visitRequestFailed: "भेटीची विनंती पाठवता आली नाही.",
        visitRequestSuccess: "भेटीची विनंती यशस्वीपणे पाठवली!"
    },

    healthRecords: {
        title: "माझ्या आरोग्य नोंदी",
        loading: "आरोग्य नोंदी लोड होत आहेत...",
        noRecords: "आरोग्य नोंदी सापडल्या नाहीत.",
        healthRecord: "आरोग्य नोंद",
        date: "तारीख",
        symptomsTriage: "लक्षणे आणि तपासणी",
        symptoms: "लक्षणे",
        duration: "कालावधी",
        severity: "तीव्रता",
        urgency: "तातडीची पातळी",
        recommendedAction: "शिफारस केलेली कृती",
        phcVitals: "PHC मधील जीवनावश्यक मोजमाप",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सिजन पातळी",
        pulseRate: "नाडीचा दर",
        bloodPressure: "रक्तदाब",
        phcNotes: "PHC नोंदी",
        noNotes: "नोंदी नाहीत",
        vitalsNotRecorded: "PHC मधील जीवनावश्यक मोजमाप अद्याप नोंदवलेले नाहीत.",
        healthcareFacility: "आरोग्य सुविधा",
        name: "नाव",
        type: "प्रकार",
        village: "गाव",
        district: "जिल्हा",
        visitStatus: "भेटीची स्थिती",
        facilityNotSelected: "आरोग्य सुविधा अद्याप निवडलेली नाही.",
        doctorConsultation: "डॉक्टरांचा सल्ला",
        doctor: "डॉक्टर",
        assessment: "तपासणी",
        decision: "निर्णय",
        prescription: "प्रिस्क्रिप्शन",
        referralReason: "रेफरलचे कारण",
        doctorNotes: "डॉक्टरांच्या नोंदी",
        consultationNotCompleted: "डॉक्टरांचा सल्ला अद्याप पूर्ण झालेला नाही.",
        fetchFailed: "आरोग्य नोंदी मिळवता आल्या नाहीत.",

        values: {
            emergency: "आपत्कालीन",
            urgent: "तातडीचे",
            humanReview: "मानवी आढावा",
            routine: "नियमित",
            emergencyHelp: "आपत्कालीन मदत घ्या",
            urgentPhc: "तातडीने PHC ला भेट द्या",
            phcVisit: "PHC ला भेट द्या",
            telemedicine: "टेलिकन्सल्टेशन",
            doctorConsultation: "डॉक्टरांचा सल्ला",
            routineAction: "नियमित आरोग्यसेवा"
        }
    },

    teleconsultation: {
        title: "टेलिकन्सल्टेशन",
        myTitle: "माझे टेलिकन्सल्टेशन",
        loading: "आपले टेलिकन्सल्टेशन लोड होत आहेत...",
        subtitle: "आपल्या नियोजित ऑनलाइन डॉक्टरांच्या सल्ल्याची माहिती पहा.",
        noConsultations: "टेलिकन्सल्टेशन नाहीत",
        noConsultationsMessage: "सध्या आपले कोणतेही नियोजित टेलिकन्सल्टेशन नाही.",
        doctor: "डॉक्टर",
        doctorFallback: "डॉक्टर",
        dateTime: "तारीख आणि वेळ",
        status: "स्थिती",
        visitStatus: "भेटीची स्थिती",
        join: "टेलिकन्सल्टेशनमध्ये सहभागी व्हा",
        completedMessage: "हे टेलिकन्सल्टेशन पूर्ण झाले आहे.",
        cancelledMessage: "हे टेलिकन्सल्टेशन रद्द करण्यात आले आहे.",
        fetchFailed: "टेलिकन्सल्टेशन मिळवता आले नाही.",

        values: {
            scheduled: "नियोजित",
            ongoing: "सुरू आहे",
            completed: "पूर्ण झाले",
            cancelled: "रद्द केले"
        },

        visitStatuses: {
            pending: "प्रलंबित",
            accepted: "स्वीकारले",
            rejected: "नाकारले",
            completed: "पूर्ण झाले",
            cancelled: "रद्द केले"
        }
    },

    messages: {
        selectSymptom: "कृपया किमान एक लक्षण निवडा.",
        selectSeverity: "कृपया आपल्या लक्षणांची तीव्रता निवडा.",
        loginRequired: "आरोग्य तपासणी वापरण्यासाठी कृपया प्रथम लॉगिन करा.",
        requestFailed: "तपासणीची विनंती अयशस्वी झाली."
    },

    governmentSchemes: {
        title: "सरकारी योजना सहाय्य",
        subtitle: "आपल्यासाठी संबंधित असू शकणाऱ्या सरकारी आरोग्य योजनांचा शोध घेण्यासाठी आपली मूलभूत माहिती भरा.",
        age: "वय",
        agePlaceholder: "आपले वय भरा",
        gender: "लिंग",
        selectGender: "लिंग निवडा",
        male: "पुरुष",
        female: "स्त्री",
        other: "इतर",
        pregnancyQuestion: "आपण गर्भवती आहात का?",
        no: "नाही",
        yes: "होय",
        state: "राज्य",
        maharashtra: "महाराष्ट्र",
        otherState: "इतर",
        loginRequired: "कृपया प्रथम लॉगिन करा.",
        ageGenderRequired: "कृपया वय भरा आणि लिंग निवडा.",
        requestFailed: "सरकारी योजना शोधता आल्या नाहीत.",
        finding: "योजना शोधत आहे...",
        findButton: "संबंधित योजना शोधा",
        relevantSchemes: "संभाव्यतः संबंधित योजना",
        noSchemes: "दिलेल्या माहितीनुसार कोणत्याही संभाव्य संबंधित योजना सापडल्या नाहीत.",
        benefits: "लाभ",
        eligibility: "पात्रतेची माहिती",
        howToApply: "अर्ज कसा करावा",
        officialWebsite: "अधिकृत वेबसाइटला भेट द्या"
    },

    doctorDashboard: {
        title: "डॉक्टर डॅशबोर्ड",
        subtitle: "PHC कडून संदर्भित रुग्णांचे पुनरावलोकन करा आणि डॉक्टरांच्या सल्लामसलती व्यवस्थापित करा.",

        loginRequired: "कृपया प्रथम लॉगिन करा.",

        fetchPatientsFailed: "रुग्णांची माहिती मिळवता आली नाही.",
        fetchFacilitiesFailed: "आरोग्य सुविधांची माहिती मिळवता आली नाही.",
        fetchTeleconsultationsFailed: "टेलीकन्सल्टेशनची माहिती मिळवता आली नाही.",
        fetchFollowUpsFailed: "फॉलो-अपची माहिती मिळवता आली नाही.",

        selectPatient: "कृपया रुग्ण निवडा.",
        followUpDateRequired: "कृपया फॉलो-अपची तारीख आणि वेळ निवडा.",
        followUpReasonRequired: "कृपया फॉलो-अपचे कारण भरा.",
        assessmentRequired: "कृपया डॉक्टरांचे मूल्यांकन भरा.",
        prescriptionRequired: "कृपया प्रिस्क्रिप्शन भरा.",
        referralReasonRequired: "कृपया रेफरलचे कारण भरा.",
        referralFacilityRequired: "कृपया रेफरल सुविधा निवडा.",

        createFollowUpFailed: "फॉलो-अप तयार करता आला नाही.",
        updateFollowUpFailed: "फॉलो-अपची स्थिती अपडेट करता आली नाही.",
        updateConsultationFailed: "सल्लामसलतीची स्थिती अपडेट करता आली नाही.",
        saveConsultationFailed: "सल्लामसलत जतन करता आली नाही.",
        referralCreationFailed: "सल्लामसलत जतन झाली, परंतु रेफरल तयार करता आले नाही.",

        followUpCreated: "फॉलो-अप यशस्वीरित्या तयार करण्यात आला!",
        consultationReferralSaved: "सल्लामसलत आणि रेफरल यशस्वीरित्या जतन झाले!",
        consultationSaved: "सल्लामसलत यशस्वीरित्या जतन झाली.",

        myTeleconsultations: "माझी टेलीकन्सल्टेशन",
        teleconsultationDescription: "नियोजित ऑनलाइन डॉक्टरांच्या सल्लामसलती पहा आणि व्यवस्थापित करा.",
        loadingTeleconsultations: "टेलीकन्सल्टेशन लोड होत आहेत...",
        viewTeleconsultations: "टेलीकन्सल्टेशन पहा",
        noTeleconsultations: "कोणतेही टेलीकन्सल्टेशन उपलब्ध नाही.",

        patientLabel: "रुग्ण",
        email: "ईमेल",
        dateTime: "तारीख आणि वेळ",
        visitStatus: "भेटीची स्थिती",
        consultationStatus: "सल्लामसलतीची स्थिती",

        startConsultation: "सल्लामसलत सुरू करा",
        joinConsultation: "सल्लामसलतीत सहभागी व्हा",
        completeConsultation: "सल्लामसलत पूर्ण करा",
        consultationCompleted: "ही सल्लामसलत पूर्ण झाली आहे.",
        consultationCancelled: "ही सल्लामसलत रद्द करण्यात आली आहे.",

        myFollowUps: "माझे फॉलो-अप",
        followUpDescription: "रुग्णांच्या फॉलो-अप भेटी पहा आणि व्यवस्थापित करा.",
        loadingFollowUps: "फॉलो-अप लोड होत आहेत...",
        viewFollowUps: "फॉलो-अप पहा",

        createFollowUp: "फॉलो-अप तयार करा",
        openPatientForFollowUp: "या रुग्णासाठी फॉलो-अप तयार करण्यासाठी खालील रुग्णाची सल्लामसलत उघडा.",
        followUpDateTime: "फॉलो-अप तारीख आणि वेळ",
        followUpReason: "फॉलो-अपचे कारण",
        followUpReasonPlaceholder: "फॉलो-अपचे कारण भरा...",
        followUpNotes: "फॉलो-अपच्या नोंदी",
        followUpNotesPlaceholder: "अतिरिक्त फॉलो-अप सूचना भरा...",
        creatingFollowUp: "फॉलो-अप तयार होत आहे...",

        noFollowUps: "कोणतेही फॉलो-अप उपलब्ध नाहीत.",
        followUpDate: "फॉलो-अप तारीख",
        reason: "कारण",
        notes: "नोंदी",
        status: "स्थिती",
        noNotes: "नोंदी नाहीत",

        followUpUpcoming: "हा फॉलो-अप आगामी आहे.",
        markCompleted: "पूर्ण म्हणून चिन्हांकित करा",
        cancelFollowUp: "फॉलो-अप रद्द करा",
        followUpCompleted: "हा फॉलो-अप पूर्ण झाला आहे.",
        followUpCancelled: "हा फॉलो-अप रद्द करण्यात आला आहे.",

        loadingPatients: "रुग्ण लोड होत आहेत...",
        viewPatients: "रुग्ण पहा",
        noPatientsWaiting: "सध्या डॉक्टरांच्या पुनरावलोकनासाठी कोणतेही रुग्ण प्रतीक्षेत नाहीत.",
        patientsForReview: "पुनरावलोकनासाठी रुग्ण",

        healthcareFacility: "आरोग्य सुविधा",
        triageInformation: "ट्रायाज माहिती",
        symptoms: "लक्षणे",
        duration: "कालावधी",
        severity: "तीव्रता",
        urgency: "तातडीची पातळी",
        recommendedAction: "शिफारस केलेली कृती",

        phcRecordedVitals: "PHC द्वारे नोंदवलेली जीवनावश्यक चिन्हे",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सिजन पातळी",
        pulseRate: "नाडीचा दर",
        bloodPressure: "रक्तदाब",
        phcNotes: "PHC नोंदी",

        reviewPatient: "रुग्णाचे पुनरावलोकन करा",
        backToPatients: "← रुग्णांकडे परत जा",

        doctorConsultation: "डॉक्टरांची सल्लामसलत",
        patientInformation: "रुग्णाची माहिती",
        phcVitals: "PHC जीवनावश्यक चिन्हे",
        oxygen: "ऑक्सिजन",
        pulse: "नाडी",

        doctorAssessment: "डॉक्टरांचे मूल्यांकन",
        assessmentPlaceholder: "आपले वैद्यकीय मूल्यांकन भरा...",

        consultationDecision: "सल्लामसलतीचा निर्णय",
        treatment: "उपचार",
        referral: "रेफरल",

        prescription: "प्रिस्क्रिप्शन",
        prescriptionPlaceholder: "प्रिस्क्रिप्शनची माहिती भरा...",

        referralFacility: "रेफरल सुविधा",
        loadingFacilities: "सुविधा लोड होत आहेत...",
        noReferralFacilities: "कोणत्याही सक्रिय रेफरल सुविधा उपलब्ध नाहीत.",
        selectReferralFacility: "रेफरल सुविधा निवडा",

        referralReason: "रेफरलचे कारण",
        referralReasonPlaceholder: "रुग्णाला रेफरलची आवश्यकता का आहे ते स्पष्ट करा...",

        doctorNotes: "डॉक्टरांच्या नोंदी",
        doctorNotesPlaceholder: "अतिरिक्त नोंदी भरा...",

        savingConsultation: "सल्लामसलत जतन होत आहे...",
        saveConsultation: "सल्लामसलत जतन करा",

        unknown: "अज्ञात",
        notAvailable: "उपलब्ध नाही"
    },

    phcDashboard: {
        title: "PHC डॅशबोर्ड",
        subtitle: "रुग्णांच्या भेटीच्या विनंत्या व्यवस्थापित करा आणि ट्रायाज माहिती तपासा.",

        loginRequired: "कृपया प्रथम लॉगिन करा.",
        fetchFacilityFailed: "आरोग्य सुविधेची माहिती मिळवता आली नाही.",
        noFacilityFound: "कोणतीही आरोग्य सुविधा सापडली नाही.",
        facilityNotFound: "आरोग्य सुविधा सापडली नाही.",
        fetchPendingFailed: "प्रलंबित विनंत्या मिळवता आल्या नाहीत.",
        fetchAcceptedFailed: "स्वीकारलेल्या रुग्णांची माहिती मिळवता आली नाही.",
        acceptRequestFailed: "रुग्णाची विनंती स्वीकारता आली नाही.",
        requestAccepted: "रुग्णाची विनंती यशस्वीरित्या स्वीकारली!",
        triageRecordNotFound: "ट्रायाज नोंद सापडली नाही.",
        vitalsRequired: "कृपया तापमान, ऑक्सिजन पातळी आणि नाडीचा दर भरा.",
        recordVitalsFailed: "जीवनावश्यक मोजमाप नोंदवता आले नाहीत.",
        vitalsRecorded: "रुग्णाची जीवनावश्यक मोजमापे यशस्वीरित्या नोंदवली!",
        fetchEmergencyFailed: "आपत्कालीन विनंत्या मिळवता आल्या नाहीत.",
        updateEmergencyFailed: "आपत्कालीन स्थिती अपडेट करता आली नाही.",
        emergencyStatusUpdated: "आपत्कालीन स्थिती {{status}} अशी अपडेट केली.",

        loadingRequests: "विनंत्या लोड होत आहेत...",
        viewPendingRequests: "प्रलंबित विनंत्या पहा",
        loadingPatients: "रुग्ण लोड होत आहेत...",
        viewAcceptedPatients: "स्वीकारलेले रुग्ण पहा",
        loadingEmergencyRequests: "आपत्कालीन विनंत्या लोड होत आहेत...",
        viewEmergencyRequests: "आपत्कालीन विनंत्या पहा",

        pendingPatientRequests: "प्रलंबित रुग्ण विनंत्या",
        patientLabel: "रुग्ण",
        email: "ईमेल",
        symptoms: "लक्षणे",
        duration: "कालावधी",
        severity: "तीव्रता",
        urgency: "तातडीची पातळी",
        recommendedAction: "शिफारस केलेली कृती",
        status: "स्थिती",
        accepting: "स्वीकारत आहे...",
        acceptPatient: "रुग्ण स्वीकारा",
        unknown: "अज्ञात",
        notAvailable: "उपलब्ध नाही",

        acceptedPatients: "स्वीकारलेले रुग्ण",
        vitalsRecordedHeading: "जीवनावश्यक मोजमाप नोंदवले",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सिजन पातळी",
        pulseRate: "नाडीचा दर",
        bloodPressure: "रक्तदाब",
        notProvided: "माहिती दिलेली नाही",
        notes: "नोंदी",
        noNotes: "नोंदी नाहीत",

        recordPatientVitals: "रुग्णाची जीवनावश्यक मोजमापे नोंदवा",
        temperaturePlaceholder: "उदा. 98.6",
        oxygenLevelWithUnit: "ऑक्सिजन पातळी (SpO₂)",
        oxygenPlaceholder: "उदा. 97",
        pulsePlaceholder: "उदा. 80",
        bloodPressurePlaceholder: "उदा. 120/80",
        notesPlaceholder: "अतिरिक्त निरीक्षणे नोंदवा",
        savingVitals: "जीवनावश्यक मोजमापे जतन होत आहेत...",
        saveVitals: "जीवनावश्यक मोजमापे जतन करा",

        emergencyRequests: "आपत्कालीन विनंत्या",
        emergencyReason: "आपत्कालीन परिस्थितीचे कारण",
        facility: "आरोग्य सुविधा",
        notAssigned: "नियुक्त केलेले नाही",
        ambulance: "रुग्णवाहिका",
        ambulanceRequested: "विनंती केली आहे",
        notRequested: "विनंती केलेली नाही",
        emergencyGuidance: "आपत्कालीन मार्गदर्शन",
        updating: "अपडेट होत आहे...",
        startEmergencyResponse: "आपत्कालीन प्रतिसाद सुरू करा",
        markCompleted: "पूर्ण म्हणून चिन्हांकित करा",
        noPendingEmergency: "कोणत्याही प्रलंबित आपत्कालीन विनंत्या नाहीत."
    },

    emergency: {
        title: "आपत्कालीन मदत",
        warning: "आपण गंभीर वैद्यकीय आपत्कालीन परिस्थितीत असल्यास त्वरित वैद्यकीय मदत घ्या. आपत्कालीन उपचारांना विलंब करू नका.",
        whatHappening: "काय झाले आहे?",
        reasonPlaceholder: "आपत्कालीन परिस्थिती थोडक्यात सांगा...",
        ambulanceAssistance: "आपत्कालीन रुग्णवाहिका मदतीची विनंती करा",
        loginRequired: "कृपया प्रथम लॉगिन करा.",
        reasonRequired: "मदतीची विनंती करण्यापूर्वी कृपया आपत्कालीन परिस्थितीचे वर्णन करा.",
        requestFailed: "आपत्कालीन विनंती तयार करता आली नाही.",
        requesting: "आपत्कालीन मदतीची विनंती करत आहे...",
        requestButton: "आपत्कालीन मदतीची विनंती करा",
        requestCreated: "आपत्कालीन विनंती तयार झाली",
        status: "स्थिती",
        reason: "कारण",
        nearestFacility: "सर्वात जवळची आरोग्य सुविधा",
        phone: "फोन",
        ambulanceRequest: "रुग्णवाहिका विनंती:",
        requested: "विनंती केली",
        guidance: "आपत्कालीन मार्गदर्शन"
    }
};

export default mr;

const hi = {
    app: {
        name: "ग्रामआरोग्य"
    },

    common: {
        home: "होम",
        login: "लॉगिन",
        logout: "लॉगआउट",
        submit: "सबमिट करें",
        cancel: "रद्द करें",
        save: "सहेजें",
        loading: "लोड हो रहा है..."
    },

    language: {
        select: "भाषा चुनें",
        english: "अंग्रेज़ी",
        marathi: "मराठी",
        hindi: "हिंदी"
    },

    patient: {
        dashboard: "मरीज़ डैशबोर्ड",
        healthCheck: "स्वास्थ्य जांच",
        facilityFinder: "स्वास्थ्य सुविधा खोजें",
        healthRecords: "मेरे स्वास्थ्य रिकॉर्ड",
        teleconsultations: "टेली-कंसल्टेशन",
        appointments: "अपॉइंटमेंट",
        referrals: "रेफरल",
        followUps: "फॉलो-अप",
        schemes: "सरकारी योजनाएं",
        emergency: "आपातकालीन सहायता"
    },

    triage: {
        title: "स्वास्थ्य जांच",
        subtitle: "आपको कितनी जल्दी स्वास्थ्य सेवा की आवश्यकता हो सकती है, यह समझने के लिए अपने लक्षणों के बारे में बताएं।",
        safetyNote: "यह चिकित्सा निदान नहीं है। यदि आप गंभीर आपातकालीन स्थिति में हैं, तो तुरंत चिकित्सा सहायता लें।",
        symptomsQuestion: "आपको कौन से लक्षण हो रहे हैं?",
        durationQuestion: "आपको ये लक्षण कितने समय से हैं?",
        durationPlaceholder: "उदाहरण: 2 दिन",
        severityQuestion: "आपको अपने लक्षण कितने गंभीर लगते हैं?",
        existingConditions: "पहले से मौजूद चिकित्सीय स्थितियां",
        conditionsPlaceholder: "उदाहरण: मधुमेह, अस्थमा (वैकल्पिक)",
        conditionsHelp: "एक से अधिक स्थितियों को अल्पविराम से अलग करें।",
        checkUrgency: "मेरी तात्कालिकता जांचें",
        checking: "जांच हो रही है...",
        result: "जांच का परिणाम",
        urgency: "तात्कालिकता",
        recommendedAction: "अनुशंसित कार्रवाई",
        doctorReview: "डॉक्टर की समीक्षा",
        required: "आवश्यक",
        notRequired: "आवश्यक नहीं",
        resultNote: "यह परिणाम केवल तात्कालिकता की सिफारिश है, चिकित्सा निदान नहीं है।"
    },

    severity: {
        mild: "हल्का",
        moderate: "मध्यम",
        severe: "गंभीर"
    },

    symptoms: {
        fever: "बुखार",
        cough: "खांसी",
        cold: "जुकाम",
        headache: "सिरदर्द",
        bodyPain: "शरीर में दर्द",
        weakness: "कमज़ोरी",
        breathingDifficulty: "सांस लेने में कठिनाई",
        chestPain: "सीने में दर्द",
        vomiting: "उल्टी",
        diarrhea: "दस्त"
    },

    facility: {
        title: "नज़दीकी स्वास्थ्य सुविधाएं खोजें",
        subtitle: "अपने वर्तमान स्थान के आधार पर नज़दीकी सरकारी स्वास्थ्य सुविधाएं खोजें।",
        findButton: "नज़दीकी सुविधाएं खोजें",
        finding: "सुविधाएं खोजी जा रही हैं...",
        type: "प्रकार",
        address: "पता",
        distance: "दूरी",
        services: "सेवाएं",
        select: "इस सुविधा को चुनें",
        loginRequired: "कृपया पहले लॉगिन करें।",
        triageRequired: "कृपया पहले स्वास्थ्य जांच पूरी करें।",
        locationNotSupported: "आपके ब्राउज़र में स्थान सुविधा उपलब्ध नहीं है।",
        locationAccessDenied: "आपका स्थान प्राप्त नहीं किया जा सका। कृपया स्थान की अनुमति दें।",
        triageFetchFailed: "स्वास्थ्य जांच रिकॉर्ड प्राप्त नहीं किया जा सका।",
        facilityFetchFailed: "स्वास्थ्य सुविधाएं खोजी नहीं जा सकीं।",
        visitRequestFailed: "विज़िट अनुरोध भेजा नहीं जा सका।",
        visitRequestSuccess: "विज़िट अनुरोध सफलतापूर्वक भेज दिया गया!"
    },

    healthRecords: {
        title: "मेरे स्वास्थ्य रिकॉर्ड",
        loading: "स्वास्थ्य रिकॉर्ड लोड हो रहे हैं...",
        noRecords: "कोई स्वास्थ्य रिकॉर्ड नहीं मिला।",
        healthRecord: "स्वास्थ्य रिकॉर्ड",
        date: "तारीख",
        symptomsTriage: "लक्षण और जांच",
        symptoms: "लक्षण",
        duration: "अवधि",
        severity: "गंभीरता",
        urgency: "तात्कालिकता",
        recommendedAction: "अनुशंसित कार्रवाई",
        phcVitals: "PHC के महत्वपूर्ण माप",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सीजन स्तर",
        pulseRate: "नाड़ी दर",
        bloodPressure: "रक्तचाप",
        phcNotes: "PHC नोट्स",
        noNotes: "कोई नोट्स नहीं",
        vitalsNotRecorded: "PHC के महत्वपूर्ण माप अभी तक दर्ज नहीं किए गए हैं।",
        healthcareFacility: "स्वास्थ्य सुविधा",
        name: "नाम",
        type: "प्रकार",
        village: "गांव",
        district: "जिला",
        visitStatus: "विज़िट की स्थिति",
        facilityNotSelected: "स्वास्थ्य सुविधा अभी तक नहीं चुनी गई है।",
        doctorConsultation: "डॉक्टर परामर्श",
        doctor: "डॉक्टर",
        assessment: "मूल्यांकन",
        decision: "निर्णय",
        prescription: "प्रिस्क्रिप्शन",
        referralReason: "रेफरल का कारण",
        doctorNotes: "डॉक्टर के नोट्स",
        consultationNotCompleted: "डॉक्टर का परामर्श अभी तक पूरा नहीं हुआ है।",
        fetchFailed: "स्वास्थ्य रिकॉर्ड प्राप्त नहीं किए जा सके।",

        values: {
            emergency: "आपातकालीन",
            urgent: "तात्कालिक",
            humanReview: "मानवीय समीक्षा",
            routine: "नियमित",
            emergencyHelp: "आपातकालीन सहायता लें",
            urgentPhc: "तुरंत PHC जाएं",
            phcVisit: "PHC जाएं",
            telemedicine: "टेली-कंसल्टेशन",
            doctorConsultation: "डॉक्टर से परामर्श",
            routineAction: "नियमित स्वास्थ्य सेवा"
        }
    },

    teleconsultation: {
        title: "टेली-कंसल्टेशन",
        myTitle: "मेरे टेली-कंसल्टेशन",
        loading: "आपके टेली-कंसल्टेशन लोड हो रहे हैं...",
        subtitle: "अपने निर्धारित ऑनलाइन डॉक्टर परामर्श देखें।",
        noConsultations: "कोई टेली-कंसल्टेशन नहीं",
        noConsultationsMessage: "वर्तमान में आपका कोई निर्धारित टेली-कंसल्टेशन नहीं है।",
        doctor: "डॉक्टर",
        doctorFallback: "डॉक्टर",
        dateTime: "तारीख और समय",
        status: "स्थिति",
        visitStatus: "विज़िट की स्थिति",
        join: "परामर्श में शामिल हों",
        completedMessage: "यह टेली-कंसल्टेशन पूरा हो चुका है।",
        cancelledMessage: "यह टेली-कंसल्टेशन रद्द कर दिया गया है।",
        fetchFailed: "टेली-कंसल्टेशन प्राप्त नहीं किए जा सके।",

        values: {
            scheduled: "निर्धारित",
            ongoing: "जारी है",
            completed: "पूरा हुआ",
            cancelled: "रद्द किया गया"
        },

        visitStatuses: {
            pending: "लंबित",
            accepted: "स्वीकृत",
            rejected: "अस्वीकृत",
            completed: "पूरा हुआ",
            cancelled: "रद्द किया गया"
        }
    },

    messages: {
        selectSymptom: "कृपया कम से कम एक लक्षण चुनें।",
        selectSeverity: "कृपया अपने लक्षणों की गंभीरता चुनें।",
        loginRequired: "स्वास्थ्य जांच का उपयोग करने के लिए कृपया पहले लॉगिन करें।",
        requestFailed: "जांच अनुरोध विफल हुआ।"
    },

    governmentSchemes: {
        title: "सरकारी योजना सहायता",
        subtitle: "आपके लिए प्रासंगिक हो सकने वाली सरकारी स्वास्थ्य योजनाओं को खोजने के लिए अपनी मूलभूत जानकारी भरें।",
        age: "आयु",
        agePlaceholder: "अपनी आयु दर्ज करें",
        gender: "लिंग",
        selectGender: "लिंग चुनें",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        pregnancyQuestion: "क्या आप गर्भवती हैं?",
        no: "नहीं",
        yes: "हाँ",
        state: "राज्य",
        maharashtra: "महाराष्ट्र",
        otherState: "अन्य",
        loginRequired: "कृपया पहले लॉगिन करें।",
        ageGenderRequired: "कृपया आयु दर्ज करें और लिंग चुनें।",
        requestFailed: "सरकारी योजनाएं खोजी नहीं जा सकीं।",
        finding: "योजनाएं खोजी जा रही हैं...",
        findButton: "प्रासंगिक योजनाएं खोजें",
        relevantSchemes: "संभावित रूप से प्रासंगिक योजनाएं",
        noSchemes: "दी गई जानकारी के आधार पर कोई संभावित रूप से प्रासंगिक योजना नहीं मिली।",
        benefits: "लाभ",
        eligibility: "पात्रता की जानकारी",
        howToApply: "आवेदन कैसे करें",
        officialWebsite: "आधिकारिक वेबसाइट पर जाएं"
    },

    doctorDashboard: {
        title: "डॉक्टर डैशबोर्ड",
        subtitle: "PHC से संदर्भित मरीजों की समीक्षा करें और डॉक्टर की परामर्श सेवाओं को प्रबंधित करें।",

        loginRequired: "कृपया पहले लॉगिन करें.",

        fetchPatientsFailed: "मरीजों की जानकारी प्राप्त नहीं की जा सकी।",
        fetchFacilitiesFailed: "स्वास्थ्य सुविधाओं की जानकारी प्राप्त नहीं की जा सकी।",
        fetchTeleconsultationsFailed: "टेली-कंसल्टेशन की जानकारी प्राप्त नहीं की जा सकी।",
        fetchFollowUpsFailed: "फॉलो-अप की जानकारी प्राप्त नहीं की जा सकी।",

        selectPatient: "कृपया मरीज चुनें।",
        followUpDateRequired: "कृपया फॉलो-अप की तारीख और समय चुनें।",
        followUpReasonRequired: "कृपया फॉलो-अप का कारण दर्ज करें।",
        assessmentRequired: "कृपया डॉक्टर का मूल्यांकन दर्ज करें।",
        prescriptionRequired: "कृपया प्रिस्क्रिप्शन दर्ज करें।",
        referralReasonRequired: "कृपया रेफरल का कारण दर्ज करें।",
        referralFacilityRequired: "कृपया रेफरल सुविधा चुनें।",

        createFollowUpFailed: "फॉलो-अप बनाया नहीं जा सका।",
        updateFollowUpFailed: "फॉलो-अप की स्थिति अपडेट नहीं की जा सकी।",
        updateConsultationFailed: "परामर्श की स्थिति अपडेट नहीं की जा सकी।",
        saveConsultationFailed: "परामर्श सहेजा नहीं जा सका।",
        referralCreationFailed: "परामर्श सहेजा गया, लेकिन रेफरल बनाया नहीं जा सका।",

        followUpCreated: "फॉलो-अप सफलतापूर्वक बनाया गया!",
        consultationReferralSaved: "परामर्श और रेफरल सफलतापूर्वक सहेजे गए!",
        consultationSaved: "परामर्श सफलतापूर्वक सहेजा गया।",

        myTeleconsultations: "मेरे टेली-कंसल्टेशन",
        teleconsultationDescription: "निर्धारित ऑनलाइन डॉक्टर परामर्श देखें और प्रबंधित करें।",
        loadingTeleconsultations: "टेली-कंसल्टेशन लोड हो रहे हैं...",
        viewTeleconsultations: "टेली-कंसल्टेशन देखें",
        noTeleconsultations: "कोई टेली-कंसल्टेशन उपलब्ध नहीं है।",

        patientLabel: "मरीज",
        email: "ईमेल",
        dateTime: "तारीख और समय",
        visitStatus: "भेंट की स्थिति",
        consultationStatus: "परामर्श की स्थिति",

        startConsultation: "परामर्श शुरू करें",
        joinConsultation: "परामर्श में शामिल हों",
        completeConsultation: "परामर्श पूरा करें",
        consultationCompleted: "यह परामर्श पूरा हो चुका है।",
        consultationCancelled: "यह परामर्श रद्द कर दिया गया है।",

        myFollowUps: "मेरे फॉलो-अप",
        followUpDescription: "मरीजों की फॉलो-अप अपॉइंटमेंट देखें और प्रबंधित करें।",
        loadingFollowUps: "फॉलो-अप लोड हो रहे हैं...",
        viewFollowUps: "फॉलो-अप देखें",

        createFollowUp: "फॉलो-अप बनाएं",
        openPatientForFollowUp: "इस मरीज के लिए फॉलो-अप बनाने हेतु नीचे मरीज का परामर्श खोलें।",
        followUpDateTime: "फॉलो-अप की तारीख और समय",
        followUpReason: "फॉलो-अप का कारण",
        followUpReasonPlaceholder: "फॉलो-अप का कारण दर्ज करें...",
        followUpNotes: "फॉलो-अप की टिप्पणियां",
        followUpNotesPlaceholder: "अतिरिक्त फॉलो-अप निर्देश दर्ज करें...",
        creatingFollowUp: "फॉलो-अप बनाया जा रहा है...",

        noFollowUps: "कोई फॉलो-अप उपलब्ध नहीं है।",
        followUpDate: "फॉलो-अप की तारीख",
        reason: "कारण",
        notes: "टिप्पणियां",
        status: "स्थिति",
        noNotes: "कोई टिप्पणी नहीं",

        followUpUpcoming: "यह फॉलो-अप आगामी है।",
        markCompleted: "पूर्ण के रूप में चिह्नित करें",
        cancelFollowUp: "फॉलो-अप रद्द करें",
        followUpCompleted: "यह फॉलो-अप पूरा हो चुका है।",
        followUpCancelled: "यह फॉलो-अप रद्द कर दिया गया है।",

        loadingPatients: "मरीज लोड हो रहे हैं...",
        viewPatients: "मरीज देखें",
        noPatientsWaiting: "वर्तमान में डॉक्टर की समीक्षा के लिए कोई मरीज प्रतीक्षा नहीं कर रहा है।",
        patientsForReview: "समीक्षा के लिए मरीज",

        healthcareFacility: "स्वास्थ्य सुविधा",
        triageInformation: "ट्रायाज जानकारी",
        symptoms: "लक्षण",
        duration: "अवधि",
        severity: "गंभीरता",
        urgency: "तात्कालिकता",
        recommendedAction: "अनुशंसित कार्रवाई",

        phcRecordedVitals: "PHC द्वारा दर्ज किए गए महत्वपूर्ण संकेत",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सीजन स्तर",
        pulseRate: "नाड़ी दर",
        bloodPressure: "रक्तचाप",
        phcNotes: "PHC टिप्पणियां",

        reviewPatient: "मरीज की समीक्षा करें",
        backToPatients: "← मरीजों पर वापस जाएं",

        doctorConsultation: "डॉक्टर परामर्श",
        patientInformation: "मरीज की जानकारी",
        phcVitals: "PHC महत्वपूर्ण संकेत",
        oxygen: "ऑक्सीजन",
        pulse: "नाड़ी",

        doctorAssessment: "डॉक्टर का मूल्यांकन",
        assessmentPlaceholder: "अपना चिकित्सीय मूल्यांकन दर्ज करें...",

        consultationDecision: "परामर्श का निर्णय",
        treatment: "उपचार",
        referral: "रेफरल",

        prescription: "प्रिस्क्रिप्शन",
        prescriptionPlaceholder: "प्रिस्क्रिप्शन की जानकारी दर्ज करें...",

        referralFacility: "रेफरल सुविधा",
        loadingFacilities: "सुविधाएं लोड हो रही हैं...",
        noReferralFacilities: "कोई सक्रिय रेफरल सुविधा उपलब्ध नहीं है।",
        selectReferralFacility: "रेफरल सुविधा चुनें",

        referralReason: "रेफरल का कारण",
        referralReasonPlaceholder: "बताएं कि मरीज को रेफरल की आवश्यकता क्यों है...",

        doctorNotes: "डॉक्टर की टिप्पणियां",
        doctorNotesPlaceholder: "अतिरिक्त टिप्पणियां दर्ज करें...",

        savingConsultation: "परामर्श सहेजा जा रहा है...",
        saveConsultation: "परामर्श सहेजें",

        unknown: "अज्ञात",
        notAvailable: "उपलब्ध नहीं"
    },

    phcDashboard: {
        title: "PHC डैशबोर्ड",
        subtitle: "मरीजों के विज़िट अनुरोध प्रबंधित करें और ट्रायाज जानकारी की समीक्षा करें।",

        loginRequired: "कृपया पहले लॉगिन करें।",
        fetchFacilityFailed: "स्वास्थ्य सुविधा की जानकारी प्राप्त नहीं की जा सकी।",
        noFacilityFound: "कोई स्वास्थ्य सुविधा नहीं मिली।",
        facilityNotFound: "स्वास्थ्य सुविधा नहीं मिली।",
        fetchPendingFailed: "लंबित अनुरोध प्राप्त नहीं किए जा सके।",
        fetchAcceptedFailed: "स्वीकृत मरीजों की जानकारी प्राप्त नहीं की जा सकी।",
        acceptRequestFailed: "मरीज का अनुरोध स्वीकार नहीं किया जा सका।",
        requestAccepted: "मरीज का अनुरोध सफलतापूर्वक स्वीकार किया गया!",
        triageRecordNotFound: "ट्रायाज रिकॉर्ड नहीं मिला।",
        vitalsRequired: "कृपया तापमान, ऑक्सीजन स्तर और नाड़ी दर दर्ज करें।",
        recordVitalsFailed: "महत्वपूर्ण माप दर्ज नहीं किए जा सके।",
        vitalsRecorded: "मरीज के महत्वपूर्ण माप सफलतापूर्वक दर्ज किए गए!",
        fetchEmergencyFailed: "आपातकालीन अनुरोध प्राप्त नहीं किए जा सके।",
        updateEmergencyFailed: "आपातकालीन स्थिति अपडेट नहीं की जा सकी।",
        emergencyStatusUpdated: "आपातकालीन स्थिति {{status}} पर अपडेट की गई।",

        loadingRequests: "अनुरोध लोड हो रहे हैं...",
        viewPendingRequests: "लंबित अनुरोध देखें",
        loadingPatients: "मरीज लोड हो रहे हैं...",
        viewAcceptedPatients: "स्वीकृत मरीज देखें",
        loadingEmergencyRequests: "आपातकालीन अनुरोध लोड हो रहे हैं...",
        viewEmergencyRequests: "आपातकालीन अनुरोध देखें",

        pendingPatientRequests: "मरीजों के लंबित अनुरोध",
        patientLabel: "मरीज",
        email: "ईमेल",
        symptoms: "लक्षण",
        duration: "अवधि",
        severity: "गंभीरता",
        urgency: "तात्कालिकता",
        recommendedAction: "अनुशंसित कार्रवाई",
        status: "स्थिति",
        accepting: "स्वीकार किया जा रहा है...",
        acceptPatient: "मरीज को स्वीकार करें",
        unknown: "अज्ञात",
        notAvailable: "उपलब्ध नहीं",

        acceptedPatients: "स्वीकृत मरीज",
        vitalsRecordedHeading: "महत्वपूर्ण माप दर्ज किए गए",
        temperature: "तापमान",
        oxygenLevel: "ऑक्सीजन स्तर",
        pulseRate: "नाड़ी दर",
        bloodPressure: "रक्तचाप",
        notProvided: "जानकारी नहीं दी गई",
        notes: "टिप्पणियां",
        noNotes: "कोई टिप्पणी नहीं",

        recordPatientVitals: "मरीज के महत्वपूर्ण माप दर्ज करें",
        temperaturePlaceholder: "उदा. 98.6",
        oxygenLevelWithUnit: "ऑक्सीजन स्तर (SpO₂)",
        oxygenPlaceholder: "उदा. 97",
        pulsePlaceholder: "उदा. 80",
        bloodPressurePlaceholder: "उदा. 120/80",
        notesPlaceholder: "अतिरिक्त निरीक्षण दर्ज करें",
        savingVitals: "महत्वपूर्ण माप सहेजे जा रहे हैं...",
        saveVitals: "महत्वपूर्ण माप सहेजें",

        emergencyRequests: "आपातकालीन अनुरोध",
        emergencyReason: "आपातकालीन स्थिति का कारण",
        facility: "स्वास्थ्य सुविधा",
        notAssigned: "आवंटित नहीं",
        ambulance: "एम्बुलेंस",
        ambulanceRequested: "अनुरोध किया गया",
        notRequested: "अनुरोध नहीं किया गया",
        emergencyGuidance: "आपातकालीन मार्गदर्शन",
        updating: "अपडेट हो रहा है...",
        startEmergencyResponse: "आपातकालीन सहायता शुरू करें",
        markCompleted: "पूर्ण के रूप में चिह्नित करें",
        noPendingEmergency: "कोई लंबित आपातकालीन अनुरोध नहीं है।"
    },

    emergency: {
        title: "आपातकालीन सहायता",
        warning: "यदि आप गंभीर चिकित्सा आपातकालीन स्थिति का सामना कर रहे हैं, तो तुरंत चिकित्सा सहायता लें। आपातकालीन उपचार में देरी न करें।",
        whatHappening: "क्या हो रहा है?",
        reasonPlaceholder: "आपातकालीन स्थिति का संक्षेप में वर्णन करें...",
        ambulanceAssistance: "आपातकालीन एम्बुलेंस सहायता का अनुरोध करें",
        loginRequired: "कृपया पहले लॉगिन करें।",
        reasonRequired: "सहायता का अनुरोध करने से पहले कृपया आपातकालीन स्थिति का वर्णन करें।",
        requestFailed: "आपातकालीन अनुरोध बनाया नहीं जा सका।",
        requesting: "आपातकालीन सहायता का अनुरोध किया जा रहा है...",
        requestButton: "आपातकालीन सहायता का अनुरोध करें",
        requestCreated: "आपातकालीन अनुरोध बनाया गया",
        status: "स्थिति",
        reason: "कारण",
        nearestFacility: "निकटतम स्वास्थ्य सुविधा",
        phone: "फोन",
        ambulanceRequest: "एम्बुलेंस अनुरोध:",
        requested: "अनुरोध किया गया",
        guidance: "आपातकालीन मार्गदर्शन"
    }
};

export default hi;


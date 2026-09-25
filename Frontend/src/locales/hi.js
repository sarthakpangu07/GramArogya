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

        subtitle:
            "आपको कितनी जल्दी स्वास्थ्य सेवा की आवश्यकता हो सकती है, यह समझने के लिए अपने लक्षणों के बारे में बताएं।",

        safetyNote:
            "यह चिकित्सा निदान नहीं है। यदि आप गंभीर आपातकालीन स्थिति में हैं, तो तुरंत चिकित्सा सहायता लें।",

        symptomsQuestion:
            "आपको कौन से लक्षण हो रहे हैं?",

        durationQuestion:
            "आपको ये लक्षण कितने समय से हैं?",

        durationPlaceholder:
            "उदाहरण: 2 दिन",

        severityQuestion:
            "आपको अपने लक्षण कितने गंभीर लगते हैं?",

        existingConditions:
            "पहले से मौजूद चिकित्सीय स्थितियां",

        conditionsPlaceholder:
            "उदाहरण: मधुमेह, अस्थमा (वैकल्पिक)",

        conditionsHelp:
            "एक से अधिक स्थितियों को अल्पविराम से अलग करें।",

        checkUrgency:
            "मेरी तात्कालिकता जांचें",

        checking:
            "जांच हो रही है...",

        result:
            "जांच का परिणाम",

        urgency:
            "तात्कालिकता",

        recommendedAction:
            "अनुशंसित कार्रवाई",

        doctorReview:
            "डॉक्टर की समीक्षा",

        required:
            "आवश्यक",

        notRequired:
            "आवश्यक नहीं",

        resultNote:
            "यह परिणाम केवल तात्कालिकता की सिफारिश है, चिकित्सा निदान नहीं है।"
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
        title:
            "नज़दीकी स्वास्थ्य सुविधाएं खोजें",

        subtitle:
            "अपने वर्तमान स्थान के आधार पर नज़दीकी सरकारी स्वास्थ्य सुविधाएं खोजें।",

        findButton:
            "नज़दीकी सुविधाएं खोजें",

        finding:
            "सुविधाएं खोजी जा रही हैं...",

        type:
            "प्रकार",

        address:
            "पता",

        distance:
            "दूरी",

        services:
            "सेवाएं",

        select:
            "इस सुविधा को चुनें",

        loginRequired:
            "कृपया पहले लॉगिन करें।",

        triageRequired:
            "कृपया पहले स्वास्थ्य जांच पूरी करें।",

        locationNotSupported:
            "आपके ब्राउज़र में स्थान सुविधा उपलब्ध नहीं है।",

        locationAccessDenied:
            "आपका स्थान प्राप्त नहीं किया जा सका। कृपया स्थान की अनुमति दें।",

        triageFetchFailed:
            "स्वास्थ्य जांच रिकॉर्ड प्राप्त नहीं किया जा सका।",

        facilityFetchFailed:
            "स्वास्थ्य सुविधाएं खोजी नहीं जा सकीं।",

        visitRequestFailed:
            "विज़िट अनुरोध भेजा नहीं जा सका।",

        visitRequestSuccess:
            "विज़िट अनुरोध सफलतापूर्वक भेज दिया गया!"
    },

    healthRecords: {
        title:
            "मेरे स्वास्थ्य रिकॉर्ड",

        loading:
            "स्वास्थ्य रिकॉर्ड लोड हो रहे हैं...",

        noRecords:
            "कोई स्वास्थ्य रिकॉर्ड नहीं मिला।",

        healthRecord:
            "स्वास्थ्य रिकॉर्ड",

        date:
            "तारीख",

        symptomsTriage:
            "लक्षण और जांच",

        symptoms:
            "लक्षण",

        duration:
            "अवधि",

        severity:
            "गंभीरता",

        urgency:
            "तात्कालिकता",

        recommendedAction:
            "अनुशंसित कार्रवाई",

        phcVitals:
            "PHC के महत्वपूर्ण माप",

        temperature:
            "तापमान",

        oxygenLevel:
            "ऑक्सीजन स्तर",

        pulseRate:
            "नाड़ी दर",

        bloodPressure:
            "रक्तचाप",

        phcNotes:
            "PHC नोट्स",

        noNotes:
            "कोई नोट्स नहीं",

        vitalsNotRecorded:
            "PHC के महत्वपूर्ण माप अभी तक दर्ज नहीं किए गए हैं।",

        healthcareFacility:
            "स्वास्थ्य सुविधा",

        name:
            "नाम",

        type:
            "प्रकार",

        village:
            "गांव",

        district:
            "जिला",

        visitStatus:
            "विज़िट की स्थिति",

        facilityNotSelected:
            "स्वास्थ्य सुविधा अभी तक नहीं चुनी गई है।",

        doctorConsultation:
            "डॉक्टर परामर्श",

        doctor:
            "डॉक्टर",

        assessment:
            "मूल्यांकन",

        decision:
            "निर्णय",

        prescription:
            "प्रिस्क्रिप्शन",

        referralReason:
            "रेफरल का कारण",

        doctorNotes:
            "डॉक्टर के नोट्स",

        consultationNotCompleted:
            "डॉक्टर का परामर्श अभी तक पूरा नहीं हुआ है।",

        fetchFailed:
            "स्वास्थ्य रिकॉर्ड प्राप्त नहीं किए जा सके।",

        values: {
            emergency:
                "आपातकालीन",

            urgent:
                "तात्कालिक",

            humanReview:
                "मानवीय समीक्षा",

            routine:
                "नियमित",

            emergencyHelp:
                "आपातकालीन सहायता लें",

            urgentPhc:
                "तुरंत PHC जाएं",

            phcVisit:
                "PHC जाएं",

            telemedicine:
                "टेली-कंसल्टेशन",

            doctorConsultation:
                "डॉक्टर से परामर्श",

            routineAction:
                "नियमित स्वास्थ्य सेवा"
        }
    },

    teleconsultation: {
        title:
            "टेली-कंसल्टेशन",

        myTitle:
            "मेरे टेली-कंसल्टेशन",

        loading:
            "आपके टेली-कंसल्टेशन लोड हो रहे हैं...",

        subtitle:
            "अपने निर्धारित ऑनलाइन डॉक्टर परामर्श देखें।",

        noConsultations:
            "कोई टेली-कंसल्टेशन नहीं",

        noConsultationsMessage:
            "वर्तमान में आपका कोई निर्धारित टेली-कंसल्टेशन नहीं है।",

        doctor:
            "डॉक्टर",

        doctorFallback:
            "डॉक्टर",

        dateTime:
            "तारीख और समय",

        status:
            "स्थिति",

        visitStatus:
            "विज़िट की स्थिति",

        join:
            "परामर्श में शामिल हों",

        completedMessage:
            "यह टेली-कंसल्टेशन पूरा हो चुका है।",

        cancelledMessage:
            "यह टेली-कंसल्टेशन रद्द कर दिया गया है।",

        fetchFailed:
            "टेली-कंसल्टेशन प्राप्त नहीं किए जा सके।",

        values: {
            scheduled:
                "निर्धारित",

            ongoing:
                "जारी है",

            completed:
                "पूरा हुआ",

            cancelled:
                "रद्द किया गया"
        },

        visitStatuses: {
            pending:
                "लंबित",

            accepted:
                "स्वीकृत",

            rejected:
                "अस्वीकृत",

            completed:
                "पूरा हुआ",

            cancelled:
                "रद्द किया गया"
        }
    },

    messages: {
        selectSymptom:
            "कृपया कम से कम एक लक्षण चुनें।",

        selectSeverity:
            "कृपया अपने लक्षणों की गंभीरता चुनें।",

        loginRequired:
            "स्वास्थ्य जांच का उपयोग करने के लिए कृपया पहले लॉगिन करें।",

        requestFailed:
            "जांच अनुरोध विफल हुआ।"
    },

    emergency: {
        title:
            "आपातकालीन सहायता",

        warning:
            "यदि आप गंभीर चिकित्सा आपातकालीन स्थिति का सामना कर रहे हैं, तो तुरंत चिकित्सा सहायता लें। आपातकालीन उपचार में देरी न करें।",

        whatHappening:
            "क्या हो रहा है?",

        reasonPlaceholder:
            "आपातकालीन स्थिति का संक्षेप में वर्णन करें...",

        ambulanceAssistance:
            "आपातकालीन एम्बुलेंस सहायता का अनुरोध करें",

        loginRequired:
            "कृपया पहले लॉगिन करें।",

        reasonRequired:
            "सहायता का अनुरोध करने से पहले कृपया आपातकालीन स्थिति का वर्णन करें।",

        requestFailed:
            "आपातकालीन अनुरोध बनाया नहीं जा सका।",

        requesting:
            "आपातकालीन सहायता का अनुरोध किया जा रहा है...",

        requestButton:
            "आपातकालीन सहायता का अनुरोध करें",

        requestCreated:
            "आपातकालीन अनुरोध बनाया गया",

        status:
            "स्थिति",

        reason:
            "कारण",

        nearestFacility:
            "निकटतम स्वास्थ्य सुविधा",

        phone:
            "फोन",

        ambulanceRequest:
            "एम्बुलेंस अनुरोध:",

        requested:
            "अनुरोध किया गया",

        guidance:
            "आपातकालीन मार्गदर्शन"
    }
};

export default hi;
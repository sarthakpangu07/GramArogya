const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const GovernmentScheme = require("./models/GovernmentScheme");

dotenv.config();

const schemes = [
    {
        name: "Ayushman Bharat - PM-JAY",

        description:
            "Government health insurance scheme providing cashless hospitalization benefits to eligible families.",

        benefits: [
            "Hospitalization coverage",
            "Cashless treatment at empanelled hospitals",
            "Coverage for eligible secondary and tertiary care"
        ],

        eligibility: [
            "Eligibility is based on government-defined beneficiary criteria.",
            "Beneficiary status should be verified through the official PM-JAY system."
        ],

        applicationProcess: [
            "Check beneficiary eligibility through the official PM-JAY portal.",
            "Visit an empanelled hospital or authorized centre.",
            "Complete beneficiary verification."
        ],

        targetGroups: [
            "Eligible low-income and vulnerable families"
        ],

        state: "All India",

        officialWebsite: "https://pmjay.gov.in",

        matchingRules: {
            gender: [],
            pregnancyRequired: false,
            ageMin: null,
            ageMax: null,
            states: []
        },

        isActive: true
    },

    {
        name: "Janani Suraksha Yojana (JSY)",

        description:
            "Government scheme supporting institutional delivery and maternal health services for eligible pregnant women.",

        benefits: [
            "Support for institutional delivery",
            "Promotes safe motherhood",
            "Encourages access to maternal healthcare services"
        ],

        eligibility: [
            "Eligibility depends on government-defined criteria.",
            "Eligibility may vary based on state and beneficiary category."
        ],

        applicationProcess: [
            "Contact the nearest government health facility.",
            "Provide the required beneficiary documents.",
            "Complete registration through the health facility."
        ],

        targetGroups: [
            "Pregnant women",
            "Eligible women in notified categories"
        ],

        state: "All India",

        officialWebsite:
            "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",

        matchingRules: {
            gender: ["female"],
            pregnancyRequired: true,
            ageMin: null,
            ageMax: null,
            states: []
        },

        isActive: true
    }
];

const seedSchemes = async () => {
    try {
        await connectDB();

        await GovernmentScheme.deleteMany({});

        await GovernmentScheme.insertMany(schemes);

        console.log("Government schemes seeded successfully.");

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {
        console.error(
            "Failed to seed government schemes:",
            error
        );

        process.exit(1);
    }
};

seedSchemes();
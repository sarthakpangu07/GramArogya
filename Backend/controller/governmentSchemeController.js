const GovernmentScheme = require("../models/GovernmentScheme");

// Get all active government schemes
const getGovernmentSchemes = async (req, res) => {
    try {
        const schemes = await GovernmentScheme.find({
            isActive: true
        }).sort({ name: 1 });

        res.status(200).json({
            message: "Government schemes fetched successfully.",
            schemes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch government schemes.",
            error: error.message
        });
    }
};


// Find potentially relevant schemes
const matchGovernmentSchemes = async (req, res) => {
    try {
        const {
            age,
            gender,
            isPregnant,
            state
        } = req.body;

        if (
            age === undefined ||
            !gender ||
            isPregnant === undefined ||
            !state
        ) {
            return res.status(400).json({
                message:
                    "Age, gender, pregnancy status and state are required."
            });
        }

        const schemes = await GovernmentScheme.find({
            isActive: true
        });

        const matchedSchemes = [];

        schemes.forEach((scheme) => {

            const rules = scheme.matchingRules;

            let matches = true;

            // Gender check
            if (
                rules.gender.length > 0 &&
                !rules.gender.includes(gender.toLowerCase())
            ) {
                matches = false;
            }

            // Pregnancy check
            if (
                rules.pregnancyRequired === true &&
                isPregnant !== true
            ) {
                matches = false;
            }

            // Minimum age check
            if (
                rules.ageMin !== null &&
                age < rules.ageMin
            ) {
                matches = false;
            }

            // Maximum age check
            if (
                rules.ageMax !== null &&
                age > rules.ageMax
            ) {
                matches = false;
            }

            // State check
            if (
                rules.states.length > 0 &&
                !rules.states
                    .map((item) => item.toLowerCase())
                    .includes(state.toLowerCase())
            ) {
                matches = false;
            }

            if (matches) {
                matchedSchemes.push({
                    schemeId: scheme._id,
                    name: scheme.name,
                    description: scheme.description,
                    benefits: scheme.benefits,
                    eligibility: scheme.eligibility,
                    applicationProcess:
                        scheme.applicationProcess,
                    officialWebsite:
                        scheme.officialWebsite,
                    message:
                        "This scheme may be relevant to you. Please verify your final eligibility through the official government system."
                });
            }
        });

        res.status(200).json({
            message: "Potentially relevant schemes found.",
            schemes: matchedSchemes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to match government schemes.",
            error: error.message
        });
    }
};


module.exports = {
    getGovernmentSchemes,
    matchGovernmentSchemes
};
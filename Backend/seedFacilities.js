const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const connectDB = require("./config/db");
const Facility = require("./models/Facility");

const facilities = [
    {
        name: "Test PHC A",
        facilityType: "PHC",
        address: "Test Village A",
        village: "Test Village A",
        district: "Pune",
        state: "Maharashtra",
        phone: "0000000000",
        services: [
            "General Consultation",
            "Maternal Care",
            "First Aid"
        ],
        latitude: 18.5204,
        longitude: 73.8567,
        isActive: true
    },
    {
        name: "Test PHC B",
        facilityType: "PHC",
        address: "Test Village B",
        village: "Test Village B",
        district: "Pune",
        state: "Maharashtra",
        phone: "0000000000",
        services: [
            "General Consultation",
            "Child Care",
            "First Aid"
        ],
        latitude: 18.5304,
        longitude: 73.8667,
        isActive: true
    },
    {
        name: "Test Government Hospital",
        facilityType: "Government Hospital",
        address: "Test Area C",
        village: "Test Area C",
        district: "Pune",
        state: "Maharashtra",
        phone: "0000000000",
        services: [
            "General Consultation",
            "Emergency Care",
            "Specialist Consultation"
        ],
        latitude: 18.5504,
        longitude: 73.8867,
        isActive: true
    }
];

const seedFacilities = async () => {
    try {
        await connectDB();

        for (const facility of facilities) {
            await Facility.findOneAndUpdate(
                { name: facility.name },
                facility,
                {
                    upsert: true,
                    new: true
                }
            );
        }

        console.log("Test facilities added successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed facilities:", error);
        process.exit(1);
    }
};

seedFacilities();

const dns = require("dns");

// Use the same DNS fix as server.js for MongoDB Atlas.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const createFirstAdmin = async () => {
    const {
        MONGO_URI,
        BOOTSTRAP_ADMIN_NAME,
        BOOTSTRAP_ADMIN_EMAIL,
        BOOTSTRAP_ADMIN_PASSWORD
    } = process.env;

    if (
        !MONGO_URI ||
        !BOOTSTRAP_ADMIN_NAME ||
        !BOOTSTRAP_ADMIN_EMAIL ||
        !BOOTSTRAP_ADMIN_PASSWORD
    ) {
        throw new Error(
            "Database URI and admin details are required."
        );
    }

    if (BOOTSTRAP_ADMIN_PASSWORD.length < 12) {
        throw new Error(
            "Use an admin password of at least 12 characters."
        );
    }

    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    const existingAdmin = await User.findOne({
        role: "admin"
    }).select("email");

    if (existingAdmin) {
        console.log(
            "An admin already exists. No account was created."
        );
        return;
    }

    const email = BOOTSTRAP_ADMIN_EMAIL.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error(
            "This email already belongs to another account. Use a different email."
        );
    }

    const hashedPassword = await bcrypt.hash(
        BOOTSTRAP_ADMIN_PASSWORD,
        12
    );

    await User.create({
        name: BOOTSTRAP_ADMIN_NAME.trim(),
        email,
        password: hashedPassword,
        role: "admin"
    });

    console.log("First admin account created successfully.");
    console.log(`Admin email: ${email}`);
};

createFirstAdmin()
    .catch((error) => {
        console.error("Admin setup failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

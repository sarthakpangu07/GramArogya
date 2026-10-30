const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const triageRoutes = require("./routes/triageRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const visitRoutes = require("./routes/visitRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const referralRoutes = require("./routes/referralRoutes");
const teleconsultationRoutes = require("./routes/teleconsultationRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const governmentSchemeRoutes = require("./routes/governmentSchemeRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/referrals", referralRoutes);

app.use(
    "/api/teleconsultations",
    teleconsultationRoutes
);

app.use("/api/follow-ups", followUpRoutes);

app.use(
    "/api/government-schemes",
    governmentSchemeRoutes
);

app.use("/api/emergencies", emergencyRoutes);

// Admin dashboard routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "GramArogya is running"
    });
});

module.exports = app;
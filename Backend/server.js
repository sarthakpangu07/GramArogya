const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

console.log("RESEND_API_KEY loaded:", !!process.env.RESEND_API_KEY);
console.log("RESEND_FROM_EMAIL loaded:", !!process.env.RESEND_FROM_EMAIL);

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`GramArogya server running on port ${PORT}`);
});
require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    try {
        console.log("Testing Resend API...");

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: "sarthakpangu07@gmail.com",
            subject: "GramArogya Resend Test",
            text: "This is a test email from GramArogya."
        });

        if (error) {
            console.error("RESEND ERROR:", error);
            return;
        }

        console.log("EMAIL ACCEPTED:", data);
    } catch (err) {
        console.error("TEST FAILED:", err.message);
    }
}

testEmail();
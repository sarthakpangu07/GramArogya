
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetOtp = async (email, otp) => {
    return transporter.sendMail({
        from: `"GramArogya" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "GramArogya Password Reset OTP",
        text: `Your GramArogya password reset OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                <h2 style="color: #176b55;">GramArogya Password Reset</h2>
                <p>Use the following OTP to reset your password:</p>
                <h1 style="letter-spacing: 6px;">${otp}</h1>
                <p>This OTP expires in <strong>5 minutes</strong>.</p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `
    });
};

module.exports = { sendResetOtp };

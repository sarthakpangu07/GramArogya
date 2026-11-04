
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// const sendResetOtp = async (email, otp) => {
//     const { data, error } = await resend.emails.send({
//         from: process.env.RESEND_FROM_EMAIL || "GramArogya <onboarding@resend.dev>",
//         to: email,
//         subject: "GramArogya Password Reset OTP",

//         text: `Your GramArogya password reset OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,

//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
//                 <h2 style="color: #176b55;">GramArogya Password Reset</h2>
//                 <p>Use the following OTP to reset your password:</p>
//                 <h1 style="letter-spacing: 6px;">${otp}</h1>
//                 <p>This OTP expires in <strong>5 minutes</strong>.</p>
//                 <p>If you did not request this, you can ignore this email.</p>
//             </div>
//         `
//     });

//     if (error) {
//         console.error("Password reset email failed:", error);
//         throw new Error("Unable to send password reset email.");
//     }

//     return data;
// };

const sendResetOtp = async (email, otp) => {
    console.log("Attempting to send OTP through Resend...");

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "GramArogya <onboarding@resend.dev>",
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

    if (error) {
        console.error("Resend API error:", error);
        throw new Error(error.message || "Unable to send password reset email.");
    }

    console.log("Resend accepted email. ID:", data?.id);
    return data;
};

module.exports = { sendResetOtp };
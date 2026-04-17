const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_password'
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Animal Rescue" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });

        console.log("📧 Email sent");
    } catch (error) {
        console.error("❌ Email Error:", error.message);
    }
};

module.exports = { sendEmail };
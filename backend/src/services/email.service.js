const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password)
    },
});

const sendPasswordResetEmail = async (toEmail, resetLink) => {
    await transporter.sendMail({
        from: `"WildGuard Animal Rescue" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your Password — WildGuard',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#065f46;margin-bottom:8px;">Password Reset Request</h2>
                <p style="color:#6b7280;font-size:14px;">We received a request to reset your WildGuard password. Click the button below to proceed. This link expires in 1 hour.</p>
                <a href="${resetLink}" style="display:inline-block;margin-top:20px;background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">
                    Reset Password
                </a>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;">If you didn't request this, ignore this email. Your password won't change.</p>
            </div>
        `,
    });
};

module.exports = { sendPasswordResetEmail };
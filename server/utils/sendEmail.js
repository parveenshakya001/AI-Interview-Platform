const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"InterviewAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #6d28d9;">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to set a new password. This link expires in 15 minutes.</p>
        <a href="${resetLink}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"InterviewAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your Email - OTP Code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; text-align: center;">
        <h2 style="color: #6d28d9;">Verify Your Email</h2>
        <p>Use the code below to verify your account. It expires in 10 minutes.</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #f3f0ff; color: #6d28d9; padding: 16px; border-radius: 12px; margin: 20px 0;">
          ${otp}
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendResetEmail, sendOtpEmail };
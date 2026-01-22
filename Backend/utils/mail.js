const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "zulaikha.a@jitglobalinfosystems.com",
    pass: "SZ0K ESdi XzVN" // Changed from MAIL_PASS to MAIL_PASSWORD
  },
  tls: {
    // rejectUnauthorized: false // Only use this in development
    family: 4
  }
});

exports.sendUserCredentials = async (to, name, password) => {
  const mailOptions = {
    from: `"App Admin" <zulaikha.a@jitglobalinfosystems.com>`,
    to,
    subject: "Your Account Credentials",
    html: `
      <p>Hello <b>${name}</b>,</p>
      <p>Your account has been created.</p>
      <p><b>Temporary Password:</b> ${password}</p>
      <p>Please login and change your password immediately.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetOtp = async (to, name, otp) => {
  const mailOptions = {
    from: `"Password Reset" <zulaikha.a@jitglobalinfosystems.com>`,
    to,
    subject: "Password Reset OTP",
    html: `
      <p>Hello <b>${name}</b>,</p>
      <p>We received a request to reset your password. Use the following OTP to proceed:</p>
      <h2 style="color: #2563eb; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email or contact support.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

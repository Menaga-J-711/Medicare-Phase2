// backend/routes/otp.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
require("dotenv").config();

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, msg: "Email required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.create({ email, otp });

    // Brevo transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"MediCare Team" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Your MediCare OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ success: true, msg: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ success: false, msg: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, msg: "Missing fields" });

  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, msg: "Invalid or expired OTP" });
    }

    // Delete OTP once verified
    await Otp.deleteMany({ email });

    res.json({ success: true, msg: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;

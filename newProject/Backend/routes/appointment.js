const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const OtpVerification = require("../models/OtpVerification");
const nodemailer = require("nodemailer");

// create appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📩 Send OTP to registered email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const appointment = await Appointment.findOne({ email });
    if (!appointment) return res.status(404).json({ message: "No appointment found for this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpVerification.deleteMany({ email }); // clear old OTPs
    await new OtpVerification({ email, otp }).save();

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com", // 👈 replace with your Gmail
        pass: "your-app-password",   // 👈 use an App Password (not your login)
      },
    });

    await transporter.sendMail({
      from: '"MediCare Queue" <yourgmail@gmail.com>',
      to: email,
      subject: "Your Queue Access OTP",
      text: `Your OTP to join the MediCare Queue is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OtpVerification.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    await OtpVerification.deleteMany({ email }); // clean up
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error verifying OTP" });
  }
});

module.exports = router;

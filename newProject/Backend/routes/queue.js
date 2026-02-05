const express = require("express");
const Queue = require("../models/Queue");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Patient joins queue
router.post("/join", async (req, res) => {
  try {
    const { patientName, doctorId, hospitalId } = req.body;

    if (!patientName || !doctorId || !hospitalId) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const doctor = await Doctor.findOne({
      _id: doctorId,
      hospital: hospitalId,
      available: true
    });

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not available" });
    }

    const entry = await Queue.create({
      patientName,
      doctor: doctorId,
      hospital: hospitalId
    });

    // 🔥 Emit ONLY to hospital room
    req.app.get("io")
      .to(`hospital_${hospitalId}`)
      .emit("queueUpdated", { doctorId });

    res.status(201).json({ success: true, entry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Doctor fetches queue
router.get("/doctor/:doctorId", async (req, res) => {
  const queue = await Queue.find({
    doctor: req.params.doctorId,
    status: "waiting"
  }).sort("joinedAt");

  res.json(queue);
});

// Doctor marks consultation complete
router.post("/complete/:queueId", async (req, res) => {
  await Queue.findByIdAndUpdate(req.params.queueId, {
    status: "completed"
  });

  res.json({ success: true });
});

module.exports = router;

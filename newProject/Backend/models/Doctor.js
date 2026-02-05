const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },  // ✅ ADD THIS
  
  specialization: String,
  experience: Number,
  
  hospital: {
    type: String,  // ✅ CHANGE from ObjectId to String
    required: true
  },

  available: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["idle", "consulting"],
    default: "idle"
  },

  image: String
}, { timestamps: true, strict: false }); // ✅ ADD strict: false

module.exports = mongoose.model("Doctor", DoctorSchema);
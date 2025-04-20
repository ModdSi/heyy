const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  type: {
    type: String,
    enum: ["CHECK_IN", "CHECK_OUT"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: "Main Office",
  },
  verified: {
    type: Boolean,
    default: true,
  },
  verificationMethod: {
    type: String,
    enum: ["FACE", "MANUAL", "ADMIN_OVERRIDE"],
    default: "FACE",
  },
  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);

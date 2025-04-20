const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all attendance records
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, employeeId, type } = req.query;
    const query = {};

    // Add filters if provided
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (type) {
      query.type = type.toUpperCase();
    }

    const attendance = await Attendance.find(query)
      .populate("employeeId", "name employeeId department")
      .sort({ timestamp: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a specific employee
router.get("/employee/:employeeId", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { employeeId: req.params.employeeId };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query).sort({ timestamp: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create attendance record
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Get the latest attendance record for this employee
    const lastAttendance = await Attendance.findOne({
      employeeId: req.body.employeeId,
    }).sort({ timestamp: -1 });

    // Determine if this should be a check-in or check-out
    let type = "CHECK_IN";
    if (lastAttendance && lastAttendance.type === "CHECK_IN") {
      type = "CHECK_OUT";
    }

    const attendance = new Attendance({
      employeeId: req.body.employeeId,
      type: req.body.type || type,
      location: req.body.location,
      verificationMethod: req.body.verificationMethod || "FACE",
      notes: req.body.notes,
    });

    const newAttendance = await attendance.save();

    // Populate employee info
    await newAttendance.populate("employeeId", "name employeeId department");

    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance record
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get daily report
router.get("/reports/daily", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    // Set start and end of the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    }).populate("employeeId", "name employeeId department");

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

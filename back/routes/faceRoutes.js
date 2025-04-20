const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Register face data for an employee
router.post(
  "/register/:employeeId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { faceData } = req.body;

      if (!faceData || !Array.isArray(faceData)) {
        return res.status(400).json({ message: "Face data is required" });
      }

      const employee = await Employee.findById(req.params.employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Add new face data
      employee.faceData = faceData;
      employee.updatedAt = new Date();

      await employee.save();

      res.json({ message: "Face data registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Recognize face
router.post("/recognize", async (req, res) => {
  try {
    const { faceData } = req.body;

    if (!faceData) {
      return res.status(400).json({ message: "Face data is required" });
    }

    // In a real-world scenario, you would use a face recognition library
    // to compare the faceData with stored employee face data
    // This is a simplified simulation for demonstration purposes

    // Fetch all active employees with face data
    const employees = await Employee.find({
      active: true,
      faceData: { $exists: true, $ne: [] },
    });

    // For demo purposes, just return the first employee
    // In production, you would implement actual face recognition here
    if (employees.length > 0) {
      const recognizedEmployee = employees[0];

      // Return employee data without the face data
      const { _id, name, email, department, position, employeeId } =
        recognizedEmployee;

      res.json({
        recognized: true,
        employee: { _id, name, email, department, position, employeeId },
      });
    } else {
      res.json({
        recognized: false,
        message: "No matching employee found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Get all settings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const settings = await Settings.find(query);

    // Convert to key-value object grouped by category
    const settingsObject = {};
    settings.forEach((setting) => {
      if (!settingsObject[setting.category]) {
        settingsObject[setting.category] = {};
      }
      settingsObject[setting.category][setting.name] = setting.value;
    });

    res.json(settingsObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update setting
router.put("/:name", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { value } = req.body;

    // Update or create the setting
    const setting = await Settings.findOneAndUpdate(
      { name: req.params.name },
      {
        value,
        updatedAt: new Date(),
        updatedBy: req.user.id,
      },
      { new: true, upsert: true }
    );

    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Initialize default settings
router.post(
  "/initialize",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Define default settings
      const defaultSettings = [
        {
          name: "faceDetectionEnabled",
          value: true,
          category: "faceRecognition",
          description: "Enable face detection",
        },
        {
          name: "requireConfirmation",
          value: true,
          category: "faceRecognition",
          description: "Require confirmation on recognition",
        },
        {
          name: "confidenceThreshold",
          value: 75,
          category: "faceRecognition",
          description: "Recognition confidence threshold",
        },
        {
          name: "emailNotificationsEnabled",
          value: true,
          category: "notifications",
          description: "Enable email notifications",
        },
        {
          name: "dailyReportsEnabled",
          value: true,
          category: "notifications",
          description: "Enable daily attendance reports",
        },
        {
          name: "workHoursStart",
          value: "09:00",
          category: "workHours",
          description: "Work hours start time",
        },
        {
          name: "workHoursEnd",
          value: "17:00",
          category: "workHours",
          description: "Work hours end time",
        },
      ];

      // Insert settings that don't exist yet
      for (const setting of defaultSettings) {
        await Settings.findOneAndUpdate(
          { name: setting.name },
          {
            ...setting,
            updatedAt: new Date(),
            updatedBy: req.user.id,
          },
          { upsert: true }
        );
      }

      res.json({ message: "Default settings initialized" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

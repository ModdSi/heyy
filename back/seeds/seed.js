const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Settings = require("../models/Settings");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Settings.deleteMany({});

    console.log("Data cleared");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created");

    // Create sample employees
    const employees = [
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        department: "Marketing",
        position: "Marketing Manager",
        employeeId: "EMP001",
        faceData: [], // Empty array for demo purposes
      },
      {
        name: "John Doe",
        email: "john.doe@example.com",
        department: "Engineering",
        position: "Software Developer",
        employeeId: "EMP002",
        faceData: [],
      },
      {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        department: "HR",
        position: "HR Specialist",
        employeeId: "EMP003",
        faceData: [],
      },
      {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        department: "Finance",
        position: "Financial Analyst",
        employeeId: "EMP004",
        faceData: [],
      },
    ];

    await Employee.insertMany(employees);
    console.log("Sample employees created");

    // Create default settings
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

    await Settings.insertMany(defaultSettings);
    console.log("Default settings created");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();

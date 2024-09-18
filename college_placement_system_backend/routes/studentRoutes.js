const express = require("express");
const { protectStudent } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Company = require("../models/Company");
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/companies", protectStudent, async (req, res) => {
  try {
    const companies = await Company.find({
      "openPositions.0": { $exists: true },
    });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/companies/:companyId/apply", protectStudent, async (req, res) => {
  const { resume, coverLetter, positionTitle } = req.body;
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const existingApplication = await Application.findOne({
      studentId: req.user.id,
      companyId: company._id,
      positionTitle,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this position." });
    }

    const application = new Application({
      studentId: req.user.id,
      companyId: company._id,
      positionTitle,
      resume,
      coverLetter,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications", protectStudent, async (req, res) => {
  try {
    const applications = await Application.find({
      studentId: req.user.id,
    }).populate("companyId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/application/:id", protectStudent, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", protectStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json({
      name: student.name,
      email: student.email,
      contact: student.profile.contactPhone,
      username: student.username,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/update-profile", protectStudent, async (req, res) => {
  const { name, email, contact, username } = req.body;

  if (!name || !email || !contact || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const student = await Student.findById(req.user.id);
    const user = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    student.name = name;
    student.email = email;
    student.profile.contactPhone = contact;
    student.username = username;
    user.username = username;

    await user.save();
    await student.save();
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/change-password", protectStudent, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const student = await Student.findById(req.user.id);
    const user = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newPassword;
    await user.save();
    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;

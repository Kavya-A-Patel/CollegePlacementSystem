const express = require("express");
const { protectAdmin } = require("../middleware/authMiddleware");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/companies/:companyId/jobs", protectAdmin, async (req, res) => {
  const { title, description, requirements, applicationDeadline } = req.body;
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.openPositions.push({
      title,
      description,
      requirements,
      applicationDeadline,
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/companies/:companyId/jobs/:jobId",
  protectAdmin,
  async (req, res) => {
    const { title, description, requirements, applicationDeadline } = req.body;
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company)
        return res.status(404).json({ message: "Company not found" });

      const job = company.openPositions.id(req.params.jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      job.title = title;
      job.description = description;
      job.requirements = requirements;
      job.applicationDeadline = applicationDeadline;

      await company.save();
      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/companies/:companyId/jobs/:jobId",
  protectAdmin,
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company)
        return res.status(404).json({ message: "Company not found" });

      company.openPositions.id(req.params.jobId).deleteOne();
      await company.save();
      res.status(200).json({ message: "Job deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/companies", protectAdmin, async (req, res) => {
  try {
    console.log("Fetching companies...");
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/companies", protectAdmin, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/companies/:id", protectAdmin, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/companies/:id", protectAdmin, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications", protectAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId")
      .populate("companyId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/applications/:id", protectAdmin, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/applications/:id/offer", protectAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("studentId")
      .populate("companyId");
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Offer letter generated and sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/students", protectAdmin, async (req, res) => {
  const { name, email, password, username, contact } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username: username,
      password: password,
      name: name,
      role: "student",
    });
    await user.save();

    const student = new Student({
      _id: user._id,
      name: name,
      email: email,
      username: username,
      password: password,
      profile: {
        education: "education",
        skills: "skills",
        resume: "resume",
        contactPhone: contact,
      },
      role: "student",
    });
    await student.save();

    res.status(201).json({ message: "Student created successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/students", protectAdmin, async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/students/:id", protectAdmin, async (req, res) => {
  const { name, email, password, username, contact } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name;
    student.email = email;
    if (!(password === "")) {
      student.password = password;
    }
    student.username = username;
    student.profile.contactPhone = contact;

    await student.save();

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    if (password !== "") {
      user.password = password;
    }
    await user.save();

    res
      .status(200)
      .json({ message: "Student updated successfully", student, user });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/students/:id", protectAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/change-password", protectAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;

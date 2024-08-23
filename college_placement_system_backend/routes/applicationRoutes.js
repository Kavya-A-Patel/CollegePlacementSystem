// const express = require("express");
// const router = express.Router();
// const { authorizeRoles } = require("../middleware/authMiddleware");
// const {
//   getApplications,
//   getApplicationsByStudentId,
//   getApplicationsByCompanyId,
//   createApplication,
//   updateApplicationStatus,
//   deleteApplication,
// } = require("../controllers/applicationController");

// router.get("/", authorizeRoles("admin"), getApplications); // Admin only
// router.get("/:id", authorizeRoles("admin"), getApplicationsByStudentId); // Admin only
// router.get("/:id", authorizeRoles("admin"), getApplicationsByCompanyId); // Admin only
// router.post("/", authorizeRoles("student"), createApplication); // Student only
// router.put("/:id", authorizeRoles("admin"), updateApplicationStatus); // Admin only
// router.delete("/:id", authorizeRoles("admin"), deleteApplication); // Admin only

// module.exports = router;

const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middleware/authMiddleware");
const {
  getApplications,
  getApplicationsByStudentId,
  getApplicationsByCompanyId,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

// Get all applications (Admin only)
router.get("/", authorizeRoles("admin"), getApplications);

// Get applications by student ID (Admin only)
router.get("/student/:id", authorizeRoles("admin"), getApplicationsByStudentId);

// Get applications by company ID (Admin only)
router.get("/company/:id", authorizeRoles("admin"), getApplicationsByCompanyId);

// Create a new application (Student only)
router.post("/", authorizeRoles("student"), createApplication);

// Update application status (Admin only)
router.put("/:id", authorizeRoles("admin"), updateApplicationStatus);

// Delete an application by ID (Admin only)
router.delete("/:id", authorizeRoles("admin"), deleteApplication);

module.exports = router;

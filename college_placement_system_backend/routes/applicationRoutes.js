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

router.get("/", authorizeRoles("admin"), getApplications); // Admin only
router.get("/:id", authorizeRoles("admin"), getApplicationsByStudentId); // Admin only
router.get("/:id", authorizeRoles("admin"), getApplicationsByCompanyId); // Admin only
router.post("/", authorizeRoles("student"), createApplication); // Student only
router.put("/:id", authorizeRoles("admin"), updateApplicationStatus); // Admin only
router.delete("/:id", authorizeRoles("admin"), deleteApplication); // Admin only

module.exports = router;

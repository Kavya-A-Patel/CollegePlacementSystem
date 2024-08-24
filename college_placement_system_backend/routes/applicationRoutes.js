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

router.get("/", authorizeRoles("admin"), getApplications);

router.get("/student/:id", authorizeRoles("admin"), getApplicationsByStudentId);

router.get("/company/:id", authorizeRoles("admin"), getApplicationsByCompanyId);

router.post("/", authorizeRoles("student"), createApplication);

router.put("/:id", authorizeRoles("admin"), updateApplicationStatus);

router.delete("/:id", authorizeRoles("admin"), deleteApplication);

module.exports = router;

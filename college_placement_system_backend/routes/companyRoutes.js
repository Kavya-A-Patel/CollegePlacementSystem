const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middleware/authMiddleware");
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

router.get("/", authorizeRoles("admin"), getCompanies); // Admin only
router.get("/:id", authorizeRoles("admin"), getCompanyById); // Admin only
router.post("/", authorizeRoles("admin"), createCompany); // Admin only
router.put("/:id", authorizeRoles("admin"), updateCompany); // Admin only
router.delete("/:id", authorizeRoles("admin"), deleteCompany); // Admin only

module.exports = router;

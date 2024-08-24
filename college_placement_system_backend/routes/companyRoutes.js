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

router.get("/", authorizeRoles("admin"), getCompanies);
router.get("/:id", authorizeRoles("admin"), getCompanyById);
router.post("/", authorizeRoles("admin"), createCompany);
router.put("/:id", authorizeRoles("admin"), updateCompany);
router.delete("/:id", authorizeRoles("admin"), deleteCompany);

module.exports = router;

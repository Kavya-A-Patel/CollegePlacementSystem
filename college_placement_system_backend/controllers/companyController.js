const Company = require("../models/Company");

const createCompany = async (req, res) => {
  const { name, description, website, contactEmail, openPositions } = req.body;

  try {
    const company = new Company({
      name,
      description,
      website,
      contactEmail,
      openPositions,
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, description, website, contactEmail, openPositions } = req.body;

  try {
    const company = await Company.findByIdAndUpdate(
      id,
      { name, description, website, contactEmail, openPositions },
      { new: true, runValidators: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};

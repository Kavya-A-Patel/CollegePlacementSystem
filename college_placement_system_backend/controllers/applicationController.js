const Application = require("../models/Application");

const createApplication = async (req, res) => {
  const { studentId, companyId, positionTitle, resume, coverLetter } = req.body;

  try {
    const application = new Application({
      studentId,
      companyId,
      positionTitle,
      resume,
      coverLetter,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId")
      .populate("companyId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplicationsByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const applications = await Application.find({ studentId }).populate(
      "companyId"
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplicationsByCompanyId = async (req, res) => {
  const { companyId } = req.params;

  try {
    const applications = await Application.find({ companyId }).populate(
      "studentId"
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationsByStudentId,
  getApplicationsByCompanyId,
  updateApplicationStatus,
  deleteApplication,
};

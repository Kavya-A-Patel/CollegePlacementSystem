const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    positionTitle: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

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
    positionTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offered", "Rejected"],
      default: "Applied",
    },
    resume: { type: String, required: true },
    coverLetter: { type: String },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;

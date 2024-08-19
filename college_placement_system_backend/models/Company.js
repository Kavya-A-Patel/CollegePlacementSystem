const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    contactEmail: { type: String, required: true },
    openPositions: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: { type: String, required: true },
        applicationDeadline: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;

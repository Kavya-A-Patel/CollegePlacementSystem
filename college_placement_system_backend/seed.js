const mongoose = require("mongoose");
const Company = require("./models/Company");

const mongoURI =
  "mongodb+srv://admin:root@trial.yraap.mongodb.net/?retryWrites=true&w=majority&appName=Trial";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const seedData = async () => {
  try {
    const companies = [
      {
        name: "Tech Innovators Inc.",
        description:
          "A leading tech company specializing in AI and machine learning solutions.",
        website: "https://www.techinnovators.com",
        contactEmail: "contact@techinnovators.com",
        openPositions: [
          {
            title: "Software Engineer",
            description:
              "Responsible for developing and maintaining web applications.",
            requirements: "Proficient in JavaScript, React, Node.js.",
            applicationDeadline: new Date("2024-09-30"),
          },
          {
            title: "Data Scientist",
            description:
              "Analyze large datasets to derive meaningful insights.",
            requirements:
              "Experience with Python, R, SQL, and machine learning algorithms.",
            applicationDeadline: new Date("2024-10-15"),
          },
        ],
      },
      {
        name: "Eco Solutions Ltd.",
        description:
          "A company focused on sustainable and eco-friendly products.",
        website: "https://www.ecosolutions.com",
        contactEmail: "info@ecosolutions.com",
        openPositions: [
          {
            title: "Environmental Consultant",
            description:
              "Provide expert advice on environmental best practices.",
            requirements:
              "Knowledge of environmental regulations and sustainability practices.",
            applicationDeadline: new Date("2024-09-25"),
          },
          {
            title: "Marketing Specialist",
            description:
              "Develop and execute marketing strategies for eco-friendly products.",
            requirements:
              "Experience in digital marketing and brand management.",
            applicationDeadline: new Date("2024-10-05"),
          },
        ],
      },
    ];

    await Company.deleteMany({});
    console.log("Existing company data cleared.");

    await Company.insertMany(companies);
    console.log("Sample company data added successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  }
};

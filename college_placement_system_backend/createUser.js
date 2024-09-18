const mongoose = require("mongoose");
const User = require("./models/User");
const Student = require("./models/Student");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createUser = async () => {
  try {
    const user = new User({
      username: "student",
      password: "studentpass",
      name: "student",
      role: "student",
    });

    await user.save();
    console.log("User created:", user);

    const student = new Student({
      name: "Student",
      email: "student@gmail.com",
      username: "student",
      password: "studentpass",
      profile: {
        education: "Education",
        skills: "Skills",
        resume: "Resume",
        contactPhone: "Phone",
      },
      role: "student",
    });
    await student.save();

    const user2 = new User({
      username: "student2",
      password: "studentpass2",
      name: "student2",
      role: "student",
    });

    await user2.save();
    console.log("User created:", user2);
    const student2 = new Student({
      name: "Student2",
      email: "student2@gmail.com",
      username: "student2",
      password: "studentpass2",
      profile: {
        education: "Education",
        skills: "Skills",
        resume: "Resume",
        contactPhone: "Phone",
      },
      role: "student",
    });
    await student2.save();
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.disconnect();
  }
};

createUser();

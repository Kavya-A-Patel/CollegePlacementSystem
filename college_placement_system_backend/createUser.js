const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createUser = async () => {
  try {
    const user = new User({
      username: "student",
      password: "studentpass",
      role: "student",
    });

    await user.save();
    console.log("User created:", user);
    const user2 = new User({
      username: "admin",
      password: "adminpass",
      role: "admin",
    });

    await user2.save();
    console.log("User created:", user2);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.disconnect();
  }
};

createUser();

const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const createUser = async () => {
  try {
    // Create a new user with a hashed password
    const user = new User({
      username: "student",
      password: "studentpass", // This will be hashed by the pre-save hook
      role: "student",
    });

    await user.save();
    console.log("User created:", user);
    const user2 = new User({
      username: "admin",
      password: "adminpass", // This will be hashed by the pre-save hook
      role: "admin",
    });

    await user.save();
    console.log("User created:", user);
    await user2.save();
    console.log("User created:", user2);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.disconnect();
  }
};

createUser();

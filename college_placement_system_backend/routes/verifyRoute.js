const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/verify", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", token, { httpOnly: true, secure: false });
    console.log("Login successful");
    res.status(200).json({ message: "Login successful", role: user.role });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/checkAuth", async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
});

module.exports = router;

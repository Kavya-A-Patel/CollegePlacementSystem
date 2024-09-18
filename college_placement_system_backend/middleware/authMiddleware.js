const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const protectAdmin = (req, res, next) => {
  protect(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  });
};

const protectStudent = (req, res, next) => {
  protect(req, res, () => {
    if (req.user && req.user.role === "student") {
      next();
    } else {
      res.status(403).json({ message: "Student access only" });
    }
  });
};

module.exports = { protectAdmin, protectStudent };

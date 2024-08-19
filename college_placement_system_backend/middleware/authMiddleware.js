const jwt = require("jsonwebtoken");

// Middleware to check if the user has the required role
function authorizeRoles(...roles) {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if the user role is authorized
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({
            message:
              "Forbidden. You do not have permission to perform this action.",
          });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token." });
    }
  };
}

module.exports = { authorizeRoles };

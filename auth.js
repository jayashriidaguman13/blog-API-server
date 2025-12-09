const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ auth: "Failed", message: "No token provided" });

  token = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ auth: "Failed", message: err.message });
    req.user = decoded; // { id, isAdmin }
    next();
  });
}

function verifyAdmin(req, res, next) {
  if (req.user.isAdmin) next();
  else return res.status(403).json({ auth: "Failed", message: "Admin only" });
}

function verifyNotAdmin(req, res, next) {
  if (!req.user.isAdmin) next();
  else return res.status(403).json({ auth: "Failed", message: "Admins cannot perform this action" });
}

module.exports = { verify, verifyAdmin, verifyNotAdmin };
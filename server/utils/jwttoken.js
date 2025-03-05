const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

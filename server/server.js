require("./attendanceresetter");

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { syncDatabase } = require("./models");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./utils/jwttoken");
const adminRoutes = require("./api/routes/adminRoutes");
const employeeRoutes = require("./api/routes/employeeRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

syncDatabase().then(() => {
  console.log("Database is ready");

  app.use(express.static(path.join(__dirname, "client/build")));
  app.use("/employee", employeeRoutes);
  app.use("/admin", adminRoutes);
  app.get("/auth/check", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }
  
    res.json({ role: decoded.role });
  });
  app.post("/auth/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: false });
    res.json({ message: "Logged out successfully" });
  });
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});

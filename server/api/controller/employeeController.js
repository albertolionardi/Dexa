const Employee = require("../../models/employee");
const bcrypt = require("bcrypt");
const bucket = require("../../utils/storage")
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { format } = require("util");

const { generateToken } = require("../../utils/jwttoken");
const upload = multer({ storage: multer.memoryStorage() });
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, role: "Employee" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

exports.markAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (employee.checkedIn) {
      return res.status(400).json({ message: "You have already checked in today" });
    }

    if (!req.file) return res.status(400).json({ message: "Photo is required" });

    const blob = bucket.file(`attendance/${employeeId}-${Date.now()}.jpg`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => res.status(500).json({ message: "Upload error", error: err }));

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      await employee.update({
        checkedIn: true,
        imgUrl: publicUrl,
      });

      res.status(200).json({ message: "Check-in successful", imageUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Error checking in", error });
  }
};

exports.getCheckInStatus = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ checkedIn: employee.checkedIn });
  } catch (error) {
    res.status(500).json({ message: "Error fetching check-in status", error });
  }
};
exports.upload = upload.single("photo");

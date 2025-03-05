const express = require("express");
const multer = require("multer");
const employeeRouter = express.Router();
const { authenticate } = require("../../middleware/authMiddleware");
const upload = multer({ storage: multer.memoryStorage() });
const employeeController = require("../controller/employeeController");

employeeRouter.post("/login", employeeController.login);
employeeRouter.post("/logout", employeeController.logout);
employeeRouter.post("/checkin", authenticate, upload.single("photo"), employeeController.markAttendance);
employeeRouter.get("/status", authenticate, employeeController.getCheckInStatus);

module.exports = employeeRouter;

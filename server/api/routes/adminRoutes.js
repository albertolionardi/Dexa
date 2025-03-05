const express = require("express");
const { authenticate } = require("../../middleware/authMiddleware");
const adminRouter = express.Router();
const adminController = require("../controller/adminController");

adminRouter.get("/employees", authenticate, adminController.getAllEmployees);
adminRouter.post("/employees", authenticate, adminController.addEmployee);
adminRouter.post("/employees/:id", authenticate, adminController.updateEmployee);
adminRouter.delete("/employees/:id", authenticate, adminController.deleteEmployee);
adminRouter.post("/login", adminController.adminLogin);
adminRouter.post("/logout", adminController.adminLogout);
module.exports = adminRouter;
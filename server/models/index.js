const sequelize = require("../dbclient");
const Employee = require("./employee");
const Admin = require("./admin");
const Attendance = require("./attendance");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` updates the table structure if needed
    console.log("Database & tables synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

module.exports = { sequelize, Employee, Admin, Attendance, syncDatabase };

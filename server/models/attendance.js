const { DataTypes } = require("sequelize");
const sequelize = require("../dbclient");
const Employee = require("./employee");

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  photoProof: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
});

Attendance.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Attendance, { foreignKey: "employeeId" });

module.exports = Attendance;

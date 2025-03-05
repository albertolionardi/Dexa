const { DataTypes } = require("sequelize");
const sequelize = require("../dbclient"); // Sequelize instance

const employee = sequelize.define("employee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("employee", "admin"),
    allowNull: false,
    defaultValue: "employee",
  },  
  checkedIn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  imgUrl: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = employee;

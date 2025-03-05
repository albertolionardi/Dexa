const Admin = require("../../models/admin");
const Employee = require("../../models/employee");
const { generateToken } = require("../../utils/jwttoken");
const bcrypt = require("bcrypt");
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employees", error });
  }
};
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: admin.id, role: "Admin" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.adminLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, position } = req.body;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name;
    employee.email = email;
    employee.position = position;

    await employee.save();

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};
exports.addEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword, 
      role,
    });

    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error adding employee", error });
  }
};
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
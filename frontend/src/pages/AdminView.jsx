import { useEffect, useState } from "react";
import "./AdminView.css";

function AdminView() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    fetch("http://localhost:5000/admin/employees", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("Error: API did not return an array", data);
        }
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleEdit = (emp) => {
    setEditingEmployee(emp.id);
    setUpdatedData(emp);
  };

  const handleChange = (e, field) => {
    setUpdatedData({ ...updatedData, [field]: e.target.value });
  };

  const handleConfirmChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/employees/${updatedData.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
          credentials: "include",
        }
      );

      if (response.ok) {
        setEmployees(
          employees.map((emp) => (emp.id === updatedData.id ? updatedData : emp))
        );
        setEditingEmployee(null);
      } else {
        console.error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleNewChange = (e, field) => {
    setNewEmployee({ ...newEmployee, [field]: e.target.value });
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
        credentials: "include",
      });

      if (response.ok) {
        const addedEmployee = await response.json();
        setEmployees([...employees, addedEmployee]);
        setAddingEmployee(false);
        setNewEmployee({ name: "", email: "", password: "", role: "employee" });
      } else {
        console.error("Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/admin/employees/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container2">
      <h2>
        Employee List
        {!addingEmployee ? (
          <button onClick={() => setAddingEmployee(true)}>+</button>
        ) : (
          <>
            <button onClick={handleAddEmployee}>Confirm</button>
            <button onClick={() => setAddingEmployee(false)}>Cancel</button>
          </>
        )}
      </h2>

      {addingEmployee && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => handleNewChange(e, "name")}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => handleNewChange(e, "email")}
          />
          <input
            type="password"
            placeholder="Password"
            value={newEmployee.password}
            onChange={(e) => handleNewChange(e, "password")}
          />
          <input
            type="text"
            placeholder="Role (employee/admin)"
            value={newEmployee.role}
            onChange={(e) => handleNewChange(e, "role")}
          />
        </div>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Checked In</th>
            <th>Check In Time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                {editingEmployee === emp.id ? (
                  <input
                    type="text"
                    value={updatedData.name}
                    onChange={(e) => handleChange(e, "name")}
                  />
                ) : (
                  emp.name
                )}
              </td>
              <td>
                {editingEmployee === emp.id ? (
                  <input
                    type="email"
                    value={updatedData.email}
                    onChange={(e) => handleChange(e, "email")}
                  />
                ) : (
                  emp.email
                )}
              </td>
              <td>
                {editingEmployee === emp.id ? (
                  <input
                    type="text"
                    value={updatedData.role}
                    onChange={(e) => handleChange(e, "role")}
                  />
                ) : (
                  emp.role
                )}
              </td>
              <td>
                {emp.checkedIn ? "✔️" : "❌"}
              </td>
              <td>
                {emp.checkedIn && emp.updatedAt
                  ? new Date(emp.updatedAt).toLocaleString()
                  : "Not Checked In"}
              </td>
              <td>
                {editingEmployee === emp.id ? (
                  <button onClick={handleConfirmChange}>Confirm Change</button>
                ) : (
                  <button onClick={() => handleEdit(emp)}>Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDeleteEmployee(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminView;

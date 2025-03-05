import { useState , useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AdminView from "./pages/AdminView.jsx";
import EmployeeView from "./pages/EmployeeView.jsx";
import "./App.css";

function App() {
  const [role, setRole] = useState("Admin");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/check", {
          method: "GET",
          credentials: "include", 
        });

        if (response.ok) {
          const data = await response.json();
          setLoggedIn(true);
          setRole(data.role);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };

    checkAuth();
  }, []);
  const handleLogin = async () => {

    const endpoint =
      role === "Employee"
        ? "http://localhost:5000/employee/login"
        : "http://localhost:5000/admin/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      setLoggedIn(true);
    } else {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", 
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  
    setLoggedIn(false);
    setRole("Admin");
    setEmail("");
    setPassword("");
  };
  

  return (
    <Router>
      <Navbar role={role} setRole={setRole} loggedIn={loggedIn} handleLogout={handleLogout} />

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                role === "Admin" ? (
                  <Navigate to="/adminpage" />
                ) : (
                  <Navigate to="/employeepage" />
                )
              ) : (
                <LoginForm
                  role={role}
                  setRole={setRole}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                />
              )
            }
          />

          <Route path="/adminpage" element={loggedIn && role === "Admin" ? <AdminView /> : <Navigate to="/" />} />

          <Route path="/employeepage" element={loggedIn && role === "Employee" ? <EmployeeView /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function LoginForm({ role, setRole, email, setEmail, password, setPassword, handleLogin }) {
  return (
    <div className="login-form">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
      <button onClick={handleLogin} className="login-button">Login as {role}</button>
    </div>
  );
}

export default App;

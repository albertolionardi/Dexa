import "./Navbar.css";
function Navbar({ role, setRole, loggedIn, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Attendance System</h1>
        <div className="navbar-action">
          {loggedIn ? (
            <>
              <span className="logged-in-text">Logged in as: {role}</span>
              <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
            </>
          ) : (
            <button
              onClick={() => setRole(role === "Employee" ? "Admin" : "Employee")}
              className="nav-button"
            >
              Log in as: {role}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

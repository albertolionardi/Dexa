import { useState, useEffect } from "react";

function EmployeeView() {
  const [photo, setPhoto] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/employee/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCheckedIn(data.checkedIn);
      })
      .catch((error) => console.error("Error fetching check-in status:", error));
  }, [token]);

  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleCheckIn = async () => {
    if (!photo) {
      alert("Please upload a photo before confirming.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:5000/employee/checkin", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include"
      });

      if (response.ok) {
        setCheckedIn(true);
      } else {
        const errorMsg = await response.text();
        alert(`Failed to check in: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Today's Attendance</h2>
      <p>Date: {new Date().toLocaleDateString()}</p>
      {!checkedIn ? (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleCheckIn} disabled={loading}>
            {loading ? "Checking in..." : "Check In"}
          </button>
        </>
      ) : (
        <p>✅ Check-in successful!</p>
      )}
    </div>
  );
}

export default EmployeeView;

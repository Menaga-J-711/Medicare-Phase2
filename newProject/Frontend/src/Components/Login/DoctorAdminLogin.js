//DoctorAdminLogin.js

import React, { useState } from "react";

const DoctorAdminLogin = () => {
  const [role, setRole] = useState("doctor");

  return (
    <div className="login-section">
      <h2>Doctor / Admin Login</h2>
      <p className="sub-text">Authorized access only</p>

      {/* ROLE TOGGLE */}
    {/* ROLE TOGGLE */}
<div
  style={{
    display: "flex",
    gap: "30px",
    marginBottom: "20px",
    alignItems: "center"
  }}
>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer"
    }}
  >
    <input
      type="radio"
      name="role"
      value="doctor"
      checked={role === "doctor"}
      onChange={(e) => setRole(e.target.value)}
      style={{ margin: 0 }}
    />
    <span>Doctor</span>
  </label>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer"
    }}
  >
    <input
      type="radio"
      name="role"
      value="admin"
      checked={role === "admin"}
      onChange={(e) => setRole(e.target.value)}
      style={{ margin: 0 }}
    />
    <span>Admin</span>
  </label>
</div>


      {/* DOCTOR LOGIN */}
      {role === "doctor" && (
        <>
          <input type="text" placeholder="Doctor ID" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </>
      )}

      {/* ADMIN LOGIN */}
      {role === "admin" && (
        <>
          <select>
            <option value="">Select Hospital</option>
            <option>City Care Hospital</option>
            <option>MedLife Medical Center</option>
            <option>Global Health Hospital</option>
          </select>

          <input type="email" placeholder="Admin Email" />
          <input type="password" placeholder="Password" />
        </>
      )}

      <button className="login-btn">
        {role === "doctor" ? "Login as Doctor" : "Login as Admin"}
      </button>
    </div>
  );
};

export default DoctorAdminLogin;
//UserLogin.js

import React from "react";

const UserLogin = () => {
  return (
    <div className="login-section">
      <h2>User Login</h2>
      <p className="sub-text">Normal user access</p>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button className="login-btn">Login</button>
    </div>
  );
};

export default UserLogin;
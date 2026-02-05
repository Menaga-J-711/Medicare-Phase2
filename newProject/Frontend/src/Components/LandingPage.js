// ✅ buildy/Frontend/src/Components/LandingPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const handleJoinQueue = () => setShowModal(true);

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your appointment email");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email!");
        setOtpSent(true);
      } else alert(data.msg || "Error sending OTP");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setLoading(true);
    console.log("Verifying:", email, otp);

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified! Joining queue...");
        setShowModal(false);
        navigate("/queue", { state: { email } });
      } else alert(data.msg || "Invalid OTP");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return alert("Enter your city name");
    let body;

    if (searchQuery.toLowerCase().includes("kovil"))
      body = { latitude: 9.17, longitude: 77.86, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("rajap"))
      body = { latitude: 9.45, longitude: 77.55, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("sivak"))
      body = { latitude: 9.45, longitude: 77.79, bloodGroup: "A+" };
    else return alert("No hospitals found for this location!");

    try {
      const res = await fetch("http://localhost:5000/api/hospitals/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">MediCare</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/findhospital">Find Hospitals</Link></li>
          <li><Link to="/doctors">Find Doctors</Link></li>
          <li><Link to="/bookMyAppointment">Book My Appointment</Link></li>
          <li><button onClick={handleJoinQueue} className="queue-btn">Join Queue</button></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* OTP MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{otpSent ? "Verify OTP" : "Join Queue via Email"}</h2>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your appointment email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Book Your Doctor Appointment Easily</h1>
          <p>
            Fast, reliable, and convenient appointment booking with top doctors
            at your fingertips.
          </p>
          <div className="hero-buttons">
            <Link to="/doctors" className="btn-primary">Find a Doctor</Link>
            <Link to="/bookMyAppointment" className="btn-secondary">Book My Appointment</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/doctors-group.png" alt="Doctor-Team" />
        </div>
      </section>

      {/* FIND HOSPITAL */}
      <section className="find-hospital">
        <h2>Find Hospitals in Your City</h2>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Type your city (e.g., Kovilpatti)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="hospital-list">
          {hospitals.length === 0 ? (
            <p className="no-results">Start by searching your city above.</p>
          ) : (
            hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="hospital-card"
                onClick={() =>
                  navigate(`/doctors?hospital=${encodeURIComponent(hosp.name)}`)
                }
              >
                <h3>{hosp.name}</h3>
                <p>📍 {hosp.city}</p>
                <p>🚑 Ambulance: {hosp.ambulanceAvailable ? "Yes" : "No"}</p>
                <p>👨‍⚕️ Doctors: {hosp.doctorsAvailable}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" alt="easy" />
            <h3>Easy Booking</h3>
            <p>Book appointments anytime, anywhere in just a few clicks.</p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/2920/2920348.png" alt="secure" />
            <h3>Secure Data</h3>
            <p>Your personal details and health records are safe with us.</p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="top-doctors" />
            <h3>Top Doctors</h3>
            <p>Connect with verified, experienced healthcare professionals.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 MediCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from "react";
import "./HospitalListPopup.css";

const HospitalListPopup = ({ hospitals = [], onClose }) => {
  return (
    <div className="hospital-popup-overlay">
      <div className="hospital-popup">

        {/* HEADER */}
        <div className="hospital-popup-header">
          <h2>🏥 Nearby Hospitals</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="hospital-popup-body">
          {hospitals.length === 0 ? (
            <p className="no-data">No hospitals available</p>
          ) : (
            hospitals.map((h, idx) => (
              <div key={idx} className="hospital-card">

                <div className="hospital-title">
                  <h3>{h.name}</h3>
                  <span className="distance">{h.distance} km</span>
                </div>

                <p><strong>📍 Address:</strong> {h.address}</p>

                <p>
                  <strong>🩸 Blood:</strong>{" "}
                  {h.bloodGroups?.length ? h.bloodGroups.join(", ") : "N/A"}
                </p>

                <p>
                  <strong>👨‍⚕️ Doctors:</strong>{" "}
                  {h.doctorsAvailable ?? 0}
                </p>

                <p>
                  <strong>🚑 Ambulance:</strong>{" "}
                  {h.ambulanceAvailable ? "Available" : "Not Available"}
                </p>

                <div className="button-group">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="navigate-btn">🗺 Navigate</button>
                  </a>

                  {h.ambulanceAvailable && h.ambulanceNumber && (
                    <button
                      className="ambulance-btn"
                      onClick={() => window.open(`tel:${h.ambulanceNumber}`)}
                    >
                      📞 Call
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default HospitalListPopup;

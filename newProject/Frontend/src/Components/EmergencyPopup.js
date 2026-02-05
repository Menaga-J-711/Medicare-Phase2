import React, { useState } from "react";
import "./EmergencyPopup.css";
import HospitalListPopup from "./HospitalListPopup";

const EmergencyPopup = ({ onClose }) => {
  const [isEmergency, setIsEmergency] = useState(null);
  const [locationInput, setLocationInput] = useState(""); // editable input
  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const [bloodGroup, setBloodGroup] = useState("");
  const [hospitalResults, setHospitalResults] = useState([]);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [locationError, setLocationError] = useState("");

  const API_URL = "http://localhost:5000";

  // 🔴 YES Emergency → Fetch GPS
  const handleYes = () => {
    setIsEmergency(true);
    setLocationError("");
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({ latitude: lat, longitude: lng });
        setLocationInput(`${lat}, ${lng}`);
        setLoadingLocation(false);
      },
      (err) => {
        setLocationError("Unable to fetch location. You can type your city.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  // 🔎 Convert city name → lat/lng
  const geocodeLocation = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();

    if (!data || data.length === 0) return null;

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  };

  // 🔴 Submit Emergency
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationInput) {
      alert("📍 Please enter or allow location");
      return;
    }

    setLoadingHospitals(true);
    let finalCoords = coords;

    // Case 1: user typed lat,lng manually
    if (locationInput.includes(",")) {
      const [lat, lng] = locationInput.split(",").map((v) => parseFloat(v.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        finalCoords = { latitude: lat, longitude: lng };
      }
    }

    // Case 2: user typed city/place name
    if (!finalCoords) {
      const geo = await geocodeLocation(locationInput);
      if (!geo) {
        alert("❌ Location not found. Try a nearby city.");
        setLoadingHospitals(false);
        return;
      }
      finalCoords = geo;
    }

    try {
      const res = await fetch(`${API_URL}/api/hospitals/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: finalCoords.latitude,
          longitude: finalCoords.longitude,
          bloodGroup,
        }),
      });

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert("⚠️ No nearby hospitals found. Showing closest results.");
      }

      setHospitalResults(data);
      setShowHospitalList(true);
    } catch (err) {
      alert("Server error while fetching hospitals.");
    } finally {
      setLoadingHospitals(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        {isEmergency === null && (
          <>
            <h2>🚨 Are you in an Emergency?</h2>
            <div className="popup-buttons">
              <button onClick={handleYes}>Yes</button>
              <button onClick={onClose}>No</button>
            </div>
          </>
        )}

        {isEmergency && !showHospitalList && (
          <form className="popup-form" onSubmit={handleSubmit}>
            <h2>Emergency Details</h2>

            <label>📍 Location (Auto or Type City)</label>
            <input
              type="text"
              placeholder="Detecting location or type city name"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setCoords(null); // allow manual override
              }}
            />

            {loadingLocation && <p>Detecting location...</p>}
            {locationError && <p className="location-error">{locationError}</p>}

            <label>🩸 Blood Group (Optional)</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
              <option value="">I don’t know</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            <button type="submit" disabled={loadingHospitals}>
              {loadingHospitals ? "Searching..." : "Find Nearby Hospitals"}
            </button>
          </form>
        )}

        {showHospitalList && (
          <HospitalListPopup
            hospitals={hospitalResults}
            onClose={() => {
              setShowHospitalList(false);
              onClose();
            }}
          />
        )}

      </div>
    </div>
  );
};

export default EmergencyPopup;

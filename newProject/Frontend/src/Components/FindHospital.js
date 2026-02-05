import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindHospital.css";

const FindHospital = () => {
  const navigate = useNavigate();

  const hospitalData = {
    Kovilpatti: [
      { name: "Kovilpatti Government Hospital", city: "Kovilpatti" },
      { name: "Sri Ram Hospitals", city: "Kovilpatti" }
    ],
    Sivakasi: [
      { name: "Sivakasi Government Hospital", city: "Sivakasi" },
      { name: "Sri Devi Hospitals", city: "Sivakasi" }
    ],
    Rajapalayam: [
      { name: "Rajapalayam Government Medical Center", city: "Rajapalayam" },
      { name: "Shree Meenakshi Hospitals", city: "Rajapalayam" }
    ]
  };

  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const formattedCity = city.trim();
    if (hospitalData[formattedCity]) {
      setResults(hospitalData[formattedCity]);
    } else {
      setResults([]);
      alert("No hospitals found for this city!");
    }
  };

  const handleViewDoctors = (hospital) => {
    navigate(`/doctors?hospital=${encodeURIComponent(hospital.name)}`);
  };

  return (
    <div className="find-hospital-container">
      <h1>Find Hospitals Near You</h1>
      <p>Search by your city name to view available hospitals.</p>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="hospital-results">
        {results.length > 0 ? (
          results.map((hosp, index) => (
            <div key={index} className="hospital-card" onClick={() => handleViewDoctors(hosp)}>
              <h3>{hosp.name}</h3>
              <p>{hosp.city}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default FindHospital;

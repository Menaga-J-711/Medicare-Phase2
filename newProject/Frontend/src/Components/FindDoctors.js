import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FindDoctors.css";

const FindDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get hospital name from URL
  const params = new URLSearchParams(location.search);
  const selectedHospital = params.get("hospital");

  // Doctor data grouped by hospital
  const doctorData = {
    "Kovilpatti Government Hospital": [
      { id: 1, name: "Dr. A. Kumar", specialization: "Cardiologist", experience: 12, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 2, name: "Dr. R. Banu", specialization: "General Physician", experience: 9, image: "https://cdn-icons-png.flaticon.com/512/387/387569.png" },
      { id: 3, name: "Dr. V. Kumar", specialization: "Neurologist", experience: 7, image: "https://cdn-icons-png.flaticon.com/512/414/414927.png" }
    ],
    "Sri Ram Hospitals": [
      { id: 4, name: "Dr. S. Meena", specialization: "Dermatologist", experience: 8, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 5, name: "Dr. R. Vivek", specialization: "Orthopedic Surgeon", experience: 15, image: "https://cdn-icons-png.flaticon.com/512/414/414927.png" },
      { id: 6, name: "Dr. L. Devi", specialization: "Pediatrician", experience: 10, image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }
    ],
    "Sivakasi Government Hospital": [
      { id: 7, name: "Dr. M. Karthik", specialization: "Cardiologist", experience: 10, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 8, name: "Dr. P. Devi", specialization: "Gynecologist", experience: 11, image: "https://cdn-icons-png.flaticon.com/512/387/387569.png" },
      { id: 9, name: "Dr. R. Raj", specialization: "Orthopedic", experience: 6, image: "https://cdn-icons-png.flaticon.com/512/414/414927.png" }
    ],
    "Sri Devi Hospitals": [
      { id: 10, name: "Dr. K. Ramesh", specialization: "ENT Specialist", experience: 13, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 11, name: "Dr. L. Anitha", specialization: "Pediatrician", experience: 9, image: "https://cdn-icons-png.flaticon.com/512/387/387569.png" },
      { id: 12, name: "Dr. V. Ravi", specialization: "Physician", experience: 8, image: "https://cdn-icons-png.flaticon.com/512/414/414927.png" }
    ],
    "Rajapalayam Government Medical Center": [
      { id: 13, name: "Dr. S. Aravind", specialization: "Surgeon", experience: 14, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 14, name: "Dr. M. Priya", specialization: "Dermatologist", experience: 8, image: "https://cdn-icons-png.flaticon.com/512/387/387569.png" },
      { id: 15, name: "Dr. A. Kumaravel", specialization: "Cardiologist", experience: 12, image: "https://cdn-icons-png.flaticon.com/512/414/414927.png" }
    ],
    "Shree Meenakshi Hospitals": [
      { id: 16, name: "Dr. L. Meenakshi", specialization: "Physician", experience: 9, image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
      { id: 17, name: "Dr. R. Subash", specialization: "Urologist", experience: 11, image: "https://cdn-icons-png.flaticon.com/512/387/387561.png" },
      { id: 18, name: "Dr. K. Divya", specialization: "Gynecologist", experience: 10, image: "https://cdn-icons-png.flaticon.com/512/387/387569.png" }
    ]
  };

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (selectedHospital && doctorData[selectedHospital]) {
      setDoctors(doctorData[selectedHospital]);
    }
  }, [selectedHospital]);

  const handleBookAppointment = (doctorName) => {
    navigate(`/bookMyAppointment?doctor=${encodeURIComponent(doctorName)}`);
  };

  return (
    <div className="find-doctors-container">
      <h1>{selectedHospital ? selectedHospital : "Find a Doctor"}</h1>
      <p>
        {selectedHospital
          ? "Available Doctors in this Hospital"
          : "Browse our list of certified doctors"}
      </p>

      <div className="doctor-list">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <img src={doc.image} alt={doc.name} />
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>
              <p>{doc.experience} years of experience</p>
              <button onClick={() => handleBookAppointment(doc.name)}>
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="no-doctors">No doctors found for this hospital.</p>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;

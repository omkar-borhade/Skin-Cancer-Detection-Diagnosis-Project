// src/components/Doctors.js
import React from 'react';

const doctorsData = [
  {
    name: "Dr. John Smith",
    specialty: "Dermatologist",
    description: "Expert in skin cancer screening and treatment. Dr. Smith has over 10 years of experience in dermatology and a passion for patient care.",
    imageUrl: "https://via.placeholder.com/150" // Replace with actual image URL
  },
  {
    name: "Dr. Emily Johnson",
    specialty: "Oncologist",
    description: "Specializes in cancer treatment and management. Dr. Johnson is dedicated to providing comprehensive care and support to patients.",
    imageUrl: "https://via.placeholder.com/150" // Replace with actual image URL
  },
  {
    name: "Dr. Michael Brown",
    specialty: "General Practitioner",
    description: "Provides holistic care and preventative services. Dr. Brown emphasizes early detection and patient education.",
    imageUrl: "https://via.placeholder.com/150" // Replace with actual image URL
  },
  {
    name: "Dr. Sarah Davis",
    specialty: "Surgeon",
    description: "Skilled in surgical interventions for skin cancer. Dr. Davis is committed to achieving the best outcomes for her patients.",
    imageUrl: "https://via.placeholder.com/150" // Replace with actual image URL
  },
];

const Doctors = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">Meet Our Team of Doctors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctorsData.map((doctor, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img src={doctor.imageUrl} alt={doctor.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <h3 className="text-md text-gray-600 mb-2">{doctor.specialty}</h3>
            <p className="text-gray-700">{doctor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;

// src/components/Doctors.js
import React from 'react';

const doctorsData = [
  {
    name: "Dr. Mukul Gharote",
    specialty: "Oncologist",
    description: "20 years of experience in oncology with expertise in hematologic and pediatric oncology. Dr. Mukul Gharote holds an MBBS, DM - Oncology, and MD - General Medicine, offering specialized care for cancer patients.",
    imageUrl: "/image/dr.mukul Gharote.png" // Replace with actual image URL
  },
  {
    name: "Dr. Bhushan Nemade",
    specialty: "Oncologist",
    description: "21 years of experience in radiation oncology. Dr. Bhushan Nemade has an MD in Radiation Oncology from Tata Memorial Hospital, Mumbai, and a Professional Diploma in Clinical Research (PDCR). He is also an MBBS graduate from Mumbai University.",
    imageUrl: "/image/dr.bhushan nemade.jpeg" // Replace with actual image URL
  },
  {
    name: "Dr. Bhushan Wani",
    specialty: "Oncologist",
    description: "11 years of experience as a surgical oncologist. Dr. Bhushan Wani holds an M.Ch from the Homi Bhabha National Institute and practices at Sai Shree Super Speciality Hospital and Research Centre, Nashik.",
    imageUrl: "/image/dr.bhushan wani.jpg" // Replace with actual image URL
  },
  {
    name: "Dr. Chandrashekhar Pethe",
    specialty: "Medical Oncologist & Hemato-Oncologist",
    description: "Over 10 years of experience in adult and childhood cancer care, specializing in childhood cancers like leukemias and lymphomas. Dr. Chandrashekhar Pethe is a senior consultant at MOC Nashik (Hope-MOC) with a focus on highly curable childhood cancers.",
    imageUrl: "/image/Dr-Chandrashekhar_Pethe.png" // Replace with actual image URL
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

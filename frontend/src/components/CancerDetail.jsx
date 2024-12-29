// src/CancerDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { cancerDetails } from '../data/cancerDetails'; // Adjust the path as necessary
import NearbyDoctors from '../components/NearbyDoctors';
function CancerDetail() {
  const { id } = useParams();  // Get the cancer type ID from the route parameters

  // Convert id to a number to match the keys in cancerDetails
  const cancer = cancerDetails[Number(id)];  // Fetch the corresponding cancer details

  if (!cancer) {
    return <p>Skin cancer type not found!</p>;  // Handle invalid IDs
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-4xl font-bold mb-8">{cancer.name}</h2>

      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        {/* Image Section */}
        <img 
          src={cancer.image} 
          alt={cancer.name} 
          className="w-full lg:w-1/3 h-auto object-contain rounded-lg mb-6 lg:mb-0 lg:mr-12"
        />

        {/* Description Section */}
        <div className="lg:w-3/4">
          <p className="text-lg mb-6 pr-14 text-justify">
            <strong>Description:</strong> {cancer.description}
          </p>
          <p className="text-lg mb-6 pr-14 text-justify">
            <strong>Causes:</strong> {cancer.causes}
          </p>
          <p className="text-lg mb-6 pr-14 text-justify">
            <strong>Symptoms:</strong> {cancer.symptoms}
          </p>
          <p className="text-lg mb-6 pr-14 text-justify">
            <strong>Treatment:</strong> {cancer.treatment}
          </p>
        </div>
      </div>

      {/* Doctors Section */}
      {/* <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Nearby Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cancer.doctors.map((doctor, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <h4 className="text-xl font-bold">{doctor.name}</h4>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Location:</strong> {doctor.location}</p>
            </div>
          ))}
        </div>
      </div> */}
       <NearbyDoctors/>
    </div>
  );
}

export default CancerDetail;

import React from 'react';

const HospitalCard = ({ hospital }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 m-4">
      <img src={hospital.photo || 'default-image-url.jpg'} alt={hospital.name} className="w-full h-48 object-cover rounded-md" />
      <h3 className="text-xl font-semibold mt-2">{hospital.name}</h3>
      <p className="text-gray-700">{hospital.address}</p>
      <p className="text-gray-500">{hospital.city}</p>
    </div>
  );
};

export default HospitalCard;

import React from 'react';

const DermatologistCard = ({ hospital }) => {
  return (
    <div className="border p-4 mb-4 rounded-lg shadow-lg">
      <h2 className="font-bold text-lg">{hospital.name}</h2>
      <p className="text-gray-700">{hospital.address}</p>
      <img
        src={hospital.photo}
        alt={hospital.name}
        className="w-24 h-24 object-cover rounded-full mt-2"
      />
    </div>
  );
};

export default DermatologistCard;

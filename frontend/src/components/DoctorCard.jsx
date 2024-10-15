import React from 'react';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="border p-4 mb-4 rounded-lg shadow-lg">
      <h2 className="font-bold text-lg">{doctor.name}</h2>
      <p className="text-gray-700">{doctor.address}</p>
      <img
        src={doctor.photo}
        alt={doctor.name}
        className="w-24 h-24 object-cover rounded-full mt-2"
      />
    </div>
  );
};

export default DoctorCard;

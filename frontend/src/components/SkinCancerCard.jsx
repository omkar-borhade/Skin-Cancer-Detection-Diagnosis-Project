// src/components/SkinCancerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SkinCancerCard = ({ cancerType }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 m-2 w-80 hover:shadow-lg transition-shadow duration-300">
      <Link to={`/cancer/${cancerType.id}`}>
        <img 
          src={cancerType.image} 
          alt={cancerType.name} 
          className="w-full h-40 object-cover rounded-md mb-4" 
        />
        <h3 className="text-xl font-semibold">{cancerType.name}</h3>
        <p className="text-sm text-gray-600">{cancerType.shortInfo}</p>
      </Link>
    </div>
  );
};

export default SkinCancerCard;

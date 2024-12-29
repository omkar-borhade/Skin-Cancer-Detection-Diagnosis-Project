<<<<<<< HEAD
import React, { useEffect } from 'react';

const DermatologistCard = ({ dermatologist, userLocation }) => {
  useEffect(() => {
    if (window.google && userLocation) {
      const map = new window.google.maps.Map(document.getElementById(`map${dermatologist.id}`), {
        center: { lat: dermatologist.lat, lng: dermatologist.lng },
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [{ saturation: 0 }] // Vibrant colors for the map
          }
        ]
      });

      const doctorIcon = {
        url: 'https://maps.google.com/mapfiles/kml/paddle/H.png',
        scaledSize: new window.google.maps.Size(40, 40),
      };

      const oncologistIcon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
      };

      const markerIcon = dermatologist.specialization === "Oncologist" ? oncologistIcon : doctorIcon;

      new window.google.maps.Marker({
        position: { lat: dermatologist.lat, lng: dermatologist.lng },
        map,
        title: dermatologist.name,
        icon: markerIcon,
      });

      const userIcon = {
        url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
        scaledSize: new window.google.maps.Size(40, 40),
      };

      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map,
        title: 'Your Location',
        icon: userIcon,
      });
    }
  }, [dermatologist, userLocation]);

  return (
    <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl p-5 mb-6 transform transition-all hover:scale-105 hover:shadow-2xl">
      <div className="md:w-1/2 p-5">
        <h4 className="text-2xl font-bold text-gray-800 mb-3">{dermatologist.name}</h4>
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Address:</span> {dermatologist.address}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Specialization:</span> {dermatologist.specialization}
        </p>
        <p className="text-sm text-gray-500">Contact: {dermatologist.contact}</p>
      </div>
      <div id={`map${dermatologist.id}`} className="md:w-1/2 w-full h-96 rounded-md mt-4 md:mt-0 shadow-lg"></div>
=======
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
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
    </div>
  );
};

export default DermatologistCard;

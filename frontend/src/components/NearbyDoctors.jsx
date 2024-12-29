import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DermatologistCard from './DermatologistCard';

const NearbyDoctors = () => {
  const [loading, setLoading] = useState(true);
  const [dermatologists, setDermatologists] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => {
          alert('Cannot fetch location');
          setLoading(false);
        }
      );
    } else {
      alert('Browser does not support geolocation');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/nearby?lat=${location.lat}&lng=${location.lng}`)
        .then((response) => {
          // Assuming the response includes the necessary fields: name, address, lat, lng, specialization, contact, hospitalName
          const dermatologistsData = response.data;
          setDermatologists(dermatologistsData);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [location]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Nearby Docter</h3>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
          {dermatologists.map((dermatologist) => (
            <DermatologistCard
              key={dermatologist.id}
              dermatologist={dermatologist}
              userLocation={location}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyDoctors;

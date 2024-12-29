import React, { useEffect } from 'react';

const LocationForm = ({ onLocationSubmit }) => {
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocationSubmit(latitude, longitude); // Call the parent function with coordinates
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please try again later.'); // Alert user
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    getLocation(); // Call the function to get the location
  }, [onLocationSubmit]);

  return null; // No UI component needed for just fetching location
};

export default LocationForm;

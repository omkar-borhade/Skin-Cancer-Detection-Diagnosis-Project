const axios = require('axios');
const { apiKey } = require('../config/dotenvConfig');

// Haversine formula to calculate distance between two geographical coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Fetch detailed information about a place using its place_id
const fetchPlaceDetails = async (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  const response = await axios.get(url);
  const details = response.data.result;

  // Extract contact details and specialization (if available)
  const contact = details.formatted_phone_number || 'N/A';
  const specialization = details.types.includes('hospital') ? 'Hospital' : (details.types.includes('doctor') ? 'Dermatologist' : 'Unknown');
  const hospitalName = details.name.includes('Hospital') ? details.name : 'N/A';

  return { contact, specialization, hospitalName, lat: details.geometry.location.lat, lng: details.geometry.location.lng };
};

// Fetch nearby dermatologists from Google Places API
const fetchNearbyDermatologists = async (lat, lng, radius = 5000) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=doctor&keyword=dermatologist&key=${apiKey}`;
  const response = await axios.get(url);

  // Fetch details for each dermatologist
  const dermatologistsPromises = response.data.results.map(async (result, index) => {
    const { contact, specialization, lat: doctorLat, lng: doctorLng } = await fetchPlaceDetails(result.place_id);

    return {
      id: index + 1,
      name: result.name,
      address: result.vicinity || 'Address not available',
      lat: doctorLat,
      lng: doctorLng,
      icon: result.icon,
      contact,
      specialization,
      hospitalName: result.name.includes('Hospital') ? result.name : 'N/A',
      distance: haversineDistance(lat, lng, doctorLat, doctorLng), // Calculate the distance
    };
  });

  // Wait for all data to be fetched
  const dermatologists = await Promise.all(dermatologistsPromises);

  // Separate oncologists and dermatologists
  const oncologists = dermatologists.filter(doctor => doctor.specialization === 'Oncologist');
  const generalDermatologists = dermatologists.filter(doctor => doctor.specialization === 'Dermatologist');

  // Ensure we have at least 2 oncologists and 3 dermatologists
  const selectedOncologists = oncologists.slice(0, 2);  // Get up to 2 oncologists
  const selectedDermatologists = generalDermatologists.slice(0, 3);  // Get up to 3 dermatologists

  // Combine them into a final list
  let finalList = [...selectedOncologists, ...selectedDermatologists];

  // If there are fewer than 5 results, add more dermatologists or oncologists
  if (finalList.length < 5) {
    const remainingDoctors = [...oncologists, ...generalDermatologists];
    const additionalDoctors = remainingDoctors.slice(finalList.length, 5);
    finalList = [...finalList, ...additionalDoctors];
  }

  // Sort the final list by distance (nearest first)
  finalList.sort((a, b) => a.distance - b.distance);

  return finalList;  // Return the 5 doctors (2 oncologists, 3 dermatologists) sorted by distance
};

module.exports = { fetchNearbyDermatologists };

const { fetchNearbyDermatologists } = require('../utils/googleApiUtils');

// Controller to handle fetching nearby dermatologists
const getNearbyDermatologists = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const dermatologists = await fetchNearbyDermatologists(lat, lng);
    res.json(dermatologists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
  }
};

module.exports = { getNearbyDermatologists };

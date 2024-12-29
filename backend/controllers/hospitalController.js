const axios = require('axios'); // Import axios

// Define your skin cancer keywords for filtering
const SKIN_CANCER_KEYWORDS = ['dermatology', 'skin', 'cancer', 'oncology'];

exports.getNearbyHospitals = async (req, res) => {
  const { lat, lon } = req.query;

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000, ${lat}, ${lon});
      way["amenity"="hospital"](around:5000, ${lat}, ${lon});
      relation["amenity"="hospital"](around:5000, ${lat}, ${lon});
    );
    out body;
  `;

  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // Log response status for debugging
    console.log('Response Status:', response.status);

    const data = response.data; // Use Axios response directly

    const hospitals = data.elements
      .map(element => ({
        id: element.id,
        name: element.tags.name || 'Unknown Hospital',
        address: element.tags.address || 'No Address',
        photo: 'default-image-url.jpg', // Placeholder for hospital photo
      }))
      .filter(hospital => 
        SKIN_CANCER_KEYWORDS.some(keyword => 
          hospital.name.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 4); // Limit to top 4 hospitals

    res.json({ hospitals });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    // Log the entire error message for better debugging
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
  }
};

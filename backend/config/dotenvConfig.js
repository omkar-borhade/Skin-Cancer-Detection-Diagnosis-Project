require('dotenv').config();

module.exports = {
  apiKey: process.env.PLACES_API_KEY,
  port: process.env.PORT || 5000,
};

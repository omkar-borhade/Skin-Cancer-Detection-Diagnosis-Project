require("dotenv").config();

module.exports = {
  apiKey: process.env.PLACES_API_KEY,
  port: process.env.PORT || 5000,
  apiUrl: process.env.BACKEND_FLASK_API_URL || process.env.BACKEND_FLASK_API_MOBILE,
  FRONTEND: process.env.FRONTEND_URL,
};


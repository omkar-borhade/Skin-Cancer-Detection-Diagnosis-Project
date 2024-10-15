const express = require('express');
const { getNearbyHospitals } = require('../controllers/hospitalController');
const router = express.Router();

// Define the route for getting nearby hospitals
router.get('/', getNearbyHospitals);

module.exports = router;

const express = require('express');
const { getNearbyDermatologists } = require('../controllers/nearbyController');

const router = express.Router();

// Route to get nearby dermatologists
router.get('/api/nearby', getNearbyDermatologists);

module.exports = router;

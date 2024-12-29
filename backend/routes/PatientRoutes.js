const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');

// Route to submit patient data with file uploads
router.post('/patients', patientController.submitPatientData);

// Route to confirm patient data
// router.post('/patients/confirm', patientController.confirmPatientData);

module.exports = router;

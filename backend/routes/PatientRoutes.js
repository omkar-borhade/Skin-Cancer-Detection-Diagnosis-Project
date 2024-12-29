const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');
<<<<<<< HEAD

// Route to submit patient data with file uploads
router.post('/patients', patientController.submitPatientData);

// Route to confirm patient data
// router.post('/patients/confirm', patientController.confirmPatientData);
=======
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads (in-memory storage for now)
const storage = multer.memoryStorage(); // Memory storage (not saving files directly to disk)
const upload = multer({ storage }); // Configure multer to use in-memory storage

// Route to submit patient data with file uploads
router.post('/patients', upload.array('skinImages', 5), async (req, res) => {
  console.log('Uploaded files:', req.files);

  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    // Call the controller to submit patient data
    await patientController.submitPatientData(req, res);
  } catch (error) {
    // Handle any errors that occur in the controller
    console.error('Error handling patient data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to confirm patient data
router.post('/patients/confirm', patientController.confirmPatientData);
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

module.exports = router;

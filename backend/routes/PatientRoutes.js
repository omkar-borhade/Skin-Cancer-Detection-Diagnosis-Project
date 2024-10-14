const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for in-memory uploads
const upload = multer({ storage });

router.post('/patients', upload.array('skinImages', 5), async (req, res) => {
  console.log('Uploaded files:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    await patientController.submitPatientData(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/patients/confirm', patientController.confirmPatientData);

module.exports = router;

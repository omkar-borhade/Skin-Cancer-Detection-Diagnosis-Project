// routes/PatientRoutes.js
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Set the destination for uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set a unique filename
    }
});

const upload = multer({ storage: multer.memoryStorage() });


// Define route for submitting patient data
router.post('/patients', upload.array('skinImages', 5), async (req, res) => {
    // Handle Multer errors
    const multerError = req.fileValidationError || req.filesValidationError;
    if (multerError) {
        return res.status(400).json({ message: multerError.message });
    }

    try {
        // Call the patient controller function
        await patientController.submitPatientData(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/confirm', patientController.confirmPatientData);

module.exports = router;

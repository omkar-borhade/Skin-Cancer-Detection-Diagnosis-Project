
const multer = require('multer');
const { apiUrl } = require('../config/dotenvConfig'); // Load environment variables
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const stream = require('stream');
const cloudinary = require('../config/cloudinary');
const patientService = require('../services/patientService');
const Patient = require('../models/Patient.Modal.js');


// Configure multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Define the upload directory
const uploadDir = path.join(__dirname, 'backend', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
exports.submitPatientData = async (req, res) => {
  upload.array('skinImages', 1)(req, res, async (err) => {  // Limit to 1 file upload
    if (err) {
      return res.status(400).json({ message: 'Error uploading files', error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const uploadedFiles = [];

      for (const file of req.files) {
        const fileName = file.originalname;

        // Process image using Sharp
        const compressedBuffer = await sharp(file.buffer)
          .resize(1024)
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(new Error('Error uploading image'));
              } else {
                resolve(result);
              }
            }
          );

          const bufferStream = new stream.PassThrough();
          bufferStream.end(compressedBuffer);
          bufferStream.pipe(uploadStream);
        });

        uploadedFiles.push({
          imageUrl: result.secure_url,
          originalname: fileName,
        }); 
      }

      // Send Cloudinary URLs to Flask API for prediction
      const flaskResponse = await axios.post(`${apiUrl}/submit_patient_data`, {
        skinImages: uploadedFiles.map((file) => ({
          url: file.imageUrl,  // Send Cloudinary URL instead of file path
          originalname: file.originalname,
        })),
      });

      // Format prediction results
      const updatedFiles = uploadedFiles.map((file, index) => ({
        imageUrl: file.imageUrl,
        prediction: flaskResponse.data.predictions[index]?.result?.predicted_class || 'Pending',
        predictionDate: new Date(),
      }));

      // Check if the patient already exists
      let patient = await Patient.findOne({ email: req.body.email });

      if (patient) {
        patient.skinImages = updatedFiles;
      } else {
        const patientData = await patientService.createPatient(req.body, updatedFiles);
        patient = new Patient(patientData);
      }

      // Save the updated or new patient data
      await patient.save();

      res.status(201).json({
        prediction: flaskResponse.data,
        patient,
      });

    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: 'Validation error', errors });
      }

      console.error('Error submitting patient data:', error);
      res.status(500).json({ message: 'Error submitting patient data', error: error.message });
    }
  });
};

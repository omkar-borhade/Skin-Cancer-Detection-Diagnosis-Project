const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const patientService = require('../services/patientService');
const Patient = require('../models/Patient.Modal.js');

// Configure multer for file uploads (in-memory storage)
const storage = multer.memoryStorage(); // Use memory storage to hold files in memory
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size (adjust as needed)
  },
}); // Configure multer to use in-memory storage

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to handle patient data submission
exports.submitPatientData = async (req, res) => {
  // Use multer middleware to handle file uploads
  upload.array('skinImages', 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading files', error: err.message });
    }

    // Debugging: Log the uploaded files
    console.log('Uploaded files:', req.files);

    // Check if files are uploaded correctly
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const processedFiles = [];

      // Process each uploaded image
      for (const file of req.files) {
        // Log the file buffer to ensure it's not empty
        console.log('File buffer for', file.originalname, file.buffer.length);

        // Ensure that the file buffer is not empty
        if (!file.buffer || file.buffer.length === 0) {
          console.error('Empty file buffer for file:', file.originalname);
          continue; // Skip this file
        }

        // Append the timestamp to the original file name
        const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        // Process image using Sharp (if you want to compress and resize)
        const compressedBuffer = await sharp(file.buffer)
          .resize(1024) // Resize to a max width of 1024px
          .jpeg({ quality: 80 }) // Convert to JPEG format with 80% quality
          .toBuffer(); // Output the processed image as a buffer

        // Define the file path where the image will be saved
        const filePath = path.join(uploadDir, fileName);

        // Save the processed image to the file system
        await fs.promises.writeFile(filePath, compressedBuffer);

        // Push the image data into the processedFiles array
        processedFiles.push({
          originalname: fileName,
          path: filePath, // Store the path of the saved image
        });
      }

      // Prepare data for patient creation, passing the image files (with file paths)
      const patientData = await patientService.createPatient(req.body, processedFiles);

      // Save the patient data to MongoDB
      const patient = new Patient(patientData);
      await patient.save();

      // Respond with success
      res.status(201).json({
        message: 'Patient data submitted successfully',
        patient: patientData,
      });
    } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: 'Validation error', errors });
      }

      // Handle and log other errors
      console.error('Error submitting patient data:', error);
      res.status(500).json({ message: 'Error submitting patient data', error: error.message });
    }
  });
};


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

// Function to handle patient data submission
exports.submitPatientData = async (req, res) => {
  upload.array('skinImages', 1)(req, res, async (err) => {  // Limit to 1 file upload
    if (err) {
      return res.status(400).json({ message: 'Error uploading files', error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const processedFiles = [];
      for (const file of req.files) {
        const fileName = file.originalname; // Keep the original file name

        // Process image using Sharp
        const compressedBuffer = await sharp(file.buffer)
          .resize(1024)
          .jpeg({ quality: 80 })
          .toBuffer();

        const filePath = path.join(uploadDir, fileName);

        // Delete the old image if it exists
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath); // Remove old image
        }

        await fs.promises.writeFile(filePath, compressedBuffer);

        processedFiles.push({
          originalname: fileName,
          path: filePath,
        });
      }

      // Send processed image to Flask API for prediction
      const flaskResponse = await axios.post(`${apiUrl}/submit_patient_data`, {
        skinImages: processedFiles.map((file) => ({
          path: file.path,
          originalname: file.originalname,
        })),
      });

      const updatedFiles = [];

      // Upload image to Cloudinary and collect the URL
      for (const file of processedFiles) {
        const fileBuffer = await fs.promises.readFile(file.path);

        // Upload to Cloudinary using a stream
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
          bufferStream.end(fileBuffer);
          bufferStream.pipe(uploadStream);
        });

        updatedFiles.push({
          imageUrl: result.secure_url,
          prediction: flaskResponse.data.predictions[updatedFiles.length]?.result?.predicted_class || 'Pending',
          predictionDate: new Date(),
        });
      }

      // Check if the patient already exists
      let patient = await Patient.findOne({ email: req.body.email });

      if (patient) {
        // Replace the skin image with the new one
        patient.skinImages = updatedFiles;
      } else {
        // Create new patient data
        const patientData = await patientService.createPatient(req.body, updatedFiles);
        patient = new Patient(patientData);
      }

      // Save the updated or new patient data
      await patient.save();

      // Respond with the prediction result from Flask
      res.status(201).json({
        prediction: flaskResponse.data,
        patient,
      });

      // Cleanup: Delete all processed files
      for (const file of processedFiles) {
        if (fs.existsSync(file.path)) {
          await fs.promises.unlink(file.path); // Remove file
        }
      }
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


// const multer = require('multer');
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const stream = require('stream');
// const cloudinary = require('../config/cloudinary');
// const patientService = require('../services/patientService');
// const Patient = require('../models/Patient.Modal.js');

// // Configure multer for file uploads (in-memory storage)
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max file size
//   },
// });

// // Define the upload directory
// const uploadDir = path.join(__dirname, '../uploads');

// // Ensure the upload directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Function to handle patient data submission
// exports.submitPatientData = async (req, res) => {
//   upload.array('skinImages', 5)(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: 'Error uploading files', error: err.message });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'No files uploaded' });
//     }

//     try {
//       const processedFiles = [];
//       for (const file of req.files) {
//         const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

//         // Process image using Sharp
//         const compressedBuffer = await sharp(file.buffer)
//           .resize(1024)
//           .jpeg({ quality: 80 })
//           .toBuffer();

//         const filePath = path.join(uploadDir, fileName);
//         await fs.promises.writeFile(filePath, compressedBuffer);

//         processedFiles.push({
//           originalname: fileName,
//           path: filePath,
//         });
//       }

//       // Send processed images to Flask API for prediction
//       const flaskResponse = await axios.post('http://localhost:5001/submit_patient_data', {
//         skinImages: processedFiles.map((file) => ({
//           path: file.path,
//           originalname: file.originalname,
//         })),
//       });

//       const updatedFiles = [];

//       // Upload images to Cloudinary and collect the URLs
//       for (const file of processedFiles) {
//         const fileBuffer = await fs.promises.readFile(file.path);

//         // Upload to Cloudinary using a stream
//         const result = await new Promise((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             { resource_type: 'auto' },
//             (error, result) => {
//               if (error) {
//                 console.error('Cloudinary upload error:', error);
//                 reject(new Error('Error uploading image'));
//               } else {
//                 resolve(result);
//               }
//             }
//           );

//           const bufferStream = new stream.PassThrough();
//           bufferStream.end(fileBuffer);
//           bufferStream.pipe(uploadStream);
//         });

//         updatedFiles.push({
//           imageUrl: result.secure_url,
//           prediction: flaskResponse.data.predictions[updatedFiles.length]?.result?.predicted_class || 'Pending',
//           predictionDate: new Date(),
//         });
//       }

//       // Check if the patient already exists
//       let patient = await Patient.findOne({ email: req.body.email });

//       if (patient) {
//         // Append new images and predictions to the existing patient record
//         patient.skinImages = [...patient.skinImages, ...updatedFiles];
//       } else {
//         // Create new patient data
//         const patientData = await patientService.createPatient(req.body, updatedFiles);
//         patient = new Patient(patientData);
//       }

//       // Save the updated or new patient data
//       await patient.save();

//       // Respond with the prediction result from Flask
//       res.status(201).json({
//         prediction: flaskResponse.data,
//         patient,
//       });
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         const errors = Object.values(error.errors).map((err) => err.message);
//         return res.status(400).json({ message: 'Validation error', errors });
//       }

//       console.error('Error submitting patient data:', error);
//       res.status(500).json({ message: 'Error submitting patient data', error: error.message });
//     }
//   });
// };


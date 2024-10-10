// controllers/PatientController.js
const patientService = require('../services/patientService');

exports.submitPatientData = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Call the service to create a new patient with images
    const patientData = await patientService.createPatient(req.body, req.files);
    
    // Respond with the patient data to be used in confirmation
    res.status(201).json({
      message: 'Patient data submitted successfully',
      patient: patientData // Send back the created patient data
    });
  } catch (error) {
    console.error('Error submitting patient data:', error); // Log error for debugging
    res.status(500).json({ message: 'Error submitting patient data', error: error.message });
  }
};

// Add a new function to handle confirmation and saving to the database
exports.confirmPatientData = async (req, res) => {
  try {
    const patientData = req.body; // Get patient data from the request body
    
    // Save patient data (assuming the createPatient method handles saving)
    const patient = await patientService.createPatient(patientData, []); // Pass an empty array for images if they are already uploaded
    
    res.status(201).json({
      message: 'Patient data confirmed and saved successfully',
      patient // Send back the saved patient data
    });
  } catch (error) {
    console.error('Error confirming patient data:', error);
    res.status(500).json({
      message: 'Error confirming patient data',
      error: error.message
    });
  }
};

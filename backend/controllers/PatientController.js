const patientService = require('../services/patientService');
const Patient = require('../models/Patient.Modal.js');

exports.submitPatientData = async (req, res) => {
  try {
    const patientData = await patientService.createPatient(req.body, req.files);

    // Save the patient data in the database
    const patient = new Patient(patientData);
    await patient.save(); // Save the patient data in MongoDB

    res.status(201).json({
      message: 'Patient data submitted successfully',
      patient: patientData,
    });
  } catch (error) {
    console.error('Error submitting patient data:', error);
    res.status(500).json({ message: 'Error submitting patient data', error: error.message });
  }
};

exports.confirmPatientData = async (req, res) => {
  const patientData = req.body; // Get data from request body

  try {
    // Create a new patient record in MongoDB
    const patient = new Patient(patientData);
    await patient.save(); // Save the patient data

    // Respond with a success message
    res.status(201).json({ message: 'Patient data successfully saved!' });
  } catch (error) {
    console.error('Error saving patient data:', error);
    res.status(400).json({ message: 'Failed to save patient data: ' + error.message });
  }
};

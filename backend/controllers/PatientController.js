const patientService = require('../services/patientService');
const Patient = require('../models/Patient.Modal.js');

// Function to handle patient data submission
exports.submitPatientData = async (req, res) => {
    try {
        // Use the patientService to process and validate the request data
        const patientData = await patientService.createPatient(req.body, req.files);

        // Save the processed patient data in MongoDB
        const patient = new Patient(patientData);
        await patient.save();

        // Respond with success if everything is saved
        res.status(201).json({
            message: 'Patient data submitted successfully',
            patient: patientData,
        });
    } catch (error) {
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            // Create a detailed error response for validation errors
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Handle and log other errors
        console.error('Error submitting patient data:', error);
        res.status(500).json({ message: 'Error submitting patient data', error: error.message });
    }
};

// Function to handle confirmation of patient data
exports.confirmPatientData = async (req, res) => {
    const patientData = req.body; // Get patient data from the request body

    try {
        // Save the patient data in MongoDB
        const patient = new Patient(patientData);
        await patient.save();

        // Respond with a success message
        res.status(201).json({ message: 'Patient data successfully confirmed and saved!' });
    } catch (error) {
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Handle errors during data saving
        console.error('Error confirming patient data:', error);
        res.status(400).json({ message: 'Failed to confirm patient data: ' + error.message });
    }
};

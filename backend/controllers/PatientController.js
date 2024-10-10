const patientService = require('../services/patientService');

exports.submitPatientData = async (req, res) => {
  try {
    const patientData = await patientService.createPatient(req.body, req.files);
    
    res.status(201).json({
      message: 'Patient data submitted successfully',
      patient: patientData
    });
  } catch (error) {
    console.error('Error submitting patient data:', error); 
    res.status(500).json({ message: 'Error submitting patient data', error: error.message });
  }
};

exports.confirmPatientData = async (req, res) => {
  const patientData = req.body;

  try {
    const patient = new Patient(patientData);
    await patient.save();

    res.status(201).json({ message: 'Patient data successfully saved!' });
  } catch (error) {
    console.error('Error saving patient data:', error);
    res.status(400).json({ message: 'Failed to save patient data: ' + error.message });
  }
};

const cloudinary = require('../config/cloudinary');

exports.createPatient = async (data, files) => {
  const patientData = {
    name: data.name,
    age: data.age,
    sex: data.sex,
    bloodGroup: data.bloodGroup,
    mobileNumber: data.mobileNumber,
    email: data.email,
    address: data.address,
    familyHistory: data.familyHistory === 'true', // Convert to boolean
    symptoms: data.symptoms,
    skinImages: files, // Attach processed files
  };

  return patientData;
};

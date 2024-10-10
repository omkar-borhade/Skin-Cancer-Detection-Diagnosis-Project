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
    skinImages: [], // Initialize an array for image URLs
  };

  try {
    // Handle file uploads to Cloudinary
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
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

          // Ensure file.buffer is used to send the file data
          stream.end(file.buffer);
        });

        // Add the image URL to patientData
        patientData.skinImages.push(result.secure_url);
      }
    }

    // Log the patient data before returning
    console.log('Patient Data to be used:', patientData);

    // Return the patient data without saving it to the database
    return patientData; // Return the prepared patient data for the next page
  } catch (error) {
    // Log the detailed error before throwing
    console.error('Error preparing patient data:', error);
    throw new Error('Error preparing patient data: ' + error.message); // Include error details in the message
  }
};

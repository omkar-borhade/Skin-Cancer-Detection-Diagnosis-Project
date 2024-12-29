const cloudinary = require('../config/cloudinary');
<<<<<<< HEAD
const stream = require('stream'); 
=======
const stream = require('stream'); // Add this line to import the stream module
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

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
<<<<<<< HEAD
        // Skip files with empty buffer
        if (!file.buffer || file.buffer.length === 0) {
          console.error('Empty file buffer:', file.originalname);
          continue; // Skip empty files
        }

=======
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
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

          // Use a PassThrough stream to buffer the file data
          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer); // Write the buffer to the stream
          bufferStream.pipe(uploadStream); // Pipe the buffer stream to the upload stream
        });

        // Add the image URL to patientData
        patientData.skinImages.push(result.secure_url);
      }
    }

    // Log the patient data before returning
    console.log('Patient Data to be used:', patientData);

    // Return the patient data for saving in the controller
    return patientData; 
  } catch (error) {
    // Log the detailed error before throwing
    console.error('Error preparing patient data:', error);
    throw new Error('Error preparing patient data: ' + error.message);
  }
<<<<<<< HEAD
}; 
=======
};
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

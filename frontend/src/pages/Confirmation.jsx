import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formData = location.state; // Get the form data from the state


  const handleConfirm = async () => {
    setLoading(true);
    setErrorMessage('');
  
    try {
      // Create a new FormData object
      const form = new FormData();
  
      // Append form data fields to FormData object
      form.append('name', formData.name);
      form.append('age', formData.age);
      form.append('sex', formData.sex);
      form.append('bloodGroup', formData.bloodGroup);
      form.append('mobileNumber', formData.mobileNumber);
      form.append('email', formData.email);
      form.append('address', formData.address || 'N/A');
      form.append('familyHistory', formData.familyHistory ? 'Yes' : 'No');
      form.append('symptoms', formData.symptoms || 'N/A');
  
      // Handle image compression and append
      if (formData.skinImages && formData.skinImages.length > 0) {
        const base64String = formData.skinImages[0]; // Get the first image (Base64 string)
  
        // Remove the data URL prefix (if it exists)
        const base64Data = base64String.split(",")[1]; // Removes 'data:image/jpeg;base64,'
  
        // Convert Base64 string to binary data
        const binaryData = atob(base64Data); // Decode Base64 to binary string
  
        // Create a Uint8Array from the binary string
        const binaryArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          binaryArray[i] = binaryData.charCodeAt(i); // Convert each char to its byte equivalent
        }
  
        // Create a Blob from the binary data
        const blob = new Blob([binaryArray], { type: 'image/jpeg' }); // Use the correct MIME type
  
        // Compress the image Blob
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 1024, // Resize to a maximum width/height
          useWebWorker: true, // Use web workers for better performance
        };
  
        const compressedBlob = await imageCompression(blob, options); // Compress the Blob
  
        // Create a file name using the patient's name and email
        const compressedFileName = `${formData.name.replace(/\s+/g, '_')}_${formData.email.replace('@', '_at_').replace(/\./g, '_dot_')}.jpg`;
  
        // Append the compressed Blob to FormData with the dynamic file name
        form.append('skinImages', compressedBlob, compressedFileName);
      }
  
      // Send the FormData object to the backend
      const response = await axios.post('http://localhost:5000/api/patients', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        // Handle successful submission
        alert('Data successfully submitted!');
        navigate('/test-images'); // Navigate to a success page (optional)
      } else {
        setErrorMessage('There was an issue submitting your data.');
      }
    } catch (error) {
      setErrorMessage('Failed to submit data. Please try again.');
      console.error('Error during submission:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl mb-4">Submitted Form Data</h2>
        {formData ? (
          <>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Age:</strong> {formData.age}</p>
            <p><strong>Sex:</strong> {formData.sex}</p>
            <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
            <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
            <p><strong>Family History of Skin Cancer:</strong> {formData.familyHistory ? 'Yes' : 'No'}</p>
            <p><strong>Symptoms:</strong> {formData.symptoms || 'N/A'}</p>

            {formData.skinImages && formData.skinImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Uploaded Images:</h3>
                <div className="flex flex-wrap">
                  {formData.skinImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Skin image ${index + 1}`}
                      className="w-32 h-32 object-cover m-2 border border-gray-300 rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>No data submitted. Please go back to the form.</p>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-4">
            {errorMessage}
          </div>
        )}

        <div className="mt-4">
          <button 
            onClick={handleConfirm} 
            className="bg-green-500 text-white py-2 px-4 rounded mr-2"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Confirm'}
          </button>
        </div>

        {/* Edit Button */}
        <div className="mt-4">
          <button 
            onClick={() => navigate(-1)} // Navigates back to the previous page
            className="bg-yellow-500 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

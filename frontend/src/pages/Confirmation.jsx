import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    name,
    age,
    sex,
    bloodGroup,
    mobileNumber,
    email,
    address,
    familyHistory,
    symptoms,
    skinImages,
  } = location.state || {};

  const [captchaToken, setCaptchaToken] = useState(null);  // State to store CAPTCHA token

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);  // Store the CAPTCHA token
  };

  const handleConfirm = async () => {
    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/patients/confirm', {
        name,
        age,
        sex,
        bloodGroup,
        mobileNumber,
        email,
        address,
        familyHistory,
        symptoms,
        skinImages,
        captchaToken,  // Include the CAPTCHA token
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error confirming patient data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to confirm patient data';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl mb-4">Submitted Form Data</h2>
        {name ? (
          <>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Sex:</strong> {sex}</p>
            <p><strong>Blood Group:</strong> {bloodGroup}</p>
            <p><strong>Mobile Number:</strong> {mobileNumber}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Address:</strong> {address || 'N/A'}</p>
            <p><strong>Family History of Skin Cancer:</strong> {familyHistory ? 'Yes' : 'No'}</p>
            <p><strong>Symptoms:</strong> {symptoms || 'N/A'}</p>

            {skinImages && skinImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Uploaded Images:</h3>
                <div className="flex flex-wrap">
                  {skinImages.map((image, index) => (
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

        {/* reCAPTCHA Component */}
        <div className="mt-4">
          <ReCAPTCHA
            sitekey="6LceDGIqAAAAADrHzceCTMGzQfNouvz-i2S0Kus3"  // Replace with your actual site key
            onChange={onCaptchaChange}
          />
        </div>

        {/* Confirm button only shows when CAPTCHA is verified */}
        {captchaToken && (
          <div className="mt-4">
            <button 
              onClick={handleConfirm} 
              className="bg-green-500 text-white py-2 px-4 rounded mr-2"
            >
              Confirm
            </button>
          </div>
        )}

        <div className="mt-4">
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

// Confirmation.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message
        navigate('/'); // Redirect to home or form
      } else {
        alert(`Error: ${data.message}`); // Show error message
      }
    } catch (error) {
      console.error('Error confirming patient data:', error);
      alert('Failed to confirm patient data');
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

        <div className="mt-4">
          <button 
            onClick={handleConfirm} 
            className="bg-green-500 text-white py-2 px-4 rounded mr-2"
          >
            Confirm
          </button>
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
}

export default Confirmation;

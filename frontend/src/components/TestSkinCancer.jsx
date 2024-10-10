import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import FormBG from '/image/FormBG.jpg'; // Adjust the path as necessary
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function TestSkinCancer() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [skinImages, setSkinImages] = useState([]);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Initialize the navigate function
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
  
    const formData = new FormData();
    // Append your form data here
    formData.append('name', name);
    formData.append('age', age);
    formData.append('sex', sex);
    formData.append('bloodGroup', bloodGroup);
    formData.append('mobileNumber', mobileNumber);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('familyHistory', familyHistory);
    formData.append('symptoms', symptoms);
  
    // Append skin images if any
    if (skinImages.length > 0) {
      for (let i = 0; i < skinImages.length; i++) {
        formData.append('skinImages', skinImages[i]);
      }
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/patients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 201) {
        alert('Form submitted successfully!');
        
        // Reset form fields after submission
        resetForm();

        // Navigate to the confirmation page with the patient data
        navigate('/confirmation', { state: response.data.patient });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error submitting form. Please try again.'); // Set error message
    }
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setSex('');
    setBloodGroup('');
    setMobileNumber('');
    setEmail('');
    setAddress('');
    setSkinImages([]);
    setFamilyHistory(false);
    setSymptoms('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSkinImages(files); // Store selected files directly
  };

  return (
    <div 
      className="flex justify-start items-start min-h-screen p-2 pl-44 bg-gray-100"
      style={{
        backgroundImage: `url(${FormBG})`,  
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md" style={{ marginLeft: '20px' }}>
        <h2 className="text-center text-2xl mb-4">Test Your Skin Cancer Risk</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>} {/* Error Message */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Full Name */}
          <div className="flex items-center mb-3">
            <FaUser className="mr-2 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Full Name"
            />
          </div>

          {/* Age */}
          <div className="flex items-center mb-3">
            <FaCheckCircle className="mr-2 text-gray-500" />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              required
              min="1" // Ensure age is at least 1
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Age"
            />
          </div>

          {/* Sex */}
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
            className="mb-3 p-2 border border-gray-300 rounded"
            aria-label="Sex"
          >
            <option value="" disabled>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Blood Group */}
          <div className="flex items-center mb-3">
            <FaFileUpload className="mr-2 text-gray-500" />
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Blood Group"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Blood Group"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex items-center mb-3">
            <FaPhone className="mr-2 text-gray-500" />
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile Number"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Mobile Number"
            />
          </div>

          {/* Email */}
          <div className="flex items-center mb-3">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Email"
            />
          </div>

          {/* Address */}
          <div className="flex items-center mb-3">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address (Optional)"
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Address"
            />
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="file"
                onChange={handleImageChange}
                accept=".jpg,.png"
                multiple // Allow multiple file uploads
                className="hidden"
                aria-label="Upload Skin Images"
              />
              <span className="flex items-center p-2 border border-gray-300 rounded cursor-pointer">
                <FaFileUpload className="mr-2 text-gray-500" />
                Upload Skin Images
              </span>
            </label>
            {/* Display selected images */}
            {skinImages.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-medium">Selected Images:</h3>
                <ul className="list-disc ml-5">
                  {skinImages.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Family History */}
          <label className="mb-3 flex items-center">
            <input
              type="checkbox"
              checked={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.checked)}
              className="mr-2"
            />
            Family History of Skin Cancer
          </label>

          {/* Symptoms Description */}
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe any symptoms you might be experiencing"
            className="mb-3 p-2 border border-gray-300 rounded"
            aria-label="Symptoms Description"
          />

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default TestSkinCancer;

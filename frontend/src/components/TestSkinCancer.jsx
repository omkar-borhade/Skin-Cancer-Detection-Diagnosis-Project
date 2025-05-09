import React, { useState, useEffect } from 'react'; // Import useEffect here
import { FaCamera,FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import FormBG from '/image/FormBG.jpg'; // Adjust the path as necessary
import axios from 'axios'; // Import Axios
import { useNavigate,useLocation } from 'react-router-dom'; // Import useNavigate from react-router-dom
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA
const reCAPTCHA = import.meta.env.VITE_RECAPTCHA
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
  const [captchaValid, setCaptchaValid] = useState(false); // State for CAPTCHA validation
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileError, setMobileError] = useState(''); // State for mobile number error
  const [sexError, setSexError] = useState(''); // State for sex error
  const [bloodGroupError, setBloodGroupError] = useState(''); // State for blood group error
  const [emailError, setEmailError] = useState(''); // State for email error
  const [symptomsError, setSymptomsError] = useState(''); // State for symptoms error
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation();
  
 

  useEffect(() => {
    if (location.state?.isEditMode) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [location.state]);
  // Load data from localStorage on component mount
  useEffect(() => {
    if (isEditMode) {
      const storedData = JSON.parse(localStorage.getItem('skinCancerFormData'));
      if (storedData) {
        setName(storedData.name);
        setAge(storedData.age);
        setSex(storedData.sex);
        setBloodGroup(storedData.bloodGroup);
        setMobileNumber(storedData.mobileNumber);
        setEmail(storedData.email);
        setAddress(storedData.address);
        setFamilyHistory(storedData.familyHistory);
        setSymptoms(storedData.symptoms);
        setSkinImages(storedData.skinImages || []);
      }
    } else {
      // If not in edit mode, clear data from state
      setName('');
      setAge('');
      setSex('');
      setBloodGroup('');
      setMobileNumber('');
      setEmail('');
      setAddress('');
      setFamilyHistory('');
      setSymptoms('');
      setSkinImages([]);
    }
  }, [isEditMode]);



   // Save data to localStorage whenever any form field changes
   const saveToLocalStorage = () => {
    const formData = {
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
    };
    localStorage.setItem('skinCancerFormData', JSON.stringify(formData));
  };
  

  // Form input change handlers (without changing your onChange structure)
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

  };
  
  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
  
  };

  const handleSexChange = (e) => {
    const value = e.target.value;
    setSex(value);
   
  };

  const handleBloodGroupChange = (e) => {
    const value = e.target.value;
    setBloodGroup(value);
    
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
   
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    
  };

  const handleFamilyHistoryChange = (e) => {
    const value = e.target.checked;
    setFamilyHistory(value);
    
  };

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    setSymptoms(value);
    
  };




 
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
  

    // Real-time validation for mobile number
    if (/^\d{10}$/.test(value) || value === '') {
      setMobileError(''); // Clear error if valid or empty
    } else {
      setMobileError(`${value} is not a valid mobile number!`);
    }
  };

// Function to handle file selection (Gallery)
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setSkinImages(files);  // Append new images
};

// Function to handle camera capture
const handleCameraCapture = (e) => {
  const files = Array.from(e.target.files);
  
  if (files.length > 0) {
    console.log("Captured image:", files[0]); // Debugging
    setSkinImages(files); // Append captured image
    e.target.value = ""; // Reset input to allow capturing new images
  }
};

// Trigger file input when clicking camera icon
const triggerCameraCapture = () => {
  document.getElementById("cameraInput").click();
};



 

  

  const onCaptchaChange = (value) => {
    setCaptchaValid(value ? true : false);
  };



  const validateForm = () => {
    let isValid = true;

    // Validate sex
    if (!sex) {
      setSexError('Sex is required.');
      isValid = false;
    } else {
      setSexError('');
    }

    // Validate blood group
    if (!bloodGroup) {
      setBloodGroupError('Blood group is required.');
      isValid = false;
    } else {
      setBloodGroupError('');
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate symptoms
    if (symptoms.length > 500) {
      setSymptomsError('Symptoms description cannot exceed 500 characters.');
      isValid = false;
    } else {
      setSymptomsError('');
    }

         // Validate skin images
  if (skinImages.length === 0) {
    alert('Please upload at least one image.');
    isValid = false;
   
  }

  if (skinImages.length > 1) {
    alert('You can only upload one image.');
    isValid = false;
    
  }else {
    setErrorMessage('');
  }

    // Validate mobile number
    if (mobileError) {
      setErrorMessage('Please correct the errors before submitting.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
  
    // First, validate the form and CAPTCHA
    if (!validateForm() || !captchaValid) {
      setErrorMessage('Please complete the CAPTCHA validation.');
      return; // If the form is invalid or CAPTCHA not validated, prevent submission
    }
  
    saveToLocalStorage(); // Call your function to save data to localStorage (if necessary)
  
    // Convert images to Base64
    const imagePromises = skinImages.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Onloadend will return the base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file); // Read image as Base64
      });
    });
  
    // Wait for all images to be converted to Base64
    Promise.all(imagePromises)
      .then((encodedImages) => {
        // Prepare the form data
        const formData = {
          name,
          age,
          sex,
          bloodGroup,
          mobileNumber,
          email,
          address,
          familyHistory,
          symptoms,
          skinImages: encodedImages, // Pass the Base64 images here
        };
  
        // Navigate to the confirmation page with the form data
        navigate('/confirmation', { state: formData });
      })
      .catch((error) => {
        setErrorMessage('Error converting images. Please try again.');
      });
  };
  
 
  

  return (
    <div 
    className="flex justify-start items-start min-h-screen p-2 sm:p-4 sm:pl-8 md:pl-44 bg-gray-100"
    style={{
      backgroundImage: `url(${FormBG})`,  
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      minHeight: '100vh',
    }}
  >
    <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md sm:ml-4 md:ml-20">
      <h2 className="text-center text-2xl mb-4">Test Your Skin Cancer Risk</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
  
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Full Name */}
        <div className="flex items-center mb-3">
          <FaUser className="mr-2 text-gray-500" />
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Full Name"
            required
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Full Name"
          />
        </div>
  
        {/* Age */}
        <div className="flex items-center mb-3">
          <FaCheckCircle className="mr-2 text-gray-500" />
          <input
            type="number"
            value={age}
            onChange={handleAgeChange}
            placeholder="Age"
            required
            min="1"
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Age"
          />
        </div>
  
        {/* Sex */}
        <select
          value={sex}
          onChange={handleSexChange} 
          required
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          aria-label="Sex"
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {sexError && <p className="text-red-500">{sexError}</p>}
  
        {/* Blood Group */}
        <select
          value={bloodGroup}
          onChange={handleBloodGroupChange}
          required
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          aria-label="Blood Group"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        {bloodGroupError && <p className="text-red-500">{bloodGroupError}</p>}
  
        {/* Mobile Number */}
        <div className="flex items-center mb-3">
          <FaPhone className="mr-2 text-gray-500" />
          <input
            type="text"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            placeholder="Mobile Number"
            required
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Mobile Number"
          />
        </div>
        {mobileError && <p className="text-red-500">{mobileError}</p>}
  
        {/* Email */}
        <div className="flex items-center mb-3">
          <FaEnvelope className="mr-2 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Email"
          />
        </div>
        {emailError && <p className="text-red-500">{emailError}</p>}
  
        {/* Address */}
        <div className="flex items-center mb-3">
          <FaMapMarkerAlt className="mr-2 text-gray-500" />
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Address"
            required
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Address"
          />
        </div>
  
        {/* Family History */}
        <div className="flex items-center mb-3">
          <label className="mr-2">Family History of Skin Cancer:</label>
          <input
            type="checkbox"
            checked={familyHistory}
            onChange={handleFamilyHistoryChange}
            aria-label="Family History"
          />
        </div>
  
        {/* Symptoms */}
        <textarea
          value={symptoms}
          onChange={handleSymptomsChange}
          placeholder="Describe Symptoms (max 500 characters)"
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          rows="4"
          maxLength="500"
          aria-label="Symptoms"
        />
        {symptomsError && <p className="text-red-500">{symptomsError}</p>}
  
          {/* Skin Images Upload */}
          <div className="mb-3 flex items-center space-x-3">
       <label className="flex items-center space-x-2 flex-1 border border-gray-300 p-2 rounded cursor-pointer">
         <FaFileUpload className="text-gray-500" />
         <span className="text-sm text-gray-600">Upload Images</span>
         <input
           type="file"
           accept="image/*"
           onChange={handleImageChange}
           multiple
           className="hidden"
           aria-label="Skin Images Upload"
         />
       </label>
     
       {/* Camera Button */}
       <button
         type="button"
         onClick={triggerCameraCapture}
         className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
         aria-label="Capture Image from Camera"
       >
         <FaCamera className="text-gray-500" />
       </button>
     
       {/* Hidden Input for Camera */}
       <input
         type="file"
         accept="image/*"
         capture="environment"
         onChange={handleCameraCapture}
         id="cameraInput"
         className="hidden"
         aria-label="Capture Image from Camera"
       />
     </div>
     
  
        {/* Google reCAPTCHA */}
        <div className="mb-3">
          <ReCAPTCHA
            sitekey={reCAPTCHA}
            onChange={onCaptchaChange}
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!captchaValid}
          className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${!captchaValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  
  );
}

export default TestSkinCancer;   


















// import React, { useState } from 'react';
// import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
// import FormBG from '/image/FormBG.jpg'; // Adjust the path as necessary
// import axios from 'axios'; // Import Axios
// import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA

// function TestSkinCancer() {
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [sex, setSex] = useState('');
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [skinImages, setSkinImages] = useState([]);
//   const [familyHistory, setFamilyHistory] = useState(false);
//   const [symptoms, setSymptoms] = useState('');
//   const [captchaValid, setCaptchaValid] = useState(false); // State for CAPTCHA validation
//   const [errorMessage, setErrorMessage] = useState('');
//   const [mobileError, setMobileError] = useState(''); // State for mobile number error
//   const [sexError, setSexError] = useState(''); // State for sex error
//   const [bloodGroupError, setBloodGroupError] = useState(''); // State for blood group error
//   const [emailError, setEmailError] = useState(''); // State for email error
//   const [symptomsError, setSymptomsError] = useState(''); // State for symptoms error

//   const navigate = useNavigate(); // Initialize the navigate function

//   const handleMobileNumberChange = (e) => {
//     const value = e.target.value;
//     setMobileNumber(value);

//     // Real-time validation for mobile number
//     if (/^\d{10}$/.test(value) || value === '') {
//       setMobileError(''); // Clear error if valid or empty
//     } else {
//       setMobileError(`${value} is not a valid mobile number!`);
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;

//     // Validate sex
//     if (!sex) {
//       setSexError('Sex is required.');
//       isValid = false;
//     } else {
//       setSexError('');
//     }

//     // Validate blood group
//     if (!bloodGroup) {
//       setBloodGroupError('Blood group is required.');
//       isValid = false;
//     } else {
//       setBloodGroupError('');
//     }

//     // Validate email
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError('');
//     }

//     // Validate symptoms
//     if (symptoms.length > 500) {
//       setSymptomsError('Symptoms description cannot exceed 500 characters.');
//       isValid = false;
//     } else {
//       setSymptomsError('');
//     }

//     // Validate skin images
//     if (skinImages.length > 5) {
//       setErrorMessage('You can only upload a maximum of 5 images.');
//       isValid = false;
//     } else {
//       setErrorMessage('');
//     }

//     // Validate mobile number
//     if (mobileError) {
//       setErrorMessage('Please correct the errors before submitting.');
//       isValid = false;
//     }

//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage(''); // Reset error message

//     if (!validateForm() || !captchaValid) {
//       setErrorMessage('Please complete the CAPTCHA validation.');
//       return; // If the form is invalid or CAPTCHA not validated, prevent submission
//     }

//     const formData = new FormData();
//     // Append your form data here
//     formData.append('name', name);
//     formData.append('age', age);
//     formData.append('sex', sex);
//     formData.append('bloodGroup', bloodGroup);
//     formData.append('mobileNumber', mobileNumber);
//     formData.append('email', email);
//     formData.append('address', address);
//     formData.append('familyHistory', familyHistory);
//     formData.append('symptoms', symptoms);

//     // Append skin images if any
//     if (skinImages.length > 0) {
//       for (let i = 0; i < skinImages.length; i++) {
//         formData.append('skinImages', skinImages[i]);
//       }
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/patients', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       if (response.status === 201) {
//         alert('Form submitted successfully!');

//         // Reset form fields after submission
//         resetForm();

//         // Navigate to the confirmation page with the patient data
//         navigate('/confirmation', { state: response.data.patient });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('Error submitting form. Please try again.'); // Set error message
//     }
//   };

//   const resetForm = () => {
//     setName('');
//     setAge('');
//     setSex('');
//     setBloodGroup('');
//     setMobileNumber('');
//     setEmail('');
//     setAddress('');
//     setSkinImages([]);
//     setFamilyHistory(false);
//     setSymptoms('');
//     setMobileError(''); // Reset mobile error state
//     setSexError(''); // Reset sex error state
//     setBloodGroupError(''); // Reset blood group error state
//     setEmailError(''); // Reset email error state
//     setSymptomsError(''); // Reset symptoms error state
//     setCaptchaValid(false); // Reset CAPTCHA validation
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSkinImages(files); // Store selected files directly
//   };

//   const onCaptchaChange = (value) => {
//     if (value) {
//       setCaptchaValid(true); // CAPTCHA is valid
//     } else {
//       setCaptchaValid(false); // CAPTCHA is invalid
//     }
//   };

//   return (
//     <div 
//       className="flex justify-start items-start min-h-screen p-2 pl-44 bg-gray-100"
//       style={{
//         backgroundImage: `url(${FormBG})`,  
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center',
//         width: '100vw',
//         minHeight: '100vh',
//       }}
//     >
//       <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md" style={{ marginLeft: '20px' }}>
//         <h2 className="text-center text-2xl mb-4">Test Your Skin Cancer Risk</h2>
//         {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>} {/* General Error Message */}
//         <form onSubmit={handleSubmit} className="flex flex-col">
//           {/* Full Name */}
//           <div className="flex items-center mb-3">
//             <FaUser className="mr-2 text-gray-500" />
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Full Name"
//               required
//               className="flex-1 p-2 border border-gray-300 rounded"
//               aria-label="Full Name"
//             />
//           </div>

//           {/* Age */}
//           <div className="flex items-center mb-3">
//             <FaCheckCircle className="mr-2 text-gray-500" />
//             <input
//               type="number"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//               placeholder="Age"
//               required
//               min="1" // Ensure age is at least 1
//               className="flex-1 p-2 border border-gray-300 rounded"
//               aria-label="Age"
//             />
//           </div>

//           {/* Sex */}
//           <select
//             value={sex}
//             onChange={(e) => setSex(e.target.value)}
//             required
//             className="mb-3 p-2 border border-gray-300 rounded"
//             aria-label="Sex"
//           >
//             <option value="">Select Sex</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//           {sexError && <p className="text-red-500">{sexError}</p>} {/* Sex Error Message */}

//           {/* Blood Group */}
//           <select
//             value={bloodGroup}
//             onChange={(e) => setBloodGroup(e.target.value)}
//             required
//             className="mb-3 p-2 border border-gray-300 rounded"
//             aria-label="Blood Group"
//           >
//             <option value="">Select Blood Group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//           </select>
//           {bloodGroupError && <p className="text-red-500">{bloodGroupError}</p>} {/* Blood Group Error Message */}

//           {/* Mobile Number */}
//           <div className="flex items-center mb-3">
//             <FaPhone className="mr-2 text-gray-500" />
//             <input
//               type="text"
//               value={mobileNumber}
//               onChange={handleMobileNumberChange}
//               placeholder="Mobile Number"
//               required
//               className="flex-1 p-2 border border-gray-300 rounded"
//               aria-label="Mobile Number"
//             />
//           </div>
//           {mobileError && <p className="text-red-500">{mobileError}</p>} {/* Mobile Error Message */}

//           {/* Email */}
//           <div className="flex items-center mb-3">
//             <FaEnvelope className="mr-2 text-gray-500" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               required
//               className="flex-1 p-2 border border-gray-300 rounded"
//               aria-label="Email"
//             />
//           </div>
//           {emailError && <p className="text-red-500">{emailError}</p>} {/* Email Error Message */}

//           {/* Address */}
//           <div className="flex items-center mb-3">
//             <FaMapMarkerAlt className="mr-2 text-gray-500" />
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Address"
//               required
//               className="flex-1 p-2 border border-gray-300 rounded"
//               aria-label="Address"
//             />
//           </div>

//           {/* Family History */}
//           <div className="flex items-center mb-3">
//             <label className="mr-2">Family History of Skin Cancer:</label>
//             <input
//               type="checkbox"
//               checked={familyHistory}
//               onChange={(e) => setFamilyHistory(e.target.checked)}
//               aria-label="Family History"
//             />
//           </div>

//           {/* Symptoms */}
//           <textarea
//             value={symptoms}
//             onChange={(e) => setSymptoms(e.target.value)}
//             placeholder="Describe Symptoms (max 500 characters)"
//             className="mb-3 p-2 border border-gray-300 rounded"
//             rows="4"
//             maxLength="500"
//             aria-label="Symptoms"
//           />
//           {symptomsError && <p className="text-red-500">{symptomsError}</p>} {/* Symptoms Error Message */}

//           {/* Skin Images Upload */}
//           <div className="mb-3">
//             <label className="flex items-center">
//               <FaFileUpload className="mr-2 text-gray-500" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 multiple
//                 className="p-2 border border-gray-300 rounded"
//                 aria-label="Skin Images Upload"
//               />
//             </label>
//           </div>

//           {/* Google reCAPTCHA */}
//           <div className="mb-3">
//             <ReCAPTCHA
//               sitekey="6LceDGIqAAAAADrHzceCTMGzQfNouvz-i2S0Kus3" // Replace with your site key
//               onChange={onCaptchaChange}
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={!captchaValid} // Disable submit button until CAPTCHA is validated
//             className={`bg-blue-500 text-white py-2 px-4 rounded ${!captchaValid ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TestSkinCancer;   

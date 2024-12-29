<<<<<<< HEAD
import React, { useState, useEffect } from 'react'; // Import useEffect here
=======
import React, { useState } from 'react';
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import FormBG from '/image/FormBG.jpg'; // Adjust the path as necessary
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
<<<<<<< HEAD
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA
=======
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

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
<<<<<<< HEAD
  const [captchaValid, setCaptchaValid] = useState(false); // State for CAPTCHA validation
=======
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileError, setMobileError] = useState(''); // State for mobile number error
  const [sexError, setSexError] = useState(''); // State for sex error
  const [bloodGroupError, setBloodGroupError] = useState(''); // State for blood group error
  const [emailError, setEmailError] = useState(''); // State for email error
  const [symptomsError, setSymptomsError] = useState(''); // State for symptoms error

<<<<<<< HEAD
  const navigate = useNavigate(); // Initialize the navigate function

  // Load data from localStorage on component mount
  useEffect(() => {
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
  }, []);


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
    saveToLocalStorage(); // Save to localStorage after every change
  };
  
  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleSexChange = (e) => {
    const value = e.target.value;
    setSex(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleBloodGroupChange = (e) => {
    const value = e.target.value;
    setBloodGroup(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleFamilyHistoryChange = (e) => {
    const value = e.target.checked;
    setFamilyHistory(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    setSymptoms(value);
    saveToLocalStorage(); // Save to localStorage after every change
  };




 
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
    saveToLocalStorage();
=======
  // Initialize the navigate function
  const navigate = useNavigate(); 

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

    // Real-time validation for mobile number
    if (/^\d{10}$/.test(value) || value === '') {
      setMobileError(''); // Clear error if valid or empty
    } else {
      setMobileError(`${value} is not a valid mobile number!`);
    }
  };

<<<<<<< HEAD

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSkinImages(files); // Store selected files directly
    
  };

  const onCaptchaChange = (value) => {
    setCaptchaValid(value ? true : false);
  };



=======
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
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
<<<<<<< HEAD
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }
=======
  setEmailError('Please enter a valid email address.');
  isValid = false;
} else {
  setEmailError('');
}

>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

    // Validate symptoms
    if (symptoms.length > 500) {
      setSymptomsError('Symptoms description cannot exceed 500 characters.');
      isValid = false;
    } else {
      setSymptomsError('');
    }

<<<<<<< HEAD
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
=======
    // Validate skin images
    if (skinImages.length > 5) {
      setErrorMessage('You can only upload a maximum of 5 images.');
      isValid = false;
    } else {
      setErrorMessage('');
    }
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

    // Validate mobile number
    if (mobileError) {
      setErrorMessage('Please correct the errors before submitting.');
      isValid = false;
    }

    return isValid;
  };

<<<<<<< HEAD
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    if (!validateForm() || !captchaValid) {
      setErrorMessage('Please complete the CAPTCHA validation.');
      return; // If the form is invalid or CAPTCHA not validated, prevent submission
    }

    // Convert images to Base64
    const imagePromises = skinImages.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Onloadend will return the base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file); // Read image as Base64
      });
    });

    Promise.all(imagePromises)
      .then((encodedImages) => {
        // Pass form data along with Base64 images to the next page
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

        navigate('/confirmation', { state: formData }); // Send data to the next page
      })
      .catch((error) => {
        setErrorMessage('Error converting images. Please try again.');
      });
  };

 
  
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    if (!validateForm()) {
      return; // If the form is invalid, prevent submission
    }

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
    setMobileError(''); // Reset mobile error state
    setSexError(''); // Reset sex error state
    setBloodGroupError(''); // Reset blood group error state
    setEmailError(''); // Reset email error state
    setSymptomsError(''); // Reset symptoms error state
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSkinImages(files); // Store selected files directly
  };
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

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
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>} {/* General Error Message */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Full Name */}
          <div className="flex items-center mb-3">
            <FaUser className="mr-2 text-gray-500" />
            <input
              type="text"
              value={name}
<<<<<<< HEAD
              onChange={handleNameChange}
=======
              onChange={(e) => setName(e.target.value)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
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
<<<<<<< HEAD
              onChange={handleAgeChange}
=======
              onChange={(e) => setAge(e.target.value)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
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
<<<<<<< HEAD
            onChange={handleSexChange} 
=======
            onChange={(e) => setSex(e.target.value)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
            required
            className="mb-3 p-2 border border-gray-300 rounded"
            aria-label="Sex"
          >
<<<<<<< HEAD
            <option value="">Select Sex</option>
=======
            <option value="" disabled>Select Sex</option>
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
<<<<<<< HEAD
          {sexError && <p className="text-red-500">{sexError}</p>} {/* Sex Error Message */}
=======
          {sexError && <p className="text-red-500">{sexError}</p>} {/* Sex error message */}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

          {/* Blood Group */}
          <select
            value={bloodGroup}
<<<<<<< HEAD
            onChange={handleBloodGroupChange}
=======
            onChange={(e) => setBloodGroup(e.target.value)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
            required
            className="mb-3 p-2 border border-gray-300 rounded"
            aria-label="Blood Group"
          >
<<<<<<< HEAD
            <option value="">Select Blood Group</option>
=======
            <option value="" disabled>Select Blood Group</option>
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
<<<<<<< HEAD
          {bloodGroupError && <p className="text-red-500">{bloodGroupError}</p>} {/* Blood Group Error Message */}
=======
          {bloodGroupError && <p className="text-red-500">{bloodGroupError}</p>} {/* Blood group error message */}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

          {/* Mobile Number */}
          <div className="flex items-center mb-3">
            <FaPhone className="mr-2 text-gray-500" />
            <input
              type="text"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              placeholder="Mobile Number"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Mobile Number"
            />
          </div>
<<<<<<< HEAD
          {mobileError && <p className="text-red-500">{mobileError}</p>} {/* Mobile Error Message */}
=======
          {mobileError && <p className="text-red-500">{mobileError}</p>} {/* Mobile number error message */}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

          {/* Email */}
          <div className="flex items-center mb-3">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              value={email}
<<<<<<< HEAD
              onChange={handleEmailChange }
=======
              onChange={(e) => setEmail(e.target.value)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
              placeholder="Email"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Email"
            />
          </div>
<<<<<<< HEAD
          {emailError && <p className="text-red-500">{emailError}</p>} {/* Email Error Message */}
=======
          {emailError && <p className="text-red-500">{emailError}</p>} {/* Email error message */}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

          {/* Address */}
          <div className="flex items-center mb-3">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <input
              type="text"
              value={address}
<<<<<<< HEAD
              onChange={handleAddressChange  }
              placeholder="Address"
              required
=======
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
              className="flex-1 p-2 border border-gray-300 rounded"
              aria-label="Address"
            />
          </div>

<<<<<<< HEAD
=======
          {/* Skin Images Upload */}
          <div className="mb-3">
            <label className="block mb-1 text-gray-600" htmlFor="skinImages">
              Upload Skin Images (Max: 5)
            </label>
            <input
              type="file"
              id="skinImages"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded p-1"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Skin images error message */}
          </div>

>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
          {/* Family History */}
          <div className="flex items-center mb-3">
            <label className="mr-2">Family History of Skin Cancer:</label>
            <input
              type="checkbox"
              checked={familyHistory}
<<<<<<< HEAD
              onChange={handleFamilyHistoryChange   }
              aria-label="Family History"
=======
              onChange={() => setFamilyHistory(!familyHistory)}
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
            />
          </div>

          {/* Symptoms */}
          <textarea
            value={symptoms}
<<<<<<< HEAD
            onChange={handleSymptomsChange    }
            placeholder="Describe Symptoms (max 500 characters)"
            className="mb-3 p-2 border border-gray-300 rounded"
            rows="4"
            maxLength="500"
            aria-label="Symptoms"
          />
          {symptomsError && <p className="text-red-500">{symptomsError}</p>} {/* Symptoms Error Message */}

          {/* Skin Images Upload */}
          <div className="mb-3">
            <label className="flex items-center">
              <FaFileUpload className="mr-2 text-gray-500" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="p-2 border border-gray-300 rounded"
                aria-label="Skin Images Upload"
              />
            </label>
          </div>

          {/* Google reCAPTCHA */}
          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6LceDGIqAAAAADrHzceCTMGzQfNouvz-i2S0Kus3" // Replace with your site key
              onChange={onCaptchaChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!captchaValid} // Disable submit button until CAPTCHA is validated
            className={`bg-blue-500 text-white py-2 px-4 rounded ${!captchaValid ? 'opacity-50 cursor-not-allowed' : ''}`}
=======
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe Symptoms (max 500 characters)"
            maxLength={500}
            className="mb-3 p-2 border border-gray-300 rounded"
            aria-label="Symptoms"
          />
          {symptomsError && <p className="text-red-500">{symptomsError}</p>} {/* Symptoms error message */}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

<<<<<<< HEAD
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
=======
export default TestSkinCancer;
>>>>>>> 14151cd0019b48fb9a9b7558209e3fb3a1483fa6

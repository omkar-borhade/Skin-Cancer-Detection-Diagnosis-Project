import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confirmationbg from '/image/confirnmationbg.jpg';
const Confirmation = () => {
// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_MOBILE;

    
console.log("aa",apiUrl)
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true); // State to track if the image is valid
  const formData = location.state;
  
  const isSkinPixelMethod1 = (r, g, b) => {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    return y > 80 && y < 240 && cb > 85 && cb < 135 && cr > 135 && cr < 180;
  };
  
  const isSkinPixelMethod2 = (r, g, b) => {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  
    console.log(`RGB(${r}, ${g}, ${b}) -> Y: ${y}, Cb: ${cb}, Cr: ${cr}`);
    return y > 60 && y < 250 && cb > 80 && cb < 140 && cr > 130 && cr < 185;
  };
  
  const isSkinPixelMethod3 = (r, g, b) => {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  
    console.log(`RGB(${r}, ${g}, ${b}) -> Y: ${y.toFixed(2)}, Cb: ${cb.toFixed(2)}, Cr: ${cr.toFixed(2)}`);
    return y > 60 && y < 250 && cb > 80 && cb < 140 && cr > 130 && cr < 185;
  };
  
  const checkCornersForSkin = (pixels, width, height) => {
    const cornerPixels = [
      { x: 0, y: 0 }, // Top-left corner
      { x: width - 1, y: 0 }, // Top-right corner
      { x: 0, y: height - 1 }, // Bottom-left corner
      { x: width - 1, y: height - 1 }, // Bottom-right corner
      { x: Math.floor(width / 2), y: Math.floor(height / 2) }, // Center
    ];
  
    for (const point of cornerPixels) {
      const index = (point.y * width + point.x) * 4; // Assuming RGBA format
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
  
      console.log(`Checking point (${point.x}, ${point.y})`);
  
      // Count how many methods agree
      let skinVotes = 0;
      if (isSkinPixelMethod1(r, g, b)) skinVotes++;
      if (isSkinPixelMethod2(r, g, b)) skinVotes++;
      if (isSkinPixelMethod3(r, g, b)) skinVotes++;
  
      if (skinVotes >= 2) {
        console.log(`Skin pixel detected at (${point.x}, ${point.y}) by majority.`);
        return true;
      }
    }
  
    console.log("No skin pixels detected in the sampled regions.");
    return false;
  };
  
  
  const handleEdit = () => {
    // Go back to the form page, with the data kept intact (since it's in localStorage)
    navigate('/test-skin-cancer',{ state: { isEditMode: true } });
  };
  const handleConfirm = async () => {
    setLoading(true);
    setIsImageValid(true);
    
// Show the loading toast notification at the top-center
const loadingToast = toast.loading('Submitting data...', {
  position: "top-center",
  style: {
    backgroundColor: "linear-gradient(45deg, #FF6A00, #FF3D00)", // Gradient for modern look
    color: "white",
    fontSize: "16px",
    borderRadius: "10px", // Rounded corners for sleek design
    padding: "12px 20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
  },
  icon: (
    <div className="relative w-10 h-10">
      <div className="absolute border-t-4 border-l-4 border-r-4 border-b-4 border-t-transparent border-l-transparent border-r-transparent border-b-white rounded-full animate-spin w-full h-full"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
        <span>⏳</span> {/* You can use any emoji or text here */}
      </div>
    </div>
  ), // Custom spinner with an emoji or symbol
  closeOnClick: false, // Prevent closing by clicking
  draggable: false, // Disable dragging
  pauseOnHover: false, // Do not pause on hover
  autoClose: false, // Keep open until completion
});

// To remove the loading toast when submission is complete
toast.update(loadingToast, {
  render: 'Analyzing skin image.....',
  type: 'success',
  isLoading: false,
  style: {
    background: 'linear-gradient(135deg, #28a745, #85e085)', // Success gradient
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
  },
});


    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('age', formData.age);
      form.append('sex', formData.sex);
      form.append('bloodGroup', formData.bloodGroup);
      form.append('mobileNumber', formData.mobileNumber);
      form.append('email', formData.email);
      form.append('address', formData.address || 'N/A');
      form.append('familyHistory', formData.familyHistory ? 'Yes' : 'No');
      form.append('symptoms', formData.symptoms || 'N/A');

      if (formData.skinImages && formData.skinImages.length > 0) {
        const base64String = formData.skinImages[0];
        const base64Data = base64String.split(",")[1];
        const binaryData = atob(base64Data);
        const binaryArray = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
          binaryArray[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([binaryArray], { type: 'image/jpeg' });

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedBlob = await imageCompression(blob, options);

        const img = new Image();
        img.src = URL.createObjectURL(compressedBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixels = imageData.data;

          const isCornerSkinDetected = checkCornersForSkin(pixels, img.width, img.height);

          if (!isCornerSkinDetected) {
            setIsImageValid(false);
          
            // Show a centered error toast with a modern design
            toast.error(
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center bg-red-500 text-white rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M12 12v.01M21.88 19.14c.35.58.52 1.26.46 1.95a3.8 3.8 0 01-1.44 2.51c-.59.4-1.28.61-1.99.61h-9c-.71 0-1.4-.21-1.99-.61a3.8 3.8 0 01-1.44-2.51c-.06-.69.11-1.37.46-1.95m3.44-13.3C6.84 4.61 8.53 3 10.66 3h2.68c2.13 0 3.82 1.61 3.88 3.84l.07 8.17c.02.95-.74 1.73-1.69 1.73h-7.6c-.94 0-1.71-.78-1.69-1.73l.07-8.17z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">Invalid Image</h3>
                <p className="text-sm text-gray-300 text-center">
                  This image is not recognized as a skin image. Please upload a valid skin image.
                </p>
              </div>,
              {
                position: "top-center", // Centered at the top
                style: {
                  background: "black", // Black background
                  color: "white",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Add depth with shadow
                  maxWidth: "400px", // Constrain width for a compact look
                  margin: "0 auto", // Center horizontally
                },
                closeOnClick: true, // Allow closing by clicking
                draggable: false, // Prevent dragging
                autoClose: 2000, // Close automatically after 5 seconds
                hideProgressBar: true, // Hide progress bar for simplicity
              }
            );
          
            setLoading(false);
            toast.dismiss(loadingToast); // Dismiss the loading toast on error
            return;
          }
          

          const compressedFileName = `${formData.name.replace(/\s+/g, '_')}_${formData.email.replace('@', '_at_').replace(/\./g, '_dot_')}.jpg`;
          form.append('skinImages', compressedBlob, compressedFileName);

          axios.post(`${apiUrl}/api/patients`, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(response => {
              if (response.status === 201) {
                toast.success('Data successfully submitted!');
                navigate('/test-images', {
                  state: {
                    skinImages: formData.skinImages,
                    prediction: response.data.prediction.predictions,
                    patient: response.data.patient,
                  },
                });
              } else {
                toast.error('There was an issue submitting your data.');
              }
            })
            .catch(error => {
              toast.error('Failed to submit data. Please try again.');
              console.error('Error during submission:', error);
            })
            .finally(() => {
              setLoading(false);
              toast.dismiss(loadingToast); // Dismiss the loading toast after completion
            });
        };
      }
    } catch (error) {
      toast.error('Failed to submit data. Please try again.');
      console.error('Error during submission:', error);
      setLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast on error
    }
  };

  return (
    <div
  className="flex justify-center items-start min-h-screen p-4 bg-cover bg-center"
  style={{
          backgroundImage: `url(${confirmationbg})`,  
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '100vw',
          minHeight: '100vh',
        }}
>
      
      <ToastContainer />
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
            <p><strong>Family History:</strong> {formData.familyHistory ? 'Yes' : 'No'}</p>
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

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleConfirm}
            className={`py-2 px-4 rounded ${
              loading
                ? 'bg-green-200 cursor-not-allowed'
                : isImageValid
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-200 cursor-not-allowed '
            }`}
            disabled={loading || !isImageValid}
          >
            {loading ? (
              'Submited..'
            ) : (
              'Confirm'
            )}
          </button>
        </div>

        <div className="mt-4">
  <button
    onClick={handleEdit}
    className={`bg-yellow-500 text-white py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
    disabled={loading}
  >
    Edit
  </button>
</div>

      </div>
    </div>
  );
};

export default Confirmation;






// import React, { useState } from 'react';
// import imageCompression from 'browser-image-compression';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Confirmation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showPopUp, setShowPopUp] = useState(false);  // State to control the pop-up
//   const [isImageValid, setIsImageValid] = useState(true);  // State to track if the image is valid
//   const formData = location.state;

//   const isSkinPixel = (r, g, b) => {
//     // Skin tone range (example for RGB, can be adjusted)
//     return r > 95 && g > 40 && b > 20 && r < 220 && g < 180 && b < 130;
//   };

//   const handleConfirm = async () => {
//     setLoading(true);
//     setErrorMessage('');
//     setShowPopUp(false); // Hide the pop-up initially
//     setIsImageValid(true); // Reset the image validity state

//     try {
//       // Create a new FormData object
//       const form = new FormData();
//       form.append('name', formData.name);
//       form.append('age', formData.age);
//       form.append('sex', formData.sex);
//       form.append('bloodGroup', formData.bloodGroup);
//       form.append('mobileNumber', formData.mobileNumber);
//       form.append('email', formData.email);
//       form.append('address', formData.address || 'N/A');
//       form.append('familyHistory', formData.familyHistory ? 'Yes' : 'No');
//       form.append('symptoms', formData.symptoms || 'N/A');

//       if (formData.skinImages && formData.skinImages.length > 0) {
//         const base64String = formData.skinImages[0]; // Get the first image (Base64 string)
//         const base64Data = base64String.split(",")[1]; // Removes 'data:image/jpeg;base64,'

//         const binaryData = atob(base64Data); // Decode Base64 to binary string
//         const binaryArray = new Uint8Array(binaryData.length);

//         for (let i = 0; i < binaryData.length; i++) {
//           binaryArray[i] = binaryData.charCodeAt(i); // Convert each char to its byte equivalent
//         }

//         const blob = new Blob([binaryArray], { type: 'image/jpeg' });

//         // Compress the image Blob
//         const options = {
//           maxSizeMB: 1,
//           maxWidthOrHeight: 1024,
//           useWebWorker: true,
//         };

//         const compressedBlob = await imageCompression(blob, options);

//         const img = new Image();
//         img.src = URL.createObjectURL(compressedBlob);

//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.width = img.width;
//           canvas.height = img.height;
//           ctx.drawImage(img, 0, 0);

//           const imageData = ctx.getImageData(0, 0, img.width, img.height);
//           const pixels = imageData.data;
//           let skinPixelCount = 0;
//           let totalPixelCount = pixels.length / 4;

//           for (let i = 0; i < pixels.length; i += 4) {
//             const r = pixels[i]; // Red
//             const g = pixels[i + 1]; // Green
//             const b = pixels[i + 2]; // Blue

//             if (isSkinPixel(r, g, b)) {
//               skinPixelCount++;
//             }
//           }

//           const skinPercentage = (skinPixelCount / totalPixelCount) * 100;
//           console.log(`Skin pixel percentage: ${skinPercentage}%`);

//           // If the skin percentage is low, show the pop-up and disable the Confirm button
//           if (skinPercentage < 20) {  // Threshold for "skin" image
//             setIsImageValid(false);  // Mark the image as invalid
//             setShowPopUp(true);  // Show the pop-up modal
//             setLoading(false);  // Stop loading state
//             return;  // Stop further execution if it's not a skin image
//           }

//           const compressedFileName = `${formData.name.replace(/\s+/g, '_')}_${formData.email.replace('@', '_at_').replace(/\./g, '_dot_')}.jpg`;
//           form.append('skinImages', compressedBlob, compressedFileName);

//           // Send the FormData object to the backend
//           axios.post('${apiUrl}/api/patients', form, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//             .then(response => {
//               if (response.status === 201) {
//                 console.log(response.data.patient);
//                 alert('Data successfully submitted!');
//                 navigate('/test-images', {
//                   state: {
//                     skinImages: formData.skinImages,
//                     prediction: response.data.prediction.predictions,
//                     patient: response.data.patient,
//                   },
//                 });
//               } else {
//                 setErrorMessage('There was an issue submitting your data.');
//               }
//             })
//             .catch(error => {
//               setErrorMessage('Failed to submit data. Please try again.');
//               console.error('Error during submission:', error);
//             })
//             .finally(() => {
//               setLoading(false);
//             });
//         };
//       }
//     } catch (error) {
//       setErrorMessage('Failed to submit data. Please try again.');
//       console.error('Error during submission:', error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
//       <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-center text-2xl mb-4">Submitted Form Data</h2>
//         {formData ? (
//           <>
//             <p><strong>Name:</strong> {formData.name}</p>
//             <p><strong>Age:</strong> {formData.age}</p>
//             <p><strong>Sex:</strong> {formData.sex}</p>
//             <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
//             <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
//             <p><strong>Email:</strong> {formData.email}</p>
//             <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
//             <p><strong>Family History of Skin Cancer:</strong> {formData.familyHistory ? 'Yes' : 'No'}</p>
//             <p><strong>Symptoms:</strong> {formData.symptoms || 'N/A'}</p>

//             {formData.skinImages && formData.skinImages.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="text-lg font-bold">Uploaded Images:</h3>
//                 <div className="flex flex-wrap">
//                   {formData.skinImages.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Skin image ${index + 1}`}
//                       className="w-32 h-32 object-cover m-2 border border-gray-300 rounded"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <p>No data submitted. Please go back to the form.</p>
//         )}

//         {errorMessage && (
//           <div className="text-red-500 text-center mt-4">
//             {errorMessage}
//           </div>
//         )}

//         <div className="mt-4">
//           <button
//             onClick={handleConfirm}
//             className="bg-green-500 text-white py-2 px-4 rounded mr-2 flex items-center justify-center"
//             disabled={loading || !isImageValid}  // Disable button if image is invalid
//           >
//             {loading ? (
//               <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
//             ) : (
//               'Confirm'
//             )}
//           </button>
//         </div>

//         {showPopUp && (
//           <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded shadow-md">
//               <p className="text-xl">This image is not recognized as a skin image. Please upload a valid skin image.</p>
//               <button
//                 onClick={() => setShowPopUp(false)}
//                 className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-yellow-500 text-white py-2 px-4 rounded"
//           >
//             Edit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Confirmation;

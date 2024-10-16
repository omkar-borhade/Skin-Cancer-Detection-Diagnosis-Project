import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TestImages = () => {
  const location = useLocation();
  const { skinImages } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    // Simulate an image testing/loading process
    const timer = setTimeout(() => {
      setIsLoading(false); // Stop loading after 2 seconds

      // If there are no skin images, simulate "no results" case
      if (!skinImages || skinImages.length === 0) {
        setNoResults(true);
      }
    }, 2000);

    // Cleanup the timer when component unmounts
    return () => clearTimeout(timer);
  }, [skinImages]);

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="bg-white bg-opacity-100 p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-center text-2xl mb-4">Image Testing</h2>

        {isLoading ? (
          // Show circular loading spinner
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : noResults ? (
          // No images or no results available after testing
          <p className="text-center text-red-500 font-semibold">
            No images available for testing or no results found.
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TestImages;

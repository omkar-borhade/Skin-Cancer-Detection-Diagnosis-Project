import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const media = [
  '/image/image1.jpg',
  'https://www.mocindia.co.in/uploads/images/video_home.mp4',
  '/image/image3.jpg'
];

function Carousel() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
        setFade(false);
      }, 500);
    }, currentIndex === 1 ? 7000 : 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    navigate("/test-skin-cancer");
  };

  return (
    <div className="relative w-full">
      <div className={`transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}>
        {currentIndex === 1 ? (
          <video
            src={media[currentIndex]}
            autoPlay
            loop
            muted
            className="w-full h-auto max-h-[35rem] object-cover sm:max-h-[30rem]"
          />
        ) : (
          <img 
            src={media[currentIndex]} 
            alt="Skin Cancer Awareness" 
            className="w-full h-auto max-h-[35rem] object-cover sm:max-h-[30rem]"
          />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center sm:items-start p-4 sm:pl-32">
        <h2 className="text-4xl sm:text-6xl font-bold text-blue-600 text-center sm:text-left">
          Care You Can Trust
        </h2>
        <p className="text-lg sm:text-xl text-gray-900 text-center sm:text-left">
          Convenient access to quality healthcare.
        </p>

        {isLoggedIn ? (
          <button
            className="mt-4 px-6 py-3 rounded-lg bg-pink-500 text-white text-lg font-semibold transition-all duration-300 ease-in-out transform hover:bg-pink-600 hover:scale-105 animate-pulse"
            onClick={handleOpenModal}
          >
            Test Your Skin
          </button>
        ) : (
          <Link to="/login?redirect=/test-skin-cancer">
            <button className="mt-4 px-6 py-3 rounded-lg bg-pink-500 text-white text-lg font-semibold transition-all duration-300 ease-in-out transform hover:bg-pink-600 hover:scale-105 animate-pulse">
              Login to Test Skin
            </button>
          </Link>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg transform transition-all duration-300 ease-in-out scale-95 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-3 text-blue-600">📸 Image & Camera Instructions</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li>📷 Ensure good lighting for clear skin images.</li>
              <li>📏 Hold the camera <span className="font-semibold text-blue-500">15-20 cm away</span> from the skin.</li>
              <li>☀️ Avoid shadows and reflections.</li>
              <li>🔍 Ensure the affected area is fully visible.</li>
              <li>🖼️ Use a <span className="font-semibold text-blue-500">plain background</span> for better accuracy.</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 mr-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;

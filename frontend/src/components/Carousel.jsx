import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import Redux hook

const media = [
  '/image/image1.jpg',
  'https://www.mocindia.co.in/uploads/images/video_home.mp4', // Video URL
  '/image/image3.jpg'
];

function Carousel() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux
  const [currentIndex, setCurrentIndex] = useState(0); // State for current media index
  const [fade, setFade] = useState(false); // State for smooth fade effect
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme toggle
  const [buttonColor, setButtonColor] = useState('bg-pink-500'); // State for button color toggle

  // Check if the user prefers dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Function to toggle button color
  useEffect(() => {
    const colorToggleInterval = setInterval(() => {
      setButtonColor((prevColor) =>
        prevColor === 'bg-pink-400' ? 'bg-pink-600' : 'bg-pink-400'
      );
    }, 400); // Change color every 1.5 seconds

    return () => clearInterval(colorToggleInterval); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(true); // Trigger fade out effect
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length); // Change media
        setFade(false); // Reset fade for fade in effect
      }, 500); // Fade out for 500ms before changing
    }, currentIndex === 1 ? 7000 : 3000); // 7 seconds for video, 3 seconds for images

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [currentIndex]); // Add currentIndex as a dependency

  return (
    <div className="relative w-full">
      <div className={`transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}>
        {currentIndex === 1 ? ( // Check if current index is for video
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
        <h2 className="text-4xl sm:text-6xl font-bold text-blue-600 text-center sm:text-left">Care you can trust</h2>
        <p className="text-lg sm:text-xl text-gray-900 text-center sm:text-left">Convenient access to quality healthcare.</p>

        {isLoggedIn ? (
          <Link to="/test-skin-cancer">
            <button 
              className={`mt-4 px-4 py-2 rounded-lg transition duration-200 ${buttonColor} text-white`}
            >
              Test Your Skin
            </button>
          </Link>
        ) : (
          <Link to="/login?redirect=/test-skin-cancer">
            <button 
              className={`mt-4 px-4 py-2 rounded-lg transition duration-200 ${buttonColor} text-white`}
            >
              Login to Test Skin
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Carousel;

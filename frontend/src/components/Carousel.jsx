import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import Redux hook

const images = [
  '/image/image1.jpg',
];

function Carousel() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux

  return (
    <div className="relative w-full">
      <img 
        src={images[0]} 
        alt="Skin Cancer Awareness" 
        className="w-full h-auto max-h-[25rem] object-cover" 
      />

      <div className="absolute inset-0 flex flex-col justify-center items-start p-4 pl-32">
        <h2 className="text-5xl font-bold text-blue-600">Care you can trust</h2>
        <p className="text-lg text-white">Convenient access to quality healthcare.</p>
        
        {isLoggedIn ? (
          <Link to="/test-skin-cancer">
            <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200">
              Test Your Skin
            </button>
          </Link>
        ) : (
          <Link to="/login?redirect=/test-skin-cancer">
  <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200">
    Login to Test Skin
  </button>
</Link>
        )}
      </div>
    </div>
  );
}

export default Carousel;

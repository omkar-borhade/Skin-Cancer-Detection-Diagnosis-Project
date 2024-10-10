// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Icon */}
        <div className="flex items-center">
          <img
            src="/image/Logo.png" // Replace with your icon path
            alt="Logo"
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold">Skin Cancer Detection</h1>
        </div>
        
        {/* Right Menu Items */}
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
          <Link to="/doctors" className="text-gray-700 hover:text-blue-500">Our Doctors</Link> {/* Updated link */}
          <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

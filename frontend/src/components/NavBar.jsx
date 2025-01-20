import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../features/auth/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate hook
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/'); // Redirect to homepage after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the mobile menu visibility
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6"> {/* Increased space-x-3 to space-x-6 for more gap */}
          <img src="/image/Logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Skin Cancer Detection</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
            <Link to="/nearby" className="text-gray-700 hover:text-blue-500">Near By Hospital</Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
              onClick={toggleMenu} // Toggle the menu on button click
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Hidden on larger screens) */}
      <div className={`md:hidden bg-white shadow-md space-y-4 px-4 py-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <Link to="/" className="text-gray-700 hover:text-blue-500 block">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-500 block">About</Link>
        <Link to="/nearby" className="text-gray-700 hover:text-blue-500 block">Near By Hospital</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-500 block">Profile</Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500 block">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-500 block">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

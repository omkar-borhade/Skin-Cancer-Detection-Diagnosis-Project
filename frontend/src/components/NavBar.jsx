import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Use Redux hooks
import { logoutSuccess } from '../features/auth/authSlice'; // Import logout action

function Navbar() {
  const dispatch = useDispatch(); // Dispatch function
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status from Redux
  const user = useSelector((state) => state.auth.user); // Get user data from Redux

  const handleLogout = () => {
    dispatch(logoutSuccess()); // Dispatch the logout action to Redux
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/image/Logo.png" alt="Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">Skin Cancer Detection</h1>
        </div>

        <div className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
          <Link to="/doctors" className="text-gray-700 hover:text-blue-500">Our Doctors</Link>

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
      </div>
    </nav>
  );
}

export default Navbar;

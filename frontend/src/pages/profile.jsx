// src/pages/Profile.js
import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((state) => state.auth.user); // Access user data from Redux store

  if (!user) {
    return <p className="text-center text-gray-600">No user information available.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-700">Your Profile</h2>
        <p className="text-lg text-gray-500">Here are your details</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <strong className="text-xl text-gray-700">Name:</strong>
            <span className="text-lg text-gray-900">{user.name}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <strong className="text-xl text-gray-700">Email:</strong>
            <span className="text-lg text-gray-900">{user.email}</span>
          </div>
        </div>
        {/* Add more user fields as needed */}
      </div>
    </div>
  );
};

export default Profile;

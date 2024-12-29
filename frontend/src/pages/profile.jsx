// src/pages/Profile.js
import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((state) => state.auth.user); // Access user data from Redux store

  if (!user) {
    return <p className="text-center">No user information available.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <strong>Name:</strong> {user.name}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {user.email}
      </div>
      {/* Add more user fields as needed */}
      <div className="mt-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => {
            // Add logic to edit the profile or navigate to edit page
            console.log('Edit Profile Clicked');
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;

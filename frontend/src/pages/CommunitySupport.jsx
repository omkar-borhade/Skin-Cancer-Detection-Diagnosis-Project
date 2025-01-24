// src/pages/CommunitySupport.js
import React from 'react';

const CommunitySupport = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 md:text-4xl">Community Support</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <p className="mb-4 text-lg md:text-xl">
          If you need support, please contact us through our community forum or reach out directly via email.
        </p>
        <p className="font-semibold text-lg md:text-xl">Community Forum:</p>
        <p className="mb-4 text-lg md:text-xl">
          <a href="https://community.yourwebsite.com" className="text-blue-600 hover:underline">
            community.yourwebsite.com
          </a>
        </p>
        <p className="font-semibold text-lg md:text-xl">Email:</p>
        <p className="text-lg md:text-xl">
          <a href="mailto:support@yourwebsite.com" className="text-blue-600 hover:underline">
            support@yourwebsite.com
          </a>
        </p>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-lg md:text-xl">Join our community and help others by sharing your experiences!</p>
      </div>
    </div>
  );
};

export default CommunitySupport;

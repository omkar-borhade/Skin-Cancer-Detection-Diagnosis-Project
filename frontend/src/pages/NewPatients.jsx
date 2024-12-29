// src/pages/NewPatients.js
import React from 'react';

const NewPatients = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Welcome New Patients</h1>
        <p className="mb-4 text-gray-600 text-center">
          We're glad to have you! Here are some important resources to get started:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <a
              href="/faq"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              Frequently Asked Questions
            </a>
          </li>
          <li>
            <a
              href="/privacy-policy"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/terms-and-conditions"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              Terms and Conditions
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          If you have any questions, feel free to <a href="/contact" className="text-blue-500 hover:text-blue-700">contact us</a>.
        </p>
      </div>
    </div>
  );
};

export default NewPatients;

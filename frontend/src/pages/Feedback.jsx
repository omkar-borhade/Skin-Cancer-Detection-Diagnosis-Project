// src/pages/Feedback.jsx
import React, { useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">We Value Your Feedback</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback..."
          required
        />
        <button
          type="submit"
          className="mt-4 w-1/3 px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;

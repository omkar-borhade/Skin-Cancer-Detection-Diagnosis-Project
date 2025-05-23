// src/pages/ContactUs.js
import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add form submission logic here (e.g., API call)
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form after submission
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 sm:text-3xl">Contact Us</h2>
        {submitted ? (
          <div className="text-center text-green-600">
            <h3 className="text-lg font-semibold">Thank you for contacting us!</h3>
            <p>We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                placeholder="Subject"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="message">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                rows="4"
                placeholder="Your Message"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;

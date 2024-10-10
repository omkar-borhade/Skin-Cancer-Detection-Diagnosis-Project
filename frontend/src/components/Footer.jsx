// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Changed to a grid layout with 4 columns */}
          {/* Skin Cancer Services Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center">Skin Cancer Services</h2>
            <ul className="text-center space-y-2">
              <li>Skin Cancer Screening</li>
              <li>Diagnosis and Treatment</li>
              <li>Early Detection Programs</li>
              <li>Telehealth Consultations</li>
              <li>Patient Education Resources</li>
              <li>Support for Patients and Families</li>
            </ul>
          </div>

          {/* Patient Information Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center">Patient Information</h2>
            <ul className="text-center space-y-2">
              <li>New Patients</li>
              <li>Feedback</li>
              <li>Appointments & Fees</li>
              <li>Map & Parking</li>
              <li>Book an Appointment</li>
            </ul>
          </div>

          {/* Additional Links Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center">Additional Links</h2>
            <ul className="text-center space-y-2">
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>FAQ</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>

          {/* New Section Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center">Resources</h2>
            <ul className="text-center space-y-2">
              <li>Blog</li>
              <li>Community Support</li>
              <li>Research Articles</li>
              <li>Patient Testimonials</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">© 2024 Skin Cancer Detection and Diagnosis. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

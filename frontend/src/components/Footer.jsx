// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> {/* Added responsive grid with different column numbers based on screen size */}
          
          {/* Skin Cancer Services Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">Skin Cancer Services</h2>
            <ul className="text-center sm:text-left space-y-2">
              <li><a href="/#" className="hover:underline">Skin Cancer Screening</a></li>
              <li><a href="/#" className="hover:underline">Diagnosis and Treatment</a></li>
              <li><a href="/#" className="hover:underline">Early Detection Programs</a></li>
              <li><a href="/#" className="hover:underline">Telehealth Consultations</a></li>
              <li><a href="/#" className="hover:underline">Patient Education Resources</a></li>
              <li><a href="/#" className="hover:underline">Support for Patients and Families</a></li>
            </ul>
          </div>

          {/* Patient Information Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">Patient Information</h2>
            <ul className="text-center sm:text-left space-y-2">
              <li><a href="/new-patients" className="hover:underline">New Patients</a></li>
              <li><a href="/feedback" className="hover:underline">Feedback</a></li>
              <li><a href="/#" className="hover:underline">Appointments & Fees</a></li>
              <li><a href="/#" className="hover:underline">Map & Parking</a></li>
              <li><a href="/book-appointment" className="hover:underline">Book an Appointment</a></li>
            </ul>
          </div>

          {/* Additional Links Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">Additional Links</h2>
            <ul className="text-center sm:text-left space-y-2">
              <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
              <li><a href="/terms-and-conditions" className="hover:underline">Terms and Conditions</a></li>
            </ul>
          </div>

          {/* Resources Group */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">Resources</h2>
            <ul className="text-center sm:text-left space-y-2">
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="community-support" className="hover:underline">Community Support</a></li>
              <li><a href="/#" className="hover:underline">Research Articles</a></li>
              <li><a href="/#" className="hover:underline">Patient Testimonials</a></li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">© 2024 Skin Cancer Detection and Diagnosis. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

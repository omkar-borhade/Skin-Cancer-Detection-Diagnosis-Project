// src/pages/AboutUs.js
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Make sure to import FaCheckCircle
import backgroundImage from '/image/Aboutbg.jpg';

function AboutUs() {
  return (
    <div
      className="relative flex items-center justify-end bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        minHeight: '80vh', // Adjust this value as needed
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 max-w-3xl mr-10 rounded-lg shadow-lg z-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 animate__animated animate__fadeInDown">
          About Us
        </h1>
        <p className="mb-4 text-justify leading-relaxed text-lg text-gray-700">
          Our aim is to provide very high standard medical care for our clients in all aspects of skin health and cancer detection.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg text-gray-700">
          Our team of dermatologists and specialists will listen to your needs and evaluate your condition from every angle to create the very best plan for you.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg text-gray-700">
          Skin Cancer Detection Centre has been servicing the community for over 30 years and we are dedicated to providing you and your family with personalized, professional, and quality healthcare. Our practice is fully accredited and has grown to meet the needs of our local community. With a large team of nurses and administrative staff, we offer multiple levels of support that your family can access.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg text-gray-700">
          We are located in Cannington, within walking distance of Carousel Shopping Centre and Cannington train station.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-4 text-center text-gray-900 animate__animated animate__fadeInUp">Our Services</h2>
        <ul className="list-disc ml-5 mb-4 text-gray-700">
          {[
            "Chronic Disease Management",
            "Skin Cancer Screening",
            "Biopsy Services",
            "Advanced Skin Cancer Surgery",
            "Minor Skin Procedures",
            "Regular Follow-up Consultations"
          ].map((service, index) => (
            <li key={index} className="flex items-center mb-2 hover:underline transition duration-300 animate__animated animate__fadeIn">
              <FaCheckCircle className="text-green-500 mr-2" /> {service}
            </li>
          ))}
        </ul>
        <p className="mb-4 text-justify leading-relaxed text-lg text-gray-700">
          We also have an onsite pathology collection center, allowing our patients to receive quality healthcare in one place.
        </p>
        
        <div className="mt-6 text-center">
          <a
            href="/contact-us"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

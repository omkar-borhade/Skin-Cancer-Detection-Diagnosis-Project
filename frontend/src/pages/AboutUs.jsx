import React from 'react';
import backgroundImage from '/image/Aboutbg.jpg';

function AboutUs() {
  return (
    <div
      className="relative flex items-center justify-end bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,  
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        minHeight: '100vh', 
      }}
    >
      <div className="bg-white bg-opacity-60 p-6 max-w-3xl mr-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          Our aim is to provide very high standard medical care for our clients in all aspects of skin health and cancer detection.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          Our team of dermatologists and specialists will listen to your needs and evaluate your condition from every angle to create the very best plan for you.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          Skin Cancer Detection Centre has been servicing the community for over 30 years and we are dedicated to providing you and your family with personalized, professional, and quality healthcare. Our practice is fully accredited and has grown to meet the needs of our local community. With a large team of nurses and administrative staff, we offer multiple levels of support that your family can access.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          We are located in Cannington, within walking distance of Carousel Shopping Centre and Cannington train station.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          We offer a range of services including Chronic Disease Management, Skin Cancer Screening, Biopsy Services, Advanced Skin Cancer Surgery, Minor Skin Procedures, and regular follow-up consultations to ensure your ongoing skin health.
        </p>
        <p className="mb-4 text-justify leading-relaxed text-lg">
          We also have an onsite pathology collection center, allowing our patients to receive quality healthcare in one place.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;

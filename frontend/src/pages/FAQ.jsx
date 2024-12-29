// src/pages/FAQ.js
import React, { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is skin cancer?",
      answer: "Skin cancer is the uncontrolled growth of abnormal skin cells. It occurs when the DNA in skin cells is damaged, often due to ultraviolet (UV) radiation from the sun or tanning beds.",
    },
    {
      question: "How can I detect skin cancer early?",
      answer: "Regularly check your skin for new moles or changes to existing moles. Look for the ABCDE signs of melanoma: Asymmetry, Border, Color, Diameter, and Evolving.",
    },
    {
      question: "What are the different types of skin cancer?",
      answer: "The three main types of skin cancer are basal cell carcinoma, squamous cell carcinoma, and melanoma.",
    },
    {
      question: "How is skin cancer treated?",
      answer: "Treatment options depend on the type and stage of skin cancer, but may include surgery, radiation therapy, chemotherapy, or immunotherapy.",
    },
    {
      question: "Can I prevent skin cancer?",
      answer: "Yes, you can reduce your risk by avoiding excessive sun exposure, using sunscreen, wearing protective clothing, and avoiding tanning beds.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`bg-white rounded-md shadow-md ${isOpen ? 'shadow-lg' : ''} transition-shadow duration-300`}>
      <button
        className="flex justify-between w-full p-4 text-left font-semibold text-gray-800 focus:outline-none hover:bg-gray-100"
        onClick={toggleAccordion}
      >
        <span className="flex-grow">{question}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 transition-all duration-300 ease-in-out max-h-60 overflow-hidden">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;

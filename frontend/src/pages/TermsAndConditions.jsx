// src/pages/TermsAndConditions.js
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Terms and Conditions</h1>
      <p className="text-gray-600 mb-4 text-center">
        Last updated: [Insert Date]
      </p>
      <p className="mb-6 text-gray-800 leading-relaxed">
        These terms and conditions outline the rules and regulations for the use of [Your Company Name]’s Website, located at [Your Website URL].
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        By accessing this website we assume you accept these terms and conditions. Do not continue to use [Your Website Name] if you do not agree to take all of the terms and conditions stated on this page.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">2. Intellectual Property Rights</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Other than the content you own, under these Terms, [Your Company Name] and/or its licensors own all the intellectual property rights and materials contained in this Website.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">3. Restrictions</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        You are specifically restricted from all of the following:
      </p>
      <ul className="list-disc ml-5 mb-4 text-gray-700 leading-relaxed">
        <li>Publishing any Website material in any other media.</li>
        <li>Selling, sublicensing, and/or otherwise commercializing any Website material.</li>
        <li>Publicly performing and/or showing any Website material.</li>
        <li>Using this Website in any way that is or may be damaging to this Website.</li>
        <li>Using this Website in any way that impacts user access to this Website.</li>
        <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
      </ul>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">4. Limitation of Liability</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        In no event shall [Your Company Name], nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. [Your Company Name] shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">5. Indemnification</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        You hereby indemnify to the fullest extent [Your Company Name] from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of these Terms.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">6. Variation of Terms</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        [Your Company Name] is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">7. Governing Law & Jurisdiction</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        These Terms will be governed by and interpreted in accordance with the laws of the [Your Country], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State] for the resolution of any disputes.
      </p>

      <h2 className="text-xl font-semibold text-blue-600 mb-2">8. Contact Us</h2>
      <p className="text-gray-700 leading-relaxed mb-2">
        If you have any questions about these Terms, please contact us at:
      </p>
      <p className="text-gray-700 mb-2">Email: <span className="text-blue-600 underline">support@example.com</span></p>
      <p className="text-gray-700">Phone: <span className="text-blue-600 underline">(123) 456-7890</span></p>
    </div>
  );
};

export default TermsAndConditions;

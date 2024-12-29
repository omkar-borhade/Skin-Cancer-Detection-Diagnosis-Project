// src/pages/PrivacyPolicy.js
import React from 'react';
import { FaShieldAlt, FaRegUser, FaRegEnvelope, FaLock, FaRegQuestionCircle } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Privacy Policy</h1>
        <p className="mb-4 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4 text-gray-700">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected thereto.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaShieldAlt className="mr-2 text-blue-600" />
          1. Information We Collect
        </h2>
        <p className="mb-4 text-gray-600">
          We may collect information about you in a variety of ways, including:
        </p>
        <ul className="list-disc ml-5 mb-4 text-gray-600">
          <li>Personal Data: Personally identifiable information, such as your name, email address, and telephone number.</li>
          <li>Derivative Data: Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaRegUser className="mr-2 text-blue-600" />
          2. Use of Your Information
        </h2>
        <p className="mb-4 text-gray-600">
          We may use information collected about you via the site to:
        </p>
        <ul className="list-disc ml-5 mb-4 text-gray-600">
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
          <li>Send you newsletters and updates.</li>
          <li>Respond to customer service requests.</li>
          <li>Improve our website and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaRegEnvelope className="mr-2 text-blue-600" />
          3. Disclosure of Your Information
        </h2>
        <p className="mb-4 text-gray-600">
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <ul className="list-disc ml-5 mb-4 text-gray-600">
          <li>By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
          <li>Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaLock className="mr-2 text-blue-600" />
          4. Security of Your Information
        </h2>
        <p className="mb-4 text-gray-600">
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaRegQuestionCircle className="mr-2 text-blue-600" />
          5. Policy for Children
        </h2>
        <p className="mb-4 text-gray-600">
          We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaRegQuestionCircle className="mr-2 text-blue-600" />
          6. Options Regarding Your Information
        </h2>
        <p className="mb-4 text-gray-600">
          You may at any time review or change the information in your account or terminate your account by:
        </p>
        <ul className="list-disc ml-5 mb-4 text-gray-600">
          <li>Logging into your account settings and updating your account.</li>
          <li>Contacting us using the contact information provided below.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
          <FaRegEnvelope className="mr-2 text-blue-600" />
          7. Contact Us
        </h2>
        <p className="mb-2 text-gray-600">If you have questions or comments about this Privacy Policy, please contact us at:</p>
        <p className="text-gray-600">Email: support@example.com</p>
        <p className="text-gray-600">Phone: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

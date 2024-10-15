import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import TestSkinCancer from './components/TestSkinCancer';
import Doctors from './pages/Docters';
import Login from './pages/login';
import AboutUs from './pages/AboutUs';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import CancerDetail from './components/CancerDetail';
import Confirmation from './pages/Confirmation'; 
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Blogs from './pages/Blogs';
import Feedback from './pages/Feedback'; // Ensure this is correctly imported
import BookAppointment from './pages/BookAppointment';
import CommunitySupport from './pages/CommunitySupport';
import NewPatients from './pages/NewPatients';
import ContactUS from './pages/ContactUs';




function App() {
  return (
  
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/test-skin-cancer" element={<TestSkinCancer />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/cancer/:id" element={<CancerDetail />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} /> 

              <Route path="/faq" element={<FAQ />} /> 
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/community-support" element={<CommunitySupport />} />
              <Route path="/contact-us" element={<ContactUS />} />
              <Route path="/new-patients" element={<NewPatients />} />



            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
   
  );
}

export default App;

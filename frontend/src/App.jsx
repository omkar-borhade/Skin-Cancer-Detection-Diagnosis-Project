// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import TestSkinCancer from './components/TestSkinCancer';
import CancerDetail from './components/CancerDetail';
import Doctors from "./pages/Docters";
import Login from "./pages/login";
import Confirmation from './pages/Confirmation';
import AboutUs from './pages/AboutUs';
import Navbar from './components/Navbar'; // Import Navbar
import Footer from './components/Footer'; // Import Footer

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Add Navbar here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-skin-cancer" element={<TestSkinCancer />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cancer/:id" element={<CancerDetail />} />
        </Routes>
        <Footer /> {/* Add Footer here */}
      </div>
    </Router>
  );
}

export default App;

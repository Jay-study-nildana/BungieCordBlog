import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/custom-theme.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WeatherForecast from "./pages/WeatherForecast";
import Bird from "./pages/Bird";
import Zoo from "./pages/Zoo";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<WeatherForecast />} />
            <Route path="/bird" element={<Bird />} />
            <Route path="/zoo" element={<Zoo />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
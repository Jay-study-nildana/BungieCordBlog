import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/custom-theme.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Registration from './pages/Registration';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import BungieCord from './pages/BungieCord';
import ImageThings from './pages/ImageThings';
import SeeAllImages from './pages/SeeAllImages';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/bungie-cord" element={<BungieCord />} />
          <Route path="/image-things" element={<ImageThings />} />
          <Route path="/see-all-images" element={<SeeAllImages />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
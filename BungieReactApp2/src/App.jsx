import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
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
import Categories from './pages/Categories';
import BlogPosts from './pages/BlogPosts';
import ReadBlog from './pages/ReadBlog';
import Admin2 from './pages/Admin2';
import SuperHeroes from './pages/SuperHeroes';
import SuperPowers from './pages/SuperPowers';
import SideKick from './pages/SideKick';
import ComicAppearance from './pages/ComicAppearance';
import SideKickComicAppearance from './pages/SideKickComicAppearance';
import Home2 from './pages/Home2';
import SuperHeroCard from './pages/SuperHeroCard';
import Search from './pages/Search';
import OrderBasket from './pages/OrderBasket';

// Wrapper to pass superHeroId from URL params
function SuperHeroCardWrapper() {
  const { id } = useParams();
  return <SuperHeroCard superHeroId={id} />;
}

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
          <Route path="/categories" element={<Categories />} />
          <Route path="/blog-posts" element={<BlogPosts />} />
          <Route path="/read-blog" element={<ReadBlog />} />
          <Route path="/admin2" element={<Admin2 />} />
          <Route path="/super-heroes" element={<SuperHeroes />} />
          <Route path="/super-powers" element={<SuperPowers />} />
          <Route path="/sidekick" element={<SideKick />} />
          <Route path="/comic-appearance" element={<ComicAppearance />} />
          <Route path="/sidekick-comic-appearance" element={<SideKickComicAppearance />} />
          <Route path="/home2" element={<Home2 />} />          
          <Route path="/superhero/:id" element={<SuperHeroCardWrapper />} />
          <Route path="/search" element={<Search />} />
          <Route path="/order-basket" element={<OrderBasket />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
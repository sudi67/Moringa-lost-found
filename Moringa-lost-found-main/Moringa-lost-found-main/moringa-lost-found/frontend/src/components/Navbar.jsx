import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onReportClick, onAuthOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <i className="fas fa-search-location"></i>
          <span>Moringa Lost & Found</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link active">Home</a>
          <a href="#report" className="nav-link" onClick={onReportClick}>Report Item</a>
          <a href="#search" className="nav-link">Search</a>
          <a href="#profile" className="nav-link">Profile</a>
          <button
            onClick={onAuthOpen}
            className="nav-link auth-button"
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, fontSize: '1rem' }}
          >
            Open Auth Modal
          </button>
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

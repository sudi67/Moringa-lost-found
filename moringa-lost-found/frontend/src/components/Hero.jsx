import React from 'react';
import './Hero.css';

const Hero = ({ onReportClick }) => {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('search');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Find What You've Lost</h1>
          <p className="hero-subtitle">
            Report lost items or search through our database to reunite with your belongings
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onReportClick}>
              <i className="fas fa-plus"></i> Report Lost Item
            </button>
            <button className="btn btn-secondary" onClick={scrollToSearch}>
              <i className="fas fa-search"></i> Search Items
            </button>
          </div>
        </div>
        {/* Removed empty div */}
      </div>
    </section>
  );
};

export default Hero;

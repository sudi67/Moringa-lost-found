import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Moringa Lost & Found</h3>
            <p>Helping the Moringa community reunite with their lost belongings since 2024.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#report">Report Item</a></li>
              <li><a href="#search">Search</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: lostfound@moringaschool.com</p>
            <p>Phone: +254 700 000 000</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Moringa School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

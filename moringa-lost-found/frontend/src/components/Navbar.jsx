// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import NotificationBell from './NotificationBell.jsx';
import './Navbar.css';

const Navbar = ({ onReportClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <i className="fas fa-search-location"></i>
          <span>Moringa Lost & Found</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link active">Home</Link>
          <a href="#report" className="nav-link" onClick={onReportClick}>Report Item</a>
          

          {user ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/notifications" className="nav-link">Notifications</Link>
              <Link to="/pay" className="nav-link">Make Payment</Link> {/* ✅ NEW LINK */}
              <NotificationBell />
              <button onClick={handleLogout} className="nav-link logout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
              <Link to="/pay" className="nav-link">Make Payment</Link>
              <Link to="/admin/login" className="nav-link admin-link">
                <i className="fas fa-user-shield"></i>
                Admin
              </Link>
            </>
          )}
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

// src/components/StudentNavbar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentData');
    localStorage.removeItem('studentProfile');
    localStorage.removeItem('studentName');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Try to load college logo
  let collegeLogo;
  try {
    collegeLogo = require('../assets/logo2.avif');
  } catch (e) {
    collegeLogo = null;
  }

  return (
    <nav className="student-navbar">
      <div className="nav-container">
        <div className="nav-left">
          {collegeLogo ? (
            <img 
              src={collegeLogo} 
              alt="College Logo" 
              className="nav-logo-img"
              onClick={() => navigate('/student-home')}
            />
          ) : (
            <div className="nav-logo-text" onClick={() => navigate('/student-home')}>
              <span className="logo-icon">🎓</span>
              <span>College Events</span>
            </div>
          )}
        </div>

        <div className="nav-center">
          <ul className="nav-menu">
            <li>
              <button 
                className={isActive('/student-home') ? 'active' : ''}
                onClick={() => navigate('/student-home')}
              >
                🏠 <span>Home</span>
              </button>
            </li>
            <li>
              <button 
                className={isActive('/booking-history') ? 'active' : ''}
                onClick={() => navigate('/booking-history')}
              >
                📋 <span>Booking History</span>
              </button>
            </li>
            <li>
              <button 
                className={isActive('/profile') ? 'active' : ''}
                onClick={() => navigate('/profile')}
              >
                👤 <span>Profile</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn">
            🚪 <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;
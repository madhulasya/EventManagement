// src/components/AdminNavbar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
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
    <nav className="admin-navbar">
      <div className="nav-container">
        <div className="nav-left">
          {collegeLogo ? (
            <img 
              src={collegeLogo} 
              alt="College Logo" 
              className="nav-logo-img"
              onClick={() => navigate('/admin-dashboard')}
            />
          ) : (
            <div className="nav-logo-text" onClick={() => navigate('/admin-dashboard')}>
              <span className="logo-icon">👑</span>
              <span>Admin Portal</span>
            </div>
          )}
        </div>

        <div className="nav-center">
          <ul className="nav-menu">
            <li>
              <button 
                className={isActive('/admin-dashboard') ? 'active' : ''}
                onClick={() => navigate('/admin-dashboard')}
              >
                📊 <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                className={isActive('/admin-dashboard/students') ? 'active' : ''}
                onClick={() => navigate('/admin-dashboard/students')}
              >
                👨‍🎓 <span>Students</span>
              </button>
            </li>
            <li>
              <button 
                className={isActive('/admin-dashboard/events') ? 'active' : ''}
                onClick={() => navigate('/admin-dashboard/events')}
              >
                🎯 <span>Events</span>
              </button>
            </li>
            <li>
              <button 
                className={isActive('/admin-dashboard/bookings') ? 'active' : ''}
                onClick={() => navigate('/admin-dashboard/bookings')}
              >
                📝 <span>Bookings</span>
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

export default AdminNavbar;
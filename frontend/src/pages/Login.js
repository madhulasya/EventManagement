// src/pages/Login.js
import React, { useState } from 'react';
// Remove useNavigate since we're using window.location.href
import axios from 'axios';
import './Login.css';

function Login() {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle logo with error handling
  let collegeLogo;
  try {
    collegeLogo = require('../assets/logo2.avif');
  } catch (e) {
    collegeLogo = null;
  }

  const handleStudentLogin = () => {
    setErrorMessage('');
    setLoading(true);
    
    setTimeout(() => {
      if (isNewUser) {
        // REGISTRATION
        if (!email || !password || !name) {
          setErrorMessage('Please fill all fields');
          setLoading(false);
          return;
        }
        
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const userExists = existingStudents.find(s => s.email === email);
        
        if (userExists) {
          setErrorMessage('Email already registered! Please login.');
          setLoading(false);
          return;
        }
        
        const newStudent = { email, password, name, registrationDate: new Date().toISOString() };
        existingStudents.push(newStudent);
        localStorage.setItem('students', JSON.stringify(existingStudents));
        localStorage.setItem('studentEmail', email);
        localStorage.setItem('studentName', name);
        
        setLoading(false);
        alert('Registration successful! Welcome ' + name);
        console.log('Redirecting to student home...');
        window.location.href = '/student-home';
        
      } else {
        // LOGIN
        if (!email || !password) {
          setErrorMessage('Please enter email and password');
          setLoading(false);
          return;
        }
        
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const user = existingStudents.find(s => s.email === email && s.password === password);
        
        if (user) {
          localStorage.setItem('studentEmail', email);
          localStorage.setItem('studentName', user.name);
          setLoading(false);
          alert('Login successful! Welcome back ' + user.name);
          console.log('Redirecting to student home...');
          window.location.href = '/student-home';
        } else {
          setErrorMessage('Invalid email or password. Please register as new user.');
          setLoading(false);
        }
      }
    }, 500);
  };

  const handleAdminLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    
    try {
      console.log('Sending admin login request...');
      
      const response = await axios.post('/api/admin/login', {
        email: email,
        password: password
      });
      
      console.log('Response received:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.status === 'success') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        setLoading(false);
        alert('Admin login successful! Redirecting to dashboard...');
        console.log('Redirecting to admin dashboard...');
        window.location.href = '/admin-dashboard';
      } else {
        setErrorMessage(response.data?.message || 'Invalid admin credentials');
        setLoading(false);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setErrorMessage('Cannot connect to backend. Make sure server is running on port 8080');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'student') {
      handleStudentLogin();
    } else {
      handleAdminLogin();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          {/* Left Side - College Info */}
          <div className="login-info">
            <div className="info-content">
              <div className="college-badge">
                {collegeLogo ? (
                  <img src={collegeLogo} alt="College Logo" className="college-logo-large" />
                ) : (
                  <div className="logo-placeholder">🎓</div>
                )}
              </div>
              <h1>Welcome to<br />College Events Portal</h1>
              <p>Manage and book events for various departments, cultural activities, and technical fests all in one place.</p>
              <div className="info-features">
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  <span>Department Events</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎫</span>
                  <span>Easy Booking</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📧</span>
                  <span>Email Confirmation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-container">
            <div className="form-header">
              {collegeLogo && <img src={collegeLogo} alt="College Logo" className="mobile-logo" />}
              <h2>{userType === 'student' ? 'Student Portal' : 'Admin Portal'}</h2>
              <p>{userType === 'student' ? 'Access your events and bookings' : 'Manage events and students'}</p>
            </div>

            <div className="user-type-selector">
              <button 
                className={`type-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('student');
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                }}
              >
                <span className="btn-icon">👨‍🎓</span>
                Student
              </button>
              <button 
                className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('admin');
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                }}
              >
                <span className="btn-icon">👑</span>
                Admin
              </button>
            </div>

            {errorMessage && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {userType === 'student' && (
                <div className="register-toggle">
                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={isNewUser} 
                      onChange={(e) => setIsNewUser(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">
                      {isNewUser ? 'Register new account' : 'Login to existing account'}
                    </span>
                  </label>
                </div>
              )}

              {isNewUser && userType === 'student' && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isNewUser ? "off" : "current-password"}
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  userType === 'student' ? (isNewUser ? 'Register Account' : 'Login to Account') : 'Access Admin Panel'
                )}
              </button>
            </form>

            {userType === 'student' && !isNewUser && (
              <div className="register-prompt">
                New to College Events? <button type="button" onClick={() => setIsNewUser(true)}>Create an account</button>
              </div>
            )}

            {userType === 'admin' && (
              <div className="demo-credentials">
                <p>Demo Admin Credentials:</p>
                <code>admin@event.com / admin123</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
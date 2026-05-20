// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import BookingPage from './pages/BookingPage';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('studentEmail');
  const isAdmin = localStorage.getItem('isAdmin');

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-home" element={isLoggedIn ? <StudentHome /> : <Navigate to="/" />} />
        <Route path="/booking/:eventId" element={isLoggedIn ? <BookingPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/booking-history" element={isLoggedIn ? <BookingHistory /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard/*" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
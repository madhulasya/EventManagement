// src/pages/BookingHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentNavbar from '../components/StudentNavbar';
import './BookingHistory.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const studentEmail = localStorage.getItem('studentEmail');
    if (!studentEmail) {
      setError('Please login to view bookings');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/student/${studentEmail}`);
      setBookings(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load booking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return '#27ae60';
      case 'CANCELLED':
        return '#e74c3c';
      case 'PENDING':
        return '#f39c12';
      default:
        return '#7f8c8d';
    }
  };

  if (loading) {
    return (
      <div>
        <StudentNavbar />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar />
      <div className="history-container">
        <h2>📋 My Booking History</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="empty-state">
              <span className="empty-icon">🎫</span>
              <h3>No Bookings Found</h3>
              <p>You haven't booked any events yet.</p>
              <button onClick={() => window.location.href = '/student-home'}>
                Browse Events
              </button>
            </div>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Tickets</th>
                  <th>Total Cost</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="event-name-cell">
                      <strong>{booking.eventName}</strong>
                    </td>
                    <td className="tickets-cell">
                      <span className="ticket-badge">
                        🎟️ {booking.numberOfTickets}
                      </span>
                    </td>
                    <td className="cost-cell">
                      <span className="cost-amount">
                        ₹{booking.totalCost}
                      </span>
                    </td>
                    <td className="date-cell">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="status-cell">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="booking-summary">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total Bookings:</span>
                  <span className="stat-value">{bookings.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Tickets:</span>
                  <span className="stat-value">
                    {bookings.reduce((sum, booking) => sum + booking.numberOfTickets, 0)}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Spent:</span>
                  <span className="stat-value">
                    ₹{bookings.reduce((sum, booking) => sum + booking.totalCost, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
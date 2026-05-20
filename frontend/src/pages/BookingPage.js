// src/pages/BookingPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../components/StudentNavbar';
import './BookingPage.css';

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Define fetchEvent with useCallback to prevent unnecessary re-renders
  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${eventId}`);
      setEvent(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBooking = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (numberOfTickets < 1) {
      setError('Please select at least 1 ticket');
      return;
    }

    if (numberOfTickets > event.availableTickets) {
      setError(`Only ${event.availableTickets} tickets available`);
      return;
    }

    const studentEmail = localStorage.getItem('studentEmail');
    const studentName = localStorage.getItem('studentName') || 'Student';

    const bookingData = {
      studentEmail: studentEmail,
      eventId: parseInt(eventId),
      numberOfTickets: numberOfTickets,
      phoneNumber: phoneNumber
    };

    try {
      setLoading(true);
      const response = await axios.post('/api/bookings', bookingData);
      
      if (response.data) {
        setBookingDetails({
          eventName: event.eventName,
          tickets: numberOfTickets,
          totalCost: event.ticketCost * numberOfTickets,
          phoneNumber: phoneNumber,
          bookingId: response.data.id,
          studentName: studentName,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          location: event.location
        });
        setBookingSuccess(true);
        setError('');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (value) => {
    if (value >= 1 && value <= event.availableTickets) {
      setNumberOfTickets(value);
      setError('');
    }
  };

  if (loading && !event) {
    return (
      <div>
        <StudentNavbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <StudentNavbar />
        <div className="booking-container">
          <div className="error-message">Event not found</div>
          <button onClick={() => navigate('/student-home')}>Back to Home</button>
        </div>
      </div>
    );
  }

  // Show success message after booking
  if (bookingSuccess && bookingDetails) {
    return (
      <div>
        <StudentNavbar />
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your tickets have been successfully booked.</p>
            
            <div className="booking-summary">
              <h3>Booking Details</h3>
              <div className="summary-item">
                <span>Event:</span>
                <strong>{bookingDetails.eventName}</strong>
              </div>
              <div className="summary-item">
                <span>Student:</span>
                <strong>{bookingDetails.studentName}</strong>
              </div>
              <div className="summary-item">
                <span>Location:</span>
                <strong>{bookingDetails.location}</strong>
              </div>
              <div className="summary-item">
                <span>Date & Time:</span>
                <strong>{new Date(bookingDetails.eventDate).toLocaleDateString()} at {bookingDetails.eventTime}</strong>
              </div>
              <div className="summary-item">
                <span>Number of Tickets:</span>
                <strong>{bookingDetails.tickets}</strong>
              </div>
              <div className="summary-item">
                <span>Total Amount:</span>
                <strong style={{ color: '#27ae60' }}>₹{bookingDetails.totalCost}</strong>
              </div>
              <div className="summary-item">
                <span>Phone Number:</span>
                <strong>{bookingDetails.phoneNumber}</strong>
              </div>
              <div className="summary-item">
                <span>Booking ID:</span>
                <strong>#{bookingDetails.bookingId}</strong>
              </div>
            </div>

            <div className="success-message-box">
              <p>📧 A confirmation has been saved to your account.</p>
              <p>📱 Show this screen at the event entrance.</p>
              <p>🎫 Please carry your student ID card.</p>
            </div>

            <div className="success-buttons">
              <button onClick={() => navigate('/booking-history')}>
                View My Bookings
              </button>
              <button onClick={() => navigate('/student-home')}>
                Book More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar />
      <div className="booking-container">
        <div className="booking-card">
          <h2>Book Tickets</h2>
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="event-info">
            <h3>{event.eventName}</h3>
            <p>🏢 Department: {event.department}</p>
            <p>📍 Location: {event.location}</p>
            <p>📅 Date: {new Date(event.eventDate).toLocaleDateString()}</p>
            <p>⏰ Time: {event.eventTime}</p>
            <p>💰 Price per ticket: ₹{event.ticketCost}</p>
            <p>🎫 Available tickets: {event.availableTickets}</p>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label>Number of Tickets:</label>
              <input
                type="number"
                min="1"
                max={event.availableTickets}
                value={numberOfTickets}
                onChange={(e) => handleTicketChange(parseInt(e.target.value))}
                disabled={event.availableTickets === 0}
              />
            </div>

            <div className="form-group">
              <label>Phone Number (for confirmation):</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Ticket Price:</span>
                <span>₹{event.ticketCost}</span>
              </div>
              <div className="price-row">
                <span>Number of Tickets:</span>
                <span>x {numberOfTickets}</span>
              </div>
              <div className="price-row total">
                <span>Total Cost:</span>
                <span>₹{event.ticketCost * numberOfTickets}</span>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={event.availableTickets === 0 || loading}
            >
              {loading ? 'Processing...' : (event.availableTickets === 0 ? 'Sold Out' : 'Confirm Booking')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
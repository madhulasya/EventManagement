// src/pages/StudentHome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../components/StudentNavbar';

function StudentHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events...');
      
      // Using proxy - no need for full URL
      const response = await axios.get('/api/events');
      
      console.log('Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
        if (response.data.length === 0) {
          setError('No events found. Please add events.');
        }
      } else {
        setError('Invalid data format');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Cannot connect to backend. Make sure backend is running on port 8080');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <StudentNavbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <StudentNavbar />
        <div style={{ 
          maxWidth: '600px', 
          margin: '100px auto', 
          padding: '20px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#e74c3c' }}>⚠️ Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchEvents}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <StudentNavbar />
        <div style={{ 
          maxWidth: '600px', 
          margin: '100px auto', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>No Events Found</h2>
          <p>Please add events using Postman or Admin panel.</p>
          <button onClick={fetchEvents}>Refresh</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar />
      <div style={{ marginTop: '80px', padding: '20px', maxWidth: '1200px', margin: '80px auto 20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🎉 Upcoming Events</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '30px'
        }}>
          {events.map((event) => (
            <div key={event.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '10px', 
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ margin: 0 }}>{event.eventName}</h3>
                <p style={{ margin: '5px 0 0' }}>{event.department}</p>
              </div>
              <div style={{ padding: '20px' }}>
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                <p>⏰ {event.eventTime}</p>
                <p>💰 ₹{event.ticketCost}</p>
                <p>🎫 Available: {event.availableTickets}/{event.totalTickets}</p>
                <button 
                  onClick={() => navigate(`/booking/${event.id}`)}
                  disabled={event.availableTickets === 0}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: event.availableTickets === 0 ? '#ccc' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: event.availableTickets === 0 ? 'not-allowed' : 'pointer',
                    marginTop: '15px'
                  }}
                >
                  {event.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
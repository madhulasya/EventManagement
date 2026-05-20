// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalStudents: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Form data for add/edit event
  const [formData, setFormData] = useState({
    eventName: '',
    department: '',
    location: '',
    ticketCost: '',
    totalTickets: '',
    eventDate: '',
    eventTime: '',
    description: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/');
    } else {
      fetchAllData();
    }
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch events
      const eventsRes = await axios.get('/api/events');
      setEvents(eventsRes.data);
      
      // Fetch bookings
      const bookingsRes = await axios.get('/api/bookings/all');
      setBookings(bookingsRes.data);
      
      // Fetch students (from localStorage)
      const studentsData = JSON.parse(localStorage.getItem('students') || '[]');
      setStudents(studentsData);
      
      // Calculate statistics
      const totalEvents = eventsRes.data.length;
      const totalBookings = bookingsRes.data.length;
      const totalStudents = studentsData.length;
      const totalRevenue = bookingsRes.data.reduce((sum, booking) => sum + (booking.totalCost || 0), 0);
      
      setStats({
        totalEvents,
        totalBookings,
        totalStudents,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventName || !formData.department || !formData.location || 
        !formData.ticketCost || !formData.totalTickets || !formData.eventDate || !formData.eventTime) {
      alert('Please fill all required fields');
      return;
    }
    
    const eventData = {
      eventName: formData.eventName,
      department: formData.department,
      location: formData.location,
      ticketCost: parseFloat(formData.ticketCost),
      totalTickets: parseInt(formData.totalTickets),
      availableTickets: parseInt(formData.totalTickets),
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      description: formData.description || ''
    };
    
    try {
      const response = await axios.post('/api/events', eventData);
      console.log('Event added:', response.data);
      alert('Event added successfully!');
      setShowAddEvent(false);
      resetForm();
      fetchAllData(); // Refresh the events list
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Check console for details.');
    }
  };

  // Handle Edit Event
  const handleEditEvent = async (e) => {
    e.preventDefault();
    
    const eventData = {
      eventName: formData.eventName,
      department: formData.department,
      location: formData.location,
      ticketCost: parseFloat(formData.ticketCost),
      totalTickets: parseInt(formData.totalTickets),
      availableTickets: editingEvent.availableTickets,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      description: formData.description || ''
    };
    
    try {
      const response = await axios.put(`/api/events/${editingEvent.id}`, eventData);
      console.log('Event updated:', response.data);
      alert('Event updated successfully!');
      setEditingEvent(null);
      resetForm();
      fetchAllData(); // Refresh the events list
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Check console for details.');
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        alert('Event deleted successfully!');
        fetchAllData(); // Refresh the events list
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Check if event has bookings.');
      }
    }
  };

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/api/bookings/${bookingId}`);
        alert('Booking cancelled successfully!');
        fetchAllData();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  // Export to CSV
  const exportToExcel = () => {
    const headers = ['Student Email', 'Event ID', 'Tickets', 'Total Cost', 'Status', 'Phone', 'Booking Date'];
    const csvData = bookings.map(booking => [
      booking.studentEmail,
      booking.eventId,
      booking.numberOfTickets,
      booking.totalCost,
      booking.status,
      booking.phoneNumber,
      new Date(booking.bookingDate).toLocaleString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      eventName: '',
      department: '',
      location: '',
      ticketCost: '',
      totalTickets: '',
      eventDate: '',
      eventTime: '',
      description: ''
    });
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      department: event.department,
      location: event.location,
      ticketCost: event.ticketCost,
      totalTickets: event.totalTickets,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      description: event.description || ''
    });
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-sidebar">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
            👨‍🎓 Students ({students.length})
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            🎯 Events ({events.length})
          </button>
          <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
            📝 Bookings ({bookings.length})
          </button>
        </div>

        <div className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-container">
              <h2>Admin Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-info">
                    <h3>Total Events</h3>
                    <p className="stat-number">{stats.totalEvents}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-info">
                    <h3>Total Bookings</h3>
                    <p className="stat-number">{stats.totalBookings}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👨‍🎓</div>
                  <div className="stat-info">
                    <h3>Total Students</h3>
                    <p className="stat-number">{stats.totalStudents}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">₹{stats.totalRevenue}</p>
                  </div>
                </div>
              </div>
              <button onClick={exportToExcel} className="export-btn">
                📊 Export Bookings to CSV
              </button>
              <div className="welcome-message">
                <h3>Welcome to Admin Panel!</h3>
                <p>Manage events, view bookings, and track student participation from here.</p>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="students-container">
              <h2>Student Management</h2>
              {students.length === 0 ? (
                <p>No students registered yet.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Registered Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name || 'N/A'}</td>
                        <td>{student.email}</td>
                        <td>{student.phoneNumber || 'N/A'}</td>
                        <td>{new Date(student.registrationDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="events-container">
              <h2>Event Management</h2>
              <button className="add-btn" onClick={() => setShowAddEvent(true)}>+ Add New Event</button>
              
              {/* Add/Edit Event Modal */}
              {(showAddEvent || editingEvent) && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                    <form onSubmit={editingEvent ? handleEditEvent : handleAddEvent}>
                      <div className="form-group">
                        <label>Event Name *</label>
                        <input
                          type="text"
                          value={formData.eventName}
                          onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                          required
                          placeholder="Enter event name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Department *</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="MBA">MBA</option>
                          <option value="Physical Education">Physical Education</option>
                          <option value="Cultural Committee">Cultural Committee</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Location *</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          required
                          placeholder="Enter venue location"
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Ticket Cost (₹) *</label>
                          <input
                            type="number"
                            value={formData.ticketCost}
                            onChange={(e) => setFormData({...formData, ticketCost: e.target.value})}
                            required
                            placeholder="Price per ticket"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Total Tickets *</label>
                          <input
                            type="number"
                            value={formData.totalTickets}
                            onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
                            required
                            placeholder="Total tickets available"
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Event Date *</label>
                          <input
                            type="date"
                            value={formData.eventDate}
                            onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Event Time *</label>
                          <input
                            type="time"
                            value={formData.eventTime}
                            onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows="3"
                          placeholder="Event description (optional)"
                        />
                      </div>
                      
                      <div className="modal-buttons">
                        <button type="submit" className="save-btn">
                          {editingEvent ? 'Update Event' : 'Add Event'}
                        </button>
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={() => {
                            setShowAddEvent(false);
                            setEditingEvent(null);
                            resetForm();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Events List */}
              {events.length === 0 ? (
                <p>No events available. Click "Add New Event" to create one.</p>
              ) : (
                <div className="events-list">
                  {events.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-info">
                        <h3>{event.eventName}</h3>
                        <p><strong>Department:</strong> {event.department}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {event.eventTime}</p>
                        <p><strong>Price:</strong> ₹{event.ticketCost}</p>
                        <p><strong>Tickets:</strong> {event.availableTickets} / {event.totalTickets} available</p>
                        {event.description && <p><strong>Description:</strong> {event.description}</p>}
                      </div>
                      <div className="event-actions">
                        <button className="edit-btn" onClick={() => openEditModal(event)}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteEvent(event.id, event.eventName)}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bookings-container">
              <h2>All Bookings</h2>
              {bookings.length === 0 ? (
                <p>No bookings yet.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student Email</th>
                      <th>Event ID</th>
                      <th>Tickets</th>
                      <th>Total Cost</th>
                      <th>Booking Date</th>
                      <th>Status</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.studentEmail}</td>
                        <td>{booking.eventId}</td>
                        <td>{booking.numberOfTickets}</td>
                        <td>₹{booking.totalCost}</td>
                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                        <td>
                          <span className={`status ${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>{booking.phoneNumber}</td>
                        <td>
                          {booking.status !== 'CANCELLED' && (
                            <button className="cancel-booking-btn" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
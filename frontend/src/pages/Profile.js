// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    vtuNumber: '',
    collegeName: '',
    gender: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('studentProfile');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile(prev => ({ ...prev, email: studentEmail }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  return (
    <div>
      <StudentNavbar />
      <div className="profile-container">
        <div className="profile-card">
          <h2>Student Profile</h2>
          
          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>VTU Number:</label>
              <input
                type="text"
                value={profile.vtuNumber}
                onChange={(e) => setProfile({...profile, vtuNumber: e.target.value})}
                placeholder="VTUXXXXXX"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>College Name:</label>
              <input
                type="text"
                value={profile.collegeName}
                onChange={(e) => setProfile({...profile, collegeName: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                disabled
              />
            </div>

            {isEditing ? (
              <div className="button-group">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
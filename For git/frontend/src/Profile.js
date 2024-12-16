import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from './utils'; // Helper function to get the username

const Profile = () => {
  const navigate = useNavigate();
  const username = getUsernameFromToken(); // Extract the username from the JWT token
  
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for Admin, 2 for Client
  const userName = localStorage.getItem('first_name');
  
  const [profile, setProfile] = useState([]);
  const [error, setError] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token from localStorage
    navigate('/login'); // Redirect to login page
  };

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5050/profileinfo', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        
        // Extracting profile from the response
        setProfile(response.data.Profile);
      
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      }
    };
    
    if (clientId) {
      fetchData();
    } else {
      setError('Client not found. Please log in again.');
    }
  }, [clientId, userType]);

  

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>
        Welcome to Your Profile, {username}!
      </h2>
      
      {/* Navigation Menu */}
      <nav style={navStyle}>
        <ul style={navListStyle}>
          <li><Link to="/dashboard" style={menuLinkStyle}>Dashboard</Link></li>
          <li>
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      
      {error && <div style={errorStyle}>{error}</div>}
      
      <div style={profileCardStyle}>
        <h3 style={profileHeaderStyle}>Profile Details</h3>
        
        {/* Profile Information Grid */}
        <div style={profileGridStyle}>
          <div style={profileItemStyle}>
            <strong>Client ID:</strong> {profile.client_id}
          </div>
          <div style={profileItemStyle}>
            <strong>First Name:</strong> {profile.first_name}
          </div>
          <div style={profileItemStyle}>
            <strong>Last Name:</strong> {profile.last_name}
          </div>
          <div style={profileItemStyle}>
            <strong>Address:</strong> {profile.address}
          </div>
          <div style={profileItemStyle}>
            <strong>Credit Card Info:</strong> {profile.credit_card_info}
          </div>
          <div style={profileItemStyle}>
            <strong>Phone Number:</strong> {profile.phone_number}
          </div>
          <div style={profileItemStyle}>
            <strong>Email:</strong> {profile.email}
          </div>
          <div style={profileItemStyle}>
            <strong>User Type:</strong> {profile.user_type === 1 ? 'Admin' : 'Client'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  fontFamily: "'Poppins', sans-serif",
};

const headerStyle = {
  textAlign: 'center',
  fontSize: '2.5rem',
  color: '#fff',
  marginBottom: '30px',
  fontWeight: '600',
};

const navStyle = {
  textAlign: 'center',
  marginBottom: '40px',
};

const navListStyle = {
  listStyleType: 'none',
  padding: '0',
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  alignItems: 'center',
};

const menuLinkStyle = {
  textDecoration: 'none',
  fontSize: '1.2rem',
  color: '#fff',
  padding: '12px 25px',
  backgroundColor: '#333',
  borderRadius: '50px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  textTransform: 'uppercase',
};

menuLinkStyle[':hover'] = {
  backgroundColor: '#555',
  transform: 'scale(1.05)',
};

const logoutButtonStyle = {
  ...menuLinkStyle,
  backgroundColor: '#e74c3c',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const errorStyle = {
  color: '#e74c3c',
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '1.2rem',
};

const profileCardStyle = {
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  marginBottom: '40px',
  transition: 'box-shadow 0.3s ease, transform 0.2s ease',
};

profileCardStyle[':hover'] = {
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  transform: 'scale(1.02)',
};

const profileHeaderStyle = {
  fontSize: '1.8rem',
  color: '#007bff',
  marginBottom: '25px',
  textAlign: 'center',
  fontWeight: '600',
};

const profileGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

const profileItemStyle = {
  backgroundColor: '#f5f5f5',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'background-color 0.3s ease',
};

profileItemStyle[':hover'] = {
  backgroundColor: '#e0e0e0',
};

const imageUploadSectionStyle = {
  marginBottom: '30px',
  textAlign: 'center',
};

const imageInputStyle = {
  marginBottom: '20px',
};

const imagePreviewStyle = {
  marginTop: '20px',
};

const profileImageStyle = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '3px solid #007bff',
};

export default Profile;

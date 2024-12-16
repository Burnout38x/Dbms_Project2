import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get user info from local storage
  const userType = localStorage.getItem('user_type');
  const userName = localStorage.getItem('first_name');

  // Log out function to clear the token and user info and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    localStorage.removeItem('user');  // Remove user info
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="container" style={containerStyle}>
      <h2 style={headerStyle}>Dashboard</h2>

      {/* Navigation menu */}
      <nav style={navStyle}>
        <ul style={navListStyle}>
          <li>
            <Link to="/profile" style={navLinkStyle}>
              Profile
            </Link>
          </li>
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

      {/* Conditional rendering for David's and Client's dashboards */}
      {Number(userType) === 1 ? (
        <div style={dashboardContainerStyle}>
          <h3 style={welcomeStyle}>Welcome, {userName}! Your Dashboard</h3>
          <div style={linkContainerStyle}>
            <Link to="/quotes" style={navLinkStyle}>Manage Quotes</Link>
            <Link to="/orders" style={navLinkStyle}>Manage Orders</Link>
            <Link to="/negotiations" style={navLinkStyle}>Negotiations</Link>
            <Link to="/bills" style={navLinkStyle}>Manage Bills</Link>
            <Link to="/reports" style={navLinkStyle}>Reports</Link>
          </div>
        </div>
      ) : (
        <div style={dashboardContainerStyle}>
          <h3 style={welcomeStyle}>Welcome, {userName}! Your Dashboard</h3>
          <div style={linkContainerStyle}>
            <Link to="/quotes" style={navLinkStyle}>View Quotes</Link>
            <Link to="/orders" style={navLinkStyle}>View Orders</Link>
            <Link to="/negotiations" style={navLinkStyle}>Negotiations</Link>
            <Link to="/bills" style={navLinkStyle}>View Bills</Link>
          </div>
        </div>
      )}

      <p style={noteStyle}>Please note that only authenticated users have access to this page.</p>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  fontSize: '2rem',
  color: '#007bff',
  textAlign: 'center',
  marginBottom: '20px',
};

const navStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const navListStyle = {
  listStyleType: 'none',
  padding: '0',
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  alignItems: 'center',
};

const navLinkStyle = {
  textDecoration: 'none',
  fontSize: '1.2rem',
  color: '#007bff',
  padding: '12px 25px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'block',
  marginBottom: '12px',
  transition: 'background-color 0.3s, transform 0.2s',
  textAlign: 'center',
};

const logoutButtonStyle = {
  fontSize: '1.2rem',
  color: '#fff',
  backgroundColor: '#e74c3c',
  padding: '12px 25px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
};

const dashboardContainerStyle = {
  textAlign: 'center',
};

const welcomeStyle = {
  fontSize: '1.5rem',
  color: '#333',
  marginBottom: '20px',
};

const linkContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
};

const noteStyle = {
  fontSize: '1rem',
  color: '#555',
  textAlign: 'center',
  marginTop: '30px',
};

// Add hover effect for the links
const hoverEffect = `
  .link:hover {
    background-color: #007bff;
    color: #fff;
    transform: translateY(-2px);
  }

  .logoutButton:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }
`;

export default Dashboard;

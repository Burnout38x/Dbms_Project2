import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const token = localStorage.getItem('token'); // Check if the user is logged in

  return (
    <div 
      className="container" 
      style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif', 
        lineHeight: '1.6', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#333', margin: '0 0 20px' }}>
          David Smith's Driveway Sealing Services
        </h1>
        <nav>
          <ul 
            style={{ 
              listStyleType: 'none', 
              padding: '0', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px' 
            }}
          >
            <li>
              <Link 
                to="/login" 
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '1.2rem', 
                  color: '#007bff', 
                  fontWeight: 'bold' 
                }}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '1.2rem', 
                  color: '#007bff', 
                  fontWeight: 'bold' 
                }}
              >
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* About Section */}
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#000', marginBottom: '20px' }}>About This Service</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>
          David Smith's Driveway Sealing Service offers top-notch sealing solutions for your driveway. 
          Our system enables clients and contractors to communicate seamlessly, making the entire process efficient and hassle-free.
        </p>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', color: '#000', textAlign: 'center', marginBottom: '20px' }}>Features</h2>
        <ul 
          style={{ 
            fontSize: '1.1rem', 
            color: '#555', 
            lineHeight: '1.8', 
            maxWidth: '800px', 
            margin: '0 auto', 
            listStylePosition: 'inside' ,
            textAlign:'center'
          }}
        >
          <li>Safe and easy registration and login for both clients and contractors.</li>
          <li>Submit driveway sealing requests with detailed information and photos.</li>
          <li>Simplified quote creation and negotiation process for contractors.</li>
          <li>Monitor order progress and manage payments through user-friendly dashboards.</li>
          <li>Seamless communication between clients and contractors throughout the process.</li>
        </ul>
      </section>

      {/* Getting Started */}
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#000', marginBottom: '20px' }}>Getting Started</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>
        Sign up to get started! Clients can place requests and manage their orders,
         while contractors can review requests and handle negotiations seamlessly. Get started today!
        </p>
      </section>

      {/* Footer */}
      <footer 
        style={{ 
          textAlign: 'center', 
          padding: '10px 0', 
          borderTop: '1px solid #ddd', 
          backgroundColor: '#f5f5f5', 
          marginTop: '40px' 
        }}
      >
        <p style={{ fontSize: '0.9rem', color: '#777', margin: '0' }}>
          &copy; 2024 David Smith's Driveway Sealing Service. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

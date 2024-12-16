import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [creditCardInfo, setCreditCardInfo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Credit card info and phone number length validation
    if (creditCardInfo.length !== 16) {
      setError('Credit card info must be exactly 16 digits.');
      return;
    }

    if (phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5050/register', {
        first_name: firstName,
        last_name: lastName,
        address,
        credit_card_info: creditCardInfo,
        phone_number: phoneNumber,
        email,
        password,
      });
      if (res.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">Register</h2>

      <p style={{ textAlign: 'center', fontSize: '1rem', color: '#fff', marginBottom: '20px' }}>
        Note: David Smith is the contractor here.
      </p>

      <nav className="navigation">
        <ul className="nav-list">
          <li><Link to="/" className='menu-link-1'>Home</Link></li>
          <li><Link to="/login" className='menu-link-1'>Login</Link></li>
        </ul>
      </nav>

      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className='table-container'>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Credit Card Info:</label>
          <input
            type="text"
            value={creditCardInfo}
            onChange={(e) => setCreditCardInfo(e.target.value)}
            required
            maxLength="16"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            maxLength="10"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                marginLeft: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" className='button-quote'>Register</button>
      </form>
    </div>
  );
};

export default Register;

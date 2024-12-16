import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5050/login', { email, password });

      // Storing the token and additional user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('client_id', res.data.user.id);
      localStorage.setItem('first_name', res.data.user.first_name);
      localStorage.setItem('last_name', res.data.user.last_name);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('user_type', res.data.user.user_type);

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">Login</h2>

      <nav className="navigation">
        <ul className="nav-list">
          <li><Link to="/" className='menu-link-1'>Home</Link></li>
          <li><Link to="/register" className='menu-link-1'>Register</Link></li>
        </ul>
      </nav>

      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className='table-container'>
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
        <button type="submit" className='button-quote'>Login</button>
      </form>
    </div>
  );
};

export default Login;
